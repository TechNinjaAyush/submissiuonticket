import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const LabTeacherDashboard = () => {
    const [batches, setBatches] = useState([]);
    const [user, setUser] = useState("username");
    const [email, setEmail] = useState(null);
    const [subject, setSubject] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        const fetch_data = async () => {
            try {
                const teacher_id = localStorage.getItem('teacher_id');
                console.log('Teacher ID:', teacher_id);
                if (!teacher_id) {
                    console.error('No teacher ID found in localStorage.');
                    setIsLoading(false);
                    return;
                }
                const response = await axios.get('http://localhost:3000/dashboard/teachers/lab', {
                    params: { teacher_id },
                });
                console.log("Response Data:", response.data);
                
                if (!response.data || response.data.length === 0) {
                    console.warn('No batches found for this teacher.');
                    setIsLoading(false);
                    return;
                }
                
                setBatches(response.data);
                // Get username from email (remove @gmail.com part)
                const fullEmail = response.data[0].teacher.email;
                const username = fullEmail.split('@')[0];
                setUser(username);
                setEmail(fullEmail);
                // Set subject from the first batch's lab subject
                setSubject(response.data[0].labsubjects.name);
            } catch (error) {
                console.error('Error fetching data:', error.response?.data || error.message);
            } finally {
                setIsLoading(false);
            }
        };
        fetch_data();
    }, []);

    const handleLogout = () => {
        // Clear all localStorage items
        localStorage.clear();
        // Redirect to teacher login page
        navigate("/TeacherLogin");
    };

    const handleViewSubmissions = (batchname, labSubject) => {
        // Navigate to submissions page or show modal
        console.log('View submissions for batch:', batchname);
        localStorage.setItem('batchname', batchname); // Store batch name in localStorage
        
        const labSubjectMap = {
            "CCL": 4,
            "CNSL": 1,
            "DSBDAL": 2,
            "WADL": 3
        };
        
        if (labSubjectMap[labSubject]) {
            const key = labSubject === "CCL" || labSubject === "CNSL" ? 'labSubject' : 'LabSubject';
            localStorage.setItem(key, labSubjectMap[labSubject]);
            console.log(`lab subject is ${labSubject}`);
        }

        navigate('/Labstudent'); // Navigate to the LabSubmissions component
    };

    const getSubjectIcon = (subjectName) => {
        const icons = {
            "CCL": "🔬",
            "CNSL": "🖥️",
            "DSBDAL": "📊", 
            "WADL": "🌐",
            "default": "📚"
        };
        return icons[subjectName] || icons.default;
    };

    const getRandomGradient = (index) => {
        const gradients = [
            "from-blue-500 to-indigo-600",
            "from-purple-500 to-indigo-600",
            "from-green-500 to-teal-600",
            "from-pink-500 to-rose-600",
            "from-yellow-500 to-amber-600"
        ];
        return gradients[index % gradients.length];
    };

    if (isLoading) {
        return (
            <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-600"></div>
                <h2 className="text-lg text-gray-600 mt-4">Loading batch information...</h2>
            </div>
        );
    }

    if (!batches.length) {
        return (
            <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-4">
                <div className="bg-white rounded-lg shadow-lg p-8 max-w-md w-full text-center">
                    <div className="text-5xl mb-4">📋</div>
                    <h2 className="text-2xl font-semibold text-gray-700 mb-2">No Batches Found</h2>
                    <p className="text-gray-500">No lab batches are currently assigned to you.</p>
                    <button 
                        onClick={handleLogout}
                        className="mt-6 px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-500 transition-all"
                    >
                        Back to Login
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-100">
            {/* Hero Header */}
            <div className="bg-gradient-to-r from-indigo-600 to-purple-700 text-white">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="py-6 md:py-8 flex flex-col md:flex-row justify-between items-center">
                        <div className="flex items-center mb-4 md:mb-0">
                            <div className="bg-white p-2 rounded-lg shadow-md mr-4">
                                <span className="text-2xl">🧪</span>
                            </div>
                            <div>
                                <h1 className="text-2xl md:text-3xl font-bold">Lab Teacher Dashboard</h1>
                                <p className="text-indigo-100">Welcome back, {user}!</p>
                            </div>
                        </div>
                        <div className="flex items-center space-x-2">
                            <div className="hidden md:block bg-indigo-800 bg-opacity-50 py-2 px-4 rounded-lg">
                                <p className="text-sm text-indigo-100">{email}</p>
                                <p className="text-sm font-medium">{subject} Instructor</p>
                            </div>
                            <button 
                                onClick={handleLogout}
                                className="px-4 py-2 rounded-md bg-white text-indigo-700 hover:bg-indigo-50 transition-colors font-medium shadow-md"
                            >
                                Logout
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            {/* Stats Cards Row */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="bg-white rounded-lg shadow-md p-4 flex items-center">
                        <div className="p-3 rounded-full bg-blue-100 text-blue-600 mr-4">
                            <span className="text-xl">👥</span>
                        </div>
                        <div>
                            <p className="text-sm text-gray-500">Total Batches</p>
                            <p className="text-xl font-semibold">{batches.length}</p>
                        </div>
                    </div>
                    <div className="bg-white rounded-lg shadow-md p-4 flex items-center">
                        <div className="p-3 rounded-full bg-purple-100 text-purple-600 mr-4">
                            <span className="text-xl">📚</span>
                        </div>
                        <div>
                            <p className="text-sm text-gray-500">Subject</p>
                            <p className="text-xl font-semibold">{subject}</p>
                        </div>
                    </div>
                    <div className="bg-white rounded-lg shadow-md p-4 flex items-center">
                        <div className="p-3 rounded-full bg-green-100 text-green-600 mr-4">
                            <span className="text-xl">📅</span>
                        </div>
                        <div>
                            <p className="text-sm text-gray-500">Today's Date</p>
                            <p className="text-xl font-semibold">{new Date().toLocaleDateString()}</p>
                        </div>
                    </div>
                </div>
            </div>

            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <div className="flex items-center justify-between mb-6">
                    <h2 className="text-2xl font-bold text-gray-800">Your Assigned Batches</h2>
                    <div className="bg-indigo-50 py-1 px-3 rounded-full text-indigo-700 text-sm font-medium">
                        {batches.length} active {batches.length === 1 ? 'batch' : 'batches'}
                    </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {batches.map((batch, index) => (
                        <div key={index} className="group">
                            <div className="bg-white rounded-xl shadow-sm hover:shadow-lg transition-all duration-300 overflow-hidden h-full flex flex-col">
                                <div className={`bg-gradient-to-r ${getRandomGradient(index)} h-3`}></div>
                                <div className="p-6 flex-grow">
                                    <div className="flex justify-between items-start mb-4">
                                        <h3 className="text-xl font-bold text-gray-800 group-hover:text-indigo-600 transition-colors">
                                            {batch.batch.name}
                                        </h3>
                                        <span className="text-2xl" title={batch.labsubjects.name}>
                                            {getSubjectIcon(batch.labsubjects.name)}
                                        </span>
                                    </div>
                                    
                                    <div className="space-y-2 mb-6">
                                        <div className="flex items-center text-gray-600">
                                            <span className="w-5 text-indigo-500 mr-2">📚</span>
                                            <span>Subject: <span className="font-medium">{batch.labsubjects.name}</span></span>
                                        </div>
                                        <div className="flex items-center text-gray-600">
                                            <span className="w-5 text-indigo-500 mr-2">👨‍🏫</span>
                                            <span>Teacher: <span className="font-medium">{batch.teacher.email.split('@')[0]}</span></span>
                                        </div>
                                        <div className="flex items-center text-gray-600">
                                            <span className="w-5 text-indigo-500 mr-2">🆔</span>
                                            <span>Batch ID: <span className="font-medium">{batch.batch_id}</span></span>
                                        </div>
                                    </div>
                                </div>
                                
                                <div className="px-6 pb-6">
                                    <button 
                                        onClick={() => handleViewSubmissions(batch.batch.name, batch.labsubjects.name)}
                                        className="w-full bg-indigo-600 text-white py-3 px-4 rounded-lg font-medium hover:bg-indigo-500 transition-colors flex justify-center items-center space-x-2 group-hover:shadow-md"
                                    >
                                        <span>View Submissions</span>
                                        <span className="transform group-hover:translate-x-1 transition-transform">→</span>
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
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

export default LabTeacherDashboard;