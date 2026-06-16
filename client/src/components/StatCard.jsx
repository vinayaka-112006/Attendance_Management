export default function StatCard({ label, value, tone = "blue" }) {
  const tones = {
    blue: "bg-blue-50 text-blue-700 dark:bg-blue-950/50 dark:text-blue-300",
    green: "bg-emerald-50 text-emerald-700 dark:bg-emerald-950/50 dark:text-emerald-300",
    red: "bg-red-50 text-red-700 dark:bg-red-950/50 dark:text-red-300",
    amber: "bg-amber-50 text-amber-700 dark:bg-amber-950/50 dark:text-amber-300"
  };
  return (
    <div className="panel p-5 transition hover:-translate-y-0.5">
      <p className="text-sm font-medium text-slate-500 dark:text-slate-400">{label}</p>
      <p className={`mt-3 inline-block rounded-md px-3 py-1 text-2xl font-bold ${tones[tone]}`}>{value}</p>
    </div>
  );
}
