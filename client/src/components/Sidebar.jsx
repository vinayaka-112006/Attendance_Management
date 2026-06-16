import { BarChart3, Bell, BookOpen, CalendarCheck, GraduationCap, LayoutDashboard, Users } from "lucide-react";
import { NavLink } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const links = {
  ADMIN: [
    ["/admin", "Dashboard", LayoutDashboard],
    ["/students", "Students", GraduationCap],
    ["/faculty/manage", "Faculty", Users],
    ["/subjects", "Subjects", BookOpen],
    ["/sections", "Sections", Users],
    ["/attendance", "Attendance", CalendarCheck],
    ["/reports", "Reports", BarChart3],
    ["/notifications", "Notifications", Bell]
  ],
  FACULTY: [
    ["/faculty", "Dashboard", LayoutDashboard],
    ["/subjects", "Subjects", BookOpen],
    ["/attendance", "Attendance", CalendarCheck],
    ["/reports", "Reports", BarChart3]
  ],
  STUDENT: [
    ["/student", "Dashboard", LayoutDashboard],
    ["/reports", "Reports", BarChart3],
    ["/notifications", "Notifications", Bell]
  ]
};

export default function Sidebar() {
  const { user } = useAuth();
  return (
    <aside className="border-b border-slate-200 bg-white dark:border-violet-900/50 dark:bg-[#070914] md:min-h-[calc(100vh-4rem)] md:w-64 md:border-b-0 md:border-r">
      <nav className="flex gap-2 overflow-x-auto p-3 md:block">
        {(links[user?.role] || []).map(([to, label, Icon]) => (
          <NavLink key={to} to={to} className={({ isActive }) => `mb-1 flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition ${isActive ? "bg-blue-50 text-brand dark:bg-violet-950/70 dark:text-violet-200" : "text-slate-600 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-violet-950/30"}`}>
            <Icon size={17} /> {label}
          </NavLink>
        ))}
      </nav>
    </aside>
  );
}
