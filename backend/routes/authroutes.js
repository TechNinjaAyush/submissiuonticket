import express from "express"
import { StudentRegister , Teacher } from "../controllers/Register.js"; 
const router  =  express.Router(); 
router.post('/Student' , StudentRegister) ; 
router.post('/Teacher' , Teacher); 

export default  router ; 