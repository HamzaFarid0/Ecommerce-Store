import jwt from 'jsonwebtoken';

// Generate Access Token (valid for 15 minutes)
export const generateAccessToken = (user) => {
  return jwt.sign(
    { id: user.id},
    process.env.ACCESS_TOKEN_SECRET,
    { expiresIn: '15m' }
  );
};

// Generate Refresh Token (valid for 7 days)
export const generateRefreshToken = (user) => {
  return jwt.sign(
    { id: user.id },
    process.env.REFRESH_TOKEN_SECRET,
    { expiresIn: '7d' }
  );
};

// Verify Access Token
export const verifyToken = (token) => {
  try {
    return jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
  } catch (error) {
    return null;
  }
};
