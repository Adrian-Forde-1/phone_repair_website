const router = require('express').Router();
//Passport Authorization
const passportConfig = require('../passport');
const passport = require('passport');
const passportLocal = passport.authenticate('local', { session: true });
const passportJWT = passport.authenticate('jwt', { session: true });

//Roles
const { roles, isUserAllowed } = require('../util/roles');

//Controllers
const {
  getUser,
  getAllUsers,
  getRequest,
  getAllRequests,
  deleteRequest,
  getDevice,
  getAllDevices,
  deleteDevice,
  changeRequestStatus,
  createDevice,
  getTypeOfRepairs,
  deleteTypeOfRepair,
  updateTypeOfRepair,
  createTypeOfRepairs
} = require('../controllers/apiController');

//Users
router.get(
  '/user/:userId',
  passportJWT,
  isUserAllowed(roles.Owner, roles.Admin),
  getUser
);

router.get(
  '/users',
  passportJWT,
  isUserAllowed(roles.Owner, roles.Admin),
  getAllUsers
);

//Requests
router.get(
  '/request/:requestId',
  passportJWT,
  isUserAllowed(roles.Owner, roles.Admin),
  getRequest
);

router.get(
  '/requests',
  passportJWT,
  isUserAllowed(roles.Owner, roles.Admin),
  getAllRequests
);

router.delete(
  '/request/:requestId',
  passportJWT,
  isUserAllowed(roles.Owner, roles.Admin),
  deleteRequest
);

router.post(
  '/request/:requestId/status',
  passportJWT,
  isUserAllowed(roles.Owner, roles.Admin),
  changeRequestStatus
);

//Devices
router.post(
  '/device',
  passportJWT,
  isUserAllowed(roles.Owner, roles.Admin),
  createDevice
);

router.get(
  '/devices',
  passportJWT,
  isUserAllowed(roles.Owner, roles.Admin),
  getAllDevices
);
router.get(
  '/devices/:deviceId',
  passportJWT,
  isUserAllowed(roles.Owner, roles.Admin),
  getDevice
);
router.delete(
  '/device/:deviceId',
  passportJWT,
  isUserAllowed(roles.Owner),
  deleteDevice
);

//Type Of Repairs
router.get(
  '/typeOfRepairs/:deviceId',
  passportJWT,
  isUserAllowed(roles.Admin, roles.Owner),
  getTypeOfRepairs
);

router.post(
  '/:deviceId/typeOfRepair/create',
  passportJWT,
  isUserAllowed(roles.Admin, roles.Owner),
  createTypeOfRepairs
);

router.delete(
  '/typeOfRepair/:typeOfRepairId',
  passportJWT,
  isUserAllowed(roles.Admin, roles.Owner),
  deleteTypeOfRepair
);

router.post(
  '/typeOfRepair/:typeOfRepairId/update',
  passportJWT,
  isUserAllowed(roles.Admin, roles.Owner),
  updateTypeOfRepair
);

module.exports = router;
