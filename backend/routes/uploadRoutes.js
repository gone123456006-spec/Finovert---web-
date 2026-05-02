import express from 'express';
import multer from 'multer';
import path from 'path';

const router = express.Router();

// Use memory storage — no disk writes, works on Render & locally
const storage = multer.memoryStorage();

function checkFileType(file, cb) {
  const filetypes = /jpg|jpeg|png|webp|gif|pdf|doc|docx/;
  const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
  const mimetype =
    filetypes.test(file.mimetype) ||
    file.mimetype === 'application/pdf' ||
    file.mimetype.includes('word');

  if (extname && mimetype) {
    return cb(null, true);
  } else {
    cb(new Error('Unsupported file type'));
  }
}

const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5 MB max
  fileFilter: (req, file, cb) => checkFileType(file, cb),
});

router.post('/', upload.single('image'), (req, res) => {
  if (!req.file) {
    return res.status(400).json({ message: 'No file uploaded' });
  }

  // Convert buffer to base64 data URL — storable in MongoDB, viewable directly in <img> / <a>
  const base64 = req.file.buffer.toString('base64');
  const dataUrl = `data:${req.file.mimetype};base64,${base64}`;

  // Return the data URL as plain text so existing frontend code works unchanged
  res.send(dataUrl);
});

export default router;
