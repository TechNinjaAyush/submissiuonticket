import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const StudentDashboard = () => {
  const [studentData, setStudentData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchStudentData = async () => {
      try {
        const student_id = localStorage.getItem("student_id");
        if (!student_id) {
          setError("Student ID not found");
          setLoading(false);
          return;
        }

        const response = await axios.get("http://localhost:3000/dashboard/students", {
          params: { student_id },
        });

        setStudentData(response.data);
        setLoading(false);
      } catch (err) {
        setError(err.response?.data?.message || "Failed to fetch student data");
        setLoading(false);
      }
    };

    fetchStudentData();
  }, []);

  const handleLogout = () => {
    localStorage.clear();
    navigate("/StudentLogin");
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 flex items-center justify-center">
        <div className="flex flex-col items-center">
          <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-indigo-600 mb-4"></div>
          <p className="text-indigo-800 font-medium">Loading your dashboard...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 flex items-center justify-center">
        <div className="bg-white border-l-4 border-red-500 rounded-lg shadow-lg p-6 max-w-md">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <svg className="h-8 w-8 text-red-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
            </div>
            <div className="ml-3">
              <h3 className="text-lg font-medium text-red-800">Error</h3>
              <p className="text-red-600">{error}</p>
              <button 
                onClick={() => navigate("/StudentLogin")} 
                className="mt-3 bg-red-100 hover:bg-red-200 text-red-800 font-medium py-2 px-4 rounded-md transition-colors"
              >
                Return to Login
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Get the first name for personalized greeting
  const firstName = studentData?.name ? studentData.name.split(' ')[0] : "Student";

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 p-6">
      {/* Header with profile card */}
      <div className="bg-white rounded-xl shadow-lg p-6 mb-8 border border-indigo-100">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div className="flex items-center">
            <div className="bg-indigo-600 text-white rounded-full h-12 w-12 flex items-center justify-center text-xl font-bold mr-4">
              {firstName.charAt(0)}
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-800">Welcome, {firstName}!</h1>
              <p className="text-gray-500">Student Dashboard</p>
            </div>
          </div>
          <button
            onClick={handleLogout}
            className="px-5 py-2.5 bg-gradient-to-r from-red-500 to-pink-600 text-white rounded-lg shadow-md hover:shadow-lg transition-all flex items-center"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
            </svg>
            Logout
          </button>
        </div>
        
        <div className="mt-6 grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="bg-blue-50 rounded-lg p-4 border border-blue-100">
            <h2 className="text-xs uppercase tracking-wider text-blue-700 font-semibold">Name</h2>
            <p className="text-lg font-semibold text-gray-800 mt-1">{studentData?.name || 'N/A'}</p>
          </div>
          <div className="bg-purple-50 rounded-lg p-4 border border-purple-100">
            <h2 className="text-xs uppercase tracking-wider text-purple-700 font-semibold">Roll No</h2>
            <p className="text-lg font-semibold text-gray-800 mt-1">{studentData?.roll_no || 'N/A'}</p>
          </div>
          <div className="bg-teal-50 rounded-lg p-4 border border-teal-100">
            <h2 className="text-xs uppercase tracking-wider text-teal-700 font-semibold">Division</h2>
            <p className="text-lg font-semibold text-gray-800 mt-1">{studentData?.div || 'N/A'}</p>
          </div>
          <div className="bg-amber-50 rounded-lg p-4 border border-amber-100">
            <h2 className="text-xs uppercase tracking-wider text-amber-700 font-semibold">Batch</h2>
            <p className="text-lg font-semibold text-gray-800 mt-1">{studentData?.batch || 'N/A'}</p>
          </div>
        </div>
      </div>

      {/* Main content */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        <div className="lg:col-span-8">
          {/* Unit Test Marks Card */}
          <div className="bg-white rounded-xl shadow-lg p-6 mb-8 border border-indigo-100">
            <div className="flex items-center mb-4">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-indigo-600 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
              </svg>
              <h2 className="text-xl font-bold text-gray-800">Unit Test Marks</h2>
            </div>
            <div className="overflow-x-auto">
              <table className="min-w-full bg-white">
                <thead>
                  <tr className="bg-gradient-to-r from-indigo-500 to-blue-500 text-white">
                    <th className="py-3 px-6 text-left rounded-tl-lg">Subject</th>
                    <th className="py-3 px-6 text-center">UT1</th>
                    <th className="py-3 px-6 text-center">UT2</th>
                    <th className="py-3 px-6 text-center rounded-tr-lg">UT3</th>
                  </tr>
                </thead>
                <tbody>
                  {Object.entries(
                    studentData?.unitTestMarks?.reduce((acc, test) => {
                      if (!acc[test.theorysubject.name]) {
                        acc[test.theorysubject.name] = { UT1: 0, UT2: 0, UT3: 0 };
                      }
                      acc[test.theorysubject.name][test.test_number] = test.marks;
                      return acc;
                    }, {}) || {}
                  ).map(([subject, marks], index, array) => (
                    <tr key={subject} className={`${index === array.length - 1 ? '' : 'border-b border-gray-200'} hover:bg-indigo-50 transition-colors`}>
                      <td className="py-3 px-6 whitespace-nowrap text-sm font-medium text-gray-900">{subject}</td>
                      <td className="py-3 px-6 whitespace-nowrap text-sm text-center">
                        <span className={`inline-block w-10 text-center py-1 rounded-md font-medium ${Number(marks.UT1) >= 8 ? 'bg-green-100 text-green-800' : 'bg-orange-100 text-orange-800'}`}>
                          {marks.UT1}
                        </span>
                      </td>
                      <td className="py-3 px-6 whitespace-nowrap text-sm text-center">
                        <span className={`inline-block w-10 text-center py-1 rounded-md font-medium ${Number(marks.UT2) >= 8 ? 'bg-green-100 text-green-800' : 'bg-orange-100 text-orange-800'}`}>
                          {marks.UT2}
                        </span>
                      </td>
                      <td className="py-3 px-6 whitespace-nowrap text-sm text-center">
                        <span className={`inline-block w-10 text-center py-1 rounded-md font-medium ${Number(marks.UT3) >= 8 ? 'bg-green-100 text-green-800' : 'bg-orange-100 text-orange-800'}`}>
                          {marks.UT3}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Lab Assignments Card */}
          <div className="bg-white rounded-xl shadow-lg p-6 mb-8 border border-indigo-100">
            <div className="flex items-center mb-4">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-indigo-600 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
              </svg>
              <h2 className="text-xl font-bold text-gray-800">Lab Assignments</h2>
            </div>
            <div className="overflow-x-auto">
              <table className="min-w-full bg-white">
                <thead>
                  <tr className="bg-gradient-to-r from-indigo-500 to-blue-500 text-white">
                    <th className="py-3 px-6 text-left rounded-tl-lg">Lab Subject</th>
                    <th className="py-3 px-6 text-left">Batch</th>
                    <th className="py-3 px-6 text-center rounded-tr-lg">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {studentData?.labAssignments?.map((assignment, index, array) => (
                    <tr key={index} className={`${index === array.length - 1 ? '' : 'border-b border-gray-200'} hover:bg-indigo-50 transition-colors`}>
                      <td className="py-3 px-6 whitespace-nowrap text-sm font-medium text-gray-900">{assignment.labsubjects.name}</td>
                      <td className="py-3 px-6 whitespace-nowrap text-sm text-gray-700">{assignment.batch}</td>
                      <td className="py-3 px-6 whitespace-nowrap text-center">
                        <span className={`px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                          assignment.status === 'Submitted' ? 'bg-green-100 text-green-800' :
                          assignment.status === 'Pending' ? 'bg-yellow-100 text-yellow-800' :
                          'bg-red-100 text-red-800'
                        }`}>
                          {assignment.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        <div className="lg:col-span-4">
          {/* Class Coordinator Card */}
          <div className="bg-white rounded-xl shadow-lg p-6 mb-8 border border-indigo-100">
            <div className="flex items-center mb-4">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-indigo-600 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
              <h2 className="text-xl font-bold text-gray-800">Class Coordinator</h2>
            </div>
            <div className="overflow-x-auto">
              <table className="min-w-full bg-white">
                <thead>
                  <tr className="bg-gradient-to-r from-indigo-500 to-blue-500 text-white">
                    <th className="py-3 px-4 text-left rounded-tl-lg">Division</th>
                    <th className="py-3 px-4 text-center">Submission</th>
                    <th className="py-3 px-4 text-center rounded-tr-lg">Feedback</th>
                  </tr>
                </thead>
                <tbody>
                  {studentData?.classCoordinator?.map((cc, index, array) => (
                    <tr key={index} className={`${index === array.length - 1 ? '' : 'border-b border-gray-200'} hover:bg-indigo-50 transition-colors`}>
                      <td className="py-3 px-4 whitespace-nowrap text-sm font-medium text-gray-900">{cc.Div}</td>
                      <td className="py-3 px-4 whitespace-nowrap text-center">
                        <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                          cc.final_submission_status === 'Approved' ? 'bg-green-100 text-green-800' :
                          cc.final_submission_status === 'Pending' ? 'bg-yellow-100 text-yellow-800' :
                          'bg-red-100 text-red-800'
                        }`}>
                          {cc.final_submission_status}
                        </span>
                      </td>
                      <td className="py-3 px-4 whitespace-nowrap text-center">
                        <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                          cc.feedback_status === 'Approved' ? 'bg-green-100 text-green-800' :
                          cc.feedback_status === 'Pending' ? 'bg-yellow-100 text-yellow-800' :
                          'bg-red-100 text-red-800'
                        }`}>
                          {cc.feedback_status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Attendance Coordinator Card */}
          <div className="bg-white rounded-xl shadow-lg p-6 mb-8 border border-indigo-100">
            <div className="flex items-center mb-4">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-indigo-600 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
              </svg>
              <h2 className="text-xl font-bold text-gray-800">Attendance Status</h2>
            </div>
            <div className="overflow-x-auto">
              <table className="min-w-full bg-white">
                <thead>
                  <tr className="bg-gradient-to-r from-indigo-500 to-blue-500 text-white">
                    <th className="py-3 px-6 text-center rounded-lg">Attendance Status</th>
                  </tr>
                </thead>
                <tbody>
                  {studentData?.attendanceCoordinator?.map((ac, index, array) => (
                    <tr key={index} className={`${index === array.length - 1 ? '' : 'border-b border-gray-200'} hover:bg-indigo-50 transition-colors`}>
                      <td className="py-4 px-6 whitespace-nowrap text-center">
                        <span className={`px-4 py-2 inline-flex text-sm leading-5 font-semibold rounded-full ${
                          ac.attendance_status === 'Approved' ? 'bg-green-100 text-green-800' :
                          ac.attendance_status === 'Pending' ? 'bg-yellow-100 text-yellow-800' :
                          'bg-red-100 text-red-800'
                        }`}>
                          {ac.attendance_status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Audit Courses Card */}
          <div className="bg-white rounded-xl shadow-lg p-6 mb-8 border border-indigo-100">
            <div className="flex items-center mb-4">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-indigo-600 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
              </svg>
              <h2 className="text-xl font-bold text-gray-800">Audit Courses</h2>
            </div>
            <div className="overflow-x-auto">
              <table className="min-w-full bg-white">
                <thead>
                  <tr className="bg-gradient-to-r from-indigo-500 to-blue-500 text-white">
                    <th className="py-3 px-6 text-left rounded-tl-lg">Batch</th>
                    <th className="py-3 px-6 text-center rounded-tr-lg">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {studentData?.auditcourse?.map((course, index, array) => (
                    <tr key={index} className={`${index === array.length - 1 ? '' : 'border-b border-gray-200'} hover:bg-indigo-50 transition-colors`}>
                      <td className="py-3 px-6 whitespace-nowrap text-sm text-gray-700">{course.batch}</td>
                      <td className="py-3 px-6 whitespace-nowrap text-center">
                        <span className={`px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                          course.status === 'Approved' ? 'bg-green-100 text-green-800' :
                          course.status === 'Pending' ? 'bg-yellow-100 text-yellow-800' :
                          'bg-red-100 text-red-800'
                        }`}>
                          {course.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>

      {/* Footer with download button */}
      <div className="flex justify-center mt-8">
        <button 
          onClick={() => {}}
          className="px-8 py-3 bg-gradient-to-r from-indigo-600 to-blue-500 text-white rounded-full shadow-lg hover:shadow-xl transition-all transform hover:-translate-y-1 flex items-center"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
          </svg>
          Download Report
        </button>
      </div>
    </div>
  );
};

export default StudentDashboard;