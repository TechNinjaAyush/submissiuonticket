import express from "express"
import { StudentRegister} from "../controllers/Register.js"; 
import { StudentLogin , TeacherLogin } from "../controllers/Login.js";
const router  =  express.Router(); 
router.post('/Student' , StudentRegister); 
router.post('/StudentLogin' , StudentLogin ); 
router.post('/TeacherLogin' , TeacherLogin) ; 
export default  router ; 
