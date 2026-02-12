// // import AdminNavbar from "../components/AdminNavbar";
// // import { useNavigate } from "react-router-dom";

// // export default function AdminPanel() {
// //   const navigate = useNavigate();

// //   return (
// //     <div className="min-h-screen bg-gradient-to-br from-gray-100 to-gray-200">
// //       <AdminNavbar />

// //       {/* HERO SECTION */}
// //       <section className="relative flex items-center justify-center px-10 py-24">

// //         {/* CONTENT WRAPPER */}
// //         <div className="relative z-10 max-w-6xl w-full grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">

// //           {/* LEFT CONTENT */}
// //           <div className="backdrop-blur-xl bg-white/70 border border-white/40 shadow-2xl rounded-3xl p-12">
// //             <h2 className="text-5xl font-extrabold text-gray-900 mb-6">
// //               Admin Dashboard
// //             </h2>

// //             <p className="text-lg text-gray-700 leading-relaxed mb-6">
// //               Welcome to the centralized administration hub. From here, you can
// //               manage user accounts, define system access, and maintain your
// //               organization’s payroll and security ecosystem with confidence.
// //             </p>

// //             <p className="text-gray-600 leading-relaxed">
// //               This panel is designed for enterprise-grade control, ensuring
// //               reliability, scalability, and secure operations across all
// //               departments.
// //             </p>

// //             {/* STATS / INFO */}
// //             <div className="grid grid-cols-3 gap-6 mt-10">
// //               <div>
// //                 <h3 className="text-3xl font-bold text-indigo-600">100%</h3>
// //                 <p className="text-sm text-gray-600">Access Control</p>
// //               </div>
// //               <div>
// //                 <h3 className="text-3xl font-bold text-indigo-600">24/7</h3>
// //                 <p className="text-sm text-gray-600">System Availability</p>
// //               </div>
// //               <div>
// //                 <h3 className="text-3xl font-bold text-indigo-600">Secure</h3>
// //                 <p className="text-sm text-gray-600">Role Management</p>
// //               </div>
// //             </div>
// //           </div>

// //           {/* RIGHT IMAGE */}
// //           <div className="relative">
// //             <img
// //               src="https://images.unsplash.com/photo-1556761175-5973dc0f32e7"
// //               alt="Admin Workspace"
// //               className="rounded-3xl shadow-2xl object-cover"
// //             />
// //           </div>
// //         </div>
// //       </section>

// //     </div>
// //   );
// // }

// import AdminNavbar from "../components/AdminNavbar";

// export default function AdminPanel() {
//   return (
//     <div className="min-h-screen bg-gradient-to-br from-slate-100 to-slate-200">
//       <AdminNavbar />

//       {/* HERO SECTION */}
//       <section className="flex items-center justify-center px-6 py-20">
//         <div className="w-full flex justify-center">

//           {/* IMAGE CONTAINER (70%) */}
//           <div className="w-full lg:w-[70%]">
//             <div className="bg-white rounded-3xl shadow-2xl overflow-hidden border border-slate-200">

//               <img
//                 src="https://images.unsplash.com/photo-1556761175-5973dc0f32e7"
//                 alt="Admin Workspace"
//                 className="w-full h-[420px] object-cover"
//               />

//             </div>
//           </div>

//         </div>
//       </section>
//     </div>
//   );
// }


import { motion } from "framer-motion";
import { Users, DollarSign, Activity, ShieldCheck, ArrowRight } from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function AdminPanel() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-slate-50 animate-in fade-in duration-500">


      {/* HERO SECTION */}
      <section className="px-6 py-12 max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center mb-16">

          <div className="space-y-6">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-200 text-slate-700 text-xs font-semibold uppercase tracking-wider">
              <ShieldCheck size={14} />
              Admin Control Center
            </div>

            <h1 className="text-4xl md:text-5xl font-bold text-slate-900 tracking-tight">
              Manage your Organization with <span className="text-primary-600">Precision</span>
            </h1>

            <p className="text-lg text-slate-600 leading-relaxed max-w-xl">
              Welcome to the centralized administration hub. Monitor user activity, manage payrolls, and oversee system operations from one secure dashboard.
            </p>

            <div className="flex gap-4">
              <button
                onClick={() => navigate("/admin/user-management/account")}
                className="px-6 py-3 bg-slate-900 text-white font-medium rounded-xl hover:bg-slate-800 transition-all flex items-center gap-2"
              >
                Manage Users
                <ArrowRight size={18} />
              </button>
              <button
                onClick={() => navigate("/admin/financial-management")}
                className="px-6 py-3 bg-white border border-slate-200 text-slate-700 font-medium rounded-xl hover:bg-slate-50 transition-all"
              >
                View Finances
              </button>
            </div>
          </div>

          {/* DASHBOARD PREVIEW / ILLUSTRATION */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="relative"
          >
            <div className="absolute inset-0 bg-gradient-to-tr from-primary-600/20 to-primary-400/20 rounded-3xl blur-2xl transform rotate-3"></div>
            <div className="relative bg-white rounded-2xl shadow-xl border border-slate-100 overflow-hidden">
              <img
                src="https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&q=80&w=1000"
                alt="Admin Dashboard Preview"
                className="w-full h-auto object-cover opacity-90"
              />
              <div className="absolute bottom-0 left-0 w-full h-1/2 bg-gradient-to-t from-white via-white/50 to-transparent"></div>
            </div>
          </motion.div>
        </div>

        {/* QUICK STATS */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <StatCard
            title="Total Users"
            value="150+"
            desc="Active Employees"
            icon={<Users className="text-blue-500" size={24} />}
          />
          <StatCard
            title="Payroll Processed"
            value="₹45L+"
            desc="This Month"
            icon={<DollarSign className="text-emerald-500" size={24} />}
          />
          <StatCard
            title="System Status"
            value="99.9%"
            desc="Uptime Reliability"
            icon={<Activity className="text-orange-500" size={24} />}
          />
        </div>
      </section>
    </div>
  );
}

const StatCard = ({ title, value, desc, icon }) => (
  <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 hover:shadow-md transition-all">
    <div className="flex justify-between items-start mb-4">
      <div>
        <p className="text-slate-500 text-sm font-medium">{title}</p>
        <h3 className="text-3xl font-bold text-slate-800 mt-1">{value}</h3>
      </div>
      <div className="p-3 bg-slate-50 rounded-xl">
        {icon}
      </div>
    </div>
    <div className="text-xs font-medium text-slate-400 bg-slate-50 inline-block px-2 py-1 rounded-md">
      {desc}
    </div>
  </div>
);
