const express = require("express");
const cors = require("cors");
const router = express.Router();
const controller = require("../controller/controllers");
const { checkAuth } = require("../auth");

const corsOptions = {
  origin: `http://localhost:3000`,
  methods: ["GET", "POST", "PUT", "DELETE"],
  allowedHeaders: ["Content-Type", "Authorization"],
};

router.use(cors(corsOptions));
router.use(express.json());

router.use(checkAuth);

router.post("/todos", controller.display_all_todos);
router.get("/employees", controller.get_all_employees);
router.post(
  "/createTodo",
  controller.upload.single("file"),
  controller.create_Todo
);
router.delete("/deleteTodo", controller.delete_todo);
router.put("/editTodo", controller.upload.single("file"), controller.edit_todo);
router.use((error, req, res, next) => {
  const status = error.status || 500;
  const message = error.message || "Something went wrong.";
  res.status(status).json({ message: message });
});

module.exports = router;
