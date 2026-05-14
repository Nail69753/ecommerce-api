require('dotenv').config({ path: require('path').join(__dirname, '..', '.env') });
const fs   = require('fs');
const path = require('path');

const rawPath  = process.env.DB_PATH;
const inMemory = !rawPath || rawPath === ':memory:';
const filePath = inMemory ? null
  : path.isAbsolute(rawPath) ? rawPath
  : path.join(__dirname, '..', rawPath.replace(/^\.\//, ''));

function defaultData() {
  const now = new Date().toISOString();
  return {
    _seq: { users: 0, products: 5, orders: 0, order_items: 0 },
    users: [],
    products: [
      { id: 1, name: 'Laptop Pro',          description: 'High-performance 15" laptop',          price: 1299.99, stock: 50,  created_at: now, updated_at: now },
      { id: 2, name: 'Wireless Mouse',      description: 'Ergonomic wireless mouse',              price:   29.99, stock: 200, created_at: now, updated_at: now },
      { id: 3, name: 'USB-C Hub',           description: '7-in-1 USB-C hub with HDMI & USB 3.0', price:   49.99, stock: 100, created_at: now, updated_at: now },
      { id: 4, name: 'Mechanical Keyboard', description: 'TKL mechanical keyboard, RGB backlit',  price:   89.99, stock: 75,  created_at: now, updated_at: now },
      { id: 5, name: 'Monitor 27"',         description: '4K IPS display, 144Hz refresh rate',   price:  499.99, stock: 30,  created_at: now, updated_at: now },
    ],
    orders: [],
    order_items: [],
  };
}

const data = (filePath && fs.existsSync(filePath))
  ? JSON.parse(fs.readFileSync(filePath, 'utf8'))
  : defaultData();

function save() {
  if (filePath) fs.writeFileSync(filePath, JSON.stringify(data, null, 2), 'utf8');
}

function nextId(table) {
  data._seq[table] = (data._seq[table] || 0) + 1;
  return data._seq[table];
}

module.exports = { data, save, nextId };
