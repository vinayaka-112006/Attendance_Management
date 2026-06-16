import { useState } from "react";
import { api } from "../api/client";
import Button from "../components/Button";
import DataTable from "../components/DataTable";
import FormInput from "../components/FormInput";
import { useFetch } from "../hooks/useFetch";

export default function AttendancePage() {
  const [subjectId, setSubjectId] = useState("");
  const [date, setDate] = useState(new Date().toISOString().slice(0, 10));
  const [roster, setRoster] = useState([]);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const { data: subjects } = useFetch("/subjects", []);

  const loadRoster = async () => {
    setError("");
    try {
      const res = await api.get("/attendance/roster", { params: { subjectId, date } });
      setRoster(res.data.map((item) => ({ ...item, status: item.attendance?.status || "ABSENT" })));
    } catch (err) {
      setError(err.response?.data?.message || "Could not load roster.");
    }
  };

  const save = async () => {
    setError("");
    try {
      await api.post("/attendance", {
        subjectId,
        date,
        entries: roster.filter((row) => !row.attendance).map((row) => ({ studentId: row.id, status: row.status }))
      });
      setMessage("Attendance saved");
      loadRoster();
    } catch (err) {
      setError(err.response?.data?.message || "Could not save attendance.");
    }
  };

  const bulkPresent = () => setRoster(roster.map((row) => ({ ...row, status: "PRESENT" })));

  return (
    <section className="space-y-5">
      <h1 className="text-2xl font-bold">Mark attendance</h1>
      <div className="panel grid gap-4 p-4 md:grid-cols-[1fr_220px_auto_auto]">
        <label className="block">
          <span className="field-label">Subject</span>
          <select className="field-input" value={subjectId} onChange={(e) => setSubjectId(e.target.value)} required>
            <option value="">Select subject</option>
            {subjects.map((subject) => (
              <option key={subject.id} value={subject.id}>
                {subject.code} - {subject.name} ({subject.section?.name})
              </option>
            ))}
          </select>
        </label>
        <FormInput label="Date" type="date" value={date} onChange={(e) => setDate(e.target.value)} />
        <Button className="self-end" type="button" onClick={loadRoster} disabled={!subjectId}>Load roster</Button>
        <Button className="self-end" type="button" variant="secondary" onClick={bulkPresent}>All present</Button>
      </div>
      {error && <p className="rounded-md bg-red-50 px-3 py-2 text-sm text-red-700">{error}</p>}
      {message && <p className="rounded-md bg-emerald-50 px-3 py-2 text-sm text-emerald-700">{message}</p>}
      <DataTable columns={[
        { key: "rollNo", header: "Roll No" },
        { key: "name", header: "Name" },
        { key: "status", header: "Status", render: (row) => row.attendance ? row.attendance.status : (
          <select className="rounded-md border border-slate-300 px-2 py-1 dark:border-slate-700 dark:bg-slate-950" value={row.status} onChange={(e) => setRoster(roster.map((item) => item.id === row.id ? { ...item, status: e.target.value } : item))}>
            <option value="PRESENT">Present</option>
            <option value="ABSENT">Absent</option>
            <option value="LATE">Late</option>
          </select>
        ) }
      ]} rows={roster} />
      {!!roster.length && <Button onClick={save}>Save attendance</Button>}
    </section>
  );
}
