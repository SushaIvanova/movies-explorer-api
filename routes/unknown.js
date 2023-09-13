const router = require('express').Router();
const NotFoundError = require('../errors/NotFoundError');

router.all('*', (req, res, next) => {
  next(new NotFoundError('Страница не найдена'));
});

module.exports = router;
