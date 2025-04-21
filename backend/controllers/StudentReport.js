import { prism } from "../config/db.config.js";
import PDFDocument from "pdfkit";

export const downloadStudentReport = async (req, res) => {
  const { student_id } = req.query;

  if (!student_id) {
    return res.status(400).json({ message: "Please provide student id" });
  }

  try {
    const studentDetails = await prism.student.findUnique({
      where: {
        student_id: parseInt(student_id),
      },
      include: {
        unitTestMarks: {
          include: {
            theorysubject: {
              select: {
                name: true,
              },
            },
          },
        },
        labAssignments: {
          include: {
            labsubjects: {
              select: {
                name: true,
              },
            },
          },
        },
        classCoordinator: true,
        attendanceCoordinator: true,
        auditcourse: true,
      },
    });
  
    if (!studentDetails) {
      return res.status(404).json({ message: "Student not found" });
    }
  
    const doc = new PDFDocument();
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `attachment; filename=student_report_${student_id}.pdf`);
    doc.pipe(res);
  
    doc.fontSize(25).text('Student Academic Report', { align: 'center' });
    doc.moveDown();
  
    // Student Info
    doc.fontSize(16).text('Student Information').moveDown(0.5);
    doc.fontSize(12).text(`Name: ${studentDetails.name ?? '-'}`);
    doc.text(`Roll No: ${studentDetails.roll_no ?? '-'}`);
    doc.text(`Division: ${studentDetails.div ?? '-'}`);
    doc.text(`Batch: ${studentDetails.batch ?? '-'}`);
    doc.moveDown();
  
    // Unit Test Marks
    doc.fontSize(16).text('Unit Test Marks').moveDown(0.5);
    const unitTestsBySubject = (studentDetails.unitTestMarks || []).reduce((acc, test) => {
      const subjectName = test.theorysubject?.name ?? "Unknown";
      if (!acc[subjectName]) {
        acc[subjectName] = { UT1: '-', UT2: '-', UT3: '-' };
      }
      acc[subjectName][`UT${test.test_number}`] = test.marks ?? '-';
      return acc;
    }, {});
  
    doc.fontSize(12).text('Subject', 50, doc.y);
    doc.text('UT1', 250, doc.y - 12);
    doc.text('UT2', 350, doc.y - 12);
    doc.text('UT3', 450, doc.y - 12);
    doc.moveDown(0.5);
  
    Object.entries(unitTestsBySubject).forEach(([subject, marks]) => {
      doc.text(subject, 50, doc.y);
      doc.text(marks.UT1.toString(), 250, doc.y - 12);
      doc.text(marks.UT2.toString(), 350, doc.y - 12);
      doc.text(marks.UT3.toString(), 450, doc.y - 12);
      doc.moveDown(0.5);
    });
    doc.moveDown();
  
    // Lab Assignments
    doc.fontSize(16).text('Lab Assignments').moveDown(0.5);
    doc.fontSize(12).text('Subject', 50, doc.y);
    doc.text('Batch', 250, doc.y - 12);
    doc.text('Status', 350, doc.y - 12);
    doc.moveDown(0.5);
  
    (studentDetails.labAssignments || []).forEach(lab => {
      doc.text(lab.labsubjects?.name ?? '-', 50, doc.y);
      doc.text(lab.batch ?? '-', 250, doc.y - 12);
      doc.text(lab.status ?? '-', 350, doc.y - 12);
      doc.moveDown(0.5);
    });
    doc.moveDown();
  
    // Class Coordinator
    doc.fontSize(16).text('Class Coordinator').moveDown(0.5);
    doc.fontSize(12).text('Division', 50, doc.y);
    doc.text('Submission', 150, doc.y - 12);
    doc.text('Feedback', 250, doc.y - 12);
    doc.moveDown(0.5);
  
    (studentDetails.classCoordinator || []).forEach(coord => {
      doc.text(coord.Div ?? '-', 50, doc.y);
      doc.text(coord.final_submission_status ?? '-', 150, doc.y - 12);
      doc.text(coord.feedback_status ?? '-', 250, doc.y - 12);
      doc.moveDown(0.5);
    });
    doc.moveDown();
  
    // Attendance
    doc.fontSize(16).text('Attendance Status').moveDown(0.5);
    (studentDetails.attendanceCoordinator || []).forEach(att => {
      doc.fontSize(12).text(`Status: ${att.attendance_status ?? '-'}`);
      doc.moveDown(0.5);
    });
    doc.moveDown();
  
    // Audit Courses
    doc.fontSize(16).text('Audit Courses').moveDown(0.5);
    doc.fontSize(12).text('Batch', 50, doc.y);
    doc.text('Status', 150, doc.y - 12);
    doc.moveDown(0.5);
  
    (studentDetails.auditcourse || []).forEach(course => {
      doc.text(course.batch ?? '-', 50, doc.y);
      doc.text(course.status ?? '-', 150, doc.y - 12);
      doc.moveDown(0.5);
    });
  
    doc.moveDown();
    doc.fontSize(10).text(`Generated on: ${new Date().toLocaleString()}`, { align: 'right' });
  
    doc.end();
  
  } catch (err) {
    console.error("Failed to generate student report:", err);
    return res.status(500).json({ message: "Internal server error" });
  }
  
};