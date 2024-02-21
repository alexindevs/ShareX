import AuthController from "../controllers/auth.controller";
import { Router } from "express";

const AuthRouter = Router();
const authController = new AuthController();

AuthRouter.post('/signup', authController.createUser);
AuthRouter.post('/login', authController.login);
AuthRouter.post('/logout', authController.logout);
AuthRouter.post('/forgot-password', authController.forgotPassword);
AuthRouter.post('/reset-password', authController.resetPassword);

export default AuthRouter; 