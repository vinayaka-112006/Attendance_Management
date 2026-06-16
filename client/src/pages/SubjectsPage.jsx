import ManagementPage from "./ManagementPage";
import { useAuth } from "../context/AuthContext";
import { useFetch } from "../hooks/useFetch";

export default function SubjectsPage() {
  const { user } = useAuth();
  const { data: faculty } = useFetch(user?.role === "ADMIN" ? "/faculty" : null, []);
  const { data: sections } = useFetch(user?.role === "ADMIN" ? "/sections" : null, []);
  return <ManagementPage
    title="Subjects"
    endpoint="/subjects"
    columns={[
      { key: "code", header: "Code" },
      { key: "name", header: "Name" },
      { key: "semester", header: "Semester" },
      { key: "faculty", header: "Faculty", render: (r) => r.faculty?.name },
      { key: "section", header: "Section", render: (r) => r.section?.name }
    ]}
    fields={[
      { name: "code", label: "Code" },
      { name: "name", label: "Name" },
      { name: "semester", label: "Semester", type: "number" },
      {
        name: "facultyId",
        label: "Teacher",
        options: faculty.map((item) => ({ value: item.id, label: `${item.name} (${item.employeeId})` }))
      },
      {
        name: "sectionId",
        label: "Section",
        options: sections.map((item) => ({ value: item.id, label: `${item.name} - ${item.department}` }))
      }
    ]}
    canCreate={user?.role === "ADMIN"}
  />;
}
