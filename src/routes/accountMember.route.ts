import { Router } from "express";
import { AccountMemberController } from "../controllers/accountMember.controller";
import { AccountMemberService } from "../services/accountMember.service";
import { AccountMemberRepository } from "../repositories/accountMember.repository";
import { RoleRepository } from "../repositories/role.repository";
import { authMiddleware } from "../middlewares/auth.middleware";
import { UserRepository } from "../repositories/user.repository";
import { AccountRepository } from "../repositories/account.repository";

const router = Router();

const accountMemberRepo = new AccountMemberRepository();
const roleRepo = new RoleRepository();
const userRepository = new UserRepository();
const accountRepo = new AccountRepository();

const accountMemberService = new AccountMemberService(
  accountMemberRepo,
  roleRepo,
  accountRepo,
  userRepository
);
const accountMemberController = new AccountMemberController(
  accountMemberService
);

router.post("/", authMiddleware, accountMemberController.addUserToAccount);
router.get(
  "/:accountId",
  authMiddleware,
  accountMemberController.getMembersOfAccount
);
router.patch(
  "/account/:accountId/user/:userId/role",
  authMiddleware,
  accountMemberController.changeUserRole
);
router.delete(
  "/account/:accountId/user/:userId",
  authMiddleware,
  accountMemberController.removeUser
);

export default router;
