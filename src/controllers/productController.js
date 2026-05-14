const { validationResult } = require('express-validator');
const productService = require('../services/productService');

function getAll(req, res, next) {
  try {
    res.status(200).json(productService.getAllProducts());
  } catch (err) { next(err); }
}

function getOne(req, res, next) {
  try {
    res.status(200).json(productService.getProductById(Number(req.params.id)));
  } catch (err) { next(err); }
}

function create(req, res, next) {
  const errors = validationResult(req);
  if (!errors.isEmpty()) return res.status(422).json({ errors: errors.array() });
  try {
    res.status(201).json(productService.createProduct(req.body));
  } catch (err) { next(err); }
}

function update(req, res, next) {
  try {
    res.status(200).json(productService.updateProduct(Number(req.params.id), req.body));
  } catch (err) { next(err); }
}

function remove(req, res, next) {
  try {
    res.status(200).json(productService.deleteProduct(Number(req.params.id)));
  } catch (err) { next(err); }
}

module.exports = { getAll, getOne, create, update, remove };