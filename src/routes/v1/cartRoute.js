const express = require("express");
const router = express.Router();

const { verifyTokenCustomer } = require("../../middlewares/verify");
const cartController = require("../../controllers/cartController");

router.get("/:idCustomer", verifyTokenCustomer, cartController.getCartItems);

router.post("/:idCustomer", verifyTokenCustomer, cartController.addToCart);

// router.put("/:idCustomer", verifyTokenCustomer, cartController.updateCart);

router.put("/reset/:idCustomer", verifyTokenCustomer, cartController.resetCart);

module.exports = router;
