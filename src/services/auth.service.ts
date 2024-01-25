import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import AuthRepository from '../models/auth.repository';
import logger from '../utils/logging/logger';
import { sendVerificationEmail } from '../utils/emails/emails';
import { IMutableUser } from '../interfaces/auth.interface';

const jwtSecret = process.env.JWT_SECRET || 'secret';
const authRepository = new AuthRepository();

export default class AuthService {
    async createUser(username: string, email: string, password: string, firstName: string, lastName: string, profileImage?: string) {
        try {
            const hashedPassword = await bcrypt.hash(password, 10);
            const user: IMutableUser | null = await authRepository.createUser({ username, email, password: hashedPassword, firstName, lastName, profileImage });
            if (!user) {
                throw new Error('Failed to create user');
            }
            const token = jwt.sign({ userId: user.id }, jwtSecret, { expiresIn: '1h' });
            if (!token) {
                throw new Error('Failed to generate token');
            }
            const refreshToken = await authRepository.createRefreshToken({ token: token, userId: user.id });
            if (!refreshToken) {
                throw new Error('Failed to create refresh token');
            }
            delete user.password;
            return { user, token, refreshToken };
        } catch (error) {
            throw error;
        }
    }

    async login(email: string, password: string) {
        try {
            const user: IMutableUser | null = await authRepository.getUserByEmail(email);
            if (!user || !user.password) {
                throw new Error('User not found');
            }
            const isPasswordValid = await bcrypt.compare(password, user.password);
            if (!isPasswordValid) {
                throw new Error('Invalid password');
            }
            const token = jwt.sign({ userId: user.id }, jwtSecret, { expiresIn: '1h' });
            const refreshToken = await authRepository.replaceRefreshToken(user.id, token);
            if (!refreshToken) {
                throw new Error('Failed to create refresh token');
            }
            delete user.password;
            return { user, token, refreshToken };
        } catch (error) {
            throw error;
        }
    }

    async logout(userId: number) {
        try {
            const deletedRefreshToken = await authRepository.deleteRefreshTokenByUserId(userId);
            if (!deletedRefreshToken) {
                throw new Error('Failed to delete refresh token');
            }
            return true;
        } catch (error) {
            throw error;
        }
    }

    async forgotPassword(email: string) {
        try {
            const user = await authRepository.getUserByEmail(email);
            if (!user) {
                throw new Error('User not found');
            }
            const token = Math.random().toString(36).substr(2, 6);
            const updatedUser = await authRepository.updateVerifToken(user.id, token);
            if (!updatedUser) {
                throw new Error('Failed to update verification token');
            }
            await sendVerificationEmail(updatedUser);
            return true;
        } catch (error) {
            logger.error(error);
            throw error;
        }
    }

    async resetPassword(email: string, token: string, password: string) {
        try {
            const user = await authRepository.getUserByEmail(email);
            if (!user) {
                throw new Error('User not found');
            }
            if (user.verificationToken !== token) {
                throw new Error('Invalid token');
            }
            const hashedPassword = await bcrypt.hash(password, 10);
            const updatedUser = await authRepository.updateUser(user.id, { password: hashedPassword, verificationToken: null });
            if (!updatedUser) {
                throw new Error('Failed to update user');
            }
            return true;
        } catch (error) {
            logger.error(error);
            throw error;
        }
    }
}
