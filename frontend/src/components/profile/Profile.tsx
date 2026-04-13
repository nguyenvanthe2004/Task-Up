import {
  User,
  Bell,
  Shield,
  Palette,
  Plug,
  Home,
  Users,
  CreditCard,
  Pencil,
  Laptop,
  Smartphone,
  List,
  LayoutGrid,
  GanttChart,
  EyeOff,
  Eye,
  Menu,
  X,
} from "lucide-react";
import React, { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../redux/store";
import { useForm } from "react-hook-form";
import {
  UpdatePasswordFormData,
  updatePasswordSchema,
  UpdateProfileFormData,
  updateProfileSchema,
} from "../../validations/auth";
import { zodResolver } from "@hookform/resolvers/zod";
import { uploadFile } from "../../services/file";
import {
  callGetCurrentUser,
  callUpdateAvatar,
  callUpdatePassword,
  callUpdateProfile,
} from "../../services/auth";
import { setCurrentUser } from "../../redux/slices/currentUser";
import { toastError, toastSuccess } from "../../lib/toast";
import { CLOUDINARY_URL } from "../../constants";

const Profile: React.FC = () => {
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const [tfaEnabled, setTfaEnabled] = useState(false);
  const [activeNav, setActiveNav] = useState("profile");
  const [showOldPassword, setShowOldPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false); // [ADDED]

  const dispatch = useDispatch();
  const user = useSelector((state: RootState) => state.auth.currentUser);

  const [avatar, setAvatar] = useState(user?.avatar);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset: resetPassword,
  } = useForm<UpdatePasswordFormData>({
    resolver: zodResolver(updatePasswordSchema),
    mode: "onChange",
    defaultValues: {
      oldPassword: "",
      newPassword: "",
      confirmPassword: "",
    },
  });

  const {
    register: registerProfile,
    handleSubmit: handleProfileSubmit,
    formState: { errors: profileErrors, isSubmitting: isProfileSubmitting },
    reset,
  } = useForm<UpdateProfileFormData>({
    resolver: zodResolver(updateProfileSchema),
    mode: "onChange",
    defaultValues: {
      fullName: "",
      phone: "",
    },
  });

  useEffect(() => {
    if (user) {
      reset({
        fullName: user.fullName || "",
        phone: user.phone || "",
      });
      setAvatar(user.avatar);
    }
  }, [user, reset]);

  const handleAvatarClick = () => {
    fileInputRef.current?.click();
  };

  const handleAvatarChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || !e.target.files[0]) return;

    const file = e.target.files[0];

    try {
      const { data } = await uploadFile(file);
      setAvatar(data.name);
      await callUpdateAvatar(data.name);
      dispatch(setCurrentUser({ ...user, avatar: data.name }));
    } catch (error) {
      toastError("Failed to update avatar");
    }
  };

  const handleUpdateProfile = async (dto: UpdateProfileFormData) => {
    try {
      await callUpdateProfile(dto.fullName, dto.phone);
      const res = await callGetCurrentUser();
      dispatch(setCurrentUser(res.data));
      toastSuccess("Profile updated successfully");
    } catch (error) {
      toastError("Failed to update profile");
    }
  };

  const handleUpdatePassword = async (data: UpdatePasswordFormData) => {
    try {
      await callUpdatePassword(data.oldPassword, data.newPassword);
      toastSuccess("Password updated successfully");
      resetPassword();
      setShowOldPassword(false);
      setShowNewPassword(false);
      setShowConfirmPassword(false);
    } catch (error) {
      toastError("Failed to update password");
    }
  };

  const navItems = [
    { id: "profile", label: "Profile", icon: User },
    { id: "notifications", label: "Notifications", icon: Bell },
    { id: "security", label: "Security", icon: Shield },
    { id: "appearance", label: "Appearance", icon: Palette },
    { id: "integrations", label: "Integrations", icon: Plug },
  ];

  const workspaceItems = [
    { id: "overview", label: "Overview", icon: Home },
    { id: "members", label: "Members", icon: Users },
    { id: "billing", label: "Billing", icon: CreditCard },
  ];

  return (
    <div className="flex ml-0 lg:ml-60 mt-16 min-h-screen">
      {sidebarOpen && (
        <div
          className="lg:hidden fixed inset-0 z-40 bg-black/20"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      <aside className={`
        w-60 shrink-0 bg-white border-r border-gray-100 px-4 py-5 flex flex-col gap-1
        fixed top-14 bottom-0 left-0 z-50 transition-transform duration-200
        lg:static lg:translate-x-0 lg:z-auto lg:transition-none
        ${sidebarOpen ? "translate-x-0 shadow-xl" : "-translate-x-full lg:translate-x-0"}
      `}>
        <button
          className="lg:hidden self-end mb-1 p-1.5 rounded-lg text-gray-400 hover:bg-gray-50"
          onClick={() => setSidebarOpen(false)}
        >
          <X size={16} />
        </button>

        <p className="text-[12px] font-semibold text-gray-400 uppercase tracking-widest px-3 mb-3">
          Settings
        </p>
        {navItems.map((item) => {
          const Icon = item.icon;
          return (
            <button
              key={item.id}
              onClick={() => { setActiveNav(item.id); setSidebarOpen(false); }}
              className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm transition ${
                activeNav === item.id
                  ? "bg-blue-50 text-blue-600 font-medium"
                  : "text-gray-500 hover:bg-gray-50 hover:text-gray-800"
              }`}
            >
              <Icon size={16} />
              {item.label}
            </button>
          );
        })}

        <p className="text-[10px] font-semibold text-gray-400 uppercase tracking-widest px-3 mb-3 mt-6">
          Workspace
        </p>
        {workspaceItems.map((item) => {
          const Icon = item.icon;
          return (
            <button
              key={item.id}
              onClick={() => { setActiveNav(item.id); setSidebarOpen(false); }}
              className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm transition ${
                activeNav === item.id
                  ? "bg-blue-50 text-blue-600 font-medium"
                  : "text-gray-500 hover:bg-gray-50 hover:text-gray-800"
              }`}
            >
              <Icon size={16} />
              {item.label}
            </button>
          );
        })}
      </aside>

      {/* Main content */}
      <main className="bg-white flex-1 px-4 sm:px-8 py-5 max-w-8xl flex flex-col gap-6 min-w-0">
        <div className="flex items-center gap-3 lg:hidden">
          <button
            onClick={() => setSidebarOpen(true)}
            className="p-2 rounded-lg border border-gray-200 text-gray-500 hover:bg-gray-50 transition-colors"
          >
            <Menu size={16} />
          </button>
          <h1 className="text-base font-semibold text-gray-900">Profile settings</h1>
        </div>

        {/* Page header — desktop only */}
        <div className="hidden lg:block">
          <h1 className="text-xl font-semibold text-gray-900">
            Profile settings
          </h1>
          <p className="text-sm text-gray-400 mt-0.5">
            Manage your personal information and account preferences
          </p>
        </div>

        {/* Profile card */}
        <div className="bg-white p-4 sm:p-6">
          <div className="flex items-center justify-between mb-5">
            <div>
              <h2 className="text-sm font-semibold text-gray-800">
                Personal information
              </h2>
              <p className="text-xs text-gray-400 mt-0.5">
                Your name and contact details
              </p>
            </div>
            <span className="inline-flex items-center gap-1.5 text-xs font-medium text-green-700 bg-green-50 px-2.5 py-1 rounded-full">
              <span className="w-1.5 h-1.5 bg-green-500 rounded-full" />
              Active
            </span>
          </div>

          <div className="flex flex-col sm:flex-row sm:items-start gap-4 sm:gap-5 mb-6">
            <div className="flex items-center gap-4 flex-1">
              <div className="relative shrink-0">
                <img
                  src={
                    user?.avatar
                      ? user.avatar.startsWith("http")
                        ? user.avatar
                        : `${CLOUDINARY_URL}${user.avatar}`
                      : "/images/avatar.png"
                  }
                  alt="avatar"
                  className="w-16 h-16 rounded-full object-cover border-2 border-gray-100"
                />
                <button
                  onClick={handleAvatarClick}
                  className="absolute -bottom-0.5 -right-0.5 w-5 h-5 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center text-xs border-2 border-white"
                >
                  <Pencil />
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={handleAvatarChange}
                  />
                </button>
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-gray-900 truncate">
                  {user.fullName}
                </p>
                <p className="text-xs text-gray-400 mt-0.5 truncate">{user.email}</p>
                <div className="flex flex-wrap gap-2 mt-2.5">
                  <span className="text-xs font-medium bg-blue-50 text-blue-600 px-2.5 py-0.5 rounded-full">
                    Pro plan
                  </span>
                  <span className="text-xs font-medium bg-amber-50 text-amber-600 px-2.5 py-0.5 rounded-full">
                    ⚠ 2FA off
                  </span>
                </div>
              </div>
            </div>
            <button
              onClick={handleAvatarClick}
              className="text-xs font-medium text-gray-500 border border-gray-200 rounded-lg px-3 py-1.5 hover:bg-gray-50 transition-colors self-start shrink-0"
            >
              Change photo
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                className="hidden"
                onChange={handleAvatarChange}
              />
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
            <div>
              <label className="block text-[10px] font-semibold uppercase tracking-wider text-gray-400 mb-1.5">
                Full name
              </label>
              <input
                {...registerProfile("fullName")}
                maxLength={100}
                type="text"
                defaultValue={user.fullName}
                className={`w-full text-sm px-3 py-2 rounded-lg bg-gray-50 border border-gray-100 focus:outline-none focus:ring-1 focus:ring-blue-400 focus:bg-white transition-all ${
                  profileErrors.fullName
                    ? "border-red-500 focus:ring-red-500"
                    : ""
                }`}
              />
              {profileErrors.fullName && (
                <p className="text-red-500 text-xs sm:text-sm mt-1">
                  {profileErrors.fullName.message}
                </p>
              )}
            </div>
            <div className="mb-6">
              <label className="block text-[10px] font-semibold uppercase tracking-wider text-gray-400 mb-1.5">
                Phone
              </label>
              <input
                {...registerProfile("phone")}
                maxLength={100}
                type="text"
                placeholder={user.phone || "Please enter your phone number"}
                className={`w-full text-sm px-3 py-2 rounded-lg bg-gray-50 border border-gray-100 focus:outline-none focus:ring-1 focus:ring-blue-400 focus:bg-white transition-all ${
                  profileErrors.phone ? "border-red-500 focus:ring-red-500" : ""
                }`}
              />
              {profileErrors.phone && (
                <p className="text-red-500 text-xs sm:text-sm mt-1">
                  {profileErrors.phone.message}
                </p>
              )}
            </div>
          </div>

          <div>
            <label className="block text-[10px] font-semibold uppercase tracking-wider text-gray-400 mb-1.5">
              Email address
            </label>
            <input
              className="w-full rounded-lg border border-[#e8dbce] bg-[#f4ede7] cursor-not-allowed px-3 py-2 text-sm text-[#9c7349]"
              type="email"
              value={user?.email || ""}
              disabled
            />
          </div>

          <div className="flex justify-end gap-2 pt-4 border-t border-gray-100">
            <button className="text-sm text-gray-500 border border-gray-200 rounded-lg px-4 py-1.5 hover:bg-gray-50 transition-colors">
              Discard
            </button>
            <button
              onClick={handleProfileSubmit(handleUpdateProfile)}
              className={`text-sm font-medium text-white bg-gray-900 rounded-lg px-4 py-1.5 hover:bg-gray-700 transition-colors ${
                isProfileSubmitting ? "opacity-60 cursor-not-allowed" : ""
              }`}
            >
              {isProfileSubmitting ? "Saving..." : "Save Changes"}
            </button>
          </div>
        </div>

        <div className="bg-white border border-gray-100 rounded-2xl p-4 sm:p-6">
          <div className="mb-5">
            <h2 className="text-sm font-semibold text-gray-800">
              Security & authentication
            </h2>
            <p className="text-xs text-gray-400 mt-0.5">
              Keep your account safe
            </p>
          </div>

          <div className="divide-y divide-gray-50 mb-6">
            <div className="flex items-center justify-between py-3 first:pt-0 gap-3">
              <div className="min-w-0">
                <p className="text-sm font-medium text-gray-800">
                  Two-factor authentication
                </p>
                <p className="text-xs text-gray-400 mt-0.5">
                  Require a code in addition to your password
                </p>
              </div>
              <div className="flex items-center gap-2 shrink-0">
                <span className="text-xs text-gray-400">
                  {tfaEnabled ? "On" : "Off"}
                </span>
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

            <div className="flex items-center justify-between py-3 last:pb-0 gap-3">
              <div className="min-w-0">
                <p className="text-sm font-medium text-gray-800">
                  Active sessions
                </p>
                <p className="text-xs text-gray-400 mt-0.5">
                  Signed in on 3 devices
                </p>
              </div>
              <button className="text-xs font-medium text-gray-500 border border-gray-200 rounded-lg px-3 py-1.5 hover:bg-gray-50 transition-colors shrink-0">
                Manage
              </button>
            </div>
          </div>

          {/* Change password form */}
          <div>
            <div className="flex items-center gap-2 mb-4">
              <div>
                <p className="text-sm font-semibold text-gray-800">
                  Change password
                </p>
                <p className="text-[11px] text-gray-400">
                  Use a strong, unique password
                </p>
              </div>
            </div>

            <div className="flex flex-col gap-3">
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
                      errors.oldPassword
                        ? "border-red-300 focus:ring-red-400"
                        : "border-gray-200"
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
                  <p className="text-red-500 text-xs mt-1">
                    {errors.oldPassword.message}
                  </p>
                )}
              </div>

              {/* [CHANGED] 1 col on mobile, 2 col on sm+ */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
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
                        errors.newPassword
                          ? "border-red-300 focus:ring-red-400"
                          : "border-gray-200"
                      }`}
                    />
                    <button
                      type="button"
                      onClick={() => setShowNewPassword(!showNewPassword)}
                      className="absolute right-2.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                    >
                      {showNewPassword ? (
                        <EyeOff size={15} />
                      ) : (
                        <Eye size={15} />
                      )}
                    </button>
                  </div>
                  {errors.newPassword && (
                    <p className="text-red-500 text-xs mt-1">
                      {errors.newPassword.message}
                    </p>
                  )}
                </div>

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
                        errors.confirmPassword
                          ? "border-red-300 focus:ring-red-400"
                          : "border-gray-200"
                      }`}
                    />
                    <button
                      type="button"
                      onClick={() =>
                        setShowConfirmPassword(!showConfirmPassword)
                      }
                      className="absolute right-2.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                    >
                      {showConfirmPassword ? (
                        <EyeOff size={15} />
                      ) : (
                        <Eye size={15} />
                      )}
                    </button>
                  </div>
                  {errors.confirmPassword && (
                    <p className="text-red-500 text-xs mt-1">
                      {errors.confirmPassword.message}
                    </p>
                  )}
                </div>
              </div>
            </div>

            {/* [CHANGED] stack on mobile */}
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

          <div className="flex flex-col gap-2 mt-4">
            {[
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
            ].map((s) => (
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
                    <span className="w-1.5 h-1.5 bg-green-500 rounded-full" />{" "}
                    Current
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

        {/* Danger zone */}
        <div className="bg-white border border-red-100 rounded-2xl p-4 sm:p-6">
          <div className="mb-5">
            <h2 className="text-sm font-semibold text-red-500">Danger zone</h2>
            <p className="text-xs text-gray-400 mt-0.5">
              Irreversible actions — proceed with caution
            </p>
          </div>

          <div className="divide-y divide-gray-50">
            {/* [CHANGED] stack on mobile */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between py-3 first:pt-0 gap-3">
              <div>
                <p className="text-sm font-medium text-gray-800">
                  Archive account
                </p>
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
                <p className="text-sm font-medium text-red-500">
                  Delete account permanently
                </p>
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

        <footer className="text-center text-[10px] text-gray-300 tracking-widest uppercase pb-4">
          ARCHITECT v2.4.0 · Last updated Oct 24 2023
        </footer>
      </main>
    </div>
  );
};

export default Profile;