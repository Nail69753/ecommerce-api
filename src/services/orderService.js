const db = require('../models/db');

function getOrdersByUser(userId) {
  return db.getOrdersByUser(userId);
}

function getOrderById(id, userId) {
  const order = db.findOrderById(id, userId);
  if (!order) {
    throw Object.assign(new Error('Order not found.'), { status: 404 });
  }
  return order;
}

function createOrder(userId, items) {
  if (!items || items.length === 0) {
    throw Object.assign(new Error('Order must contain at least one item.'), { status: 422 });
  }
  return db.createOrder(userId, items);
}

function updateOrderStatus(id, userId, status) {
  getOrderById(id, userId);
  const valid = ['pending', 'confirmed', 'shipped', 'delivered', 'cancelled'];
  if (!valid.includes(status)) {
    throw Object.assign(new Error(`Invalid status. Must be one of: ${valid.join(', ')}`), { status: 422 });
  }
  return db.updateOrderStatus(id, userId, status);
}

function deleteOrder(id, userId) {
  getOrderById(id, userId);
  db.deleteOrder(id, userId);
  return { message: 'Order deleted successfully.' };
}

module.exports = { getOrdersByUser, getOrderById, createOrder, updateOrderStatus, deleteOrder };