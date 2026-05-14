const db = require('../models/db');

function getAllProducts() {
  return db.getAllProducts();
}

function getProductById(id) {
  const product = db.findProductById(id);
  if (!product) {
    throw Object.assign(new Error('Product not found.'), { status: 404 });
  }
  return product;
}

function createProduct({ name, description, price, stock }) {
  return db.createProduct({ name, description, price, stock });
}

function updateProduct(id, fields) {
  getProductById(id);
  const allowed = ['name', 'description', 'price', 'stock'];
  const updates = Object.keys(fields).filter(k => allowed.includes(k));
  if (updates.length === 0) {
    throw Object.assign(new Error('No valid fields to update.'), { status: 422 });
  }
  return db.updateProduct(id, fields);
}

function deleteProduct(id) {
  getProductById(id);
  db.deleteProduct(id);
  return { message: 'Product deleted successfully.' };
}

module.exports = { getAllProducts, getProductById, createProduct, updateProduct, deleteProduct };