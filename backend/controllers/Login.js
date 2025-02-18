import bcrypt from "bcrypt";
import {prism} from "../config/db.config.js";

export const StudentLogin =  async(req , res)=>{
    const{email , password} = req.body  ; 
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
    }
    catch(error){
        console.log("Login error"  , error) ; 
        return res.status(500).json({message: "Internal server error"}) ; 
    }

}


export const TeacherLogin = async(req   ,res)=>{
    const{email , password  , role} = req.body ; 



}




