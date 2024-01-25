import AuthService from "../services/auth.service";
import { Request, Response } from "express";

const authService = new AuthService();
const profileImage = 'https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png';

export default class AuthController {
    async createUser(req: Request, res: Response) {
        try {
            const { username, email, password, firstName, lastName } = req.body;
            if (!username || !email || !password || !firstName || !lastName) {
                throw new Error('Missing required fields');
            }
            const { user, token, refreshToken } = await authService.createUser(username, email, password, firstName, lastName, profileImage);
            res.status(201).json({ user, token, refreshToken });
        } catch (error: any) {
            res.status(500).json({ error: error.message });
        }
    }

    async login(req: Request, res: Response) {
        try {
            const { email, password } = req.body;
            if (!email || !password) {
                throw new Error('Missing required fields');
            }
            const { user, token, refreshToken } = await authService.login(email, password);
            res.status(200).json({ user, token, refreshToken });
        } catch (error: any) {
            res.status(500).json({ error: error.message });
        }
    }

    async logout(req: Request, res: Response) {
        try {
            const { userId } = req.body;
            if (!userId) {
                throw new Error('Missing required fields');
            }
            const deletedRefreshToken = await authService.logout(userId);
            if (!deletedRefreshToken) {
                throw new Error('Failed to delete refresh token');
            }
            res.status(200).json({ message: 'Logout successful' });
        } catch (error: any) {
            res.status(500).json({ error: error.message });
        }
    }

    async forgotPassword(req: Request, res: Response) {
        try {
            const { email } = req.body;
            if (!email) {
                throw new Error('Missing required fields');
            }
            const message = await authService.forgotPassword(email);
            res.status(200).json({ message });
        } catch (error: any) {
            res.status(500).json({ error: error.message });
        }
    }

    async resetPassword(req: Request, res: Response) {
        try {
            const { email, token, password } = req.body;
            if (!email || !token || !password) {
                throw new Error('Missing required fields');
            }
            const message = await authService.resetPassword(email, token, password);
            res.status(200).json({ message });
        } catch (error: any) {
            res.status(500).json({ error: error.message });
        }
    }

    // TODO: Profile Image Upload

    
}