import { useLocation } from "react-router-dom";
import { Menu, Bell, Search, User } from "lucide-react";
import { useSelector } from "react-redux";
import { RootState } from "../../redux/store";

const pageTitles: Record<string, string> = {
  "/admin": "User Management",
};

interface HeaderProps {
  onMenuClick: () => void;
}

export default function Header({ onMenuClick }: HeaderProps) {
  const location = useLocation();
  const currentUser = useSelector((state: RootState) => state.auth.currentUser);


  const getTitle = () => {
    if (location.pathname.startsWith("/admin")) return pageTitles["/admin"];
    for (const [path, title] of Object.entries(pageTitles)) {
      if (location.pathname.startsWith(path)) return title;
    }
    return "Dashboard";
  };

  return (
    <header className="sticky top-0 z-30 bg-white border-b border-border h-16 flex items-center px-4 lg:px-6 gap-4 shrink-0">
      <button onClick={onMenuClick} className="lg:hidden text-muted-foreground hover:text-foreground">
        <Menu className="w-5 h-5" />
      </button>

      <h1 className="text-lg font-semibold text-foreground truncate">{getTitle()}</h1>

      <div className="ml-auto flex items-center gap-3">
        <div className="hidden md:flex items-center gap-2 bg-muted rounded-lg px-3 py-2 text-sm text-muted-foreground w-64">
          <Search className="w-4 h-4 shrink-0" />
          <input
            type="text"
            placeholder="Search for users..."
            className="w-full pr-4 text-sm bg-white border border-slate-200 rounded-lg outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-400 transition-all"
          />
        </div>

        <button className="relative p-2 rounded-lg hover:bg-muted transition-colors">
          <Bell className="w-5 h-5 text-muted-foreground" />
          <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-blue-600 rounded-full" />
        </button>

        <div className="flex items-center gap-2 pl-3 border-l border-border">
          <div className="w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center">
            <User className="w-4 h-4 text-white" />
          </div>
          <div className="hidden sm:block">
            <p className="text-sm font-medium text-foreground leading-none">{currentUser?.fullName}</p>
            <p className="text-xs text-muted-foreground">{currentUser?.role}</p>
          </div>
        </div>
      </div>
    </header>
  );
}