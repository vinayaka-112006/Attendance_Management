import DataTable from "../components/DataTable";
import StatCard from "../components/StatCard";
import { useFetch } from "../hooks/useFetch";

export default function FacultyDashboard() {
  const { data } = useFetch("/dashboard/faculty", {});
  return (
    <section className="space-y-6">
      <div>
        <p className="text-sm font-semibold text-brand">Faculty workspace</p>
        <h1 className="mt-1 text-2xl font-bold">Dashboard</h1>
        <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">Review today’s assigned classes and marking progress.</p>
      </div>
      <div className="grid gap-4 sm:grid-cols-2">
        <StatCard label="Today's classes" value={data.todayClasses?.length || 0} />
        <StatCard label="Marked today" value={data.markedToday || 0} tone={data.markedToday ? "green" : "amber"} />
      </div>
      <DataTable columns={[
        { key: "code", header: "Code" },
        { key: "name", header: "Subject" },
        { key: "section", header: "Section", render: (r) => r.section?.name },
        { key: "semester", header: "Semester" }
      ]} rows={data.todayClasses || []} />
    </section>
  );
}
