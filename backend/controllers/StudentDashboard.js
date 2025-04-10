import { prism } from "../config/db.config.js"; // Fix Prisma client import

export const studentDashboard = async (req, res) => {
  const { student_id } = req.query;

  if (!student_id) {
    return res.status(400).json({ message: "Please provide student id" });
  }

  try {
    const FetchStudentDetails = await prism.student.findUnique({
      where: {
        student_id: parseInt(student_id),
      },
      include: {
        unitTestMarks: {
          include: {
            theorysubject: {
              select: {
                name: true
              }
            }
          }
        },
        labAssignments: {
          include: {
            labsubjects: {
              select: {
                name: true
              }
            }
          }
        },
        classCoordinator: true,
        attendanceCoordinator: true,
        auditcourse: true,
      },
    });

    if (!FetchStudentDetails) {
      return res.status(404).json({ message: "Student not found" });
    }

    console.log("Student details are:", FetchStudentDetails);
    return res.status(200).json(FetchStudentDetails);
  } catch (err) {
    console.error("Failed to fetch student details:", err); // Corrected error logging
    return res.status(500).json({ message: "Internal server error" });
  }
};
