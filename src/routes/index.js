const express = require('express');

const router = express.Router();

const { login } = require('../controllers/auth');

router.post('/api/v1/login', login);

const { getUsers } = require('../controllers/user');

router.get('/api/v1/users', getUsers);

module.exports = router;
