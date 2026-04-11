import {
  CircleCheckBig,
  FileText,
  HelpCircle,
  Home,
  LayoutDashboard,
  LayoutGrid,
  Settings,
  Trash,
  UserPlus,
  ChevronLeft,
  ChevronRight,
  ChevronDown,
  Folder,
  File,
  Plus,
} from "lucide-react";
import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";

const menuItems = [
  { label: "Home", icon: <Home size={18} />, path: "/home" },
  { label: "My Tasks", icon: <CircleCheckBig size={18} />, path: "/my-tasks" },
  { label: "Spaces", icon: <LayoutGrid size={18} />, path: "/spaces" },
];

const bottomItems = [
  { label: "Settings", icon: <Settings size={18} />, path: "/settings" },
  { label: "Help", icon: <HelpCircle size={18} />, path: "/help" },
];

const spacesData = [
  {
    name: "Marketing",
    categories: [
      {
        name: "Website",
        projects: ["Landing Page", "Blog Page"],
      },
      {
        name: "SEO",
        projects: ["Keyword Research", "Backlink"],
      },
    ],
  },
  {
    name: "Development",
    categories: [
      {
        name: "Frontend",
        projects: ["React App", "Admin Dashboard"],
      },
      {
        name: "Backend",
        projects: ["API Server", "Auth Service"],
      },
    ],
  },
];

const SideBar: React.FC = () => {
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const [isOpen, setIsOpen] = useState(false);
  const [openSpaces, setOpenSpaces] = useState(false);
  const [openSpacesList, setOpenSpacesList] = useState<number[]>([]);
  const [openCategories, setOpenCategories] = useState<string[]>([]);

  const isActive = (path: string) => pathname.startsWith(path);

  const handleNavigate = (path: string) => {
    navigate(path);
    setIsOpen(false);
  };

  const toggleSpace = (index: number) => {
    setOpenSpacesList((prev) =>
      prev.includes(index) ? prev.filter((i) => i !== index) : [...prev, index],
    );
  };

  const toggleCategory = (spaceIdx: number, catIdx: number) => {
    const key = `${spaceIdx}-${catIdx}`;

    setOpenCategories((prev) =>
      prev.includes(key) ? prev.filter((k) => k !== key) : [...prev, key],
    );
  };

  return (
    <>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`lg:hidden fixed top-1/2 -translate-y-1/2 z-50 bg-white border border-slate-200 shadow-md rounded-lg p-2 transition-all duration-300 ${isOpen ? "left-60" : "left-2"}`}
      >
        {isOpen ? <ChevronLeft size={18} /> : <ChevronRight size={18} />}
      </button>

      {isOpen && (
        <div
          onClick={() => setIsOpen(false)}
          className="fixed inset-0 bg-black/30 z-40 lg:hidden"
        />
      )}

      <aside className="hidden lg:flex flex-col h-screen w-60 fixed left-0 top-0 border-r border-slate-200 bg-slate-50 z-40">
        {/* Logo */}
        <div className="flex items-center gap-3 px-5 mt-20">
          <div className="w-8 h-8 rounded-lg bg-indigo-600 flex items-center justify-center text-white flex-shrink-0">
            <span className="material-symbols-outlined text-[16px]">
              rocket_launch
            </span>
          </div>
          <div>
            <p className="text-sm font-bold text-slate-900 leading-tight">
              Acme Corp
            </p>
            <p className="text-[10.5px] text-slate-400">Enterprise Plan</p>
          </div>
        </div>

        {/* Nav */}
        <nav className="flex-1 overflow-y-auto px-3 py-3 space-y-0.5">
          {menuItems.map((item) => {
            const isSpace = item.label === "Spaces";

            return (
              <div key={item.path}>
                <button
                  onClick={() => {
                    handleNavigate(item.path);
                    setTimeout(() => {
                      setOpenSpaces((prev) => !prev);
                    }, 10);
                  }}
                  className={`
                    w-full flex items-center justify-between px-3 py-2.5 rounded-lg text-sm font-medium
                    transition-all duration-150 relative group
                    ${
                      isActive(item.path)
                        ? "bg-indigo-50 text-indigo-700"
                        : "text-slate-500 hover:bg-slate-100 hover:text-slate-700"
                    }
                  `}
                >
                  <div className="flex items-center gap-3">
                    {isActive(item.path) && (
                      <span className="absolute left-0 top-1/2 -translate-y-1/2 w-[3px] h-[60%] bg-indigo-600 rounded-r-full" />
                    )}

                    <span
                      className={`transition-colors ${
                        isActive(item.path)
                          ? "text-indigo-600"
                          : "text-slate-400 group-hover:text-slate-500"
                      }`}
                    >
                      {item.icon}
                    </span>
                    <span>{item.label}</span>
                  </div>

                  {isSpace && (
                    <div className="flex items-center gap-1">
                      {/* CREATE SPACE */}
                      <Plus
                        size={16}
                        onClick={(e) => {
                          e.stopPropagation();
                          console.log("Create Space");
                        }}
                        className="opacity-0 group-hover:opacity-100 text-slate-400 hover:text-indigo-600 transition cursor-pointer"
                      />

                      {/* TOGGLE */}
                      <ChevronDown
                        size={16}
                        className={`transition-transform ${
                          openSpaces ? "rotate-180" : ""
                        }`}
                      />
                    </div>
                  )}
                </button>

                {/* SUB MENU */}
                {isSpace && openSpaces && (
                  <div className="ml-4 mt-2 space-y-2">
                    {spacesData.map((space, sIdx) => (
                      <div key={sIdx}>
                        {/* SPACE */}
                        <div
                          onClick={() => toggleSpace(sIdx)}
                          className="flex items-center justify-between px-2 py-1.5 text-sm font-semibold text-slate-600 cursor-pointer hover:text-indigo-600 group"
                        >
                          <div className="flex items-center gap-2">
                            {space.name}
                          </div>

                          <div className="flex items-center gap-1">
                            <Plus
                              size={14}
                              onClick={(e) => {
                                e.stopPropagation();
                                console.log("Create category in", space.name);
                              }}
                              className="opacity-0 group-hover:opacity-100 text-slate-400 hover:text-indigo-600"
                            />

                            <ChevronDown
                              size={14}
                              className={`transition ${
                                openSpacesList.includes(sIdx)
                                  ? "rotate-180"
                                  : ""
                              }`}
                            />
                          </div>
                        </div>

                        {/* CATEGORY */}
                        {openSpacesList.includes(sIdx) && (
                          <div className="ml-4 mt-1 space-y-2">
                            {space.categories.map((cat, cIdx) => (
                              <div key={cIdx}>
                                <div
                                  onClick={() => toggleCategory(sIdx, cIdx)}
                                  className="flex items-center justify-between px-2 py-1 text-xs font-semibold text-slate-400 uppercase cursor-pointer group"
                                >
                                  <div className="flex items-center gap-2">
                                    <Folder size={13} />
                                    {cat.name}
                                  </div>

                                  <div className="flex items-center gap-1">
                                    <Plus
                                      size={12}
                                      onClick={(e) => {
                                        e.stopPropagation();
                                        console.log(
                                          "Create project in",
                                          cat.name,
                                        );
                                      }}
                                      className="opacity-0 group-hover:opacity-100 text-slate-400 hover:text-indigo-600"
                                    />

                                    <ChevronDown
                                      size={12}
                                      className={`transition ${
                                        openCategories.includes(
                                          `${sIdx}-${cIdx}`,
                                        )
                                          ? "rotate-180"
                                          : ""
                                      }`}
                                    />
                                  </div>
                                </div>

                                {/* PROJECT */}
                                {openCategories.includes(`${sIdx}-${cIdx}`) && (
                                  <div className="ml-4 mt-1 space-y-1">
                                    {cat.projects.map((project, pIdx) => (
                                      <button
                                        key={pIdx}
                                        onClick={() =>
                                          handleNavigate(
                                            `/spaces/${space.name}/${cat.name}/${project}`,
                                          )
                                        }
                                        className="w-full flex items-center gap-2 px-2 py-1.5 text-sm text-slate-500 hover:text-indigo-600 hover:bg-slate-100 rounded-md transition"
                                      >
                                        <File size={13} />
                                        {project}
                                      </button>
                                    ))}
                                  </div>
                                )}
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            );
          })}
        </nav>

        {/* Footer */}
        <div className="px-3 py-3 border-t border-slate-100 space-y-0.5">
          <button
            onClick={() => {}}
            className="w-full mb-3 py-2 border border-indigo-200 text-indigo-600 font-semibold text-xs rounded-lg hover:bg-indigo-50 transition-colors flex items-center justify-center gap-1.5"
          >
            <UserPlus size={13} />
            Invite Members
          </button>
          {bottomItems.map((item) => (
            <button
              key={item.path}
              onClick={() => handleNavigate(item.path)}
              className={`
                w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium
                transition-all duration-150 relative group
                ${
                  isActive(item.path)
                    ? "bg-indigo-50 text-indigo-700"
                    : "text-slate-500 hover:bg-slate-100 hover:text-slate-700"
                }
              `}
            >
              {isActive(item.path) && (
                <span className="absolute left-0 top-1/2 -translate-y-1/2 w-[3px] h-[60%] bg-indigo-600 rounded-r-full" />
              )}
              <span
                className={`transition-colors ${
                  isActive(item.path)
                    ? "text-indigo-600"
                    : "text-slate-400 group-hover:text-slate-500"
                }`}
              >
                {item.icon}
              </span>
              <span>{item.label}</span>
            </button>
          ))}
        </div>
      </aside>

      {/* ─── Mobile sidebar (UPDATED) ─── */}
      <aside
        className={`
          lg:hidden flex flex-col h-screen w-60 fixed left-0 top-0 border-r border-slate-200 bg-slate-50 z-50 py-3
          transform transition-transform duration-300 ease-in-out
          ${isOpen ? "translate-x-0" : "-translate-x-full"}
        `}
      >
        {/* Logo */}
        <div className="w-9 h-9 rounded-lg bg-indigo-600 flex items-center justify-center text-white mb-4 flex-shrink-0 mx-auto">
          <span className="material-symbols-outlined text-[15px]">
            rocket_launch
          </span>
        </div>

        {/* Nav */}
        <nav className="flex-1 flex flex-col gap-1 w-full px-2">
          {menuItems.map((item) => {
            const isSpace = item.label === "Spaces";

            return (
              <div key={item.path}>
                {/* MAIN ITEM */}
                <button
                  onClick={() => {
                    handleNavigate(item.path);
                  }}
                  className={`
                  w-full flex items-center justify-between px-3 py-2.5 rounded-lg text-sm font-medium
                  transition-all duration-150 relative group
                  ${
                    isActive(item.path)
                      ? "bg-indigo-50 text-indigo-600"
                      : "text-slate-500 hover:bg-slate-100 hover:text-slate-700"
                  }
                  `}
                >
                  <div className="flex items-center gap-3">
                    {item.icon}
                    <span>{item.label}</span>
                  </div>
                </button>
              </div>
            );
          })}
        </nav>

        {/* Bottom */}
        <div className="flex flex-col gap-1 w-full px-2 pt-2 border-t border-slate-100">
          {bottomItems.map((item) => (
            <button
              key={item.path}
              onClick={() => handleNavigate(item.path)}
              className={`
                w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium
                transition-all duration-150 relative group
                ${
                  isActive(item.path)
                    ? "bg-indigo-50 text-indigo-600"
                    : "text-slate-500 hover:bg-slate-100 hover:text-slate-700"
                }
              `}
            >
              {item.icon}
              <span>{item.label}</span>
            </button>
          ))}
        </div>
      </aside>

      {/* Content offset */}
      {/* dùng: lg:pl-60 */}
    </>
  );
};

export default SideBar;
