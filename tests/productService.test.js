process.env.DB_PATH = ':memory:';
process.env.JWT_SECRET = 'test_secret';

const svc = require('../services/productService');

describe('productService', () => {
  test('listProducts returns array',        () => expect(Array.isArray(svc.listProducts())).toBe(true));
  test('createProduct returns new product', () => { const p = svc.createProduct({ name:'Widget', price:9.99, stock:10 }); expect(p.id).toBeDefined(); expect(p.name).toBe('Widget'); });
  test('createProduct defaults stock to 0', () => expect(svc.createProduct({ name:'X', price:1 }).stock).toBe(0));
  test('getProduct throws 404 if missing',  () => expect(() => svc.getProduct(99999)).toThrow('Product not found'));
  test('updateProduct changes fields',      () => { const p = svc.createProduct({ name:'Old', price:1, stock:5 }); expect(svc.updateProduct(p.id, { name:'New', price:2 }).name).toBe('New'); });
  test('deleteProduct removes product',     () => { const p = svc.createProduct({ name:'Del', price:1 }); svc.deleteProduct(p.id); expect(() => svc.getProduct(p.id)).toThrow(); });
  test('deleteProduct throws 404',          () => expect(() => svc.deleteProduct(99999)).toThrow('Product not found'));
});
