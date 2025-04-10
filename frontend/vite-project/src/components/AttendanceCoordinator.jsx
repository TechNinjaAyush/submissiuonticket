import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const AttendanceCoordinator = () => {
  const [students, setStudents] = useState([]);
  const [user, setUser] = useState("username");
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const teacher_id = localStorage.getItem("teacher_id");
        if (!teacher_id) {
          console.error("No teacher ID found in localStorage.");
          return;
        }

        const response = await axios.get("http://localhost:3000/dashboard/attendance-coordinator/students", {
          params: { teacher_id },
        });

        if (!response.data || !response.data.students || response.data.students.length === 0) {
          console.warn("No students found for this teacher.");
          return;
        }

        setStudents(response.data.students);
        console.log("students are ", response.data.students);
      } catch (error) {
        console.error("Error fetching data:", error.response?.data || error.message);
      }
    };

    fetchData();
  }, []);

  const handleLogout = () => {
    // Clear all localStorage items
    localStorage.clear();
    // Redirect to teacher login page
    navigate("/TeacherLogin");
  };

  const handleStatusChange = async (studentId, currentStatus) => {
    try {
      const response = await axios.put(
        "http://localhost:3000/dashboard/attendance-coordinator/status",
        null,
        {
          params: { student_id: studentId },
        }
      );

      if (response.data) {
        // Update the local state to reflect the change
        setStudents((prevStudents) =>
          prevStudents.map((student) =>
            student.student_id === studentId
              ? {
                  ...student,
                  attendance_status:
                    currentStatus === "Present" ? "Pending" : "Present",
                }
              : student
          )
        );
      }
    } catch (error) {
      console.error("Error updating attendance status:", error);
      alert("Failed to update attendance status");
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-indigo-600 text-white shadow-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
          <h1 className="text-xl font-semibold flex items-center">
            📊 Attendance Coordinator Dashboard
          </h1>
          <div className="flex items-center space-x-4">
            <span className="font-medium">{user}</span>
            <button 
              onClick={handleLogout}
              className="px-4 py-2 rounded-md bg-indigo-500 hover:bg-indigo-400 transition-colors"
            >
              Logout
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <h2 className="text-2xl font-semibold text-gray-800 mb-6">Student Attendance</h2>
        <div className="bg-white rounded-xl shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Sr. No</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Student ID</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Attendance Status</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {students.map((student, index) => (
                  <tr key={student.student_id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {index + 1}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {student.student_id}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {student.student.name}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <button
                        onClick={() => handleStatusChange(student.student_id, student.attendance_status)}
                        className={`px-3 py-1 rounded-full text-sm font-medium transition-colors duration-200 ${
                          student.attendance_status === 'Present'
                            ? 'bg-green-100 text-green-800 hover:bg-green-200'
                            : 'bg-yellow-100 text-yellow-800 hover:bg-yellow-200'
                        }`}
                      >
                        {student.attendance_status || 'Mark Present'}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </main>
    </div>
  );
};

export default AttendanceCoordinator;
