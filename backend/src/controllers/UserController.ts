import {
  JsonController,
  Get,
  Post,
  Body,
  Param,
  Res,
  Authorized,
  Req,
  Put,
  CurrentUser,
  QueryParam,
} from "routing-controllers";
import { Service } from "typedi";
import { UserService } from "../services/UserService";
import {
  CreateUserDto,
  LoginUserDto,
  UpdatePasswordDto,
  UpdateProfileDto,
  VerifyUserDto,
} from "../dtos/UserDto";
import { Request, Response } from "express";
import { UserRole } from "../models/User";
import { Public } from "../decorators/public";
import { UploadService } from "../services/UploadService";
import { JwtPayload, UserProps } from "../types/auth";

@Service()
@JsonController("/users")
export class UserController {
  constructor(
    private userService: UserService,
    private readonly uploadService: UploadService,
  ) {}

  @Authorized([UserRole.ADMIN])
  @Get("/")
  findAll(
    @QueryParam("page") page: number,
    @QueryParam("limit") limit: number,
  ) {
    return this.userService.findAll(page, limit);
  }

  @Get("/current")
  async getCurrent(@Req() req: Request, @CurrentUser() user: JwtPayload) {
    return user;
  }

  @Authorized([UserRole.ADMIN])
  @Get("/:id")
  async findOne(@Param("id") id: number) {
    return this.userService.findOne(id);
  }

  @Public()
  @Post("/login")
  async login(
    @Body({ validate: true }) data: LoginUserDto,
    @Res() res: Response,
  ) {
    return this.userService.login(data, res);
  }

  @Public()
  @Post("/google")
  async loginGoogle(
    @Body() body: { credential: string },
    @Res() res: Response,
  ) {
    return this.userService.loginGoogle(body.credential, res);
  }

  @Public()
  @Post("/github")
  async loginGithub(@Body() body: { code: string }, @Res() res: Response) {
    return this.userService.loginGithub(body.code, res);
  }

  @Public()
  @Post("/register")
  async register(@Body({ validate: true }) data: CreateUserDto) {
    return this.userService.register(data);
  }
  @Public()
  @Post("/verify-email")
  async verifyEmail(@Body({ validate: true }) data: VerifyUserDto) {
    return this.userService.verifyEmail(data.email, data.code);
  }

  @Put("/profile")
  async updateProfile(
    @CurrentUser() user: UserProps,
    @Body() dto: UpdateProfileDto,
    @Res() res: Response,
  ) {
    return this.userService.updateProfile(dto, user, res);
  }

  @Put("/avatar")
  async updateAvatar(
    @CurrentUser() user: UserProps,
    @Body() body: { avatar: string },
    @Res() res: Response,
  ) {
    return await this.userService.updateAvatar(user, body.avatar, res);
  }

  @Put("/password")
  async updatePassword(
    @CurrentUser() user: UserProps,
    @Body({ validate: true }) dto: UpdatePasswordDto,
  ) {
    return await this.userService.updatePassword(user, dto);
  }
  @Post("/logout")
  async logout(@Res() res: Response) {
    return await this.userService.logout(res);
  }
}
