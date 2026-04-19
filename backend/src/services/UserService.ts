import { BadRequestError } from "routing-controllers";
import { Service } from "typedi";
import { UserRepository } from "../repositories/UserRepository";
import {
  CreateUserDto,
  LoginUserDto,
  UpdatePasswordDto,
  UpdateProfileDto,
} from "../dtos/UserDto";
import bcrypt from "bcrypt";
import User, { UserRole } from "../models/User";
import jwt from "jsonwebtoken";
import { JwtPayload, UserProps } from "../types/auth";
import { MailService } from "./MailService";
import { generateVerifyCode, refreshToken } from "../utils/helper";
import sequelize from "../config/db";
import { Response } from "express";
import { OAuth2Client } from "google-auth-library";
import axios from "axios";

@Service()
export class UserService {
  constructor(
    private readonly userRepo: UserRepository,
    private readonly mailService: MailService,
    private googleClient = new OAuth2Client(process.env.GOOGLE_CLIENT_ID),
  ) {}

  async findAll(page = 1, limit = 10) {
    try {
      const skip = (page - 1) * limit;

      const [users, total] = await Promise.all([
        this.userRepo.findAll(skip, limit),
        this.userRepo.countAll(),
      ]);

      return {
        totalPages: Math.ceil(total / limit),
        data: users,
      };
    } catch {
      throw new BadRequestError("Failed to fetch users");
    }
  }

  async findOne(id: number) {
    const user = await this.userRepo.findOne(id);
    if (!user) throw new BadRequestError("User not found");
    return user;
  }

  async login(dto: LoginUserDto, res: Response) {
    const user = await this.userRepo.findByEmail(dto.email);
    if (!user) throw new BadRequestError("User not found");

    const plainUser = user.get({ plain: true });

    const isMatch = await bcrypt.compare(dto.password, user.password);
    if (!isMatch) {
      throw new BadRequestError("Invalid email or password");
    }

    const token = jwt.sign(
      {
        id: user.id,
        fullName: user.fullName,
        email: user.email,
        phone: user.phone,
        role: user.role,
        avatar: user.avatar,
      },
      process.env.JWT_SECRET!,
      { expiresIn: "7d" },
    );

    res.cookie("token", token, {
      httpOnly: true,
      sameSite: "lax",
    });

    const { password, verifyCode, ...rest } = plainUser;

    return {
      user: rest,
      token,
      message: "Login successfully!",
    };
  }
  async loginGoogle(credential: string, res: Response) {
    try {
      if (!credential) {
        throw new BadRequestError("Missing credential");
      }

      const ticket = await this.googleClient.verifyIdToken({
        idToken: credential,
        audience: process.env.GOOGLE_CLIENT_ID,
      });

      const payload = ticket.getPayload();

      if (!payload) {
        throw new BadRequestError("Invalid Google token");
      }

      const email = payload.email!;
      const name = payload.name || "Google User";
      const avatar = payload.picture || "";

      let user = await this.userRepo.findByEmail(email);

      if (!user) {
        user = await this.userRepo.create({
          fullName: name,
          email: email,
          phone: "",
          password: "",
          role: UserRole.USER,
          avatar: avatar,
          verifyCode: "",
          isActive: true,
        });
      }

      const plainUser = user.get({ plain: true });

      const userId = user.id;

      const token = jwt.sign(
        {
          id: userId,
          fullName: user.fullName,
          phone: user.phone,
          email: user.email,
          role: user.role,
          avatar: user.avatar,
        },
        process.env.JWT_SECRET!,
        {
          expiresIn: "7d",
        },
      );

      res.cookie("token", token, {
        httpOnly: true,
        secure: true,
        sameSite: "none",
        maxAge: 7 * 24 * 60 * 60 * 1000,
      });

      const { password, verifyCode, ...rest } = plainUser;
      return {
        user: rest,
        token,
        message: "Login successfully!",
      };
    } catch (error: any) {
      throw new BadRequestError(error.message);
    }
  }
  async loginGithub(code: string, res: Response) {
    try {
      const { data } = await axios.post(
        "https://github.com/login/oauth/access_token",
        {
          client_id: process.env.GITHUB_CLIENT_ID,
          client_secret: process.env.GITHUB_CLIENT_SECRET,
          code,
        },
        { headers: { Accept: "application/json" } },
      );

      const accessToken = data.access_token;
      if (!accessToken) throw new BadRequestError("GitHub token failed");

      const [userRes, emailRes] = await Promise.all([
        axios.get("https://api.github.com/user", {
          headers: { Authorization: `Bearer ${accessToken}` },
        }),
        axios.get("https://api.github.com/user/emails", {
          headers: { Authorization: `Bearer ${accessToken}` },
        }),
      ]);

      const email =
        emailRes.data.find((e: any) => e.primary)?.email ||
        emailRes.data[0]?.email;

      if (!email) throw new BadRequestError("Cannot get email from GitHub");

      const { name, avatar_url } = userRes.data;

      let user = await this.userRepo.findByEmail(email);

      if (!user) {
        user = await this.userRepo.create({
          fullName: name || "GitHub User",
          email,
          phone: "",
          password: "",
          role: UserRole.USER,
          avatar: avatar_url,
          verifyCode: "",
          isActive: true,
        });
      }
      const plainUser = user.get({ plain: true });

      const userId = user.id;

      const token = jwt.sign(
        {
          id: userId,
          fullName: user.fullName,
          phone: user.phone,
          email: user.email,
          role: user.role,
          avatar: user.avatar,
        },
        process.env.JWT_SECRET!,
        {
          expiresIn: "7d",
        },
      );

      res.cookie("token", token, {
        httpOnly: true,
        secure: true,
        sameSite: "none",
        maxAge: 7 * 24 * 60 * 60 * 1000,
      });

      const { password, verifyCode, ...rest } = plainUser;

      return {
        user: rest,
        token,
        message: "Login successfully!",
      };
    } catch (error: any) {
      throw new BadRequestError(error.message);
    }
  }

  async verifyEmail(email: string, code: string) {
    const user = await this.userRepo.findByEmail(email);

    if (!user || user.isActive || user.verifyCode !== code) {
      throw new BadRequestError("Invalid verification code");
    }

    await this.userRepo.update(user.id, {
      isActive: true,
      verifyCode: undefined,
    });

    return { message: "Email verified successfully" };
  }

  async register(dto: CreateUserDto) {
    const t = await sequelize.transaction();

    try {
      const existed = await this.userRepo.findByEmail(dto.email);
      if (existed) {
        throw new BadRequestError("Email already exists");
      }

      const hashedPassword = await bcrypt.hash(dto.password, 10);
      const verifyCode = await generateVerifyCode(6, this.userRepo);

      await this.userRepo.create({
        fullName: dto.fullName,
        email: dto.email,
        password: hashedPassword,
        phone: "",
        avatar: "",
        role: UserRole.USER,
        verifyCode,
        isActive: false,
      });

      await t.commit();

      await this.mailService.sendVerifyCode(dto.email, verifyCode);

      return {
        message: "Verification code sent to email",
      };
    } catch (error) {
      await t.rollback();
      throw new BadRequestError("Failed to register user");
    }
  }
  async currentUser(user: JwtPayload) {
    if (!user) {
      throw new BadRequestError("User not authenticated");
    }
    const findUser = await this.userRepo.findByEmail(user.email);
    if (!findUser) {
      throw new BadRequestError("User not found");
    }

    const plainUser = findUser.get({ plain: true });
    const { password, verifyCode, ...rest } = plainUser;

    return rest;
  }

  async updateProfile(data: UpdateProfileDto, user: UserProps, res: Response) {
    console.log(user.id);
    const updated = await this.userRepo.update(user.id, {
      fullName: data.fullName,
      phone: data.phone,
    });

    refreshToken(res, updated!);

    return { success: true };
  }

  async updateAvatar(user: UserProps, avatar: string, res: Response) {
    try {
      const existedUser = await this.userRepo.findOne(user.id);
      if (!existedUser) {
        throw new BadRequestError("User not found");
      }
      const updateAvatar = await this.userRepo.update(user.id, { avatar });
      refreshToken(res, updateAvatar!);
      return { success: true };
    } catch (error: any) {
      throw new BadRequestError(error.message);
    }
  }

  async updatePassword(user: UserProps, data: UpdatePasswordDto) {
    const existedUser = await this.userRepo.findOne(user.id);
    if (!existedUser) throw new BadRequestError("User not found");

    const isMatch = await bcrypt.compare(
      data.oldPassword,
      existedUser.password,
    );

    if (!isMatch) {
      throw new BadRequestError("Old password is incorrect");
    }

    const hashedPassword = await bcrypt.hash(data.newPassword, 10);

    await this.userRepo.update(user.id, {
      password: hashedPassword,
    });

    return { success: true };
  }

  async logout(res: Response) {
    res.clearCookie("token");
    return { message: "Logout successfully" };
  }
}
