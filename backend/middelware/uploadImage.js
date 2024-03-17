const multer = require("multer");
const path = require("path");

const storage = multer.diskStorage({
  destination: path.join(__dirname, "../assets"),
  filename: function (req, file, cb) {
    return cb(
      null,
      `${file.fieldname}${Date.now()}${path.extname(file.originalname)}`
    );
  },
});

// Initialize multer with the storage options
const uploadImage = multer({ storage: storage });

module.exports = uploadImage;
