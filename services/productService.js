const { data, save, nextId } = require('../data/db');

function _find(id) {
  const p = data.products.find(p => p.id === id);
  if (!p) { const e = new Error('Product not found'); e.status = 404; throw e; }
  return p;
}

function listProducts()           { return [...data.products].sort((a,b) => a.id - b.id); }
function getProduct(id)           { return _find(id); }

function createProduct({ name, description, price, stock }) {
  const now = new Date().toISOString();
  const p = { id: nextId('products'), name, description: description || null, price, stock: stock ?? 0, created_at: now, updated_at: now };
  data.products.push(p);
  save();
  return p;
}

function updateProduct(id, fields) {
  const p = _find(id);
  if (fields.name        !== undefined) p.name        = fields.name;
  if (fields.description !== undefined) p.description = fields.description;
  if (fields.price       !== undefined) p.price       = fields.price;
  if (fields.stock       !== undefined) p.stock       = fields.stock;
  p.updated_at = new Date().toISOString();
  save();
  return p;
}

function deleteProduct(id) {
  const idx = data.products.findIndex(p => p.id === id);
  if (idx === -1) { const e = new Error('Product not found'); e.status = 404; throw e; }
  data.products.splice(idx, 1);
  save();
}

module.exports = { listProducts, getProduct, createProduct, updateProduct, deleteProduct };
