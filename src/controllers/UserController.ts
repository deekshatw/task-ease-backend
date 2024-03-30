import express, { Request, Response, NextFunction, request } from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import UserModel from "../models/UserModel";

const registerUser = (
  request: Request,
  response: Response,
  next: NextFunction
) => {
  const { username, email, password } = request.body;

  // Encrypt the password
  bcrypt.hash(password, 10, async (err, hashedPassword) => {
    if (err) {
      return response.status(500).json({ error: "Password encryption failed" });
    }

    // Create a new user with the encrypted password
    const user = new UserModel({ username, email, password: hashedPassword });

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
    } catch (error: any) {
      return response.status(500).json({ error: error.message });
    }
  });
};

const loginUser = (
  request: Request,
  response: Response,
  next: NextFunction
) => {
  const { email, password } = request.body;
  UserModel.findOne({ email })
    .exec()
    .then((user) => {
      if (!user) {
        return response.status(401).json({ message: "Authentication failed" });
      }
      bcrypt.compare(password, user.password, (err, result) => {
        if (err || !result) {
          return response
            .status(401)
            .json({ message: "Authentication failed" });
        } else {
          const token = jwt.sign(
            {
              email: user.email,
              userId: user._id,
            },
            process.env.JWT_SECRET || "",
            { expiresIn: "1h" }
          );
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

const deleteUser = (
  request: Request,
  response: Response,
  next: NextFunction
) => {
  const userId = request.params.userId;
  return UserModel.findByIdAndDelete(userId).then(() =>
    response
      .status(200)
      .json({ status: "success", message: "User deleted successfully!" })
  );
};
const updateUser = (
  request: Request,
  response: Response,
  next: NextFunction
) => {
  const userId = request.params.userId;
  const { username, email } = request.body;
  return UserModel.findByIdAndUpdate(userId, { username, email })
    .exec()
    .then((user) => {
      if (!user) {
        return response.status(404).json({ message: "User not found!" });
      } else {
        return response.status(200).json({
          status: "success",
          message: "User updated successfully",
          user: user,
        });
      }
    });
};

const getAllUsers = (
  request: Request,
  response: Response,
  next: NextFunction
) => {
  UserModel.find()
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

export default {
  registerUser,
  loginUser,
  deleteUser,
  updateUser,
  getAllUsers,
};
