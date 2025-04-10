import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const CCDashboard = () => {
    const [division, setDivision] = useState(null);
    const [email, setEmail] = useState(null);
    const [user, setUser] = useState("username"); // Default placeholder
    const navigate = useNavigate();

    useEffect(() => {
        const teacher_id = localStorage.getItem('teacher_id');
        console.log('Teacher ID:', teacher_id);

        if (!teacher_id) {
            console.error('No teacher ID found in localStorage.');
            return;
        }

        const fetchData = async () => {
            try {
                const response = await axios.get('http://localhost:3000/dashboard/class-coordinator/divisions', {
                    params: { teacher_id },
                });

                console.log("Response Data:", response.data);

                if (!response.data || !response.data.divisions || response.data.divisions.length === 0) {
                    console.warn('No divisions found for this teacher.');
                    return;
                }

                // Extract data
                setDivision(response.data.divisions[0]); 
                localStorage.setItem('division', response.data.divisions[0].Div); // Store division in localStorage
                setEmail(response.data.email.email); // Extract email string
                setUser(response.data.email.email); 
            } catch (error) {
                console.error('Error fetching data:', error.response?.data || error.message);
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

    const handleViewSubmissions = () => {
        navigate('/division-students'); // Navigate to the DivisionStudents component
    };

    if (!division) {
        return (
            <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center">
                <h2 className="text-lg text-gray-600">Loading division information...</h2>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50">
            <header className="bg-indigo-600 text-white shadow-md">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
                    <h1 className="text-xl font-semibold flex items-center">
                        📚 Class Coordinator Dashboard
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
                <h2 className="text-2xl font-semibold text-gray-800 mb-6">Assigned Division</h2>
                <div className="max-w-2xl mx-auto">
                    <div className="bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow p-6 transform hover:-translate-y-1 transition-transform duration-200">
                        <div className="mb-4">
                            <div className="flex justify-between items-center mb-2">
                                <h3 className="text-xl font-semibold text-gray-800">
                                    Division : {division.Div}
                                </h3>
                                <span className="text-xl text-gray-500">👥</span>
                            </div>
                            <p className="text-gray-600">Assigned Email: {email}</p>
                        </div>
                        <button 
                            onClick={handleViewSubmissions}
                            className="w-full bg-indigo-600 text-white py-3 px-4 rounded-lg font-medium hover:bg-indigo-500 transition-colors focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                        >
                            View Submissions
                        </button>
                    </div>
                </div>
            </main>
        </div>
    );
};

export default CCDashboard;
