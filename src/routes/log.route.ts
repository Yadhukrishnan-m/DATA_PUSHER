import express from "express";
import { LogController } from "../controllers/log.controller";
import { LogRepository } from "../repositories/log.repository";
import { AccountMemberRepository } from "../repositories/accountMember.repository";
import { LogService } from "../services/log.service";
import { authMiddleware } from "../middlewares/auth.middleware";


const router = express.Router();

// Manual DI setup
const logRepo = new LogRepository();
const accountMemberRepo = new AccountMemberRepository();
const logService = new LogService(logRepo, accountMemberRepo);
const logController = new LogController(logService);

router.get(
  "/:accountId",
  authMiddleware,
  logController.getLogsByAccount
);

export default router;
