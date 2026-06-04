import { Pencil } from "lucide-react";
import React, { useEffect, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../../redux/store";
import {
  UpdateProfileFormData,
  updateProfileSchema,
} from "../../../validations/auth";
import { uploadFile } from "../../../services/file";
import {
  callGetCurrentUser,
  callUpdateAvatar,
  callUpdateProfile,
} from "../../../services/auth";
import { setCurrentUser } from "../../../redux/slices/currentUser";
import { toastError, toastSuccess } from "../../../lib/toast";
import { normalizeAuthUser } from "../../../lib/auth";
import { CLOUDINARY_URL } from "../../../constants";

const ProfileTab: React.FC = () => {
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const dispatch = useDispatch();
  const user = useSelector((state: RootState) => state.auth.currentUser);
  const [avatar, setAvatar] = useState(user?.avatar);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
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
      reset({ fullName: user.fullName || "", phone: user.phone || "" });
      setAvatar(user.avatar);
    }
  }, [user, reset]);

  const handleAvatarClick = () => fileInputRef.current?.click();

  const handleAvatarChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files?.[0]) return;
    try {
      const { data } = await uploadFile(e.target.files[0]);
      setAvatar(data.name);
      await callUpdateAvatar(data.name);
      dispatch(setCurrentUser({ ...user, avatar: data.name }));
    } catch {
      toastError("Failed to update avatar");
    }
  };

  const handleUpdateProfile = async (dto: UpdateProfileFormData) => {
    try {
      await callUpdateProfile(dto.fullName, dto.phone);
      const res = await callGetCurrentUser();
      dispatch(setCurrentUser(normalizeAuthUser(res.data)));
      toastSuccess("Profile updated successfully");
    } catch {
      toastError("Failed to update profile");
    }
  };

  return (
    <div className="bg-white p-4 sm:p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-5">
        <div>
          <h2 className="text-sm font-semibold text-gray-800">Personal information</h2>
          <p className="text-xs text-gray-400 mt-0.5">Your name and contact details</p>
        </div>
        <span className="inline-flex items-center gap-1.5 text-xs font-medium text-green-700 bg-green-50 px-2.5 py-1 rounded-full">
          <span className="w-1.5 h-1.5 bg-green-500 rounded-full" />
          Active
        </span>
      </div>

      {/* Avatar row */}
      <div className="flex flex-col sm:flex-row sm:items-start gap-4 sm:gap-5 mb-6">
        <div className="flex items-center gap-4 flex-1">
          <div className="relative shrink-0">
            <img
              src={
                user?.avatar
                  ? user.avatar.startsWith("https")
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
            <p className="text-sm font-semibold text-gray-900 truncate">{user?.fullName}</p>
            <p className="text-xs text-gray-400 mt-0.5 truncate">{user?.email}</p>
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

      {/* Form fields */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
        <div>
          <label className="block text-[10px] font-semibold uppercase tracking-wider text-gray-400 mb-1.5">
            Full name
          </label>
          <input
            {...register("fullName")}
            maxLength={100}
            type="text"
            defaultValue={user?.fullName}
            className={`w-full text-sm px-3 py-2 rounded-lg bg-gray-50 border border-gray-100 focus:outline-none focus:ring-1 focus:ring-blue-400 focus:bg-white transition-all ${
              errors.fullName ? "border-red-500 focus:ring-red-500" : ""
            }`}
          />
          {errors.fullName && (
            <p className="text-red-500 text-xs sm:text-sm mt-1">{errors.fullName.message}</p>
          )}
        </div>
        <div className="mb-6">
          <label className="block text-[10px] font-semibold uppercase tracking-wider text-gray-400 mb-1.5">
            Phone
          </label>
          <input
            {...register("phone")}
            maxLength={100}
            type="text"
            placeholder={user?.phone || "Please enter your phone number"}
            className={`w-full text-sm px-3 py-2 rounded-lg bg-gray-50 border border-gray-100 focus:outline-none focus:ring-1 focus:ring-blue-400 focus:bg-white transition-all ${
              errors.phone ? "border-red-500 focus:ring-red-500" : ""
            }`}
          />
          {errors.phone && (
            <p className="text-red-500 text-xs sm:text-sm mt-1">{errors.phone.message}</p>
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

      {/* Actions */}
      <div className="flex justify-end gap-2 pt-4 border-t border-gray-100">
        <button className="text-sm text-gray-500 border border-gray-200 rounded-lg px-4 py-1.5 hover:bg-gray-50 transition-colors">
          Discard
        </button>
        <button
          onClick={handleSubmit(handleUpdateProfile)}
          disabled={isSubmitting}
          className={`text-sm font-medium text-white bg-gray-900 rounded-lg px-4 py-1.5 hover:bg-gray-700 transition-colors ${
            isSubmitting ? "opacity-60 cursor-not-allowed" : ""
          }`}
        >
          {isSubmitting ? "Saving..." : "Save Changes"}
        </button>
      </div>
    </div>
  );
};

export default ProfileTab;