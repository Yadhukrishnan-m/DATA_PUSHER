import { Router } from "express";
import { DestinationController } from "../controllers/destination.controller";
import { DestinationRepository } from "../repositories/destination.repository";
import { DestinationService } from "../services/destination.service";
import { authMiddleware } from "../middlewares/auth.middleware";
import { AccountMemberRepository } from "../repositories/accountMember.repository";
import { validate } from "../middlewares/zod.middleware";
import { createDestinationSchema, updateDestinationSchema } from "../validators/destination.validation";


const router = Router();


const destinationRepo = new DestinationRepository();
const accountMemberRepo=new AccountMemberRepository()
const destinationService = new DestinationService(
  destinationRepo,
  accountMemberRepo
);
const destinationController = new DestinationController(destinationService);

router.post(
  "/:accountId",
  authMiddleware,
  validate(createDestinationSchema),
 destinationController.createDestination
);
router.get(
  "/:accountId",
  authMiddleware,
  destinationController.getAllDestinationsByAccount
);

router.patch(
  "/:destinationId/account/:accountId",
  authMiddleware,
  validate(updateDestinationSchema),
  destinationController.updateDestination
);

router.delete(
  "/:destinationId/account/:accountId",authMiddleware,
  destinationController.deleteDestination
);

export default router;
