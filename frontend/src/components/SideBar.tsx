import {
  CircleCheckBig,
  HelpCircle,
  Home,
  LayoutGrid,
  Settings,
  UserPlus,
  ChevronLeft,
  ChevronRight,
  ChevronDown,
  Folder,
  File,
  Plus,
  Puzzle,
  LayoutTemplate,
  Wrench,
  Zap,
  Users,
  Rocket,
  Briefcase,
  Target,
  Flame,
  Star,
  Package,
  Palette,
  Globe,
  ShieldCheck,
  BarChart2,
  BookOpen,
} from "lucide-react";
import React, { useEffect, useRef, useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import CreateWorkspaceModal from "./workspaces/CreateWorkspaceModal";
import { Workspace } from "../types/workspace";
import { RootState } from "../redux/store";
import { useDispatch, useSelector } from "react-redux";
import { addWorkspace } from "../redux/slices/currentUser";

const ICON_MAP: Record<string, React.ElementType> = {
  Rocket,
  Briefcase,
  Zap,
  Target,
  Puzzle,
  Flame,
  Star,
  Package,
  Wrench,
  Palette,
  Globe,
  Shield: ShieldCheck,
  Chart: BarChart2,
  Team: Users,
  Docs: BookOpen,
};

const isEmoji = (str: string) => {
  const emojiRegex =
    /[\u{1F300}-\u{1FAFF}\u{2600}-\u{26FF}\u{2700}-\u{27BF}\u{FE00}-\u{FE0F}\u{1F900}-\u{1F9FF}]/u;
  return emojiRegex.test(str);
};

interface WorkspaceIconProps {
  icon?: string;
  name?: string;
  className?: string;
  emojiSize?: number;
}

const WorkspaceIcon: React.FC<WorkspaceIconProps> = ({
  icon,
  name,
  className = "h-5 w-5",
  emojiSize = 16,
}) => {
  if (!icon) {
    return <span className="text-xs font-bold">{name?.charAt(0) ?? "?"}</span>;
  }

  const Icon = ICON_MAP[icon];
  if (Icon) {
    return <Icon className={className} strokeWidth={1.75} />;
  }

  if (isEmoji(icon) || icon.length <= 2) {
    return <span style={{ fontSize: emojiSize, lineHeight: 1 }}>{icon}</span>;
  }

  return <span className="text-xs font-bold">{name?.charAt(0) ?? "?"}</span>;
};

const menuItems = [
  { label: "Home", icon: <Home size={18} />, path: "/" },
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
      { name: "Website", projects: ["Landing Page", "Blog Page"] },
      { name: "SEO", projects: ["Keyword Research", "Backlink"] },
    ],
  },
  {
    name: "Development",
    categories: [
      { name: "Frontend", projects: ["React App", "Admin Dashboard"] },
      { name: "Backend", projects: ["API Server", "Auth Service"] },
    ],
  },
];

const slug = (name: string) => name.toLowerCase().replace(/\s+/g, "-");

const SideBar: React.FC = () => {
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const { workspaceId } = useParams();

  const [loading, setLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [open, setOpen] = useState(false);
  const [openDropdown, setOpenDropdown] = useState(false);
  const [openSpaces, setOpenSpaces] = useState(false);
  const [openSpacesList, setOpenSpacesList] = useState<number[]>([]);
  const [openCategories, setOpenCategories] = useState<string[]>([]);
  const dispatch = useDispatch();

  const user = useSelector((state: RootState) => state.auth.currentUser);

  const userWorkspaces: Workspace[] = user?.workspaces ?? [];

  const workspace = userWorkspaces.find((w) => w.id === Number(workspaceId));

  const ref = useRef<HTMLDivElement>(null);

  const isActive = (path: string) => {
    if (!workspaceId) return false;
    if (path === "/") return pathname === `/${workspaceId}`;
    return pathname.startsWith(`/${workspaceId}${path}`);
  };

  const isSpacePath = (spaceName: string) =>
    pathname.includes(`/spaces/${slug(spaceName)}`);

  const isCategoryPath = (spaceName: string, catName: string) =>
    pathname.includes(`/spaces/${slug(spaceName)}/${slug(catName)}`);

  const isProjectPath = (spaceName: string, catName: string, project: string) =>
    pathname ===
    `/${workspaceId}/spaces/${slug(spaceName)}/${slug(catName)}/${slug(project)}`;

  const handleNavigate = (path: string) => {
    navigate(path);
    setIsOpen(false);
  };

  const navigateToSpace = (spaceName: string) =>
    navigate(`/${workspaceId}/spaces/${slug(spaceName)}`);

  const navigateToCategory = (spaceName: string, catName: string) =>
    navigate(`/${workspaceId}/spaces/${slug(spaceName)}/${slug(catName)}`);

  const navigateToProject = (
    spaceName: string,
    catName: string,
    project: string,
  ) => {
    navigate(
      `/${workspaceId}/spaces/${slug(spaceName)}/${slug(catName)}/${slug(project)}`,
    );
    setIsOpen(false);
  };

  const toggleSpace = (index: number) =>
    setOpenSpacesList((prev) =>
      prev.includes(index) ? prev.filter((i) => i !== index) : [...prev, index],
    );

  const toggleCategory = (spaceIdx: number, catIdx: number) => {
    const key = `${spaceIdx}-${catIdx}`;
    setOpenCategories((prev) =>
      prev.includes(key) ? prev.filter((k) => k !== key) : [...prev, key],
    );
  };

  const handleSwitchWorkspace = (ws: Workspace) => {
    navigate(`/${ws.id}`);
    setOpenDropdown(false);
    setOpenSpaces(false);
    setOpenSpacesList([]);
    setOpenCategories([]);
  };

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpenDropdown(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const renderSpacesTree = () => (
    <div className="mt-0.5 space-y-0.5">
      {spacesData.map((space, spaceIdx) => {
        const isSpaceOpen = openSpacesList.includes(spaceIdx);
        const spaceActive = isSpacePath(space.name);

        return (
          <div key={space.name}>
            <div className="flex items-center group">
              <button
                className="flex items-center justify-center w-6 h-8 flex-shrink-0 rounded hover:bg-slate-200/60 transition-colors"
                onClick={() => toggleSpace(spaceIdx)}
              >
                <ChevronDown
                  size={13}
                  className={`transition-transform duration-200 ${isSpaceOpen ? "rotate-0" : "-rotate-90"} ${spaceActive ? "text-indigo-500" : "text-slate-400"}`}
                />
              </button>
              <button
                className={`flex-1 flex items-center gap-2 px-2 py-1.5 rounded-lg text-sm font-medium min-w-0 transition-all duration-150 ${
                  spaceActive
                    ? "bg-indigo-50 text-indigo-700"
                    : "text-slate-500 hover:bg-slate-100 hover:text-slate-700"
                }`}
                onClick={() => navigateToSpace(space.name)}
              >
                <Folder
                  size={14}
                  className={`flex-shrink-0 ${spaceActive ? "text-indigo-500" : "text-slate-400"}`}
                />
                <span className="truncate">{space.name}</span>
              </button>
              <button
                className="opacity-0 group-hover:opacity-100 ml-0.5 p-1 rounded hover:bg-slate-200/60 transition-all flex-shrink-0"
                onClick={() => console.log("Create category in", space.name)}
              >
                <Plus
                  size={12}
                  className="text-slate-400 hover:text-indigo-600"
                />
              </button>
            </div>

            {isSpaceOpen && (
              <div className="ml-5 mt-0.5 space-y-0.5 border-l border-slate-200 pl-2">
                {space.categories.map((cat, catIdx) => {
                  const catKey = `${spaceIdx}-${catIdx}`;
                  const isCatOpen = openCategories.includes(catKey);
                  const catActive = isCategoryPath(space.name, cat.name);

                  return (
                    <div key={cat.name}>
                      <div className="flex items-center group">
                        <button
                          className="flex items-center justify-center w-5 h-7 flex-shrink-0 rounded hover:bg-slate-200/60 transition-colors"
                          onClick={() => toggleCategory(spaceIdx, catIdx)}
                        >
                          <ChevronDown
                            size={11}
                            className={`transition-transform duration-200 ${isCatOpen ? "rotate-0" : "-rotate-90"} ${catActive ? "text-indigo-400" : "text-slate-400"}`}
                          />
                        </button>
                        <button
                          className={`flex-1 flex items-center gap-1.5 px-2 py-1.5 rounded-md text-[13px] font-medium min-w-0 transition-all duration-150 ${
                            catActive
                              ? "bg-indigo-50/70 text-indigo-600"
                              : "text-slate-500 hover:bg-slate-100 hover:text-slate-700"
                          }`}
                          onClick={() =>
                            navigateToCategory(space.name, cat.name)
                          }
                        >
                          <span className="truncate">{cat.name}</span>
                        </button>
                        <button
                          className="opacity-0 group-hover:opacity-100 ml-0.5 p-0.5 rounded hover:bg-slate-200/60 transition-all flex-shrink-0"
                          onClick={() =>
                            console.log("Create project in", cat.name)
                          }
                        >
                          <Plus
                            size={11}
                            className="text-slate-400 hover:text-indigo-600"
                          />
                        </button>
                      </div>

                      {isCatOpen && (
                        <div className="ml-3 mt-0.5 space-y-0.5 border-l border-slate-100 pl-2">
                          {cat.projects.map((project) => {
                            const projectActive = isProjectPath(
                              space.name,
                              cat.name,
                              project,
                            );
                            return (
                              <button
                                key={project}
                                onClick={() =>
                                  navigateToProject(
                                    space.name,
                                    cat.name,
                                    project,
                                  )
                                }
                                className={`w-full flex items-center gap-1.5 px-1.5 py-1.5 rounded-md text-[12.5px] transition-all duration-150 ${
                                  projectActive
                                    ? "bg-indigo-50 text-indigo-600 font-medium"
                                    : "text-slate-400 hover:bg-slate-100 hover:text-slate-600"
                                }`}
                              >
                                <File
                                  size={11}
                                  className={`flex-shrink-0 ${projectActive ? "text-indigo-400" : "text-slate-300"}`}
                                />
                                <span className="truncate">{project}</span>
                              </button>
                            );
                          })}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );

  const renderNavItem = (item: (typeof menuItems)[0]) => {
    const isSpace = item.label === "Spaces";
    const active = isActive(item.path);

    return (
      <div key={item.path}>
        <button
          onClick={() => {
            handleNavigate(
              item.label === "Home"
                ? `/${workspace?.id}`
                : `/${workspace?.id}${item.path}`,
            );
          }}
          className={`w-full flex items-center justify-between px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-150 relative group ${
            active
              ? "bg-indigo-50 text-indigo-700"
              : "text-slate-500 hover:bg-slate-100 hover:text-slate-700"
          }`}
        >
          <div className="flex items-center gap-3">
            {active && (
              <span className="absolute left-0 top-1/2 -translate-y-1/2 w-[3px] h-[60%] bg-indigo-600 rounded-r-full" />
            )}
            <span
              className={`transition-colors ${active ? "text-indigo-600" : "text-slate-400 group-hover:text-slate-500"}`}
            >
              {item.icon}
            </span>
            <span>{item.label}</span>
          </div>

          {isSpace && (
            <div className="flex items-center gap-1">
              <Plus
                size={16}
                onClick={(e) => {
                  e.stopPropagation();
                  console.log("Create Space");
                }}
                className="opacity-0 group-hover:opacity-100 text-slate-400 hover:text-indigo-600 transition cursor-pointer"
              />
              <ChevronDown
                size={16}
                onClick={(e) => {
                  e.stopPropagation();
                  setOpenSpaces((prev) => !prev);
                }}
                className={`transition-transform duration-200 ${openSpaces ? "rotate-180" : ""}`}
              />
            </div>
          )}
        </button>

        {isSpace && openSpaces && (
          <div className="px-1 mt-0.5">{renderSpacesTree()}</div>
        )}
      </div>
    );
  };

  return (
    <>
      {/* Mobile toggle */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`lg:hidden fixed top-1/2 -translate-y-1/2 z-50 bg-white border border-slate-200 shadow-md rounded-lg p-2 transition-all duration-300 ${
          isOpen ? "left-60" : "left-2"
        }`}
      >
        {isOpen ? <ChevronLeft size={18} /> : <ChevronRight size={18} />}
      </button>

      {isOpen && (
        <div
          onClick={() => setIsOpen(false)}
          className="fixed inset-0 bg-black/30 z-40 lg:hidden"
        />
      )}

      {open && (
        <CreateWorkspaceModal
          isOpen={open}
          onClose={() => setOpen(false)}
          onSuccess={(newWorkspace) => {
            dispatch(addWorkspace(newWorkspace));
            navigate(`/${newWorkspace.id}`);
            setOpen(false);
          }}
          isLoading={loading}
        />
      )}

      <aside className="hidden lg:flex flex-col h-screen w-60 fixed left-0 top-0 border-r border-slate-200 bg-slate-50 z-40">
        <div ref={ref} className="relative inline-block">
          <div
            className="flex items-center gap-3 px-5 mt-20 cursor-pointer"
            onClick={() => setOpenDropdown((prev) => !prev)}
          >
            <div
              className="w-9 h-9 rounded-lg flex items-center justify-center text-white flex-shrink-0 transition-colors duration-300"
              style={{ backgroundColor: workspace?.color ?? "#6366F1" }}
            >
              <WorkspaceIcon
                icon={workspace?.icon}
                name={workspace?.name}
                className="h-5 w-5"
                emojiSize={18}
              />
            </div>

            <div className="flex-1 min-w-0">
              <p className="text-sm font-bold text-slate-900 leading-tight truncate">
                {workspace?.name ?? "Workspace"}
              </p>
              <p className="text-[10.5px] text-slate-400 truncate">
                {workspace?.description}
              </p>
            </div>

            <ChevronDown
              className={`w-4 h-4 text-slate-400 transition-transform duration-200 flex-shrink-0 ${openDropdown ? "rotate-180" : ""}`}
            />
          </div>

          {/* Dropdown */}
          {openDropdown && (
            <div className="absolute left-0 top-full mt-2 w-72 bg-white rounded-xl shadow-xl border border-slate-100 z-50 overflow-hidden">
              {/* Current workspace info */}
              <div className="flex items-center gap-3 px-4 py-3 border-b border-slate-100">
                <div
                  className="w-9 h-9 rounded-lg flex items-center justify-center text-white flex-shrink-0"
                  style={{ backgroundColor: workspace?.color ?? "#6366F1" }}
                >
                  <WorkspaceIcon
                    icon={workspace?.icon}
                    name={workspace?.name}
                    className="h-5 w-5"
                    emojiSize={18}
                  />
                </div>
                <div>
                  <p className="text-sm font-bold text-slate-900">
                    {workspace?.name}
                  </p>
                  <p className="text-[10.5px] text-slate-400">
                    {userWorkspaces.length} workspaces
                  </p>
                </div>
              </div>

              {/* Actions */}
              <div className="flex gap-2 px-3 py-2 border-b border-slate-100">
                <button
                  onClick={() => {
                    navigate(`/${workspaceId}/members`);
                    setOpenDropdown(false);
                  }}
                  className="flex-1 flex items-center justify-center gap-1.5 py-1.5 border border-slate-200 rounded-lg text-xs text-slate-600 hover:bg-slate-50 transition-colors"
                >
                  <Users className="w-3.5 h-3.5" /> People
                </button>
              </div>

              {/* Manage */}
              <div className="pt-2">
                <p className="px-4 pb-1 text-[10px] font-semibold text-slate-400 uppercase tracking-wide">
                  Manage
                </p>
                {[
                  { icon: <Puzzle className="w-4 h-4" />, label: "Apps" },
                  {
                    icon: <LayoutTemplate className="w-4 h-4" />,
                    label: "Templates",
                  },
                  {
                    icon: <Wrench className="w-4 h-4" />,
                    label: "Custom Fields",
                  },
                  { icon: <Zap className="w-4 h-4" />, label: "Automations" },
                ].map(({ icon, label }) => (
                  <button
                    key={label}
                    className="w-full flex items-center gap-3 px-4 py-2 text-sm text-slate-600 hover:bg-slate-50 transition-colors"
                  >
                    {icon} {label}
                  </button>
                ))}
              </div>

              <div className="h-px bg-slate-100 my-1" />

              {/* Switch Workspace — lấy từ user.workspaces */}
              {userWorkspaces.filter((ws) => ws.id !== workspace?.id).length >
                0 && (
                <div className="pt-1">
                  <p className="px-4 pb-1 text-[10px] font-semibold text-slate-400 uppercase tracking-wide">
                    Switch Workspace
                  </p>
                  <div className="px-2 pb-2 max-h-48 overflow-y-auto">
                    {userWorkspaces
                      .filter((ws) => ws.id !== workspace?.id)
                      .map((ws) => (
                        <button
                          key={ws.id}
                          onClick={() => handleSwitchWorkspace(ws)}
                          className="w-full flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-slate-50 transition-colors"
                        >
                          <div
                            className="w-7 h-7 rounded-lg flex items-center justify-center text-white flex-shrink-0"
                            style={{ backgroundColor: ws.color ?? "#6366F1" }}
                          >
                            <WorkspaceIcon
                              icon={ws.icon}
                              name={ws.name}
                              className="h-4 w-4"
                              emojiSize={14}
                            />
                          </div>
                          <span className="text-sm text-slate-700 truncate">
                            {ws.name}
                          </span>
                        </button>
                      ))}
                  </div>
                </div>
              )}

              {/* Create Workspace */}
              <div className="px-3 pb-3">
                <button
                  onClick={() => {
                    setOpenDropdown(false);
                    setOpen(true);
                  }}
                  className="w-full flex items-center justify-center gap-2 py-2 border border-dashed border-slate-300 rounded-lg text-sm text-slate-500 hover:border-indigo-400 hover:text-indigo-500 hover:bg-indigo-50 transition-all"
                >
                  <Plus className="w-4 h-4" /> Create Workspace
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Nav */}
        <nav className="flex-1 overflow-y-auto px-3 py-3 space-y-0.5">
          {menuItems.map((item) => renderNavItem(item))}
        </nav>

        {/* Footer */}
        <div className="px-3 py-3 border-t border-slate-100 space-y-0.5">
          <button
            onClick={() => navigate(`/${workspace?.id}/members`)}
            className="w-full mb-3 py-2 border border-indigo-200 text-indigo-600 font-semibold text-xs rounded-lg hover:bg-indigo-50 transition-colors flex items-center justify-center gap-1.5"
          >
            <UserPlus size={13} /> Invite Members
          </button>
          {bottomItems.map((item) => (
            <button
              key={item.path}
              onClick={() => handleNavigate(`/${workspace?.id}${item.path}`)}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-150 relative group ${
                isActive(item.path)
                  ? "bg-indigo-50 text-indigo-700"
                  : "text-slate-500 hover:bg-slate-100 hover:text-slate-700"
              }`}
            >
              {isActive(item.path) && (
                <span className="absolute left-0 top-1/2 -translate-y-1/2 w-[3px] h-[60%] bg-indigo-600 rounded-r-full" />
              )}
              <span
                className={`transition-colors ${isActive(item.path) ? "text-indigo-600" : "text-slate-400 group-hover:text-slate-500"}`}
              >
                {item.icon}
              </span>
              <span>{item.label}</span>
            </button>
          ))}
        </div>
      </aside>

      {/* ─── Mobile Sidebar ─────────────────────────────────────────────────── */}
      <aside
        className={`lg:hidden flex flex-col h-screen w-60 fixed left-0 top-0 border-r border-slate-200 bg-slate-50 z-50 py-3 transform transition-transform duration-300 ease-in-out ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div
          className="w-9 h-9 rounded-lg flex items-center justify-center text-white mb-4 flex-shrink-0 mx-auto transition-colors duration-300"
          style={{ backgroundColor: workspace?.color ?? "#6366F1" }}
        >
          <WorkspaceIcon
            icon={workspace?.icon}
            name={workspace?.name}
            className="h-5 w-5"
            emojiSize={18}
          />
        </div>

        <nav className="flex-1 flex flex-col gap-1 w-full px-2 overflow-y-auto">
          {menuItems.map((item) => {
            const isSpace = item.label === "Spaces";
            return (
              <div key={item.path}>
                <button
                  onClick={() => {
                    handleNavigate(
                      item.label === "Home"
                        ? `/${workspace?.id}`
                        : `/${workspace?.id}${item.path}`,
                    );
                    if (isSpace) setOpenSpaces((prev) => !prev);
                  }}
                  className={`w-full flex items-center justify-between px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-150 relative group ${
                    isActive(item.path)
                      ? "bg-indigo-50 text-indigo-600"
                      : "text-slate-500 hover:bg-slate-100 hover:text-slate-700"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    {item.icon}
                    <span>{item.label}</span>
                  </div>
                  {isSpace && (
                    <ChevronDown
                      size={15}
                      className={`transition-transform duration-200 ${openSpaces ? "rotate-180" : ""}`}
                    />
                  )}
                </button>
                {isSpace && openSpaces && (
                  <div className="px-1 mt-0.5">{renderSpacesTree()}</div>
                )}
              </div>
            );
          })}
        </nav>

        <div className="flex flex-col gap-1 w-full px-2 pt-2 border-t border-slate-100">
          {bottomItems.map((item) => (
            <button
              key={item.path}
              onClick={() => handleNavigate(`/${workspace?.id}${item.path}`)}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-150 ${
                isActive(item.path)
                  ? "bg-indigo-50 text-indigo-600"
                  : "text-slate-500 hover:bg-slate-100 hover:text-slate-700"
              }`}
            >
              {item.icon}
              <span>{item.label}</span>
            </button>
          ))}
        </div>
      </aside>
    </>
  );
};

export default SideBar;
