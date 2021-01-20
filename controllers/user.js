const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/user');

class NotFoundError extends Error {
  constructor(message) {
    super(message);
    this.status = 404;
  }
}

module.exports.login = (req, res) => {
  const { email, password } = req.body;

  return User.findUserByCredentials(email, password)
    .then((user) => {
      const token = jwt.sign({ _id: user._id }, 'some-secret-key');
      res.send({ token });
    })
    .catch((err) => {
      res
        .status(401)
        .send({ message: err.message });
    });
};

module.exports.getUserById = (req, res) => {
  User.findById(req.params.id)
    .orFail(new NotFoundError(`Пользователь c id: ${req.user._id} не найден`))
    .then((user) => {
      res.status(200).json({ data: user });
    })
    .catch((err) => {
      if (err.status === 404) {
        return res.status(404).send({ message: err.message });
      }
      if (err.name === 'CastError') {
        return res.status(400).send({ message: 'Переданы некорректные данные' });
      }
      res.status(500).json({ message: err.message });
    });
};

module.exports.getUsers = (req, res) => {
  User.find({})
    .then((user) => res.status(200)({ data: user }))
    .catch((err) => res.status(500).json({ message: err.message }));
};

module.exports.createUser = (req, res) => {
  const {
    name, about, avatar, email, password,
  } = req.body;
  User.create({
    name, about, avatar, email, password,
  })
    .then((user) => res.status(200).json({ data: user }))
    .catch((err) => {
      if (err.name === 'ValidatorError') {
        res.status(400).json({ message: 'Переданы некорректные данные в методы создания пользователя' });
      } else {
        res.status(500).json({ message: err.message });
      }
    });
};

module.exports.updateProfileUser = (req, res) => {
  const { name, about } = req.body;
  User.findByIdAndUpdate(req.user._id, { name, about })
    .then((user) => {
      if (!user) return res.status(404).send({ message: `Пользователь c id: ${req.user._id} не найден` });
      res.status(200).json({ data: user });
    })
    .catch((err) => {
      if (err.name === 'ValidatorError' || err.name === 'CastError') {
        res.status(400).json({ message: 'Переданы некорректные данные в методы обновления профиля' });
      } else {
        res.status(500).json({ message: err.message });
      }
    });
};

module.exports.updateAvatarUser = (req, res) => {
  const { avatar } = req.body;
  User.findByIdAndUpdate(req.user._id, { avatar })
    .then((user) => {
      if (!user) return res.status(404).send({ message: `Пользователь c id: ${req.user._id} не найден` });
      res.status(200).json({ data: user });
    })
    .catch((err) => {
      if (err.name === 'ValidatorError' || err.name === 'CastError') {
        res.status(400).json({ message: 'Переданы некорректные данные в методы обновления профиля' });
      } else {
        res.status(500).json({ message: err.message });
      }
    });
};
