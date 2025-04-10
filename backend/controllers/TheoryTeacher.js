import { prism } from "../config/db.config.js";  // Correct import
export const UpdateUnitTestMarks = async(req, res) => {
    const { ut_id, marks } = req.query;
    console.log(`UT ID is ${ut_id} and marks is ${marks}`);
    
    if (!ut_id || !marks) {
        return res.status(400).json({ message: "Please provide UT ID and marks" });
    }
    
    try {
        const updatedMarks = await prism.unitTestMarks.update({
            where: {
                ut_id: parseInt(ut_id)
            },
            data: {
                marks: parseInt(marks)
            }
        });
        
        console.log("Unit test marks updated:", updatedMarks);
        return res.status(200).json({ message: "Marks updated successfully", updatedMarks });
    } catch (err) {
        console.log("Error is", err);
        return res.status(500).json({ message: "Internal server error" });
    }
}

export const FetchTheoryStudents  = async(req , res)=>{
   
    const{div , sub_id} = req.query 
    
    console.log(`Div is ${div} and subject is is ${sub_id}`) 
    if(!div ){
     return res.status(400).json({message : "Please provide Division  and subject id"})
    }
    try{
      const FetchStudents  = await  prism.student.findMany({
          where  : {
             div : div
              
          }  , 
          select: {
            student_id: true,
            name: true,
             unitTestMarks: {
                where : {
                    sub_id : parseInt(sub_id)
                } , 
                select: {
                  ut_id : true ,  
                  marks : true   , 
                  test_number : true  
                    
                },
            },
        },
          
        
          
  
      })
    
      console.log("Students are " , FetchStudents) 
      return  res.status(200).json(FetchStudents) 
    }
    catch(err){
      console.log("Error in fetching students data"  , err)
      return res.status(500).json({message : "Internal server error"})
    }
}
export const TheoryTeacherDashboard = async (req, res) => {
    const { teacher_id } = req.query; // Extract from params, not body
     
    if (!teacher_id) {
        return res.status(400).json({ message: "Teacher ID is not provided" });
    }

    try {
        const TeacherClassAndSubject = await prism.teacherTheorySubject.findMany({
            where: {
                teacher_id: parseInt(teacher_id), // Ensure it's an integer if needed
            },
            include: {
                theorysubject: {
                    select: {
                        id: true,
                        name: true,
                    },
                },
                class: {
                    select: {
                        id: true,
                        name: true,
                    },
                },
                teacher : {
                    select : {
                        email   : true 
                    }
                }
            },
        });

        console.log(TeacherClassAndSubject);

        if (!TeacherClassAndSubject || TeacherClassAndSubject.length === 0) {
            return res.status(404).json({ message: "No subjects or classes found for this teacher" });
        }

        return res.status(200).json(TeacherClassAndSubject);
    } catch (error) {
        console.error("Error fetching teacher data:", error);
        return res.status(500).json({ message: "Internal server error" });
    }
};

// Use req.params, not req.body
