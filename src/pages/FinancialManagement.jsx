import { useEffect, useState } from "react";
import axios from "../utils/axiosConfig";
import { useNavigate } from "react-router-dom";

import { Plus, Upload, Search, FileText, Edit, Eye, Filter, X } from "lucide-react";
import { calculateTotalWorkingDays, calculateProratedAmount } from "../utils/payrollHelper";

/* ================= CONSTANTS ================= */
const YEARS = Array.from({ length: 4 }, (_, i) => 2026 + i);

const MONTHS = [
  { label: "January", value: "01" },
  { label: "February", value: "02" },
  { label: "March", value: "03" },
  { label: "April", value: "04" },
  { label: "May", value: "05" },
  { label: "June", value: "06" },
  { label: "July", value: "07" },
  { label: "August", value: "08" },
  { label: "September", value: "09" },
  { label: "October", value: "10" },
  { label: "November", value: "11" },
  { label: "December", value: "12" }
];

/* ================= CREATE PAYROLL MODAL ================= */
function CreatePayrollModal({ open, onClose }) {
  const [form, setForm] = useState({
    salaryMonth: "",
    email: "",
    employeeId: "",
    firstName: "",
    lastName: "",
    workingDays: "",
    leavesAvailed: "",
    leavesUsed: "",
    totalLeaves: "",
    paidDays: "",
    remainingPaidLeaves: "",
    basic: "",
    hra: "",
    otherAllowance: "",
    specialPay: "",
    incentive: "",
    tds: "",
    otherDeductions: "",
    dateOfJoining: "",
    lopDays: ""
  });

  const [users, setUsers] = useState([]);
  const [fixations, setFixations] = useState([]); // ✅ Store pay fixation data
  const [selectedFixation, setSelectedFixation] = useState(null); // ✅ Original monthly values
  const [isAutofilled, setIsAutofilled] = useState(false);

  useEffect(() => {
    if (open) {
      fetchUsers();
      fetchFixations(); // ✅ Fetch on open
      setIsAutofilled(false);
      setForm(prev => ({ ...prev, email: "", employeeId: "", firstName: "", lastName: "", basic: "", incentive: "" }));
    }
  }, [open]);

  const fetchUsers = async () => {
    try {
      const res = await axios.get("/api/users/all");
      if (res.data.success) {
        setUsers(res.data.users);
      }
    } catch (err) {
      console.error("Failed to fetch users", err);
    }
  };

  const fetchFixations = async () => {
    try {
      const res = await axios.get("/api/finance/pay-fixation");
      if (res.data.success) {
        setFixations(res.data.list);
      }
    } catch (err) {
      console.error("Failed to fetch pay fixation", err);
    }
  };

  const handleUserSelect = (e) => {
    const selectedEmail = e.target.value;

    if (!selectedEmail) {
      setIsAutofilled(false);
      setForm(prev => ({ ...prev, email: "", employeeId: "", firstName: "", lastName: "", basic: "", incentive: "" }));
      return;
    }

    const user = users.find(u => u.email === selectedEmail);
    const fixation = fixations.find(f => f.email === selectedEmail || (user && f.employeeId === user.employeeId));

    if (user) {
      setIsAutofilled(true);
      setSelectedFixation(fixation || null);

      const basicVal = fixation ? fixation.basic : 0;
      const incentiveVal = fixation ? fixation.variablePay : 0;

      setForm(prev => {
        const workingDays = Number(prev.workingDays || 0);
        const paidDays = Number(prev.paidDays || 0);
        const basicVal = fixation ? Number(fixation.basic || 0) : 0;

        const totalBasic = workingDays > 0 ? calculateProratedAmount(basicVal, paidDays, workingDays) : basicVal;
        const hra = Math.round(totalBasic * 0.30);
        const tds = Math.round(totalBasic * 0.10);

        return {
          ...prev,
          email: user.email,
          employeeId: user.employeeId || "",
          firstName: user.firstName,
          lastName: user.lastName,
          basic: totalBasic || "",
          hra: hra || "",
          tds: tds || "",
          incentive: fixation ? fixation.variablePay : "",
          otherAllowance: "", // Will be fetched or manual
          specialPay: "", // Will be fetched or manual
          otherDeductions: 0
        };
      });
    }
  };

  // ✅ Auto-calculate when days change
  useEffect(() => {
    if (form.salaryMonth && /^\d{4}-\d{2}$/.test(form.salaryMonth)) {
      const [y, m] = form.salaryMonth.split("-").map(Number);
      const wd = calculateTotalWorkingDays(y, m);
      setForm(prev => ({ ...prev, workingDays: String(wd) }));
    }
  }, [form.salaryMonth]);

  useEffect(() => {
    const wd = Number(form.workingDays || 0);
    const lop = Number(form.lopDays || 0);
    const paidDays = Math.max(0, wd - lop);
    setForm(prev => ({ ...prev, paidDays: String(paidDays) }));
  }, [form.workingDays, form.lopDays]);

  useEffect(() => {
    if (selectedFixation) {
      const wd = Number(form.workingDays || 0);
      const pd = Number(form.paidDays || 0);
      const basicVal = Number(selectedFixation.basic || 0);

      const totalBasic = wd > 0 ? calculateProratedAmount(basicVal, pd, wd) : basicVal;
      const hra = Math.round(totalBasic * 0.30);
      const tds = Math.round(totalBasic * 0.10);

      setForm(prev => ({
        ...prev,
        basic: String(totalBasic),
        hra: String(hra),
        tds: String(tds),
        incentive: String(selectedFixation.variablePay || 0)
      }));
    }
  }, [form.workingDays, form.paidDays, selectedFixation]);

  // Fetch External Allowances
  useEffect(() => {
    const fetchExternalData = async () => {
      if (form.firstName && form.lastName) {
        try {
          // This endpoint should be implemented in backend to fetch from the new sheet
          const res = await axios.post("/api/finance/external-allowances", {
            firstName: form.firstName,
            lastName: form.lastName
          });
          if (res.data.success) {
            setForm(prev => ({
              ...prev,
              otherAllowance: String(res.data.otherAllowance || 0),
              specialPay: String(res.data.specialPay || 0)
            }));
          }
        } catch (err) {
          console.error("Failed to fetch external allowances", err);
        }
      }
    };
    fetchExternalData();
  }, [form.firstName, form.lastName]);

  const submit = async () => {
    const isNum = (v) => v !== "" && v !== null && !isNaN(v);
    const alphanumericRegex = /^[A-Z0-9]+$/i;

    if (!/^\d{4}-\d{2}$/.test(form.salaryMonth)) {
      alert("Salary Month must be YYYY-MM");
      return;
    }

    if (!String(form.email).toLowerCase().endsWith("@gmail.com")) {
      alert("Employee Email must be @gmail.com");
      return;
    }

    if (!String(form.employeeId).toUpperCase().startsWith("VTAB")) {
      alert("Employee ID must start with VTAB");
      return;
    }

    if ((form.firstName || "").trim().length < 2) {
      alert("First Name must be at least 2 letters");
      return;
    }

    if ((form.lastName || "").trim().length < 1) {
      alert("Last Name must be at least 1 letter");
      return;
    }


    if (!isNum(form.workingDays)) return alert("Working Days must be a number");
    if (!isNum(form.paidDays)) return alert("Paid Days must be a number");
    if (!isNum(form.lopDays)) return alert("LOP Days must be a number");
    if (!isNum(form.leavesAvailed)) return alert("Leaves Availed must be a number");
    if (!isNum(form.leavesUsed)) return alert("Leaves Used must be a number");
    if (!isNum(form.totalLeaves)) return alert("Total Leaves must be a number");
    if (!isNum(form.remainingPaidLeaves)) return alert("Balance Leaves must be a number");

    if (!isNum(form.basic)) return alert("Basic Salary must be a number");
    if (!isNum(form.hra)) return alert("HRA must be a number");
    if (!isNum(form.otherAllowance)) return alert("Other Allowance must be a number");
    if (!isNum(form.specialPay)) return alert("Special Pay must be a number");
    if (!isNum(form.incentive)) return alert("Incentive must be a number");
    if (!isNum(form.tds)) return alert("TDS must be a number");
    if (!isNum(form.otherDeductions)) return alert("Other Deductions must be a number");



    const netPay = (
      Number(form.basic || 0) +
      Number(form.hra || 0) +
      Number(form.otherAllowance || 0) +
      Number(form.specialPay || 0) +
      Number(form.incentive || 0)
    ) - Number(form.tds || 0);

    try {
      const res = await axios.post("/api/finance/create", { ...form, netPay });

      if (res.data?.success) {
        alert("Payroll created successfully");
        onClose();
        window.location.reload();
      } else {
        alert(res.data?.message || "Creation failed");
      }
    } catch (err) {
      console.error(err);
      alert(err.response?.data?.message || "Create payroll failed");
    }
  };


  //     if (res.data.success) {
  //       alert("Payroll created successfully");
  //       onClose();
  //       window.location.reload();
  //     } else {
  //       alert(res.data.message || "Creation failed");
  //     }
  //   } catch (err) {
  //     alert(err.response?.data?.message || "Create payroll failed");
  //   }
  // };

  const input = (name, label, type = "text", locked = false) => (
    <div>
      <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1 block">{label}</label>
      <input
        type={type}
        name={name}
        id={name}
        autoComplete="off"
        readOnly={locked}
        className={`w-full border rounded-lg px-3 py-2 text-sm focus:outline-none transition-all
          ${locked
            ? "bg-slate-100 text-slate-500 cursor-not-allowed border-slate-200"
            : "bg-white border-slate-200 focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 text-slate-700"}`}
        value={form[name] || ""}
        onChange={(e) => {
          if (locked) return;
          const val = e.target.value;
          setForm((prev) => ({ ...prev, [name]: val }));
        }}
      />
    </div>
  );

  if (!open) return null;

  return (
    <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm flex justify-center items-center z-50 animate-in fade-in duration-200">
      <div className="bg-white w-[900px] max-h-[90vh] overflow-y-auto rounded-2xl p-8 shadow-2xl animate-in slide-in-from-bottom-4 duration-300">
        <div className="flex justify-between items-center mb-8 border-b border-slate-100 pb-4">
          <div>
            <h3 className="text-2xl font-bold text-slate-800">Create New Payroll</h3>
            <p className="text-slate-500 text-sm">Fill in the details to generate a salary slip</p>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-slate-100 rounded-full transition-colors text-slate-400 hover:text-slate-600">
            <X size={24} />
          </button>
        </div>

        {/* USER SELECTION DROPDOWN */}
        <div className="mb-8 bg-primary-50 p-6 rounded-xl border border-primary-100">
          <label className="block text-sm font-bold text-primary-800 mb-3 flex items-center gap-2">
            <Search size={16} />
            Quick Fill: Select Employee
          </label>
          <div className="relative">
            <select
              className="w-full border border-primary-200 rounded-lg p-3 text-sm focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none bg-white text-slate-700 appearance-none cursor-pointer"
              onChange={handleUserSelect}
              defaultValue=""
            >
              <option value="">-- Select Employee to Autofill Details --</option>
              {users.map(u => (
                <option key={u.email} value={u.email}>
                  {u.firstName} {u.lastName} ({u.employeeId || "No ID"})
                </option>
              ))}
            </select>
            <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-primary-400">
              <span className="text-xs">▼</span>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-3 gap-x-6 gap-y-5">
          {input("salaryMonth", "Salary Month (YYYY-MM)")}
          {input("email", "Employee Email", "text", isAutofilled)}
          {input("employeeId", "Employee ID", "text", isAutofilled)}
          {input("firstName", "First Name", "text", isAutofilled)}
          {input("lastName", "Last Name", "text", isAutofilled)}
          {input("dateOfJoining", "Date of Joining", "date")}

          <div className="col-span-3 h-px bg-slate-100 my-2"></div>
          <h4 className="col-span-3 text-sm font-bold text-slate-800 flex items-center gap-2">
            <span className="w-1 h-4 bg-orange-500 rounded-full"></span>
            Attendance & Leaves
          </h4>

          {input("workingDays", "Working Days")}
          {input("paidDays", "Paid Days")}
          {input("lopDays", "LOP Days")}
          {input("leavesAvailed", "Leaves Availed")}
          {input("leavesUsed", "Leaves Used")}
          {input("totalLeaves", "Total Leaves")}
          {input("remainingPaidLeaves", "Balance Leaves")}

          <div className="col-span-3 h-px bg-slate-100 my-2"></div>
          <h4 className="col-span-3 text-sm font-bold text-slate-800 flex items-center gap-2">
            <span className="w-1 h-4 bg-emerald-500 rounded-full"></span>
            Earnings & Deductions
          </h4>

          {input("basic", "Total Basic", "text", true)}
          {input("hra", "HRA (30% of Basic)", "text", true)}
          {input("otherAllowance", "Other Allowance (External)")}
          {input("specialPay", "Special Pay (External)")}
          {input("incentive", "Incentive", "text", true)}
          {input("tds", "TDS (10% of Basic)", "text", true)}

        </div>

        <div className="flex justify-end gap-4 mt-10 pt-6 border-t border-slate-100">
          <button
            onClick={onClose}
            className="px-6 py-2.5 border border-slate-300 rounded-xl text-slate-700 font-medium hover:bg-slate-50 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={submit}
            className="px-8 py-2.5 bg-primary-600 text-white rounded-xl hover:bg-primary-700 font-semibold shadow-lg shadow-primary-500/20 transition-all transform hover:-translate-y-0.5"
          >
            Generate Payroll
          </button>
        </div>
      </div>
    </div>
  );
}

/* ================= PAGE ================= */
export default function FinancialManagement() {
  const navigate = useNavigate();
  const [showCreate, setShowCreate] = useState(false);

  /* ================= DROPDOWN DATA ================= */
  const [dropdowns, setDropdowns] = useState({
    firstNames: [],
    lastNames: [],
    emails: []
  });

  /* ================= FILTER STATE ================= */
  const [filters, setFilters] = useState({
    year: 2026,
    month: "01",
    firstName: "",
    lastName: "",
    email: ""
  });

  const [list, setList] = useState([]);
  const [loading, setLoading] = useState(false);

  // useEffect(() => {
  //   axios
  //     .get("/finance/dropdowns")
  //     .then(res => {
  //       if (res.data.success) {
  //         setDropdowns(res.data);
  //       }
  //     })
  //     .catch(err => console.error("Dropdown load error", err));
  // }, []);

  useEffect(() => {
    const loadDropdowns = async () => {
      try {
        const res = await axios.get("/api/finance/dropdowns");

        if (res.data?.success) {
          setDropdowns({
            firstNames: res.data.firstNames || [],
            lastNames: res.data.lastNames || [],
            emails: res.data.emails || []
          });
        }
      } catch (err) {
        console.error("Dropdown load error", err);
      }
    };

    loadDropdowns();
  }, []);


  // const search = async () => {
  //   setLoading(true);
  //   setList([]);

  //   try {
  //     const res = await axios.post(
  //       "/finance/search",
  //       filters
  //     );
  //     setList(res.data.success ? res.data.list : []);
  //   } catch (err) {
  //     console.error("Search error", err);
  //   } finally {
  //     setLoading(false);
  //   }
  // };

  const search = async () => {
    setLoading(true);
    setList([]);

    try {
      const payload = {
        year: Number(filters.year),
        month: filters.month,
        firstName: filters.firstName || "",
        lastName: filters.lastName || "",
        email: filters.email || ""
      };

      const res = await axios.post("/api/finance/search", payload);

      if (res.data?.success) {
        setList(res.data.list || []);
      } else {
        setList([]);
      }
    } catch (err) {
      console.error("Search error", err);
      setList([]);
    } finally {
      setLoading(false);
    }
  };


  return (
    <div className="min-h-screen bg-slate-50 animate-in fade-in duration-500">


      <div className="max-w-7xl mx-auto px-6 py-10">

        {/* ================= HEADER ================= */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-10 gap-6">
          <div>
            <h2 className="text-3xl font-bold text-slate-900 tracking-tight">
              Financial Management
            </h2>
            <p className="text-slate-500 mt-1 text-lg">
              Manage payroll records, generate slips, and track expenses
            </p>
          </div>

          <div className="flex items-center gap-4">
            <button
              onClick={() => setShowCreate(true)}
              className="flex items-center gap-2 px-5 py-2.5 bg-primary-600 text-white rounded-xl font-semibold shadow-md shadow-primary-500/20 hover:bg-primary-700 transition-all"
            >
              <Plus size={18} />
              Create Payroll
            </button>

            <button
              onClick={() => navigate("/admin/finance-bulk-upload")}
              className="flex items-center gap-2 px-5 py-2.5 bg-white border border-slate-200 text-slate-700 rounded-xl font-medium hover:bg-slate-50 hover:border-slate-300 transition-all"
            >
              <Upload size={18} />
              Bulk Upload
            </button>
          </div>
        </div>

        {/* ================= FILTERS CARD ================= */}
        <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6 mb-10">
          <div className="flex items-center gap-2 mb-4 text-slate-800 font-semibold">
            <Filter size={18} className="text-primary-500" />
            Search Filters
          </div>

          <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-6">
            <SelectFilter
              value={filters.year}
              onChange={e => setFilters({ ...filters, year: e.target.value })}
              options={YEARS.map(y => ({ label: y, value: y }))}
            />

            <SelectFilter
              value={filters.month}
              onChange={e => setFilters({ ...filters, month: e.target.value })}
              options={MONTHS}
            />

            <SelectFilter
              placeholder="First Name"
              value={filters.firstName}
              onChange={e => setFilters({ ...filters, firstName: e.target.value })}
              options={dropdowns.firstNames.map(n => ({ label: n, value: n }))}
            />

            <SelectFilter
              placeholder="Last Name"
              value={filters.lastName}
              onChange={e => setFilters({ ...filters, lastName: e.target.value })}
              options={dropdowns.lastNames.map(n => ({ label: n, value: n }))}
            />

            <SelectFilter
              placeholder="Email Address"
              value={filters.email}
              onChange={e => setFilters({ ...filters, email: e.target.value })}
              options={dropdowns.emails.map(e => ({ label: e, value: e }))}
            />
          </div>

          <button
            onClick={search}
            className="w-full md:w-auto px-8 py-2.5 bg-slate-900 text-white rounded-xl font-medium hover:bg-slate-800 transition-all flex items-center justify-center gap-2"
          >
            <Search size={18} />
            Search Records
          </button>
        </div>

        {/* ================= RESULTS GRID ================= */}
        {loading && (
          <div className="text-center py-20">
            <div className="animate-spin w-8 h-8 border-4 border-primary-500 border-t-transparent rounded-full mx-auto mb-4"></div>
            <p className="text-slate-500 font-medium">Fetching payroll data...</p>
          </div>
        )}

        {!loading && list.length === 0 && (
          <div className="text-center py-20 bg-white rounded-2xl border border-dashed border-slate-200">
            <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-4 text-slate-400">
              <FileText size={32} />
            </div>
            <h3 className="text-lg font-semibold text-slate-700">No Records Found</h3>
            <p className="text-slate-500">Try adjusting your search filters</p>
          </div>
        )}

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {list.map(u => (
            <div key={`${u.email}-${u.salaryMonth}`} className="bg-white rounded-2xl shadow-card border border-slate-100 p-6 hover:shadow-card-hover transition-all group">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h4 className="font-bold text-slate-800 text-lg group-hover:text-primary-600 transition-colors">
                    {u.firstName} {u.lastName}
                  </h4>
                  <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mt-1">{u.employeeId}</p>
                </div>
                <div className="px-3 py-1 bg-slate-100 rounded-lg text-xs font-bold text-slate-600">
                  {u.salaryMonth}
                </div>
              </div>

              <p className="text-sm text-slate-500 mb-6 flex items-center gap-2 truncate">
                <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
                {u.email}
              </p>

              <div className="flex gap-3">
                <button
                  onClick={() => {
                    if (!u.email || !u.salaryMonth) {
                      alert("Invalid payslip data");
                      return;
                    }
                    navigate(
                      `/admin/payslip/view/${encodeURIComponent(u.email)}/${u.salaryMonth}`
                    );
                  }}
                  className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-primary-50 text-primary-700 rounded-lg text-sm font-semibold hover:bg-primary-100 transition-colors"
                >
                  <Eye size={16} />
                  View
                </button>

                <button
                  onClick={() => {
                    if (!u.email || !u.salaryMonth) {
                      alert("Invalid record for edit");
                      return;
                    }
                    navigate(
                      `/admin/financial-management/${encodeURIComponent(u.email)}/${u.salaryMonth}`
                    );

                  }}

                  className="flex-1 flex items-center justify-center gap-2 px-4 py-2 border border-slate-200 text-slate-600 rounded-lg text-sm font-semibold hover:bg-slate-50 hover:text-slate-900 transition-colors"
                >
                  <Edit size={16} />
                  Edit
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      <CreatePayrollModal
        open={showCreate}
        onClose={() => setShowCreate(false)}
      />
    </div>
  );
}

const SelectFilter = ({ value, onChange, options, placeholder }) => (
  <div className="relative">
    <select
      value={value}
      onChange={onChange}
      className="w-full border border-slate-200 rounded-xl px-4 py-2.5 text-sm bg-slate-50 focus:bg-white focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 outline-none appearance-none transition-all cursor-pointer text-slate-700"
    >
      {placeholder && <option value="">{placeholder}</option>}
      {options.map((opt, idx) => (
        <option key={idx} value={opt.value}>{opt.label}</option>
      ))}
    </select>
    <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400">
      <span className="text-[10px]">▼</span>
    </div>
  </div>
);
