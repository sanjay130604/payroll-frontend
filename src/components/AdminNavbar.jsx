// import { useEffect, useState } from "react";
// import { useNavigate } from "react-router-dom";

// export default function AdminNavbar() {
//   const navigate = useNavigate();
//   const [time, setTime] = useState(new Date());
//   const [location, setLocation] = useState("Loading...");

//   useEffect(() => {
//     const timer = setInterval(() => setTime(new Date()), 1000);

//     if (navigator.geolocation) {
//       navigator.geolocation.getCurrentPosition(
//         () => setLocation("India"),
//         () => setLocation("Unknown Location")
//       );
//     } else {
//       setLocation("Location Not Supported");
//     }

//     return () => clearInterval(timer);
//   }, []);

//   const logout = () => {
//     localStorage.removeItem("adminToken");
//     navigate("/admin/login");
//   };

//   return (
//     <nav className="flex items-center justify-between px-10 py-4 bg-white shadow">
      
//       {/* LEFT */}
//       <div className="flex items-center gap-4">
//         <div className="w-12 h-12 rounded-full bg-gray-200 overflow-hidden">
//           <img
//             src="/vtab.jpeg"   // ✅ Image from public folder
//             alt="VTAB Logo"
//             className="w-full h-full object-contain"
//           />
//         </div>

//         <h1 className="text-xl font-semibold text-gray-800">
//           VTAB Square Private Limited
//         </h1>
//       </div>

//       {/* RIGHT */}
//       <div className="flex items-center gap-6 text-sm text-gray-600">
//         <span>{time.toLocaleDateString()}</span>
//         <span>{time.toLocaleTimeString()}</span>
//         <span>{location}</span>

//         <button
//           onClick={logout}
//           className="px-5 py-2 bg-red-500 text-white rounded hover:bg-red-600 transition"
//         >
//           Logout
//         </button>
//       </div>
//     </nav>
//   );
// }

import { useEffect, useState } from "react";
import { useNavigate, useOutletContext } from "react-router-dom";
import { Menu, LogOut, Clock, MapPin } from "lucide-react";

export default function AdminNavbar() {
  const navigate = useNavigate();
  const { setOpen } = useOutletContext() || {};
  const [time, setTime] = useState(new Date());

  useEffect(() => {
    const t = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(t);
  }, []);

  return (
    <nav className="flex items-center justify-between px-6 py-4 bg-white border-b border-slate-100">
      
      {/* LEFT */}
      <div className="flex items-center gap-4">
        {/* MOBILE MENU */}
        <button
          onClick={() => setOpen(true)}
          className="md:hidden p-2 rounded-lg text-slate-500 hover:bg-slate-50 transition-colors"
        >
          <Menu size={24} />
        </button>

        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-xl bg-gradient-to-tr from-slate-800 to-slate-700 flex items-center justify-center text-white shadow-md md:hidden">
            <span className="font-bold text-lg">A</span>
          </div>
          <h1 className="hidden md:block font-bold text-xl text-slate-800 tracking-tight">
            Administration
          </h1>
        </div>
      </div>

      {/* RIGHT */}
      <div className="flex items-center gap-6">
        
        {/* TIME WIDGET */}
        <div className="hidden md:flex items-center gap-2 px-4 py-2 rounded-full bg-slate-50 text-slate-600 text-sm font-medium border border-slate-100">
          <Clock size={16} className="text-slate-400" />
          <span>{time.toLocaleDateString()}</span>
          <span className="w-1 h-1 rounded-full bg-slate-300 mx-1"></span>
          <span>{time.toLocaleTimeString()}</span>
        </div>

        <button
          onClick={() => {
            localStorage.removeItem("adminToken");
            navigate("/admin/login");
          }}
          className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold text-red-600 hover:bg-red-50 transition-colors"
        >
          <LogOut size={18} />
          <span className="hidden md:inline">Logout</span>
        </button>
      </div>
    </nav>
  );
}
