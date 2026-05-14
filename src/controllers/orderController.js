const { validationResult } = require('express-validator');
const orderService = require('../services/orderService');

function getAll(req, res, next) {
  try {
    res.status(200).json(orderService.getOrdersByUser(req.user.id));
  } catch (err) { next(err); }
}

function getOne(req, res, next) {
  try {
    res.status(200).json(orderService.getOrderById(Number(req.params.id), req.user.id));
  } catch (err) { next(err); }
}

function create(req, res, next) {
  const errors = validationResult(req);
  if (!errors.isEmpty()) return res.status(422).json({ errors: errors.array() });
  try {
    res.status(201).json(orderService.createOrder(req.user.id, req.body.items));
  } catch (err) { next(err); }
}

function update(req, res, next) {
  const errors = validationResult(req);
  if (!errors.isEmpty()) return res.status(422).json({ errors: errors.array() });
  try {
    res.status(200).json(orderService.updateOrderStatus(Number(req.params.id), req.user.id, req.body.status));
  } catch (err) { next(err); }
}

function remove(req, res, next) {
  try {
    res.status(200).json(orderService.deleteOrder(Number(req.params.id), req.user.id));
  } catch (err) { next(err); }
}

module.exports = { getAll, getOne, create, update, remove };