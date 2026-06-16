import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import Button from "../components/Button";
import FormInput from "../components/FormInput";
import ThemeToggle from "../components/ThemeToggle";
import { useAuth } from "../context/AuthContext";

export default function Login() {
  const [email, setEmail] = useState("admin@attendease.local");
  const [password, setPassword] = useState("Admin@123");
  const [error, setError] = useState("");
  const { login, loading } = useAuth();
  const navigate = useNavigate();

  const submit = async (event) => {
    event.preventDefault();
    setError("");
    try {
      const user = await login(email, password);
      navigate(user.role === "ADMIN" ? "/admin" : user.role === "FACULTY" ? "/faculty" : "/student");
    } catch {
      setError("Invalid login. Check your email and password.");
    }
  };

  return (
    <main className="auth-shell grid lg:grid-cols-[0.95fr_1.05fr]">
      <section className="auth-visual">
        <div className="auth-visual-frame">
          <img className="auth-visual-image" src="/assets/auth-attendance-login.png" alt="Secure attendance analytics dashboard" />
        </div>
      </section>
      <section className="grid place-items-center px-4 py-10">
        <div className="w-full max-w-md">
          <div className="mb-4 flex justify-end"><ThemeToggle /></div>
          <form onSubmit={submit} className="panel p-7">
            <p className="text-sm font-semibold text-brand">AttendEase</p>
            <h2 className="mt-2 text-3xl font-bold">Welcome back</h2>
            <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">Sign in to continue to your dashboard.</p>
            <div className="mt-6 space-y-4">
              <FormInput label="Email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} />
              <FormInput label="Password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
              {error && <p className="rounded-md bg-red-50 px-3 py-2 text-sm text-red-700 dark:bg-red-950/50 dark:text-red-300">{error}</p>}
              <Button className="w-full" disabled={loading}>{loading ? "Signing in..." : "Login"}</Button>
              <p className="text-center text-sm text-slate-600 dark:text-slate-400">
                New here? <Link className="font-semibold text-brand" to="/register">Create an account</Link>
              </p>
            </div>
          </form>
        </div>
      </section>
    </main>
  );
}
