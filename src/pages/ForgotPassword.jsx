import { useEffect, useState } from "react";
import axios from "../utils/axiosConfig";
import { useNavigate } from "react-router-dom";
import { Mail, Lock, Key, ArrowLeft, Loader2, CheckCircle } from "lucide-react";

export default function ForgotPassword() {
  const navigate = useNavigate();

  const [step, setStep] = useState(1);
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [password, setPassword] = useState("");
  const [msg, setMsg] = useState("");
  const [loading, setLoading] = useState(false);

  /* ================= LOAD EMAIL ================= */
  useEffect(() => {
    const savedEmail = localStorage.getItem("resetEmail");
    if (!savedEmail) {
      navigate("/login"); // ✅ FIXED
    } else {
      setEmail(savedEmail);
    }
  }, [navigate]);

  /* ================= SEND OTP ================= */
  const sendOtp = async () => {
    if (!email) {
      setMsg("Email not found");
      return;
    }

    setMsg("");
    setLoading(true);

    try {
      const res = await axios.post("/api/auth/forgot", { email });

      if (res.data?.success) {
        setStep(2);
        setMsg("OTP has been sent to your email");
      } else {
        setMsg(res.data?.message || "Email not found");
      }
    } catch (err) {
      setMsg(err.response?.data?.message || "Server error");
    } finally {
      setLoading(false);
    }
  };

  /* ================= RESET PASSWORD ================= */
  const reset = async () => {
    if (!otp || otp.length !== 6) {
      setMsg("Please enter a valid 6-digit OTP");
      return;
    }

    if (!password || password.length < 8) {
      setMsg("Password must be at least 8 characters");
      return;
    }

    setMsg("");
    setLoading(true);

    try {
      const res = await axios.post("/api/auth/reset", {
        email,
        otp,
        password
      });

      if (res.data?.success) {
        alert("Password reset successful ✅");
        localStorage.removeItem("resetEmail");
        navigate("/login"); // ✅ FIXED
      } else {
        setMsg(res.data?.message || "Invalid OTP");
      }
    } catch (err) {
      setMsg(err.response?.data?.message || "Reset failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-slate-50 relative overflow-hidden px-4">

      {/* Background decoration */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-[-10%] left-[-5%] w-[500px] h-[500px] rounded-full bg-primary-100/50 blur-3xl" />
        <div className="absolute bottom-[-10%] right-[-5%] w-[500px] h-[500px] rounded-full bg-blue-100/50 blur-3xl" />
      </div>

      <div className="w-full max-w-md bg-white rounded-3xl shadow-xl p-10 border relative z-10">

        {/* HEADER */}
        <div className="text-center mb-8">
          <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-primary-50 text-primary-600 flex items-center justify-center">
            {step === 1 ? <Key size={32} /> : <Lock size={32} />}
          </div>

          <h2 className="text-2xl font-bold text-slate-800">
            {step === 1 ? "Reset Password" : "Create New Password"}
          </h2>

          <p className="text-slate-500 mt-2 text-sm">
            {step === 1
              ? "We'll send a verification code to your email."
              : "Enter the code and your new password."}
          </p>
        </div>

        {/* STEP INDICATOR */}
        <div className="flex gap-2 mb-8">
          <div className={`h-1.5 flex-1 rounded-full ${step >= 1 ? "bg-primary-500" : "bg-slate-200"}`} />
          <div className={`h-1.5 flex-1 rounded-full ${step >= 2 ? "bg-primary-500" : "bg-slate-200"}`} />
        </div>

        {/* STEP 1 */}
        {step === 1 && (
          <div className="space-y-6">
            <div>
              <label className="text-sm font-medium text-slate-700">Registered Email</label>
              <div className="relative mt-1">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  value={email}
                  disabled
                  className="w-full pl-12 pr-4 py-3 bg-slate-50 border rounded-xl text-slate-500"
                />
                <CheckCircle className="absolute right-4 top-1/2 -translate-y-1/2 text-emerald-500" />
              </div>
            </div>

            <button
              onClick={sendOtp}
              disabled={loading}
              className="w-full py-3 bg-primary-600 text-white rounded-xl font-semibold flex justify-center"
            >
              {loading ? <Loader2 className="animate-spin" /> : "Send Verification Code"}
            </button>
          </div>
        )}

        {/* STEP 2 */}
        {step === 2 && (
          <div className="space-y-5">
            <input
              placeholder="Enter 6-digit OTP"
              value={otp}
              onChange={(e) => setOtp(e.target.value.replace(/\D/g, ""))}
              maxLength={6}
              className="w-full py-3 text-center border rounded-xl tracking-widest font-mono"
            />

            <div className="relative">
              <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="password"
                placeholder="Minimum 8 characters"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full pl-12 pr-4 py-3 border rounded-xl"
              />
            </div>

            <button
              onClick={reset}
              disabled={loading}
              className="w-full py-3 bg-primary-600 text-white rounded-xl font-semibold flex justify-center"
            >
              {loading ? <Loader2 className="animate-spin" /> : "Reset Password"}
            </button>
          </div>
        )}

        {/* MESSAGE */}
        {msg && (
          <div className={`mt-6 p-3 rounded-lg text-sm text-center ${
            msg.includes("sent") ? "bg-emerald-50 text-emerald-600" : "bg-red-50 text-red-600"
          }`}>
            {msg}
          </div>
        )}

        {/* FOOTER */}
        <div className="mt-8 text-center">
          <button
            onClick={() => navigate("/login")}
            className="text-sm text-slate-500 hover:text-slate-800 flex items-center gap-2 mx-auto"
          >
            <ArrowLeft size={16} />
            Back to Login
          </button>
        </div>

      </div>
    </div>
  );
}
