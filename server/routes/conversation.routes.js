const router = require('express').Router();
const auth = require('../middleware/auth');
const c = require('../controllers/conversation.controller');

router.use(auth);
router.get('/', c.listMine);
router.post('/', c.create);
router.get('/:id/messages', c.listMessages);
router.post('/:id/messages', c.sendMessage);
router.patch('/:id/read', c.markRead);

module.exports = router;
