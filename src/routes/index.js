const express = require('express');

const router = express.Router();

// Middlewares.
const { authenticated, hasRoles } = require('../middlewares/auth');

// Controllers.
const { register, login } = require('../controllers/auth');
const { getUsers, updateUser } = require('../controllers/user');
const { getProduct } = require('../controllers/product');

// Routes.
// Routes for auth.
router.post('/register', register);
router.post('/login', login);

// Routs for user.
router.get('/users', authenticated, getUsers);
router.patch('/user/update', authenticated, updateUser);

// Routes for product.
router.get('/product/:id', authenticated, hasRoles(['partner']), getProduct);

module.exports = router;
