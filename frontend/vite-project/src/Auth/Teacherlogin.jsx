import React, { useState } from "react";
import Teacherimage from "./Teacherimage.png";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

const TeacherLogin = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("Theory Teacher");
  const [loading, setLoading] = useState(false);
  const[check , setCheck] = useState(false)
  const navigate = useNavigate();
  
  const handleRoleChange = async(e) => {
    setRole(e.target.value);
    console.log("role is" , e.target.value)
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Basic validation
    if (!email || !password || !role) {
      toast.error("Please fill in all fields", { position: "top-left" });
      return;
    }

    try {
      setLoading(true);
      console.log("Logging in with:", { email, password, role });

      const response = await fetch("http://localhost:3000/auth/TeacherLogin", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password, role }),
      });

      const data = await response.json();
      console.log("Response Data:", data);
     const token  =  data.token 
      console.log("token is" , token)
      localStorage.setItem("token" , token)
      const teacher_id = data.user.Teacher_id  
      console.log("teacher id is" , teacher_id) 
      localStorage.setItem("teacher_id" , teacher_id)
      if (response.ok) {
         setCheck(true) 
        toast.success("Login successful", { position: "top-left" });
      } else {
        // Handle backend error messages
        toast.error(data.message || "Login failed", { position: "top-right" });
      }
    } catch (err) {
      toast.error("unauthorized role or  network error ", { position: "top-right" });
      console.error("Login error:", err);
    } finally {
      setLoading(false); // ✅ Ensures loading is reset
    }
  };

  const handleNavigation = () => {
    if (role === "Theory Teacher" && check) {
        localStorage.setItem("role" , "Theory Teacher")
      navigate("/TheoryTeacher");
    } else if (role === "Lab Teacher" &&  check) {
      localStorage.setItem("role" , "Lab Teacher")
      navigate("/LabTeacher");

      
    } else if (role === "CC" && check) {
      localStorage.setItem("role" , "Lab Teacher")
      navigate("/CC");
    } else if (role === "Audit Course Teacher" &&  check) {
      localStorage.setItem("role" , "Lab Teacher")
      navigate("/AuditCourse");
    } else if (role === "Mentor" &&  check) {
    } else if (role === "Student Achievement Committee"&&  check ) {
      localStorage.setItem("role" , "Student Achievement Committee")
      
    } else if (role === "Attendance Committee" &&  check) {
      localStorage.setItem("role" , "Attendance Committee")
      navigate("/AttendanceCoordinator");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8 bg-white p-8 rounded-xl shadow-lg">
        <div className="flex flex-col items-center">
          <img 
            className="h-20 w-auto mb-4" 
            src={Teacherimage} 
            alt="Teacher" 
          />
          <h2 className="mt-2 text-center text-3xl font-extrabold text-gray-900">
            Teacher Login
          </h2>
        </div>
        
        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div className="rounded-md shadow-sm space-y-4">
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                Email
              </label>
              <input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                required
                className="mt-1 appearance-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                Password
              </label>
              <input
                id="password"
                name="password"
                type="password"
                autoComplete="current-password"
                required
                className="mt-1 appearance-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm"
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
            
            <div>
              <label htmlFor="role" className="block text-sm font-medium text-gray-700">
                Role
              </label>
              <select
                id="role"
                name="role"
                required
                className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
                value={role}
                onChange={handleRoleChange}
              >
                <option value="CC">CC</option>
                <option value="Mentor">Mentor</option>
                <option value="Theory Teacher">Theory Teacher</option>
                <option value="Lab Teacher">Lab Teacher</option>
                <option value="Audit Course Teacher">Audit Course Teacher</option>
                <option value="Student Achievement Committee">
                  Student Achievement Committee
                </option>
                <option value="Attendance Committee">Attendance Committee</option>
              </select>
            </div>
          </div>

          <div>
            <button
              type="submit"
              onClick={handleNavigation}
              disabled={loading}
              className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:bg-blue-300 disabled:cursor-not-allowed"
            >
              {loading ? "Logging in..." : "Login"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default TeacherLogin;
