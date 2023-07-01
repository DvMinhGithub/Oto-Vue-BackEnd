const mongoose = require("mongoose");
const carModel = new mongoose.Schema({
  name: {
    type: String,
  },
  price: {
    type: Number,
  },
  discount: {
    type: Number,
  },

  //Giá sau khi giảm
  amountPrice: {
    type: Number,
  },
  model: {
    type: String,
  },
  company: {
    type: String,
  },
  carImage: {
    type: String,
  },
  color: {
    type: String,
  },
  description: {
    type: String,
  },

  //Số lượng còn lại
  quantity: {
    type: Number,
  },

  //Đánh giá từ khách hàng
  reviewsCustomer: [
    {
      idCustomer: {
        type: mongoose.Types.ObjectId,
        ref: "customer",
      },
      nameCustomer: {
        type: String,
      },
      review: {
        type: String,
      },
    },
  ],
});

module.exports = mongoose.model("car", carModel);
