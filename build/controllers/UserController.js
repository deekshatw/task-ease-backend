"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const UserModel_1 = __importDefault(require("../models/UserModel"));
const registerUser = (request, response, next) => {
    const { username, email, password } = request.body;
    // Encrypt the password
    bcryptjs_1.default.hash(password, 10, async (err, hashedPassword) => {
        if (err) {
            return response.status(500).json({ error: "Password encryption failed" });
        }
        // Create a new user with the encrypted password
        const user = new UserModel_1.default({ username, email, password: hashedPassword });
        try {
            // Save the user to the database
            await user.save();
            return response.status(201).json({
                status: "success",
                message: "User created successfully",
                user: {
                    username: user.username,
                    email: user.email,
                },
            });
        }
        catch (error) {
            return response.status(500).json({ error: error.message });
        }
    });
};
const loginUser = (request, response, next) => {
    const { email, password } = request.body;
    UserModel_1.default.findOne({ email })
        .exec()
        .then((user) => {
        if (!user) {
            return response.status(401).json({ message: "Authentication failed" });
        }
        bcryptjs_1.default.compare(password, user.password, (err, result) => {
            if (err || !result) {
                return response
                    .status(401)
                    .json({ message: "Authentication failed" });
            }
            else {
                const token = jsonwebtoken_1.default.sign({
                    email: user.email,
                    userId: user._id,
                }, process.env.JWT_SECRET || "", { expiresIn: "1h" });
                user.token = token; // Save the token to the user document
                user.save();
                return response.status(200).json({
                    status: "success",
                    message: "Authentication successful",
                    user: {
                        username: user.username,
                        email: user.email,
                        token: token,
                    },
                });
            }
        });
    })
        .catch((err) => response.status(500).json({ error: err.message }));
};
const deleteUser = (request, response, next) => {
    const userId = request.params.userId;
    return UserModel_1.default.findByIdAndDelete(userId).then(() => response
        .status(200)
        .json({ status: "success", message: "User deleted successfully!" }));
};
const updateUser = (request, response, next) => {
    const userId = request.params.userId;
    const { username, email } = request.body;
    return UserModel_1.default.findByIdAndUpdate(userId, { username, email })
        .exec()
        .then((user) => {
        if (!user) {
            return response.status(404).json({ message: "User not found!" });
        }
        else {
            return response.status(200).json({
                status: "success",
                message: "User updated successfully",
                user: user,
            });
        }
    });
};
const getAllUsers = (request, response, next) => {
    UserModel_1.default.find()
        .exec()
        .then((users) => {
        return response.status(200).json({
            status: "success",
            message: "Users retrieved successfully",
            users: users,
        });
    })
        .catch((err) => response.status(500).json({ error: err.message }));
};
exports.default = {
    registerUser,
    loginUser,
    deleteUser,
    updateUser,
    getAllUsers,
};
