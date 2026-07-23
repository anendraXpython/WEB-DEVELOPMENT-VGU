import { useState, useEffect } from "react";

function StudentForm({ selectedStudent, onSave, onCancel }) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [course, setCourse] = useState("");
  const [marks, setMarks] = useState("");
  const [error, setError] = useState("");

  // when user clicks edit, fill the form with that student's data
  useEffect(() => {
    if (selectedStudent) {
      setName(selectedStudent.name);
      setEmail(selectedStudent.email);
      setCourse(selectedStudent.course);
      setMarks(selectedStudent.marks);
    } else {
      setName("");
      setEmail("");
      setCourse("");
      setMarks("");
    }
  }, [selectedStudent]);

  const validateForm = () => {
    if (name.trim() === "") {
      setError("name cannot be empty");
      return false;
    }
    if (course.trim() === "") {
      setError("course cannot be empty");
      return false;
    }
    const emailPattern = /^\S+@\S+\.\S+$/;
    if (!emailPattern.test(email)) {
      setError("enter a valid email");
      return false;
    }
    if (marks === "" || marks < 0 || marks > 100) {
      setError("marks should be between 0 and 100");
      return false;
    }
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!validateForm()) {
      return;
    }

    const studentData = {
      name: name,
      email: email,
      course: course,
      marks: Number(marks),
    };

    try {
      await onSave(studentData);
      setName("");
      setEmail("");
      setCourse("");
      setMarks("");
    } catch (err) {
      if (err.response && err.response.data && err.response.data.message) {
        setError(err.response.data.message);
      } else {
        setError("something went wrong");
      }
    }
  };

  return (
    <form onSubmit={handleSubmit} className="student-form">
      <div className="form-row">
        <input
          placeholder="Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
        <input
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <input
          placeholder="Course"
          value={course}
          onChange={(e) => setCourse(e.target.value)}
        />
        <input
          type="number"
          placeholder="Marks"
          value={marks}
          onChange={(e) => setMarks(e.target.value)}
        />
        <button type="submit">{selectedStudent ? "Update" : "Add"}</button>
        {selectedStudent && (
          <button type="button" onClick={onCancel}>
            Cancel
          </button>
        )}
      </div>
      {error && <p className="error-text">{error}</p>}
    </form>
  );
}

export default StudentForm;
