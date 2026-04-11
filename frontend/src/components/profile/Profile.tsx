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
} from "lucide-react";
import React, { useState } from "react";
import { Button } from "../ui/Button";

const Profile: React.FC = () => {
  const [tfaEnabled, setTfaEnabled] = useState(false);
  const [activeView, setActiveView] = useState<"list" | "board" | "timeline">(
    "list",
  );
  const [activeNav, setActiveNav] = useState("profile");

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

  const viewOptions = [
    { key: "list", label: "List", icon: <List size={16} /> },
    { key: "board", label: "Board", icon: <LayoutGrid size={16} /> },
    { key: "timeline", label: "Timeline", icon: <GanttChart size={16} /> },
  ] as const;

  return (
    <div className="flex ml-0 lg:ml-60 mt-16 min-h-screen">
      {/* Sidebar */}
      <aside className="w-60 shrink-0 bg-white border-r border-gray-100 px-4 py-5 flex flex-col gap-1">
        <p className="text-[12px] font-semibold text-gray-400 uppercase tracking-widest px-3 mb-3">
          Settings
        </p>
        {navItems.map((item) => {
          const Icon = item.icon;

          return (
            <button
              key={item.id}
              onClick={() => setActiveNav(item.id)}
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
              onClick={() => setActiveNav(item.id)}
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
      <main className="bg-white flex-1 px-8 py-5 max-w-8xl flex flex-col gap-6">
        {/* Page header */}
        <div>
          <h1 className="text-xl font-semibold text-gray-900">
            Profile settings
          </h1>
          <p className="text-sm text-gray-400 mt-0.5">
            Manage your personal information and account preferences
          </p>
        </div>

        {/* Profile card */}
        <div className="bg-white p-6">
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

          <div className="flex items-start gap-5 mb-6">
            <div className="relative shrink-0">
              <img
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuDo9krOJ0KpBBMwkfbThKuSfRcUwFuXdQxSF0WB27C-91-TMZBdw9gG8d0WDmeG3a2FfCG96kOBImnOepAD7d9y8o7JVKc6evcQ0BbTAbHIbkGTvHNIbEIJGveF4ExDrG_1GKX_JktT_9AjB7ThnKgq7T4kfRpsuINiqdkDaVtNsPBuCCNCEi9nVfN2x7CbT8Ua8JWsbG_zXVc0rhhcgIZBDGbthIsjZSjl-Th-YhPXlwgv1CFysRc1fTkI86wcTCchIL0Hmzqk3aI"
                alt="Alexander Sterling"
                className="w-16 h-16 rounded-full object-cover border-2 border-gray-100"
              />
              <button className="absolute -bottom-0.5 -right-0.5 w-5 h-5 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center text-xs border-2 border-white">
                <Pencil />
              </button>
            </div>
            <div className="flex-1">
              <p className="text-sm font-semibold text-gray-900">
                Alexander Sterling
              </p>
              <p className="text-xs text-gray-400 mt-0.5">
                Lead Architect · alexander@architect.io
              </p>
              <div className="flex flex-wrap gap-2 mt-2.5">
                <span className="text-xs font-medium bg-blue-50 text-blue-600 px-2.5 py-0.5 rounded-full">
                  Pro plan
                </span>
                <span className="text-xs font-medium bg-amber-50 text-amber-600 px-2.5 py-0.5 rounded-full">
                  ⚠ 2FA off
                </span>
              </div>
            </div>
            <button className="text-xs font-medium text-gray-500 border border-gray-200 rounded-lg px-3 py-1.5 hover:bg-gray-50 transition-colors shrink-0">
              Change photo
            </button>
          </div>

          <div className="grid grid-cols-2 gap-4 mb-4">
            <div>
              <label className="block text-[10px] font-semibold uppercase tracking-wider text-gray-400 mb-1.5">
                Full name
              </label>
              <input
                type="text"
                defaultValue="Alexander Sterling"
                className="w-full text-sm px-3 py-2 rounded-lg bg-gray-50 border border-gray-100 focus:outline-none focus:ring-1 focus:ring-blue-400 focus:bg-white transition-all"
              />
            </div>
            <div>
              <label className="block text-[10px] font-semibold uppercase tracking-wider text-gray-400 mb-1.5">
                Email address
              </label>
              <input
                type="email"
                defaultValue="alexander@architect.io"
                className="w-full text-sm px-3 py-2 rounded-lg bg-gray-50 border border-gray-100 focus:outline-none focus:ring-1 focus:ring-blue-400 focus:bg-white transition-all"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4 mb-4">
            <div>
              <label className="block text-[10px] font-semibold uppercase tracking-wider text-gray-400 mb-1.5">
                Job title
              </label>
              <input
                type="text"
                defaultValue="Lead Architect"
                className="w-full text-sm px-3 py-2 rounded-lg bg-gray-50 border border-gray-100 focus:outline-none focus:ring-1 focus:ring-blue-400 focus:bg-white transition-all"
              />
            </div>
            <div>
              <label className="block text-[10px] font-semibold uppercase tracking-wider text-gray-400 mb-1.5">
                Department
              </label>
              <input
                type="text"
                defaultValue="Engineering"
                className="w-full text-sm px-3 py-2 rounded-lg bg-gray-50 border border-gray-100 focus:outline-none focus:ring-1 focus:ring-blue-400 focus:bg-white transition-all"
              />
            </div>
          </div>

          <div className="mb-5">
            <label className="block text-[10px] font-semibold uppercase tracking-wider text-gray-400 mb-1.5">
              Bio
            </label>
            <textarea
              rows={3}
              defaultValue="Lead Architect specializing in structural design and project lifecycle optimization. Focused on bringing clarity to complex systems."
              className="w-full text-sm px-3 py-2 rounded-lg bg-gray-50 border border-gray-100 focus:outline-none focus:ring-1 focus:ring-blue-400 focus:bg-white transition-all resize-none leading-relaxed"
            />
          </div>

          <div className="flex justify-end gap-2 pt-4 border-t border-gray-100">
            <button className="text-sm text-gray-500 border border-gray-200 rounded-lg px-4 py-1.5 hover:bg-gray-50 transition-colors">
              Discard
            </button>
            <button className="text-sm font-medium text-white bg-gray-900 rounded-lg px-4 py-1.5 hover:bg-gray-700 transition-colors">
              Save changes
            </button>
          </div>
        </div>

        {/* Security card */}
        <div className="bg-white border border-gray-100 rounded-2xl p-6">
          <div className="mb-5">
            <h2 className="text-sm font-semibold text-gray-800">
              Security & authentication
            </h2>
            <p className="text-xs text-gray-400 mt-0.5">
              Keep your account safe
            </p>
          </div>

          <div className="divide-y divide-gray-50">
            <div className="flex items-center justify-between py-3 first:pt-0">
              <div>
                <p className="text-sm font-medium text-gray-800">
                  Two-factor authentication
                </p>
                <p className="text-xs text-gray-400 mt-0.5">
                  Require a code in addition to your password
                </p>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-xs text-gray-400">
                  {tfaEnabled ? "On" : "Off"}
                </span>
                <button
                  onClick={() => setTfaEnabled(!tfaEnabled)}
                  className={`w-10 h-5.5 rounded-full relative transition-colors ${
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

            <div className="flex items-center justify-between py-3">
              <div>
                <p className="text-sm font-medium text-gray-800">Password</p>
                <p className="text-xs text-gray-400 mt-0.5">
                  Last changed 6 months ago
                </p>
              </div>
              <button className="text-xs font-medium text-gray-500 border border-gray-200 rounded-lg px-3 py-1.5 hover:bg-gray-50 transition-colors">
                Update password
              </button>
            </div>

            <div className="flex items-center justify-between py-3 last:pb-0">
              <div>
                <p className="text-sm font-medium text-gray-800">
                  Active sessions
                </p>
                <p className="text-xs text-gray-400 mt-0.5">
                  Signed in on 3 devices
                </p>
              </div>
              <button className="text-xs font-medium text-gray-500 border border-gray-200 rounded-lg px-3 py-1.5 hover:bg-gray-50 transition-colors">
                Manage
              </button>
            </div>
          </div>

          <div className="flex flex-col gap-2 mt-4">
            {[
              {
                icon: <Laptop />,
                name: "MacBook Pro · Chrome",
                loc: "Hanoi, Vietnam",
                time: "Active now",
                current: true,
              },
              {
                icon: <Smartphone />,
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
                <div className="w-9 h-9 bg-white rounded-lg flex items-center justify-center text-lg border border-gray-100">
                  {s.icon}
                </div>
                <div className="flex-1">
                  <p className="text-xs font-medium text-gray-800">{s.name}</p>
                  <p className="text-[11px] text-gray-400">
                    {s.loc} · {s.time}
                  </p>
                </div>
                {s.current ? (
                  <span className="text-[11px] font-medium text-green-700 bg-green-50 px-2 py-0.5 rounded-full flex items-center gap-1">
                    <span className="w-1.5 h-1.5 bg-green-500 rounded-full" />{" "}
                    Current
                  </span>
                ) : (
                  <button className="text-[11px] text-gray-400 border border-gray-200 rounded-md px-2.5 py-1 hover:bg-gray-100 transition-colors">
                    Revoke
                  </button>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Workspace preferences */}
        <div className="bg-white border border-gray-100 rounded-2xl p-6">
          <div className="mb-5">
            <h2 className="text-sm font-semibold text-gray-800">
              Workspace preferences
            </h2>
            <p className="text-xs text-gray-400 mt-0.5">
              Customize your working environment
            </p>
          </div>

          <div className="grid grid-cols-2 gap-6">
            <div>
              <label className="block text-[10px] font-semibold uppercase tracking-wider text-gray-400 mb-3">
                Default view
              </label>
              <div className="grid grid-cols-3 gap-2">
                {viewOptions.map((v) => (
                  <Button
                    key={v.key}
                    icon={<span className="text-lg">{v.icon}</span>}
                    label={v.label}
                    active={activeView === v.key}
                    onClick={() => setActiveView(v.key)}
                    variant="indigo"
                    size="md"
                    vertical
                  />
                ))}
              </div>
            </div>

            <div className="flex flex-col gap-4">
              <div>
                <label className="block text-[10px] font-semibold uppercase tracking-wider text-gray-400 mb-1.5">
                  Timezone
                </label>
                <select className="w-full text-sm px-3 py-2 rounded-lg bg-gray-50 border border-gray-100 focus:outline-none focus:ring-1 focus:ring-blue-400 text-gray-700">
                  <option>Eastern Time (UTC −05:00)</option>
                  <option>Pacific Time (UTC −08:00)</option>
                  <option selected>Indochina Time (UTC +07:00)</option>
                  <option>Greenwich Mean Time (UTC +00:00)</option>
                </select>
              </div>
              <div>
                <label className="block text-[10px] font-semibold uppercase tracking-wider text-gray-400 mb-1.5">
                  Start of week
                </label>
                <select className="w-full text-sm px-3 py-2 rounded-lg bg-gray-50 border border-gray-100 focus:outline-none focus:ring-1 focus:ring-blue-400 text-gray-700">
                  <option>Monday</option>
                  <option>Sunday</option>
                </select>
              </div>
            </div>
          </div>

          <div className="flex justify-end pt-4 mt-4 border-t border-gray-100">
            <button className="text-sm font-medium text-white bg-gray-900 rounded-lg px-4 py-1.5 hover:bg-gray-700 transition-colors">
              Save preferences
            </button>
          </div>
        </div>

        {/* Danger zone */}
        <div className="bg-white border border-red-100 rounded-2xl p-6">
          <div className="mb-5">
            <h2 className="text-sm font-semibold text-red-500">Danger zone</h2>
            <p className="text-xs text-gray-400 mt-0.5">
              Irreversible actions — proceed with caution
            </p>
          </div>

          <div className="divide-y divide-gray-50">
            <div className="flex items-center justify-between py-3 first:pt-0">
              <div>
                <p className="text-sm font-medium text-gray-800">
                  Archive account
                </p>
                <p className="text-xs text-gray-400 mt-0.5">
                  Temporarily disable your workspace and all data
                </p>
              </div>
              <button className="text-xs font-medium text-gray-500 border border-gray-200 rounded-lg px-3 py-1.5 hover:bg-gray-50 transition-colors">
                Archive
              </button>
            </div>
            <div className="flex items-center justify-between py-3 last:pb-0">
              <div>
                <p className="text-sm font-medium text-red-500">
                  Delete account permanently
                </p>
                <p className="text-xs text-gray-400 mt-0.5">
                  Remove all data. This action cannot be undone.
                </p>
              </div>
              <button className="text-xs font-medium text-red-600 bg-red-50 border border-red-100 rounded-lg px-3 py-1.5 hover:bg-red-100 transition-colors">
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
