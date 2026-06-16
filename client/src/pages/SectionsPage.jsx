import ManagementPage from "./ManagementPage";

export default function SectionsPage() {
  return <ManagementPage
    title="Sections"
    endpoint="/sections"
    columns={[
      { key: "name", header: "Name" },
      { key: "batchYear", header: "Batch" },
      { key: "department", header: "Department" },
      { key: "_count", header: "Students", render: (r) => r._count?.students || 0 }
    ]}
    fields={[
      { name: "name", label: "Name" },
      { name: "batchYear", label: "Batch Year", type: "number" },
      { name: "department", label: "Department" }
    ]}
  />;
}
