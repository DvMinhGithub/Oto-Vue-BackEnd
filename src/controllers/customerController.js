const customerModel = require('../models/customer');
const bcrypt = require('bcrypt');
const cartModel = require('../models/cart');
const fs = require('fs');
const path = require('path');
const jwt = require('jsonwebtoken');
const { generateAccessToken, generateRefreshToken } = require('../utils/auth');

const customerController = {
  register: async (req, res) => {
    try {
      const { userName, phoneNumber, email, address, password } = req.body;

      const checkEmail = await customerModel.findOne({ email });
      if (checkEmail) {
        return res
          .status(404)
          .json({ success: false, message: 'Email đã tồn tại' });
      } else {
        const hashPassword = await bcrypt.hash(password, 10);
        const customerAcc = await customerModel.create({
          userName,
          email,
          phoneNumber,
          address,
          password: hashPassword,
        });

        //Khi tạo 1 customer mới sẽ tạo luôn 1 giỏ hàng cho customer đấy
        await cartModel.create({ idCustomer: customerAcc._id });

        return res.status(200).json({
          success: true,
          message: 'Đăng ký thành công',
          data: customerAcc,
        });
      }
    } catch (error) {
      res.status(500).json({ success: false, message: error.message });
    }
  },
  updateCustomer: async (req, res) => {
    try {
      const { id } = req.params;

      const currentCustomer = await customerModel.findById(id);
      const currentAvatarUrl = currentCustomer.avatar;

      const newAvatarUrl =
        req.file &&
        `http://localhost:${process.env.PORT}/images/${req.file.filename}`;

      const updateData = { ...req.body };
      if (newAvatarUrl) {
        updateData.avatar = newAvatarUrl;

        if (currentAvatarUrl && currentAvatarUrl !== newAvatarUrl) {
          const oldAvatarPath = path.join(
            __dirname,
            '../../public',
            currentAvatarUrl.replace(`http://localhost:${process.env.PORT}`, '')
          );
          if (fs.existsSync(oldAvatarPath)) fs.unlinkSync(oldAvatarPath);
        }
      }

      const updatedCustomer = await customerModel.findByIdAndUpdate(
        id,
        { $set: updateData },
        { new: true }
      );

      res.status(200).json({
        success: true,
        message: 'Cập nhật thành công',
        data: updatedCustomer,
      });
    } catch (error) {
      res.status(500).json({ success: false, message: error.message });
    }
  },
  login: async (req, res) => {
    try {
      const { email, password } = req.body;

      // Find the user by email
      const user = await customerModel.findOne({ email });
      if (!user) {
        return res
          .status(401)
          .json({ success: false, message: 'Email không tồn tại' });
      }

      // Compare the provided password with the hashed password stored in the database
      const isPasswordValid = await bcrypt.compare(password, user.password);
      if (!isPasswordValid) {
        return res
          .status(401)
          .json({ success: false, message: 'Mật khẩu không đúng' });
      }

      // Prepare user data for tokens
      const userData = {
        _id: user._id,
        userName: user.userName,
        email: user.email,
        role: user.role,
      };

      // Generate access and refresh tokens
      const accessToken = generateAccessToken(userData);
      const refreshToken = generateRefreshToken(userData);

      // Update user's refresh token in the database
      user.refreshToken = refreshToken;
      await user.save();

      return res.status(200).json({
        success: true,
        userId: user._id,
        accessToken,
        refreshToken,
      });
    } catch (error) {
      return res.status(500).json({ success: false, message: error.message });
    }
  },

  refreshToken: async (req, res) => {
    try {
      const { refreshToken } = req.body;
      if (!refreshToken) {
        return res
          .status(404)
          .json({ success: false, message: 'Không tìm thấy refreshToken' });
      }

      const user = await customerModel.findOne({ refreshToken });
      if (!user) {
        return res
          .status(404)
          .json({ success: false, message: 'RefreshToken không hợp lệ' });
      }

      jwt.verify(refreshToken, process.env.REFRESH_TOKEN, async (err, data) => {
        if (err) {
          return res
            .status(401)
            .json({ success: false, message: 'Không được phép' });
        }

        const userData = {
          _id: user._id,
          userName: user.userName,
          email: user.email,
          role: user.role,
        };
        const newAccessToken = generateAccessToken(userData);
        const newRefreshToken = generateRefreshToken(userData);

        await customerModel.findByIdAndUpdate(user._id, {
          refreshToken: newRefreshToken,
        });

        res.status(200).json({
          accessToken: newAccessToken,
          refreshToken: newRefreshToken,
        });
      });
    } catch (error) {
      console.error(error);
      res
        .status(500)
        .json({ success: false, message: 'Internal server error' });
    }
  },

  logOut: async (req, res, next) => {
    try {
      const { refreshToken } = req.body;
      await customerModel.findOneAndUpdate(refreshToken, { refreshToken: '' });
      res.status(200).json({ success: true });
    } catch (err) {
      next(err);
    }
  },
  getInfo: async (req, res, next) => {
    try {
      const { id: userId } = req.params;
      const userInfo = await customerModel
        .findById(userId)
        .select('-password -refreshToken -listOrder -reviewCustomer');
      res.status(200).json({
        userInfo,
      });
    } catch (error) {
      console.error(error);
      res
        .status(500)
        .json({ success: false, message: 'Internal server error' });
    }
  },
};

module.exports = customerController;
