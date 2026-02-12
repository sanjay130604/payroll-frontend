import { useEffect, useState } from "react";
import axios, { BASE_URL } from "../utils/axiosConfig";
import { useParams, useNavigate } from "react-router-dom";
import {
  Download,
  FileText,
  ChevronLeft,
  Calendar
} from "lucide-react";

export default function ViewPayslip() {
  const { email, month } = useParams();
  const navigate = useNavigate();

  const [d, setD] = useState(null);
  const [loading, setLoading] = useState(true);

  /* ================= FETCH PAYSLIP ================= */
  useEffect(() => {
    if (!email || !month) {
      setLoading(false);
      return;
    }

    setLoading(true);

    axios
      .post("/api/finance/get", {
        email,
        salaryMonth: month
      })
      .then(res => {
        if (res.data?.success) {
          setD(res.data.finance);
        } else {
          setD(null);
        }
      })
      .catch(err => {
        console.error("Payslip fetch failed:", err);
        setD(null);
      })
      .finally(() => setLoading(false));

  }, [email, month]);

  /* ================= LOADING ================= */
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="h-12 w-12 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  /* ================= NOT FOUND ================= */
  if (!d) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center text-center bg-slate-50 px-4">
        <div className="bg-white p-6 rounded-2xl shadow mb-6">
          <FileText size={48} className="text-slate-300" />
        </div>
        <h2 className="text-2xl font-bold mb-2">Payslip Not Found</h2>
        <p className="text-slate-500 mb-6">
          No salary data available for this month.
        </p>
        <button
          onClick={() => navigate(-1)}
          className="px-6 py-3 bg-slate-800 text-white rounded-xl flex items-center gap-2"
        >
          <ChevronLeft size={18} /> Back to History
        </button>
      </div>
    );
  }

  /* ================= CALCULATIONS ================= */
  const gross =
    Number(d.basic || 0) +
    Number(d.hra || 0) +
    Number(d.otherAllowance || 0) +
    Number(d.specialPay || 0) +
    Number(d.incentive || 0);

  const deductions =
    Number(d.tds || 0) + Number(d.otherDeductions || 0);

  const netPay = gross - deductions;

  const payPeriod = new Date(`${month}-01`).toLocaleDateString("en-IN", {
    month: "long",
    year: "numeric"
  });

  /* ================= UI ================= */
  return (
    <div className="min-h-screen bg-slate-50 p-4 md:p-10">

      {/* TOP BAR */}
      <div className="max-w-5xl mx-auto mb-6 flex justify-between items-center">
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 bg-white px-4 py-2 rounded-xl shadow border"
        >
          <ChevronLeft size={18} /> Back
        </button>

        <button
          onClick={() =>
            window.open(
              `${BASE_URL}/api/finance/payslip-pdf?email=${email}&month=${month}`,
              "_blank"
            )
          }
          className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-3 rounded-xl flex items-center gap-2 shadow"
        >
          <Download size={18} />
          Download PDF
        </button>
      </div>

      {/* PAYSLIP CARD */}
      <div className="bg-white max-w-5xl mx-auto rounded-2xl shadow border p-6 md:p-10">

        {/* HEADER */}
        <div className="mb-10">
          <h1 className="text-3xl font-extrabold text-slate-800 mb-2">
            Payslip – <span className="text-indigo-600">{payPeriod}</span>
          </h1>
          <p className="text-slate-500 font-medium">
            {d.fullName || `${d.firstName} ${d.lastName}`} · {d.employeeId}
          </p>
          <p className="text-sm text-slate-400 mt-1 flex items-center gap-2">
            <Calendar size={14} /> {d.email}
          </p>
        </div>

        {/* ATTENDANCE */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-12">
          {[
            ["Working Days", d.workingDays],
            ["Paid Days", d.paidDays],
            ["LOP Days", d.lopDays || 0],
            ["Total Leaves", d.totalLeaves || 0]
          ].map(([label, value]) => (
            <div key={label} className="bg-slate-50 p-4 rounded-xl text-center border">
              <p className="text-xs uppercase font-bold text-slate-400 mb-1">{label}</p>
              <p className="text-2xl font-black text-slate-800">{value}</p>
            </div>
          ))}
        </div>

        {/* SALARY TABLES */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12">

          {/* EARNINGS */}
          <div>
            <h3 className="font-bold text-slate-700 mb-4">Earnings</h3>
            {[
              ["Basic", d.basic],
              ["HRA", d.hra],
              ["Other Allowance", d.otherAllowance],
              ["Special Pay", d.specialPay],
              ["Incentive", d.incentive]
            ].map(([label, val]) => (
              <div key={label} className="flex justify-between border-b py-2">
                <span>{label}</span>
                <span className="font-bold">₹{Number(val || 0).toLocaleString("en-IN")}</span>
              </div>
            ))}
            <div className="flex justify-between mt-4 font-black text-indigo-600">
              <span>Gross</span>
              <span>₹{gross.toLocaleString("en-IN")}</span>
            </div>

          </div>

          {/* DEDUCTIONS */}
          <div>
            <h3 className="font-bold text-slate-700 mb-4">Deductions</h3>
            {[
              ["TDS", d.tds],
              ["Other Deductions", d.otherDeductions]
            ].map(([label, val]) => (
              <div key={label} className="flex justify-between border-b py-2">
                <span>{label}</span>
                <span className="font-bold">₹{Number(val || 0).toLocaleString("en-IN")}</span>
              </div>
            ))}
            <div className="flex justify-between mt-4 font-black text-red-600">
              <span>Total</span>
              <span>₹{deductions.toLocaleString("en-IN")}</span>
            </div>
          </div>
        </div>

        {/* NET PAY */}
        <div className="mt-16 bg-indigo-600 text-white rounded-2xl p-8 text-center shadow-xl">
          <p className="uppercase text-xs tracking-widest opacity-70 mb-2">Net Pay</p>
          <h2 className="text-4xl font-black">₹{netPay.toLocaleString("en-IN")}</h2>
        </div>
      </div>
    </div>
  );
}
