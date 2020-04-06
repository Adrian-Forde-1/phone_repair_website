//Passport Authorization
const router = require('express').Router();
//Passport Authorization
const passportConfig = require('../passport');
const passport = require('passport');
const passportLocal = passport.authenticate('local', { session: true });
const passportJWT = passport.authenticate('jwt', { session: true });

//Roles
const { roles, isUserAllowed } = require('../util/roles');

const {
  signUp,
  login,
  getUserInfo,
  createRequest,
  getUserRequests,
  deleteRequest,
  getTypeOfRepairs,
  getAllUserRequests,
  getIndividualRequest,
} = require('../controllers/userController');

router.post('/login', passportLocal, login);
router.post('/signup', signUp);
router.get(
  '/',
  passportJWT,
  isUserAllowed(roles.Owner, roles.Admin, roles.Customer),
  getUserInfo
);

router.post(
  '/request',
  passportJWT,
  isUserAllowed(roles.Customer),
  createRequest
);

router.delete(
  '/request/:requestId',
  passportJWT,
  isUserAllowed(roles.Customer),
  deleteRequest
);

router.get(
  '/:userId/request',
  passportJWT,
  isUserAllowed(roles.Customer),
  getUserRequests
);

router.get(
  '/request/:requestId',
  passportJWT,
  isUserAllowed(roles.Customer),
  getIndividualRequest
);

router.get(
  '/:userId/requests',
  passportJWT,
  isUserAllowed(roles.Customer),
  getAllUserRequests
);

router.get(
  '/:deviceName/typeOfRepairs',
  passportJWT,
  isUserAllowed(roles.Customer),
  getTypeOfRepairs
);

module.exports = router;
