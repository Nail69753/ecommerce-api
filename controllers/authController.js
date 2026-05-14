const { validationResult } = require('express-validator');
const svc = require('../services/authService');

function register(req, res, next) {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.status(422).json({ errors: errors.array() });
    res.status(201).json({ message: 'User registered successfully', user: svc.register(req.body.username, req.body.email, req.body.password) });
  } catch(e) { next(e); }
}

function login(req, res, next) {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.status(422).json({ errors: errors.array() });
    res.json(svc.login(req.body.email, req.body.password));
  } catch(e) { next(e); }
}

module.exports = { register, login };
