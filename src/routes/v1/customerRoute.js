const express = require("express");
const router = express.Router();
const {
  verifyTokenCustomer,
  verifyTokenAllRole,
} = require("../../middlewares/verify");
const customerController = require("../../controllers/customerController");
const uploadFile = require("../../middlewares/upload");

router.post("/register", customerController.register);

router.put(
  "/:id",
  verifyTokenCustomer,
  uploadFile("image"),
  customerController.updateCustomer
);

router.post("/login", customerController.login);

router.post("/refreshToken", customerController.refreshToken);

router.post("/logout", customerController.logOut);

module.exports = router;
