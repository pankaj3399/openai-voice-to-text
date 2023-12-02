import multer from 'multer';
import path from 'path';

const storage = multer.memoryStorage({
  destination: 'public/files/',
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, uniqueSuffix + '-' + file.originalname);
  },
});

const upload = multer({
  storage,
  fileFilter: (req, file, cb) => {

    // const supportedFile = /jpg|jpeg|png|webp/;
    // const extension = path.extname(file.originalname);

    // if (supportedFile.test(extension)) {
    //   cb(null, true);
    // } else {
    //   cb(new Error('Must be a jpg/png/jpeg/webp file'), false);
    // }
  },
});

export default upload;
