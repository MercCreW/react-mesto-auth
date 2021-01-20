const router = require('express').Router();
const {
  signUp, signIn
} = require('../controllers/auth');

router.get('/', signIn);
router.get('/sign-up', signUp);

module.exports = router;
