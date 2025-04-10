import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

const AuditCourse = () => {
    const [batches, setBatches] = useState([]);
    
    const [loading, setLoading] = useState(true);
    const [user, setUser] = useState("Teacher");
    const navigate = useNavigate();

    useEffect(() => {
        const teacherId = localStorage.getItem("teacher_id");
        if (!teacherId) {
            navigate("/login");
            return;
        }
        
        // Fetch batches for the teacher
        const fetchBatches = async () => {
            try {
                setLoading(true);
                const response = await axios.get(`http://localhost:3000/dashboard/teachers/audit-courses/batches`, {
                    params: {
                        teacher_id: teacherId
                    }
                });
                setBatches(response.data);
                setLoading(false);
            } catch (error) {
                console.error("Error fetching batches:", error);
                toast.error("Failed to fetch batches");
                setLoading(false);
            }
        };

        fetchBatches();
    }, [navigate]);

    const handleLogout = () => {
        // Clear all localStorage items
        localStorage.clear();
        // Redirect to teacher login page
        navigate("/TeacherLogin");
    };

    const handleViewSubmissions = (batch) => {
        // Store batch in localStorage for the next page
        localStorage.setItem('audit_batch', batch);
        // Navigate to the submissions page
        navigate('/AuditSubmissions');
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center">
                <h2 className="text-lg text-gray-600">Loading batch information...</h2>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50">
            <header className="bg-indigo-600 text-white shadow-md">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
                    <h1 className="text-xl font-semibold flex items-center">
                        📚 Audit Course Dashboard
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
                <h2 className="text-2xl font-semibold text-gray-800 mb-6">Assigned Batches</h2>
                
                {batches.length === 0 ? (
                    <div className="text-center py-10 bg-white rounded-lg shadow">
                        <p className="text-gray-500">No batches assigned yet.</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {batches.map((batch, index) => (
                            <div key={index} className="max-w-2xl mx-auto">
                                <div className="bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow p-6 transform hover:-translate-y-1 transition-transform duration-200">
                                    <div className="mb-4">
                                        <div className="flex justify-between items-center mb-2">
                                            <h3 className="text-xl font-semibold text-gray-800">
                                                Batch: {batch.Batch}
                                            </h3>
                                            <span className="text-xl text-gray-500">👥</span>
                                        </div>
                                        <p className="text-gray-600">Audit Course</p>
                                    </div>
                                    <button 
                                        onClick={() => handleViewSubmissions(batch.Batch)}
                                        className="w-full bg-indigo-600 text-white py-3 px-4 rounded-lg font-medium hover:bg-indigo-500 transition-colors focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                                    >
                                        View Submissions
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </main>
        </div>
    );
};

export default AuditCourse;
