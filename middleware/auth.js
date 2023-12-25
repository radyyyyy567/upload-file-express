import dotenv from 'dotenv';
import { decode } from 'next-auth/jwt';

dotenv.config();
const secretKey = process.env.API_EXTERNAL_SECRET; // Replace with your JWT secret key

export const authenticateJWT = async (req, res, next) => {
  try {
    const token = req.headers.authorization;

    const decoded = await decode({
      token: token,
      secret: secretKey,
    });

    // If all checks pass, proceed to the next middleware
    next();
  } catch (error) {
    console.error(error); // Log the error for debugging purposes

    return res.status(401).json({ error: `Unauthorized: ${error.message}` });
  }
};
