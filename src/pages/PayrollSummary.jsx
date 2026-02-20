import { useEffect, useState } from "react";
import axios from "../utils/axiosConfig";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import { User, Calendar, CreditCard, Briefcase, FileText, TrendingUp, TrendingDown, DollarSign } from "lucide-react";

/* ================= SALARY CALC ================= */
const calculateSalary = (p) => {
  const earnings =
    (+p.basic || 0) +
    (+p.hra || 0) +
    (+p.otherAllowance || 0) +
    (+p.specialPay || 0) +
    (+p.incentive || 0);

  const deductions =
    (+p.tds || 0) +
    (+p.otherDeductions || 0);

  return earnings - deductions;
};

export default function PayrollSummary() {
  const [emp, setEmp] = useState(null);
  const [profile, setProfile] = useState(null);
  const [error, setError] = useState(null); // 🔥 NEW: Track errors
  const navigate = useNavigate();

  /* ================= FETCH FLOW ================= */
  useEffect(() => {
    const email = localStorage.getItem("userEmail");
    if (!email) return navigate("/login");

    let empId = "";

    axios
      .get("/api/profile", {
        params: { email }
      })
      .then(res => {
        if (!res.data.success || !res.data.employeeId) {
          throw new Error("Employee ID not found");
        }

        empId = res.data.employeeId;

        // STEP 2: EMPLOYEE ID → PAYROLL
        return axios.get(
          "/api/payroll/by-employee-id",
          { params: { employeeId: empId } }
        );
      })
      .then(res => {
        // 🔥 FIX: Handle missing payroll gracefully
        if (!res.data.success || !res.data.finance) {
          console.warn("No payroll data found, using placeholder");
          // Set empty payroll data instead of throwing error
          setEmp({
            employeeId: empId,
            firstName: "",
            lastName: "",
            basic: 0,
            hra: 0,
            otherAllowance: 0,
            specialPay: 0,
            incentive: 0,
            tds: 0,
            lopDays: 0,
            workingDays: 0,
            totalLeaves: 0,
            salaryMonth: new Date().toISOString().slice(0, 7) // Current month YYYY-MM
          });
        } else {
          setEmp(res.data.finance);
        }

        // STEP 3: EMPLOYEE ID → PROFILE MANAGEMENT
        return axios.get(
          `/api/profile/employee/${empId}`
        );
      })
      .then(res => {
        if (res.data.success) {
          setProfile(res.data.data);
        }
      })
      .catch((err) => {
        // 🔥 FIX: Better error handling - distinguish between auth and data errors
        console.error("PayrollSummary fetch error:", err);

        const email = localStorage.getItem("userEmail");
        if (!email) {
          // Not authenticated - redirect to login
          navigate("/login");
          return;
        }

        // Authenticated but data fetch failed
        if (err.response?.status === 401) {
          // Auth token expired or invalid
          localStorage.removeItem("userEmail");
          navigate("/login");
        } else {
          // Data missing or server error - show error message
          setError("Unable to load your profile data. Please contact your administrator.");
        }
      });
  }, [navigate]);

  // 🔥 NEW: Show error state if data fetch failed
  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="bg-white rounded-2xl shadow-card border border-red-100 p-8 max-w-md text-center">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
          </div>
          <h2 className="text-xl font-bold text-slate-800 mb-2">Data Not Available</h2>
          <p className="text-slate-600 mb-6">{error}</p>
          <button
            onClick={() => navigate("/login")}
            className="px-6 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
          >
            Back to Login
          </button>
        </div>
      </div>
    );
  }

  if (!emp) return null;

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      {/* Redesigned Navbar integration - acts as a welcome banner now */}
      <div className="rounded-2xl overflow-hidden shadow-card border border-slate-100">
        <Navbar user={emp.firstName || "User"} />
      </div>

      <div className="space-y-8">

        {/* TOP ROW: PROFILE & ATTENDANCE */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">

          {/* BASIC PROFILE */}
          <DashboardCard title="Employee Profile" icon={<User className="text-primary-500" size={20} />}>
            <div className="flex items-start gap-4 mb-6">
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-primary-100 to-primary-50 text-primary-600 flex items-center justify-center text-xl font-bold shadow-sm shrink-0">
                {emp.firstName?.charAt(0)}
              </div>
              <div>
                <h2 className="text-lg font-bold text-slate-800">{emp.firstName} {emp.lastName}</h2>
                <p className="text-sm text-slate-500 font-medium">{profile?.designation || "Employee"}</p>
                <div className="flex gap-2 mt-2">
                  <span className="text-xs bg-slate-100 text-slate-600 px-2 py-1 rounded-md font-medium">{emp.employeeId}</span>
                  <span className="text-xs bg-indigo-50 text-indigo-600 px-2 py-1 rounded-md font-medium">{emp.salaryMonth}</span>
                </div>
              </div>
            </div>

            <div className="space-y-3">
              <InfoRow label="Email" value={emp.email} icon={<Briefcase size={14} />} />
              {/* <InfoRow label="Joining Date" value={emp.dateOfJoining ? new Date(emp.dateOfJoining).toLocaleDateString("en-GB") : "-"} icon={<Calendar size={14} />} /> */}
              <InfoRow label="PAN Card" value={emp.panCard} icon={<CreditCard size={14} />} />
            </div>
          </DashboardCard>

          {/* ATTENDANCE & LEAVES */}
          <DashboardCard title="Attendance Overview" icon={<FileText className="text-indigo-500" size={20} />}>
            <div className="grid grid-cols-3 gap-4">
              <StatBox label="Total Leaves" value={emp.totalLeaves} color="text-slate-800" />
              <StatBox label="Leaves Used" value={emp.leavesUsed} color="text-orange-600" />
              <StatBox label="Balance Leaves" value={emp.remainingPaidLeaves} color="text-green-600" />
            </div>
          </DashboardCard>

        </div>

        {/* BOTTOM ROW: PERSONAL INFO */}
        {profile && (
          <DashboardCard title="Personal Information" icon={<User className="text-blue-500" size={20} />}>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-4">
              <InfoRow label="Phone" value={profile.phone} />
              <InfoRow label="Personal Email" value={profile["personal mail id"]} />
              <InfoRow label="Date of Birth" value={profile.dob} />
              <InfoRow label="Blood Group" value={profile["blood group"]} />
              <InfoRow label="Father's Name" value={profile["father name"]} />
              <InfoRow label="Mother's Name" value={profile["mother name"]} />
              <InfoRow label="Aadhaar" value={profile["aadhaar card"]} />
              <InfoRow label="Education" value={profile.education} />
              <InfoRow label="Bank Name" value={profile["bank name"]} />
              <InfoRow label="Account No" value={profile["account number"]} />
              <InfoRow label="PF Number" value={profile["pf no"]} />
            </div>
          </DashboardCard>
        )}

      </div>
    </div>
  );
}

/* ================= UI COMPONENTS ================= */

const DashboardCard = ({ title, icon, children }) => (
  <div className="bg-white rounded-2xl shadow-card border border-slate-100 p-6 transition-all hover:shadow-card-hover">
    <div className="flex items-center gap-3 mb-6 pb-4 border-b border-slate-50">
      <div className="p-2 bg-slate-50 rounded-lg">
        {icon}
      </div>
      <h3 className="font-bold text-slate-800 text-lg">{title}</h3>
    </div>
    <div>{children}</div>
  </div>
);

const InfoRow = ({ label, value, icon, highlight }) => (
  <div className={`flex justify-between items-center py-1.5 ${highlight ? 'bg-primary-50 px-2 rounded-lg -mx-2' : ''}`}>
    <div className="flex items-center gap-2 text-slate-500 text-sm font-medium">
      {icon}
      <span>{label}</span>
    </div>
    <span className={`font-semibold text-sm ${highlight ? 'text-primary-700' : 'text-slate-700'}`}>
      {value || "-"}
    </span>
  </div>
);

const StatBox = ({ label, value, color = "text-slate-800" }) => (
  <div className="bg-slate-50 rounded-xl p-3 text-center">
    <p className="text-xs text-slate-400 font-semibold uppercase tracking-wider mb-1">{label}</p>
    <p className={`text-xl font-bold ${color}`}>{value || 0}</p>
  </div>
);


