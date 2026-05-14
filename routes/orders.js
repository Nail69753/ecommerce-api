const express = require('express');
const { body } = require('express-validator');
const orderController = require('../src/controllers/orderController');
const { authenticate } = require('../src/middleware/auth');

const router = express.Router();

router.use(authenticate);

router.get('/', orderController.getAll);
router.get('/:id', orderController.getOne);

router.post('/', [
  body('items').isArray({ min: 1 }).withMessage('Items must be a non-empty array.'),
  body('items.*.product_id').isInt({ min: 1 }).withMessage('Each item must have a valid product_id.'),
  body('items.*.quantity').isInt({ min: 1 }).withMessage('Each item quantity must be at least 1.')
], orderController.create);

router.put('/:id', [
  body('status').notEmpty().withMessage('Status is required.')
], orderController.update);

router.delete('/:id', orderController.remove);

module.exports = router;