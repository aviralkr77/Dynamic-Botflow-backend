import express from "express";
import mongoose from "mongoose";
import config from "./config/dbconfig.js";
const db = config.get(process.env.NODE_ENV);
import login from "./src/routes/login.js";

const server = express();
// Set global options
// Connect to the database
mongoose
  .connect(db.DATABASE)
  .then(() => console.log("DB connected 🚀"))
  .catch((err) => console.error("DB connection error:", err));
// Middleware to parse json
server.use(express.json());
// Middleware to parse x-www-form-urlencoded
server.use(express.urlencoded({ extended: true }));

server.use("/", login);

const port = process.env.PORT || 8080;
server.listen(port, () => {
  console.log(`Server launched on ${port} 🚀 `);
});
