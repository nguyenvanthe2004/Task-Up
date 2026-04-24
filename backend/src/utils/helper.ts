import jwt from "jsonwebtoken";
import { UserRepository } from "../repositories/UserRepository";
import { Response } from "express";
import User from "../models/User";

export async function generateVerifyCode(length = 6, userRepo: UserRepository) {
  const chars = "0123456789";
  let code = "";

  for (let i = 0; i < length; i++) {
    code += chars[Math.floor(Math.random() * chars.length)];
  }

  const existingUser = await userRepo.findByCode(code);
  if (existingUser) {
    return generateVerifyCode(length, userRepo);
  }

  return code;
}

const INVITE_SECRET = process.env.INVITE_SECRET!;

export const generateInviteToken = (payload: {
  workspaceId: number;
  email: string;
  invitedBy: number;
}) => {
  return jwt.sign(payload, INVITE_SECRET, {
    expiresIn: "1d",
  });
};

export const verifyInviteToken = (token: string) => {
  try {
    return jwt.verify(token, INVITE_SECRET) as {
      workspaceId: number;
      email: string;
      invitedBy: number;
    };
  } catch {
    throw new Error("Invalid or expired invite token");
  }
};

export const toDate = (dateStr?: string) => {
  if (!dateStr) return undefined;
  return new Date(dateStr);
}

export const refreshToken = (res: Response, user: User) => {
  const token = jwt.sign(
    {
      id: user.id,
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
    secure: false,
    sameSite: "lax",
    maxAge: 7 * 24 * 60 * 60 * 1000,
  });
};
