import type React from "react";
import AuthLayout from "../../layouts/AuthLayout";
import LoginForm from "../../components/auth/LoginForm";

const LoginPage: React.FC = () => {
  return (
    <AuthLayout>
      <LoginForm />
    </AuthLayout>
  );
};
export default LoginPage;
