const router = require('express').Router();
const auth = require('../middleware/auth');
const c = require('../controllers/auth.controller');

router.post('/register', c.register);
router.post('/login', c.login);
router.post('/refresh', c.refresh);
router.post('/logout', auth, c.logout);

module.exports = router;
