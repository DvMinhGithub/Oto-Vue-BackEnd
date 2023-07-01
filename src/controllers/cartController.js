const cartModel = require('#models/cart');
const carModel = require('#models/car');
const mongoose = require('mongoose');

const cartController = {
  getCartItems: async (req, res, next) => {
    try {
      const idCustomer = req.params.idCustomer;

      const data = await cartModel
        .findOne({ idCustomer })
        .populate('listProduct.idProduct');

      return res.status(200).json({ data });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },

  addToCart: async (req, res) => {
    try {
      const { idCustomer } = req.params;
      const { idProduct: idProductBody, amountProduct } = req.body;

      const cartData = await cartModel.findOne({ idCustomer });

      const productInfo = await carModel.findById(idProductBody);

      const existingProductIndex = cartData.listProduct?.findIndex(
        (product) => product?.idProduct.toString() == productInfo._id
      );

      if (existingProductIndex === -1 && amountProduct !== 0) {
        cartData.listProduct.push({
          idProduct: productInfo._id,
          amountProduct,
        });
        cartData.totalPrice += amountProduct * productInfo.amountPrice;
      } else {
        if (amountProduct === 0) {
          const removedProduct = cartData.listProduct.splice(
            existingProductIndex,
            1
          )[0];
          cartData.totalPrice -=
            removedProduct.amountProduct * productInfo.amountPrice;
        } else {
          const existingProduct = cartData.listProduct[existingProductIndex];
          cartData.totalPrice +=
            productInfo.amountPrice *
            (amountProduct - existingProduct.amountProduct);
          existingProduct.amountProduct = amountProduct;
        }
      }

      await cartData.save();

      res.status(201).json({
        success: true,
        data: cartData,
        message: 'Thêm sản phẩm vào giỏ hàng thành công',
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
