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
  const [sendingMail, setSendingMail] = useState(false);

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

  /* ================= CALCULATIONS (FETCHED FROM SHEET) ================= */
  const basic = Number(d.basic || 0);
  const hra = Number(d.hra || 0);
  const otherAllowance = Number(d.otherAllowance || 0);
  const specialPay = Number(d.specialPay || 0);
  const incentive = Number(d.incentive || 0);

  // Use values directly from Google Sheet/Backend
  const tds = Number(d.tds || 0);
  // FIX: Backend 'netPay' is Earnings (Gross), 'grossPay' is Take Home (Net)
  const gross = Number(d.netPay || 0);
  const netPay = Number(d.grossPay || 0);

  const totalDeductions = tds;

  const payPeriod = new Date(`${month}-01`).toLocaleDateString("en-IN", {
    month: "long",
    year: "numeric"
  });

  const handleDownloadAndSendMail = async () => {
    try {
      setSendingMail(true);
      // Automatically download PDF
      window.open(
        `${BASE_URL}/api/finance/payslip-pdf?email=${email}&month=${month}`,
        "_blank"
      );

      // Get the admin's logged-in email from JWT stored in localStorage
      let adminEmail = "";
      const token = localStorage.getItem("adminToken");
      if (token) {
        try {
          const payload = JSON.parse(atob(token.split(".")[1]));
          adminEmail = payload.email || "";
        } catch (e) {
          console.warn("Could not decode token:", e);
        }
      }

      // Send Email — pass adminEmail so backend sets it as reply-to
      const res = await axios.post("/api/finance/send-payslip-email", { email, month, adminEmail });
      if (res.data?.success) {
        alert("Email sent successfully!");
      } else {
        alert("Failed to send email");
      }
    } catch (err) {
      console.error("Error sending mail:", err);
      alert("Error sending email. Please try again.");
    } finally {
      setSendingMail(false);
    }
  };

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

        <div className="flex gap-4">
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

          <button
            onClick={handleDownloadAndSendMail}
            disabled={sendingMail}
            className="bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-xl flex items-center gap-2 shadow disabled:opacity-50"
          >
            {sendingMail ? (
              <div className="h-5 w-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
            ) : (
              <Download size={18} />
            )}
            Download PDF & Send Mail
          </button>
        </div>
      </div>

      {/* PAYSLIP CARD */}
      <div className="bg-white max-w-5xl mx-auto rounded-2xl shadow border p-6 md:p-10">

        {/* HEADER */}
        <div className="mb-10 flex flex-col md:flex-row justify-between items-start gap-4">
          <div>
            <h1 className="text-3xl font-extrabold text-slate-800 mb-2">
              Payslip – <span className="text-indigo-600">{payPeriod}</span>
            </h1>
            <p className="text-slate-600 font-semibold text-lg">
              {d.fullName || `${d.firstName} ${d.lastName}`}
            </p>
            <p className="text-slate-500 font-medium">
              Employee ID: {d.employeeId}
            </p>
            <p className="text-sm text-slate-400 mt-1 flex items-center gap-2">
              <Calendar size={14} /> {d.email}
            </p>
          </div>

        </div>

        {/* ATTENDANCE */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-12">
          {[
            ["Working Days", d.workingDays],
            ["Paid Days", d.paidDays],
            ["LOP Days", d.lopDays || 0],
            ["Leaves Used", d.leavesUsed || 0]
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
              ["HRA", d.hra],//
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
              ["TDS", d.tds]
            ].map(([label, val]) => (
              <div key={label} className="flex justify-between border-b py-2">
                <span>{label}</span>
                <span className="font-bold">₹{Number(val || 0).toLocaleString("en-IN")}</span>
              </div>
            ))}
            <div className="flex justify-between mt-4 font-black text-red-600">
              <span>Total</span>
              <span>₹{totalDeductions.toLocaleString("en-IN")}</span>
            </div>
          </div>
        </div>
      </div>

      {/* NET PAY */}
      <div className="mt-16 bg-indigo-600 text-white rounded-2xl p-8 text-center shadow-xl">
        <p className="uppercase text-xs tracking-widest opacity-70 mb-2">Net Pay</p>
        <h2 className="text-4xl font-black">₹{netPay.toLocaleString("en-IN")}</h2>
      </div>
    </div>
  );
}
