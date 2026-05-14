const { validationResult } = require('express-validator');
const svc = require('../services/orderService');

function listOrders(req, res, next)  { try { res.json(svc.listOrders(req.user.id)); } catch(e) { next(e); } }
function getOrder(req, res, next)    { try { res.json(svc.getOrder(Number(req.params.id), req.user.id)); } catch(e) { next(e); } }

function createOrder(req, res, next) {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.status(422).json({ errors: errors.array() });
    res.status(201).json(svc.createOrder(req.user.id, req.body.items));
  } catch(e) { next(e); }
}

function updateOrder(req, res, next) {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.status(422).json({ errors: errors.array() });
    res.json(svc.updateOrderStatus(Number(req.params.id), req.user.id, req.body.status));
  } catch(e) { next(e); }
}

function deleteOrder(req, res, next) {
  try { svc.deleteOrder(Number(req.params.id), req.user.id); res.status(204).send(); } catch(e) { next(e); }
}

module.exports = { listOrders, getOrder, createOrder, updateOrder, deleteOrder };
