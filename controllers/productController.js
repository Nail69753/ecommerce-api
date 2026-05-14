const { validationResult } = require('express-validator');
const svc = require('../services/productService');

function listProducts(req, res, next)  { try { res.json(svc.listProducts()); } catch(e) { next(e); } }
function getProduct(req, res, next)    { try { res.json(svc.getProduct(Number(req.params.id))); } catch(e) { next(e); } }

function createProduct(req, res, next) {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.status(422).json({ errors: errors.array() });
    res.status(201).json(svc.createProduct(req.body));
  } catch(e) { next(e); }
}

function updateProduct(req, res, next) {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.status(422).json({ errors: errors.array() });
    res.json(svc.updateProduct(Number(req.params.id), req.body));
  } catch(e) { next(e); }
}

function deleteProduct(req, res, next) {
  try { svc.deleteProduct(Number(req.params.id)); res.status(204).send(); } catch(e) { next(e); }
}

module.exports = { listProducts, getProduct, createProduct, updateProduct, deleteProduct };
