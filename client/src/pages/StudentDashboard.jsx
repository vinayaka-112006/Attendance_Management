import DataTable from "../components/DataTable";
import StatCard from "../components/StatCard";
import { useFetch } from "../hooks/useFetch";

export default function StudentDashboard() {
  const { data } = useFetch("/dashboard/student", {});
  const atRisk = data.subjectSummaries?.filter((item) => item.risk).length || 0;
  return (
    <section className="space-y-6">
      <div>
        <p className="text-sm font-semibold text-brand">Student workspace</p>
        <h1 className="mt-1 text-2xl font-bold">Dashboard</h1>
        <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">Track your attendance percentage and risk flags by subject.</p>
      </div>
      <div className="grid gap-4 sm:grid-cols-3">
        <StatCard label="Overall attendance" value={`${data.overall?.attendancePercentage ?? 0}%`} tone={data.overall?.defaulter ? "red" : "green"} />
        <StatCard label="Threshold" value={`${data.threshold || 75}%`} />
        <StatCard label="Risk flags" value={atRisk} tone={atRisk ? "red" : "green"} />
      </div>
      <DataTable columns={[
        { key: "subject", header: "Subject", render: (r) => r.subject.name },
        { key: "totalClasses", header: "Classes" },
        { key: "classesAttended", header: "Attended" },
        { key: "attendancePercentage", header: "Percentage", render: (r) => `${r.attendancePercentage}%` },
        { key: "canMiss", header: "Can miss" },
        { key: "risk", header: "Risk", render: (r) => r.risk ? "Below threshold" : "OK" }
      ]} rows={data.subjectSummaries || []} />
    </section>
  );
}
