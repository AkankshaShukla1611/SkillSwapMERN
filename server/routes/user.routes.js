const router = require('express').Router();
const auth = require('../middleware/auth');
const upload = require('../middleware/upload');
const c = require('../controllers/user.controller');

router.get('/me', auth, c.me);
router.patch('/me', auth, c.updateMe);
router.post('/me/avatar', auth, upload.single('avatar'), c.uploadAvatar);
router.get('/search', auth, c.search);
router.get('/', auth, c.list);
router.get('/:id', auth, c.getById);

module.exports = router;
