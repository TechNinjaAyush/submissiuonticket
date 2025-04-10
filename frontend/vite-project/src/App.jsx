import { useState  , useEffect} from 'react'
import { useNavigate } from 'react-router-dom';
import { Routes, Route } from "react-router-dom";
import TheoryTeacher from './components/TheoryTeacher';
import Role from './components/Role';
import TeacherLogin from './Auth/Teacherlogin';
import StudentLogin from './Auth/StudentLogin';
import StudentRegistrations from './Auth/StudentRegistraion';
import LabTeacherDashboard from './components/LabTeacherDashboard';
import CCDashboard from './components/CCDashboard';
import CCDivisionStudents from './components/ClassCoordinatorDivisionStudents';
import AttendanceCoordinator from './components/AttendanceCoordinator';
import Labstudent from './components/Labstudent';
import TheoryStudent from './components/TheoryStudent';
import AuditSubmissions from './components/AuditCourseStudents';
import AuditCourse from './components/AuditCourse';
import StudentDashboard from './components/StudentDashboard';
function App() {

  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");
    console.log("token is app" , token)
    const role = localStorage.getItem("role");
    console.log("role is  app" , role)

    if (token) {
      switch (role) {
        case "Theory Teacher":
          navigate("/TheoryTeacher");
          break;
        case "Lab Teacher":
          navigate("/LabTeacher");
          break;
        case "CC":
          navigate("/CC");
          break;
        case "Audit Course Teacher":
          navigate("/AuditCourse");
          break;
        case "Attendance Committee":
          navigate("/AttendanceCoordinator");
          break;
        case "Student":
          navigate("/StudentDashboard");
          break;
        // add more cases as needed
        default:
          navigate("/");
      }
    }
  }, []);
  return (
  
      <Routes>

        <Route path="/" element={<Role />} />
        <Route path="/TeacherLogin" element={<TeacherLogin />} />
        <Route path="/StudentRegister" element={<StudentRegistrations />} />
        <Route path="/StudentLogin" element={<StudentLogin />} />
        <Route path="/LabTeacher" element={<LabTeacherDashboard />} />
        <Route path="/CC" element={<CCDashboard />} />
        <Route path="/division-students" element={<CCDivisionStudents />} />
        <Route path="/AttendanceCoordinator" element={<AttendanceCoordinator />} />
       < Route path="/Labstudent" element={<Labstudent />} />
        <Route path="/StudentDashboard" element={<StudentDashboard />} />
        {/* Add more routes here */}
       < Route path="/TheoryTeacher" element={<TheoryTeacher />} />
        <Route path="/TheoryStudent" element={<TheoryStudent />} />
        <Route  path="/AuditCourse" element={<AuditCourse />} />
        <Route path="/AuditSubmissions" element={<AuditSubmissions />} />
        {/* Add more routes here */}
       </Routes>

    
  )
}

export default App
