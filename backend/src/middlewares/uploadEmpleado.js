const multer = require("multer");
const path = require("path");

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/empleados");
  },
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname);
    cb(null, `empleado-${Date.now()}${ext}`);
  }
});

const fileFilter = (req, file, cb) => {
  const allowed = /jpg|jpeg|png|webp/;
  const ext = allowed.test(path.extname(file.originalname).toLowerCase());
  const mime = allowed.test(file.mimetype);

  if (ext && mime) {
    cb(null, true);
  } else {
    cb(new Error("Formato de imagen no válido"));
  }
};

module.exports = multer({
  storage,
  fileFilter
});
