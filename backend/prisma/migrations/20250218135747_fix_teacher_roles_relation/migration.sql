/*
  Warnings:

  - The primary key for the `TeacherRoles` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `role` on the `TeacherRoles` table. All the data in the column will be lost.
  - Added the required column `div` to the `ClassCoordinator` table without a default value. This is not possible if the table is not empty.
  - Added the required column `batch` to the `LabAssignments` table without a default value. This is not possible if the table is not empty.
  - Added the required column `batch` to the `Mentorship` table without a default value. This is not possible if the table is not empty.
  - Added the required column `batch` to the `Student` table without a default value. This is not possible if the table is not empty.
  - Added the required column `div` to the `Student` table without a default value. This is not possible if the table is not empty.
  - Added the required column `password` to the `Student` table without a default value. This is not possible if the table is not empty.
  - Added the required column `password` to the `Teacher` table without a default value. This is not possible if the table is not empty.
  - Added the required column `role_id` to the `TeacherRoles` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "UserRole" AS ENUM ('Mentor', 'CC', 'Theory', 'Lab', 'StudentAchievement', 'AttendanceCommittee', 'Auditcourse');

-- CreateEnum
CREATE TYPE "AuditcourseStatus" AS ENUM ('Approved', 'Pending', 'Rejected');

-- DropForeignKey
ALTER TABLE "TeacherRoles" DROP CONSTRAINT "TeacherRoles_teacher_id_fkey";

-- AlterTable
ALTER TABLE "ClassCoordinator" ADD COLUMN     "div" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "LabAssignments" ADD COLUMN     "batch" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "Mentorship" ADD COLUMN     "batch" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "Student" ADD COLUMN     "batch" TEXT NOT NULL,
ADD COLUMN     "div" TEXT NOT NULL,
ADD COLUMN     "password" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "Teacher" ADD COLUMN     "password" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "TeacherRoles" DROP CONSTRAINT "TeacherRoles_pkey",
DROP COLUMN "role",
ADD COLUMN     "role_id" INTEGER NOT NULL,
ADD CONSTRAINT "TeacherRoles_pkey" PRIMARY KEY ("teacher_id", "role_id");

-- DropEnum
DROP TYPE "Role";

-- CreateTable
CREATE TABLE "Role" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,

    CONSTRAINT "Role_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "AuditcourseCommittee" (
    "id" SERIAL NOT NULL,
    "student_id" INTEGER NOT NULL,
    "teacher_id" INTEGER,
    "batch" TEXT NOT NULL,
    "status" "AuditcourseStatus" NOT NULL DEFAULT 'Pending',

    CONSTRAINT "AuditcourseCommittee_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Role_name_key" ON "Role"("name");

-- AddForeignKey
ALTER TABLE "TeacherRoles" ADD CONSTRAINT "TeacherRoles_teacher_id_fkey" FOREIGN KEY ("teacher_id") REFERENCES "Teacher"("teacher_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TeacherRoles" ADD CONSTRAINT "TeacherRoles_role_id_fkey" FOREIGN KEY ("role_id") REFERENCES "Role"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AuditcourseCommittee" ADD CONSTRAINT "AuditcourseCommittee_student_id_fkey" FOREIGN KEY ("student_id") REFERENCES "Student"("student_id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AuditcourseCommittee" ADD CONSTRAINT "AuditcourseCommittee_teacher_id_fkey" FOREIGN KEY ("teacher_id") REFERENCES "Teacher"("teacher_id") ON DELETE SET NULL ON UPDATE CASCADE;
