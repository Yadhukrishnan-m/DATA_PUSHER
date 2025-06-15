import express from "express";
import { Request, Response } from "express";
import { sequelize } from "./config/db.config";
import { syncDatabase } from "./models/model.index";
import { seedRoles } from "./seeders/role.seeder";
import authRouter from './routes/auth.route'
import accountRoute from "./routes/account.route"
import  accountMemberRoute from "./routes/accountMember.route"
import destinationRoute from "./routes/destination.route";
import dataRoute from './routes/dataHandler.route'
import logRoute from './routes/log.route'
import dotenv from "dotenv";
import morgan from "morgan";
import { ErrorHandler } from "./middlewares/ErrorHandler";
import cookieParser from "cookie-parser";


const app = express();
const PORT = process.env.PORT || 3000;

dotenv.config();
app.use(cookieParser());
app.use(express.json());
app.use(morgan("dev"));

app.use("/api/auth", authRouter);
app.use("/api/account", accountRoute);
app.use("/api/account-members", accountMemberRoute);
app.use("/api/destination", destinationRoute);
app.use("/server", dataRoute);
app.use("/api/logs", logRoute);



// error handler
app.use(ErrorHandler.handleError);

async function startServer() {
  try {
    await sequelize.authenticate();
    console.log("Database connected");
    await syncDatabase();
    await seedRoles();

    app.listen(PORT, () => {
      console.log(`Server is running on http://localhost:${PORT}`);
    });
  } catch (error) {
    console.error("Unable to start server:", error);
    process.exit(1);
  }
}

startServer();
