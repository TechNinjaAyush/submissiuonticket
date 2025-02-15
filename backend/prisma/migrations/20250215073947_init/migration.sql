-- CreateEnum
CREATE TYPE "Role" AS ENUM ('Mentor', 'CC', 'Theory', 'Lab', 'StudentAchievement', 'AttendanceCommittee');

-- CreateEnum
CREATE TYPE "SubjectType" AS ENUM ('Theory', 'Lab');

-- CreateEnum
CREATE TYPE "TestNumber" AS ENUM ('UT1', 'UT2', 'UT3');

-- CreateEnum
CREATE TYPE "LabStatus" AS ENUM ('Submitted', 'Pending', 'Reviewed');

-- CreateEnum
CREATE TYPE "MentorshipStatus" AS ENUM ('Pending', 'Active', 'Completed');

-- CreateEnum
CREATE TYPE "SubmissionStatus" AS ENUM ('Completed', 'Pending');

-- CreateEnum
CREATE TYPE "FeedbackStatus" AS ENUM ('Submitted', 'Pending');

-- CreateEnum
CREATE TYPE "AttendanceStatus" AS ENUM ('Present', 'Absent', 'Pending');

-- CreateEnum
CREATE TYPE "AchievementStatus" AS ENUM ('Approved', 'Pending', 'Rejected');

-- CreateTable
CREATE TABLE "Student" (
    "student_id" SERIAL NOT NULL,
    "roll_no" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,

    CONSTRAINT "Student_pkey" PRIMARY KEY ("student_id")
);

-- CreateTable
CREATE TABLE "Teacher" (
    "teacher_id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "phone_no" TEXT NOT NULL,

    CONSTRAINT "Teacher_pkey" PRIMARY KEY ("teacher_id")
);

-- CreateTable
CREATE TABLE "TeacherRoles" (
    "teacher_id" INTEGER NOT NULL,
    "role" "Role" NOT NULL,

    CONSTRAINT "TeacherRoles_pkey" PRIMARY KEY ("teacher_id","role")
);

-- CreateTable
CREATE TABLE "Subjects" (
    "sub_id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "type" "SubjectType" NOT NULL,
    "teacher_id" INTEGER,

    CONSTRAINT "Subjects_pkey" PRIMARY KEY ("sub_id")
);

-- CreateTable
CREATE TABLE "UnitTestMarks" (
    "ut_id" SERIAL NOT NULL,
    "student_id" INTEGER NOT NULL,
    "sub_id" INTEGER NOT NULL,
    "teacher_id" INTEGER,
    "test_number" "TestNumber" NOT NULL,
    "marks" INTEGER NOT NULL DEFAULT 0,

    CONSTRAINT "UnitTestMarks_pkey" PRIMARY KEY ("ut_id")
);

-- CreateTable
CREATE TABLE "LabAssignments" (
    "lab_id" SERIAL NOT NULL,
    "student_id" INTEGER NOT NULL,
    "sub_id" INTEGER NOT NULL,
    "teacher_id" INTEGER,
    "status" "LabStatus" NOT NULL DEFAULT 'Pending',

    CONSTRAINT "LabAssignments_pkey" PRIMARY KEY ("lab_id")
);

-- CreateTable
CREATE TABLE "Mentorship" (
    "mentor_id" SERIAL NOT NULL,
    "student_id" INTEGER NOT NULL,
    "teacher_id" INTEGER,
    "status" "MentorshipStatus" NOT NULL DEFAULT 'Pending',

    CONSTRAINT "Mentorship_pkey" PRIMARY KEY ("mentor_id")
);

-- CreateTable
CREATE TABLE "ClassCoordinator" (
    "cc_id" SERIAL NOT NULL,
    "student_id" INTEGER NOT NULL,
    "teacher_id" INTEGER,
    "final_submission_status" "SubmissionStatus" NOT NULL DEFAULT 'Pending',
    "feedback_status" "FeedbackStatus" NOT NULL DEFAULT 'Pending',

    CONSTRAINT "ClassCoordinator_pkey" PRIMARY KEY ("cc_id")
);

-- CreateTable
CREATE TABLE "AttendanceCoordinator" (
    "id" SERIAL NOT NULL,
    "student_id" INTEGER NOT NULL,
    "teacher_id" INTEGER,
    "attendance_status" "AttendanceStatus" NOT NULL DEFAULT 'Pending',

    CONSTRAINT "AttendanceCoordinator_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "StudentAchievementCommittee" (
    "id" SERIAL NOT NULL,
    "student_id" INTEGER NOT NULL,
    "teacher_id" INTEGER,
    "status" "AchievementStatus" NOT NULL DEFAULT 'Pending',

    CONSTRAINT "StudentAchievementCommittee_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Student_roll_no_key" ON "Student"("roll_no");

-- CreateIndex
CREATE UNIQUE INDEX "Student_email_key" ON "Student"("email");

-- CreateIndex
CREATE UNIQUE INDEX "Teacher_email_key" ON "Teacher"("email");

-- CreateIndex
CREATE UNIQUE INDEX "Teacher_phone_no_key" ON "Teacher"("phone_no");

-- AddForeignKey
ALTER TABLE "TeacherRoles" ADD CONSTRAINT "TeacherRoles_teacher_id_fkey" FOREIGN KEY ("teacher_id") REFERENCES "Teacher"("teacher_id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Subjects" ADD CONSTRAINT "Subjects_teacher_id_fkey" FOREIGN KEY ("teacher_id") REFERENCES "Teacher"("teacher_id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UnitTestMarks" ADD CONSTRAINT "UnitTestMarks_student_id_fkey" FOREIGN KEY ("student_id") REFERENCES "Student"("student_id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UnitTestMarks" ADD CONSTRAINT "UnitTestMarks_sub_id_fkey" FOREIGN KEY ("sub_id") REFERENCES "Subjects"("sub_id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UnitTestMarks" ADD CONSTRAINT "UnitTestMarks_teacher_id_fkey" FOREIGN KEY ("teacher_id") REFERENCES "Teacher"("teacher_id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "LabAssignments" ADD CONSTRAINT "LabAssignments_student_id_fkey" FOREIGN KEY ("student_id") REFERENCES "Student"("student_id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "LabAssignments" ADD CONSTRAINT "LabAssignments_sub_id_fkey" FOREIGN KEY ("sub_id") REFERENCES "Subjects"("sub_id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "LabAssignments" ADD CONSTRAINT "LabAssignments_teacher_id_fkey" FOREIGN KEY ("teacher_id") REFERENCES "Teacher"("teacher_id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Mentorship" ADD CONSTRAINT "Mentorship_student_id_fkey" FOREIGN KEY ("student_id") REFERENCES "Student"("student_id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Mentorship" ADD CONSTRAINT "Mentorship_teacher_id_fkey" FOREIGN KEY ("teacher_id") REFERENCES "Teacher"("teacher_id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ClassCoordinator" ADD CONSTRAINT "ClassCoordinator_student_id_fkey" FOREIGN KEY ("student_id") REFERENCES "Student"("student_id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ClassCoordinator" ADD CONSTRAINT "ClassCoordinator_teacher_id_fkey" FOREIGN KEY ("teacher_id") REFERENCES "Teacher"("teacher_id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AttendanceCoordinator" ADD CONSTRAINT "AttendanceCoordinator_student_id_fkey" FOREIGN KEY ("student_id") REFERENCES "Student"("student_id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AttendanceCoordinator" ADD CONSTRAINT "AttendanceCoordinator_teacher_id_fkey" FOREIGN KEY ("teacher_id") REFERENCES "Teacher"("teacher_id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "StudentAchievementCommittee" ADD CONSTRAINT "StudentAchievementCommittee_student_id_fkey" FOREIGN KEY ("student_id") REFERENCES "Student"("student_id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "StudentAchievementCommittee" ADD CONSTRAINT "StudentAchievementCommittee_teacher_id_fkey" FOREIGN KEY ("teacher_id") REFERENCES "Teacher"("teacher_id") ON DELETE SET NULL ON UPDATE CASCADE;
