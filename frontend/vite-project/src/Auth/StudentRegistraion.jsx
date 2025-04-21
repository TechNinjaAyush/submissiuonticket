import React, { useState } from "react";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

const StudentRegistrations = () => {
  const [name, setName] = useState("");
  const [roll_no, setRollNo] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [div, setDiv] = useState("");
  const [batch, setBatch] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Basic validation
    if (!name || !roll_no || !email || !password || !div || !batch) {
      toast.error("Please fill in all fields", { position: "top-left" });
      return;
    }

    try {
      setLoading(true);
      console.log("Registering student with:", { name, roll_no, email, password, div, batch });

      const response = await fetch("http://localhost:3000/auth/Student", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ name, roll_no, email, password, div, batch }),
      });

      const data = await response.json();
      console.log("Response Data:", data);
      console.log("Student ID:", data.student.student_id);
      localStorage.setItem("student_id", data.student.student_id);

      if (response.ok) {
        toast.success("Registration successful", { position: "top-left" });
        navigate("/StudentLogin");
      } else {
        toast.error(data.message || "Registration failed", { position: "top-right" });
      }
    } catch (err) {
      toast.error("Network error. Please try again.", { position: "top-right" });
      console.error("Registration error:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl w-full space-y-8 bg-white p-8 rounded-xl shadow-xl flex overflow-hidden">
        {/* Left side - illustration */}
        <div className="hidden md:flex md:w-1/2 bg-indigo-600 rounded-l-lg relative overflow-hidden justify-center items-center p-6">
          <div className="text-white relative z-10">
            <h1 className="text-3xl font-bold mb-4">Welcome to Student Portal</h1>
            <p className="text-indigo-100 mb-6">Join our academic community and access your submission ticket</p>
            <div className="space-y-3">
              <div className="flex items-center">
                <div className="bg-indigo-500 rounded-full p-1 mr-3">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <span className="text-sm text-indigo-100">Track your attendance</span>
              </div>
              <div className="flex items-center">
                
              </div>
              <div className="flex items-center">
                <div className="bg-indigo-500 rounded-full p-1 mr-3">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <span className="text-sm text-indigo-100">View your grades and progress</span>
              </div>
            </div>
          </div>
          
          {/* Background pattern */}
          <div className="absolute inset-0 opacity-10">
            <svg width="100%" height="100%" viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
              <defs>
                <pattern id="grid" width="10" height="10" patternUnits="userSpaceOnUse">
                  <path d="M 10 0 L 0 0 0 10" fill="none" stroke="white" strokeWidth="0.5" />
                </pattern>
              </defs>
              <rect width="100%" height="100%" fill="url(#grid)" />
            </svg>
          </div>
        </div>

        {/* Right side - form */}
        <div className="w-full md:w-1/2 px-4 md:px-8 overflow-y-auto">
          <div className="text-center mb-6">
            <div className="bg-indigo-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-3">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-indigo-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
              </svg>
            </div>
            <h2 className="text-3xl font-extrabold text-gray-900 mb-1">Student Registration</h2>
            <div className="flex items-center justify-center">
              <span className="h-1 w-10 bg-indigo-600 rounded-full"></span>
              <span className="h-1 w-1 bg-indigo-600 rounded-full mx-1"></span>
              <span className="h-1 w-5 bg-indigo-600 rounded-full"></span>
            </div>
            <p className="mt-3 text-sm text-gray-600">Create your account to get started</p>
          </div>
          
          <form className="space-y-5" onSubmit={handleSubmit}>
            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
              <div className="group relative">
                <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
                <div className="flex rounded-md shadow-sm overflow-hidden group-hover:ring-1 group-hover:ring-indigo-500 transition duration-200">
                  <span className="inline-flex items-center px-3 rounded-l-md border border-r-0 border-gray-300 bg-gray-50 text-gray-500 group-hover:bg-indigo-50 group-hover:text-indigo-600 transition duration-200">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                  </span>
                  <input
                    type="text"
                    id="name"
                    placeholder="John Doe"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                    className="flex-1 block w-full rounded-r-md border-gray-300 focus:border-indigo-500 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                  />
                </div>
              </div>

              <div className="group relative">
                <label htmlFor="roll_no" className="block text-sm font-medium text-gray-700 mb-1">Roll Number</label>
                <div className="flex rounded-md shadow-sm overflow-hidden group-hover:ring-1 group-hover:ring-indigo-500 transition duration-200">
                  <span className="inline-flex items-center px-3 rounded-l-md border border-r-0 border-gray-300 bg-gray-50 text-gray-500 group-hover:bg-indigo-50 group-hover:text-indigo-600 transition duration-200">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 20l4-16m2 16l4-16M6 9h14M4 15h14" />
                    </svg>
                  </span>
                  <input
                    type="text"
                    id="roll_no"
                    placeholder="e.g., 33244"
                    value={roll_no}
                    onChange={(e) => setRollNo(e.target.value)}
                    required
                    className="flex-1 block w-full rounded-r-md border-gray-300 focus:border-indigo-500 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                  />
                </div>
              </div>

              <div className="group relative sm:col-span-2">
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">Email Address</label>
                <div className="flex rounded-md shadow-sm overflow-hidden group-hover:ring-1 group-hover:ring-indigo-500 transition duration-200">
                  <span className="inline-flex items-center px-3 rounded-l-md border border-r-0 border-gray-300 bg-gray-50 text-gray-500 group-hover:bg-indigo-50 group-hover:text-indigo-600 transition duration-200">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                  </span>
                  <input
                    type="email"
                    id="email"
                    placeholder="student@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    className="flex-1 block w-full rounded-r-md border-gray-300 focus:border-indigo-500 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                  />
                </div>
                <p className="mt-1 text-xs text-gray-500">We'll never share your email with anyone else.</p>
              </div>

              <div className="group relative sm:col-span-2">
                <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">Password</label>
                <div className="flex rounded-md shadow-sm overflow-hidden group-hover:ring-1 group-hover:ring-indigo-500 transition duration-200">
                  <span className="inline-flex items-center px-3 rounded-l-md border border-r-0 border-gray-300 bg-gray-50 text-gray-500 group-hover:bg-indigo-50 group-hover:text-indigo-600 transition duration-200">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                    </svg>
                  </span>
                  <input
                    type="password"
                    id="password"
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    className="flex-1 block w-full rounded-r-md border-gray-300 focus:border-indigo-500 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                  />
                </div>
                <p className="mt-1 text-xs text-gray-500">Password must be at least 8 characters</p>
              </div>

              <div className="group relative">
                <label htmlFor="div" className="block text-sm font-medium text-gray-700 mb-1">Division</label>
                <div className="flex rounded-md shadow-sm overflow-hidden group-hover:ring-1 group-hover:ring-indigo-500 transition duration-200">
                  <span className="inline-flex items-center px-3 rounded-l-md border border-r-0 border-gray-300 bg-gray-50 text-gray-500 group-hover:bg-indigo-50 group-hover:text-indigo-600 transition duration-200">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                    </svg>
                  </span>
                  <input
                    type="text"
                    id="div"
                    placeholder="e.g., TE-9"
                    value={div}
                    onChange={(e) => setDiv(e.target.value)}
                    required
                    className="flex-1 block w-full rounded-r-md border-gray-300 focus:border-indigo-500 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                  />
                </div>
              </div>

              <div className="group relative">
                <label htmlFor="batch" className="block text-sm font-medium text-gray-700 mb-1">Batch</label>
                <div className="flex rounded-md shadow-sm overflow-hidden group-hover:ring-1 group-hover:ring-indigo-500 transition duration-200">
                  <span className="inline-flex items-center px-3 rounded-l-md border border-r-0 border-gray-300 bg-gray-50 text-gray-500 group-hover:bg-indigo-50 group-hover:text-indigo-600 transition duration-200">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                    </svg>
                  </span>
                  <input
                    type="text"
                    id="batch"
                    placeholder="e.g., G-10"
                    value={batch}
                    onChange={(e) => setBatch(e.target.value)}
                    required
                    className="flex-1 block w-full rounded-r-md border-gray-300 focus:border-indigo-500 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                  />
                </div>
              </div>
            </div>

            <div className="pt-1">
              <button
                type="submit"
                disabled={loading}
                className="group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-lg text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 transform hover:-translate-y-0.5 shadow-md hover:shadow-lg"
              >
                {loading ? (
                  <>
                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Registering...
                  </>
                ) : (
                  <>
                    <span className="absolute left-0 inset-y-0 flex items-center pl-3">
                      <svg className="h-5 w-5 text-indigo-500 group-hover:text-indigo-400 transition-colors duration-200" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                        <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
                      </svg>
                    </span>
                    Register Account
                  </>
                )}
              </button>
            </div>
            
            <div className="py-2 flex items-center justify-center space-x-2 text-sm">
              <span className="h-px bg-gray-300 w-12"></span>
              <span className="text-gray-500">OR</span>
              <span className="h-px bg-gray-300 w-12"></span>
            </div>
            
            <div className="text-center text-sm">
              <span className="text-gray-600">Already have an account?</span>{" "}
              <button 
                type="button"
                onClick={() => navigate("/StudentLogin")} 
                className="font-medium text-indigo-600 hover:text-indigo-500 transition-colors duration-200 cursor-pointer focus:outline-none hover:underline"
              >
                Sign in instead
              </button>
            </div>
            
            <div className="text-center text-xs text-gray-500 mt-8">
              <p>By registering, you agree to our <a href="#" className="text-indigo-600 hover:underline">Terms of Service</a> and <a href="#" className="text-indigo-600 hover:underline">Privacy Policy</a></p>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default StudentRegistrations;