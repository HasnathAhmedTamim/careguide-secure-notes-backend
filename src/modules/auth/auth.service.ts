import jwt, { SignOptions } from 'jsonwebtoken';
import { env } from '../../config/env';
import { ApiError } from '../../utils/ApiError';
import { User } from '../users/user.model';
import { loginSchema, registerSchema } from './auth.validation';

function signToken(userId: string, role: 'user' | 'admin') {
  const options: SignOptions = {
    expiresIn: env.JWT_EXPIRES_IN as SignOptions['expiresIn'],
  };
  return jwt.sign({ id: userId, role }, env.JWT_SECRET, options);
}

export async function register(input: unknown) {
  const data = registerSchema.parse(input);

  const existing = await User.findOne({ email: data.email });
  if (existing) {
    throw new ApiError(409, 'Email already registered');
  }

  // Public registration always creates role=user (mass-assignment safe)
  const user = await User.create({
    name: data.name,
    email: data.email,
    password: data.password,
    interests: data.interests,
    role: 'user',
  });

  const token = signToken(user.id, user.role);
  return { token, user: user.toSafeObject() };
}

export async function login(input: unknown) {
  const data = loginSchema.parse(input);
  const user = await User.findOne({ email: data.email });
  if (!user || !(await user.comparePassword(data.password))) {
    throw new ApiError(401, 'Invalid email or password');
  }

  const token = signToken(user.id, user.role);
  return { token, user: user.toSafeObject() };
}

export async function getMe(userId: string) {
  const user = await User.findById(userId);
  if (!user) {
    throw new ApiError(404, 'User not found');
  }
  return user.toSafeObject();
}
