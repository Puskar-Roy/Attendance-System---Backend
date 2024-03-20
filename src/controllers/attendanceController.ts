import { Request, Response } from 'express';
import asyncHandler from '../util/catchAsync';
import AttendanceModel from '../models/attendanceSchema';

export const createAttendance = asyncHandler(
  async (req: Request, res: Response) => {
    try {
      const { userId, status } = req.body;

      const existingAttendance = await AttendanceModel.findOne({
        userId,
        date: { $gte: new Date().setHours(0, 0, 0, 0) },
      });

      if (existingAttendance) {
        return res
          .status(400)
          .json({ message: 'Attendance already recorded for today.' });
      }

      const attendance = new AttendanceModel({ userId, status });
      await attendance.save();
      res.status(201).send(attendance);
    } catch (err) {
      console.error(err);
      res.status(500).send('Server Error');
    }
  }
);
export const getAttendance = asyncHandler(
  async (req: Request, res: Response) => {
    try {
      const { userId } = req.params;
      const attendance = await AttendanceModel.find({ userId }).exec();
      res.status(200).send(attendance);
    } catch (err) {
      console.error(err);
      res.status(500).send('Server Error');
    }
  }
);
export const getAttendancewithDate = asyncHandler(
  async (req: Request, res: Response) => {
    try {
      const { date } = req.params;

      if (!date) {
        return res.status(400).json({ message: 'Date parameter is required.' });
      }

      const attendance = await AttendanceModel.find({
        date: {
          $gte: new Date(date),
          $lt: new Date(date).setDate(new Date(date).getDate() + 1),
        },
      }).exec();

      res.status(200).send(attendance);
    } catch (err) {
      console.error(err);
      res.status(500).send('Server Error');
    }
  }
);
