    import { Router } from "express";
    import { AccountController } from "../controllers/account.controller";
    import { AccountService } from "../services/account.service";
    import { AccountRepository } from "../repositories/account.repository";
    import { AccountMemberRepository } from "../repositories/accountMember.repository";
    import { authMiddleware } from "../middlewares/auth.middleware";
import { validate } from "../middlewares/zod.middleware";
import { CreateAccountSchema, UpdateAccountSchema } from "../validators/account.validation";
import { RoleRepository } from "../repositories/role.repository";
import { UserRepository } from "../repositories/user.repository";

    const router = Router();

    const accountRepo = new AccountRepository();
    const accountMemberRepo = new AccountMemberRepository();
    const roleRepo=new RoleRepository()
    const userRepo=new UserRepository()
    const accountService = new AccountService(
      accountRepo,
      accountMemberRepo,
      roleRepo,
      userRepo
    );
    const accountController = new AccountController(accountService);

    router.post("/",authMiddleware,validate(CreateAccountSchema), accountController.createAccount);
    router.get("/", authMiddleware, accountController.getAllAccounts);
    router.patch("/:id", authMiddleware,validate(UpdateAccountSchema), accountController.updateAccount);
    router.get("/:id", authMiddleware, accountController.getAccountById);
    router.delete("/:id", authMiddleware, accountController.deleteAccount);

    export default router;
