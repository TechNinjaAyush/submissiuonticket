import express from "express"
import { TheoryTeacherDashboard } from "../controllers/TheoryTeacher.js";
import { FetchTheoryStudents } from "../controllers/TheoryTeacher.js";
import { UpdateUnitTestMarks } from "../controllers/TheoryTeacher.js";
import { LabTeacherDashboard } from "../controllers/LabTeacher.js";
import { studentDashboard } from "../controllers/StudentDashboard.js";
import { StudentAchievementDashboard } from "../controllers/StudentAchievementCommitie.js";
import { getAuditCourseBatches } from "../controllers/AuditCourseDashboard.js";
import { getCCdivision } from "../controllers/CCdashboard.js";
import { FetchinngLabStudents } from "../controllers/LabTeacher.js";
import { UpdateLabStatus } from "../controllers/LabTeacher.js";
import { UpdateAuditCourseStatus } from "../controllers/AuditCourseDashboard.js";
import { getAuditCourseStudents } from "../controllers/AuditCourseDashboard.js";
import { getCCstudents } from "../controllers/CCdashboard.js";
import { updateFeedbackStatus } from "../controllers/CCdashboard.js";
import { UpdateSubmissionStatus } from "../controllers/CCdashboard.js";
import { updateAttendanceStatus } from "../controllers/Attendancecoordiantor.js";
import { FetchingStudents } from "../controllers/Attendancecoordiantor.js";
import { downloadStudentReport } from "../controllers/StudentReport.js";
 
const router = express.Router(); 
router.get("/attendance-coordinator/students", FetchingStudents);
router.put("/attendance-coordinator/status", updateAttendanceStatus);
router.get("/StudentReportPdF" , downloadStudentReport)
router.get("/teachers/theory", TheoryTeacherDashboard);
router.get("/teachers/lab", LabTeacherDashboard);
router.get("/teachers/audit-courses/batches", getAuditCourseBatches);
router.get("/teachers/achievements", StudentAchievementDashboard);
router.get("/students", studentDashboard);
router.get("/class-coordinator/divisions", getCCdivision);
router.get("/class-coordinator/students", getCCstudents);
router.put("/class-coordinator/Feedbackstatus", updateFeedbackStatus);
router.put("/class-coordinator/submission-status", UpdateSubmissionStatus);

router.get("/students/lab", FetchinngLabStudents);
router.put("/students/lab/status", UpdateLabStatus);

router.get("/students/audit-courses", getAuditCourseStudents);
router.put("/students/audit-courses/status", UpdateAuditCourseStatus);

router.get("/students/theory", FetchTheoryStudents);
router.put("/students/unit-test-marks", UpdateUnitTestMarks);

export  default  router 