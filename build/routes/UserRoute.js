"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
const express_1 = __importDefault(require("express"));
const UserController_1 = __importDefault(require("../controllers/UserController"));
const router = express_1.default.Router();
router.post("/register", UserController_1.default.registerUser);
router.post("/login", UserController_1.default.loginUser);
router.delete("/delete/:userId", UserController_1.default.deleteUser);
router.patch("/update/:userId", UserController_1.default.updateUser);
router.get("/fetch-users", UserController_1.default.getAllUsers);
module.exports = router;
