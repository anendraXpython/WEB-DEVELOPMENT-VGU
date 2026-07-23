require("dotenv").config();
const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const Student = require("./models/Student");

const app = express();
app.use(cors());
app.use(express.json());

// connect to mongodb
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("mongodb connected"))
  .catch((err) => console.log("mongodb error:", err.message));

app.get("/", (req, res) => {
  res.send("Student Result Management API is running");
});

// get all students
app.get("/students", async (req, res) => {
  try {
    const students = await Student.find();
    res.status(200).json(students);
  } catch (err) {
    res.status(500).json({ message: "something went wrong" });
  }
});

// search students by name - this route has to be above /students/:id
// route so that "search" is not treated like an id
app.get("/students/search", async (req, res) => {
  try {
    const name = req.query.name;

    if (!name || name.trim() === "") {
      return res.status(400).json({ message: "please enter a name to search" });
    }

    const students = await Student.find({
      name: { $regex: name, $options: "i" },
    });

    res.status(200).json(students);
  } catch (err) {
    res.status(500).json({ message: "something went wrong" });
  }
});

// add a new student
app.post("/students", async (req, res) => {
  try {
    const { name, email, course, marks } = req.body;

    const newStudent = new Student({ name, email, course, marks });
    await newStudent.save();

    res.status(201).json(newStudent);
  } catch (err) {
    // duplicate email error from mongodb
    if (err.code === 11000) {
      return res.status(400).json({ message: "this email is already used" });
    }

    // validation error from mongoose
    if (err.name === "ValidationError") {
      const firstError = Object.values(err.errors)[0].message;
      return res.status(400).json({ message: firstError });
    }

    res.status(500).json({ message: "something went wrong" });
  }
});

// update a student
app.put("/students/:id", async (req, res) => {
  try {
    const { name, email, course, marks } = req.body;

    const updatedStudent = await Student.findByIdAndUpdate(
      req.params.id,
      { name, email, course, marks },
      { new: true, runValidators: true }
    );

    if (!updatedStudent) {
      return res.status(404).json({ message: "student not found" });
    }

    res.status(200).json(updatedStudent);
  } catch (err) {
    if (err.code === 11000) {
      return res.status(400).json({ message: "this email is already used" });
    }

    if (err.name === "ValidationError") {
      const firstError = Object.values(err.errors)[0].message;
      return res.status(400).json({ message: firstError });
    }

    res.status(500).json({ message: "something went wrong" });
  }
});

// delete a student
app.delete("/students/:id", async (req, res) => {
  try {
    const deletedStudent = await Student.findByIdAndDelete(req.params.id);

    if (!deletedStudent) {
      return res.status(404).json({ message: "student not found" });
    }

    res.status(200).json({ message: "student deleted" });
  } catch (err) {
    res.status(500).json({ message: "something went wrong" });
  }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log("server started on port " + PORT);
});
