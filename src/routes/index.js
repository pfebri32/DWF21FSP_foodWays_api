const express = require('express');

const router = express.Router();

// Middlewares.
const { authenticated, hasRoles } = require('../middlewares/auth');
const { uploadFile } = require('../middlewares/upload');

// Controllers.
const { register, login } = require('../controllers/auth');
const { getUsers, updateUser, deleteUser } = require('../controllers/user');
const {
  getProduct,
  getProducts,
  addProduct,
  getProductsByPartnerId,
  updateProduct,
  deleteProduct,
} = require('../controllers/product');
const {
  addOrder,
  getOrderById,
  getOrderByPartnerId,
  getOrderByCustomerId,
  updateOrder,
  deleteOrder,
} = require('../controllers/order');

// Routes.
// Routes for auth.
router.post('/login', login);
router.post('/register', register);

// Routs for user.
router.get('/users', authenticated, getUsers);
router.delete('/user/:id', deleteUser);
// router.patch('/user/update', authenticated, updateUser);

// Routes for product.
router.get('/product/:id', getProduct);
router.get('/products', getProducts);
router.get('/products/:id', authenticated, getProductsByPartnerId);
router.post('/product', authenticated, hasRoles(['partner']), addProduct);
router.delete(
  '/product/:id',
  authenticated,
  hasRoles(['partner']),
  deleteProduct
);
router.patch(
  '/product/:id',
  authenticated,
  hasRoles(['partner']),
  uploadFile('imageFile'),
  updateProduct
);

// Routes for order.
router.get('/order/:id', authenticated, getOrderById);
router.get('/orders/:id', authenticated, getOrderByPartnerId);
router.get('/my-order', authenticated, getOrderByCustomerId);
router.post('/order', authenticated, addOrder);
router.patch('/order/:id', authenticated, updateOrder);
router.delete('/order/:id', authenticated, deleteOrder);

module.exports = router;
