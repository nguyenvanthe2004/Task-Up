import { GripVertical } from "lucide-react";
import React from "react";
import { CLOUDINARY_URL } from "../../constants";
import { UserWithWorkSpace } from "../../types/auth";

export interface MemberRowProps {
  member: UserWithWorkSpace;
  draggableProps?: React.HTMLAttributes<HTMLDivElement>;
  dragHandleProps?: React.HTMLAttributes<HTMLDivElement> | null;
  innerRef?: (el: HTMLElement | null) => void;
  isDragging?: boolean;
  onAction: () => void;
  actionIcon: React.ReactNode;
  actionClass: string;
}

const MemberRow: React.FC<MemberRowProps> = ({
  member,
  draggableProps,
  dragHandleProps,
  innerRef,
  isDragging,
  onAction,
  actionIcon,
  actionClass,
}) => {
  const src = member.avatar
    ? member.avatar.startsWith("http")
      ? member.avatar
      : `${CLOUDINARY_URL}${member.avatar}`
    : "/images/avatar.png";

  const patchedStyle: React.CSSProperties =
    draggableProps?.style && (draggableProps.style as React.CSSProperties).position === "fixed"
      ? { ...(draggableProps.style as React.CSSProperties), left: "auto", top: "auto" }
      : (draggableProps?.style as React.CSSProperties) ?? {};

  return (
    <div
      ref={innerRef}
      {...draggableProps}
      {...dragHandleProps}
      style={patchedStyle}
      className={`flex items-center gap-2 px-3 py-2 rounded-lg border transition-all select-none cursor-grab active:cursor-grabbing ${
        isDragging
          ? "bg-primary-container border-primary shadow-lg scale-[1.02]"
          : "bg-surface-container-lowest border-outline-variant hover:border-primary"
      }`}
    >
      <GripVertical className="w-3.5 h-3.5 text-outline flex-shrink-0" />

      <img
        src={src}
        alt={member.fullName}
        className="w-6 h-6 rounded-full object-cover flex-shrink-0 ring-1 ring-outline-variant"
      />

      <div className="flex-1 min-w-0">
        <p className="text-xs font-semibold text-on-surface truncate">{member.fullName}</p>
        <p className="text-[10px] text-outline truncate">{member.email}</p>
      </div>

      <button
        onClick={(e) => { e.stopPropagation(); onAction(); }}
        className={`flex-shrink-0 w-5 h-5 rounded-full flex items-center justify-center transition-colors ${actionClass}`}
      >
        {actionIcon}
      </button>
    </div>
  );
};

export default MemberRow;