import { useState } from "react";
import axios from "../utils/axiosConfig";
import AdminNavbar from "../components/AdminNavbar";

export default function CreateUser() {
  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    employeeId: "",
    email: "",
    password: "",
    confirmPassword: ""
  });

  const [msg, setMsg] = useState("");
  const [loading, setLoading] = useState(false);

  const submit = async () => {
    setMsg("");

    if (Object.values(form).some(v => !v.trim())) {
      return setMsg("All fields are required");
    }

    if (!form.employeeId.toUpperCase().startsWith("EMP")) {
      return setMsg("Employee ID must start with EMP");
    }

    if (form.password.length < 5) {
      return setMsg("Password must be at least 5 characters");
    }

    if (form.password !== form.confirmPassword) {
      return setMsg("Passwords do not match");
    }

    setLoading(true);
    try {
      const res = await axios.post("/api/users/create", {
        firstName: form.firstName.trim(),
        lastName: form.lastName.trim(),
        employeeId: form.employeeId.trim(),
        email: form.email.trim(),
        password: form.password,
        confirmPassword: form.confirmPassword
      });

      setMsg(res.data.message || "User created successfully");
      setForm({
        firstName: "",
        lastName: "",
        employeeId: "",
        email: "",
        password: "",
        confirmPassword: ""
      });
    } catch (err) {
      setMsg(err.response?.data?.message || "Creation failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50">
      <AdminNavbar />

      <div className="max-w-4xl mx-auto px-4 py-10">
        <div className="bg-white rounded-2xl shadow-lg overflow-hidden">

          {/* Header */}
          <div className="bg-gradient-to-r from-slate-900 to-slate-800 px-8 py-6">
            <h2 className="text-2xl font-semibold text-white">
              Create New User
            </h2>
            <p className="text-slate-300 text-sm mt-1">
              Add a new employee to the system
            </p>
          </div>

          {/* Form */}
          <div className="p-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

              <FormInput
                label="First Name"
                value={form.firstName}
                onChange={e => setForm({ ...form, firstName: e.target.value })}
              />

              <FormInput
                label="Last Name"
                value={form.lastName}
                onChange={e => setForm({ ...form, lastName: e.target.value })}
              />

              <FormInput
                label="Employee ID"
                value={form.employeeId}
                onChange={e => setForm({ ...form, employeeId: e.target.value })}
              />

              <FormInput
                label="Email"
                value={form.email}
                onChange={e => setForm({ ...form, email: e.target.value })}
              />

              <FormInput
                label="Password"
                type="password"
                value={form.password}
                onChange={e => setForm({ ...form, password: e.target.value })}
              />

              <FormInput
                label="Confirm Password"
                type="password"
                value={form.confirmPassword}
                onChange={e =>
                  setForm({ ...form, confirmPassword: e.target.value })
                }
              />
            </div>

            {msg && (
              <p className="mt-4 text-sm text-red-600">
                {msg}
              </p>
            )}

            <div className="flex justify-end mt-8">
              <button
                onClick={submit}
                disabled={loading}
                className="px-8 py-3 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-xl transition disabled:opacity-60"
              >
                {loading ? "Creating..." : "Create User Account"}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ---------- Reusable Input ---------- */
function FormInput({ label, type = "text", value, onChange }) {
  return (
    <div>
      <label className="block text-sm font-medium text-slate-700 mb-1">
        {label}
      </label>
      <input
        type={type}
        value={value}
        onChange={onChange}
        className="w-full px-4 py-2.5 border border-slate-200 rounded-xl bg-slate-50
                   focus:outline-none focus:ring-2 focus:ring-blue-500"
      />
    </div>
  );
}
