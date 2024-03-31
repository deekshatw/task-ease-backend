import express from "express";
import http from "http";
import mongoose from "mongoose";
import { config } from "./config/config";
import Logging from "./library/Logging";
import userRoutes from "./routes/UserRoute";
import taskRoutes from "./routes/TasksRoute";

const router = express();

// Step 1: Connect to Mongo DB
mongoose
  .connect(config.mongo.url)
  .then(() => {
    Logging.info("Connected successfully to MongoDB");
    StartServer();
  })
  .catch((error) => Logging.error(error));

//   Step 2: Start the server(only if the database connection is successfully established)
const StartServer = () => {
  // Adding logs
  router.use((req, res, next) => {
    Logging.info(`Incoming -> Method: [${req.method}] URL: [${req.url}]`);

    res.on("finish", () => {
      Logging.info(
        `Incoming -> Method: [${req.method}] URL: [${req.url}] Status: [${res.statusCode}]`
      );
    });
    next();
  });

  router.use(express.urlencoded({ extended: true }));
  router.use(express.json());

  router.use((req, res, next) => {
    res.header("Access-Control-Allow-Origin", "*");
    res.header(
      "Access-Control-Allow-Headers",
      "Origin, X-Requested-With, Content-Type, Authorization, Accept"
    );
    if (req.method === "OPTIONS") {
      res.header(
        "Access-Control-Allow-Methods",
        "GET, POST, PUT, PATCH, DELETE"
      );
      return res.status(200).json();
    }
    next();
  });

  //   Step 3: Defining routes for the application
  router.get("/", (req, res, next) => {
    return res.status(200).json({ message: "Welcome to TaskEase Server:)" });
  });
  router.use("/api/user", userRoutes);
  router.use("/api/task", taskRoutes);

  // Step 4: Healthcheck
  router.get("/api/healthcheck", (req, res, next) => {
    res.status(200).json({ status: "OK" });
  });

  //   Step 5: Error handling
  router.use((req, res, next) => {
    const error = new Error("Not Found!");
    Logging.error(error);
    return res.status(404).json({ message: error.message });
  });

  //   Step 6: Starting the server
  const server = http.createServer(router);
  server.listen(config.server.port, () => {
    Logging.info(`Server is running on port ${config.server.port}`);
  });
};
