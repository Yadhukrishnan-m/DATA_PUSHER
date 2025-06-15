import { Router } from "express";
import { AuthService } from "../services/auth.service";
import { UserRepository } from "../repositories/user.repository";
import { AuthController } from "../controllers/auth.controller";
import { validate } from "../middlewares/zod.middleware";
import { loginSchema, registerSchema } from "../validators/auth.validation";

// Dependency injection
const userRepository = new UserRepository();
const authService = new AuthService(userRepository);
const authController = new AuthController(authService);


const router = Router();

router.post("/register",validate(registerSchema), authController.register);
router.post("/login",validate(loginSchema), authController.login);
router.post("/refresh-token", authController.refreshToken);
router.post("/logout", authController.logout);

export default router;
