import jwt from 'jsonwebtoken';

export const generateToken = (userId, role) => {
  return jwt.sign(
    { id: userId, role },
    process.env.JWT_SECRET || 'college_complaint_management_super_secure_jwt_secret_key_2026',
    {
      expiresIn: '7d',
    }
  );
};
