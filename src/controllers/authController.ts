import { Request, Response } from 'express';
import asyncHandler from '../util/catchAsync';
import UserModel from '../models/userSchema';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import validator from 'validator';
import { CookieOptions } from '../interfaces/cookieOption';
import config from '../config/config';
import { createToken } from '../util/utils';

export const login = asyncHandler(async (req: Request, res: Response) => {
  const { email, password } = req.body;
  try {
    res.status(200).json({ success: true });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error',
    });
  }
});

export const register = asyncHandler(async (req: Request, res: Response) => {
  const { name, email, password } = req.body;
  if (!name || !email || !password) {
    throw Error('All fields must be filled');
  }
  if (!validator.isEmail(email)) {
    throw Error('Email is not valid');
  }
  try {
    const exists = await UserModel.findOne({ email });
    if (exists) {
      throw Error('Email already in use');
    }
    const salt = await bcrypt.genSalt(10);
    const hash = await bcrypt.hash(password, salt);
    const user = await UserModel.create({ name, email, password: hash });
    const token = createToken(user._id);
    return res.status(201).json({
      message: 'Registration successful!',
      success: true,
      token: token,
    });
  } catch (error) {
    console.error('Registration error:', error.message);
    return res.status(500).json({ message: error.message, success: false });
  }
});
