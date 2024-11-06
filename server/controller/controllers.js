const Todo = require("../schema/todo");
const User = require("../schema/user");
const multer = require("multer");
const fs = require("fs");
const path = require("path");
const http = require("http");
const { io } = require("../databaseConnection");

const parentDir = path.join(__dirname, "..");

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadFolder = path.join("uploads");

    fs.mkdirSync(uploadFolder, { recursive: true });

    cb(null, uploadFolder);
  },
  filename: (req, file, cb) => {
    cb(null, file.originalname);
  },
});

const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 },
  fileFilter: (req, file, cb) => {
    const allowedTypes = [
      "image/png",
      "image/jpg",
      "image/jpeg",
      "text/html",
      "application/pdf",
      "application/msword",
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    ];
    if (allowedTypes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(
        new Error(
          "Only .png, .jpg, .jpeg, .pdf, .doc, and .docx formats are allowed!"
        )
      );
    }
  },
});

const display_all_todos = async (req, res) => {
  try {
    const employeeId = req.body.employeeId;
    const emp = await User.find({ userId: employeeId }, { _id: 0 });
    const userId = emp[0].userId;
    const userRole = emp[0].role;
    const department = emp[0].department;

    let query = {};

    if (userRole === "admin") {
      query = {};
    } else if (userRole === "tl") {
      const teamMembers = await User.find({
        department: department,
      }).select("userId");
      if (teamMembers.length === 0) {
        return res.json([]);
      }

      query = {
        assignedTo: { $in: teamMembers.map((member) => member.userId) },
      };
    } else {
      query = { assignedTo: userId };
    }

    const allTodos = await Todo.find(query);

    res.json(allTodos);
  } catch (error) {
    console.error("Error fetching TODOS:", error);
    res.status(500).send("Error fetching TODOS");
  }
};

const get_all_employees = async (req, res) => {
  try {
    const allEmployees = await User.find({}, { _id: 0 });

    employeeArray = allEmployees.map((user) => ({
      label: user.name,
      value: user.userId,
    }));
    res.json(employeeArray);
  } catch (error) {
    console.error("Error fetching Employees:", error);
    res.status(500).send("Error fetching Employees");
  }
};

const create_Todo = async (req, res) => {
  try {
    const todoData = JSON.parse(req.body.todo);

    if (typeof todoData !== "object" || todoData === null) {
      return res.status(400).send({ error: "Invalid data format." });
    }

    const file = uploadedFile ? uploadedFile.filename : null;

    const newCreatedTodo = new Todo({
      todoId: Math.floor(Math.random() * 9000000000) + 1,
      title: todoData.title,
      description: todoData.description,
      dueDate: todoData.dueDate,
      assignedTo: todoData.assignedTo,
      comments: todoData.comments,
      priority: todoData.priority,
      status: todoData.status,
      file: file,
    });

    await newCreatedTodo.save();

    req.io.emit("taskCreated", newCreatedTodo);

    res.send(newCreatedTodo);
  } catch (error) {
    console.error("Error while creating todo:", error);
    res.status(500).send({ error: "An error occurred while creating todo." });
  }
};

const delete_todo = async (req, res) => {
  try {
    const deletedTodo = req.body.todo;

    if (deletedTodo.file) {
      const imagePath = path.join(parentDir, "uploads", deletedTodo.file);
      fs.unlink(imagePath, (err) => {
        if (err) {
          console.error("Error deleting image file:", err);
        } else {
          console.log("Image file deleted successfully");
        }
      });
    }

    await Todo.deleteOne({
      todoId: Number(deletedTodo.todoId),
    });

    const allTodo = await Todo.aggregate([{ $project: { _id: 0 } }]);

    res.json(allTodo);
  } catch (error) {
    console.error(error);
    res.status(400).json({ message: "Error deleting product" });
  }
};

const edit_todo = async (req, res) => {
  try {
    const editData = JSON.parse(req.body.todo);
    const { todoId, ...editedtodo } = editData;
    const todoToBeEdited = await Todo.findOne({
      todoId: todoId,
    });
    if (todoToBeEdited.file) {
      const imagePath = path.join(parentDir, "uploads", todoToBeEdited.file);
      fs.unlink(imagePath, (err) => {
        if (err) {
          console.error("Error deleting image file:", err);
        } else {
          console.log("Image file deleted successfully");
        }
      });
    }

    const file = req.file || "";

    const updatedtodo = {
      todoId,
      ...editedtodo,
      file: file.originalname,
    };

    await Todo.replaceOne({ todoId: todoId }, updatedtodo, {
      upsert: true,
    });
    req.io.emit("taskUpdated", updatedtodo);

    const alltodo = await Todo.find({}, { _id: 0 });
    res.send(alltodo);
  } catch (error) {
    console.error("Error in edit_todo:", error);
    res.status(400).send({ error: error.message });
  }
};

module.exports = {
  display_all_todos,
  get_all_employees,
  create_Todo,
  delete_todo,
  edit_todo,
  upload,
};
