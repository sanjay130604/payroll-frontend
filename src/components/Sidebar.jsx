import { useNavigate, useLocation } from "react-router-dom";
import { User, History, Info, HelpCircle, LogOut } from "lucide-react";

export default function Sidebar() {
  const navigate = useNavigate();
  const location = useLocation();

  const menu = [
    {
      label: "Profile",
      path: "/payroll-summary",
      icon: <User size={20} />
    },
    {
      label: "History",
      path: "/salary-history",
      icon: <History size={20} />
    },
    {
      label: "About",
      path: "/about",
      icon: <Info size={20} />
    },
    {
      label: "Help",
      path: "/help",
      icon: <HelpCircle size={20} />
    }
  ];

  return (
    <aside className="w-72 min-h-screen bg-white border-r border-slate-100 hidden md:flex flex-col shadow-sm z-50">
      {/* Brand Section */}
      <div className="px-8 py-8 border-b border-slate-50">
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-xl bg-gradient-to-tr from-primary-600 to-primary-400 flex items-center justify-center text-white shadow-lg shadow-primary-200">
            <span className="font-bold text-lg">V</span>
          </div>
          <div>
            <h2 className="text-lg font-bold text-slate-800 tracking-tight">VTAB Payroll</h2>
            <p className="text-xs font-medium text-slate-400 uppercase tracking-wider">User Panel</p>
          </div>
        </div>
      </div>

      {/* Navigation Menu */}
      <nav className="flex-1 px-4 py-8 space-y-2">
        {menu.map(item => {
          const active = location.pathname === item.path;

          return (
            <div
              key={item.label}
              onClick={() => navigate(item.path)}
              className={`
                group flex items-center gap-3.5 px-5 py-3.5 rounded-xl cursor-pointer transition-all duration-200 ease-in-out
                ${
                  active
                    ? "bg-primary-50 text-primary-600 shadow-sm ring-1 ring-primary-100"
                    : "text-slate-500 hover:bg-slate-50 hover:text-slate-900"
                }
              `}
            >
              <span className={`transition-colors duration-200 ${active ? "text-primary-600" : "text-slate-400 group-hover:text-slate-600"}`}>
                {item.icon}
              </span>
              <span className="font-medium text-sm tracking-wide">{item.label}</span>
              
              {active && (
                <div className="ml-auto w-1.5 h-1.5 rounded-full bg-primary-500 shadow-[0_0_8px_rgba(14,165,233,0.6)]" />
              )}
            </div>
          );
        })}
      </nav>

      {/* Footer / Logout Placeholder */}
      <div className="p-4 border-t border-slate-50">
        <div className="px-4 py-3 rounded-xl bg-slate-50 text-slate-500 text-xs font-medium text-center">
          {new Date().getFullYear()} V Tab Square
        </div>
      </div>
    </aside>
  );
}
