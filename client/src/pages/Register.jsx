import { Link, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { api } from "../api/client";
import Button from "../components/Button";
import FormInput from "../components/FormInput";
import ThemeToggle from "../components/ThemeToggle";

export default function Register() {
  const [form, setForm] = useState({ role: "STUDENT", semester: 1 });
  const [sections, setSections] = useState([]);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    api.get("/auth/register-sections")
      .then((res) => setSections(res.data))
      .catch(() => setSections([]));
  }, []);

  const update = (key, value) => setForm((current) => ({ ...current, [key]: value }));

  const submit = async (event) => {
    event.preventDefault();
    setError("");
    try {
      const res = await api.post("/auth/register", buildPayload(form));
      localStorage.setItem("attendease_token", res.data.token);
      localStorage.setItem("attendease_user", JSON.stringify(res.data.user));
      navigate(res.data.user.role === "ADMIN" ? "/admin" : res.data.user.role === "FACULTY" ? "/faculty" : "/student");
    } catch (err) {
      setError(formatApiError(err));
    }
  };

  return (
    <main className="auth-shell grid lg:grid-cols-[0.8fr_1.2fr]">
      <section className="auth-visual">
        <div className="auth-visual-frame">
          <img className="auth-visual-image" src="/assets/auth-attendance-register.png" alt="Role-based attendance registration dashboard" />
        </div>
      </section>
      <section className="grid place-items-center px-4 py-10">
        <div className="w-full max-w-2xl">
          <div className="mb-4 flex items-center justify-between">
            <Link className="text-sm font-semibold text-brand" to="/login">Back to login</Link>
            <ThemeToggle />
          </div>
          <form onSubmit={submit} className="panel p-7">
            <p className="text-sm font-semibold text-brand">Registration</p>
            <h2 className="mt-2 text-3xl font-bold">Create account</h2>
            <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">Choose your role and complete the required fields.</p>
            <div className="mt-6 grid gap-4 sm:grid-cols-2">
              <label className="block sm:col-span-2">
                <span className="field-label">Register as</span>
                <select className="field-input" value={form.role} onChange={(e) => update("role", e.target.value)}>
                  <option value="STUDENT">Student</option>
                  <option value="FACULTY">Teacher / Faculty</option>
                  <option value="ADMIN">Admin</option>
                </select>
              </label>
              <FormInput label="Email" type="email" value={form.email || ""} onChange={(e) => update("email", e.target.value)} required />
              <FormInput label="Password" type="password" value={form.password || ""} onChange={(e) => update("password", e.target.value)} required />
              {form.role !== "ADMIN" && <FormInput label="Name" value={form.name || ""} onChange={(e) => update("name", e.target.value)} required />}
              {form.role === "STUDENT" && <>
                <FormInput label="Roll No" value={form.rollNo || ""} onChange={(e) => update("rollNo", e.target.value)} required />
                <label className="block">
                  <span className="field-label">Section</span>
                  <select className="field-input" value={form.sectionId || ""} onChange={(e) => update("sectionId", e.target.value)} required>
                    <option value="">Select section</option>
                    {sections.map((section) => (
                      <option key={section.id} value={section.id}>
                        {section.name} - {section.department} {section.batchYear}
                      </option>
                    ))}
                  </select>
                </label>
                <FormInput label="Semester" type="number" min="1" value={form.semester || ""} onChange={(e) => update("semester", e.target.value)} required />
                <FormInput label="Photo URL" value={form.photoUrl || ""} onChange={(e) => update("photoUrl", e.target.value)} />
              </>}
              {form.role === "FACULTY" && <>
                <FormInput label="Department" value={form.department || ""} onChange={(e) => update("department", e.target.value)} required />
                <FormInput label="Employee ID" value={form.employeeId || ""} onChange={(e) => update("employeeId", e.target.value)} required />
              </>}
            </div>
            {error && <p className="mt-4 rounded-md bg-red-50 px-3 py-2 text-sm text-red-700 dark:bg-red-950/50 dark:text-red-300">{error}</p>}
            <Button className="mt-6 w-full">Register</Button>
          </form>
        </div>
      </section>
    </main>
  );
}

const buildPayload = (form) => {
  const base = { role: form.role, email: form.email, password: form.password };
  if (form.role === "ADMIN") return base;
  if (form.role === "FACULTY") return { ...base, name: form.name, department: form.department, employeeId: form.employeeId };
  return { ...base, name: form.name, rollNo: form.rollNo, sectionId: form.sectionId, semester: form.semester, photoUrl: form.photoUrl || "" };
};

const formatApiError = (err) => {
  const data = err.response?.data;
  const fieldErrors = data?.errors?.fieldErrors;
  if (fieldErrors) {
    return Object.entries(fieldErrors)
      .flatMap(([field, messages]) => messages.map((message) => `${field}: ${message}`))
      .join(" ");
  }
  return data?.message || "Registration failed. Check your details.";
};
