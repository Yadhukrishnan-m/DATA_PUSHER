import { Router } from "express";
import { DataHandlerService } from "../services/data.service";
import { DataController } from "../controllers/datahandler.controller"; 
import { AccountRepository } from "../repositories/account.repository";
import { DestinationRepository } from "../repositories/destination.repository";
import { rateLimiterMiddleware } from "../middlewares/ratelimiting.middleware";

const router = Router();
const accountRepo = new AccountRepository();
const destinationRepo = new DestinationRepository();

const dataService = new DataHandlerService(accountRepo, destinationRepo);
const dataController = new DataController(dataService);

router.post("/incoming_data",rateLimiterMiddleware, dataController.handleIncomingData);

export default router;
