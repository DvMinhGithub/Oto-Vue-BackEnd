const cartModel = require("../models/cart");
const carModel = require("../models/car");
const mongoose = require("mongoose");

const cartController = {
  getCartItems: async (req, res, next) => {
    try {
      const idCustomer = req.params.idCustomer;

      const data = await cartModel
        .findOne({ idCustomer })
        .populate("listProduct.idProduct");

      return res.status(200).json({ data });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },

  addToCart: async (req, res) => {
    try {
      const { idCustomer } = req.params;
      const { listProduct } = req.body;

      let totalPrice = 0;
      for (const productData of listProduct) {
        const product = await carModel.findById(productData.idProduct);
        if (product) {
          const productPrice = product.amountPrice;
          totalPrice += productPrice * productData.amountProduct;
        }
      }

      let cart = await cartModel
        .findOneAndUpdate(
          { idCustomer },
          { listProduct, totalPrice },
          { new: true, upsert: true }
        )
        .populate("listProduct.idProduct");

      res.status(201).json({
        message: "Thêm sản phẩm vào giỏ hàng thành công",
        data: cart,
      });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: error.message });
    }
  },

  //Reset giỏ hàng sau khi thanh toán xong
  resetCart: async (req, res) => {
    try {
      const { idCustomer } = req.params; //Id khách hàng
      const cartReset = await cartModel.findOneAndUpdate(
        { idCustomer },
        { listProduct: [], totalPrice: 0 },
        { new: true }
      );
      res.status(200).json({ success: true, data: cartReset });
    } catch (error) {
      res.status(500).json({ success: false, message: error.message });
    }
  },
};
module.exports = cartController;
