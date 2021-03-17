const express = require('express');

const router = express.Router();

const { login, register } = require('../controllers/auth');

router.post('/api/v1/login', login);
router.post('/api/v1/register', register);

const { getUsers, deleteUser } = require('../controllers/user');

router.get('/api/v1/users', getUsers);
router.delete('/api/v1/user/:id', deleteUser);

module.exports = router;
