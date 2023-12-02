import express from 'express'
import multer from 'multer';
const router = express.Router();

import CreateChat from '../controllers/chat/CreateChat.js';

import auth from '../middleware/auth.js';

const storage = multer.diskStorage({
    destination: 'public/files/',
    filename: (req, file, cb) => {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        const newFilename = uniqueSuffix + '-' + file.originalname;
        cb(null, newFilename);
    },
});;
const upload = multer({ storage: storage });

//routes
router.post(
    '/',
    auth(),
    upload.single('audio'),
    CreateChat
);

export default router;