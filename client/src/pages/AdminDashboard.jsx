import DataTable from "../components/DataTable";
import StatCard from "../components/StatCard";
import { useFetch } from "../hooks/useFetch";
import { useEffect, useState } from "react";
import FormInput from "../components/FormInput";
import Button from "../components/Button";
import { api } from "../api/client";

export default function AdminDashboard() {
  const { data, reload } = useFetch("/dashboard/admin", {});
  const [threshold, setThreshold] = useState(75);
  const [message, setMessage] = useState("");

  useEffect(() => {
    if (data.threshold) setThreshold(data.threshold);
  }, [data.threshold]);

  const saveThreshold = async (event) => {
    event.preventDefault();
    setMessage("");
    await api.put("/dashboard/threshold", { threshold: Number(threshold) });
    setMessage("Threshold updated");
    reload();
  };

  return (
    <section className="space-y-6">
      <div>
        <p className="text-sm font-semibold text-brand">Admin workspace</p>
        <h1 className="mt-1 text-2xl font-bold">Dashboard</h1>
        <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">Monitor attendance health, defaulters, and campus activity.</p>
      </div>
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-5">
        <StatCard label="Total students" value={data.totalStudents ?? 0} />
        <StatCard label="Today's attendance" value={`${data.todayAttendancePercentage ?? 0}%`} tone="green" />
        <StatCard label="Active defaulters" value={data.activeDefaulters ?? 0} tone="red" />
        <StatCard label="Subjects" value={data.subjectCount ?? 0} />
        <StatCard label="Threshold" value={`${data.threshold ?? 75}%`} tone="amber" />
      </div>
      <form onSubmit={saveThreshold} className="panel grid gap-4 p-5 sm:grid-cols-[220px_auto_1fr]">
        <FormInput label="Attendance threshold (%)" type="number" min="1" max="100" value={threshold} onChange={(e) => setThreshold(e.target.value)} />
        <Button className="self-end">Update</Button>
        {message && <p className="self-end rounded-md bg-emerald-50 px-3 py-2 text-sm text-emerald-700">{message}</p>}
      </form>
      <div>
        <h2 className="mb-3 text-lg font-semibold">Recent activity</h2>
        <DataTable columns={[
          { key: "activity", header: "Activity", render: (r) => formatActivity(r) },
          { key: "user", header: "Done by", render: (r) => r.user?.email || "System" },
          { key: "createdAt", header: "When", render: (r) => formatTime(r.createdAt) }
        ]} rows={data.recentActivity || []} />
      </div>
    </section>
  );
}

const actionLabels = {
  CREATE: "created",
  UPDATE: "updated",
  DELETE: "deleted",
  CORRECT: "corrected",
  REGISTER: "registered",
  BULK_IMPORT: "imported",
  SEED: "prepared"
};

const entityLabels = {
  User: "a user account",
  Student: "a student profile",
  Faculty: "a faculty profile",
  Subject: "a subject",
  Section: "a section",
  Attendance: "attendance",
  AppSetting: "attendance settings",
  Database: "sample data"
};

function formatActivity(row) {
  const action = actionLabels[row.action] || row.action?.toLowerCase() || "changed";
  const entity = entityLabels[row.entity] || row.entity || "record";

  if (row.entity === "AppSetting") return "Updated attendance threshold";
  if (row.action === "REGISTER") return `Registered ${row.entity?.toLowerCase() || "account"}`;
  if (row.action === "BULK_IMPORT") return "Imported students from CSV";

  return `${capitalize(action)} ${entity}`;
}

function formatTime(value) {
  if (!value) return "-";
  return new Intl.DateTimeFormat(undefined, {
    dateStyle: "medium",
    timeStyle: "short"
  }).format(new Date(value));
}

function capitalize(value) {
  return value ? value.charAt(0).toUpperCase() + value.slice(1) : "";
}
