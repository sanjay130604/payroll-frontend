import { useState } from "react";
import { ArrowLeft, Mail, Lock, Loader2 } from "lucide-react";
import axios from "../utils/axiosConfig";
import { useNavigate } from "react-router-dom";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [msg, setMsg] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  /* ================= LOGIN ================= */
  const submit = async (e) => {
    e.preventDefault();
    if (!email || !password) {
      setMsg("Email and password required");
      return;
    }

    setIsLoading(true);
    setMsg("");

    try {
      const res = await axios.post(
        "/api/auth/login",
        { email, password }
      );

      

      if (res.data.success) {
        localStorage.setItem("userEmail", res.data.email);
        localStorage.setItem("resetEmail", res.data.email);
        navigate("/payroll-summary");
      } else {
        setMsg("Invalid credentials");
      }
    } catch (err) {
      setMsg(err.response?.data?.message || "Server error");
    } finally {
      setIsLoading(false);
    }
  };

  /* ================= FORGOT PASSWORD ================= */
  const goToForgot = () => {
    if (!email.trim()) {
      setMsg("Please enter email first");
      return;
    }
    localStorage.setItem("resetEmail", email.trim());
    navigate("/forgot");
  };

  return (
    <div className="min-h-screen w-full flex bg-slate-50 relative overflow-hidden">

      {/* Background decoration */}
      <div className="absolute top-0 left-0 w-full h-full bg-white z-0">
        <div className="absolute top-[-10%] right-[-5%] w-[500px] h-[500px] rounded-full bg-primary-100/50 blur-3xl"></div>
        <div className="absolute bottom-[-10%] left-[-5%] w-[500px] h-[500px] rounded-full bg-blue-100/50 blur-3xl"></div>
      </div>

      {/* ================= LEFT INFO ================= */}
      <div className="hidden lg:flex w-1/2 relative z-10 flex-col justify-center px-24 bg-gradient-to-br from-primary-600 to-primary-800 text-white clip-path-slant">
        {/* Abstract Pattern Overlay */}
        <div className="absolute inset-0 opacity-10 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')]"></div>

        <div className="relative z-20">
          <div className="flex items-center gap-4 mb-12">
            <div className="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center border border-white/30 shadow-lg">
              <span className="text-white font-bold text-2xl">V</span>
            </div>
            <span className="text-2xl font-bold tracking-tight">VTAB SQUARE</span>
          </div>

          <h1 className="text-5xl font-bold mb-6 leading-tight">
            Seamless <br /> Payroll Management
          </h1>
          <p className="text-primary-100 text-lg max-w-md leading-relaxed">
            Securely access your payslips, manage your tax declarations, and track your financial growth all in one place.
          </p>
        </div>
      </div>

      {/* ================= RIGHT LOGIN CARD ================= */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-6 relative z-20">

        <button
          onClick={() => navigate("/")}
          className="absolute top-8 right-8 flex items-center gap-2 px-4 py-2 text-slate-500 hover:text-primary-600 hover:bg-white rounded-full transition-all text-sm font-medium"
        >
          <ArrowLeft size={18} />
          <span>Back to Home</span>
        </button>

        <div className="bg-white w-full max-w-md rounded-3xl shadow-xl shadow-slate-200/50 p-10 border border-slate-100">

          <div className="text-center mb-10">
            {/* User Login Badge */}
            <div className="inline-flex items-center justify-center mb-4">
              <span className="px-6 py-2 bg-slate-900 text-white font-semibold text-sm rounded-full tracking-wide">
                USER LOGIN
              </span>
            </div>

            <h2 className="text-3xl font-bold text-slate-800 mb-2">Welcome Back</h2>
            <p className="text-slate-500">Please enter your details to sign in</p>
          </div>

          <form onSubmit={submit} className="space-y-6">

            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-700 ml-1">Email Address</label>
              <div className="relative">
                <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400">
                  <Mail size={20} />
                </div>
                <input
                  type="email"
                  placeholder="Enter your email"
                  className="w-full pl-12 pr-4 py-3.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 transition-all text-slate-800 placeholder:text-slate-400"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
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
                  placeholder="Enter your password"
                  className="w-full pl-12 pr-4 py-3.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 transition-all text-slate-800 placeholder:text-slate-400"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>
            </div>

            <div className="flex justify-end">
              <button
                type="button"
                onClick={goToForgot}
                className="text-sm font-medium text-primary-600 hover:text-primary-700 hover:underline transition-all"
              >
                Forgot Password?
              </button>
            </div>

            {msg && (
              <div className="p-3 rounded-lg bg-red-50 border border-red-100 text-red-600 text-sm text-center font-medium">
                {msg}
              </div>
            )}

            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-primary-600 hover:bg-primary-700 text-white py-3.5 rounded-xl font-semibold shadow-lg shadow-primary-500/30 hover:shadow-primary-600/40 active:scale-[0.98] transition-all flex items-center justify-center gap-2"
            >
              {isLoading ? (
                <>
                  <Loader2 size={20} className="animate-spin" />
                  <span>Signing in...</span>
                </>
              ) : (
                "Sign In"
              )}
            </button>
          </form>

          <div className="mt-8 text-center">
            <p className="text-slate-500 text-sm">
              Don't have an account? <span className="text-primary-600 font-semibold cursor-pointer hover:underline">Contact Admin</span>
            </p>
          </div>

        </div>
      </div>
    </div>
  );
}
