import { useState } from "react";
import { api } from "../api/client";
import Button from "../components/Button";
import DataTable from "../components/DataTable";
import FormInput from "../components/FormInput";
import { useAuth } from "../context/AuthContext";
import { useFetch } from "../hooks/useFetch";

export default function ReportsPage() {
  const { user } = useAuth();
  const [filters, setFilters] = useState({});
  const [rows, setRows] = useState([]);
  const canFilterPeople = user?.role === "ADMIN" || user?.role === "FACULTY";
  const { data: students } = useFetch(canFilterPeople ? "/students" : null, []);
  const { data: subjects } = useFetch("/subjects", []);
  const { data: sections } = useFetch(canFilterPeople ? "/sections" : null, []);

  const load = async () => {
    const res = await api.get("/reports", { params: filters });
    setRows(res.data);
  };

  const exportFile = async (type) => {
    const res = await api.get(`/reports/export/${type}`, { params: filters, responseType: "blob" });
    const url = URL.createObjectURL(res.data);
    const link = document.createElement("a");
    link.href = url;
    link.download = `attendance-report.${type === "excel" ? "xlsx" : "pdf"}`;
    link.click();
    URL.revokeObjectURL(url);
  };

  return (
    <section className="space-y-5">
      <h1 className="text-2xl font-bold">Reports</h1>
      <div className="panel grid gap-4 p-4 md:grid-cols-3">
        {canFilterPeople && <SelectFilter label="Student" value={filters.studentId || ""} onChange={(value) => setFilters({ ...filters, studentId: value })} options={students.map((student) => ({ value: student.id, label: `${student.rollNo} - ${student.name}` }))} />}
        <SelectFilter label="Subject" value={filters.subjectId || ""} onChange={(value) => setFilters({ ...filters, subjectId: value })} options={subjects.map((subject) => ({ value: subject.id, label: `${subject.code} - ${subject.name}` }))} />
        {canFilterPeople && <SelectFilter label="Section" value={filters.sectionId || ""} onChange={(value) => setFilters({ ...filters, sectionId: value })} options={sections.map((section) => ({ value: section.id, label: `${section.name} - ${section.department}` }))} />}
        <FormInput label="From" type="date" value={filters.from || ""} onChange={(e) => setFilters({ ...filters, from: e.target.value })} />
        <FormInput label="To" type="date" value={filters.to || ""} onChange={(e) => setFilters({ ...filters, to: e.target.value })} />
        <div className="flex items-end gap-2">
          <Button onClick={load}>Apply</Button>
          <Button variant="secondary" onClick={() => exportFile("excel")}>Excel</Button>
          <Button variant="secondary" onClick={() => exportFile("pdf")}>PDF</Button>
        </div>
      </div>
      <DataTable columns={[
        { key: "student", header: "Student" },
        { key: "rollNo", header: "Roll No" },
        { key: "subject", header: "Subject" },
        { key: "totalClasses", header: "Classes" },
        { key: "classesAttended", header: "Attended" },
        { key: "attendancePercentage", header: "Percentage", render: (r) => `${r.attendancePercentage}%` },
        { key: "defaulter", header: "Defaulter", render: (r) => r.defaulter ? "Yes" : "No" }
      ]} rows={rows} />
    </section>
  );
}

function SelectFilter({ label, value, onChange, options }) {
  return (
    <label className="block">
      <span className="field-label">{label}</span>
      <select className="field-input" value={value} onChange={(e) => onChange(e.target.value)}>
        <option value="">All {label.toLowerCase()}s</option>
        {options.map((option) => <option key={option.value} value={option.value}>{option.label}</option>)}
      </select>
    </label>
  );
}
