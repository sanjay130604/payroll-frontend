import { useEffect, useState } from "react";
import axios from "../utils/axiosConfig";

import ProfileModal from "../components/ProfileModal";
import { motion } from "framer-motion";
import { Upload, User, MapPin, Phone, Briefcase } from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function ProfileManagement() {
  const [employees, setEmployees] = useState([]);
  const [filteredEmployees, setFilteredEmployees] = useState([]);
  const [selected, setSelected] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const navigate = useNavigate();

  /* ================= LOAD PROFILES ================= */
  useEffect(() => {
    fetchProfiles();
  }, []);

  /* ================= SEARCH FILTER ================= */
  useEffect(() => {
    if (!searchTerm) {
      setFilteredEmployees(employees);
    } else {
      const term = searchTerm.toLowerCase();
      const filtered = employees.filter(e =>
        (e["frist name"] && e["frist name"].toLowerCase().includes(term)) ||
        (e["last name"] && e["last name"].toLowerCase().includes(term)) ||
        (e.email && e.email.toLowerCase().includes(term)) ||
        (e["employeeld"] && e["employeeld"].toLowerCase().includes(term))
      );
      setFilteredEmployees(filtered);
    }
  }, [searchTerm, employees]);

  /* ================= API CALL ================= */
  const fetchProfiles = async () => {
    try {
      const res = await axios.get("/api/profile/all"); // ✅ FIXED
      if (res.data.success && Array.isArray(res.data.data)) {
        setEmployees(res.data.data);
        setFilteredEmployees(res.data.data);
      } else {
        setEmployees([]);
        setFilteredEmployees([]);
      }
    } catch (err) {
      console.error("Failed to fetch profiles", err);
      setEmployees([]);
      setFilteredEmployees([]);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 animate-in fade-in duration-500">


      <div className="max-w-7xl mx-auto px-6 py-10">

        {/* ================= HEADER ================= */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-8 gap-4">
          <div>
            <h1 className="text-3xl font-bold text-slate-900 tracking-tight">
              Profile Management
            </h1>
            <p className="text-slate-500 mt-2 text-lg">
              View and manage detailed employee profiles
            </p>
          </div>

          <button
            onClick={() =>
              navigate("/admin/user-management/profile/bulk-upload")
            }
            className="flex items-center gap-2 bg-indigo-600 text-white px-5 py-2.5 rounded-xl hover:bg-indigo-700 transition shadow-lg shadow-indigo-500/20 font-medium"
          >
            <Upload size={18} />
            Bulk Upload Profiles
          </button>
        </div>

        {/* ================= SEARCH BAR (OPTIONAL) ================= */}
        {/*
        <div className="bg-white p-4 rounded-2xl shadow-sm border border-slate-100 mb-8 flex items-center gap-3">
          <Search className="text-slate-400" size={20} />
          <input 
            type="text" 
            placeholder="Search by name, email, or employee ID..." 
            className="flex-1 bg-transparent outline-none text-slate-700 placeholder:text-slate-400"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        */}

        {/* ================= GRID ================= */}
        {filteredEmployees.length === 0 ? (
          <div className="text-center py-20 bg-white rounded-2xl border border-dashed border-slate-200">
            <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-4 text-slate-400">
              <User size={32} />
            </div>
            <h3 className="text-lg font-semibold text-slate-700">
              No Profiles Found
            </h3>
            <p className="text-slate-500">
              Try adjusting your search or upload new profiles.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredEmployees.map((e, idx) => (
              <motion.div
                key={e.row || idx}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                whileHover={{
                  y: -4,
                  boxShadow: "0 10px 30px -10px rgba(0,0,0,0.1)"
                }}
                transition={{ duration: 0.2 }}
                onClick={() => setSelected(e)}
                className="bg-white rounded-2xl p-6 shadow-card border border-slate-100 cursor-pointer group hover:border-indigo-100 transition-all"
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-4">
                    <div className="h-14 w-14 rounded-full bg-gradient-to-br from-indigo-100 to-violet-100 text-indigo-600 flex items-center justify-center font-bold text-xl shadow-inner border border-white">
                      {e["frist name"]?.charAt(0)?.toUpperCase()}
                    </div>
                    <div>
                      <h3 className="font-bold text-slate-800 text-lg group-hover:text-indigo-600 transition-colors line-clamp-1">
                        {e["frist name"]} {e["last name"]}
                      </h3>
                      <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
                        {e["employeeld"] || "No ID"}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="space-y-2.5">
                  <div className="flex items-center gap-2 text-sm text-slate-600">
                    <Briefcase size={14} className="text-slate-400" />
                    <span className="truncate">
                      {e.designation || "No Designation"}
                    </span>
                  </div>

                  <div className="flex items-center gap-2 text-sm text-slate-600">
                    <Phone size={14} className="text-slate-400" />
                    <span className="truncate">{e.phone || "-"}</span>
                  </div>

                  <div className="flex items-center gap-2 text-sm text-slate-600">
                    <MapPin size={14} className="text-slate-400" />
                    <span className="truncate">{e.city || "-"}</span>
                  </div>
                </div>

                <div className="mt-6 pt-4 border-t border-slate-50 flex justify-end">
                  <span className="text-xs font-medium text-indigo-600 group-hover:underline">
                    View Full Profile →
                  </span>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>

      {/* ================= PROFILE MODAL ================= */}
      {selected && (
        <ProfileModal
          employee={selected}
          onClose={() => setSelected(null)}
          onSaved={fetchProfiles}
        />
      )}
    </div>
  );
}
