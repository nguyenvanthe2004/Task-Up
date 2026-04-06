import {
  ExpressErrorMiddlewareInterface,
  Middleware,
  BadRequestError,
} from "routing-controllers";
import { ValidationError } from "class-validator";
import { Request, Response, NextFunction } from "express";
import { Service } from "typedi";

interface ErrorWithErrors extends Error {
  errors?: ValidationError[];
}

@Service()
@Middleware({ type: "after" })
export class ErrorHandler implements ExpressErrorMiddlewareInterface {
  error(
    error: unknown,
    request: Request,
    response: Response,
    next: NextFunction
  ): void {
    if (error instanceof BadRequestError) {
      const errorWithErrors = error as ErrorWithErrors;

      if (Array.isArray(errorWithErrors.errors)) {
        const validationErrors = errorWithErrors.errors;
        const messages: string[] = [];

        for (const err of validationErrors) {
          if (err.constraints) {
            messages.push(...Object.values(err.constraints));
          }

          if (err.children && err.children.length > 0) {
            for (const child of err.children) {
              if (child.constraints) {
                messages.push(...Object.values(child.constraints));
              }
            }
          }
        }

        response.status(400).json({
          message: "Validation failed",
          errors: messages,
        });
        return;
      }
    }

    if (error instanceof Error) {
      response.status(500).json({
        message: error.message,
      });
      return;
    }

    response.status(500).json({
      message: "Unknown error",
    });
  }
}
