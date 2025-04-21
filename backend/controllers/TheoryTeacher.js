import { prism } from "../config/db.config.js";
import redisClient from "../utils/redisClient.js";

export const UpdateUnitTestMarks = async(req, res) => {
    const { ut_id, marks } = req.query;
    console.log(`UT ID is ${ut_id} and marks is ${marks}`);
    
    if (!ut_id || !marks) {
        return res.status(400).json({ message: "Please provide UT ID and marks" });
    }
    
    try {
        // First, fetch unit test to get div and sub_id
        const unitTest = await prism.unitTestMarks.findUnique({
            where: {
                ut_id: parseInt(ut_id)
            },
            include: {
                student: {
                    select: {
                        div: true
                    }
                }
            }
        });

        if (!unitTest) {
            return res.status(404).json({ message: "Unit test not found" });
        }

        const updatedMarks = await prism.unitTestMarks.update({
            where: {
                ut_id: parseInt(ut_id)
            },
            data: {
                marks: parseInt(marks)
            }
        });

        const div = unitTest.student.div;
        const sub_id = unitTest.sub_id;

        // Construct the cache key and delete it
        const cacheKey = `students:div=${div}:sub_id=${sub_id}`;
        await redisClient.del(cacheKey);
        console.log("Redis cache invalidated after mark update:", cacheKey);
        
        console.log("Unit test marks updated:", updatedMarks);
        return res.status(200).json({ message: "Marks updated successfully", updatedMarks });
    } catch (err) {
        console.log("Error is", err);
        return res.status(500).json({ message: "Internal server error" });
    }
}


export const FetchTheoryStudents = async(req, res) => {
    const { div, sub_id } = req.query;
    
    console.log(`Div is ${div} and subject is ${sub_id}`);
    
    if (!div) {
        return res.status(400).json({ message: "Please provide Division and subject id" });
    }
    
    // Create a cache key that includes all query parameters
    const cacheKey = `students:div=${div}:sub_id=${sub_id}`;
    
    // Try to get data from cache
    const students = await redisClient.get(cacheKey);
    if (students) {
        console.log("Students data retrieved from Redis cache");
        return res.status(200).json(JSON.parse(students));
    }
    
    try {
        const fetchStudents = await prism.student.findMany({
            where: {
                div: div
            },
            select: {
                student_id: true,
                name: true,
                unitTestMarks: {
                    where: {
                        sub_id: parseInt(sub_id)
                    },
                    select: {
                        ut_id: true,
                        marks: true,
                        test_number: true
                    },
                },
            },
        });
        
        // Store data in Redis with the specific cache key
        await redisClient.set(cacheKey, JSON.stringify(fetchStudents));
        await redisClient.expire(cacheKey, 3600); // Cache for 1 hour
        
        console.log("Students data fetched from database and cached");
        return res.status(200).json(fetchStudents);
    } catch (err) {
        console.log("Error in fetching students data", err);
        return res.status(500).json({ message: "Internal server error" });
    }
}

export const TheoryTeacherDashboard = async (req, res) => {
    const { teacher_id } = req.query;
     
    if (!teacher_id) {
        return res.status(400).json({ message: "Teacher ID is not provided" });
    }

    try {
        const TeacherClassAndSubject = await prism.teacherTheorySubject.findMany({
            where: {
                teacher_id: parseInt(teacher_id),
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
                teacher: {
                    select: {
                        email: true 
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