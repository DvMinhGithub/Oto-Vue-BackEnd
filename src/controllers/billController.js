const billModel = require("../models/bill");
const cart = require("../models/cart");
const customerModel = require("../models/customer");
const cartModel = require("../models/cart");

const billController = {
  getAllBill: async (req, res) => {
    try {
      const { idCustomer } = req.params; //Id của khách hàng
      const customer = await customerModel
        .findById(idCustomer)
        .populate("listOrder");
      const listOrder = customer.listOrder;
      res.status(200).json({ success: true, data: listOrder });
    } catch (error) {
      res.status(500).json({ success: false, message: error.message });
    }
  },

  getBillDetail: async (req, res) => {
    try {
      const { id } = req.query; //Id của hoá đơn
      const billDetail = await billModel.findById(id);
      res.status(200).json({ success: true, data: billDetail });
    } catch (error) {
      res.status(500).json({ success: false, message: error.message });
    }
  },
  // tạo bill mới khi thanh toán
  createBill: async (req, res) => {
    try {
      const { idCustomer } = req.params;
      const billCreated = await billModel.create({ ...req.body });
      await customerModel.findByIdAndUpdate(
        idCustomer,
        { $set: { $push: { listOrder: billCreated._id } } },
        { new: true }
      );
      res.status(200).json({ success: true, data: billCreated });
    } catch (error) {
      res.status(500).json({ success: false, message: error.message });
    }
  },
};

module.exports = billController;
