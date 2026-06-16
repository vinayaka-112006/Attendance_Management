import { Navigate, Route, Routes } from "react-router-dom";
import ProtectedRoute from "./components/ProtectedRoute";
import AppLayout from "./layouts/AppLayout";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Unauthorized from "./pages/Unauthorized";
import AdminDashboard from "./pages/AdminDashboard";
import FacultyDashboard from "./pages/FacultyDashboard";
import StudentDashboard from "./pages/StudentDashboard";
import StudentsPage from "./pages/StudentsPage";
import FacultyPage from "./pages/FacultyPage";
import SubjectsPage from "./pages/SubjectsPage";
import SectionsPage from "./pages/SectionsPage";
import AttendancePage from "./pages/AttendancePage";
import ReportsPage from "./pages/ReportsPage";
import NotificationsPage from "./pages/NotificationsPage";

export default function App() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/unauthorized" element={<Unauthorized />} />
      <Route element={<ProtectedRoute />}>
        <Route element={<AppLayout />}>
          <Route path="/" element={<RoleHome />} />
          <Route path="/admin" element={<ProtectedRoute roles={["ADMIN"]}><AdminDashboard /></ProtectedRoute>} />
          <Route path="/faculty" element={<ProtectedRoute roles={["FACULTY"]}><FacultyDashboard /></ProtectedRoute>} />
          <Route path="/student" element={<ProtectedRoute roles={["STUDENT"]}><StudentDashboard /></ProtectedRoute>} />
          <Route path="/students" element={<ProtectedRoute roles={["ADMIN"]}><StudentsPage /></ProtectedRoute>} />
          <Route path="/faculty/manage" element={<ProtectedRoute roles={["ADMIN"]}><FacultyPage /></ProtectedRoute>} />
          <Route path="/subjects" element={<ProtectedRoute roles={["ADMIN", "FACULTY"]}><SubjectsPage /></ProtectedRoute>} />
          <Route path="/sections" element={<ProtectedRoute roles={["ADMIN"]}><SectionsPage /></ProtectedRoute>} />
          <Route path="/attendance" element={<ProtectedRoute roles={["ADMIN", "FACULTY"]}><AttendancePage /></ProtectedRoute>} />
          <Route path="/reports" element={<ProtectedRoute roles={["ADMIN", "FACULTY", "STUDENT"]}><ReportsPage /></ProtectedRoute>} />
          <Route path="/notifications" element={<ProtectedRoute roles={["ADMIN", "STUDENT"]}><NotificationsPage /></ProtectedRoute>} />
        </Route>
      </Route>
    </Routes>
  );
}

function RoleHome() {
  const user = JSON.parse(localStorage.getItem("attendease_user") || "null");
  const target = user?.role === "ADMIN" ? "/admin" : user?.role === "FACULTY" ? "/faculty" : "/student";
  return <Navigate to={target} replace />;
}
