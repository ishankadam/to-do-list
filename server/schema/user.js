const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    userId: {
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

    name: { type: String, required: true },
    email: { type: String, required: true },
    password: { type: String, required: true },
    role: { type: String, required: true },
    phone: { type: String, required: true },
    department: { type: String, required: true },
  },
  { collection: "Users" }
);

const user = mongoose.model("user", userSchema);

module.exports = user;
