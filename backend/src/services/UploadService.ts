import { Service } from "typedi";
import { BadRequestError } from "routing-controllers";
import cloudinary from "../config/cloundinary";
import { Request } from "express";

@Service()
export class UploadService {
  async uploadSingle(req: Request) {
    try {
      const files = req.files as Express.Multer.File[];
      if (!files || files.length === 0) {
        throw new BadRequestError("No image uploaded");
      }

      const file = files[0];
      const result = await this.uploadToCloudinary(file);

      return {
        name: result.public_id,
        url: result.secure_url,
      };
    } catch (error: any) {
      throw new BadRequestError(error.message);
    }
  }

  async uploadMultiple(req: Request) {
    try {
      const files = req.files as Express.Multer.File[];

      if (!files || files.length === 0) {
        throw new BadRequestError("No images uploaded");
      }

      const uploads = await Promise.all(
        files.map((file) => this.uploadToCloudinary(file))
      );

      return uploads.map((img) => ({
        name: img.public_id,
        url: img.secure_url,
      }));
    } catch (error: any) {
      throw new BadRequestError(error.message);
    }
  }

  private uploadToCloudinary(file: Express.Multer.File) {
    return new Promise<any>((resolve, reject) => {
      cloudinary.uploader
        .upload_stream(
          {
            folder: "TaskUp",
            resource_type: "image",
          },
          (error, result) => {
            if (error) return reject(error);
            resolve(result);
          }
        )
        .end(file.buffer);
    });
  }
}
