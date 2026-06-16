import ManagementPage from "./ManagementPage";

export default function FacultyPage() {
  return <ManagementPage
    title="Faculty"
    endpoint="/faculty"
    columns={[
      { key: "employeeId", header: "Employee ID" },
      { key: "name", header: "Name" },
      { key: "department", header: "Department" },
      { key: "email", header: "Email", render: (r) => r.user?.email }
    ]}
    fields={[
      { name: "email", label: "Email", type: "email" },
      { name: "password", label: "Password", type: "password" },
      { name: "employeeId", label: "Employee ID" },
      { name: "name", label: "Name" },
      { name: "department", label: "Department" }
    ]}
  />;
}
