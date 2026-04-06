export const BASE_URL = import.meta.env.VITE_BACKEND_URL;
export const CLOUDINARY_URL = import.meta.env.VITE_CLOUDINARY_URL;
export const YOUR_GOOGLE_CLIENT_ID = import.meta.env.VITE_YOUR_GOOGLE_CLIENT_ID;
export const YOUR_GITHUB_CLIENT_ID = import.meta.env.VITE_YOUR_GITHUB_CLIENT_ID;


export enum UserRole {
  USER = "user",
  ADMIN = "admin",
}