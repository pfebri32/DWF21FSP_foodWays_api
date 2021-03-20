const express = require('express');

const router = express.Router();

// Middlewares.
const { authenticated, hasRoles } = require('../middlewares/auth');

// Controllers.
const { register, login } = require('../controllers/auth');
const { getUsers, updateUser, deleteUser } = require('../controllers/user');
const {
  getProduct,
  getProducts,
  addProduct,
  getProductsByPartnerId,
  updateProduct,
} = require('../controllers/product');

// Routes.
// Routes for auth.
router.post('/login', login);
router.post('/register', register);

// Routs for user.
router.get('/users', authenticated, getUsers);
router.delete('/user/:id', authenticated, deleteUser);
router.patch('/user/update', authenticated, updateUser);

// Routes for product.
router.get('/product/:id', authenticated, hasRoles(['partner']), getProduct);
router.get('/products', getProducts);
router.get('/products/:id', getProductsByPartnerId);
router.post('/product/add', authenticated, hasRoles(['partner']), addProduct);
router.patch(
  '/product/:id',
  authenticated,
  hasRoles(['partner']),
  updateProduct
);

module.exports = router;
