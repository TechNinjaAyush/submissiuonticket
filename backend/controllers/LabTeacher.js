import { prism} from "../config/db.config.js";  // Ensure correct import
export const UpdateLabStatus = async (req, res) => {
    const { student_id, subject_id } = req.query;
    
    console.log(`Student ID: ${student_id}, Subject ID: ${subject_id}`);

    if (!student_id || !subject_id) {
        return res.status(400).json({ message: "Please provide student_id and subject_id" });
    }

    try {
        // Convert query parameters to integers
        const studentIdInt = parseInt(student_id);
        const subjectIdInt = parseInt(subject_id);

        if (isNaN(studentIdInt) || isNaN(subjectIdInt)) {
            return res.status(400).json({ message: "Invalid student_id or subject_id format" });
        }

        // Update the lab assignment status
        const updatedStudents = await prism.labAssignments.updateMany({
            where: {
                student_id: studentIdInt,
                sub_id: subjectIdInt,
            },
            data: {
                status: "Submitted",
            },
        });

        if (updatedStudents.count === 0) {
            return res.status(404).json({ message: "No records found for the given student_id and subject_id" });
        }

        // Fetch updated records with student details
        const studentsWithDetails = await prism.labAssignments.findMany({
            where: {
                student_id: studentIdInt,
                sub_id: subjectIdInt, // Ensuring subject_id filter is applied
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
            message: "Lab status updated successfully",
            updatedRecords: studentsWithDetails,
        });
    } catch (err) {
        console.error("Error updating lab status:", err);
        return res.status(500).json({ message: "Internal server error" });
    }
};

  
export const FetchinngLabStudents  = async(req , res)=>{
    
    const { batch } = req.query;
    

    try {
        const students = await prism.student.findMany({
            where: {
                batch  :batch, 
            },
            select: {
                student_id: true,
                name: true,
                labAssignments: {
                    select: {
                        status: true,
                        sub_id: true,
                    },
                },
            },
        });

        // Transform the data to flatten the structure
        const transformedStudents = students.map(student => ({
            student_id: student.student_id,
            name: student.name,
            status  : student.labAssignments[0]?.status || "Pending",
            
        }));

        return res.status(200).json({ students: transformedStudents });
    } catch (err) {
        console.error("Error fetching students:", err);
        return res.status(500).json({ message: "Internal server error" });
    }
  
 
}
export const LabTeacherDashboard = async (req, res) => {
    const { teacher_id } = req.query; // Change to req.params if necessary

    if (!teacher_id) {
        return res.status(400).json({ message: "Teacher ID is not provided" });
    }

    const teacherId = Number(teacher_id);
    if (isNaN(teacherId)) {
        return res.status(400).json({ message: "Invalid Teacher ID" });
    }

    try {
        const TeacherlabandSubject = await prism.teacherLabSubjects.findMany({
            where: { teacher_id: teacherId },
            include: {
                labsubjects: {
                    select: { id: true, name: true },
                },
                batch: {
                    select: { id: true, name: true },
                },
                teacher: {
                    select: { email: true },
                },
            },
        });

        if (!TeacherlabandSubject || TeacherlabandSubject.length === 0) {
            return res.status(404).json({ message: "No subjects or classes found for this teacher" });
        }

        console.log("Teacher lab and subject data:", TeacherlabandSubject);


        return res.status(200).json(TeacherlabandSubject);
    } catch (error) {
        console.error("Error fetching teacher data:", error.message);
        return res.status(500).json({ message: "Internal server error" });
    }
};
