import express, { Request, Response, NextFunction, request } from "express";
import TaskModel from "../models/TaskModel";
import mongoose from "mongoose";

const createTask = (
  request: Request,
  response: Response,
  next: NextFunction
) => {
  const { title, description, status, userId } = request.body;
  const task = new TaskModel({
    _id: new mongoose.Types.ObjectId(),
    title,
    description,
    status,
    userId,
  });
  return task
    .save()
    .then((task) => {
      if (!task) {
        return response.status(500).json({ error: "Task creation failed" });
      } else {
        return response.status(200).json({
          status: "success",
          message: "Task created successfully",
          task: task,
        });
      }
    })
    .catch((error) => response.status(500).json({ error: error.message }));
};
const deleteTask = (
  request: Request,
  response: Response,
  next: NextFunction
) => {
  const taskId = request.params.taskId;
  return TaskModel.findByIdAndDelete(taskId)
    .then(() => {
      return response
        .status(200)
        .json({ status: "success", message: "Task deleted successfully!" });
    })
    .catch((error) => response.status(500).json({ error: error.message }));
};
const getTaskById = (
  request: Request,
  response: Response,
  next: NextFunction
) => {
  const taskId = request.params.taskId;
  return TaskModel.findById(taskId)
    .then((task) => {
      if (!task) {
        return response.status(404).json({ message: "Task not found!" });
      } else {
        return response.status(200).json({
          status: "success",
          message: "Task retrieved successfully",
          task: task,
        });
      }
    })
    .catch((error) => response.status(500).json({ error: error.message }));
};
const updateTask = (
  request: Request,
  response: Response,
  next: NextFunction
) => {
  const taskId = request.params.taskId;
  const { title, description, status, userId } = request.body;
  return TaskModel.findByIdAndUpdate(taskId, {
    title,
    description,
    status,
    userId,
  })
    .then((task) => {
      if (!task) {
        return response.status(404).json({ message: "Task not found!" });
      } else {
        return response.status(200).json({
          status: "success",
          message: "Task updated successfully",
          task: task,
        });
      }
    })
    .catch((error) => response.status(500).json({ error: error.message }));
};
const getAllTasks = (
  request: Request,
  response: Response,
  next: NextFunction
) => {
  const userId = request.query.userId as string;
  TaskModel.find({ userId })
    .exec()
    .then((tasks) => {
      return response.status(200).json({
        status: "success",
        message: "Tasks retrieved successfully",
        tasks: tasks,
      });
    })
    .catch((error) => response.status(500).json({ error: error.message }));
};

export default {
  createTask,
  deleteTask,
  updateTask,
  getAllTasks,
  getTaskById,
};
