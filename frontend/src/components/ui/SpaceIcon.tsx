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
const ICON_MAP: Record<
  string,
  React.FC<{ className?: string; strokeWidth?: number }>
> = {
  Kanban: FolderKanban,
  Dashboard: LayoutDashboard,
  Code: Code2,
  Campaign: Megaphone,
  Research: FlaskConical,
  Docs: FileText,
  Web: Globe,
  Security: ShieldCheck,
  Layers: Layers,
  Media: MonitorPlay,
  Data: Database,
  Design: PenTool,
  Inbox: Inbox,
  Wiki: BookMarked,
  Explore: Telescope,
};

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
