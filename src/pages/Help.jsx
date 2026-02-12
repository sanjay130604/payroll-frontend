import { useState } from "react";
import { Send, FileText, Settings, Server, Lock, User, Shield, Radio, CreditCard, Search } from "lucide-react";

export default function Help() {
  const [email, setEmail] = useState("");
  const [topic, setTopic] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const submitRequest = (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Simulate API call
    setTimeout(() => {
      alert("Request submitted successfully!");
      setEmail("");
      setTopic("");
      setIsSubmitting(false);
    }, 1000);
  };

  return (
    <div className="min-h-screen bg-slate-50/50 p-8 md:p-12 animate-in fade-in duration-500">

      {/* ================= HEADER ================= */}
      <div className="max-w-6xl mx-auto mb-16 text-center">
        <h1 className="text-4xl font-bold text-slate-900 mb-4">
          How can we help you?
        </h1>
        <div className="relative max-w-xl mx-auto">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
          <input 
            type="text" 
            placeholder="Search for answers..." 
            className="w-full pl-12 pr-6 py-4 rounded-full border border-slate-200 shadow-sm focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 transition-all text-slate-700"
          />
        </div>
      </div>

      {/* ================= CONTACT SECTION ================= */}
      <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12 mb-24">

        {/* LEFT TEXT */}
        <div className="flex flex-col justify-center">
          <div className="inline-block px-4 py-1.5 rounded-full bg-primary-50 text-primary-700 text-sm font-semibold mb-6 w-fit">
            Support Center
          </div>
          <h2 className="text-3xl font-bold text-slate-800 mb-6">
            Contact Support
          </h2>
          <p className="text-lg text-slate-600 mb-8 leading-relaxed">
            Need assistance with your payroll or account? Our support team is here to help. 
            Fill out the form, and we'll get back to you within 24 hours.
          </p>
          
          <div className="space-y-4">
            <ContactInfo title="Email Us" desc="support@vtabsquare.com" />
            <ContactInfo title="Call Us" desc="+91 98765 43210" />
          </div>
        </div>

        {/* RIGHT FORM */}
        <form
          onSubmit={submitRequest}
          className="bg-white rounded-2xl shadow-card border border-slate-100 p-8 space-y-6"
        >
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">
              Your Email Address
            </label>
            <input
              type="email"
              required
              placeholder="name@company.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full border border-slate-200 rounded-xl px-4 py-3 focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 outline-none transition-all"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-3">
              Select a Topic
            </label>
            <div className="flex flex-wrap gap-2 mb-4">
              {[
                "Billing",
                "Login Issues",
                "Payroll Discrepancy",
                "Profile Update",
                "Technical Bug",
              ].map((item) => (
                <button
                  key={item}
                  type="button"
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                    topic === item 
                      ? "bg-primary-600 text-white shadow-md" 
                      : "bg-slate-50 text-slate-600 hover:bg-slate-100"
                  }`}
                  onClick={() => setTopic(item)}
                >
                  {item}
                </button>
              ))}
            </div>
            
            <input
              type="text"
              placeholder="Or type your own topic..."
              value={topic}
              onChange={(e) => setTopic(e.target.value)}
              className="w-full border border-slate-200 rounded-xl px-4 py-3 focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 outline-none transition-all"
            />
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full bg-slate-900 text-white py-3.5 rounded-xl font-semibold hover:bg-slate-800 transition-all flex items-center justify-center gap-2"
          >
            {isSubmitting ? "Sending..." : "Send Request"}
            {!isSubmitting && <Send size={18} />}
          </button>
        </form>
      </div>

      {/* ================= NEED HELP GRID ================= */}
      <div className="max-w-6xl mx-auto">
        <div className="flex items-center gap-4 mb-8">
          <div className="h-10 w-1 bg-primary-500 rounded-full"></div>
          <h2 className="text-2xl font-bold text-slate-800">
            Quick Help Resources
          </h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <HelpCard title="Getting Started" desc="New to VTAB? Start here." icon={<FileText className="text-emerald-500" />} />
          <HelpCard title="Admin Settings" desc="Manage workspace settings." icon={<Settings className="text-blue-500" />} />
          <HelpCard title="Server Status" desc="Check system health." icon={<Server className="text-purple-500" />} />
          <HelpCard title="Security" desc="Password & 2FA guides." icon={<Lock className="text-orange-500" />} />
          <HelpCard title="Account Info" desc="Update profile details." icon={<User className="text-pink-500" />} />
          <HelpCard title="Privacy Policy" desc="Data protection info." icon={<Shield className="text-cyan-500" />} />
          <HelpCard title="Integrations" desc="Connect external tools." icon={<Radio className="text-indigo-500" />} />
          <HelpCard title="Billing" desc="Invoices and plans." icon={<CreditCard className="text-rose-500" />} />
        </div>
      </div>
    </div>
  );
}

/* ================= COMPONENT HELPERS ================= */

const ContactInfo = ({ title, desc }) => (
  <div className="flex flex-col">
    <span className="text-sm font-semibold text-slate-400 uppercase tracking-wider">{title}</span>
    <span className="text-lg font-medium text-slate-800">{desc}</span>
  </div>
);

const HelpCard = ({ title, desc, icon }) => (
  <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 hover:shadow-card-hover hover:border-primary-100 transition-all cursor-pointer group">
    <div className="w-12 h-12 bg-slate-50 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300 group-hover:bg-white group-hover:shadow-sm">
      {icon}
    </div>
    <h3 className="font-bold text-slate-800 mb-1 group-hover:text-primary-600 transition-colors">{title}</h3>
    <p className="text-sm text-slate-500">{desc}</p>
  </div>
);
