export default function Button({ children, className = "", variant = "primary", ...props }) {
  const styles = variant === "secondary"
    ? "bg-white text-slate-800 border border-slate-300 hover:bg-slate-50 dark:bg-[#0b1022] dark:text-slate-100 dark:border-violet-900/70 dark:hover:bg-violet-950/40"
    : "bg-brand text-white hover:bg-blue-700 shadow-sm shadow-blue-600/20 dark:bg-violet-600 dark:hover:bg-violet-500 dark:shadow-violet-700/30";
  return <button className={`inline-flex items-center justify-center gap-2 rounded-md px-4 py-2 text-sm font-semibold transition disabled:opacity-50 ${styles} ${className}`} {...props}>{children}</button>;
}
