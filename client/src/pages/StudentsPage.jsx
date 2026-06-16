import { useRef } from "react";
import { api } from "../api/client";
import Button from "../components/Button";
import { useFetch } from "../hooks/useFetch";
import ManagementPage from "./ManagementPage";

export default function StudentsPage() {
  const inputRef = useRef(null);
  const { data: sections } = useFetch("/sections", []);
  const uploadCsv = async (event) => {
    const file = event.target.files?.[0];
    if (!file) return;
    const form = new FormData();
    form.append("file", file);
    await api.post("/students/bulk-import", form);
    window.location.reload();
  };

  return <ManagementPage
    title="Students"
    endpoint="/students"
    columns={[
      { key: "rollNo", header: "Roll No" },
      { key: "name", header: "Name" },
      { key: "section", header: "Section", render: (r) => r.section?.name },
      { key: "semester", header: "Semester" },
      { key: "email", header: "Email", render: (r) => r.user?.email }
    ]}
    fields={[
      { name: "email", label: "Email", type: "email" },
      { name: "password", label: "Password", type: "password" },
      { name: "rollNo", label: "Roll No" },
      { name: "name", label: "Name" },
      {
        name: "sectionId",
        label: "Section",
        options: sections.map((item) => ({ value: item.id, label: `${item.name} - ${item.department}` }))
      },
      { name: "semester", label: "Semester", type: "number" },
      { name: "photoUrl", label: "Photo URL", required: false }
    ]}
    extraActions={<>
      <input ref={inputRef} className="hidden" type="file" accept=".csv,text/csv" onChange={uploadCsv} />
      <Button variant="secondary" onClick={() => inputRef.current?.click()}>Import CSV</Button>
    </>}
  />;
}
