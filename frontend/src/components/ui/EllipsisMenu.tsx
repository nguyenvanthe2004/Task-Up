// components/ui/EllipsisMenu.tsx
import { MoreHorizontal, Pencil, Trash2 } from "lucide-react";
import { useEffect, useRef, useState } from "react";

export interface MenuAction {
  label: string;
  icon: React.ReactNode;
  onClick: () => void;
  variant?: "default" | "danger";
}

interface EllipsisMenuProps {
  actions: MenuAction[];
  align?: "left" | "right";
}

const EllipsisMenu: React.FC<EllipsisMenuProps> = ({
  actions,
  align = "right",
}) => {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  return (
    <div className="relative" ref={ref}>
      <button
        onClick={(e) => {
          e.stopPropagation();
          setOpen((prev) => !prev);
        }}
        className="p-1.5 rounded-lg text-outline hover:text-on-surface hover:bg-surface-container transition-colors"
      >
        <MoreHorizontal className="w-4 h-4" />
      </button>

      {open && (
        <div
          className={`absolute z-50 mt-1 w-44 bg-surface-container-lowest border border-outline-variant rounded-lg shadow-md py-1 ${
            align === "right" ? "right-0" : "left-0"
          }`}
        >
          {actions.map((action, i) => (
            <button
              key={i}
              onClick={(e) => {
                e.stopPropagation();
                action.onClick();
                setOpen(false);
              }}
              className={`w-full flex items-center gap-2.5 px-3 py-2 text-sm transition-colors ${
                action.variant === "danger"
                  ? "text-error hover:bg-error/10"
                  : "text-on-surface hover:bg-surface-container"
              }`}
            >
              {action.icon}
              {action.label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default EllipsisMenu;