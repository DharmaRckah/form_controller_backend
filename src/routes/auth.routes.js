import express from 'express';
import { register, login, refreshToken, logout } from '../controllers/auth.controller.js';
import { protect } from '../middlewares/auth.middleware.js';

const router = express.Router();

router.post('/register', register);
router.post('/login', login);
router.post('/refresh-token', refreshToken);

/* Example protected route */
router.get('/me', protect, (req, res) => {
  res.json({ success: true, user: req.user });
});


router.post('/logout', logout);
export default router;
