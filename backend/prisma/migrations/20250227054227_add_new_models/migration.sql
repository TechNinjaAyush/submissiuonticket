/*
  Warnings:

  - You are about to drop the column `type` on the `Subjects` table. All the data in the column will be lost.
  - You are about to drop the column `name` on the `Teacher` table. All the data in the column will be lost.
  - You are about to drop the column `phone_no` on the `Teacher` table. All the data in the column will be lost.

*/
-- DropIndex
DROP INDEX "Teacher_phone_no_key";

-- AlterTable
ALTER TABLE "Subjects" DROP COLUMN "type";

-- AlterTable
ALTER TABLE "Teacher" DROP COLUMN "name",
DROP COLUMN "phone_no";

-- CreateTable
CREATE TABLE "TheoryClass" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,

    CONSTRAINT "TheoryClass_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "TeacherClass" (
    "teacher_id" INTEGER NOT NULL,
    "class_id" INTEGER NOT NULL,

    CONSTRAINT "TeacherClass_pkey" PRIMARY KEY ("teacher_id","class_id")
);

-- CreateIndex
CREATE UNIQUE INDEX "TheoryClass_name_key" ON "TheoryClass"("name");

-- AddForeignKey
ALTER TABLE "TeacherClass" ADD CONSTRAINT "TeacherClass_teacher_id_fkey" FOREIGN KEY ("teacher_id") REFERENCES "Teacher"("teacher_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TeacherClass" ADD CONSTRAINT "TeacherClass_class_id_fkey" FOREIGN KEY ("class_id") REFERENCES "TheoryClass"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
