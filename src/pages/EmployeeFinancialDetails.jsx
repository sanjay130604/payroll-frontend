import { useEffect, useState } from "react";
import axios from "../utils/axiosConfig";
import { useParams, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowLeft, Save, Calendar, User, CreditCard, RefreshCw } from "lucide-react";
import { calculateTotalWorkingDays, calculateProratedAmount } from "../utils/payrollHelper";

export default function EmployeeFinancialDetails() {
  const { email, month } = useParams();
  const navigate = useNavigate();

  const [data, setData] = useState(null);
  const [row, setRow] = useState(null);
  const [fixation, setFixation] = useState(null); // ✅ To get original base salary

  /* ================= LOAD ================= */
  useEffect(() => {
    if (email && month) load();
  }, [email, month]);

  const load = async () => {
    try {
      const res = await axios.post("/api/finance/get", {
        email: decodeURIComponent(email), // ✅ IMPORTANT
        salaryMonth: month
      });

      // Fetch fixation for this employee to get original base
      try {
        const fixRes = await axios.get("/api/finance/pay-fixation");
        if (fixRes.data.success) {
          const empId = res.data.finance?.employeeId;
          const found = fixRes.data.list.find(f => f.employeeId === empId || f.email === decodeURIComponent(email));
          setFixation(found || null);
        }
      } catch (e) {
        console.error("Fixation fetch error", e);
      }

      if (!res.data.success) {
        alert("Payroll not found");
        navigate(-1);
        return;
      }

      const f = { ...res.data.finance };

      // Date formatting for input[type=date]
      if (f.dateOfJoining) {
        const d = new Date(f.dateOfJoining);
        if (!isNaN(d)) f.dateOfJoining = d.toISOString().split("T")[0];
      }

      // Convert financial fields to numbers first, then strings for inputs
      const numericFields = [
        "workingDays", "paidDays", "lopDays", "totalLeaves", "leavesAvailed",
        "leavesUsed", "remainingPaidLeaves", "basic", "hra", "otherAllowance",
        "specialPay", "incentive", "tds", "otherDeductions", "netPay"
      ];

      numericFields.forEach(k => {
        const val = Number(f[k]);
        f[k] = isNaN(val) ? "0" : String(val);
      });

      // Convert other fields to string for inputs
      Object.keys(f).forEach(k => {
        if (!numericFields.includes(k)) {
          if (f[k] === null || f[k] === undefined) f[k] = "";
          else f[k] = String(f[k]);
        }
      });

      setData(f);
      setRow(res.data.row); // ✅ REQUIRED
    } catch (err) {
      console.error(err);
      alert("Failed to load payroll");
      navigate(-1);
    }
  };

  /* ================= SAVE ================= */
  const save = async () => {
    try {
      if (!row) {
        alert("Invalid payroll row");
        return;
      }

      const payload = { ...data };

      // Numeric fields conversion
      [
        "workingDays",
        "paidDays",
        "lopDays",
        "totalLeaves",
        "leavesAvailed",
        "leavesUsed",
        "remainingPaidLeaves",
        "basic",
        "hra",
        "otherAllowance",
        "specialPay",
        "incentive",
        "tds",
        "otherDeductions"
      ].forEach(k => {
        payload[k] = Number(payload[k] || 0);
      });

      const res = await axios.post("/api/finance/update", {
        row,
        ...payload,
        action: "updateMonthlyFinance",
        // Calculate using new formula
        netPay: (
          Number(payload.basic || 0) +
          Number(payload.hra || 0) +
          Number(payload.otherAllowance || 0) +
          Number(payload.specialPay || 0) +
          Number(payload.incentive || 0)
        ),
        grossPay: (
          Number(payload.basic || 0) +
          Number(payload.hra || 0) +
          Number(payload.otherAllowance || 0) +
          Number(payload.specialPay || 0) +
          Number(payload.incentive || 0)
        ) - Number(payload.tds || 0)
      });

      if (res.data.success) {
        alert("Payroll updated successfully");
        navigate(-1);
      } else {
        alert(res.data.message || "Update failed in Google Sheet");
      }
    } catch (err) {
      console.error(err);
      alert("Update failed");
    }
  };

  /* ================= FIELD ================= */
  const Field = ({ label, keyName, type = "text", editable = true }) => (
    <div>
      <label className="block text-xs font-bold text-slate-400 uppercase mb-1">
        {label}
      </label>
      <input
        type={type}
        readOnly={!editable}
        value={data[keyName] || ""}
        onChange={e =>
          setData(prev => ({ ...prev, [keyName]: e.target.value }))
        }
        className={`w-full px-3 py-2 rounded-lg border ${editable
          ? "bg-white"
          : "bg-slate-100 text-slate-500 cursor-not-allowed"
          } focus:outline-none focus:ring-2 focus:ring-indigo-500`}
      />
    </div>
  );

  // ✅ Auto-calculate when days change
  useEffect(() => {
    if (data && fixation) {
      const wd = Number(data.workingDays || 0);
      const lop = Number(data.lopDays || 0);
      const paidDays = Math.max(0, wd - lop);

      if (wd > 0 && fixation.basic) {
        // Calculate using NEW formula
        const ratio = wd > 0 ? (paidDays / wd) : 1;
        const totalBasic = fixation.basic > 0 ? Math.round(fixation.basic * ratio) : 0;
        const hra = totalBasic > 0 ? Math.round(totalBasic * 0.30) : 0;
        const tds = totalBasic > 0 ? Math.round(totalBasic * 0.10) : 0; // ✅ 10% of total_basic

        setData(prev => ({
          ...prev,
          paidDays: String(paidDays),
          basic: String(totalBasic),
          hra: String(hra),
          tds: String(tds),
          // Keep other allowances at 0 unless they're already set
          otherAllowance: prev.otherAllowance || "0",
          specialPay: prev.specialPay || "0",
          incentive: prev.incentive || "0",
          otherDeductions: prev.otherDeductions || "0"
        }));
      }
    }
  }, [data?.workingDays, data?.lopDays, fixation]);

  if (!data) {
    return (
      <div className="min-h-screen flex items-center justify-center text-slate-400">
        Loading details…
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-100 px-6 py-10">
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-5xl mx-auto"
      >
        <div className="flex justify-between mb-8">
          <div>
            <button
              onClick={() => navigate(-1)}
              className="flex items-center gap-2 text-slate-500 mb-3"
            >
              <ArrowLeft size={16} /> Back
            </button>

            <h2 className="text-3xl font-bold">Edit Payslip</h2>
            <p className="text-slate-500">
              {data.firstName} {data.lastName} • {data.employeeId}
            </p>
          </div>

          <button
            onClick={save}
            className="flex items-center gap-2 px-6 py-3 bg-slate-900 text-white rounded-xl"
          >
            <Save size={18} /> Save Changes
          </button>
        </div>

        <div className="bg-white rounded-2xl p-8 shadow space-y-10">

          {/* EMPLOYEE INFO */}
          <section>
            <h3 className="font-bold mb-4 flex gap-2 items-center">
              <User size={18} /> Employee Info
            </h3>
            <div className="grid md:grid-cols-3 gap-4">
              <Field label="Salary Month" keyName="salaryMonth" editable={false} />
              <Field label="Email" keyName="email" editable={false} />
              <Field label="Employee ID" keyName="employeeId" editable={false} />
              <Field label="First Name" keyName="firstName" editable={false} />
              <Field label="Last Name" keyName="lastName" editable={false} />
              <Field label="Date of Joining" keyName="dateOfJoining" type="date" />
            </div>
          </section>

          {/* ATTENDANCE */}
          <section>
            <h3 className="font-bold mb-4 flex gap-2 items-center">
              <Calendar size={18} /> Attendance
            </h3>
            <div className="grid md:grid-cols-4 gap-4">
              <Field label="Working Days" keyName="workingDays" />
              <Field label="Paid Days" keyName="paidDays" />
              <Field label="LOP Days" keyName="lopDays" />
              <Field label="Total Leaves" keyName="totalLeaves" />
              <Field label="Leaves Availed" keyName="leavesAvailed" />
              <Field label="Leaves Used" keyName="leavesUsed" />
              <Field label="Balance Leaves" keyName="remainingPaidLeaves" />
            </div>
          </section>

          {/* SALARY */}
          <section>
            <h3 className="font-bold mb-4 flex gap-2 items-center">
              <CreditCard size={18} /> Salary
            </h3>
            <div className="grid md:grid-cols-2 gap-4">
              <Field label="Basic" keyName="basic" editable={false} />
              <Field label="HRA" keyName="hra" />
              <Field label="Other Allowance" keyName="otherAllowance" />
              <Field label="Special Pay" keyName="specialPay" />
              <Field label="Incentive" keyName="incentive" editable={false} />
              <Field label="TDS" keyName="tds" />
              <Field label="Other Deductions" keyName="otherDeductions" />

            </div>
          </section>

        </div>
      </motion.div>
    </div>
  );
}
