import multer from 'multer';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const uploadPath = path.resolve('uploads');

if (!fs.existsSync(uploadPath)) {
  fs.mkdirSync(uploadPath, { recursive: true });
}

console.log('Upload path:', uploadPath);

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadPath);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
    const ext = path.extname(file.originalname);
    cb(null, `cover-${uniqueSuffix}${ext}`);
  },
});

const fileFilter = (req, file, cb) => {
  console.log('[Multer] Checking file - mimetype:', file.mimetype);
  const allowedMimes = ['image/jpeg', 'image/png', 'image/jpg', 'image/webp'];
  if (allowedMimes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error('Format file tidak valid'), false);
  }
};

const upload = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: 512000,
  },
});

const uploadMiddleware = (req, res, next) => {
  console.log('[Multer] Upload middleware called');
  console.log('[Multer] Route:', req.method, req.path);
  const uploadSingle = upload.single('cover');

  uploadSingle(req, res, (err) => {
    if (err instanceof multer.MulterError) {
      console.log('[Multer] MulterError:', err.code, err.message);

      if (err.code === 'LIMIT_FILE_SIZE') {
        return res.status(413).json({
          status: 'fail',
          message: 'Ukuran file terlalu besar. Maksimal 512KB',
        });
      }
      return res.status(400).json({
        status: 'fail',
        message: err.message,
      });
    }
    if (err) {
      console.log('[Multer] Error:', err.message);
      return res.status(400).json({
        status: 'fail',
        message: err.message || 'Gagal mengunggah file',
      });
    }

    console.log('[Multer] File uploaded:', req.file ? req.file.filename : 'no file');
    next();
  });
};

export default uploadMiddleware;
