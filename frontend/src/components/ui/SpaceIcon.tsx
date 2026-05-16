import {
  FolderKanban,
  LayoutDashboard,
  Code2,
  Megaphone,
  FlaskConical,
  FileText,
  Globe,
  ShieldCheck,
  Layers,
  MonitorPlay,
  Database,
  PenTool,
  Inbox,
  BookMarked,
  Telescope,
} from "lucide-react";

export const ICONS = [
  { icon: FolderKanban, label: "FolderKanban" },
  { icon: LayoutDashboard, label: "LayoutDashboard" },
  { icon: Code2, label: "Code2" },
  { icon: Megaphone, label: "Megaphone" },
  { icon: FlaskConical, label: "FlaskConical" },
  { icon: FileText, label: "FileText" },
  { icon: Globe, label: "Globe" },
  { icon: ShieldCheck, label: "ShieldCheck" },
  { icon: Layers, label: "Layers" },
  { icon: MonitorPlay, label: "MonitorPlay" },
  { icon: Database, label: "Database" },
  { icon: PenTool, label: "PenTool" },
  { icon: Inbox, label: "Inbox" },
  { icon: BookMarked, label: "BookMarked" },
  { icon: Telescope, label: "Telescope" },
];

const ICON_MAP = Object.fromEntries(ICONS.map(({ icon, label }) => [label, icon]));

export const SpaceIcon = ({
  icon,
  className,
}: {
  icon?: string | null;
  className?: string;
}) => {
  const Comp = icon ? ICON_MAP[icon] : null;
  return Comp ? (
    <Comp className={className} strokeWidth={1.75} />
  ) : (
    <FolderKanban className={className} strokeWidth={1.75} />
  );
};