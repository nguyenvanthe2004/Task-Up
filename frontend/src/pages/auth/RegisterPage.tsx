import type React from "react";
import AuthLayout from "../../layouts/AuthLayout";
import Register from "../../components/auth/RegisterForm";

const RegisterPage: React.FC = () => {
  return (
    <AuthLayout>
      <Register />
    </AuthLayout>
  );
};
export default RegisterPage;
