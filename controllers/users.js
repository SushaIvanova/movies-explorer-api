const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const mongoose = require('mongoose');
const UserModel = require('../models/user');
const httpConstants = require('../constants/errors');
const BadRequestError = require('../errors/BadRequestError');
const NotFoundError = require('../errors/NotFoundError');
const ConflictError = require('../errors/ConflictError');

const { NODE_ENV, JWT_KEY } = process.env;

module.exports.getUserInfo = (req, res, next) => {
  UserModel.findById(req.user._id)
    .then((user) => res.status(httpConstants.HTTP_STATUS_OK).send(user))
    .catch(next);
};

module.exports.editProfile = (req, res, next) => {
  const { name, email } = req.body;
  return UserModel.findByIdAndUpdate(
    req.user._id,
    { name, email },
    {
      new: true,
      runValidators: true,
    },
  )
    .then((user) => {
      if (!user) {
        throw new NotFoundError('Пользователь не найден');
      }
      res.status(httpConstants.HTTP_STATUS_OK).send(user);
    })
    .catch((error) => {
      if (error instanceof mongoose.Error.ValidationError) {
        next(new BadRequestError('Некорректный формат данных'));
      } else if (error.code === 11000) {
        next(new ConflictError('Такой пользователь уже существует'));
      } else {
        next(error);
      }
    });
};

module.exports.createUser = (req, res, next) => {
  const {
    name, about, avatar, email, password,
  } = req.body;
  bcrypt.hash(password, 10)
    .then((hash) => UserModel.create({
      name,
      about,
      avatar,
      email,
      password: hash,
    })
      .then((user) => {
        res.status(httpConstants.HTTP_STATUS_CREATED).send({
          name: user.name, about: user.about, avatar: user.avatar, email: user.email, _id: user._id,
        });
      })
      .catch((error) => {
        if (error.code === 11000) {
          next(new ConflictError('Такой пользователь уже существует'));
        } else if (error instanceof mongoose.Error.ValidationError) {
          next(new BadRequestError('Некорректный формат данных'));
        } else {
          next(error);
        }
      }));
};

module.exports.login = (req, res, next) => {
  const { email, password } = req.body;
  return UserModel.findUserByCredentials(email, password)
    .then((user) => {
      const token = jwt.sign({ _id: user._id }, NODE_ENV === 'production' ? JWT_KEY : 'some-secret-key', { expiresIn: '7d' });
      res.send({ token });
    })
    .catch((err) => {
      next(err);
    });
};
