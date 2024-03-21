import { Request, Response } from 'express';
import asyncHandler from '../util/catchAsync';
import AttendanceModel from '../models/attendanceSchema';
import UserModel from '../models/userSchema';

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
      res.status(201).send({ message: 'Attendance Done!' });
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
      })
        .populate('userId', 'name email')
        .exec();

      res.status(200).send(attendance);
    } catch (err) {
      console.error(err);
      res.status(500).send('Server Error');
    }
  }
);
export const getAttendanceCounts = asyncHandler(
  async (req: Request, res: Response) => {
    try {
      const { userId } = req.params;

      const presentDays = await AttendanceModel.countDocuments({
        userId,
        status: 'present',
      });
      const absentDays = await AttendanceModel.countDocuments({
        userId,
        status: 'absent',
      });

      res.status(200).json({ presentDays, absentDays });
    } catch (err) {
      console.error(err);
      res.status(500).send('Server Error');
    }
  }
);

export const getSingleAttendance = asyncHandler(
  async (req: Request, res: Response) => {
    const { id } = req.params;
    console.log(id);

    try {
      const attendance = await AttendanceModel.findById(id);

      if (!attendance) {
        return res.status(404).json({ message: 'Attendance not found' });
      }

      const { userId, date, status } = attendance;

      const user = await UserModel.findById(userId);

      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }

      const { name, email } = user;

      res
        .status(200)
        .json({ status: status, userName: name, userEmail: email, date });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Server Error' });
    }
  }
);

export const changeAttendance = asyncHandler(
  async (req: Request, res: Response) => {
    const { id } = req.params;
    const { status } = req.body;

    try {
      const attendance = await AttendanceModel.findByIdAndUpdate(
        id,
        { status },
        { new: true }
      );

      if (!attendance) {
        return res.status(404).json({ message: 'Attendance not found' });
      }

      res.status(200).json(attendance);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Server Error' });
    }
  }
);
