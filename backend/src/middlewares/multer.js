const multer = require("multer");
const path = require("path");
const fs = require("fs");

// Ruta donde se subirán los archivos
const uploadDir = path.join(__dirname, "../uploads/empleados");

// Verifica si la carpeta existe, si no, la crea
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    const uniqueName = Date.now() + path.extname(file.originalname);
    cb(null, uniqueName);
  }
});

const upload = multer({ storage });

module.exports = upload;
