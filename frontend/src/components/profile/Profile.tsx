import { Menu } from "lucide-react";
import React, { useState } from "react";
import ProfileSidebar from "./ProfileSidebar";
import ProfileTab from "./tabs/ProfileTab";
import SecurityTab from "./tabs/SecurityTab";
import IntegrationsTab from "./tabs/IntegrationsTab";
import NotificationsTab from "./tabs/NotificationTab";
import { NavId, WorkspaceId } from "../../types";

const TAB_MAP: Record<string, React.ReactNode> = {
  profile: <ProfileTab />,
  security: <SecurityTab />,
  integrations: <IntegrationsTab />,
  notifications: <NotificationsTab />,
};

const Profile: React.FC = () => {
  const [activeNav, setActiveNav] = useState<string>("profile");
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const handleNavChange = (id: NavId) => setActiveNav(id);
  const handleWorkspaceChange = (id: WorkspaceId) => setActiveNav(id);

  return (
    <div className="flex ml-0 lg:ml-60 mt-16 min-h-screen">
      <ProfileSidebar
        activeNav={activeNav}
        sidebarOpen={sidebarOpen}
        onNavChange={handleNavChange}
        onWorkspaceChange={handleWorkspaceChange}
        onClose={() => setSidebarOpen(false)}
      />

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

        <div className="hidden lg:block">
          <h1 className="text-xl font-semibold text-gray-900">Profile settings</h1>
          <p className="text-sm text-gray-400 mt-0.5">
            Manage your personal information and account preferences
          </p>
        </div>

        {TAB_MAP[activeNav] ?? null}

        <footer className="text-center text-[10px] text-gray-300 tracking-widest uppercase pb-4">
          ARCHITECT v2.4.0 · Last updated Oct 24 2023
        </footer>
      </main>
    </div>
  );
};

export default Profile;