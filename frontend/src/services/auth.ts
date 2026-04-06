import type { LoginData, RegisterData } from "../types/auth";
import instance from "./req";

export const callRegister = async (data: RegisterData) => {
  return await instance.post("/users/register", data);
};
export const callLogin = async (data: LoginData) => {
  return await instance.post("/users/login", data);
};
export const callLoginGoogle = async (credential: string) => {
  return await instance.post("/users/google", { credential });
};
export const callLoginGithub = async (code: string) => {
  return await instance.post("/users/github", { code });
};
export const callVerifyEmail = async (email: string, code: string) => {
  return await instance.post("/users/verify-email", { email, code });
};
export const callSendCode = async (email: string) => {
  return await instance.post("/users/forgot-code", { email });
};
export const callSendNewPassword = async (email: string, code: string) => {
  return await instance.post("/users/forgot-password", { email, code });
};
export const callGetCurrentUser = async () => {
  return await instance.get("/users/current");
};
export const callUpdateProfile = async (fullName: string, phone: string) => {
  const res = await instance.put("/users/profile", { fullName, phone });
  return res;
};
export const callUpdateAvatar = async (avatar: string) => {
  return await instance.put("/users/avatar", { avatar });
};
export const callUpdatePassword = async (
  oldPassword: string,
  newPassword: string,
) => {
  return await instance.put("/users/password", { oldPassword, newPassword });
};
export const callLogout = async () => {
  return await instance.post("/users/logout");
};
