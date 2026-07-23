const mongoose = require("mongoose");

// student schema
const studentSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "name is required"],
  },
  email: {
    type: String,
    required: [true, "email is required"],
    unique: true,
    match: [/^\S+@\S+\.\S+$/, "email is not valid"],
  },
  course: {
    type: String,
    required: [true, "course is required"],
  },
  marks: {
    type: Number,
    required: [true, "marks is required"],
    min: [0, "marks cannot be less than 0"],
    max: [100, "marks cannot be more than 100"],
  },
});

module.exports = mongoose.model("Student", studentSchema);
