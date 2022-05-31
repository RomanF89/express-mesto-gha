const router = require('express').Router();
const {
  createUser,
  getUser,
  getUsers,
  upadateProfile,
  updateAvatar,
} = require('../controllers/users');

router.get('/', getUsers);
router.get('/:userId', getUser);
router.post('', createUser);
router.patch('/me', upadateProfile);
router.patch('/me/avatar', updateAvatar);

module.exports.userRouter = router;
