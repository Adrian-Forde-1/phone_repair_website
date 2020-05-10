//Modals
const User = require('../models/UserModel');
const Request = require('../models/RequestModel');
const Device = require('../models/DeviceModel');
const TypeOfRepair = require('../models/TypeOfRepairModel');

exports.getUser = (req, res) => {
  if (req.params.userId) {
    User.findById(req.params.userId)
      .then((user) => {
        return res.json(user);
      })
      .catch((error) => {
        console.error(error);
        return res.status(500).json({ error: error });
      });
  } else {
    return res.status(404).json({ error: 'User not found' });
  }
};

exports.getAllUsers = (req, res) => {
  User.find()
    .then((users) => {
      return res.json(users);
    })
    .catch((error) => {
      console.error(error);
      return res.status(500).json({ error: error });
    });
};

exports.getRequest = (req, res) => {
  if (req.params.requestId) {
    const requestId = req.params.requestId;
    Request.findById(requestId)
      .populate('createdBy')
      .then((request) => {
        return res.json(request);
      })
      .catch((error) => {
        console.error(error);
        return res.status(500).json({ error: error });
      });
  } else {
    return res.status(404).json({ error: 'Request not found' });
  }
};

exports.getAllRequests = (req, res) => {
  Request.find()
    .populate('createdBy')
    .then((requests) => {
      return res.json(requests);
    })
    .catch((error) => {
      console.error(error);
      return res.status(500).json({ error: error });
    });
};

exports.deleteRequest = (req, res) => {
  if (req.params.requestId) {
    let messages = {};
    let errors = {};
    const requestId = req.parmas.requestId;
    Request.findByIdAndDelete(requestId)
      .then((request) => {
        messages.request = 'Request successfully deleted';
        return res.json(messages);
      })
      .catch((error) => {
        errors.request = 'Something went wrong when deleting request';
        console.error(error);
        return res.status(500).json(errors);
      });
  } else {
    let errors = {};
    errors.opps = 'Opps! Something went wrong';
    return res.status(404).json(errors);
  }
};

exports.changeRequestStatus = (req, res) => {
  if (req.params.requestId) {
    let errors = {};
    const requestId = req.params.requestId;
    const status = req.body.status;

    //Update the request's status
    Request.findByIdAndUpdate(requestId, { status: status }).exec(function (
      err,
      request
    ) {
      //Error occured? Notify User
      if (err) {
        errors.request = 'Opps! Something went wrong';
        return res.status(500).json(errors);
      }

      if (status === 'Completed') {
        //If the request is completed, remove one from user active requests
        User.findById(request.createdBy).exec(function (err, user) {
          //Error occured? Notify User
          if (err) {
            error.request =
              'Error occured updating user with new request information';
            return res.status(500).json(errors);
          }
          //Minus one from user's current requests
          var numberOfCurrentRequest =
            parseInt(user.numberOfCurrentRequest) - 1;

          //Cast the numberOfCurrentRequest to an int again because I had some errors in
          //the past
          numberOfCurrentRequest = parseInt(numberOfCurrentRequest);

          //If the user's numberOfCurrentRequest is less than zero, make it zero
          if (numberOfCurrentRequest < 0) numberOfCurrentRequest = 0;

          //Update the user with the current number of requests
          User.findByIdAndUpdate(user._id, {
            numberOfCurrentRequest: numberOfCurrentRequest,
          }).exec(function (err, user) {
            //Error occured? Notify User
            if (err) {
              error.request =
                "Error occured updating user's current active requests";
              return res.status(500).json(errors);
            }

            //Return the requests
            request.status = status;
            return res.json(request);
          });
        });
      } else {
        //Return the requests
        request.status = status;
        return res.json(request);
      }
    });
  } else {
    let errors = {};
    errors.request = 'Request not found';
    return res.status(404).json(errors);
  }
};

exports.createDevice = async (req, res) => {
  let errors = {};
  let messages = {};
  Device.find().then((devices) => {
    const hasDevice = devices.some(
      (device) => device.name.toLowerCase() === req.body.device.toLowerCase()
    );

    if (hasDevice === true) {
      errors.device = 'Device already exists';
      return res.status(400).json(errors);
    } else {
      if (req.body.device) {
        const newDevice = new Device({
          name: req.body.device,
          createdBy: req.user._id,
        });

        newDevice.save().then((device) => {
          messages.device = 'Device successfully created';
          if (req.body.typeOfRepairs.length === 0) {
            return res.json(messages);
          } else {
            console.log('Has type of repairs');
            console.log(req.body.typeOfRepairs);
            messages.typeOfRepair = 'Type of repair(s) successfully added';
            req.body.typeOfRepairs.forEach((repair) => {
              const newRepair = TypeOfRepair({
                name: repair.name,
                cost: repair.cost,
                device: device._id,
                deviceName: device.name,
                createdBy: req.user._id,
              });

              newRepair.save();
            });
            return res.json(messages);
          }
        });
      }
    }
  });
};

exports.getDevice = (req, res) => {
  if (req.params.deviceId) {
    const deviceId = req.parmas.deviceId;
    Device.findById(deviceId)
      .populate('createdBy')
      .then((device) => {
        return res.json(device);
      })
      .catch((error) => {
        console.error(error);
        return res.status(500).json({ error: error });
      });
  } else {
    return res.status(404).json({ error: 'Device not found' });
  }
};

exports.getAllDevices = (req, res) => {
  Device.find()
    .populate('createdBy')
    .then((devices) => {
      return res.json(devices);
    })
    .catch((error) => {
      console.error(error);
      return res.status(500).json({ error: error });
    });
};

exports.deleteDevice = (req, res) => {
  if (req.params.deviceId) {
    const deviceId = req.params.deviceId;
    Device.findByIdAndDelete(deviceId)
      .then((device) => {
        TypeOfRepair.find().then((types) => {
          types.forEach((type) => {
            if (type.device.toString() == device._id.toString()) {
              TypeOfRepair.findByIdAndDelete(type._id)
                .then()
                .catch((error) => {
                  let errors = {};
                  errors.typeOfRepair =
                    'Something went wrong when removing type of repair';
                  console.error(error);
                  return res.status(500).json(errors);
                });
            }
          });
          let messages = {};
          messages.device = 'Device successfully deleted';
          return res.json(messages);
        });
      })
      .catch((error) => {
        let errors = {};
        errors.device = 'Something went wrong when deleting device';
        console.error(error);
        return res.status(500).json(errors);
      });
  } else {
    let errors = {};
    errors.device = 'Device not found';
    return res.status(404).json(errors);
  }
};

//Type Of Repair
exports.getTypeOfRepairs = (req, res) => {
  if (req.params.deviceId) {
    const deviceId = req.params.deviceId;
    TypeOfRepair.find({ device: deviceId })
      .then((types) => {
        return res.json(types);
      })
      .catch((error) => {
        console.error(error);
        return res.status(500).json({ error: error });
      });
  } else {
    return res.status(400).json({ error: 'Device id not found' });
  }
};

exports.deleteTypeOfRepair = (req, res) => {
  let errors = {};
  let messages = {};
  if (req.params.typeOfRepairId) {
    const typeOfRepairId = req.params.typeOfRepairId;
    TypeOfRepair.findByIdAndDelete(typeOfRepairId)
      .then((type) => {
        messages.typeOfRepair = 'Type of repair successfully deleted';
        return res.json(messages);
      })
      .catch((error) => {
        console.error(error);
        errors.typeOfRepair =
          'Something went wrong when deleting type of repair';
        return res.status(500).json(errors);
      });
  } else {
    errors.typeOfRepair = 'Type of repair no found';
    return res.status(400).json(errors);
  }
};

exports.updateTypeOfRepair = (req, res) => {
  if (req.params.typeOfRepairId) {
    let messages = {};
    let errors = {};
    const typeOfRepairId = req.params.typeOfRepairId;
    TypeOfRepair.findByIdAndUpdate(
      { _id: typeOfRepairId },
      {
        name: req.body.typeOfRepair.name,
        cost: req.body.typeOfRepair.cost,
      }
    )
      .then(() => {
        messages.typeOfRepair = 'Type of repair(s) successfully updated';
        return res.json(messages);
      })
      .catch((error) => {
        console.error(error);
        errors.typeOfRepair =
          'Something went wrong when updating type of repair(s)';
        return res.status(500).json(errors);
      });
  }
};

exports.createTypeOfRepairs = (req, res) => {
  if (req.params.deviceId) {
    let messages = {};
    let errors = {};
    const deviceId = req.params.deviceId;
    const newTypeOfRepair = new TypeOfRepair({
      name: req.body.data.name,
      cost: req.body.data.cost,
      device: deviceId,
      deviceName: req.body.deviceName,
      createdBy: req.user._id,
    });

    newTypeOfRepair
      .save()
      .then(() => {
        messages.typeOfRepair = 'Type of repair(s) successfully added';
        return res.json(messages);
      })
      .catch((error) => {
        console.error(error);
        errors.typeOfRepair =
          'Something went wrong when adding type of repair(s)';
        return res.status(500).json(errors);
      });
  } else {
    let errors = {};
    errors.opps = 'Opps! Something went wrong';
    return res.status(400).json(errors);
  }
};
