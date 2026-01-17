import User from '../models/user.model.js';
import { generateAccessToken, generateRefreshToken } from '../utils/jwt.util.js';

export const generateTokens = async (user) => {
  const payload = { userId: user._id };

  const accessToken = generateAccessToken(payload);
  const refreshToken = generateRefreshToken(payload);

  user.refreshToken = refreshToken;
  await user.save();

  return { accessToken, refreshToken };
};
