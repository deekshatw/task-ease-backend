"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const TaskModel_1 = __importDefault(require("../models/TaskModel"));
const mongoose_1 = __importDefault(require("mongoose"));
const createTask = (request, response, next) => {
    const { title, description, status, userId } = request.body;
    const task = new TaskModel_1.default({
        _id: new mongoose_1.default.Types.ObjectId(),
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
        }
        else {
            return response.status(200).json({
                status: "success",
                message: "Task created successfully",
                task: task,
            });
        }
    })
        .catch((error) => response.status(500).json({ error: error.message }));
};
const deleteTask = (request, response, next) => {
    const taskId = request.params.taskId;
    return TaskModel_1.default.findByIdAndDelete(taskId)
        .then(() => {
        return response
            .status(200)
            .json({ status: "success", message: "Task deleted successfully!" });
    })
        .catch((error) => response.status(500).json({ error: error.message }));
};
const getTaskById = (request, response, next) => {
    const taskId = request.params.taskId;
    return TaskModel_1.default.findById(taskId)
        .then((task) => {
        if (!task) {
            return response.status(404).json({ message: "Task not found!" });
        }
        else {
            return response.status(200).json({
                status: "success",
                message: "Task retrieved successfully",
                task: task,
            });
        }
    })
        .catch((error) => response.status(500).json({ error: error.message }));
};
const updateTask = (request, response, next) => {
    const taskId = request.params.taskId;
    const { title, description, status, userId } = request.body;
    return TaskModel_1.default.findByIdAndUpdate(taskId, {
        title,
        description,
        status,
        userId,
    })
        .then((task) => {
        if (!task) {
            return response.status(404).json({ message: "Task not found!" });
        }
        else {
            return response.status(200).json({
                status: "success",
                message: "Task updated successfully",
                task: task,
            });
        }
    })
        .catch((error) => response.status(500).json({ error: error.message }));
};
const getAllTasks = (request, response, next) => {
    const userId = request.query.userId;
    TaskModel_1.default.find({ userId })
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
exports.default = {
    createTask,
    deleteTask,
    updateTask,
    getAllTasks,
    getTaskById,
};
