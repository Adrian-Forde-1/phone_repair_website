const JWT = require('jsonwebtoken');
const { roles } = require('../util/roles');

//Modals
const User = require('../models/UserModel');
const Request = require('../models/RequestModel');
const TypeOfRepair = require('../models/TypeOfRepairModel');
const { jwt_secret } = require('../configuration/config');

const isEmpty = (string) => {
  if (string.trim() === '') return true;
  else return false;
};

const isEmail = (email) => {
  const emailRegEx = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  if (email.match(emailRegEx)) return true;
  else return false;
};

const signToken = (user) => {
  return JWT.sign(
    {
      iss: 'RequestResponseService',
      sub: user._id,
      iat: new Date().getTime(),
      exp: new Date().setDate(new Date().getDate() + 1),
    },
    jwt_secret
  );
};

exports.signUp = async function (req, res, next) {
  const { fname, lname, email, password, confirmPassword } = req.body.data;

  const foundUser = await User.findOne({ email });

  if (foundUser)
    return res.status(403).json({ errors: 'Email is already in use' });

  // Create new user
  const newUser = new User({
    fname,
    lname,
    email,
    password,
    role: roles.Customer,
  });

  let errors = {};

  if (isEmpty(newUser.fname)) {
    errors.fname = 'Must not be empty';
  }
  if (isEmpty(newUser.lname)) {
    errors.lname = 'Must not be empty';
  }
  if (isEmpty(newUser.password)) {
    errors.password = 'Must not be empty';
  }

  if (newUser.password.length < 6) {
    errors.password = 'Must be 6 or more characters long';
  }

  if (newUser.password !== confirmPassword)
    errors.confirmPassword = 'Passwords must match';

  if (isEmpty(newUser.email)) {
    errors.email = 'Must not be empty';
  } else if (!isEmail(newUser.email)) {
    errors.email = 'Must be a valid email address';
  }

  if (Object.keys(errors).length > 0) return res.status(400).json(errors);

  await newUser.save();

  //Generate token
  const token = signToken(newUser);

  res.json({ token });
};

exports.login = async (req, res) => {
  const token = signToken(req.user);

  res.json({ token });
};

exports.getUserInfo = (req, res) => {
  const token = req.headers.authorization;
  const splitToken = token.split('Bearer ')[1];
  const decodedToken = JWT.decode(splitToken);
  const userId = decodedToken.sub;

  User.findById(userId)
    .then((user) => {
      return res.json(user);
    })
    .catch((error) => {
      console.error(error);
      return res.status(404).json({ error: error });
    });
};

exports.getAllUserRequests = (req, res) => {
  if (req.params.userId) {
    const userId = req.params.userId;
    Request.find({ createdBy: userId }).then((requests) => {
      return res.json(requests);
    });
  }
};

exports.createRequest = async (req, res) => {
  if (req.user) {
    const { device, typeOfRepairs, description } = req.body;
    const usersname = req.user.fname + ' ' + req.user.lname;

    if (req.user.numberOfCurrentRequest !== 2) {
      let messages = {};
      let errors = {};
      const newRequest = new Request({
        usersname: usersname,
        device,
        typeOfRepairs,
        description,
        createdBy: req.user._id,
      });

      await newRequest.save().then(() => {
        Request.find({ createdBy: req.user._id }).then((requests) => {
          const number = requests.length;
          const currentRequestNumber = req.user.numberOfCurrentRequest + 1;
          User.findByIdAndUpdate(req.user._id, {
            numberOfRequestCreated: number,
            numberOfCurrentRequest: currentRequestNumber,
          })
            .then(() => {
              messages.request = 'Request successfully created';
              return res.json(messages);
            })
            .catch((error) => {
              errors.request = 'Opps! Something went wrong';
              console.error(error);
              return res.status(500).json(errors);
            });
        });
      });
    } else {
      let errors = {};
      errors.maxNumCurrentRequest =
        'You have reach the maximum number of current request';
      return res.status(400).json(errors);
    }
  } else {
    res.redirect('/user/login');
  }
};

exports.deleteRequest = (req, res) => {
  if (req.params.requestId) {
    const requestId = req.params.requestId;
    Request.findByIdAndDelete(requestId)
      .then((request) => {
        Request.find({ createdBy: req.user._id }).then((requests) => {
          const number = requests.length;
          const currentActiveRequestsAfterDeletion =
            req.user.numberOfCurrentRequest - 1;
          if (currentActiveRequestsAfterDeletion < 0)
            currentActiveRequestsAfterDeletion = 0;
          User.findByIdAndUpdate(
            { _id: req.user._id },
            {
              numberOfRequestCreated: number,
              numberOfCurrentRequest: currentActiveRequestsAfterDeletion,
            }
          )
            .then(() => {})
            .catch((error) => {
              console.error(error);
              return res.status(500).json({
                error: "Error when update user's number of requets created",
              });
            });
        });
        return res.json(request);
      })
      .catch((error) => {
        console.error(error);
        return res.status(500).json({ error: error });
      });
  }
};

exports.getUserRequests = (req, res) => {
  if (req.params.userId) {
    const userId = req.params.userId;
    Request.find({ createdBy: userId })
      .then((requests) => {
        return res.json(requests);
      })
      .catch((error) => {
        console.error(error);
        return res.status(400).json({ error: error });
      });
  } else {
    res.redirect('/user/login');
  }
};

exports.getIndividualRequest = (req, res) => {
  if (req.params.requestId) {
    const requestId = req.params.requestId;
    Request.findById(requestId).then((request) => {
      return res.json(request);
    });
  }
};

exports.getTypeOfRepairs = (req, res) => {
  if (req.params.deviceName) {
    const deviceName = req.params.deviceName;
    TypeOfRepair.find({ deviceName: deviceName }).then((types) => {
      return res.json(types);
    });
  } else {
    return res.status(400).json({ error: 'Types Not found for device' });
  }
};
