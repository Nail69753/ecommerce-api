const { validationResult } = require('express-validator');
const authService = require('../services/authService');

function register(req, res, next) {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(422).json({ errors: errors.array() });
  }
  try {
    const { name, email, password } = req.body;
    const user = authService.register(name, email, password);
    res.status(201).json({ message: 'User registered successfully.', user });
  } catch (err) {
    next(err);
  }
}

function login(req, res, next) {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(422).json({ errors: errors.array() });
  }
  try {
    const { email, password } = req.body;
    const result = authService.login(email, password);
    res.status(200).json(result);
  } catch (err) {
    next(err);
  }
}

module.exports = { register, login };