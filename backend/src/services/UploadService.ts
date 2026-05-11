import { Service } from "typedi";
import { BadRequestError } from "routing-controllers";
import cloudinary from "../config/cloundinary";
import supabase from "../config/supabase";
import { Request } from "express";

const BUCKET = "taskup-files";

const ALLOWED_MIME_TYPES = [
  "application/pdf",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  "application/msword",
];

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
        files.map((file) => this.uploadToCloudinary(file)),
      );

      return uploads.map((img) => ({
        name: img.public_id,
        url: img.secure_url,
      }));
    } catch (error: any) {
      throw new BadRequestError(error.message);
    }
  }

  async uploadFile(
    file: Express.Multer.File,
  ): Promise<{ name: string; url: string }> {
    if (!ALLOWED_MIME_TYPES.includes(file.mimetype)) {
      throw new BadRequestError(`File type "${file.mimetype}" is not allowed`);
    }

    if (!file.buffer) {
      throw new BadRequestError("File buffer missing");
    }

    const ext = file.originalname.split(".").pop();
    const baseName = file.originalname
      .replace(/\.[^.]+$/, "")
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-|-$/g, "");
    const fileName = `${baseName}-${Math.random().toString(36).slice(2, 7)}.${ext}`;

    const { data, error } = await supabase.storage
      .from(BUCKET)
      .upload(fileName, file.buffer, {
        contentType: file.mimetype,
        upsert: false,
      });

    if (error) {
      console.error(error);
      throw new BadRequestError(error.message);
    }

    const { data: publicUrlData } = supabase.storage
      .from(BUCKET)
      .getPublicUrl(data.path);

    return {
      name: file.originalname,
      url: publicUrlData.publicUrl,
    };
  }

  async deleteFile(url: string): Promise<void> {
    const path = url.split(`/${BUCKET}/`)[1];
    if (!path) return;
    await supabase.storage.from(BUCKET).remove([path]);
  }

  private uploadToCloudinary(file: Express.Multer.File) {
    const isImage = file.mimetype.startsWith("image/");
    return new Promise<any>((resolve, reject) => {
      cloudinary.uploader
        .upload_stream(
          {
            folder: "TaskUp",
            resource_type: isImage ? "image" : "raw",
          },
          (error, result) => {
            if (error) return reject(error);
            resolve(result);
          },
        )
        .end(file.buffer);
    });
  }
}
