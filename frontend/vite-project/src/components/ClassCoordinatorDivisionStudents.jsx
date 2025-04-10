import React from "react";
import { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const CCDivisionStudents = () => {
    const [students, setStudents] = useState([]);
    const navigate = useNavigate();
    
    useEffect(() => {
        const division = localStorage.getItem("division");
        console.log("Division:", division);
        
        if (!division) {
            console.error("No division found in localStorage.");
            return;
        }
    
        const fetchData = async () => {
            try {
                const response = await axios.get(
                    "http://localhost:3000/dashboard/class-coordinator/students",
                    {
                        params: { Division: division },
                    }
                );
        
                console.log("Response Data:", response.data);
        
                if (
                    !response.data ||
                    !response.data.students ||
                    response.data.students.length === 0
                ) {
                    console.warn("No students found for this division.");
                    return;
                }
        
                setStudents(response.data.students);
            } catch (error) {
                console.error(
                    "Error fetching data:",
                    error.response?.data || error.message
                );
            }
        };
    
        fetchData();
    }, []);

    const handleStatusChange = async (studentId, field) => {
        try {
            let endpoint = "";
            
            // Determine which endpoint to use based on the field
            if (field === 'feedback_status') {
                
                endpoint = "http://localhost:3000/dashboard/class-coordinator/Feedbackstatus";
            } else if (field === 'final_submission_status') {
                endpoint = "http://localhost:3000/dashboard/class-coordinator/submission-status";
            } else {
                console.error("Invalid field for status update");
                return;
            }
            
            // Make API call to update the status with student_id as query parameter
            const response = await axios.put(
                endpoint,
                {},
                {
                    params: { student_id: studentId }
                }
            );

            if (response.status === 200) {
                // Update the specific status that was changed
                setStudents(students.map(student => 
                    student.student_id === studentId 
                        ? { 
                            ...student, 
                            [field]: field === 'feedback_status' ? 'Submitted' : 'Completed'
                        }
                        : student
                ));
            }
        } catch (error) {
            console.error("Error updating status:", error);
        }
    };

    return (
        <div className="w-full min-h-screen bg-gray-50 p-4 md:p-8">
            <div className="max-w-7xl mx-auto">
                <h2 className="text-2xl font-bold mb-6 text-gray-800">Student List</h2>
                <div className="overflow-x-auto bg-white rounded-lg shadow">
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Sr. No</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Student Name</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Feedback Status</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Final Submission</th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {students.map((student, index) => (
                                <tr key={student.student_id} className="hover:bg-gray-50">
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                        {index + 1}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                        {student.name}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <button
                                            onClick={() => handleStatusChange(student.student_id, 'feedback_status')}
                                            className={`px-3 py-1 rounded-full text-sm font-medium transition-colors duration-200 ${
                                                student.feedback_status === 'Submitted'
                                                    ? 'bg-green-100 text-green-800 hover:bg-green-200'
                                                    : 'bg-yellow-100 text-yellow-800 hover:bg-yellow-200'
                                            }`}
                                        >
                                            {student.feedback_status || 'Pending'}
                                        </button>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <button
                                            onClick={() => handleStatusChange(student.student_id, 'final_submission_status')}
                                            className={`px-3 py-1 rounded-full text-sm font-medium transition-colors duration-200 ${
                                                student.final_submission_status === 'Completed'
                                                    ? 'bg-green-100 text-green-800 hover:bg-green-200'
                                                    : 'bg-yellow-100 text-yellow-800 hover:bg-yellow-200'
                                            }`}
                                        >
                                            {student.final_submission_status || 'Pending'}
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
}

export default CCDivisionStudents;