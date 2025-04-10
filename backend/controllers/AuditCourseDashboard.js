import { prism } from "../config/db.config.js"; // Ensure correct import

export const UpdateAuditCourseStatus = async (req, res) => {
  const { student_id } = req.query;

  if (!student_id) {
    return res.status(400).json({ message: "Please provide student ID" });
  }

  try {
    const UpdatedStudents = await prism.auditcourseCommittee.updateMany({
      where: {
        student_id: parseInt( student_id), // Ensure correct field name
      },
      data: {
        status: "Approved",
      }
    });

    return res.status(200).json({ message: "Audit course status updated", UpdatedStudents });
  } catch (err) {
    console.error("Error in updating audit course status:", err);
    return res.status(500).json({ message: "Internal server error" });
  }
};

export const getAuditCourseStudents = async (req, res) => {
  const { batch } = req.query;

  if (!batch) {
    return res.status(400).json({ message: "Please provide batch" });
  }

  try {
    const FetchStudents = await prism.auditcourseCommittee.findMany({
      where: {
        batch: batch, 
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

    console.log("Students are:", FetchStudents);
    return res.status(200).json(FetchStudents);
  } catch (err) {
    console.error("Error in fetching students data:", err);
    return res.status(500).json({ message: "Internal server error" });
  }
};

export const getAuditCourseBatches = async (req, res) => {
  try {
    const { teacher_id } = req.query;

    if (!teacher_id) {
      return res.status(400).json({ error: "Teacher ID is required" });
    }

    const teacherId = parseInt(teacher_id);
    if (isNaN(teacherId)) {
      return res.status(400).json({ error: "Invalid Teacher ID" });
    }

    const batches = await prism.auditCourseToBatch.findMany({
      where: {
       Teacher_id: parseInt(teacherId), // Ensure correct field name
      },
      select: {
        Batch: true, // Ensure correct field name
      },
    });

    return res.status(200).json(batches);
  } catch (error) {
    console.error("Error fetching batches:", error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
};
