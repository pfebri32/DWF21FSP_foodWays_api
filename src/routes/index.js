const express = require('express');

const router = express.Router();

const { login, register } = require('../controllers/auth');

router.post('/api/v1/login', login);
router.post('/api/v1/register', register);

const { getUsers } = require('../controllers/user');

router.get('/api/v1/users', getUsers);

module.exports = router;
