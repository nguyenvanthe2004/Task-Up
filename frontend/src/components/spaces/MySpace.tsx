import { ChartColumnStacked, CirclePlus, Earth, Eye, EyeOff, Lock, Megaphone, Rocket, SquareTerminal } from "lucide-react";
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const MySpace: React.FC = () => {
  const navigate = useNavigate();
  return (
    <main className="ml-64 pt-14 min-h-screen bg-background">
      <div className="max-w-8xl mx-auto p-8">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-10">
          <div>
            <h1 className="text-3xl font-extrabold tracking-tight text-on-surface mb-2">
              Space Manager
            </h1>
            <p className="text-on-surface-variant max-w-2xl text-sm leading-relaxed">
              Architect your productivity environment. Manage team permissions,
              visibility settings, and resource allocation across your
              organizational spaces.
            </p>
          </div>
          <button className="bg-primary text-on-primary px-6 py-2.5 rounded-lg font-bold flex items-center justify-center gap-2 hover:bg-primary/90 transition-all active:scale-95 shadow-sm">
            <span className="material-symbols-outlined text-[20px]">
              <CirclePlus />
            </span>
            Create New Space
          </button>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div className="bg-surface-container-lowest border border-outline-variant rounded-lg p-6 flex flex-col hover:border-primary transition-colors group">
            <div className="flex justify-between items-start mb-6">
              <div className="w-12 h-12 rounded-lg bg-primary-container text-primary flex items-center justify-center">
                <span className="material-symbols-outlined text-[28px]">
                  <ChartColumnStacked />
                </span>
              </div>
              <div className="flex -space-x-2">
                <img
                  className="w-8 h-8 rounded-full border-2 border-surface-container-lowest"
                  data-alt="Avatar"
                  src="https://lh3.googleusercontent.com/aida-public/AB6AXuDys7dCVtenPqLeDVeTRcTmwYGouwR_yTqfOgwI-_5HJ2Bc4YD-BdQpJrTJwi0IzV8ymTs50VDqOkXkWZsBPT7UhHciF1K8hPC0g4TmqujRL3OV-45bPu9B0_x-pMxDs9J5vKcxIU-W8Rq78roW4P4Yab5I_TW67BwwD9aXB7QCWyqzqxMH9V4eFPvrQsMfqILTuJbWKVNpRFHYDp8ZfkZQX5_cTjQUkjBBnDnssWdm6Lp7_aevk9FQQ0ISlozijy5_4ADes-0RNOY"
                />
                <img
                  className="w-8 h-8 rounded-full border-2 border-surface-container-lowest"
                  data-alt="Avatar"
                  src="https://lh3.googleusercontent.com/aida-public/AB6AXuCAgbdX5l3XmrTyZESUfFsthUDqMkGGr7tjwBwCJXaM7c82GCqAq6aMHNC2b9Vt5oY9TYyCYR3OZQbMFp8cCGGxvP8SNMeOojGcB73B4PcQ6jhVLno7rGP4L8BxYph5AVszhy1BghXBE_Go4WNv7x8aeLYMMGP1jUdMto36KZOrtpoSJfHGudBv4v33UOZbLNYmtlu3Q_1KZhH1otFyG_ZX65NQXFVC823W3JHPbcMhqNyDNOgJbMhbIy9Csff3mOBlgfc07iUG2yM"
                />
                <div className="w-8 h-8 rounded-full bg-surface-container-highest border-2 border-surface-container-lowest flex items-center justify-center text-[10px] font-bold">
                  +5
                </div>
              </div>
            </div>
            <h3 className="text-lg font-bold text-on-surface mb-1">
              Design Systems
            </h3>
            <p className="text-sm text-on-surface-variant mb-4 line-clamp-2">
              Core visual assets and UI components library for the 2024
              enterprise rebrand.
            </p>
            <div className="flex flex-wrap gap-2 mb-6">
              <span className="px-2 py-0.5 rounded-md bg-secondary-container text-on-secondary-container text-[10px] font-bold uppercase tracking-wider">
                Private
              </span>
              <span className="px-2 py-0.5 rounded-md bg-surface-container text-on-surface-variant text-[10px] font-bold uppercase tracking-wider">
                Active
              </span>
            </div>
            <div className="mt-auto pt-4 border-t border-outline-variant flex justify-between items-center">
              <div className="flex items-center gap-4 text-xs font-medium text-outline">
                <span className="flex items-center gap-1">
                  <span className="material-symbols-outlined text-[14px]">
                    <Lock />
                  </span>{" "}
                  Permissions
                </span>
                <span className="flex items-center gap-1">
                  <span className="material-symbols-outlined text-[14px]">
                    <EyeOff />
                  </span>{" "}
                  Hidden
                </span>
              </div>
              <button onClick={() => navigate("overview")} className="text-primary text-sm font-bold hover:underline transition-all">
                Manage
              </button>
            </div>
          </div>
          <div className="bg-surface-container-lowest border border-outline-variant rounded-lg p-6 flex flex-col hover:border-primary transition-colors group">
            <div className="flex justify-between items-start mb-6">
              <div className="w-12 h-12 rounded-lg bg-tertiary-container text-tertiary flex items-center justify-center">
                <span className="material-symbols-outlined text-[28px]">
                  <Megaphone />
                </span>
              </div>
              <div className="flex -space-x-2">
                <img
                  className="w-8 h-8 rounded-full border-2 border-surface-container-lowest"
                  data-alt="Avatar"
                  src="https://lh3.googleusercontent.com/aida-public/AB6AXuBn9tZstJcIw3u98Oc0cwM1TCINdFuVZEsdTObW6lj_-Xvt-_hDQpBweByE0V4bj9EdHmirE_eGhwK9OM3pYCxdtiAZ_905sUfEFal2cldUvckdvqnuqL0TZf4zigWDQ_t56h__KUxm5vJdpjUQY9fc8mAhcPed8legHGSzT48gz5hPfNn-2WE8Vacoka1W52JpBnVpZZDzIyGhjI_4NDJqyaIV0zywZwGi7x2elPmLxOKTmRfy-4CcBHSW-Tjdco03l84Bz0Vukhk"
                />
                <img
                  className="w-8 h-8 rounded-full border-2 border-surface-container-lowest"
                  data-alt="Avatar"
                  src="https://lh3.googleusercontent.com/aida-public/AB6AXuCNKed1rDFLduOOSXsJ24tdDPBCcW5LsbeX9J1NIjAOslvuGyK46uvqXXuQPQP57qwHHQ_9gcIhENAppITwtrNl39ZYCNnmTwWan_3-QcHRstNaoEgGp1DNNdutxaP1TqFA-hNmJ6MFCa8wa7Uj-LmdzttIEHeeIoQ-ZpQrtUeNmiHHw061DCt4ON9iiIrttxcqk6qp6nCYCPZXfXz1R0tW5RIYGR2kJtGF_HVMas3nFj-ZHXRq-knqneHA9rSJimw-AhqaVGQKJP0"
                />
              </div>
            </div>
            <h3 className="text-lg font-bold text-on-surface mb-1">
              Marketing Q4
            </h3>
            <p className="text-sm text-on-surface-variant mb-4 line-clamp-2">
              Planning and assets for end-of-year holiday campaigns and social
              outreach.
            </p>
            <div className="flex flex-wrap gap-2 mb-6">
              <span className="px-2 py-0.5 rounded-md bg-primary-container text-on-primary-container text-[10px] font-bold uppercase tracking-wider">
                Public
              </span>
              <span className="px-2 py-0.5 rounded-md bg-surface-container text-on-surface-variant text-[10px] font-bold uppercase tracking-wider">
                Planning
              </span>
            </div>
            <div className="mt-auto pt-4 border-t border-outline-variant flex justify-between items-center">
              <div className="flex items-center gap-4 text-xs font-medium text-outline">
                <span className="flex items-center gap-1">
                  <span className="material-symbols-outlined text-[14px]">
                    <Earth />
                  </span>{" "}
                  Open Access
                </span>
                <span className="flex items-center gap-1">
                  <span className="material-symbols-outlined text-[14px]">
                    <Eye />
                  </span>{" "}
                  Visible
                </span>
              </div>
              <button onClick={() => navigate("overview")} className="text-primary text-sm font-bold hover:underline transition-all">
                Manage
              </button>
            </div>
          </div>
          <div className="bg-surface-container-lowest border border-outline-variant rounded-lg p-6 flex flex-col hover:border-primary transition-colors group">
            <div className="flex justify-between items-start mb-6">
              <div className="w-12 h-12 rounded-lg bg-indigo-100 text-indigo-700 flex items-center justify-center">
                <span className="material-symbols-outlined text-[28px]">
                  <Rocket />
                </span>
              </div>
              <div className="flex -space-x-2">
                <img
                  className="w-8 h-8 rounded-full border-2 border-surface-container-lowest"
                  data-alt="Avatar"
                  src="https://lh3.googleusercontent.com/aida-public/AB6AXuDjzh4cNvkCVFfAZvrmlUUZptDn7jCn8MP4dYf3GHEV3nBQFqB0bCfLSOYgQrjZbDhM1anTHWiN0INljt7ozh30aFziWn01uLtr6xHn9vu8IYdQVHENWUZiYz8y-kPvvIJ1ni4lGxzQVK5bcTOd4y2AvU4mY3uzxY0nj7rw7nU_gmXsuj24idkteMVh2A70MvSspf5Up1nqt1QfP2KG42Q_yEdKfKEGj-D0B3cumrpXY2lhTbxdwbqIqg55DsiF_MOWsWBlLayGJuA"
                />
              </div>
            </div>
            <h3 className="text-lg font-bold text-on-surface mb-1">
              Product Roadmap
            </h3>
            <p className="text-sm text-on-surface-variant mb-4 line-clamp-2">
              Long-term strategic vision and prioritized features for Velocity
              2.0 launch.
            </p>
            <div className="flex flex-wrap gap-2 mb-6">
              <span className="px-2 py-0.5 rounded-md bg-secondary-container text-on-secondary-container text-[10px] font-bold uppercase tracking-wider">
                Private
              </span>
              <span className="px-2 py-0.5 rounded-md bg-error/10 text-error text-[10px] font-bold uppercase tracking-wider">
                Critical
              </span>
            </div>
            <div className="mt-auto pt-4 border-t border-outline-variant flex justify-between items-center">
              <div className="flex items-center gap-4 text-xs font-medium text-outline">
                <span className="flex items-center gap-1">
                  <span className="material-symbols-outlined text-[14px]">
                    <Lock />
                  </span>{" "}
                  Protected
                </span>
                <span className="flex items-center gap-1">
                  <span className="material-symbols-outlined text-[14px]">
                    <EyeOff />
                  </span>{" "}
                  Hidden
                </span>
              </div>
              <button onClick={() => navigate("overview")} className="text-primary text-sm font-bold hover:underline transition-all">
                Manage
              </button>
            </div>
          </div>
          <div className="bg-surface-container-lowest border border-outline-variant rounded-lg p-6 flex flex-col hover:border-primary transition-colors group lg:col-span-2">
            <div className="flex flex-col md:flex-row gap-6">
              <div className="w-24 h-24 flex-shrink-0 rounded-lg bg-surface-container text-outline flex items-center justify-center">
                <span className="material-symbols-outlined text-[40px]">
                  <SquareTerminal />
                </span>
              </div>
              <div className="flex-1">
                <div className="flex justify-between items-start mb-2">
                  <h3 className="text-xl font-bold text-on-surface">
                    Engineering Backend
                  </h3>
                  <div className="flex -space-x-2">
                    <img
                      className="w-8 h-8 rounded-full border-2 border-surface-container-lowest"
                      data-alt="Avatar"
                      src="https://lh3.googleusercontent.com/aida-public/AB6AXuD1_bO3-_6yVReYkBKKtidP36xbiFMRLF9tCTkMKehj5q2PvjpnFSlqbSk_fGjI-V5y4u9XTLhEmonO2CHnVamtzDvxYCNptECJ9sx4eRJ9rMK3tBNOjrZ8-M8_uiEik36yy0TAsb0Oh1oy8lnuF9LBQfsI3AQUKjySsJipaGJC4xihGuhvuL_9Il0PlN61az5lMOAi6YXwFXImfiEMsd_bSdPrBLrFgWhAxEf_WeNqaLutmO3HtbxwJexfOWDsebrr3Q3hpV6M0nM"
                    />
                    <div className="w-8 h-8 rounded-full bg-primary text-on-primary border-2 border-surface-container-lowest flex items-center justify-center text-[10px] font-bold">
                      JD
                    </div>
                  </div>
                </div>
                <p className="text-sm text-on-surface-variant mb-6 max-w-lg">
                  Technical infrastructure diagrams, API documentation, and
                  server migration planning for high-availability environments.
                </p>
                <div className="flex items-center gap-4">
                  <div className="flex-1 bg-surface-container-high rounded-full h-2">
                    <div
                      className="bg-primary h-full rounded-full"
                      style={{ width: "75%" }}
                    ></div>
                  </div>
                  <span className="text-xs font-bold text-on-surface whitespace-nowrap">
                    75% Capacity
                  </span>
                </div>
              </div>
            </div>
            <div className="mt-6 pt-4 border-t border-outline-variant flex justify-between items-center">
              <div className="flex items-center gap-6 text-xs font-medium text-outline">
                <span className="flex items-center gap-1">
                  <span className="material-symbols-outlined text-[14px]">
                    lock
                  </span>{" "}
                  Restricted
                </span>
                <span className="flex items-center gap-1">
                  <span className="material-symbols-outlined text-[14px]">
                    settings_accessibility
                  </span>{" "}
                  Admin Auth
                </span>
                <span className="flex items-center gap-1">
                  <span className="material-symbols-outlined text-[14px]">
                    history
                  </span>{" "}
                  Sync Enabled
                </span>
              </div>
              <button onClick={() => navigate("overview")} className="text-primary text-sm font-bold hover:underline transition-all">
                Manage Space
              </button>
            </div>
          </div>
          <div className="border-2 border-dashed border-outline-variant rounded-lg p-6 flex flex-col items-center justify-center text-center hover:border-primary hover:bg-primary-container/30 transition-all cursor-pointer group">
            <div className="w-12 h-12 rounded-full bg-surface-container-high text-outline group-hover:bg-primary group-hover:text-on-primary transition-all mb-4 flex items-center justify-center">
              <span className="material-symbols-outlined text-[24px]">add</span>
            </div>
            <h3 className="font-bold text-on-surface mb-1">Add New Space</h3>
            <p className="text-xs text-on-surface-variant leading-relaxed">
              Create a dedicated architectural
              <br />
              workspace for your team.
            </p>
          </div>
        </div>
        <div className="mt-12 grid grid-cols-1 lg:grid-cols-2 gap-8">
          <section className="bg-surface-container-low border border-outline-variant rounded-lg p-8">
            <h2 className="text-lg font-bold mb-6 flex items-center gap-2">
              <span className="material-symbols-outlined text-primary text-[24px]">
                security
              </span>
              Global Privacy Controls
            </h2>
            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 bg-surface-container-lowest border border-outline-variant rounded-lg">
                <div>
                  <p className="font-bold text-sm">Two-Factor Authentication</p>
                  <p className="text-[11px] text-on-surface-variant">
                    Require additional validation for restricted workspace
                    access.
                  </p>
                </div>
                <div className="w-10 h-6 bg-primary rounded-full relative p-1 flex items-center">
                  <div className="w-4 h-4 bg-white rounded-full ml-auto"></div>
                </div>
              </div>
              <div className="flex items-center justify-between p-4 bg-surface-container-lowest border border-outline-variant rounded-lg">
                <div>
                  <p className="font-bold text-sm">Automatic Visibility</p>
                  <p className="text-[11px] text-on-surface-variant">
                    New spaces are private by default to ensure data security.
                  </p>
                </div>
                <div className="w-10 h-6 bg-surface-container-highest rounded-full relative p-1 flex items-center">
                  <div className="w-4 h-4 bg-white rounded-full border border-outline-variant"></div>
                </div>
              </div>
            </div>
          </section>
          <section className="bg-surface-container-low border border-outline-variant rounded-lg p-8">
            <h2 className="text-lg font-bold mb-6 flex items-center gap-2">
              <span className="material-symbols-outlined text-primary text-[24px]">
                notifications_active
              </span>
              Recent Activity
            </h2>
            <div className="space-y-4">
              <div className="flex items-start gap-4 text-xs">
                <div className="w-2 h-2 rounded-full bg-primary mt-1.5 flex-shrink-0"></div>
                <div className="flex-1">
                  <p className="text-on-surface-variant">
                    <span className="font-bold text-on-surface">
                      Sarah Johnson
                    </span>{" "}
                    was added to{" "}
                    <span className="font-bold text-on-surface">
                      Design Systems
                    </span>
                  </p>
                  <span className="text-[10px] text-outline">
                    2 minutes ago
                  </span>
                </div>
              </div>
              <div className="flex items-start gap-4 text-xs">
                <div className="w-2 h-2 rounded-full bg-tertiary mt-1.5 flex-shrink-0"></div>
                <div className="flex-1">
                  <p className="text-on-surface-variant">
                    <span className="font-bold text-on-surface">
                      Marketing Q4
                    </span>{" "}
                    assets were archived by{" "}
                    <span className="font-bold text-on-surface">
                      System Admin
                    </span>
                  </p>
                  <span className="text-[10px] text-outline">1 hour ago</span>
                </div>
              </div>
              <div className="flex items-start gap-4 text-xs">
                <div className="w-2 h-2 rounded-full bg-indigo-500 mt-1.5 flex-shrink-0"></div>
                <div className="flex-1">
                  <p className="text-on-surface-variant">
                    <span className="font-bold text-on-surface">
                      David Chen
                    </span>{" "}
                    updated{" "}
                    <span className="font-bold text-on-surface">
                      Backend Architecture
                    </span>{" "}
                    permissions
                  </p>
                  <span className="text-[10px] text-outline">4 hours ago</span>
                </div>
              </div>
            </div>
          </section>
        </div>
      </div>
    </main>
  );
};

export default MySpace;