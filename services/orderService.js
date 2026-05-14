const { data, save, nextId } = require('../data/db');

function withItems(order) {
  return {
    ...order,
    items: data.order_items
      .filter(oi => oi.order_id === order.id)
      .map(oi => ({ ...oi, product_name: (data.products.find(p => p.id === oi.product_id) || {}).name || '(deleted)' })),
  };
}

function _get(id, userId) {
  const o = data.orders.find(o => o.id === id);
  if (!o) { const e = new Error('Order not found');  e.status = 404; throw e; }
  if (o.user_id !== userId) { const e = new Error('Forbidden'); e.status = 403; throw e; }
  return o;
}

function listOrders(userId) {
  return data.orders.filter(o => o.user_id === userId).sort((a,b) => b.id - a.id).map(withItems);
}

function getOrder(id, userId) { return withItems(_get(id, userId)); }

function createOrder(userId, items) {
  if (!items || !items.length) { const e = new Error('Order must contain at least one item'); e.status = 422; throw e; }

  let total = 0;
  const resolved = [];
  for (const item of items) {
    const p = data.products.find(p => p.id === item.product_id);
    if (!p) { const e = new Error(`Product ${item.product_id} not found`); e.status = 404; throw e; }
    if (p.stock < item.quantity) { const e = new Error(`Insufficient stock for "${p.name}" (available: ${p.stock})`); e.status = 422; throw e; }
    total += p.price * item.quantity;
    resolved.push({ product_id: item.product_id, quantity: item.quantity, unit_price: p.price, ref: p });
  }

  const now = new Date().toISOString();
  const order = { id: nextId('orders'), user_id: userId, status: 'pending', total_price: Math.round(total * 100) / 100, created_at: now, updated_at: now };
  data.orders.push(order);
  for (const it of resolved) {
    data.order_items.push({ id: nextId('order_items'), order_id: order.id, product_id: it.product_id, quantity: it.quantity, unit_price: it.unit_price });
    it.ref.stock -= it.quantity;
  }
  save();
  return withItems(order);
}

function updateOrderStatus(id, userId, status) {
  const o = _get(id, userId);
  o.status = status;
  o.updated_at = new Date().toISOString();
  save();
  return withItems(o);
}

function deleteOrder(id, userId) {
  const order = withItems(_get(id, userId));
  if (order.status !== 'pending') { const e = new Error('Only pending orders can be cancelled'); e.status = 422; throw e; }
  for (const it of order.items) { const p = data.products.find(p => p.id === it.product_id); if (p) p.stock += it.quantity; }
  data.orders = data.orders.filter(o => o.id !== id);
  data.order_items = data.order_items.filter(oi => oi.order_id !== id);
  save();
}

module.exports = { listOrders, getOrder, createOrder, updateOrderStatus, deleteOrder };
