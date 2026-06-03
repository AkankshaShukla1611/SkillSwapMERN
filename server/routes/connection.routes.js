const router = require('express').Router();
const auth = require('../middleware/auth');
const c = require('../controllers/connection.controller');

router.use(auth);
router.get('/', c.list);
router.post('/', c.send);
router.patch('/:id', c.act);
router.delete('/:id', c.remove);

module.exports = router;
