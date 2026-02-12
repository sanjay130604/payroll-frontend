import { CheckCircle, Users, Layers, ShieldCheck, Clock, ArrowRight } from "lucide-react";

export default function About() {
  return (
    <div className="w-full bg-slate-50 animate-in fade-in duration-500">

      {/* ================= HERO SECTION ================= */}
      <section className="relative py-24 bg-white overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-full">
          <div className="absolute top-[-10%] right-[-5%] w-[600px] h-[600px] rounded-full bg-primary-50/50 blur-3xl"></div>
          <div className="absolute bottom-[-10%] left-[-5%] w-[500px] h-[500px] rounded-full bg-blue-50/50 blur-3xl"></div>
        </div>

        <div className="max-w-7xl mx-auto px-6 relative z-10 text-center">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary-50 border border-primary-100 text-primary-700 text-sm font-semibold mb-6">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-primary-500"></span>
            </span>
            About Us
          </div>

          <h1 className="text-5xl md:text-6xl font-bold text-slate-900 mb-6 tracking-tight">
            Revolutionizing <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary-600 to-primary-400">
              Payroll Management
            </span>
          </h1>

          <p className="text-xl text-slate-600 max-w-2xl mx-auto leading-relaxed">
            VTAB Payroll Portal is designed to simplify complex financial workflows,
            empowering organizations with precision, security, and speed.
          </p>
        </div>
      </section>

      {/* ================= WHY VTAB ================= */}
      <section className="max-w-7xl mx-auto px-6 py-20 grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">

        {/* LEFT */}
        <div>
          <h2 className="text-3xl font-bold text-slate-800 mb-6">
            Why VTAB Payroll is the Choice for Modern Businesses?
          </h2>

          <p className="text-slate-600 mb-10 text-lg leading-relaxed">
            We bridge the gap between HR and Finance, offering a unified platform
            that automates salary calculations, compliance, and employee self-service.
          </p>

          <div className="space-y-6">
            <Feature
              title="Automated Payroll"
              desc="Zero-error salary calculation with automated allowances and deductions processing."
              icon={<Layers className="text-white" size={20} />}
            />
            <Feature
              title="Employee Management"
              desc="Centralized database to view, manage, and track employee lifecycle records."
              icon={<Users className="text-white" size={20} />}
            />
            <Feature
              title="Secure & Reliable"
              desc="Enterprise-grade security with encrypted data flow and role-based access control."
              icon={<ShieldCheck className="text-white" size={20} />}
            />
          </div>
        </div>

        {/* RIGHT IMAGES */}
        <div className="relative">
          <div className="absolute inset-0 bg-gradient-to-tr from-primary-600 to-primary-400 rounded-3xl rotate-3 opacity-20 blur-lg transform scale-95 translate-y-4"></div>
          <div className="grid grid-cols-2 gap-4 relative z-10">
            <img
              src="https://images.unsplash.com/photo-1551836022-d5d88e9218df?auto=format&fit=crop&q=80&w=800"
              className="rounded-2xl h-64 w-full object-cover shadow-lg transform translate-y-8"
              alt="Office"
            />
            {/* <img
              src="https://images.unsplash.com/photo-1581091870622-3d5c1f62c66b?auto=format&fit=crop&q=80&w=800"
              className="rounded-2xl h-64 w-full object-cover shadow-lg"
              alt="Tech"
            /> */}

          </div>
        </div>
      </section>

      {/* ================= STATS ================= */}
      <section className="bg-white py-20 border-y border-slate-100">
        <div className="max-w-7xl mx-auto px-6 grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
          <Stat number="890+" label="Payroll Records" icon={<Layers size={24} />} />
          <Stat number="5+" label="Core Modules" icon={<Users size={24} />} />
          <Stat number="12+" label="Smart Features" icon={<CheckCircle size={24} />} />
          <Stat number="99.9%" label="Uptime Reliability" icon={<Clock size={24} />} />
        </div>
      </section>

      {/* ================= ABOUT COMPANY ================= */}
      <section className="max-w-7xl mx-auto px-6 py-24 grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">

        <div className="relative order-2 lg:order-1">
          <div className="absolute -top-4 -left-4 w-24 h-24 bg-primary-100 rounded-full blur-xl"></div>
          <img
            src="https://images.unsplash.com/photo-1600880292203-757bb62b4baf?auto=format&fit=crop&q=80&w=1000"
            className="rounded-3xl shadow-2xl relative z-10"
            alt="Meeting"
          />
          <div className="absolute bottom-8 right-[-2rem] bg-white p-6 rounded-2xl shadow-xl z-20 max-w-xs border border-slate-100 hidden md:block">
            <p className="text-4xl font-bold text-primary-600 mb-1">5+ Years</p>
            <p className="text-slate-500 font-medium">Of Excellence in Financial Tech</p>
          </div>
        </div>

        <div className="order-1 lg:order-2">
          <div className="inline-block text-primary-600 font-bold tracking-wider uppercase mb-3 text-sm">About VTAB</div>
          <h2 className="text-4xl font-bold text-slate-900 mb-6">
            Empowering Business Growth
          </h2>

          <div className="prose prose-slate text-slate-600 text-lg">
            <p className="mb-6">
              VTAB Payroll Portal is a cutting-edge web-based solution built on a robust
              React.js and Node.js architecture. We help organizations streamline their
              financial operations, ensuring every employee is paid on time, every time.
            </p>
            <p className="mb-8">
              Our system provides intuitive dashboards, comprehensive reporting, and
              seamless scalability, making it the perfect choice for growing companies
              that demand efficiency.
            </p>
          </div>

          <button className="bg-slate-900 text-white px-8 py-3.5 rounded-xl font-semibold hover:bg-slate-800 transition-all flex items-center gap-2 group">
            Read Our Story
            <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
          </button>
        </div>
      </section>

      {/* ================= CTA ================= */}
      <section className="relative py-24 bg-primary-900 overflow-hidden">
        <div className="absolute inset-0 opacity-20 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')]"></div>
        <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-primary-600 rounded-full blur-[100px] opacity-30"></div>

        <div className="max-w-4xl mx-auto px-6 text-center relative z-10">
          <h2 className="text-white text-4xl md:text-5xl font-bold mb-6 tracking-tight">
            Ready to streamline your payroll?
          </h2>
          <p className="text-primary-100 text-lg mb-10 max-w-2xl mx-auto">
            Join hundreds of employees managing their finances effortlessly with VTAB.
            Get in touch with us for a custom demo.
          </p>
          <button className="bg-white text-primary-900 px-10 py-4 rounded-full font-bold text-lg hover:bg-primary-50 transition-all shadow-xl hover:shadow-2xl hover:-translate-y-1">
            Contact Support
          </button>
        </div>
      </section>

    </div>
  );
}

/* ================= SMALL COMPONENTS ================= */

const Feature = ({ title, desc, icon }) => (
  <div className="flex gap-5 group">
    <div className="w-12 h-12 flex-shrink-0 flex items-center justify-center bg-primary-500 rounded-xl shadow-lg shadow-primary-500/30 group-hover:scale-110 transition-transform duration-300">
      {icon}
    </div>
    <div>
      <h4 className="font-bold text-slate-800 text-lg mb-2">{title}</h4>
      <p className="text-slate-600 leading-relaxed">{desc}</p>
    </div>
  </div>
);

const Stat = ({ number, label, icon }) => (
  <div className="p-6 rounded-2xl bg-slate-50 border border-slate-100 hover:bg-white hover:shadow-xl transition-all duration-300 group">
    <div className="flex justify-center mb-4 text-primary-500 group-hover:scale-110 transition-transform">
      {icon}
    </div>
    <h3 className="text-4xl font-bold text-slate-900 mb-2">{number}</h3>
    <p className="text-slate-500 font-medium">{label}</p>
  </div>
);
