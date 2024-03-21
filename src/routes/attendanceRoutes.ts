import express, { Router } from 'express';
import {
  createAttendance,
  getAttendance,
  getAttendancewithDate,
  getAttendanceCounts,
} from '../controllers/attendanceController';
import { protect } from '../middleware/middleware';

const router: Router = express.Router();

router.post('/attendance', protect, createAttendance);
router.get('/attendance/:userId', getAttendance);
router.get('/attendance/date/:date', getAttendancewithDate);
router.get('/attendance/counts/:userId', protect, getAttendanceCounts);

export default router;
