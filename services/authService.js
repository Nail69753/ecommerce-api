const bcrypt = require('bcryptjs');
const jwt    = require('jsonwebtoken');
const { data, save, nextId } = require('../data/db');

function register(username, email, password) {
  if (data.users.find(u => u.email === email || u.username === username)) {
    const err = new Error('Username or email already taken');
    err.status = 422;
    throw err;
  }
  const user = { id: nextId('users'), username, email, password_hash: bcrypt.hashSync(password, 10), created_at: new Date().toISOString() };
  data.users.push(user);
  save();
  return { id: user.id, username, email };
}

function login(email, password) {
  const user = data.users.find(u => u.email === email);
  if (!user || !bcrypt.compareSync(password, user.password_hash)) {
    const err = new Error('Invalid email or password');
    err.status = 401;
    throw err;
  }
  const token = jwt.sign({ id: user.id, username: user.username, email: user.email }, process.env.JWT_SECRET, { expiresIn: '24h' });
  return { token, user: { id: user.id, username: user.username, email: user.email } };
}

module.exports = { register, login };
