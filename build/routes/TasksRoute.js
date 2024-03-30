"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
const express_1 = __importDefault(require("express"));
const TasksController_1 = __importDefault(require("../controllers/TasksController"));
const router = express_1.default.Router();
router.post("/create", TasksController_1.default.createTask);
router.delete("/delete/:taskId", TasksController_1.default.deleteTask);
router.patch("/update/:taskId", TasksController_1.default.updateTask);
router.get("/fetch-tasks", TasksController_1.default.getAllTasks);
router.get("/fetch-task/:taskId", TasksController_1.default.getTaskById);
module.exports = router;
