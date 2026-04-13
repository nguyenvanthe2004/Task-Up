import { JsonController, Post, Req, UseBefore } from "routing-controllers";
import { Service } from "typedi";
import { UploadService } from "../services/UploadService";
import { Request } from "express";
import { UploadMiddleware } from "../middlewares/uploadMiddleware";

@Service()
@JsonController("/files")
@UseBefore(UploadMiddleware)
export class FileController {
  constructor(private readonly uploadService: UploadService) {}

  @Post("/upload-single")
  async uploadSingle(@Req() req: Request) {
    return this.uploadService.uploadSingle(req);
  }

  @Post("/upload-multiple")
  async uploadMultiple(@Req() req: Request) {
    return this.uploadService.uploadMultiple(req);
  }
}
