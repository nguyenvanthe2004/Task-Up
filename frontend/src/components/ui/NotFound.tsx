import { FolderOpen, LucideIcon } from "lucide-react";

interface NotFoundProps {
  title?: string;
  icon?: LucideIcon;
}

const NotFound: React.FC<NotFoundProps> = ({
  title = "No data found",
  icon: Icon = FolderOpen,
}) => {
  return (
    <div className="flex flex-col items-center justify-center gap-3 py-16 select-none">
      <div className="flex items-center justify-center w-14 h-14 rounded-2xl bg-stone-100">
        <Icon className="w-7 h-7 text-stone-300" strokeWidth={1.5} />
      </div>
      <p className="text-sm font-medium text-stone-400">{title}</p>
    </div>
  );
};

export default NotFound;