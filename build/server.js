"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const http_1 = __importDefault(require("http"));
const mongoose_1 = __importDefault(require("mongoose"));
const config_1 = require("./config/config");
const Logging_1 = __importDefault(require("./library/Logging"));
const UserRoute_1 = __importDefault(require("./routes/UserRoute"));
const TasksRoute_1 = __importDefault(require("./routes/TasksRoute"));
const router = (0, express_1.default)();
// Step 1: Connect to Mongo DB
mongoose_1.default
    .connect(config_1.config.mongo.url)
    .then(() => {
    Logging_1.default.info("Connected successfully to MongoDB");
    StartServer();
})
    .catch((error) => Logging_1.default.error(error));
//   Step 2: Start the server(only if the database connection is successfully established)
const StartServer = () => {
    // Adding logs
    router.use((req, res, next) => {
        Logging_1.default.info(`Incoming -> Method: [${req.method}] URL: [${req.url}]`);
        res.on("finish", () => {
            Logging_1.default.info(`Incoming -> Method: [${req.method}] URL: [${req.url}] Status: [${res.statusCode}]`);
        });
        next();
    });
    router.use(express_1.default.urlencoded({ extended: true }));
    router.use(express_1.default.json());
    router.use((req, res, next) => {
        res.header("Access-Control-Allow-Origin", "*");
        res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Authorization, Accept");
        if (req.method === "OPTIONS") {
            res.header("Access-Control-Allow-Methods", "GET, POST, PUT, PATCH, DELETE");
            return res.status(200).json();
        }
        next();
    });
    //   Step 3: Defining routes for the application
    router.get("/", (req, res, next) => {
        return res.status(200).json({ message: "Welcome to TaskEase Server:)" });
    });
    router.use("/user", UserRoute_1.default);
    router.use("/task", TasksRoute_1.default);
    // Step 4: Healthcheck
    router.get("/api/healthcheck", (req, res, next) => {
        res.status(200).json({ status: "OK" });
    });
    //   Step 5: Error handling
    router.use((req, res, next) => {
        const error = new Error("Not Found!");
        Logging_1.default.error(error);
        return res.status(404).json({ message: error.message });
    });
    //   Step 6: Starting the server
    const server = http_1.default.createServer(router);
    server.listen(config_1.config.server.port, () => {
        Logging_1.default.info(`Server is running on port ${config_1.config.server.port}`);
    });
};
