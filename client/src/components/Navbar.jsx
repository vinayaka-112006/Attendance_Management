import { LogOut } from "lucide-react";
import { useAuth } from "../context/AuthContext";
import Button from "./Button";
import ThemeToggle from "./ThemeToggle";

export default function Navbar() {
  const { user, logout } = useAuth();
  return (
    <header className="sticky top-0 z-20 border-b border-slate-200 bg-white/90 backdrop-blur dark:border-violet-900/50 dark:bg-[#070914]/90">
      <div className="flex h-16 items-center justify-between px-4 md:px-6">
        <div>
          <p className="text-lg font-bold text-slate-950 dark:text-white">AttendEase</p>
          <p className="text-xs text-slate-500 dark:text-slate-400">{user?.email} · {user?.role}</p>
        </div>
        <div className="flex items-center gap-2">
          <ThemeToggle />
          <Button variant="secondary" onClick={logout}><LogOut size={16} /> Logout</Button>
        </div>
      </div>
    </header>
  );
}
