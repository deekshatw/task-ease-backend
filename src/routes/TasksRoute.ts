import express, { request, response } from "express";
import controller from "../controllers/TasksController";

const router = express.Router();
router.post("/create", controller.createTask);
router.delete("/delete/:taskId", controller.deleteTask);
router.patch("/update/:taskId", controller.updateTask);
router.get("/fetch-tasks", controller.getAllTasks);
router.get("/fetch-task/:taskId", controller.getTaskById);

export = router;
