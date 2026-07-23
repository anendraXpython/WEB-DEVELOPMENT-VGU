function StudentTable({ students, loading, onEdit, onDelete }) {
  if (loading) {
    return <p>Loading students...</p>;
  }

  if (students.length === 0) {
    return <p>No students found.</p>;
  }

  const handleDelete = (student) => {
    const sure = window.confirm("Are you sure you want to delete " + student.name + "?");
    if (sure) {
      onDelete(student._id);
    }
  };

  return (
    <table className="student-table">
      <thead>
        <tr>
          <th>Name</th>
          <th>Email</th>
          <th>Course</th>
          <th>Marks</th>
          <th>Result</th>
          <th></th>
        </tr>
      </thead>
      <tbody>
        {students.map((student) => (
          <tr key={student._id}>
            <td>{student.name}</td>
            <td>{student.email}</td>
            <td>{student.course}</td>
            <td>{student.marks}</td>
            <td>{student.marks >= 40 ? "Pass" : "Fail"}</td>
            <td className="actions">
              <button onClick={() => onEdit(student)}>Edit</button>
              <button onClick={() => handleDelete(student)}>Delete</button>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}

export default StudentTable;
