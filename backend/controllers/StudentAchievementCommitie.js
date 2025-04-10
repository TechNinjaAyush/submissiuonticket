import { prism} from "../config/db.config.js";  // Ensure correct import

export const StudentAchievementDashboard = async (req, res) => {
    try {
        const Fetchstudents = await prism.studentAchievementCommittee.findMany({
            include: {
                student: {
                    select: {
                        student_id: true, // Include student ID
                        name: true, // Fetch student's name
                    },
                },
            },
        });

        return res.status(200).json(Fetchstudents);
    } catch (error) {
        console.error("Error fetching students:", error);
        return res.status(500).json({ message: "Internal server error" });
    }
};
