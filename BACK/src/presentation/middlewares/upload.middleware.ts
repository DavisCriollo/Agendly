import multer from 'multer';
import path from 'path';
import { v4 as uuidv4 } from 'uuid';
import { envs } from '../../config/envs';

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, envs.UPLOAD_PATH);
  },
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname) || '.jpg';
    cb(null, `${uuidv4()}${ext}`);
  },
});

const fileFilter = (req: any, file: Express.Multer.File, cb: multer.FileFilterCallback) => {
  const allowedTypes = /jpeg|jpg|png|gif|webp|pdf/;
  const ext = path.extname(file.originalname).toLowerCase().slice(1);
  const mimetype = file.mimetype;

  if (allowedTypes.test(ext) && allowedTypes.test(mimetype.split('/')[1])) {
    cb(null, true);
  } else {
    cb(new Error('Tipo de archivo no permitido'));
  }
};

export const uploadMiddleware = multer({
  storage,
  limits: { fileSize: envs.MAX_FILE_SIZE },
  fileFilter,
});
