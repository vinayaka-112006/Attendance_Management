import { useState } from "react";
import { api } from "../api/client";
import Button from "../components/Button";
import DataTable from "../components/DataTable";
import FormInput from "../components/FormInput";
import Modal from "../components/Modal";
import { useFetch } from "../hooks/useFetch";

export default function ManagementPage({ title, endpoint, columns, fields, shapePayload = (v) => v, extraActions = null, canCreate = true }) {
  const { data, reload } = useFetch(endpoint, []);
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState({});
  const [error, setError] = useState("");

  const submit = async (event) => {
    event.preventDefault();
    setError("");
    try {
      await api.post(endpoint, shapePayload(form));
      setOpen(false);
      setForm({});
      reload();
    } catch (err) {
      setError(formatApiError(err));
    }
  };

  return (
    <section className="space-y-5">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h1 className="text-2xl font-bold">{title}</h1>
        <div className="flex flex-wrap gap-2">
          {extraActions}
          {canCreate && <Button onClick={() => setOpen(true)}>Add</Button>}
        </div>
      </div>
      <DataTable columns={columns} rows={data} />
      <Modal open={open} title={`Add ${title}`} onClose={() => setOpen(false)}>
        <form onSubmit={submit} className="grid gap-4 sm:grid-cols-2">
          {fields.map((field) => (
            field.options ? (
              <label className="block" key={field.name}>
                <span className="field-label">{field.label}</span>
                <select className="field-input" value={form[field.name] || ""} onChange={(e) => setForm({ ...form, [field.name]: e.target.value })} required={field.required !== false}>
                  <option value="">Select {field.label}</option>
                  {field.options.map((option) => <option key={option.value} value={option.value}>{option.label}</option>)}
                </select>
              </label>
            ) : (
              <FormInput key={field.name} label={field.label} type={field.type || "text"} value={form[field.name] || ""} onChange={(e) => setForm({ ...form, [field.name]: e.target.value })} required={field.required !== false} />
            )
          ))}
          {error && <p className="rounded-md bg-red-50 px-3 py-2 text-sm text-red-700 sm:col-span-2">{error}</p>}
          <Button className="sm:col-span-2">Save</Button>
        </form>
      </Modal>
    </section>
  );
}

const formatApiError = (err) => {
  const data = err.response?.data;
  const fieldErrors = data?.errors?.fieldErrors;
  if (fieldErrors) {
    return Object.entries(fieldErrors)
      .flatMap(([field, messages]) => messages.map((message) => `${formatFieldName(field)}: ${formatFieldMessage(message)}`))
      .join(" ");
  }
  return data?.message || "Save failed. Please check the form.";
};

const formatFieldName = (field) => {
  const labels = {
    batchYear: "Batch year",
    employeeId: "Employee ID",
    facultyId: "Teacher",
    photoUrl: "Photo URL",
    rollNo: "Roll number",
    sectionId: "Section",
    userId: "User"
  };

  return labels[field] || field.replace(/([A-Z])/g, " $1").replace(/^./, (letter) => letter.toUpperCase());
};

const formatFieldMessage = (message) => {
  if (!message) return "Please enter a valid value.";
  if (message === "Required") return "This field is required.";
  if (message.includes("String must contain at least 1 character")) return "This field is required.";
  if (message.includes("Number must be greater than 0")) return "Enter a number greater than 0.";
  if (message.includes("Expected number")) return "Enter a valid number.";
  if (message.includes("Invalid email")) return "Enter a valid email address.";
  if (message.includes("Invalid ObjectId")) return "Please select a valid option.";
  return message;
};
