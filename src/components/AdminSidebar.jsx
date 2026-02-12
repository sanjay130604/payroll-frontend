// // // import { NavLink } from "react-router-dom";

// // // export default function AdminSidebar() {
// // //   return (
// // //     <aside className="w-64 min-h-screen bg-gray-900 text-white p-6">
// // //       <h2 className="text-2xl font-bold text-indigo-400 mb-10">
// // //         Admin Panel
// // //       </h2>

// // //       <nav className="space-y-3">
// // //         <NavLink
// // //           to="/adminpanel"
// // //           className={({ isActive }) =>
// // //             `block px-4 py-3 rounded-lg transition ${
// // //               isActive ? "bg-indigo-600" : "hover:bg-gray-700"
// // //             }`
// // //           }
// // //         >
// // //           📊 Dashboard
// // //         </NavLink>

// // //         {/* ✅ FIXED LINK */}
// // //         <NavLink
// // //           to="/admin/user-management"
// // //           className={({ isActive }) =>
// // //             `block px-4 py-3 rounded-lg transition ${
// // //               isActive ? "bg-indigo-600" : "hover:bg-gray-700"
// // //             }`
// // //           }
// // //         >
// // //           👥 User Management
// // //         </NavLink>

// // //         <div className="px-4 py-3 rounded-lg text-gray-400 cursor-not-allowed">
// // //           💰 Financial Management
// // //         </div>
// // //       </nav>
// // //     </aside>
// // //   );
// // // }

// // import { NavLink } from "react-router-dom";

// // export default function AdminSidebar() {
// //   return (
// //     <aside className="w-64 min-h-screen bg-gray-900 text-white p-6">
// //       <h2 className="text-2xl font-bold text-indigo-400 mb-10">
// //         Admin Panel
// //       </h2>

// //       <nav className="space-y-3">
// //         {/* Dashboard */}
// //         <NavLink
// //           to="/adminpanel"
// //           className={({ isActive }) =>
// //             `block px-4 py-3 rounded-lg transition ${
// //               isActive ? "bg-indigo-600" : "hover:bg-gray-700"
// //             }`
// //           }
// //         >
// //           📊 Dashboard
// //         </NavLink>

// //         {/* User Management */}
// //         <NavLink
// //           to="/admin/user-management"
// //           className={({ isActive }) =>
// //             `block px-4 py-3 rounded-lg transition ${
// //               isActive ? "bg-indigo-600" : "hover:bg-gray-700"
// //             }`
// //           }
// //         >
// //           👥 User Management
// //         </NavLink>

// //         {/* ✅ Financial Management (ENABLED) */}
// //         <NavLink
// //           to="/admin/financial-management"
// //           className={({ isActive }) =>
// //             `block px-4 py-3 rounded-lg transition ${
// //               isActive ? "bg-indigo-600" : "hover:bg-gray-700"
// //             }`
// //           }
// //         >
// //           💰 Financial Management
// //         </NavLink>
// //       </nav>
// //     </aside>
// //   );
// // }

// import { NavLink } from "react-router-dom";

// export default function AdminSidebar({ open, setOpen }) {
//   return (
//     <>
//       {/* MOBILE OVERLAY */}
//       {open && (
//         <div
//           onClick={() => setOpen(false)}
//           className="fixed inset-0 bg-black/50 z-40 md:hidden"
//         />
//       )}

//       <aside
//         className={`fixed md:static z-50 min-h-screen w-64 bg-gray-900 text-white p-6
//         transform transition-transform duration-300
//         ${open ? "translate-x-0" : "-translate-x-full"}
//         md:translate-x-0`}
//       >
//         <h2 className="text-2xl font-bold text-indigo-400 mb-10">
//           Admin Panel
//         </h2>

//         <nav className="space-y-3">
//           {[
//             ["Dashboard", "/adminpanel", "📊"],
//             ["User Management", "/admin/user-management", "👥"],
//             ["Financial Management", "/admin/financial-management", "💰"]
//           ].map(([label, path, icon]) => (
//             <NavLink
//               key={path}
//               to={path}
//               onClick={() => setOpen(false)}
//               className={({ isActive }) =>
//                 `block px-4 py-3 rounded-lg transition ${
//                   isActive ? "bg-indigo-600" : "hover:bg-gray-700"
//                 }`
//               }
//             >
//               {icon} {label}
//             </NavLink>
//           ))}
//         </nav>
//       </aside>
//     </>
//   );
// }

import { NavLink, useLocation } from "react-router-dom";
import { useState, useEffect } from "react";
import { LayoutDashboard, Users, CreditCard, ChevronRight, ChevronDown, UserCog, UserCircle } from "lucide-react";

export default function AdminSidebar({ open, setOpen }) {
  const location = useLocation();

  // auto-open submenu if route matches
  const [openUserMgmt, setOpenUserMgmt] = useState(
    location.pathname.includes("/admin/user-management")
  );

  useEffect(() => {
    if (location.pathname.includes("/admin/user-management")) {
      setOpenUserMgmt(true);
    }
  }, [location.pathname]);

  return (
    <>
      {/* MOBILE OVERLAY */}
      {open && (
        <div
          onClick={() => setOpen(false)}
          className="fixed inset-0 bg-slate-900/50 z-40 md:hidden backdrop-blur-sm"
        />
      )}

      <aside
        className={`fixed md:static z-50 min-h-screen w-72 bg-white border-r border-slate-100 flex flex-col shadow-xl md:shadow-none
        transform transition-transform duration-300 ease-in-out
        ${open ? "translate-x-0" : "-translate-x-full"}
        md:translate-x-0`}
      >
        {/* BRAND */}
        <div className="px-8 py-8 border-b border-slate-50">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-xl bg-gradient-to-tr from-slate-800 to-slate-700 flex items-center justify-center text-white shadow-lg shadow-slate-200">
              <span className="font-bold text-lg">A</span>
            </div>
            <div>
              <h2 className="text-lg font-bold text-slate-800 tracking-tight">Admin Portal</h2>
              <p className="text-xs font-medium text-slate-400 uppercase tracking-wider">Manager</p>
            </div>
          </div>
        </div>

        <nav className="flex-1 px-4 py-6 space-y-2 overflow-y-auto">

          {/* ================= DASHBOARD ================= */}
          <NavLink
            to="/adminpanel"
            onClick={() => setOpen(false)}
            className={({ isActive }) =>
              `flex items-center gap-3 px-4 py-3 rounded-xl transition-all font-medium ${
                isActive 
                  ? "bg-slate-900 text-white shadow-md shadow-slate-200" 
                  : "text-slate-500 hover:bg-slate-50 hover:text-slate-900"
              }`
            }
          >
             <LayoutDashboard size={20} />
             <span>Dashboard</span>
          </NavLink>

          {/* ================= USER MANAGEMENT ================= */}
          <div>
            <button
              onClick={() => setOpenUserMgmt(!openUserMgmt)}
              className={`w-full flex items-center justify-between px-4 py-3 rounded-xl transition-all font-medium
                ${location.pathname.includes("/admin/user-management")
                  ? "bg-slate-50 text-slate-900"
                  : "text-slate-500 hover:bg-slate-50 hover:text-slate-900"
                }`}
            >
              <div className="flex items-center gap-3">
                <Users size={20} />
                <span>User Management</span>
              </div>
              {openUserMgmt ? <ChevronDown size={16} /> : <ChevronRight size={16} />}
            </button>

            {/* SUB MENU */}
            {openUserMgmt && (
              <div className="ml-4 mt-2 space-y-1 pl-4 border-l border-slate-100">

                <NavLink
                  to="/admin/user-management/account"
                  onClick={() => setOpen(false)}
                  className={({ isActive }) =>
                    `flex items-center gap-2 px-4 py-2 rounded-lg text-sm transition-all font-medium ${isActive
                      ? "text-primary-600 bg-primary-50"
                      : "text-slate-500 hover:text-slate-800"
                    }`
                  }
                >
                  <UserCog size={16} />
                  Account Mgmt
                </NavLink>

                <NavLink
                  to="/admin/user-management/profile"
                  onClick={() => setOpen(false)}
                  className={({ isActive }) =>
                    `flex items-center gap-2 px-4 py-2 rounded-lg text-sm transition-all font-medium ${isActive
                      ? "text-primary-600 bg-primary-50"
                      : "text-slate-500 hover:text-slate-800"
                    }`
                  }
                >
                  <UserCircle size={16} />
                  Profile Mgmt
                </NavLink>

              </div>
            )}
          </div>

          {/* ================= FINANCIAL MANAGEMENT ================= */}
          <NavLink
            to="/admin/financial-management"
            onClick={() => setOpen(false)}
            className={({ isActive }) =>
              `flex items-center gap-3 px-4 py-3 rounded-xl transition-all font-medium ${
                isActive 
                  ? "bg-slate-900 text-white shadow-md shadow-slate-200" 
                  : "text-slate-500 hover:bg-slate-50 hover:text-slate-900"
              }`
            }
          >
             <CreditCard size={20} />
             <span>Financial Mgmt</span>
          </NavLink>

        </nav>
        
        {/* Footer */}
        <div className="p-4 border-t border-slate-50">
          <div className="px-4 py-3 rounded-xl bg-slate-50 text-slate-400 text-xs font-medium text-center">
            v1.0.0 Admin
          </div>
        </div>
      </aside>
    </>
  );
}
