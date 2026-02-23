import { useNavigate } from "react-router-dom";
import { ArrowRight, CheckCircle, Shield, Zap } from "lucide-react";
import { motion } from "framer-motion";

/* =======================
   NAVBAR
======================= */
const Navbar = () => {
  const navigate = useNavigate();

  const scrollToSection = (id) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <motion.nav
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      className="fixed w-full z-50 bg-white/90 backdrop-blur-md border-b border-slate-100"
    >
      <div className="max-w-7xl mx-auto px-6 md:px-8 py-4 flex items-center justify-between">

        {/* LOGO */}
        <motion.div
          whileHover={{ scale: 1.05 }}
          className="flex items-center gap-3 cursor-pointer group"
          onClick={() => scrollToSection("home")}
        >
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-primary-600 to-primary-500 flex items-center justify-center shadow-lg shadow-primary-200 group-hover:scale-110 transition-transform">
            <span className="text-white font-bold text-xl">V</span>
          </div>

          <span className="text-lg font-bold text-slate-800 tracking-tight">
            VTAB Square
          </span>
        </motion.div>

        {/* ACTIONS */}
        <div className="flex items-center gap-4">
          <button
            onClick={() => navigate("/login")}
            className="text-slate-600 font-semibold hover:text-primary-600 transition-colors px-4 py-2"
          >
            Employee Login
          </button>

          <motion.button
            whileHover={{ scale: 1.05, translateY: -2 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => navigate("/admin/login")}
            className="px-6 py-2.5 rounded-full bg-slate-900 text-white font-medium hover:bg-slate-800 hover:shadow-xl transition-all"
          >
            Admin Login
          </motion.button>
        </div>
      </div>
    </motion.nav>
  );
};

/* =======================
   HERO
======================= */
const Hero = () => {
  const navigate = useNavigate();

  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 }
  };

  return (
    <section
      id="home"
      className="relative pt-40 pb-32 overflow-hidden bg-slate-50"
    >
      {/* Background Blobs */}
      <motion.div
        animate={{
          scale: [1, 1.1, 1],
          opacity: [0.3, 0.4, 0.3]
        }}
        transition={{ duration: 10, repeat: Infinity }}
        className="absolute top-0 right-0 -translate-y-1/2 translate-x-1/2 w-[800px] h-[800px] bg-primary-100/40 rounded-full blur-3xl pointer-events-none"
      ></motion.div>
      <motion.div
        animate={{
          scale: [1, 1.2, 1],
          opacity: [0.3, 0.5, 0.3]
        }}
        transition={{ duration: 12, repeat: Infinity, delay: 1 }}
        className="absolute bottom-0 left-0 translate-y-1/2 -translate-x-1/2 w-[600px] h-[600px] bg-blue-100/40 rounded-full blur-3xl pointer-events-none"
      ></motion.div>

      <div className="max-w-7xl mx-auto px-6 md:px-8 grid lg:grid-cols-2 gap-16 items-center relative z-10">

        <motion.div
          variants={container}
          initial="hidden"
          animate="show"
          className="text-center lg:text-left"
        >
          <motion.div variants={item} className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary-50 border border-primary-100 text-primary-700 text-sm font-semibold mb-6">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-primary-500"></span>
            </span>
            Next Gen Payroll System
          </motion.div>

          <motion.h1
            variants={item}
            className="text-5xl md:text-6xl lg:text-7xl font-bold text-slate-900 mb-6 leading-tight tracking-tight"
          >
            Payroll made <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary-600 to-primary-400">
              Simple & Secure.
            </span>
          </motion.h1>

          <motion.p
            variants={item}
            className="text-slate-600 text-lg md:text-xl max-w-2xl mx-auto lg:mx-0 mb-10 leading-relaxed"
          >
            Automate your salary processing, manage employee records, and generate payslips instantly with VTAB Square's advanced payroll solution.
          </motion.p>

          <motion.div variants={item} className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
            <motion.button
              whileHover={{ scale: 1.05, translateY: -2 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => navigate("/login")}
              className="px-8 py-4 rounded-full bg-primary-600 text-white font-semibold text-lg shadow-xl shadow-primary-500/30 hover:bg-primary-700 hover:shadow-primary-600/40 transition-all flex items-center justify-center gap-2 group"
            >
              Employee Login
              <ArrowRight className="group-hover:translate-x-1 transition-transform" size={20} />
            </motion.button>

            <motion.button
              whileHover={{ scale: 1.05, translateY: -2 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => navigate("/admin/login")}
              className="px-8 py-4 rounded-full bg-white text-slate-700 border border-slate-200 font-semibold text-lg hover:bg-slate-50 hover:border-slate-300 transition-all flex items-center justify-center gap-2"
            >
              Admin Access
            </motion.button>
          </motion.div>

          <motion.div variants={item} className="mt-12 flex items-center justify-center lg:justify-start gap-8 text-slate-500 text-sm font-medium">
            <div className="flex items-center gap-2">
              <CheckCircle size={18} className="text-emerald-500" />
              <span>Instant Payslips</span>
            </div>
            <div className="flex items-center gap-2">
              <Shield size={18} className="text-emerald-500" />
              <span>Bank-grade Security</span>
            </div>
            <div className="flex items-center gap-2">
              <Zap size={18} className="text-emerald-500" />
              <span>Fast Processing</span>
            </div>
          </motion.div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: 40 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 1, delay: 0.4 }}
          className="relative hidden lg:block"
        >
          <div className="absolute inset-0 bg-gradient-to-tr from-primary-600 to-primary-400 rounded-[2rem] rotate-3 opacity-20 blur-lg transform scale-95 translate-y-4"></div>
          <div className="relative rounded-[2rem] overflow-hidden shadow-2xl border-8 border-white bg-slate-100">
            <img
              src="https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&q=80&w=2070"
              alt="Dashboard Preview"
              className="w-full h-auto object-cover hover:scale-105 transition-transform duration-700"
            />
            {/* Floating Badge */}
            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 1, duration: 0.6 }}
              className="absolute bottom-8 left-8 bg-white/90 backdrop-blur p-4 rounded-xl shadow-lg flex items-center gap-4"
            >
              <div className="h-10 w-10 bg-green-100 rounded-full flex items-center justify-center text-green-600">
                <CheckCircle size={20} />
              </div>
              <div>
                <p className="text-xs text-slate-500 font-semibold uppercase">Status</p>
                <p className="text-slate-800 font-bold">Payroll Processed</p>
              </div>
            </motion.div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

/* =======================
   EXPORT
======================= */
export default function LandingPage() {
  return (
    <div className="bg-white min-h-screen">
      <Navbar />
      <Hero />
    </div>
  );
}
