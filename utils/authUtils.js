import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config({ path: '.env.dev' });

const hashPassword = async (password) => bcrypt.hash(password, 10);

const comparePassword = async (password, hashedPassword) => bcrypt.compare(password, hashedPassword);

const generateToken = (userId, role) => jwt.sign({ id: userId, role }, process.env.JWT_SECRET, { expiresIn: "2d" });

const verifyToken = (token) => {
    try {
        return jwt.verify(token, process.env.JWT_SECRET);
    } catch (error) {
        throw new Error("Invalid token");
    }
};

const handleError = (res, error, message) => {
    console.error(`${message}:`, error);
    return res.status(500).json({
        success: false,
        message: message,
        error: error.message
    });
};

export { hashPassword, comparePassword, generateToken, verifyToken, handleError };
