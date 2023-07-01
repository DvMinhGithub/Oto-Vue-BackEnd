const jwt = require("jsonwebtoken");
const verifyToken = (req, res, next) => {
  const token = req.headers.authorization?.split(" ")[1];
  console.log('file: verify.js:4 ~ token:', token)
  if (!token) return res.status(401).json({ message: "Bạn chưa đăng nhập" });
  try {
    const decodedToken = jwt.verify(token, process.env.ACCESS_TOKEN);
    req.data = decodedToken.data;
    next();
  } catch (error) {
    res.status(403).json({ message: "Token không hợp lệ!" });
  }
};
const verifyTokenCustomer = (req, res, next) => {
  verifyToken(req, res, () => {
    if (req.data.role.includes("customer")) {
      next();
    } else {
      res.status(403).json("You're not allowed to do that!");
    }
  });
};
const verifyTokenAdmin = (req, res, next) => {
  verifyToken(req, res, () => {
    if (req.data.role.includes("admin")) {
      next();
    } else {
      res.status(403).json("You're not allowed to do that!");
    }
  });
};
const verifyTokenAllRole = (req, res, next) => {
  verifyToken(req, res, () => {
    if (req.data.role.includes("admin") || req.data.role.includes("customer")) {
      next();
    } else {
      res.status(403).json("You're not allowed to do that!");
    }
  });
};
const verifyRefreshToken = (refreshToken) => {
  try {
    const decoded = jwt.verify(refreshToken, process.env.REFRESH_TOKEN);
    return decoded.data._id;
  } catch (err) {
    return null;
  }
};
module.exports = {
  verifyTokenAdmin,
  verifyTokenCustomer,
  verifyTokenAllRole,
  verifyRefreshToken,
};
