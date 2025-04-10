import { prism } from "../config/db.config.js";


export const updateAttendanceStatus = async (req, res) => {
  
    const { student_id } = req.query;
    if (!student_id) {
        return res.status(400).json({ message: "Please provide student ID" });
    }
    try {
        const UpdatedStudents = await prism.attendanceCoordinator.updateMany({
            where: {
                student_id: parseInt(student_id),
            },
            data: {
                attendance_status: "Present",
            } 

        });

        const studentsWithDetails = await prism.attendanceCoordinator.findMany({
            where: {
                student_id: parseInt(student_id),
            },
            include: {
                student: {
                    select: {
                        student_id: true,
                        name: true,
                    },
                },
            },
        });
        
        console.log("Updated student records:", studentsWithDetails);
        return res.status(200).json({
            message: "Attendance updated successfully",
            updatedRecords: UpdatedStudents,
        });
    } catch (err) {
        console.error("Error updating attendance:", err);
        return res.status(500).json({ message: "Internal server error" });
    }

}

export  const FetchingStudents  = async(req , res)=>{

    try{
     const FetchStudents = await prism.attendanceCoordinator.findMany({
          include : {
            student  : {
                select : {
                    student_id : true , 
                    name : true 
                }
            }
          }
     })
        console.log("Students are " , FetchStudents)

        return  res.status(200).json({
            message : "Students fetched successfully",
            students : FetchStudents
        })
    }
    catch(err){
        console.log("Error in fetching students data"  , err)
        return res.status(500).json({message : "Internal server error"})
    }
 

}
