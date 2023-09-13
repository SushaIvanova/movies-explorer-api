const router = require('express').Router();
const { celebrate, Joi } = require('celebrate');
const { editProfile, getUserInfo } = require('../controllers/users');

router.get('/', getUserInfo);

router.patch('/', celebrate({
  body: Joi.object().keys({
    name: Joi.string().required().min(2).max(30),
    email: Joi.string().required().email(),
  }),
}), editProfile);

module.exports = router;
