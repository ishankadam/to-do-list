const express = require("express");
const mongoose = require("mongoose");
require("dotenv").config();
const cors = require("cors");
const bodyParser = require("body-parser");
const path = require("path");
const app = express();
const http = require("http");
const PORT = process.env.PORT || 5000;
const server = http.createServer(app);
const socketIo = require("socket.io");

const io = socketIo(server, {
  cors: {
    origin: "http://localhost:3000",
    methods: ["GET", "POST", "PUT"],
  },
});

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(cors());
app.use(express.json());

const uri = process.env.MONGODB_URL;
mongoose.connect(uri, {});

mongoose.connection.on("connected", () => {
  console.log("Mongoose is connected!!!!");
});

app.use(require("./middlewares").global.socketIo(io));

const authRoutes = require("./routes/routes");
const todoRoutes = require("./routes/events");

app.use("/api/auth", authRoutes);
app.use("/api", todoRoutes);
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

app.use(express.static("uploads"));

app.use((error, req, res, next) => {
  const status = error.status || 500;
  const message = error.message || "Something went wrong.";
  res.status(status).json({ message: message });
});

server.listen(PORT, () => {
  console.log(`Server is starting at ${PORT}`);
});

io.on("connection", (socket) => {
  io.emit("broadcastEvent", { message: "This is a broadcast message." });
  console.log("New client connected with ID:", socket.id); // Ensure this logs when client connects
  socket.on("disconnect", () => {
    console.log("Client disconnected:", socket.id);
  });
});
