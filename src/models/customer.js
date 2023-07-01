const mongoose = require("mongoose");
const customerModel = new mongoose.Schema({
  userName: {
    type: String,
  },
  phoneNumber: {
    type: String,
  },
  email: {
    type: String,
  },
  address: {
    type: String,
  },
  password: {
    type: String,
  },
  idCart: {
    type: mongoose.Types.ObjectId,
    ref: "cart",
  },
  avatar: {
    type: String,
  },
  //lịch sử mua hàng
  listOrder: [
    {
      type: mongoose.Types.ObjectId,
      ref: "bill",
    },
  ],
  role: {
    type: String,
    default: "customer",
  },
  reviewCustomer: [
    {
      idProduct: {
        type: mongoose.Types.ObjectId,
        ref: "car",
      },
      review: {
        type: String,
      },
    },
  ],
  refreshToken: { type: String },
});

module.exports = mongoose.model("customer", customerModel);
