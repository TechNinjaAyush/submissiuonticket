import bcrypt from "bcryptjs";
import { prism } from "../config/db.config.js";
import { AttendanceStatus, TestNumber } from "@prisma/client";

// 📌 Student Registration
async function InsertingUnitTestData(student_id, Div) {
  const sub_id = [1, 2, 3, 4];
  const unit_test = ["UT1", "UT2", "UT3"];
  const result = sub_id.flatMap(id =>
    unit_test.map(test_number => ({
      student_id,
      sub_id: id,
      test_number,
      marks: 0,
      Div
    }))
  );

  console.log("result is", result);

  try {
    // Inserting unit test data in UT table
    const UnitTestData = await prism.unitTestMarks.createMany({
      data: result
    });
    console.log("Data inserted successfully", UnitTestData);
  } catch (err) {
    console.error("Error in inserting data", err);
  }

  return result;
}

async function AttendenceStatus(student_id) {
  try {
    const attendance_status = await prism.attendanceCoordinator.create({
      data: { student_id, attendance_status: "Pending" }
    });
    console.log("Attendance Data inserted successfully", attendance_status);
  } catch (err) {
    console.error("Problem in inserting data", err);
  }
}

async function AuditcourseStatus(student_id, batch) {
  try {
    const data = await prism.auditcourseCommittee.create({
      data: { student_id, status: "Pending", batch }
    });
    console.log("Audit Course Data inserted successfully", data);
  } catch (err) {
    console.error("Error in inserting Audit course data", err);
  }
}

async function LabAssignmentStatus(student_id, batch) {
  const sub_id = [1, 2, 3, 4];

  try {
    const result = sub_id.map(sub => ({
      student_id,
      sub_id: sub,
      status: "Pending",
      batch
    }));

    const data = await prism.labAssignments.createMany({
      data: result
    });

    console.log("Lab Assignment Data inserted successfully", data);
  } catch (err) {
    console.error("Insertion unsuccessful", err);
  }
}

async function Mentorship(student_id, batch) {
  try {
    const result = await prism.mentorship.create({
      data: { student_id, status: "Pending", batch }
    });
    console.log("Mentorship Data inserted successfully", result);
  } catch (err) {
    console.error("Error inserting mentorship data", err);
  }
}

async function classCoordinatorCommittie(student_id, Div) {
  try {
    
    const result = await prism.classCoordinator.create({
      data: {
        student_id,
        Div,
        final_submission_status: "Pending",
        feedback_status: "Pending",
         
      }
    });
    console.log("Class Coordinator Data inserted successfully", result);
  } catch (err) {
    console.error("Error inserting class coordinator data", err);
  }
}

async function studentAchievementCommittee(student_id) {
  try {
    const result = await prism.studentAchievementCommittee.create({
      data: { student_id, status: "Pending" }
    });
    console.log("Student Achievement Data inserted successfully", result);
  } catch (err) {
    console.error("Error inserting student achievement data", err);
  }
}

export const StudentRegister = async (req, res) => {
  try {
    const { name, roll_no, email, password, div, batch } = req.body;
    console.log(req.body);

    // Check if student already exists
    const existingStudent = await prism.student.findUnique({
      where: { email }
    });

    if (existingStudent) {
      return res.status(401).json({ message: "User already exists" });
    }

    // Hash password
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    // Create Student
    const newStudent = await prism.student.create({
      data: { name, roll_no, email, password: hashedPassword, div, batch }
    });

    const student_id = newStudent.student_id;
    const Batch = newStudent.batch;
    const Div = newStudent.div;

    // ✅ Await each function call
    await InsertingUnitTestData(student_id, Div);
    await AttendenceStatus(student_id);
    await AuditcourseStatus(student_id, Batch);
    await LabAssignmentStatus(student_id, Batch);
    await Mentorship(student_id, Batch);
    await studentAchievementCommittee(student_id);
    await classCoordinatorCommittie(student_id, Div);

    console.log(`Student Created: ${JSON.stringify(newStudent, null, 2)}`);
    res.status(201).json({ message: "Student registered successfully", student: newStudent });
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};
