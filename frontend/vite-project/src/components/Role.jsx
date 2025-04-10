import React from "react";
import "../styles/Role.css"
import { useNavigate } from "react-router-dom";

const Role = ()=>{
  const navigate =  useNavigate() ;
  const jwttoken = localStorage.getItem('token') 
  


    return(

      <div  className="Role">
        <h4 style={{fontSize :"15px"}}>Select a Role:</h4>
       <button onClick={()=>{navigate('/StudentRegister')}} className="Student">Student</button>
       <br />
       <br />
       <button onClick={()=>{
        navigate('/TeacherLogin')
       }}   className="Teacher">Teacher</button>
      </div>
    )
}

export default  Role;