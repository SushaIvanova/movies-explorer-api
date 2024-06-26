const router = require('express').Router();

const usersRouter = require('./users');
const moviesRouter = require('./movies');
const signupRouter = require('./signup');
const signinRouter = require('./signin');
const auth = require('../middlewares/auth');
const unknownRouter = require('./unknown');

router.use('/signup', signupRouter);
router.use('/signin', signinRouter);
router.use(auth);
router.use('/users/me', usersRouter);
router.use('/movies', moviesRouter);

router.use('*', unknownRouter);

module.exports = router;
