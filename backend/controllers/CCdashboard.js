import { prism } from "../config/db.config.js";
export const getCCstudents = async (req, res) => {
    const { Division } = req.query;

    try {
        const students = await prism.student.findMany({
            where: {
                div: Division, 
            },
            select: {
                student_id: true,
                name: true,
                classCoordinator: {
                    select: {
                        feedback_status: true,
                        final_submission_status: true
                    }
                }
            },
        });

        // Transform the data to flatten the structure
        const transformedStudents = students.map(student => ({
            student_id: student.student_id,
            name: student.name,
            feedback_status: student.classCoordinator[0]?.feedback_status || 'Pending',
            final_submission_status: student.classCoordinator[0]?.final_submission_status || 'Pending'
        }));

        console.log("Students are:", transformedStudents);
        return res.status(200).json({ students: transformedStudents });
    } catch (err) {
        console.error("Error fetching students:", err);
        return res.status(500).json({ message: "Internal server error" });
    }
};
export const updateFeedbackStatus = async (req, res) => {
    const { student_id } = req.query;

    console.log(`Student ID: ${student_id}`);

    if (!student_id) {
        return res.status(400).json({ message: "Please provide student_id" });
    }

    try {
        const studentIdInt = parseInt(student_id);
        if (isNaN(studentIdInt)) {
            return res.status(400).json({ message: "Invalid student_id format" });
        }

        const classCoordinator = await prism.classCoordinator.findFirst({
            where: { student_id: studentIdInt },
            select: { cc_id: true } // Select only the cc_id
        });
     console.log("cc id is" , classCoordinator.cc_id)
        if (!classCoordinator) {
            return res.status(404).json({ message: "No class coordinator found for this student_id" });
        }

        const updatedStudent = await prism.classCoordinator.updateMany({
            where: { cc_id: classCoordinator.cc_id }, // Use cc_id instead
            data: {
                feedback_status: "Submitted",
            },
        });

        if (updatedStudent.count === 0) {
            return res.status(404).json({ message: "No records found for the given student_id" });
        }

        console.log("Updated student records:", updatedStudent);
        return res.status(200).json({
            message: "Lab status updated successfully",
            updatedRecords: updatedStudent,
        });
    } catch (err) {
        console.error("Error updating feedback status:", err);
        return res.status(500).json({ message: "Internal server error" });
    }
};
export const UpdateSubmissionStatus = async (req, res) => {
    const { student_id } = req.query;

    console.log(`Student ID: ${student_id}`);

    if (!student_id) {
        return res.status(400).json({ message: "Please provide student_id" });
    }

    try {
        const studentIdInt = parseInt(student_id);
        if (isNaN(studentIdInt)) {
            return res.status(400).json({ message: "Invalid student_id format" });
        }

        const classCoordinator = await prism.classCoordinator.findFirst({
            where: { student_id: studentIdInt },
            select: { cc_id: true } 
        });
     console.log("cc id is" , classCoordinator.cc_id)
        if (!classCoordinator) {
            return res.status(404).json({ message: "No class coordinator found for this student_id" });
        }

        const updatedStudent = await prism.classCoordinator.updateMany({
            where: { cc_id: classCoordinator.cc_id }, // Use cc_id instead
            data: {
                final_submission_status: "Completed",
            },
        });

        if (updatedStudent.count === 0) {
            return res.status(404).json({ message: "No records found for the given student_id" });
        }

        console.log("Updated student records:", updatedStudent);
        return res.status(200).json({
            message: "Lab status updated successfully",
            updatedRecords: updatedStudent,
        });
    } catch (err) {
        console.error("Error updating lab status:", err);
        return res.status(500).json({ message: "Internal server error" });
    }
} ;

export const getCCdivision = async (req, res) => {
    try {
        const { teacher_id } = req.query; // Get teacher ID from query parameters
        console.log("Teacher ID is:", teacher_id);

        if (!teacher_id) {
            return res.status(400).json({ error: "Teacher ID is required" });
        }

        const divisions = await prism.classCoordinatortodiv.findMany({
            where: {
                cc_id: parseInt(teacher_id), // Convert to integer
            },
            select: {
                Div: true, // Select only the Division field
            }
        });
        const email = await  prism.teacher.findUnique({
            where: {
                teacher_id: parseInt(teacher_id), // Convert to integer
            },
            select: {
                email: true, // Select only the name field
            }
        });

        return res.json({divisions  ,  email});
    } catch (error) {
        console.error("Error fetching divisions:", error);
        return res.status(500).json({ error: "Internal Server Error" });
    }
};
