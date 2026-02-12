// import { Outlet } from "react-router-dom";
// import AdminSidebar from "./AdminSidebar";

// export default function AdminLayout() {
//   return (
//     <div className="flex min-h-screen bg-[#F4F6FA]">
//       <AdminSidebar />

//       <main className="flex-1 overflow-y-auto">
//         <Outlet />
//       </main>
//     </div>
//   );
// }

import { useState } from "react";
import { Outlet } from "react-router-dom";
import AdminSidebar from "./AdminSidebar";
import AdminNavbar from "./AdminNavbar";

export default function AdminLayout() {
  const [open, setOpen] = useState(false);

  return (
    <div className="flex min-h-screen bg-slate-50 font-sans text-slate-900">
      <AdminSidebar open={open} setOpen={setOpen} />

      {/* MAIN CONTENT */}
      <main className="flex-1 min-w-0 flex flex-col h-screen overflow-hidden transition-all duration-300">
        <AdminNavbar setOpen={setOpen} />

        <div className="flex-1 overflow-y-auto">
          <Outlet context={{ setOpen }} />
        </div>
      </main>
    </div>
  );
}
