const multer = require('multer');
const path = require('path');
const fs = require('fs');
const util = require('util');
const unlink = util.promisify(fs.unlink);

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    let uploadSubFolder = 'uploads/others';

    if (file.fieldname === 'coverImage') {
      uploadSubFolder = 'uploads/covers';
    } else if (file.fieldname === 'pdf') {
      uploadSubFolder = 'uploads/pdfs';
    }

    const targetDir = path.join(process.cwd(), uploadSubFolder);

    if (!fs.existsSync(targetDir)) {
      fs.mkdirSync(targetDir, { recursive: true });
    }

    cb(null, targetDir);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
    cb(null, `${uniqueSuffix}${path.extname(file.originalname)}`);
  }
});

const fileFilter = (req, file, cb) => {
  if (file.fieldname === 'coverImage') {
    if (file.mimetype.startsWith('image/')) {
      return cb(null, true);
    }
    return cb(new Error('Kapak görseli sadece resim formatında (JPG, PNG vb.) olabilir!'), false);
  }

  if (file.fieldname === 'pdf') {
    if (file.mimetype === 'application/pdf') {
      return cb(null, true);
    }
    return cb(new Error('Kitap dokümanı yalnızca PDF formatında olmalıdır!'), false);
  }

  cb(null, false);
};

const multerUpload = multer({
  storage,
  fileFilter,
  limits: { fileSize: 25 * 1024 * 1024 }
});

const parseBookFiles = multerUpload.fields([
  { name: 'coverImage', maxCount: 1 },
  { name: 'pdf', maxCount: 1 }
]);

const fileSizeLimits = {
  coverImage: 5 * 1024 * 1024,
  pdf: 25 * 1024 * 1024
};

module.exports = (req, res, next) => {
  parseBookFiles(req, res, async (error) => {
    if (error) {
      const uploadedFiles = Object.values(req.files || {}).flat();
      await Promise.all(uploadedFiles.map(file => unlink(file.path).catch(() => {})));

      if (error instanceof multer.MulterError && error.code === 'LIMIT_FILE_SIZE') {
        return res.status(413).json({
          success: false,
          message: 'Dosya boyutu izin verilen sınırı aşıyor (PDF: 25 MB).'
        });
      }

      return next(error);
    }

    const oversizedFile = Object.entries(req.files || {})
      .flatMap(([fieldName, files]) => files.map(file => ({ fieldName, file })))
      .find(({ fieldName, file }) => file.size > fileSizeLimits[fieldName]);

    if (oversizedFile) {
      const files = Object.values(req.files || {}).flat();
      await Promise.all(files.map(file => unlink(file.path).catch(() => {})));
      const maxSizeMb = fileSizeLimits[oversizedFile.fieldName] / (1024 * 1024);
      return res.status(413).json({
        success: false,
        message: `${oversizedFile.fieldName === 'coverImage' ? 'Kapak görseli' : 'PDF'} en fazla ${maxSizeMb} MB olabilir.`
      });
    }

    next();
  });
};
