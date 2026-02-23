import { useState } from "react";
import { ArrowLeft, Mail, Lock, ShieldAlert, Loader2 } from "lucide-react";
import axios from "../utils/axiosConfig";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";

export default function AdminLogin() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [msg, setMsg] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const login = async (e) => {
    e.preventDefault();
    if (!email || !password) {
      setMsg("Email and password required");
      return;
    }

    setIsLoading(true);
    setMsg("");

    try {
      const res = await axios.post(
        "/api/admin/login",
        { email, password }
      );

      if (res.data.success) {
        localStorage.removeItem("adminResetEmail");
        localStorage.setItem("adminToken", res.data.token);
        navigate("/adminpanel");
      }
    } catch (err) {
      setMsg(err.response?.data?.message || "Login failed");
    } finally {
      setIsLoading(false);
    }
  };

  const forgot = () => {
    if (!email) {
      setMsg("Please enter email first");
      return;
    }
    localStorage.setItem("adminResetEmail", email);
    navigate("/admin/forgot");
  };

  return (
    <div className="min-h-screen w-full flex bg-slate-900 relative overflow-hidden">

      {/* Background decoration */}
      <div className="absolute top-0 left-0 w-full h-full z-0 overflow-hidden">
        <motion.div
          animate={{ scale: [1, 1.1, 1], rotate: [0, 5, 0] }}
          transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
          className="absolute -top-[20%] -right-[10%] w-[800px] h-[800px] rounded-full bg-indigo-600/20 blur-[100px]"
        ></motion.div>
        <motion.div
          animate={{ scale: [1, 1.2, 1], rotate: [0, -5, 0] }}
          transition={{ duration: 12, repeat: Infinity, ease: "linear" }}
          className="absolute -bottom-[20%] -left-[10%] w-[600px] h-[600px] rounded-full bg-blue-600/20 blur-[100px]"
        ></motion.div>
      </div>

      {/* LEFT – ADMIN LOGIN CARD */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-6 relative z-20">
        <motion.div
          initial={{ x: -50, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ duration: 0.6 }}
          className="bg-white w-full max-w-md rounded-3xl shadow-2xl p-10 border border-slate-100"
        >

          <div className="text-center mb-10">
            <motion.div
              initial={{ scale: 0.8, rotate: -10 }}
              animate={{ scale: 1, rotate: 0 }}
              transition={{ type: "spring", damping: 10 }}
              className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-indigo-50 text-indigo-600 mb-6"
            >
              <ShieldAlert size={32} />
            </motion.div>
            <h2 className="text-3xl font-bold text-slate-900 mb-2">
              Admin Portal
            </h2>
            <p className="text-slate-500">
              Restricted access for authorized personnel only
            </p>
          </div>

          <form onSubmit={login} className="space-y-6">
            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-700 ml-1">Admin Email</label>
              <div className="relative">
                <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400">
                  <Mail size={20} />
                </div>
                <input
                  type="email"
                  placeholder="admin@vtabsquare.com"
                  className="w-full pl-12 pr-4 py-3.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all text-slate-800"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-700 ml-1">Password</label>
              <div className="relative">
                <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400">
                  <Lock size={20} />
                </div>
                <input
                  type="password"
                  placeholder="Enter secure password"
                  className="w-full pl-12 pr-4 py-3.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all text-slate-800"
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                />
              </div>
            </div>

            <div className="flex justify-end">
              <button
                type="button"
                onClick={forgot}
                className="text-sm font-medium text-indigo-600 hover:text-indigo-700 hover:underline transition-all"
              >
                Forgot Password?
              </button>
            </div>

            <AnimatePresence>
              {msg && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  className="p-3 rounded-lg bg-red-50 border border-red-100 text-red-600 text-sm text-center font-medium flex items-center justify-center gap-2 overflow-hidden"
                >
                  <ShieldAlert size={16} />
                  {msg}
                </motion.div>
              )}
            </AnimatePresence>

            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              type="submit"
              disabled={isLoading}
              className="w-full bg-indigo-600 hover:bg-indigo-700 text-white py-3.5 rounded-xl font-semibold shadow-lg shadow-indigo-500/30 hover:shadow-indigo-600/40 transition-all flex items-center justify-center gap-2"
            >
              {isLoading ? (
                <>
                  <Loader2 size={20} className="animate-spin" />
                  <span>Verifying...</span>
                </>
              ) : (
                "Access Dashboard"
              )}
            </motion.button>
          </form>

          <div className="mt-8 text-center">
            <button
              onClick={() => navigate("/")}
              className="text-slate-400 hover:text-slate-600 text-sm font-medium flex items-center justify-center gap-2 mx-auto transition-colors"
            >
              <ArrowLeft size={16} />
              Return to Home
            </button>
          </div>

        </motion.div>
      </div>

      {/* RIGHT – ADMIN CONTENT */}
      <motion.div
        initial={{ x: 50, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        transition={{ duration: 0.8, delay: 0.2 }}
        className="hidden lg:flex w-1/2 relative z-20 flex-col justify-center px-24 text-white"
      >
        <div className="relative z-10">
          <div className="flex items-center gap-4 mb-12">
            <motion.div
              whileHover={{ rotate: 180 }}
              transition={{ duration: 0.6 }}
              className="w-12 h-12 bg-white/10 backdrop-blur-md rounded-2xl flex items-center justify-center border border-white/20"
            >
              <span className="text-white font-bold text-2xl">A</span>
            </motion.div>
            <span className="text-xl font-bold tracking-widest uppercase opacity-80">System Admin</span>
          </div>

          <motion.h1
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="text-5xl font-bold mb-6 leading-tight"
          >
            Advanced <br /> Control Center
          </motion.h1>

          <motion.p
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.6 }}
            className="text-indigo-200 text-lg leading-relaxed max-w-md border-l-4 border-indigo-500 pl-6"
          >
            Manage your organization's payroll, user permissions, and financial records with enterprise-grade security and precision.
          </motion.p>
        </div>
      </motion.div>

    </div>
  );
}
