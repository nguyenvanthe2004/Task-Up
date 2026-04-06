import { Request, Response, NextFunction } from "express";
import { Types } from "mongoose";

type PlainObject = Record<string, unknown>;

function isPlainObject(value: unknown): value is PlainObject {
  return (
    typeof value === "object" &&
    value !== null &&
    !Array.isArray(value) &&
    !(value instanceof Date) &&
    !Buffer.isBuffer(value) &&
    !(value instanceof Types.ObjectId)
  );
}

function convertBufferToObjectId(obj: unknown): unknown {
  if (obj === null || obj === undefined) {
    return obj;
  }

  if (Array.isArray(obj)) {
    return obj.map((item) => convertBufferToObjectId(item));
  }

  if (obj instanceof Date) {
    return obj;
  }

  if (Buffer.isBuffer(obj)) {
    return new Types.ObjectId(obj).toString();
  }

  if (obj instanceof Types.ObjectId) {
    return obj.toString();
  }

  if (isPlainObject(obj)) {
    if ("buffer" in obj && Buffer.isBuffer(obj.buffer)) {
      return new Types.ObjectId(obj.buffer as Buffer).toString();
    }

    const converted: PlainObject = {};
    for (const key in obj) {
      if (Object.prototype.hasOwnProperty.call(obj, key)) {
        converted[key] = convertBufferToObjectId(obj[key]);
      }
    }
    return converted;
  }

  return obj;
}

export function mongooseSerializer(
  req: Request,
  res: Response,
  next: NextFunction
): void {
  const originalJson = res.json.bind(res);

  res.json = function (data: unknown): Response {
    const converted = convertBufferToObjectId(data);

    return originalJson(converted);
  };

  next();
}
