import {
  Action,
  ExpressMiddlewareInterface,
  Middleware,
  UnauthorizedError,
  getMetadataArgsStorage,
} from "routing-controllers";
import { Service } from "typedi";
import { Request, Response, NextFunction } from "express";
import jwt, { JwtPayload } from "jsonwebtoken";
import { IS_PUBLIC_KEY } from "../decorators/public";
import { UserRole } from "../models/User";

@Service()
@Middleware({ type: "before" })
export class AuthMiddleware implements ExpressMiddlewareInterface {
  use(req: Request, res: Response, next: NextFunction): void {
    try {
      const metadata = getMetadataArgsStorage();
      const route = req.path;
      const method = req.method.toLowerCase();

      let isPublic = false;

      for (const controller of metadata.controllers) {
        const baseRoute = controller.route || "";

        for (const action of metadata.actions.filter(
          (a) => a.target === controller.target,
        )) {
          const fullRoute = `${baseRoute}${action.route}`;
          const normalizedReqPath = route.replace(/\/+$/, "");
          const normalizedFullRoute = fullRoute.replace(/\/+$/, "");

          if (
            normalizedReqPath === normalizedFullRoute &&
            method === action.type.toLowerCase()
          ) {
            isPublic =
              Reflect.getMetadata(
                IS_PUBLIC_KEY,
                action.target.prototype,
                action.method,
              ) ||
              Reflect.getMetadata(IS_PUBLIC_KEY, action.target) ||
              Reflect.getMetadata(IS_PUBLIC_KEY, controller.target) ||
              false;

            break;
          }
        }

        if (isPublic) break;
      }

      if (isPublic) return next();

      const token = req.cookies.token;
      if (!token) throw new UnauthorizedError("Token missing");

      const decoded = jwt.verify(token, process.env.JWT_SECRET) as JwtPayload;

      // @ts-ignore
      req.user = {
        userId: decoded.userId,
        fullName: decoded.fullName,
        email: decoded.email,
        phone: decoded.phone,
        role: decoded.role,
        avatar: decoded.avatar,
      };
      next();
    } catch (error) {
      console.error("AuthMiddleware error:", error);
      throw new UnauthorizedError("Invalid or expired token");
    }
  }
}

export async function authorizationChecker(
  action: Action,
  roles: UserRole[],
): Promise<boolean> {
  const user = action.request.user;

  if (!user || !user.role) {
    return false;
  }

  return roles.includes(user.role);
}
