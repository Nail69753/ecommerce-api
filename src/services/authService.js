const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const db = require('../models/db');

function register(name, email, password) {
  const existing = db.findUserByEmail(email);
  if (existing) {
    throw Object.assign(new Error('Email already in use.'), { status: 409 });
  }
  const hashed = bcrypt.hashSync(password, 10);
  const user = db.createUser({ name, email, password: hashed });
  return { id: user.id, name: user.name, email: user.email };
}

function login(email, password) {
  const user = db.findUserByEmail(email);
  if (!user || !bcrypt.compareSync(password, user.password)) {
    throw Object.assign(new Error('Invalid email or password.'), { status: 401 });
  }
  const token = jwt.sign(
    { id: user.id, email: user.email },
    process.env.JWT_SECRET,
    { expiresIn: '24h' }
  );
  return { token, user: { id: user.id, name: user.name, email: user.email } };
}

module.exports = { register, login };