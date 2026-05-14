process.env.DB_PATH = ':memory:';
process.env.JWT_SECRET = 'test_secret';

const svc = require('../services/authService');

describe('authService', () => {
  test('register creates user',                 () => { const u = svc.register('alice','alice@ex.com','pass123'); expect(u.id).toBeDefined(); expect(u.username).toBe('alice'); });
  test('register hides password_hash',          () => expect(svc.register('bob','bob@ex.com','pass123').password_hash).toBeUndefined());
  test('register throws 422 duplicate email',   () => { svc.register('c1','dup@ex.com','p'); expect(() => svc.register('c2','dup@ex.com','p')).toThrow('already taken'); });
  test('register throws 422 duplicate username',() => { svc.register('dave','d1@ex.com','p'); expect(() => svc.register('dave','d2@ex.com','p')).toThrow('already taken'); });
  test('login returns token',                   () => { svc.register('eve','eve@ex.com','mypass'); const r = svc.login('eve@ex.com','mypass'); expect(r.token).toBeDefined(); });
  test('login throws 401 wrong password',       () => { svc.register('frank','frank@ex.com','right'); expect(() => svc.login('frank@ex.com','wrong')).toThrow('Invalid email or password'); });
  test('login throws 401 unknown email',        () => expect(() => svc.login('nobody@ex.com','x')).toThrow('Invalid email or password'));
});
