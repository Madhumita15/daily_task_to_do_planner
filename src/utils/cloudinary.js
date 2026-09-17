const cloudinary = require("../config/cloudinaryConfig");
const { CloudinaryStorage } = require("multer-storage-cloudinary");
const multer = require("multer");

const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: "to_do_planner",
    public_id: (req, file) => {
      const uniqueName = `${Date.now()}-${file.originalname.split(",")[0]}`;
      return uniqueName;
    },
  },
});

const upload = multer({
  storage: storage,
  limits: {
    fileSize: 1 * 1024 * 1024,
  },
  fileFilter: (req, file, cb) => {
    const FILE_TYPE = ["image/png", "image/jpg", "image/jpeg", "image/gif"];

    if (FILE_TYPE.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(null, new Error("only images are allowed"));
    }
  },
});

module.exports = upload;
