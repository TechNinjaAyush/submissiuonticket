import bcrypt from "bcryptjs";
import {prism} from "../config/db.config.js";
import  jwt from "jsonwebtoken" ; 
import dotenv from 'dotenv';

dotenv.config(); 
const SECRET_KEY = process.env.JWT_SECRET  
export const StudentLogin =  async(req , res)=>{
    const{email , password} = req.body; 
     
    if(!email || !password){
        res.send(400).json({message: "email or password is missing"}) ;
    }

    try{
    const Finduser =  await prism.student.findUnique({
        where: { email: email},

      });
      if(!Finduser){
     return res.status(400).json({message  : "user not found"}); 
      }
      const ispasswordvalid = await bcrypt.compare(password ,Finduser.password ) ; 
   if(!ispasswordvalid){
    return res.status(400).json({message  : "Invalid password or email"}) ;

   }

   const token = jwt.sign({ email : email }, SECRET_KEY, { expiresIn: '7h' });
    



   res.cookie("token", token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "Strict",
});
return res.status(200).json({
    message: "Login successful",
    token, 
    user: {
        
        email: Finduser.email,
        student_id: Finduser.student_id,
    },
});
     
    }
    catch(error){
        console.log("Login error"  , error) ; 
        return res.status(500).json({message: "Internal server error"}) ; 
    }

}

export const TeacherLogin = async (req, res) => {
    const { email, password, role } = req.body;
    console.log(req.body) 
    console.log("role is" , role) 
       console.log(req.body) ; 
    if (!email || !password || !role) {
        return res.status(400).json({ message: "Email, password, or role is missing" });
    }

    try {
        const Finduser = await prism.teacher.findUnique({
            where: { email: email },
            include: {
                roles: {
                    include: {
                        role: true, // Fetch role details
                    }
                }
            }
        });

        if (!Finduser) {
            return res.status(400).json({ message: "User not found" });
        }

        console.log("User is" , Finduser);
        console.log("password is" , Finduser.password)
          if(Finduser.password!==password){
             return res.status(401).json({message: "Password is wrong"}) ;
          }
        // Extract role names from the fetched teacher roles
        const assignedRoles = Finduser.roles.map((r) => r.role.name);
         console.log("assigned roles are" , assignedRoles); 
        // Check if the provided role exists in the assigned roles
        if (!assignedRoles.includes(role)) {
            return res.status(401).json({ message: "Unauthorized role" });
        }

        const token = jwt.sign({ email: email }, SECRET_KEY, { expiresIn: "24h" });
         
        res.cookie("token", token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "Strict",
        });

        return res.status(200).json({
            message: "Login successful",
            token,
            user: {
                email: Finduser.email,
                roles: assignedRoles  ,
                Teacher_id : Finduser.teacher_id 
                
            },
        });

    } catch (error) {
        console.error("Login error", error);
        return res.status(500).json({ message: "Internal server error" });
    }
};
