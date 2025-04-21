import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const Labstudent = () => {
    const [students, setStudents] = useState([]);
    const [error, setError] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState("");
    const [statusFilter, setStatusFilter] = useState("all");
    const navigate = useNavigate();
    
    const batch = localStorage.getItem("batchname") || "Batch not found";
    const labSubject = localStorage.getItem("LabSubject") || localStorage.getItem("labSubject") || "1";
    
    console.log("lab subject is", labSubject);

    useEffect(() => {
        const fetchData = async () => {
            setIsLoading(true);
            try {
                const response = await axios.get("http://localhost:3000/dashboard/students/lab", {
                    params: { batch }
                });

                const studentData = response.data.students || [];
                setStudents(studentData);
                console.log("students data is" , studentData);
                setError(null);
            } catch (error) {
                console.error("Error fetching data:", error.response?.data || error.message);
                setError("Failed to fetch student data");
                setStudents([]);
            } finally {
                setIsLoading(false);
            }
        };

        fetchData();
    }, [batch]);

    const handleStatusChange = async (studentId, currentStatus) => {
        try {
            const newStatus = currentStatus === 'Pending' ? 'Submitted' : 'Pending';
            
            const response = await axios.put(
                "http://localhost:3000/dashboard/students/lab/status",
                null,
                {
                    params: {
                        student_id: studentId,
                        subject_id: labSubject
                    }
                }
            );

            if (response.status === 200) {
                // Update the local state
                setStudents(students.map(student => 
                    student.student_id === studentId 
                        ? { ...student, status: newStatus }
                        : student
                ));
            }
        } catch (error) {
            console.error("Error updating status:", error);
        }
    };

    const handleBackToDashboard = () => {
        navigate("/LabTeacher");
    };

    const handleLogout = () => {
        localStorage.clear();
        navigate("/TeacherLogin");
    };

    // Filter and search functionality
    const filteredStudents = students.filter(student => {
        const matchesSearch = student.name.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesStatus = statusFilter === "all" || student.status === statusFilter;
        return matchesSearch && matchesStatus;
    });

    const getStatusCounts = () => {
        const pending = students.filter(s => s.status === 'Pending').length;
        const submitted = students.filter(s => s.status === 'Submitted').length;
        return { pending, submitted, total: students.length };
    };

    const statusCounts = getStatusCounts();

    // Get lab subject name based on ID
    const getLabSubjectName = (id) => {
        const subjects = {
            "1": "CNSL",
            "2": "DSBDAL",
            "3": "WADL",
            "4": "CCL"
        };
        return subjects[id] || "Unknown Subject";
    };

    if (isLoading) {
        return (
            <div className="min-h-screen bg-gray-100 flex flex-col items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-600"></div>
                <h2 className="text-lg text-gray-600 mt-4">Loading student data...</h2>
            </div>
        );
    }

    if (error) {
        return (
            <div className="min-h-screen bg-gray-100 flex flex-col items-center justify-center p-4">
                <div className="bg-white rounded-lg shadow-lg p-8 max-w-md w-full text-center">
                    <div className="text-5xl mb-4 text-red-500">⚠️</div>
                    <h2 className="text-2xl font-semibold text-gray-700 mb-2">Error Loading Data</h2>
                    <p className="text-red-600 mb-4">{error}</p>
                    <button 
                        onClick={handleBackToDashboard}
                        className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-500 transition-all"
                    >
                        Back to Dashboard
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-100">
            {/* Hero Header */}
            <div className="bg-gradient-to-r from-indigo-600 to-blue-500 text-white">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="py-6 md:flex justify-between items-center">
                        <div className="flex items-center mb-4 md:mb-0">
                            <div className="bg-white p-2 rounded-lg shadow-md mr-4">
                                <span className="text-2xl">📊</span>
                            </div>
                            <div>
                                <h1 className="text-2xl font-bold">Lab Submissions Status</h1>
                                <div className="flex items-center mt-1">
                                    <span className="bg-blue-700 bg-opacity-50 px-3 py-1 rounded-full text-sm font-medium">
                                        {batch}
                                    </span>
                                    <span className="mx-2">•</span>
                                    <span className="bg-blue-700 bg-opacity-50 px-3 py-1 rounded-full text-sm font-medium">
                                        {getLabSubjectName(labSubject)}
                                    </span>
                                </div>
                            </div>
                        </div>
                        <div className="flex flex-col sm:flex-row items-center space-y-2 sm:space-y-0 sm:space-x-2">
                            <button 
                                onClick={handleBackToDashboard}
                                className="w-full sm:w-auto px-4 py-2 rounded-md bg-blue-700 hover:bg-blue-600 transition-colors shadow-md"
                            >
                                Back to Dashboard
                            </button>
                            <button 
                                onClick={handleLogout}
                                className="w-full sm:w-auto px-4 py-2 rounded-md bg-white text-indigo-700 hover:bg-indigo-50 transition-colors shadow-md"
                            >
                                Logout
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            {/* Stats Cards */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="bg-white rounded-lg shadow-md p-4 flex items-center">
                        <div className="p-3 rounded-full bg-blue-100 text-blue-600 mr-4">
                            <span className="text-xl">👥</span>
                        </div>
                        <div>
                            <p className="text-sm text-gray-500">Total Students</p>
                            <p className="text-xl font-semibold">{statusCounts.total}</p>
                        </div>
                    </div>
                    <div className="bg-white rounded-lg shadow-md p-4 flex items-center">
                        <div className="p-3 rounded-full bg-green-100 text-green-600 mr-4">
                            <span className="text-xl">✅</span>
                        </div>
                        <div>
                            <p className="text-sm text-gray-500">Submitted</p>
                            <p className="text-xl font-semibold">{statusCounts.submitted}</p>
                        </div>
                    </div>
                    <div className="bg-white rounded-lg shadow-md p-4 flex items-center">
                        <div className="p-3 rounded-full bg-yellow-100 text-yellow-600 mr-4">
                            <span className="text-xl">⌛</span>
                        </div>
                        <div>
                            <p className="text-sm text-gray-500">Pending</p>
                            <p className="text-xl font-semibold">{statusCounts.pending}</p>
                        </div>
                    </div>
                </div>
            </div>

            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {/* Search and Filter Controls */}
                <div className="mb-6 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                    <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <svg className="h-5 w-5 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clipRule="evenodd" />
                            </svg>
                        </div>
                        <input
                            type="text"
                            placeholder="Search students..."
                            className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                    <div className="flex space-x-2">
                        <button
                            className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                                statusFilter === "all" ? "bg-indigo-600 text-white" : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                            }`}
                            onClick={() => setStatusFilter("all")}
                        >
                            All
                        </button>
                        <button
                            className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                                statusFilter === "Submitted" ? "bg-green-600 text-white" : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                            }`}
                            onClick={() => setStatusFilter("Submitted")}
                        >
                            Submitted
                        </button>
                        <button
                            className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                                statusFilter === "Pending" ? "bg-yellow-600 text-white" : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                            }`}
                            onClick={() => setStatusFilter("Pending")}
                        >
                            Pending
                        </button>
                    </div>
                </div>

                {/* Student Table */}
                <div className="bg-white rounded-xl shadow-md overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="min-w-full divide-y divide-gray-200">
                            <thead className="bg-gray-50">
                                <tr>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Sr. No</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                                    <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                                    <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">Action</th>
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                                {filteredStudents.length > 0 ? (
                                    filteredStudents.map((student, index) => (
                                        <tr key={student.student_id} className="hover:bg-gray-50">
                                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                                                {index + 1}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <div className="flex items-center">
                                                    <div className="h-8 w-8 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-800 font-semibold mr-3">
                                                        {student.name.charAt(0).toUpperCase()}
                                                    </div>
                                                    <div className="text-sm font-medium text-gray-900">{student.name}</div>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-center">
                                                <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${
                                                    student.status === 'Submitted'
                                                        ? 'bg-green-100 text-green-800'
                                                        : 'bg-yellow-100 text-yellow-800'
                                                }`}>
                                                    {student.status === 'Submitted' && (
                                                        <svg className="mr-1.5 h-3 w-3 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                                                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                                                        </svg>
                                                    )}
                                                    {student.status === 'Pending' && (
                                                        <svg className="mr-1.5 h-3 w-3 text-yellow-600" fill="currentColor" viewBox="0 0 20 20">
                                                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
                                                        </svg>
                                                    )}
                                                    {student.status || 'Pending'}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-center">
                                                <button
                                                    onClick={() => handleStatusChange(student.student_id, student.status)}
                                                    className={`px-4 py-2 rounded-md transition-colors duration-200 ${
                                                        student.status === 'Submitted'
                                                            ? 'bg-yellow-500 text-white hover:bg-yellow-600'
                                                            : 'bg-green-500 text-white hover:bg-green-600'
                                                    }`}
                                                >
                                                    {student.status === 'Submitted' ? 'Mark Pending' : 'Mark Submitted'}
                                                </button>
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan="4" className="px-6 py-12 text-center">
                                            <div className="flex justify-center">
                                                <div className="text-center">
                                                    <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                                                    </svg>
                                                    <h3 className="mt-2 text-sm font-medium text-gray-900">No students found</h3>
                                                    <p className="mt-1 text-sm text-gray-500">
                                                        {searchTerm || statusFilter !== "all" ? 
                                                            "Try adjusting your search or filter criteria" : 
                                                            "No students are currently enrolled in this batch"}
                                                    </p>
                                                    {(searchTerm || statusFilter !== "all") && (
                                                        <div className="mt-3">
                                                            <button
                                                                onClick={() => {
                                                                    setSearchTerm("");
                                                                    setStatusFilter("all");
                                                                }}
                                                                className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700"
                                                            >
                                                                Clear Filters
                                                            </button>
                                                        </div>
                                                    )}
                                                </div>
                                            </div>
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </main>

            <footer className="bg-gray-50 border-t border-gray-200 mt-8">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
                    <p className="text-center text-gray-500 text-sm">
                        © {new Date().getFullYear()} Lab Management System. All rights reserved.
                    </p>
                </div>
            </footer>
        </div>
    );
};

export default Labstudent;