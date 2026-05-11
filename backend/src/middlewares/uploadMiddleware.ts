import {
  ExpressMiddlewareInterface,
  Middleware,
  BadRequestError,
} from "routing-controllers";
import { Service } from "typedi";
import multer from "multer";
import { Request, Response, NextFunction } from "express";

const multerUpload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 10 * 1024 * 1024,
  },
});

@Service()
@Middleware({ type: "before" })
export class UploadMiddleware implements ExpressMiddlewareInterface {
  use(req: Request, res: Response, next: NextFunction): void {
    multerUpload.any()(req, res, (err: any) => {
      if (err) {
        throw new BadRequestError(err.message);
      }
      next();
    });
  }
}
