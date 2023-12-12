import express from 'express'
const router = express.Router();

import signin from '../controllers/auth/signin.js';
import signup from '../controllers/auth/signup.js';
import profile from '../controllers/auth/profile.js';

import auth from '../middleware/auth.js';
import verifyAccount from '../controllers/auth/verifyAccount.js';

//routes
router.get('/profile', auth(), profile);
router.post('/signin', signin);
router.post('/signup', signup);
router.patch('/verify/:email', verifyAccount);

export default router;