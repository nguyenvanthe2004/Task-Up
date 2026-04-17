import "reflect-metadata";
import "dotenv/config";
import express from "express";
import { Action, useContainer, useExpressServer } from "routing-controllers";
import cookieParser from "cookie-parser";
import dotenv from "dotenv";
import { UserController } from "./controllers/UserController";
import { mongooseSerializer } from "./interceptors/serialize.interceptor";
import { ErrorHandler } from "./middlewares/errorHandler";
import {
  AuthMiddleware,
  authorizationChecker,
} from "./middlewares/authMiddlewares";

import sequelize from "./config/db";
import Container from "typedi";
import { FileController } from "./controllers/FileController";
import { WorkspaceController } from "./controllers/WorkspaceController";

import initModels from "./models";

dotenv.config();

useContainer(Container);

export const startServer = async () => {
  try {
    const app = express();

    app.use(cookieParser());

    initModels();

    await sequelize.authenticate();
    console.log("MySQL connected");

    await sequelize.sync();

    app.use(mongooseSerializer);

    useExpressServer(app, {
      controllers: [UserController, FileController, WorkspaceController],

      middlewares: [ErrorHandler, AuthMiddleware],

      authorizationChecker: authorizationChecker,
      currentUserChecker: async (action: Action) => {
        const req = action.request;
        return (req as any).user;
      },
      cors: {
        origin: process.env.FRONTEND_URL,
        credentials: true,
        methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
        allowedHeaders: ["Content-Type", "Authorization"],
      },
      validation: {
        whitelist: true,
        forbidNonWhitelisted: true,
      },
      routePrefix: "/api",
      defaultErrorHandler: false,
    });

    const port = process.env.PORT || 4000;

    app.listen(port, () => {
      console.log(`🚀 Server running at http://localhost:${port}`);
    });
  } catch (error) {
    console.error("❌ Error starting server:", error);
  }
};
