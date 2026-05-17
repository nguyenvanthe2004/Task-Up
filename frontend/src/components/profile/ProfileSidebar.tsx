import {
  User,
  Bell,
  Shield,
  Palette,
  Plug,
  Home,
  Users,
  CreditCard,
  X,
} from "lucide-react";
import React from "react";
import { NavId, WorkspaceId } from "../../types";

interface ProfileSidebarProps {
  activeNav: string;
  sidebarOpen: boolean;
  onNavChange: (id: NavId) => void;
  onWorkspaceChange: (id: WorkspaceId) => void;
  onClose: () => void;
}

const navItems = [
  { id: "profile" as NavId, label: "Profile", icon: User },
  { id: "notifications" as NavId, label: "Notifications", icon: Bell },
  { id: "security" as NavId, label: "Security", icon: Shield },
  { id: "integrations" as NavId, label: "Integrations", icon: Plug },
];

const ProfileSidebar: React.FC<ProfileSidebarProps> = ({
  activeNav,
  sidebarOpen,
  onNavChange,
  onWorkspaceChange,
  onClose,
}) => {
  return (
    <>
      {/* Overlay */}
      {sidebarOpen && (
        <div
          className="lg:hidden fixed inset-0 z-40 bg-black/20"
          onClick={onClose}
        />
      )}

      <aside
        className={`
          w-60 shrink-0 bg-white border-r border-gray-100 px-4 py-5 flex flex-col gap-1
          fixed top-14 bottom-0 left-0 z-50 transition-transform duration-200
          lg:static lg:translate-x-0 lg:z-auto lg:transition-none
          ${sidebarOpen ? "translate-x-0 shadow-xl" : "-translate-x-full lg:translate-x-0"}
        `}
      >
        <button
          className="lg:hidden self-end mb-1 p-1.5 rounded-lg text-gray-400 hover:bg-gray-50"
          onClick={onClose}
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
              onClick={() => {
                onNavChange(item.id);
                onClose();
              }}
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
    </>
  );
};

export default ProfileSidebar;