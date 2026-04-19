import React from "react";
import { CLOUDINARY_URL } from "../../constants";

interface AvatarMember {
  id: number;
  fullName: string;
  avatar?: string;
}

const MAX_AVATARS = 3;

export const AvatarStack: React.FC<{ members: AvatarMember[] }> = ({
  members,
}) => {
  const list = Array.isArray(members) ? members : [];
  const visible = list.slice(0, MAX_AVATARS);
  const extra = list.length - MAX_AVATARS;

  if (list.length === 0) {
    return <span className="text-[10px] text-outline">No members yet</span>;
  }

  return (
    <div className="flex items-center mb-5">
      {visible.map((m, i) => {
        const src = m.avatar
          ? m.avatar.startsWith("http")
            ? m.avatar
            : `${CLOUDINARY_URL}${m.avatar}`
          : "/images/avatar.png";
        return (
          <img
            key={m.id}
            src={src}
            alt={m.fullName}
            title={m.fullName}
            className="w-6 h-6 rounded-full ring-2 ring-white object-cover flex-shrink-0"
            style={{ marginLeft: i > 0 ? "-6px" : 0, zIndex: MAX_AVATARS - i }}
          />
        );
      })}
      {extra > 0 && (
        <div
          className="w-6 h-6 rounded-full ring-2 ring-white bg-primary-container text-on-primary-container text-[9px] font-bold flex items-center justify-center flex-shrink-0"
          style={{ marginLeft: "-6px" }}
        >
          +{extra}
        </div>
      )}
    </div>
  );
};