import express, { Router } from 'express';
import {
  createAttendance,
  getAttendance,
  getAttendancewithDate,
  getAttendanceCounts,
  getSingleAttendance,
  changeAttendance,
  deleteAttendance,
} from '../controllers/attendanceController';
import { protect, protectAdmin } from '../middleware/middleware';

const router: Router = express.Router();

router.post('/attendance', protect, createAttendance);
router.get('/attendance/:userId', protectAdmin, getAttendance);
router.get('/attendance/user/:id', protectAdmin, getSingleAttendance);
router.get('/attendance/date/:date', protectAdmin, getAttendancewithDate);
router.get('/attendance/counts/:userId', protect, getAttendanceCounts);
router.put('/attendance/change-status/:id', protectAdmin, changeAttendance);
router.delete('/attendance/:id', protectAdmin, deleteAttendance);

export default router;
