import DataTable from "../components/DataTable";
import { useFetch } from "../hooks/useFetch";

export default function NotificationsPage() {
  const { data } = useFetch("/notifications", []);
  return (
    <section className="space-y-5">
      <h1 className="text-2xl font-bold">Notifications</h1>
      <DataTable columns={[
        { key: "student", header: "Student", render: (r) => r.student?.name },
        { key: "type", header: "Type" },
        { key: "message", header: "Message" },
        { key: "deliveryStatus", header: "Delivery" },
        { key: "sentAt", header: "Sent", render: (r) => r.sentAt ? new Date(r.sentAt).toLocaleString() : "-" }
      ]} rows={data} />
    </section>
  );
}
