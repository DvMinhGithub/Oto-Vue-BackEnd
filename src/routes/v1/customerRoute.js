const express = require('express');
const router = express.Router();

const customerController = require('#src/controllers/customerController');
const uploadFile = require('#src/middleware/upload');
const { verifyTokenCustomer } = require('#src/middleware/verify');

router.get('/getInfo/:id', customerController.getInfo);

router.post('/register', customerController.register);

router.put(
  '/:id',
  verifyTokenCustomer,
  uploadFile('image'),
  customerController.updateCustomer
);

router.post('/login', customerController.login);

router.post('/refreshToken', customerController.refreshToken);

router.post('/logout', customerController.logOut);

module.exports = router;
