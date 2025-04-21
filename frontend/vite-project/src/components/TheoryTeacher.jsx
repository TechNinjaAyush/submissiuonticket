import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

export const TheoryTeacher = () => {
    const [batches, setBatches] = useState([]);
    const [user, setUser] = useState("username");
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();
    const teacher_id = localStorage.getItem("teacher_id");

    useEffect(() => {
        const fetchData = async () => {
            try {
                setLoading(true);
                const response = await axios.get("http://localhost:3000/dashboard/teachers/theory", {
                    params: { teacher_id }
                });
                
                if (!response.data || response.data.length === 0) {
                    console.warn('No batches found for this teacher.');
                    setLoading(false);
                    return;
                }

                setBatches(response.data);
                // Get username from email (remove @gmail.com part)
                const fullEmail = response.data[0].teacher.email;
                const username = fullEmail.split('@')[0];
                setUser(username);
                setLoading(false);
            } catch (error) {
                console.error("Error fetching data:", error.response?.data || error.message);
                setLoading(false);
            }
        };

        fetchData();
    }, [teacher_id]);

    const handleLogout = () => {
        // Clear all localStorage items
        localStorage.clear();
        
        // Redirect to teacher login page
        navigate("/TeacherLogin");
    };

    const handleViewSubmissions = (className, SubjectId) => {
        localStorage.setItem('className', className); 
        localStorage.setItem('subjectId', SubjectId);
        navigate('/TheoryStudent');
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-blue-100 flex flex-col items-center justify-center">
                <div className="text-center p-8 bg-white rounded-xl shadow-lg">
                    <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-indigo-600 mx-auto mb-4"></div>
                    <h2 className="text-xl text-indigo-800 font-medium">Loading your dashboard...</h2>
                    <p className="text-gray-500 mt-2">Please wait while we fetch your class information</p>
                </div>
            </div>
        );
    }

    if (!batches.length) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-blue-100 flex flex-col items-center justify-center">
                <div className="text-center p-8 bg-white rounded-xl shadow-lg max-w-md">
                    <div className="text-indigo-600 text-6xl mb-4">📚</div>
                    <h2 className="text-2xl text-gray-800 font-semibold mb-2">No Classes Found</h2>
                    <p className="text-gray-600">You don't have any assigned theory classes at the moment.</p>
                    <button 
                        onClick={handleLogout}
                        className="mt-6 px-6 py-2 rounded-lg bg-indigo-600 text-white font-medium hover:bg-indigo-500 transition-all duration-300 shadow-md hover:shadow-lg"
                    >
                        Back to Login
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-blue-100">
            <header className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-lg">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 flex justify-between items-center">
                    <h1 className="text-2xl font-bold flex items-center space-x-3">
                        <span className="text-3xl">📚</span>
                        <span>Theory Teacher Dashboard</span>
                    </h1>
                    <div className="flex items-center space-x-6">
                        <div className="flex items-center space-x-3">
                            <div className="h-10 w-10 rounded-full bg-white/20 flex items-center justify-center text-lg font-semibold">
                                {user.charAt(0).toUpperCase()}
                            </div>
                            <span className="font-medium hidden md:inline">{user}</span>
                        </div>
                        <button 
                            onClick={handleLogout}
                            className="px-5 py-2 rounded-lg bg-white/20 hover:bg-white/30 transition-all duration-300 font-medium flex items-center space-x-2"
                        >
                            <span>Logout</span>
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                            </svg>
                        </button>
                    </div>
                </div>
            </header>

            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
                <div className="flex items-center mb-8">
                    <div className="h-10 w-2 bg-indigo-600 rounded-full mr-3"></div>
                    <h2 className="text-3xl font-bold text-gray-800">Your Classes</h2>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {batches.map((batch, index) => {
                        // Generate a pastel color based on the batch index
                        const colors = [
                            "bg-gradient-to-br from-pink-500 to-rose-500",
                            "bg-gradient-to-br from-blue-500 to-cyan-500",
                            "bg-gradient-to-br from-amber-500 to-orange-500",
                            "bg-gradient-to-br from-emerald-500 to-teal-500",
                            "bg-gradient-to-br from-violet-500 to-purple-500"
                        ];
                        const colorClass = colors[index % colors.length];

                        return (
                            <div key={index} className="transform transition-all duration-300 hover:scale-105">
                                <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
                                    <div className={`${colorClass} h-3`}></div>
                                    <div className="p-6">
                                        <div className="flex items-start justify-between mb-4">
                                            <div>
                                                <div className="flex items-center space-x-2">
                                                    <h3 className="text-2xl font-bold text-gray-800">
                                                        {batch.class.name}
                                                    </h3>
                                                </div>
                                                <p className="text-gray-600 mt-1">Subject: {batch.theorysubject.name}</p>
                                            </div>
                                            <div className={`${colorClass} text-white h-12 w-12 rounded-full flex items-center justify-center text-xl shadow-lg`}>
                                                {batch.class.name.charAt(0)}
                                            </div>
                                        </div>

                                        <div className="mt-6 space-y-3">
                                            <div className="flex items-center space-x-2">
                                                <div className="h-8 w-8 rounded-full bg-indigo-100 flex items-center justify-center">
                                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-indigo-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                                                    </svg>
                                                </div>
                                                <span className="text-gray-700">{batch.teacher.email.split('@')[0]}</span>
                                            </div>
                                            <div className="flex items-center space-x-2">
                                                <div className="h-8 w-8 rounded-full bg-indigo-100 flex items-center justify-center">
                                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-indigo-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 20l4-16m2 16l4-16M6 9h14M4 15h14" />
                                                    </svg>
                                                </div>
                                                <span className="text-gray-700">ID: {batch.theorysubject.id}</span>
                                            </div>
                                        </div>

                                        <button 
                                            onClick={() => handleViewSubmissions(
                                                batch.class.name,
                                                batch.theorysubject.id,
                                            )}
                                            className="w-full mt-8 bg-indigo-600 text-white py-3 px-4 rounded-xl font-medium hover:bg-indigo-500 transition-all duration-300 shadow-md hover:shadow-lg flex items-center justify-center space-x-2"
                                        >
                                            <span>View Submissions</span>
                                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                                            </svg>
                                        </button>
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>
            </main>

            <footer className="py-6 text-center text-gray-500">
                <p>&copy; {new Date().getFullYear()} Theory Teacher Portal</p>
            </footer>
        </div>
    );
};

export default TheoryTeacher;