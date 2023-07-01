const multer = require("multer");
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "public/images");
  },
  filename: function (req, file, cb) {
    cb(
      null,
      Date.now() +
        "-" +
        file.originalname
          .replace(/[^\x00-\x7F]/g, "")
          .split(" ")
          .join("")
    );
  },
});
const upload = multer({ storage: storage });
const uploadFile = (type) => (req, res, next) => {
  upload.single(type)(req, res, function (err) {
    if (err instanceof multer.MulterError) {
      return res.status(500).send(err.message);
    } else if (err) {
      return res.status(500).send(err.message);
    }
    next();
  });
};
module.exports = uploadFile;
