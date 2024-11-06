const mongoose = require("mongoose");

const todoSchema = new mongoose.Schema(
  {
    todoId: {
      type: Number,
      required: true,
      unique: true,
      validate: {
        validator: function (v) {
          if (typeof v === "string" || v instanceof String) {
            return false;
          }
        },
        message: "Value is not a  number",
      },
    },

    title: { type: String, required: true },
    description: { type: String, required: true },
    dueDate: { type: String, required: true },
    priority: { type: String, required: true },
    assignedTo: { type: Number, required: true },
    status: { type: String, required: true },
    comments: { type: Array },
    file: { type: String },
  },
  { collection: "Todo" }
);

const Todo = mongoose.model("todo", todoSchema);

module.exports = Todo;
