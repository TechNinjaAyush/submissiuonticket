import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const TheoryStudent = () => {
    const [students, setStudents] = useState([]);
    const [selectedStudent, setSelectedStudent] = useState(null);
    const [selectedTest, setSelectedTest] = useState(null);
    const [newMarks, setNewMarks] = useState("");
    const [showModal, setShowModal] = useState(false);
    const [loading, setLoading] = useState(true);
    const [className, setClassName] = useState("");
    const [subjectName, setSubjectName] = useState("Theory Subject");
    const navigate = useNavigate();

    useEffect(() => {
        const fetchStudents = async () => {
            setLoading(true);
            const division = localStorage.getItem("className");
            const subjectId = localStorage.getItem("subjectId");
            
            if (division && subjectId) {
                setClassName(division);
                try {
                    const response = await axios.get('http://localhost:3000/dashboard/students/theory', {
                        params: {
                            div: division,
                            sub_id: subjectId
                        }
                    });
                    setStudents(response.data);
                    
                    // Set subject name if available in response
                    if (response.data.length > 0 && response.data[0].subject_name) {
                        setSubjectName(response.data[0].subject_name);
                    }
                    
                    setLoading(false);
                } catch (error) {
                    console.error('Error fetching students data:', error);
                    setLoading(false);
                }
            } else {
                setLoading(false);
            }
        };

        fetchStudents();
    }, []);

    const handleUpdateClick = (student, testNumber) => {
        setSelectedStudent(student);
        setSelectedTest(testNumber);
        const currentMarks = student.unitTestMarks.find(mark => mark.test_number === testNumber)?.marks || 0;
        setNewMarks(currentMarks.toString());
        setShowModal(true);
    };

    const handleUpdateMarks = async () => {
        try {
            const utMark = selectedStudent.unitTestMarks.find(mark => mark.test_number === selectedTest);
            if (!utMark) {
                console.error('UT mark not found');
                return;
            }

            await axios.put('http://localhost:3000/dashboard/students/unit-test-marks', null, {
                params: {
                    ut_id: utMark.ut_id,
                    marks: newMarks
                }
            });

            // Update local state
            setStudents(students.map(student => {
                if (student.student_id === selectedStudent.student_id) {
                    return {
                        ...student,
                        unitTestMarks: student.unitTestMarks.map(mark => 
                            mark.ut_id === utMark.ut_id 
                                ? { ...mark, marks: parseInt(newMarks) }
                                : mark
                        )
                    };
                }
                return student;
            }));

            setShowModal(false);
        } catch (error) {
            console.error('Error updating marks:', error);
        }
    };

    const handleBack = () => {
        navigate(-1);
    };

    // Function to get test status color
    const getStatusColor = (marks) => {
        if (marks >= 75) return "bg-green-100 text-green-800 border-green-200";
        if (marks >= 60) return "bg-blue-100 text-blue-800 border-blue-200";
        if (marks >= 35) return "bg-yellow-100 text-yellow-800 border-yellow-200";
        return "bg-red-100 text-red-800 border-red-200";
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-blue-100 flex flex-col items-center justify-center">
                <div className="text-center p-8 bg-white rounded-xl shadow-lg">
                    <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-indigo-600 mx-auto mb-4"></div>
                    <h2 className="text-xl text-indigo-800 font-medium">Loading student data...</h2>
                    <p className="text-gray-500 mt-2">Please wait while we fetch marks information</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-blue-100">
            <header className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-lg">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
                    <div className="flex justify-between items-center">
                        <div>
                            <button 
                                onClick={handleBack}
                                className="flex items-center space-x-2 bg-white/20 hover:bg-white/30 text-white font-medium px-3 py-1 rounded-lg transition-colors"
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                                </svg>
                                <span>Back to Dashboard</span>
                            </button>
                            <h1 className="text-2xl font-bold mt-2 flex items-center space-x-3">
                                <span className="text-3xl">📝</span>
                                <span>Theory Test Marks</span>
                            </h1>
                        </div>
                        <div className="text-right">
                            <div className="text-white/80">Class</div>
                            <div className="text-xl font-semibold">{className}</div>
                            <div className="text-white/80 mt-1">Subject</div>
                            <div className="text-lg font-medium">{subjectName}</div>
                        </div>
                    </div>
                </div>
            </header>

            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <div className="bg-white rounded-xl shadow-lg overflow-hidden mb-8">
                    <div className="p-6 bg-gradient-to-r from-indigo-500 to-purple-500 text-white">
                        <h2 className="text-xl font-bold flex items-center">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                            </svg>
                            Student Unit Test Marks
                        </h2>
                        <p className="text-white/80 mt-1">
                            Manage and update unit test marks for all students in {className}
                        </p>
                    </div>

                    {students.length === 0 ? (
                        <div className="p-8 text-center">
                            <div className="text-indigo-600 text-5xl mb-4">📊</div>
                            <h3 className="text-xl font-semibold text-gray-800 mb-2">No Student Data Available</h3>
                            <p className="text-gray-600">There are no students or test data available for this class.</p>
                        </div>
                    ) : (
                        <div className="overflow-x-auto">
                            <table className="w-full">
                                <thead>
                                    <tr className="bg-gray-50">
                                        <th className="px-6 py-4 text-left text-sm font-semibold text-gray-600 uppercase tracking-wider border-b">Sr. No.</th>
                                        <th className="px-6 py-4 text-left text-sm font-semibold text-gray-600 uppercase tracking-wider border-b">Student Name</th>
                                        <th className="px-6 py-4 text-center text-sm font-semibold text-gray-600 uppercase tracking-wider border-b">UT-1</th>
                                        <th className="px-6 py-4 text-center text-sm font-semibold text-gray-600 uppercase tracking-wider border-b">UT-2</th>
                                        <th className="px-6 py-4 text-center text-sm font-semibold text-gray-600 uppercase tracking-wider border-b">UT-3</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-200">
                                    {students.map((student, index) => {
                                        const ut1 = student.unitTestMarks.find(mark => mark.test_number === "UT1")?.marks || 0;
                                        const ut2 = student.unitTestMarks.find(mark => mark.test_number === "UT2")?.marks || 0;
                                        const ut3 = student.unitTestMarks.find(mark => mark.test_number === "UT3")?.marks || 0;

                                        return (
                                            <tr key={student.student_id} className="hover:bg-gray-50 transition-colors">
                                                <td className="px-6 py-4 whitespace-nowrap text-gray-500">{index + 1}</td>
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <div className="flex items-center">
                                                        <div className="h-10 w-10 rounded-full bg-gradient-to-br from-indigo-400 to-purple-500 flex items-center justify-center text-white font-medium">
                                                            {student.name.charAt(0).toUpperCase()}
                                                        </div>
                                                        <div className="ml-3">
                                                            <div className="text-sm font-medium text-gray-900">{student.name}</div>
                                                            <div className="text-sm text-gray-500">ID: {student.student_id}</div>
                                                        </div>
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <div className="flex flex-col items-center">
                                                        <span className={`px-3 py-1 inline-flex text-sm rounded-full font-medium ${getStatusColor(ut1)} border`}>
                                                            {ut1}/30
                                                        </span>
                                                        <button 
                                                            onClick={() => handleUpdateClick(student, "UT1")}
                                                            className="mt-2 text-indigo-600 hover:text-indigo-900 text-sm font-medium flex items-center"
                                                        >
                                                            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                                                            </svg>
                                                            Update
                                                        </button>
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <div className="flex flex-col items-center">
                                                        <span className={`px-3 py-1 inline-flex text-sm rounded-full font-medium ${getStatusColor(ut2)} border`}>
                                                            {ut2}/30
                                                        </span>
                                                        <button 
                                                            onClick={() => handleUpdateClick(student, "UT2")}
                                                            className="mt-2 text-indigo-600 hover:text-indigo-900 text-sm font-medium flex items-center"
                                                        >
                                                            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                                                            </svg>
                                                            Update
                                                        </button>
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <div className="flex flex-col items-center">
                                                        <span className={`px-3 py-1 inline-flex text-sm rounded-full font-medium ${getStatusColor(ut3)} border`}>
                                                            {ut3}/30
                                                        </span>
                                                        <button 
                                                            onClick={() => handleUpdateClick(student, "UT3")}
                                                            className="mt-2 text-indigo-600 hover:text-indigo-900 text-sm font-medium flex items-center"
                                                        >
                                                            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                                                            </svg>
                                                            Update
                                                        </button>
                                                    </div>
                                                </td>
                                            </tr>
                                        );
                                    })}
                                </tbody>
                            </table>
                        </div>
                    )}
                </div>
            </main>

            <footer className="py-6 text-center text-gray-500">
                <p>&copy; {new Date().getFullYear()} Theory Teacher Portal</p>
            </footer>

            {/* Update Marks Modal */}
            {showModal && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white rounded-xl shadow-xl max-w-md w-full p-6 animate-fade-in">
                        <div className="flex justify-between items-center mb-4">
                            <h3 className="text-xl font-bold text-gray-800">
                                Update {selectedTest} Marks
                            </h3>
                            <button 
                                onClick={() => setShowModal(false)}
                                className="text-gray-400 hover:text-gray-600"
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            </button>
                        </div>
                        <div className="mb-4">
                            <div className="flex items-center mb-4">
                                <div className="h-10 w-10 rounded-full bg-gradient-to-br from-indigo-400 to-purple-500 flex items-center justify-center text-white font-medium">
                                    {selectedStudent?.name.charAt(0).toUpperCase()}
                                </div>
                                <div className="ml-3">
                                    <div className="text-lg font-medium text-gray-900">{selectedStudent?.name}</div>
                                    <div className="text-sm text-gray-500">Student ID: {selectedStudent?.student_id}</div>
                                </div>
                            </div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Enter Marks for {selectedTest}
                            </label>
                            <input
                                type="number"
                                value={newMarks}
                                onChange={(e) => setNewMarks(e.target.value)}
                                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-lg"
                                min="0"
                                max="100"
                            />
                            <div className="text-sm text-gray-500 mt-2">
                                Enter a value between 0 and 30
                            </div>
                        </div>
                        <div className="flex justify-end gap-3">
                            <button
                                onClick={() => setShowModal(false)}
                                className="px-4 py-2 text-gray-600 hover:text-gray-800 font-medium"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleUpdateMarks}
                                className="px-4 py-2 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-lg hover:from-indigo-500 hover:to-purple-500 font-medium"
                            >
                                Save Changes
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default TheoryStudent;