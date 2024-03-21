import express, { Router } from 'express';
import {
  createAttendance,
  getAttendance,
  getAttendancewithDate,
  getAttendanceCounts,
} from '../controllers/attendanceController';
import { protect, protectAdmin } from '../middleware/middleware';

const router: Router = express.Router();

router.post('/attendance', protect, createAttendance);
router.get('/attendance/:userId', protectAdmin, getAttendance);
router.get('/attendance/date/:date', protectAdmin, getAttendancewithDate);
router.get('/attendance/counts/:userId', protect, getAttendanceCounts);

export default router;
