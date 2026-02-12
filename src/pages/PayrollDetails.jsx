import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "../utils/axiosConfig";
import Navbar from "../components/Navbar";
import { User, CreditCard, Calendar, Edit2, Save, X } from "lucide-react";

export default function PayrollDetails() {
  const { id } = useParams();
  const [emp, setEmp] = useState(null);
  const [edit, setEdit] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axios
      .get(`/employees/${id}`)
      .then((res) => {
        setEmp(res.data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [id]);

  const save = async () => {
    await axios.put(`/employees/${id}`, emp);
    setEdit(false);
  };

  if (loading) {
    return (
      <>
        <Navbar user="User" />
        <div className="min-h-screen flex items-center justify-center bg-slate-50">
          <p className="text-slate-500 font-medium animate-pulse">Loading payroll details...</p>
        </div>
      </>
    );
  }

  if (!emp) {
    return (
      <>
        <Navbar user="User" />
        <div className="min-h-screen flex items-center justify-center bg-slate-50">
          <p className="text-red-500 font-medium">Employee not found</p>
        </div>
      </>
    );
  }

  return (
    <>
      <Navbar user="User" />

      <div className="min-h-screen bg-slate-50 p-8 animate-in fade-in duration-500">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-4 gap-8">

          {/* ================= LEFT PROFILE PANEL ================= */}
          <div className="bg-white rounded-2xl shadow-card border border-slate-100 p-8 text-center h-fit">
            <div className="w-24 h-24 mx-auto bg-slate-100 rounded-full flex items-center justify-center mb-4 text-slate-400">
              <User size={40} />
            </div>

            <h2 className="text-xl font-bold text-slate-900">
              {emp.name}
            </h2>
            <p className="text-sm font-medium text-slate-500 mb-8 uppercase tracking-wide">
              {emp.designation}
            </p>

            <div className="text-left space-y-4">
              <InfoRow label="Account No" value={emp.accountNo} icon={<CreditCard size={16} />} />
              <InfoRow label="PF No" value={emp.pf} icon={<CreditCard size={16} />} />
              <InfoRow label="Salary Month" value="March 2025" icon={<Calendar size={16} />} />
            </div>

            <button
              className={`mt-8 w-full py-2.5 rounded-xl font-semibold transition-all flex items-center justify-center gap-2 ${edit
                ? "bg-slate-100 text-slate-600 hover:bg-slate-200"
                : "bg-primary-600 text-white hover:bg-primary-700 shadow-lg shadow-primary-500/20"
                }`}
              onClick={() => setEdit(!edit)}
            >
              {edit ? <><X size={18} /> Cancel</> : <><Edit2 size={18} /> Edit Payroll</>}
            </button>
          </div>

          {/* ================= RIGHT MAIN CONTENT ================= */}
          <div className="lg:col-span-3 space-y-6">

            {/* HEADER */}
            <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6 flex justify-between items-center">
              <div>
                <h1 className="text-2xl font-bold text-slate-900">
                  Payroll Details
                </h1>
                <p className="text-slate-500 mt-1">
                  Manage salary structure and deductions
                </p>
              </div>

              {edit && (
                <button
                  onClick={save}
                  className="bg-slate-900 px-6 py-2.5 rounded-xl text-white hover:bg-slate-800 transition-all font-medium flex items-center gap-2"
                >
                  <Save size={18} />
                  Save Changes
                </button>
              )}
            </div>

            {/* EARNINGS + DEDUCTIONS */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

              <Card title="Earnings" className="border-l-4 border-l-emerald-500">
                <EditRow label="Basic Salary" value={emp.basicSalary} edit={edit}
                  onChange={(v) => setEmp({ ...emp, basicSalary: Number(v) })} />
                <EditRow label="HRA" value={emp.hra} edit={edit}
                  onChange={(v) => setEmp({ ...emp, hra: Number(v) })} />
                <EditRow label="Special Allowance" value={emp.specialAllowance} edit={edit}
                  onChange={(v) => setEmp({ ...emp, specialAllowance: Number(v) })} />
                <EditRow label="Data Allowance" value={emp.dataAllowance} edit={edit}
                  onChange={(v) => setEmp({ ...emp, dataAllowance: Number(v) })} />
                <EditRow label="Travel Allowance" value={emp.travelAllowance} edit={edit}
                  onChange={(v) => setEmp({ ...emp, travelAllowance: Number(v) })} />
                <EditRow label="Shift Allowance" value={emp.shiftAllowance} edit={edit}
                  onChange={(v) => setEmp({ ...emp, shiftAllowance: Number(v) })} />
                <EditRow label="Other Allowance" value={emp.otherAllowance} edit={edit}
                  onChange={(v) => setEmp({ ...emp, otherAllowance: Number(v) })} />
              </Card>

              <Card title="Deductions" className="border-l-4 border-l-red-500">
                <EditRow label="PF" value={emp.pf} edit={edit}
                  onChange={(v) => setEmp({ ...emp, pf: Number(v) })} />
                <EditRow label="TDS" value={emp.tds} edit={edit}
                  onChange={(v) => setEmp({ ...emp, tds: Number(v) })} />
                <EditRow label="LOP" value={emp.lop} edit={edit}
                  onChange={(v) => setEmp({ ...emp, lop: Number(v) })} />
                <EditRow label="Insurance" value={emp.insurance} edit={edit}
                  onChange={(v) => setEmp({ ...emp, insurance: Number(v) })} />
                <EditRow label="Others" value={emp.others} edit={edit}
                  onChange={(v) => setEmp({ ...emp, others: Number(v) })} />
              </Card>
            </div>

            {/* SUMMARY CARD */}
            {(() => {
              const gross = (
                Number(emp.basicSalary || 0) +
                Number(emp.hra || 0) +
                Number(emp.specialAllowance || 0) +
                Number(emp.dataAllowance || 0) +
                Number(emp.travelAllowance || 0) +
                Number(emp.shiftAllowance || 0) +
                Number(emp.otherAllowance || 0)
              );

              const deductions = (
                Number(emp.pf || 0) +
                Number(emp.tds || 0) +
                Number(emp.lop || 0) +
                Number(emp.insurance || 0) +
                Number(emp.others || 0)
              );

              const netPay = gross - deductions;

              return (
                <div className="bg-slate-900 rounded-2xl shadow-lg p-8 text-white">
                  <h3 className="text-lg font-bold mb-6 border-b border-slate-700 pb-4">
                    Net Pay Calculation
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-10 text-center">
                    <div>
                      <p className="text-slate-400 text-xs font-bold uppercase tracking-wider mb-2">Gross Earnings</p>
                      <p className="text-3xl font-bold text-emerald-400">₹{gross.toLocaleString()}</p>
                    </div>
                    <div>
                      <p className="text-slate-400 text-xs font-bold uppercase tracking-wider mb-2">Total Deductions</p>
                      <p className="text-3xl font-bold text-red-400">₹{deductions.toLocaleString()}</p>
                    </div>
                    <div className="relative">
                      <div className="absolute left-0 top-0 bottom-0 w-px bg-slate-700 hidden md:block"></div>
                      <p className="text-slate-400 text-xs font-bold uppercase tracking-wider mb-2">Net Payable</p>
                      <p className="text-4xl font-black text-white">₹{netPay.toLocaleString()}</p>
                    </div>
                  </div>
                </div>
              );
            })()}
          </div>
        </div>
      </div>
    </>
  );
}

/* ====================== UI COMPONENTS ====================== */

const InfoRow = ({ label, value, icon }) => (
  <div className="flex items-center justify-between p-2 bg-slate-50 rounded-lg">
    <div className="flex items-center gap-2 text-slate-500 text-sm">
      {icon}
      <span>{label}</span>
    </div>
    <span className="font-semibold text-slate-800 text-sm">
      {value ?? "-"}
    </span>
  </div>
);

const Card = ({ title, children, className }) => (
  <div className={`bg-white rounded-2xl border border-slate-100 shadow-sm p-6 ${className}`}>
    <h3 className="text-lg font-bold text-slate-800 mb-6">
      {title}
    </h3>
    <div className="space-y-4">{children}</div>
  </div>
);

const EditRow = ({ label, value, edit, onChange }) => (
  <div className="flex justify-between items-center text-sm py-1">
    <span className="text-slate-600 font-medium">{label}</span>
    {edit ? (
      <input
        type="number"
        className="w-32 border border-slate-200 rounded-lg px-3 py-1.5 text-right outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 transition-all bg-slate-50 focus:bg-white"
        value={value ?? ""}
        onChange={(e) => onChange(e.target.value)}
      />
    ) : (
      <span className="font-bold text-slate-800 bg-slate-50 px-3 py-1 rounded-lg">
        ₹{(Number(value) || 0).toLocaleString()}
      </span>
    )}
  </div>
);
