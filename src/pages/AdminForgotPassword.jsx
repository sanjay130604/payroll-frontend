import { useEffect, useState } from "react";
import api from "../utils/axiosConfig";
import { useNavigate } from "react-router-dom";
import { ShieldCheck, ArrowLeft, Loader2 } from "lucide-react";

export default function AdminForgotPassword() {
  const navigate = useNavigate();

  const [step, setStep] = useState(1);
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [password, setPassword] = useState("");
  const [msg, setMsg] = useState("");
  const [loading, setLoading] = useState(false);

  /* ================= LOAD EMAIL ================= */
  useEffect(() => {
    const savedEmail = localStorage.getItem("adminResetEmail");
    if (!savedEmail) {
      navigate("/admin/login");
    } else {
      setEmail(savedEmail);
    }
  }, [navigate]);

  /* ================= SEND OTP ================= */
  const sendOtp = async () => {
    setMsg("");
    setLoading(true);

    try {
      const res = await api.post("/api/admin/forgot", { email });

      if (res.data.success) {
        setStep(2);
        setMsg("OTP sent to admin email");
      } else {
        setMsg("Admin email not found");
      }
    } catch (err) {
      setMsg("Failed to send OTP");
    } finally {
      setLoading(false);
    }
  };

  /* ================= RESET PASSWORD ================= */
  const resetPassword = async () => {
    setMsg("");
    setLoading(true);

    try {
      const res = await api.post("/api/admin/reset", {
        email,
        otp,
        password
      });

      if (res.data.success) {
        alert("Admin password reset successful ✅");
        localStorage.removeItem("adminResetEmail");
        navigate("/admin/login");
      } else {
        setMsg("Invalid OTP");
      }
    } catch {
      setMsg("Reset failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-900 px-4">
      <div className="w-full max-w-md bg-white rounded-3xl p-8 shadow-xl">

        <div className="text-center mb-6">
          <ShieldCheck className="mx-auto text-indigo-600" size={40} />
          <h2 className="text-2xl font-bold mt-3">Admin Recovery</h2>
          <p className="text-slate-500 text-sm mt-1">
            {step === 1
              ? "Verify your identity to reset password"
              : "Enter OTP and new password"}
          </p>
        </div>

        {/* STEP 1 */}
        {step === 1 && (
          <>
            <input
              disabled
              value={email}
              className="w-full mb-4 px-4 py-2 border rounded-lg bg-gray-100"
            />

            <button
              type="button"
              onClick={sendOtp}
              disabled={loading}
              className="w-full bg-indigo-600 text-white py-3 rounded-xl font-semibold"
            >
              {loading ? <Loader2 className="animate-spin mx-auto" /> : "Send OTP"}
            </button>
          </>
        )}

        {/* STEP 2 */}
        {step === 2 && (
          <>
            <input
              placeholder="Enter OTP"
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
              className="w-full mb-3 px-4 py-2 border rounded-lg"
            />

            <input
              type="password"
              placeholder="New Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full mb-4 px-4 py-2 border rounded-lg"
            />

            <button
              type="button"
              onClick={resetPassword}
              disabled={loading}
              className="w-full bg-indigo-600 text-white py-3 rounded-xl font-semibold"
            >
              {loading ? <Loader2 className="animate-spin mx-auto" /> : "Reset Password"}
            </button>
          </>
        )}

        {msg && (
          <div className="mt-4 text-center text-sm text-red-600">
            {msg}
          </div>
        )}

        <button
          onClick={() => navigate("/admin/login")}
          className="mt-6 text-sm text-slate-500 flex items-center gap-2 mx-auto"
        >
          <ArrowLeft size={16} /> Back to Admin Login
        </button>

      </div>
    </div>
  );
}


// import { useEffect, useState } from "react";
// import axios from "../utils/axiosConfig";
// import { useNavigate } from "react-router-dom";
// import { ShieldCheck, Mail, Lock, ArrowLeft, Loader2, Key } from "lucide-react";

// export default function AdminForgotPassword() {
//   const navigate = useNavigate();

//   const [step, setStep] = useState(1);
//   const [email, setEmail] = useState("");
//   const [otp, setOtp] = useState("");
//   const [password, setPassword] = useState("");
//   const [msg, setMsg] = useState("");
//   const [loading, setLoading] = useState(false);

//   /* ================= LOAD EMAIL ================= */
//   useEffect(() => {
//     const savedEmail = localStorage.getItem("adminResetEmail");
//     if (!savedEmail) {
//       navigate("/admin/login");
//     } else {
//       setEmail(savedEmail);
//     }
//   }, [navigate]);

//   /* ================= SEND OTP ================= */
//   const sendOtp = async () => {
//     setMsg("");
//     setLoading(true);
//     try {
//       const res = await axios.post(
//         "/api/admin/forgot",
//         { email }
//       );

//       if (res.data.success) {
//         setStep(2);
//         setMsg("OTP has been sent to admin email");
//       } else {
//         setMsg("Admin email not found");
//       }
//     } catch {
//       setMsg("Failed to send OTP");
//     } finally {
//       setLoading(false);
//     }
//   };

//   /* ================= RESET PASSWORD ================= */
//   const reset = async () => {
//     setMsg("");
//     setLoading(true);
//     try {
//       const res = await axios.post(
//         "/api/admin/reset",
//         { email, otp, password }
//       );

//       if (res.data.success) {
//         alert("Admin password reset successful ✅");
//         localStorage.removeItem("adminResetEmail");
//         navigate("/admin/login");
//       } else {
//         setMsg("Invalid OTP");
//       }
//     } catch {
//       setMsg("Reset failed");
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <div className="min-h-screen w-full flex items-center justify-center bg-slate-900 relative overflow-hidden px-4">

//       {/* Background decoration */}
//       <div className="absolute top-0 left-0 w-full h-full z-0 pointer-events-none">
//         <div className="absolute top-[-10%] right-[-5%] w-[600px] h-[600px] rounded-full bg-indigo-600/20 blur-[100px]"></div>
//         <div className="absolute bottom-[-10%] left-[-5%] w-[600px] h-[600px] rounded-full bg-blue-600/20 blur-[100px]"></div>
//       </div>

//       <div className="w-full max-w-md bg-white rounded-3xl shadow-2xl p-10 border border-slate-100 relative z-10">

//         {/* HEADER */}
//         <div className="text-center mb-8">
//           <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center">
//             <ShieldCheck size={32} />
//           </div>

//           <h2 className="text-2xl font-bold text-slate-900">
//             Admin Recovery
//           </h2>

//           <p className="text-slate-500 mt-2 text-sm">
//             {step === 1
//               ? "Verify your identity to reset password."
//               : "Enter verification code and new credentials."}
//           </p>
//         </div>

//         {/* STEPS */}
//         <div className="flex items-center justify-center gap-2 mb-8">
//           <div className={`h-1.5 flex-1 rounded-full transition-colors ${step >= 1 ? "bg-indigo-600" : "bg-slate-100"}`} />
//           <div className={`h-1.5 flex-1 rounded-full transition-colors ${step >= 2 ? "bg-indigo-600" : "bg-slate-100"}`} />
//         </div>

//         {/* STEP 1 */}
//         {step === 1 && (
//           <div className="space-y-6">
//             <div className="space-y-2">
//               <label className="text-sm font-medium text-slate-700 ml-1">Admin Email</label>
//               <div className="relative">
//                 <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400">
//                   <Mail size={20} />
//                 </div>
//                 <input
//                   value={email}
//                   disabled
//                   className="w-full pl-12 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-slate-500 cursor-not-allowed"
//                 />
//               </div>
//             </div>

//             <button
//               onClick={sendOtp}
//               disabled={loading}
//               className="w-full py-3.5 rounded-xl bg-indigo-600 text-white font-semibold shadow-lg shadow-indigo-500/30 hover:bg-indigo-700 hover:shadow-indigo-600/40 active:scale-[0.98] transition-all flex items-center justify-center gap-2"
//             >
//               {loading ? <Loader2 className="animate-spin" size={20} /> : "Send OTP"}
//             </button>
//           </div>
//         )}

//         {/* STEP 2 */}
//         {step === 2 && (
//           <div className="space-y-5">
//             <div className="space-y-2">
//               <label className="text-sm font-medium text-slate-700 ml-1">Verification Code</label>
//               <div className="relative">
//                 <input
//                   placeholder="Enter 6-digit OTP"
//                   value={otp}
//                   onChange={(e) => setOtp(e.target.value)}
//                   className="w-full px-4 py-3 bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all text-center text-lg tracking-widest font-mono"
//                   maxLength={6}
//                 />
//               </div>
//             </div>

//             <div className="space-y-2">
//               <label className="text-sm font-medium text-slate-700 ml-1">New Password</label>
//               <div className="relative">
//                 <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400">
//                   <Key size={20} />
//                 </div>
//                 <input
//                   type="password"
//                   placeholder="Create new password"
//                   value={password}
//                   onChange={(e) => setPassword(e.target.value)}
//                   className="w-full pl-12 pr-4 py-3 bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all"
//                 />
//               </div>
//             </div>

//             <button
//               onClick={reset}
//               disabled={loading}
//               className="w-full py-3.5 rounded-xl bg-indigo-600 text-white font-semibold shadow-lg shadow-indigo-500/30 hover:bg-indigo-700 hover:shadow-indigo-600/40 active:scale-[0.98] transition-all flex items-center justify-center gap-2"
//             >
//               {loading ? <Loader2 className="animate-spin" size={20} /> : "Reset Admin Password"}
//             </button>
//           </div>
//         )}

//         {/* MESSAGE */}
//         {msg && (
//           <div className={`mt-6 p-3 rounded-lg text-sm text-center font-medium ${msg.includes("sent") ? "bg-emerald-50 text-emerald-600" : "bg-red-50 text-red-600"}`}>
//             {msg}
//           </div>
//         )}

//         {/* FOOTER */}
//         <div className="mt-8 text-center">
//           <button
//             onClick={() => navigate("/admin/login")}
//             className="text-sm font-medium text-slate-500 hover:text-slate-800 flex items-center justify-center gap-2 mx-auto transition-colors"
//           >
//             <ArrowLeft size={16} />
//             Back to Admin Login
//           </button>
//         </div>

//       </div>
//     </div>
//   );
// }
