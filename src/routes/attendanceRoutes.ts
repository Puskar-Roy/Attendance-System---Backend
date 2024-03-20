import express, { Router } from 'express';
import {
  createAttendance,
  getAttendance,
  getAttendancewithDate,
} from '../controllers/attendanceController';

const router: Router = express.Router();

router.post('/attendance', createAttendance);
router.get('/attendance/:userId', getAttendance);
router.get('/attendance/:date', getAttendancewithDate);

export default router;
