const fs = require('fs');
const path = require('path');
require('dotenv').config();

const DB_PATH = process.env.DB_PATH || path.join(__dirname, '../../data.json');

const DEFAULT_STATE = {
  users: [],
  products: [],
  orders: [],
  order_items: [],
  _counters: { users: 0, products: 0, orders: 0, order_items: 0 }
};

function load() {
  try {
    if (fs.existsSync(DB_PATH)) {
      return JSON.parse(fs.readFileSync(DB_PATH, 'utf8'));
    }
  } catch (e) {}
  return JSON.parse(JSON.stringify(DEFAULT_STATE));
}

function save(state) {
  fs.writeFileSync(DB_PATH, JSON.stringify(state, null, 2));
}

function nextId(state, table) {
  state._counters[table] = (state._counters[table] || 0) + 1;
  return state._counters[table];
}

const db = {
  load, save, nextId,
  findUserByEmail(email) { return load().users.find(u => u.email === email) || null; },
  findUserById(id) { return load().users.find(u => u.id === id) || null; },
  createUser({ name, email, password }) {
    const state = load();
    const user = { id: nextId(state, 'users'), name, email, password, created_at: new Date().toISOString() };
    state.users.push(user);
    save(state);
    return user;
  },
  getAllProducts() { return load().products.sort((a, b) => b.id - a.id); },
  findProductById(id) { return load().products.find(p => p.id === id) || null; },
  createProduct({ name, description, price, stock }) {
    const state = load();
    const product = { id: nextId(state, 'products'), name, description: description || null, price, stock: stock ?? 0, created_at: new Date().toISOString(), updated_at: new Date().toISOString() };
    state.products.push(product);
    save(state);
    return product;
  },
  updateProduct(id, fields) {
    const state = load();
    const idx = state.products.findIndex(p => p.id === id);
    if (idx === -1) return null;
    ['name', 'description', 'price', 'stock'].forEach(k => { if (fields[k] !== undefined) state.products[idx][k] = fields[k]; });
    state.products[idx].updated_at = new Date().toISOString();
    save(state);
    return state.products[idx];
  },
  deleteProduct(id) {
    const state = load();
    state.products = state.products.filter(p => p.id !== id);
    save(state);
  },
  getOrdersByUser(userId) {
    const state = load();
    return state.orders.filter(o => o.user_id === userId).sort((a, b) => b.id - a.id)
      .map(o => ({ ...o, items: state.order_items.filter(i => i.order_id === o.id).map(i => ({ ...i, product_name: (state.products.find(p => p.id === i.product_id) || {}).name })) }));
  },
  findOrderById(id, userId) {
    const state = load();
    const order = state.orders.find(o => o.id === id && o.user_id === userId);
    if (!order) return null;
    return { ...order, items: state.order_items.filter(i => i.order_id === id).map(i => ({ ...i, product_name: (state.products.find(p => p.id === i.product_id) || {}).name })) };
  },
  createOrder(userId, items) {
    const state = load();
    let total = 0;
    const resolved = [];
    for (const item of items) {
      const pidx = state.products.findIndex(p => p.id === item.product_id);
      if (pidx === -1) throw Object.assign(new Error(`Product ${item.product_id} not found.`), { status: 404 });
      if (state.products[pidx].stock < item.quantity) throw Object.assign(new Error(`Insufficient stock for "${state.products[pidx].name}".`), { status: 422 });
      total += state.products[pidx].price * item.quantity;
      resolved.push({ ...item, unit_price: state.products[pidx].price });
    }
    const order = { id: nextId(state, 'orders'), user_id: userId, status: 'pending', total, created_at: new Date().toISOString(), updated_at: new Date().toISOString() };
    state.orders.push(order);
    const orderItems = resolved.map(item => {
      const oi = { id: nextId(state, 'order_items'), order_id: order.id, ...item };
      const pidx = state.products.findIndex(p => p.id === item.product_id);
      state.products[pidx].stock -= item.quantity;
      return oi;
    });
    state.order_items.push(...orderItems);
    save(state);
    return { ...order, items: orderItems.map(i => ({ ...i, product_name: (state.products.find(p => p.id === i.product_id) || {}).name })) };
  },
  updateOrderStatus(id, userId, status) {
    const state = load();
    const idx = state.orders.findIndex(o => o.id === id && o.user_id === userId);
    if (idx === -1) return null;
    state.orders[idx].status = status;
    state.orders[idx].updated_at = new Date().toISOString();
    save(state);
    const order = state.orders[idx];
    return { ...order, items: state.order_items.filter(i => i.order_id === id).map(i => ({ ...i, product_name: (state.products.find(p => p.id === i.product_id) || {}).name })) };
  },
  deleteOrder(id, userId) {
    const state = load();
    state.orders = state.orders.filter(o => !(o.id === id && o.user_id === userId));
    state.order_items = state.order_items.filter(i => i.order_id !== id);
    save(state);
  },
  reset() { save(JSON.parse(JSON.stringify(DEFAULT_STATE))); }
};

module.exports = db;