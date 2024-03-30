import express, { request, response } from "express";
import controller from "../controllers/UserController";

const router = express.Router();
router.post("/register", controller.registerUser);
router.post("/login", controller.loginUser);
router.delete("/delete/:userId", controller.deleteUser);
router.patch("/update/:userId", controller.updateUser);
router.get("/fetch-users", controller.getAllUsers);

export = router;
