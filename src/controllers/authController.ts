import { Request, Response, NextFunction } from 'express';
import bcrypt from 'bcryptjs';
import User from '../models/User';
import jwt from 'jsonwebtoken';

const signJWTToken = (userId: string, role = 'user') => {
  return jwt.sign({ id: userId, role: role }, process.env.JWT_SECRET || 'jwt_secret', {
    expiresIn: '1d',
  });
};

const signJWTRefreshToken = (userId: string, role = 'user') => {
  return jwt.sign({ id: userId, role: role }, process.env.JWT_REFRESH_SECRET || 'jwt_refresh_secret', {
    expiresIn: '2d',
  });
};

export const register = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const salt = bcrypt.genSaltSync(10);
    const hash = bcrypt.hashSync(req.body.password, salt);
    const newUser = new User({ ...req.body, password: hash });

    await newUser.save();

    return res.status(200).json({ success: 'User has been created!', user: newUser });
  } catch (err) {
    return res.status(400).json({ err });
  }
};

export const login = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const user = await User.findOne({ name: req.body.name });
    if (!user) return res.status(404).json('User not found!');

    const isCorrect = await bcrypt.compare(req.body.password, user.password);

    if (!isCorrect) return res.status(400).json('Wrong Credentials!');

    const token = signJWTToken(user.id, user.role);

    const refreshToken = signJWTRefreshToken(user.id, user.role);

    return res
      .cookie('jwt_refresh_token', refreshToken, {
        httpOnly: true,
      })
      .status(200)
      .json({ access_token: token });
  } catch (err) {
    next(err);
  }
};

export const profile = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const id = req.userId;
    const user = await User.findById(id).select({ password: 0 });

    return res.status(200).json({ profile: user });
  } catch (error) {
    next(error);
  }
};
