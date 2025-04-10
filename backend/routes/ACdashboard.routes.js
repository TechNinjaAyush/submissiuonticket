import express from 'express';
import { getACstudents, updateAttendanceStatus, getACdivision } from '../controllers/ACdashboard.js';

const router = express.Router();

// Get students for a specific division
router.get('/students', getACstudents);

// Update attendance status for a student
router.put('/update-status', updateAttendanceStatus);

// Get divisions assigned to an attendance coordinator
router.get('/divisions', getACdivision);

export default router; 