import { useNavigate } from "react-router-dom";
import { Calendar, Bell, ChevronDown } from "lucide-react";

export default function Topbar() {
  const navigate = useNavigate();
  const today = new Date().toLocaleDateString("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric"
  });

  return (
    <div className="sticky top-0 z-40 bg-white/80 backdrop-blur-md border-b border-slate-200 shadow-sm transition-all duration-300">
      <div className="px-8 py-4 flex justify-between items-center">

        {/* ================= LEFT ================= */}
        <div className="flex flex-col">
          <h1 className="text-xl font-bold text-slate-800 tracking-tight">
            Payroll Management
          </h1>
          <p className="text-sm font-medium text-slate-500 mt-0.5">
            View & manage employee salary details
          </p>
        </div>

        {/* ================= RIGHT ================= */}
        <div className="flex items-center gap-6">

          {/* DATE CHIP */}
          <div className="hidden md:flex items-center gap-2.5 px-4 py-2 rounded-full bg-slate-50 border border-slate-100 text-slate-600 text-sm font-semibold shadow-sm hover:shadow-md transition-all duration-300">
            <Calendar size={16} className="text-primary-500" />
            <span>{today}</span>
          </div>

          <div className="h-8 w-[1px] bg-slate-200 hidden md:block"></div>

          {/* NOTIFICATION (Placeholder for modern feel) */}
          <button className="p-2 text-slate-400 hover:text-primary-600 hover:bg-primary-50 rounded-full transition-all duration-200 relative">
            <Bell size={20} />
            <span className="absolute top-2 right-2.5 w-2 h-2 bg-red-500 rounded-full border border-white"></span>
          </button>

          {/* PROFILE */}
          <div
            onClick={() => navigate("/profile")}
            className="flex items-center gap-3 cursor-pointer group p-1.5 pr-3 rounded-full hover:bg-slate-50 border border-transparent hover:border-slate-100 transition-all duration-200"
          >
            <div className="h-10 w-10 rounded-full bg-gradient-to-tr from-primary-600 to-primary-400 flex items-center justify-center text-white font-bold shadow-md shadow-primary-200 group-hover:shadow-primary-300 transition-all">
              U
            </div>

            <div className="hidden md:block leading-tight text-right">
              <p className="text-sm font-bold text-slate-700 group-hover:text-primary-700 transition-colors">
                My Profile
              </p>
              <p className="text-xs font-medium text-slate-400 group-hover:text-slate-500 transition-colors">
                Account Settings
              </p>
            </div>
            
            <ChevronDown size={16} className="text-slate-300 group-hover:text-primary-500 transition-colors hidden md:block" />
          </div>

        </div>
      </div>
    </div>
  );
}
