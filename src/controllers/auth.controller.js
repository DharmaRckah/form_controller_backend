import jwt from 'jsonwebtoken';
import { sendResponse } from '../utils/response.util.js';
import { registerUser, loginUser } from '../services/auth.service.js';
import { generateTokens } from '../services/token.service.js';
import User from '../models/user.model.js';

export const register = async (req, res, next) => {
  try {
    const user = await registerUser(req.body);
    sendResponse(res, 201, true, 'User registered successfully', user);
  } catch (err) {
    next(err);
  }
};

export const login = async (req, res, next) => {
  try {
    const user = await loginUser(req.body);
    const { accessToken, refreshToken } = await generateTokens(user);

    res.cookie('refreshToken', refreshToken, {
      httpOnly: true,
      secure: false,
      sameSite: 'strict'
    });

    sendResponse(res, 200, true, 'Login successful', { accessToken });
  } catch (err) {
    next(err);
  }
};

export const refreshToken = async (req, res, next) => {
  try {
    const token = req.cookies.refreshToken;
    if (!token) return res.sendStatus(401);

    const decoded = jwt.verify(token, process.env.REFRESH_TOKEN_SECRET);
    const user = await User.findById(decoded.userId);

    if (!user || user.refreshToken !== token) {
      return res.sendStatus(403);
    }

    const accessToken = jwt.sign(
      { userId: user._id },
      process.env.ACCESS_TOKEN_SECRET,
      { expiresIn: process.env.ACCESS_TOKEN_EXPIRY }
    );

    sendResponse(res, 200, true, 'Token refreshed', { accessToken });
  } catch (err) {
    next(err);
  }
};


export const logout = async (req, res, next) => {
  try {
    const refreshToken = req.cookies.refreshToken;

    if (refreshToken) {
      await User.findOneAndUpdate(
        { refreshToken },
        { refreshToken: null }
      );
    }

    res.clearCookie('refreshToken', {
      httpOnly: true,
      sameSite: 'strict'
    });

    return sendResponse(res, 200, true, 'Logout successful');
  } catch (err) {
    next(err);
  }
};
