import bcrypt from "bcrypt";
import {prism} from "../config/db.config.js";

// 📌 Student Registration
export const StudentRegister = async (req, res) => {
  try {
    const { name, roll_no, email, password, div, batch} = req.body;
   console.log(req.body);
    

    // Check if student already exists
    const existingStudent = await prism.student.findUnique({
      where: { email: email },
    });

    if (existingStudent) {
      return res.status(401).json({ message: "User already exists" });
    }

    // Hash password
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    // Create Student
    const newStudent = await prism.student.create({
      data: {
        name,
        roll_no,
        email,
        password: hashedPassword,
        div: div,
        batch : batch,
      },
    });

    console.log(`Student Created: ${JSON.stringify(newStudent, null, 2)}`);
    res.status(201).json({ message: "Student registered successfully", student: newStudent });
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

export const Teacher = async (req, res) => {

  try {
    const { name, email, phone_no, password, roleNames } = req.body;
    console.log("Roles are:", roleNames);

    // Validate that all required fields are provided, including roleNames
    if (!name || !email || !phone_no || !password || !roleNames || roleNames.length === 0) {
      return res.status(400).json({ message: "All fields are required and at least one role must be provided" });
    }

    // Check if teacher already exists
    const existingTeacher = await prism.teacher.findUnique({
      where: { email: email },
    });

    if (existingTeacher) {
      return res.status(401).json({ message: "Teacher already exists" });
    }

    // Hash password
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    // Ensure roles exist in the database
    const rolesData = await Promise.all(
      roleNames.map(async (role) => {
        return await prism.role.upsert({
          where: { name: role },
          update: {},
          create: { name: role },
        });
      })
    );

    console.log("Roles created or fetched", rolesData);

    // Create Teacher
    const newTeacher = await prism.teacher.create({
      data: {
        name,
        email,
        password: hashedPassword,
        phone_no,
      },
    });

    console.log(`Teacher Created: ${newTeacher.name}`);

    // Associate roles with the teacher
    const roleAssociations = rolesData.map((role) => ({
      teacher_id: newTeacher.teacher_id,  // Use correct ID from teacher record
      role_id  :  role.id 

      
    }));
     console.log("role associations are" , roleAssociations)  ;
    await prism.teacherRoles.createMany({
      data: roleAssociations,
    });

    console.log("Roles assigned to teacher!");

    res.status(201).json({ message: "Teacher registered successfully", teacher: newTeacher });
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

