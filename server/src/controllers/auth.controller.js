import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

import User from "../models/User.js";

import {
    generateAccessToken,
    generateRefreshToken
} from "../utils/generateToken.js";

const accessCookieOptions = {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: 15 * 60 * 1000
};

const refreshCookieOptions = {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: 7 * 24 * 60 * 60 * 1000
};

export const register = async (req, res) => {
    try {
        const { name, email, password } = req.body;

        if (!name || !email || !password) {
            return res.status(400).json({
                message: "All fields are required"
            });
        }

        const existingUser = await User.findOne({ email });

        if (existingUser) {
            return res.status(400).json({
                message: "User already exists"
            });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const user = await User.create({
            name,
            email,
            password: hashedPassword
        });

        res.status(201).json({
            message: "User registered successfully",
            user: {
                id: user._id,
                name: user.name,
                email: user.email
            }
        });

    } catch (error) {
        res.status(500).json({
            message: error.message
        });
    }
};


export const login = async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({
                message: "Email and password are required"
            });
        }

        const user = await User.findOne({ email });

        if (!user) {
            return res.status(401).json({
                message: "Invalid credentials"
            });
        }

        const isMatch = await bcrypt.compare(
            password,
            user.password
        );

        if (!isMatch) {
            return res.status(401).json({
                message: "Invalid credentials"
            });
        }

        const accessToken = generateAccessToken(user._id);

        const refreshToken = generateRefreshToken(user._id);

        // Hash refresh token before storing it
        const refreshTokenHash = await bcrypt.hash(
            refreshToken,
            10
        );

        user.refreshTokenHash = refreshTokenHash;

        await user.save();

        // Send tokens as HttpOnly cookies
        res.cookie(
            "accessToken",
            accessToken,
            accessCookieOptions
        );

        res.cookie(
            "refreshToken",
            refreshToken,
            refreshCookieOptions
        );

        res.json({
            message: "Login successful",
            user: {
                id: user._id,
                name: user.name,
                email: user.email
            }
        });

    } catch (error) {
        res.status(500).json({
            message: error.message
        });
    }
};

export const refreshAccessToken = async (req, res) => {
    try {
        const refreshToken = req.cookies.refreshToken;

        if (!refreshToken) {
            return res.status(401).json({
                message: "Refresh token required"
            });
        }

        const decoded = jwt.verify(
            refreshToken,
            process.env.JWT_REFRESH_SECRET
        );

        const user = await User.findById(decoded.userId);

        if (!user || !user.refreshTokenHash) {
            return res.status(403).json({
                message: "Invalid refresh token"
            });
        }

        const isValid = await bcrypt.compare(
            refreshToken,
            user.refreshTokenHash
        );

        if (!isValid) {
            return res.status(403).json({
                message: "Invalid refresh token"
            });
        }

        const newAccessToken = generateAccessToken(
            user._id
        );

        res.cookie(
            "accessToken",
            newAccessToken,
            accessCookieOptions
        );

        res.json({
            message: "Access token refreshed"
        });

    } catch (error) {
        return res.status(403).json({
            message: "Invalid or expired refresh token"
        });
    }
};


export const logout = async (req, res) => {
    try {
        const refreshToken = req.cookies.refreshToken;

        if (refreshToken) {
            try {
                const decoded = jwt.verify(
                    refreshToken,
                    process.env.JWT_REFRESH_SECRET
                );

                await User.findByIdAndUpdate(
                    decoded.userId,
                    {
                        refreshTokenHash: null
                    }
                );
            } catch (error) {
                // Token is already invalid/expired.
                // We still clear the cookies.
            }
        }

        res.clearCookie("accessToken", accessCookieOptions);

        res.clearCookie("refreshToken", refreshCookieOptions);

        res.json({
            message: "Logged out successfully"
        });

    } catch (error) {
        res.status(500).json({
            message: error.message
        });
    }
};


export const getMe = async (req, res) => {
    try {
        const user = await User.findById(req.user.userId)
            .select("-password -refreshTokenHash");

        if (!user) {
            return res.status(404).json({
                message: "User not found"
            });
        }

        res.json({
            user: {
                id: user._id,
                name: user.name,
                email: user.email
            }
        });

    } catch (error) {
        res.status(500).json({
            message: error.message
        });
    }
};