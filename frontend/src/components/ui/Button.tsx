type ViewButtonVariant = "default" | "indigo" | "green" | "red" | "amber";
type ViewButtonSize = "sm" | "md" | "lg";

const variantClasses: Record<
  ViewButtonVariant,
  { active: string; inactive: string }
> = {
  default: {
    active: "bg-stone-100 text-stone-800",
    inactive: "text-stone-500 hover:bg-stone-100 hover:text-stone-700",
  },
  indigo: {
    active: "bg-indigo-50 text-indigo-600 shadow-sm",
    inactive: "text-stone-500 hover:bg-indigo-50 hover:text-indigo-600",
  },
  green: {
    active: "bg-emerald-50 text-emerald-600 shadow-sm",
    inactive: "text-stone-500 hover:bg-emerald-50 hover:text-emerald-600",
  },
  red: {
    active: "bg-red-50 text-red-600 shadow-sm",
    inactive: "text-stone-500 hover:bg-red-50 hover:text-red-600",
  },
  amber: {
    active: "bg-amber-50 text-amber-600 shadow-sm",
    inactive: "text-stone-500 hover:bg-amber-50 hover:text-amber-600",
  },
};

const sizeClasses: Record<ViewButtonSize, string> = {
  sm: "text-xs px-2 py-1 gap-1",
  md: "text-xs px-3 py-1.5 gap-1.5",
  lg: "text-sm px-4 py-2 gap-2",
};

export const Button: React.FC<{
  icon?: React.ReactNode;
  label?: string;
  active?: boolean;
  onClick?: () => void;
  variant?: ViewButtonVariant;
  size?: ViewButtonSize;
  iconOnly?: boolean;
  vertical?: boolean;
}> = ({
  icon,
  label,
  active = false,
  onClick,
  variant = "default",
  size = "md",
  iconOnly = false,
  vertical = false,
}) => {
  const variantStyle = variantClasses[variant];

  return (
    <button
      onClick={onClick}
      className={`
        flex ${vertical ? "flex-col" : "flex-row"} items-center justify-center
        rounded-lg font-medium transition-all duration-150
        ${iconOnly ? "p-2" : sizeClasses[size]}
        ${active ? variantStyle.active : variantStyle.inactive}
      `}
    >
      {icon}
      {!iconOnly && label}
    </button>
  );
};
