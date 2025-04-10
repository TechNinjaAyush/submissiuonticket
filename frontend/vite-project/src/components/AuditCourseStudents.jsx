import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

const AuditSubmissions = () => {
    const [students, setStudents] = useState([]);
    const [loading, setLoading] = useState(true);
    const [user, setUser] = useState("Teacher");
    const navigate = useNavigate();
    const batch = localStorage.getItem("audit_batch");

    useEffect(() => {
        const fetchStudents = async () => {
            try {
                setLoading(true);
                const response = await axios.get(`http://localhost:3000/dashboard/students/audit-courses`, {
                    params: { batch }
                });
                setStudents(response.data);
                console.log("Response Data:", response.data);
                setLoading(false);
            } catch (error) {
                console.error("Error fetching students:", error);
                toast.error("Failed to fetch students");
                setLoading(false);
            }
        };

        if (batch) {
            fetchStudents();
        } else {
            navigate("/audit-course");
        }
    }, [batch, navigate]);

    const handleStatusChange = async (studentId, currentStatus) => {
        try {
            const response = await axios.put(
                "http://localhost:3000/dashboard/students/audit-courses/status",
                null,
                {
                    params: { student_id: studentId }
                }
            );

            if (response.status === 200) {
                setStudents(students.map(student =>
                    student.student_id === studentId
                        ? { ...student, status: currentStatus === "Pending" ? "Submitted" : "Pending" }
                        : student
                ));
                toast.success("Status updated successfully");
            }
        } catch (error) {
            console.error("Error updating status:", error);
            toast.error("Failed to update status");
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center">
                <h2 className="text-lg text-gray-600">Loading student information...</h2>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50">
            <header className="bg-indigo-600 text-white shadow-md">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
                    <h1 className="text-xl font-semibold flex items-center">
                        📚 Audit Course Submissions
                    </h1>
                    <div className="flex items-center space-x-4">
                        <span className="font-medium">{user}</span>
                        <button 
                            onClick={() => navigate("/AuditCourse")}
                            className="px-4 py-2 rounded-md bg-indigo-500 hover:bg-indigo-400 transition-colors"
                        >
                            Back to Dashboard
                        </button>
                    </div>
                </div>
            </header>

            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <div className="bg-white rounded-lg shadow overflow-hidden">
                    <div className="px-4 py-5 sm:px-6">
                        <h2 className="text-lg font-medium text-gray-900">Batch {batch} - Student Audit Status</h2>
                    </div>
                    
                    <div className="overflow-x-auto">
                        <table className="min-w-full divide-y divide-gray-200">
                            <thead className="bg-gray-50">
                                <tr>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Sr. No.
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Student Name
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Status
                                    </th>
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                                {students.map((student, index) => (
                                    <tr key={student.student_id} className="hover:bg-gray-50">
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                            {index + 1}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                            {student.student.name}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <button
                                                onClick={() => handleStatusChange(student.student_id, student.status)}
                                                disabled={student.status === 'Submitted'}
                                                className={`px-3 py-1 rounded-full text-sm font-medium transition-colors duration-200 ${
                                                    student.status === 'Submitted'
                                                        ? 'bg-green-100 text-green-800 cursor-not-allowed'
                                                        : 'bg-yellow-100 text-yellow-800 hover:bg-yellow-200'
                                                }`}
                                            >
                                                {student.status || 'Pending'}
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

export default AuditSubmissions; 