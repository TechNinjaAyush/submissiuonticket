import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const LabStudent = () => {
    const [students, setStudents] = useState([]);
    const [user, setUser] = useState("username");
    const navigate = useNavigate();
    const [batch, setBatch] = useState("");

    useEffect(() => {
        const batchname = localStorage.getItem("batchname");
        console.log("Batch:", batchname);
        setBatch(batchname);

        if (!batchname) {
            console.error("No batch found in localStorage.");
            return;
        }

        const fetchData = async () => {
            try {
                const response = await axios.get(
                    "http://localhost:3000/dashboard/students/lab",
                    {
                        params: { batch: batchname },
                    }
                );

                console.log("Response Data:", response.data);

                // Check if response.data is an array
                if (!Array.isArray(response.data)) {
                    console.warn("Response data is not an array");
                    return;
                }

                if (response.data.length === 0) {
                    console.warn("No students found for this batch.");
                    return;
                }

                setStudents(response.data);
                setUser("Lab Teacher"); // Since email is not in the response
            } catch (error) {
                console.error(
                    "Error fetching data:",
                    error.response?.data || error.message
                );
            }
        };

        fetchData();
    }, []);

    const handleStatusUpdate = async (studentId) => {
        try {
            const response = await axios.put(
                "http://localhost:3000/dashboard/students/lab/status",
                null,
                {
                    params: {
                        student_id: studentId,
                        subject_id: 1 // You might want to get this from props or state
                    }
                }
            );

            if (response.status === 200) {
                // Update the student's status in the local state
                setStudents(students.map(student => 
                    student.student_id === studentId 
                        ? { ...student, status: "Submitted" }
                        : student
                ));
                
                alert("Status updated successfully");
            }
        } catch (error) {
            console.error("Error updating status:", error);
            alert("Failed to update status");
        }
    };

    return (
        <div className="w-full min-h-screen bg-gray-50 p-4 md:p-8">
            <div className="max-w-7xl mx-auto">
                <div className="flex justify-between items-center mb-6">
                    <h2 className="text-2xl font-bold text-gray-800">Lab Students - Batch {batch}</h2>
                    <div className="flex items-center space-x-4">
                        <span className="text-gray-600">Welcome, {user}</span>
                        <button 
                            onClick={() => navigate('/LabTeacher')}
                            className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition-colors"
                        >
                            Back to Dashboard
                        </button>
                    </div>
                </div>

                <div className="overflow-x-auto bg-white rounded-lg shadow">
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Sr. No</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Student ID</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
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
                                        {student.name}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                                            student.status === 'Submitted'
                                                ? 'bg-green-100 text-green-800'
                                                : 'bg-yellow-100 text-yellow-800'
                                        }`}>
                                            {student.status}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                                        <button
                                            onClick={() => handleStatusUpdate(student.student_id)}
                                            disabled={student.status === 'Submitted'}
                                            className={`px-3 py-1 rounded-md text-sm font-medium transition-colors duration-200 ${
                                                student.status === 'Submitted'
                                                    ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                                                    : 'bg-indigo-100 text-indigo-800 hover:bg-indigo-200'
                                            }`}
                                        >
                                            {student.status === 'Submitted' ? 'Submitted' : 'Mark as Submitted'}
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default LabStudent; 