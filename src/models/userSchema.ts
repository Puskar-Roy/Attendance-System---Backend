import { Schema, model } from 'mongoose';
import bcrypt from 'bcryptjs';
import { User } from '../interfaces/userInterface';

const userSchema = new Schema<User>(
  {
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
    cpassword: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

userSchema.pre('save', async function (next) {
  const user = this as User;

  if (!user.isModified('password') && !user.isModified('cpassword'))
    return next();
  try {
    const salt = await bcrypt.genSalt(10);
    if (user.isModified('password')) {
      const hashedPassword = await bcrypt.hash(user.password, salt);
      user.password = hashedPassword;
    }
    if (user.isModified('cpassword')) {
      const hashedCPassword = await bcrypt.hash(user.cpassword, salt);
      user.cpassword = hashedCPassword;
    }
    return next();
  } catch (error) {
    return next(error);
  }
});

const UserModel = model<User>('User', userSchema);

export default UserModel;
