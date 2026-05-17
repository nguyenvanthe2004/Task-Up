import { Eye, EyeOff, Laptop, Smartphone } from "lucide-react";
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  UpdatePasswordFormData,
  updatePasswordSchema,
} from "../../../validations/auth";
import { callUpdatePassword } from "../../../services/auth";
import { toastError, toastSuccess } from "../../../lib/toast";

const SESSIONS = [
  {
    icon: <Laptop size={18} />,
    name: "MacBook Pro · Chrome",
    loc: "Hanoi, Vietnam",
    time: "Active now",
    current: true,
  },
  {
    icon: <Smartphone size={18} />,
    name: "iPhone 15 · Safari",
    loc: "Hanoi, Vietnam",
    time: "2 hours ago",
    current: false,
  },
];

const SecurityTab: React.FC = () => {
  const [tfaEnabled, setTfaEnabled] = useState(false);
  const [showOldPassword, setShowOldPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<UpdatePasswordFormData>({
    resolver: zodResolver(updatePasswordSchema),
    mode: "onChange",
    defaultValues: { oldPassword: "", newPassword: "", confirmPassword: "" },
  });

  const handleUpdatePassword = async (data: UpdatePasswordFormData) => {
    try {
      await callUpdatePassword(data.oldPassword, data.newPassword);
      toastSuccess("Password updated successfully");
      reset();
      setShowOldPassword(false);
      setShowNewPassword(false);
      setShowConfirmPassword(false);
    } catch {
      toastError("Failed to update password");
    }
  };

  return (
    <>
      {/* Security & authentication card */}
      <div className="bg-white border border-gray-100 rounded-2xl p-4 sm:p-6">
        <div className="mb-5">
          <h2 className="text-sm font-semibold text-gray-800">Security & authentication</h2>
          <p className="text-xs text-gray-400 mt-0.5">Keep your account safe</p>
        </div>

        <div className="divide-y divide-gray-50 mb-6">
          {/* 2FA toggle */}
          <div className="flex items-center justify-between py-3 first:pt-0 gap-3">
            <div className="min-w-0">
              <p className="text-sm font-medium text-gray-800">Two-factor authentication</p>
              <p className="text-xs text-gray-400 mt-0.5">
                Require a code in addition to your password
              </p>
            </div>
            <div className="flex items-center gap-2 shrink-0">
              <span className="text-xs text-gray-400">{tfaEnabled ? "On" : "Off"}</span>
              <button
                onClick={() => setTfaEnabled(!tfaEnabled)}
                className={`w-10 rounded-full relative transition-colors ${
                  tfaEnabled ? "bg-green-500" : "bg-gray-200"
                }`}
                style={{ height: "22px" }}
              >
                <span
                  className={`absolute top-0.5 w-4 h-4 rounded-full bg-white shadow-sm transition-all ${
                    tfaEnabled ? "left-5" : "left-0.5"
                  }`}
                />
              </button>
            </div>
          </div>

          {/* Active sessions row */}
          <div className="flex items-center justify-between py-3 last:pb-0 gap-3">
            <div className="min-w-0">
              <p className="text-sm font-medium text-gray-800">Active sessions</p>
              <p className="text-xs text-gray-400 mt-0.5">Signed in on 3 devices</p>
            </div>
            <button className="text-xs font-medium text-gray-500 border border-gray-200 rounded-lg px-3 py-1.5 hover:bg-gray-50 transition-colors shrink-0">
              Manage
            </button>
          </div>
        </div>

        {/* Change password */}
        <div>
          <div className="mb-4">
            <p className="text-sm font-semibold text-gray-800">Change password</p>
            <p className="text-[11px] text-gray-400">Use a strong, unique password</p>
          </div>

          <div className="flex flex-col gap-3">
            {/* Old password */}
            <div>
              <label className="block text-[10px] font-semibold uppercase tracking-wider text-gray-400 mb-1.5">
                Current password
              </label>
              <div className="relative">
                <input
                  {...register("oldPassword")}
                  type={showOldPassword ? "text" : "password"}
                  placeholder="Enter current password"
                  className={`w-full text-sm px-3 py-2 pr-9 rounded-lg bg-white border focus:outline-none focus:ring-1 focus:ring-blue-400 transition-all ${
                    errors.oldPassword ? "border-red-300 focus:ring-red-400" : "border-gray-200"
                  }`}
                />
                <button
                  type="button"
                  onClick={() => setShowOldPassword(!showOldPassword)}
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                >
                  {showOldPassword ? <EyeOff size={15} /> : <Eye size={15} />}
                </button>
              </div>
              {errors.oldPassword && (
                <p className="text-red-500 text-xs mt-1">{errors.oldPassword.message}</p>
              )}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {/* New password */}
              <div>
                <label className="block text-[10px] font-semibold uppercase tracking-wider text-gray-400 mb-1.5">
                  New password
                </label>
                <div className="relative">
                  <input
                    {...register("newPassword")}
                    type={showNewPassword ? "text" : "password"}
                    placeholder="Enter new password"
                    className={`w-full text-sm px-3 py-2 pr-9 rounded-lg bg-white border focus:outline-none focus:ring-1 focus:ring-blue-400 transition-all ${
                      errors.newPassword ? "border-red-300 focus:ring-red-400" : "border-gray-200"
                    }`}
                  />
                  <button
                    type="button"
                    onClick={() => setShowNewPassword(!showNewPassword)}
                    className="absolute right-2.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                  >
                    {showNewPassword ? <EyeOff size={15} /> : <Eye size={15} />}
                  </button>
                </div>
                {errors.newPassword && (
                  <p className="text-red-500 text-xs mt-1">{errors.newPassword.message}</p>
                )}
              </div>

              {/* Confirm password */}
              <div>
                <label className="block text-[10px] font-semibold uppercase tracking-wider text-gray-400 mb-1.5">
                  Confirm password
                </label>
                <div className="relative">
                  <input
                    {...register("confirmPassword")}
                    type={showConfirmPassword ? "text" : "password"}
                    placeholder="Confirm new password"
                    className={`w-full text-sm px-3 py-2 pr-9 rounded-lg bg-white border focus:outline-none focus:ring-1 focus:ring-blue-400 transition-all ${
                      errors.confirmPassword ? "border-red-300 focus:ring-red-400" : "border-gray-200"
                    }`}
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-2.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                  >
                    {showConfirmPassword ? <EyeOff size={15} /> : <Eye size={15} />}
                  </button>
                </div>
                {errors.confirmPassword && (
                  <p className="text-red-500 text-xs mt-1">{errors.confirmPassword.message}</p>
                )}
              </div>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3 pt-4 mt-2">
            <p className="text-[11px] text-gray-400">
              Min. 8 characters, include numbers & symbols
            </p>
            <button
              onClick={handleSubmit(handleUpdatePassword)}
              disabled={isSubmitting}
              className={`text-sm font-medium text-white bg-gray-900 rounded-lg px-4 py-1.5 hover:bg-gray-700 transition-colors self-end sm:self-auto ${
                isSubmitting ? "opacity-60 cursor-not-allowed" : ""
              }`}
            >
              {isSubmitting ? "Updating..." : "Update password"}
            </button>
          </div>
        </div>

        {/* Sessions list */}
        <div className="flex flex-col gap-2 mt-4">
          {SESSIONS.map((s) => (
            <div
              key={s.name}
              className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl border border-gray-100"
            >
              <div className="w-9 h-9 bg-white rounded-lg flex items-center justify-center text-lg border border-gray-100 shrink-0">
                {s.icon}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-xs font-medium text-gray-800 truncate">{s.name}</p>
                <p className="text-[11px] text-gray-400 truncate">
                  {s.loc} · {s.time}
                </p>
              </div>
              {s.current ? (
                <span className="text-[11px] font-medium text-green-700 bg-green-50 px-2 py-0.5 rounded-full flex items-center gap-1 shrink-0">
                  <span className="w-1.5 h-1.5 bg-green-500 rounded-full" /> Current
                </span>
              ) : (
                <button className="text-[11px] text-gray-400 border border-gray-200 rounded-md px-2.5 py-1 hover:bg-gray-100 transition-colors shrink-0">
                  Revoke
                </button>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Danger zone card */}
      <div className="bg-white border border-red-100 rounded-2xl p-4 sm:p-6">
        <div className="mb-5">
          <h2 className="text-sm font-semibold text-red-500">Danger zone</h2>
          <p className="text-xs text-gray-400 mt-0.5">
            Irreversible actions — proceed with caution
          </p>
        </div>

        <div className="divide-y divide-gray-50">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between py-3 first:pt-0 gap-3">
            <div>
              <p className="text-sm font-medium text-gray-800">Archive account</p>
              <p className="text-xs text-gray-400 mt-0.5">
                Temporarily disable your workspace and all data
              </p>
            </div>
            <button className="text-xs font-medium text-gray-500 border border-gray-200 rounded-lg px-3 py-1.5 hover:bg-gray-50 transition-colors self-start sm:self-auto shrink-0">
              Archive
            </button>
          </div>
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between py-3 last:pb-0 gap-3">
            <div>
              <p className="text-sm font-medium text-red-500">Delete account permanently</p>
              <p className="text-xs text-gray-400 mt-0.5">
                Remove all data. This action cannot be undone.
              </p>
            </div>
            <button className="text-xs font-medium text-red-600 bg-red-50 border border-red-100 rounded-lg px-3 py-1.5 hover:bg-red-100 transition-colors self-start sm:self-auto shrink-0">
              Delete account
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default SecurityTab;