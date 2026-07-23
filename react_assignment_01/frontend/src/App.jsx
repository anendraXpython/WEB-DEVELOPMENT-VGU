import { useState, useEffect } from "react";
import StudentForm from "./components/StudentForm";
import StudentTable from "./components/StudentTable";
import SearchBar from "./components/SearchBar";
import StatsCards from "./components/StatsCards";
import {
  getAllStudents,
  searchStudents,
  addStudent,
  editStudent,
  removeStudent,
} from "./api/studentApi";

function App() {
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [message, setMessage] = useState("");

  // load all students when the page first opens
  useEffect(() => {
    loadStudents();
  }, []);

  const loadStudents = async () => {
    setLoading(true);
    try {
      const res = await getAllStudents();
      setStudents(res.data);
    } catch (err) {
      setMessage("could not load students, is the backend running?");
    }
    setLoading(false);
  };

  const handleSave = async (data) => {
    if (selectedStudent) {
      await editStudent(selectedStudent._id, data);
      setMessage("student updated");
      setSelectedStudent(null);
    } else {
      await addStudent(data);
      setMessage("student added");
    }
    loadStudents();
  };

  const handleEdit = (student) => {
    setSelectedStudent(student);
  };

  const handleCancel = () => {
    setSelectedStudent(null);
  };

  const handleDelete = async (id) => {
    try {
      await removeStudent(id);
      setMessage("student deleted");
      loadStudents();
    } catch (err) {
      setMessage("could not delete student");
    }
  };

  const handleSearch = async (name) => {
    setLoading(true);
    try {
      const res = await searchStudents(name);
      setStudents(res.data);
    } catch (err) {
      setMessage("search failed");
    }
    setLoading(false);
  };

  const handleClearSearch = () => {
    loadStudents();
  };

  return (
    <div className="container">
      <h1>Student Results</h1>

      <StatsCards students={students} />

      <StudentForm
        selectedStudent={selectedStudent}
        onSave={handleSave}
        onCancel={handleCancel}
      />

      {message && <p className="message">{message}</p>}

      <SearchBar onSearch={handleSearch} onClear={handleClearSearch} />

      <StudentTable
        students={students}
        loading={loading}
        onEdit={handleEdit}
        onDelete={handleDelete}
      />
    </div>
  );
}

export default App;
