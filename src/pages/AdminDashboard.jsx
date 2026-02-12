import { LayoutDashboard } from "lucide-react";

export default function AdminDashboard() {
  return (
    <div className="bg-white rounded-2xl shadow-card border border-slate-100 p-12 text-center">
      <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-6 text-slate-400">
        <LayoutDashboard size={40} />
      </div>
      <h1 className="text-3xl font-bold text-slate-900 mb-4">
        Admin Dashboard
      </h1>

      <p className="text-slate-500 text-lg max-w-lg mx-auto leading-relaxed">
        This is a legacy dashboard view. Please use the sidebar navigation to access the main Admin Panel or specific management modules.
      </p>
    </div>
  );
}
