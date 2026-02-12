// import { useNavigate } from "react-router-dom";

// export default function Navbar({ user }) {
//   const navigate = useNavigate();
//   const now = new Date().toLocaleString();

//   const logout = () => {
//     // clear auth data if you have (JWT / user info)
//     localStorage.removeItem("token");
//     localStorage.removeItem("user");

//     navigate("/");
//   };

//   return (
//     <div className="flex justify-between items-center px-8 py-4 bg-white shadow">
      
//       {/* LEFT */}
//       <div className="flex items-center gap-3">
//         <div className="h-10 w-10 bg-blue-600 text-white flex items-center justify-center font-bold rounded">
//           P
//         </div>
//         <h1 className="text-xl font-semibold">Payroll Checker</h1>
//       </div>

//       {/* RIGHT */}
//       <div className="flex items-center gap-6 text-sm text-gray-600">
//         <span>{user} | {now}</span>

//         <button
//           onClick={logout}
//           className="text-red-600 font-medium hover:underline"
//         >
//           Logout
//         </button>
//       </div>

//     </div>
//   );
// }

import { useNavigate } from "react-router-dom";
import { LogOut, User } from "lucide-react";

export default function Navbar({ user }) {
  const navigate = useNavigate();
  const now = new Date().toLocaleString("en-IN", {
    weekday: 'short',
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });

  const logout = () => {
    localStorage.clear();
    navigate("/login");
  };

  return (
    <div className="bg-white px-6 py-4 flex flex-col md:flex-row justify-between items-center gap-4">
      
      {/* ================= LEFT BRAND ================= */}
      <div className="flex items-center gap-4 w-full md:w-auto">
        <div className="h-12 w-12 rounded-2xl bg-gradient-to-tr from-primary-600 to-primary-500 flex items-center justify-center shadow-lg shadow-primary-200">
          <span className="text-white font-bold text-xl">V</span>
        </div>

        <div className="flex flex-col">
          <h1 className="text-lg font-bold text-slate-800 leading-tight">
            Welcome back, {user?.split(' ')[0]}!
          </h1>
          {/* <p className="text-xs font-medium text-slate-500">
            {now}
          </p> */}
        </div>
      </div>

      {/* ================= RIGHT ACTIONS ================= */}
      <div className="flex items-center gap-4 w-full md:w-auto justify-end">
        
        {/* AVATAR */}
        <div className="hidden md:flex h-10 w-10 rounded-full bg-primary-50 border border-primary-100 items-center justify-center text-primary-600">
          <User size={20} />
        </div>

        {/* LOGOUT */}
        <button
          onClick={logout}
          className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold text-red-600 
                     bg-red-50 hover:bg-red-100 hover:text-red-700
                     border border-red-100 hover:border-red-200
                     transition-all duration-200"
        >
          <LogOut size={16} />
          <span>Logout</span>
        </button>

      </div>
    </div>
  );
}
