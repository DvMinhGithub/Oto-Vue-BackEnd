const carModel = require("../models/car");
const fs = require("fs");
const path = require("path");
const carController = {
  getAllCar: async (req, res) => {
    try {
      const car = await carModel.find();
      res.status(200).json({ success: true, data: car });
    } catch (error) {
      res.status(500).json({ success: false, message: error.message });
    }
  },

  getCarDetail: async (req, res) => {
    try {
      const id = req.query.id;
      const carDetail = await carModel.findById(id);
      res.status(200).json({ success: true, data: carDetail });
    } catch (error) {
      res.status(500).json({ success: false, message: error.message });
    }
  },
  createCar: async (req, res) => {
    try {
      const carCreated = await carModel.create(req.body);

      res.status(200).json({ success: true, data: carCreated });
    } catch (error) {
      res.status(500).json({ success: false, message: error.message });
    }
  },
  updateCar: async (req, res) => {
    try {
      const id = req.query.id;

      const { price, discount } = req.body;
      const updateData = { ...req.body };
      updateData.amountPrice = discount ? (price * discount) / 100 : price;

      const currentCar = await carModel.findById(id);
      const currentAvatarUrl = currentCar.carImage;

      const newAvatarUrl =
        req.file &&
        `http://localhost:${process.env.PORT}/images/${req.file.filename}`;

      if (newAvatarUrl) {
        updateData.carImage = newAvatarUrl;

        if (currentAvatarUrl && currentAvatarUrl !== newAvatarUrl) {
          const oldAvatarPath = path.join(
            __dirname,
            "../../public",
            currentAvatarUrl.replace(`http://localhost:${process.env.PORT}`, "")
          );
          if (fs.existsSync(oldAvatarPath)) fs.unlinkSync(oldAvatarPath);
        }
      }

      const carUpdate = await carModel.findByIdAndUpdate(
        id,
        { $set: updateData },
        { new: true }
      );
      res.status(200).json({ success: true, data: carUpdate });
    } catch (error) {
      res.status(500).json({ success: false, message: error.message });
    }
  },
};
module.exports = carController;
