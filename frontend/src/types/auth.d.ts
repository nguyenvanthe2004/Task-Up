export interface RegisterData {
  fullName: string;
  email: string;
  password: string;
}
export interface LoginData {
  email: string;
  password: string;
}
export interface User {
  userId: string;
  fullName: string;
  email: string;
  phone: string;
  role: string;
  avatar: string;
}

export interface CurrentUserState {
  currentUser: User;
}
