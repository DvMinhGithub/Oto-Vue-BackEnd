const express = require("express");
const router = express.Router();
const { verifyTokenCustomer } = require("../../middlewares/verify");
const billController = require("../../controllers/billController");

router.get("/:idCustomer", verifyTokenCustomer, billController.getAllBill);
router.get("/:id", verifyTokenCustomer, billController.getBillDetail);

router.post("/:idCustomer", verifyTokenCustomer, billController.createBill);

module.exports = router;
