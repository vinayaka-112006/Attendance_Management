import { Outlet } from "react-router-dom";
import Navbar from "../components/Navbar";
import Sidebar from "../components/Sidebar";

export default function AppLayout() {
  return (
    <div className="page-shell">
      <Navbar />
      <div className="md:flex">
        <Sidebar />
        <main className="flex-1 p-4 md:p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
