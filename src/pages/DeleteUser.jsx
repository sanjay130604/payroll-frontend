import { useEffect, useState } from "react";
import axios from "../utils/axiosConfig";
import AdminNavbar from "../components/AdminNavbar";
import { motion } from "framer-motion";
import { Trash2, AlertTriangle, Search } from "lucide-react";

export default function DeleteUser() {
  const [users, setUsers] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    const res = await axios.get("/users/all");
    if (res.data.success) setUsers(res.data.users);
  };

  const remove = async (row) => {
    if (!window.confirm("Are you sure? This will permanently delete the user and cannot be undone.")) return;
    await axios.post("/users/delete", { row });
    fetchUsers();
  };

  const filteredUsers = users.filter(u =>
    u.firstName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    u.lastName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    u.email?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-slate-50 animate-in fade-in duration-500">
      <AdminNavbar />

      <div className="max-w-7xl mx-auto px-6 py-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-2xl shadow-card border border-slate-100 overflow-hidden"
        >
          {/* HEADER */}
          <div className="px-8 py-6 border-b border-slate-100 flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-red-50/30">
            <div>
              <h2 className="text-2xl font-bold text-slate-900 flex items-center gap-2">
                <AlertTriangle className="text-red-500" size={24} />
                Delete Users
              </h2>
              <p className="text-slate-500 text-sm mt-1">
                Permanently remove user accounts from the system
              </p>
            </div>

            <div className="relative w-full md:w-72">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
              <input
                type="text"
                placeholder="Search users..."
                className="w-full pl-10 pr-4 py-2 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-red-500/20 focus:border-red-500 transition-all bg-white"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>

          {/* TABLE */}
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left">
              <thead className="bg-slate-50 text-slate-700 border-b border-slate-100">
                <tr>
                  {["ID", "First Name", "Last Name", "Email Address", "Last Updated", "Action"].map(h => (
                    <th key={h} className="px-6 py-4 font-semibold uppercase tracking-wider text-xs">
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>

              <tbody className="divide-y divide-slate-100">
                {filteredUsers.map(u => (
                  <tr
                    key={u.row}
                    className="hover:bg-red-50/30 transition-colors group"
                  >
                    <td className="px-6 py-4 font-medium text-slate-700">
                      {u.id || <span className="text-slate-400 italic">No ID</span>}
                    </td>
                    <td className="px-6 py-4 text-slate-600">{u.firstName}</td>
                    <td className="px-6 py-4 text-slate-600">{u.lastName}</td>
                    <td className="px-6 py-4 text-slate-600">{u.email}</td>
                    <td className="px-6 py-4 text-xs text-slate-400">
                      {u.updatedAt}
                    </td>
                    <td className="px-6 py-4">
                      <button
                        onClick={() => remove(u.row)}
                        className="flex items-center gap-2 px-4 py-2 text-sm rounded-lg bg-white border border-red-200 text-red-600 font-medium hover:bg-red-600 hover:text-white hover:border-red-600 transition-all shadow-sm"
                      >
                        <Trash2 size={16} />
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
                {filteredUsers.length === 0 && (
                  <tr>
                    <td colspan="6" className="px-6 py-12 text-center text-slate-400">
                      No users found matching "{searchTerm}"
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
