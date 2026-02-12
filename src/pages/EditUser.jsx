import { useEffect, useState } from "react";
import axios, { BASE_URL } from "../utils/axiosConfig";

import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { Save, Trash2, Edit2, Plus, Download, Upload, UserCog } from "lucide-react";

export default function EditUser() {
  const [users, setUsers] = useState([]);
  const [editingRow, setEditingRow] = useState(null);
  const [form, setForm] = useState({});
  const navigate = useNavigate();

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const res = await axios.get("/api/users/all");
      if (res.data?.users) setUsers(res.data.users);
    } catch (err) {
      console.error("Fetch users failed", err);
    }
  };

  const edit = (user) => {
    setEditingRow(user.row);
    setForm(user);
  };

  const save = async () => {
    if (!form.firstName || form.firstName.trim().length < 2)
      return alert("First Name must be at least 2 characters");

    if (!form.lastName || form.lastName.trim().length < 1)
      return alert("Last Name is required");

    if (!form.email || !form.email.includes("@"))
      return alert("Invalid email address");

    if (form.newPassword && form.newPassword.length < 5)
      return alert("Password must be at least 5 characters");

    try {
      await axios.put("/api/users/update", form);
      setEditingRow(null);
      fetchUsers();
    } catch (err) {
      alert(err.response?.data?.message || "Update failed");
    }
  };

  const remove = async (row) => {
    if (!window.confirm("Delete this user permanently?")) return;
    await axios.post("/api/users/delete", { row });
    fetchUsers();
  };

  return (
    <div className="min-h-screen bg-slate-50">


      <div className="max-w-7xl mx-auto px-6 py-10">
        <motion.div className="bg-white rounded-2xl shadow border overflow-hidden">
          <div className="px-8 py-6 border-b flex justify-between items-center">
            <div>
              <h2 className="text-xl font-bold flex gap-2">
                <UserCog /> Account Management
              </h2>
              <p className="text-sm text-slate-500">Edit or remove users</p>
            </div>

            <div className="flex gap-3">
              {/* ✅ FIXED TEMPLATE DOWNLOAD */}
              <button
                onClick={() =>
                  window.open(
                    `${BASE_URL}/api/users/template`,
                    "_blank"
                  )
                }
                className="px-4 py-2 border rounded-lg flex gap-2"
              >
                <Download size={16} /> Template
              </button>

              <button
                onClick={() => navigate("/admin/bulk-upload")}
                className="px-4 py-2 bg-slate-100 rounded-lg flex gap-2"
              >
                <Upload size={16} /> Bulk Upload
              </button>

              <button
                onClick={() => navigate("/admin/create-user")}
                className="px-5 py-2 bg-blue-600 text-white rounded-lg flex gap-2"
              >
                <Plus size={16} /> Add User
              </button>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-slate-50">
                <tr>
                  {["Employee ID", "First Name", "Last Name", "Email", "New Password", "Action"].map(h => (
                    <th key={h} className="px-6 py-3 text-left">{h}</th>
                  ))}
                </tr>
              </thead>

              <tbody>
                {users.map(u => (
                  <tr key={u.row} className="border-t">
                    <td className="px-6 py-3">{u.employeeId}</td>

                    {["firstName", "lastName", "email", "newPassword"].map(field => (
                      <td key={field} className="px-6 py-3">
                        {editingRow === u.row ? (
                          <input
                            value={form[field] || ""}
                            onChange={e =>
                              setForm({ ...form, [field]: e.target.value })
                            }
                            className="border px-2 py-1 rounded"
                          />
                        ) : field === "newPassword" ? (
                          "••••••"
                        ) : (
                          u[field]
                        )}
                      </td>
                    ))}

                    <td className="px-6 py-3 flex gap-2">
                      {editingRow === u.row ? (
                        <button onClick={save}><Save /></button>
                      ) : (
                        <button onClick={() => edit(u)}><Edit2 /></button>
                      )}
                      <button onClick={() => remove(u.row)}><Trash2 /></button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
