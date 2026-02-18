import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "../utils/axiosConfig";
import {
  Calendar,
  CheckCircle,
  FileText
} from "lucide-react";

/* ================= MONTHS ================= */
const ALL_MONTHS = [
  "January", "February", "March", "April",
  "May", "June", "July", "August",
  "September", "October", "November", "December"
];

const MONTH_MAP = {
  "01": "January",
  "02": "February",
  "03": "March",
  "04": "April",
  "05": "May",
  "06": "June",
  "07": "July",
  "08": "August",
  "09": "September",
  "10": "October",
  "11": "November",
  "12": "December",
};

export default function SalaryHistory() {
  const navigate = useNavigate();
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchYear, setSearchYear] = useState("2026");
  const [searchMonth, setSearchMonth] = useState("");
  const [hasSearched, setHasSearched] = useState(false);

  const email = localStorage.getItem("userEmail");

  /* ================= FETCH ================= */
  const fetchSalaryHistory = async (year = "", month = "") => {
    if (!email) return;

    setLoading(true);
    try {
      const res = await axios.get("/api/payroll/history", {
        params: { email, year }
      });

      const backendHistory = res.data.history || {};
      const map = {};

      backendHistory.forEach(item => {
        map[item.month] = item; // month name
      });

      const displayMonths = month
        ? [MONTH_MAP[month]]
        : ALL_MONTHS;

      const fullHistory = displayMonths.map(mName => {
        return map[mName] || {
          month: mName,
          salary: null,
          salaryMonth: "",
          date: "-"
        };
      });

      setHistory(fullHistory);
    } catch (err) {
      console.error("Salary history fetch failed:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    setLoading(false);
  }, [email]);

  const handleSearch = () => {
    setHasSearched(true);
    fetchSalaryHistory(searchYear, searchMonth);
  };

  /* ================= UI ================= */
  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-slate-500 font-medium animate-pulse">
          Loading salary history...
        </div>
      </div>
    );
  }

  return (
    <div className="p-8 max-w-7xl mx-auto space-y-8 animate-in fade-in duration-500">

      {/* HEADER */}
      <div>
        <h1 className="text-2xl font-bold text-slate-800">
          Salary History
        </h1>
        <p className="text-slate-500 mt-1">
          View and download your monthly salary statements
        </p>
      </div>

      {/* SEARCH */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex flex-col md:flex-row items-end gap-4">
        <div className="flex-1 w-full space-y-2">
          <label className="text-sm font-semibold text-slate-600">Select Year</label>
          <select
            value={searchYear}
            onChange={(e) => setSearchYear(e.target.value)}
            className="w-full px-4 py-2.5 rounded-xl border bg-slate-50"
          >
            <option value="2024">2024</option>
            <option value="2025">2025</option>
            <option value="2026">2026</option>
            <option value="2027">2027</option>
          </select>
        </div>

        <div className="flex-1 w-full space-y-2">
          <label className="text-sm font-semibold text-slate-600">Select Month</label>
          <select
            value={searchMonth}
            onChange={(e) => setSearchMonth(e.target.value)}
            className="w-full px-4 py-2.5 rounded-xl border bg-slate-50"
          >
            <option value="">All Months</option>
            {ALL_MONTHS.map((m, i) => (
              <option key={m} value={String(i + 1).padStart(2, "0")}>
                {m}
              </option>
            ))}
          </select>
        </div>

        <button
          onClick={handleSearch}
          className="px-8 py-2.5 bg-slate-800 text-white font-semibold rounded-xl"
        >
          Search
        </button>
      </div>

      {/* GRID */}
      {hasSearched ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {history.map((m, index) => {
            const isGenerated = Boolean(m.salary || m.netPay);

            return (
              <div
                key={index}
                onClick={() =>
                  isGenerated &&
                  navigate(`/payslip/view/${email}/${m.salaryMonth}`)
                }
                className={`rounded-2xl p-6 border transition-all
                  ${isGenerated
                    ? "cursor-pointer hover:shadow-xl bg-white"
                    : "bg-slate-50 border-slate-100 opacity-60 cursor-not-allowed"
                  }
                `}
              >
                <div className="flex items-center gap-3 mb-4">
                  <Calendar size={20} />
                  <h2 className="font-bold text-lg">{m.month}</h2>
                  {isGenerated && (
                    <CheckCircle size={18} className="text-green-500 ml-auto" />
                  )}
                </div>

                {isGenerated ? (
                  <>
                    <p className="text-xs text-slate-400">Net Salary</p>
                    <p className="text-2xl font-bold">
                      ₹{Number(m.netPay || m.salary || 0).toLocaleString("en-IN")}
                    </p>
                  </>
                ) : (
                  <p className="text-slate-400 italic flex items-center gap-2">
                    <FileText size={16} /> Not Generated
                  </p>
                )}
              </div>
            );
          })}
        </div>
      ) : (
        <div className="flex items-center justify-center py-20 bg-slate-50 rounded-3xl border border-dashed">
          <p className="text-slate-500">
            Select a year and month to view salary history
          </p>
        </div>
      )}
    </div>
  );
}
