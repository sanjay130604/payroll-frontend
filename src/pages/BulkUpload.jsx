// // import { useState } from "react";
// // import Papa from "papaparse";
// // import api from "../utils/axiosConfig";
// // import AdminNavbar from "../components/AdminNavbar";

// // export default function BulkUpload() {
// //   const [validRows, setValidRows] = useState([]);
// //   const [msg, setMsg] = useState("");
// //   const [loading, setLoading] = useState(false);

// //   const loadCSV = (file) => {
// //     Papa.parse(file, {
// //       header: true,
// //       skipEmptyLines: true,
// //       complete: (res) => {
// //         setValidRows(res.data || []);
// //       }
// //     });
// //   };

// //   const upload = async () => {
// //     if (!validRows.length) {
// //       setMsg("No valid rows to upload");
// //       return;
// //     }

// //     setLoading(true);
// //     try {
// //       const res = await api.post(
// //         "/api/users/bulk-upload", // ✅ FIXED PATH
// //         { users: validRows }
// //       );
// //       setMsg(res.data.message || "Upload successful");
// //     } catch (err) {
// //       console.error(err);
// //       setMsg("Upload failed");
// //     } finally {
// //       setLoading(false);
// //     }
// //   };

// //   return (
// //     <>
// //       <AdminNavbar />
// //       <input type="file" accept=".csv" onChange={(e) => loadCSV(e.target.files[0])} />
// //       <button onClick={upload} disabled={loading}>
// //         {loading ? "Uploading..." : "Confirm Upload"}
// //       </button>
// //       {msg && <p>{msg}</p>}
// //     </>
// //   );
// // }


// import { useState } from "react";
// import Papa from "papaparse";
// import axios from "../utils/axiosConfig";
// import AdminNavbar from "../components/AdminNavbar";
// import { motion, AnimatePresence } from "framer-motion";
// import {
//   Upload,
//   CheckCircle,
//   AlertCircle,
//   FileSpreadsheet,
//   ArrowRight,
//   AlertTriangle
// } from "lucide-react";

// export default function BulkUpload() {
//   const [headers, setHeaders] = useState([]);
//   const [msg, setMsg] = useState("");
//   const [loading, setLoading] = useState(false);
//   const [validationErrors, setValidationErrors] = useState([]);
//   const [validRows, setValidRows] = useState([]);

//   /* ================= VALIDATION LOGIC ================= */
//   const validateRow = (row) => {
//     const errors = [];

//     if ((row["First Name"] || "").trim().length < 2) {
//       errors.push("First Name must be at least 2 characters");
//     }

//     if ((row["Last Name"] || "").trim().length < 1) {
//       errors.push("Last Name is required");
//     }

//     const password = (row["Password"] || row["New Password"] || "").trim();
//     if (password.length < 4) {
//       errors.push("New Password must be at least 4 characters");
//     }

//     const empId = (row["Employee ID"] || "").trim();
//     if (!/^EMP/i.test(empId)) {
//       errors.push("Employee ID must start with EMP");
//     }

//     return errors;
//   };

//   /* ================= LOAD CSV ================= */
//   const loadCSV = (file) => {
//     if (!file) return;

//     Papa.parse(file, {
//       header: true,
//       skipEmptyLines: true,
//       complete: (res) => {
//         const data = res.data || [];
//         setHeaders(res.meta.fields || []);

//         const valid = [];
//         const invalid = [];

//         data.forEach((row, index) => {
//           if (!Object.keys(row).length) return;

//           const errors = validateRow(row);
//           if (errors.length) {
//             invalid.push({
//               index: index + 1,
//               email: row["Email ID"] || row["Employee ID"] || "Unknown",
//               errors
//             });
//           } else {
//             valid.push(row);
//           }
//         });

//         setValidRows(valid);
//         setValidationErrors(invalid);
//         setMsg(
//           invalid.length
//             ? `Found ${invalid.length} invalid rows. Only valid rows will be uploaded.`
//             : ""
//         );
//       }
//     });
//   };

//   /* ================= UPLOAD ================= */
//   const upload = async () => {
//     if (validRows.length === 0) {
//       setMsg("No valid rows to upload.");
//       return;
//     }

//     setLoading(true);
//     setMsg("Uploading users...");

//     try {
//       const res = await axios.post(
//         "/api/users/bulk-upload", // ✅ FIXED PATH
//         { users: validRows }
//       );

//       let successMsg = res.data.message || "Upload successful";
//       if (validationErrors.length > 0) {
//         successMsg += ` (${validationErrors.length} invalid rows skipped)`;
//       }
//       setMsg(successMsg);

//     } catch (err) {
//       console.error("Upload Error:", err);
//       setMsg("Upload failed. Please try again.");
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <div className="min-h-screen bg-slate-50">
//       <AdminNavbar />

//       <div className="max-w-7xl mx-auto px-6 py-12">
//         {/* HEADER */}
//         <div className="mb-10 flex justify-between items-center">
//           <div>
//             <h1 className="text-3xl font-bold text-slate-900">
//               Bulk User Upload
//             </h1>
//             <p className="text-slate-500 mt-2">
//               Import multiple users via CSV
//             </p>
//           </div>
//           <div className="bg-blue-50 text-blue-700 px-4 py-2 rounded-lg text-sm font-medium flex items-center gap-2">
//             <FileSpreadsheet size={18} />
//             CSV Format Required
//           </div>
//         </div>

//         {/* UPLOAD CARD */}
//         <div className="bg-white rounded-2xl shadow-card p-8">
//           <label className="flex flex-col items-center justify-center border-2 border-dashed rounded-2xl p-16 cursor-pointer hover:bg-slate-50">
//             <Upload size={32} className="text-slate-400 mb-4" />
//             <p className="font-bold text-slate-700">
//               Click to upload CSV file
//             </p>
//             <p className="text-sm text-slate-400 mt-2">
//               Drag and drop or browse
//             </p>
//             <input
//               type="file"
//               accept=".csv"
//               className="hidden"
//               onChange={(e) => loadCSV(e.target.files[0])}
//             />
//           </label>

//           {/* VALIDATION ERRORS */}
//           <AnimatePresence>
//             {validationErrors.length > 0 && (
//               <motion.div className="mt-6 bg-red-50 border border-red-200 rounded-xl p-4">
//                 <div className="flex items-center gap-2 text-red-700 font-semibold">
//                   <AlertTriangle size={20} />
//                   {validationErrors.length} invalid rows skipped
//                 </div>
//               </motion.div>
//             )}
//           </AnimatePresence>

//           {/* ACTION */}
//           {validRows.length > 0 && (
//             <div className="mt-8 flex justify-end">
//               <button
//                 onClick={upload}
//                 disabled={loading}
//                 className="px-8 py-3 bg-slate-900 text-white rounded-xl font-semibold flex items-center gap-2 hover:bg-slate-800 disabled:opacity-50"
//               >
//                 {loading ? "Processing..." : `Confirm Upload (${validRows.length})`}
//                 {!loading && <ArrowRight size={18} />}
//               </button>
//             </div>
//           )}

//           {/* STATUS MESSAGE */}
//           {msg && (
//             <div
//               className={`mt-6 p-4 rounded-xl flex items-center gap-3 ${msg.toLowerCase().includes("success")
//                   ? "bg-emerald-50 text-emerald-700"
//                   : msg.toLowerCase().includes("failed")
//                     ? "bg-red-50 text-red-700"
//                     : "bg-blue-50 text-blue-700"
//                 }`}
//             >
//               {msg.toLowerCase().includes("success") ? (
//                 <CheckCircle size={20} />
//               ) : (
//                 <AlertCircle size={20} />
//               )}
//               <span>{msg}</span>
//             </div>
//           )}
//         </div>
//       </div>
//     </div>
//   );
// }

import { useState } from "react";
import Papa from "papaparse";
import api from "../utils/axiosConfig"; // ✅ Use shared axios config

import { motion, AnimatePresence } from "framer-motion";
import { Upload, CheckCircle, AlertCircle, FileSpreadsheet, ArrowRight, XCircle, AlertTriangle } from "lucide-react";

export default function BulkUpload() {
  const [rows, setRows] = useState([]);
  const [headers, setHeaders] = useState([]);
  const [msg, setMsg] = useState("");
  const [loading, setLoading] = useState(false);

  // Validation State
  const [validationErrors, setValidationErrors] = useState([]);
  const [validRows, setValidRows] = useState([]);

  /* ================= VALIDATION LOGIC ================= */
  const validateRow = (row, index) => {
    const errors = [];

    // 🔁 Normalize Keys (Match Backend Logic)
    const firstName = (
      row["First Name"] || row["first name"] || row["Firstname"] || row["Name"] || ""
    ).trim();
    const lastName = (
      row["Last Name"] || row["last name"] || row["Lastname"] || ""
    ).trim();
    const email = (
      row["Email ID"] || row["Email"] || row["email"] || row["Email Address"] || ""
    ).trim();
    const employeeId = (
      row["Employee ID"] || row["employee id"] || row["ID"] || row["Emp ID"] || ""
    ).trim();
    const password = (
      row["Password"] || row["New Password"] || row["password"] || ""
    ).trim();

    // 1. First Name - Must be 2 and more than
    if (firstName.length < 2) {
      errors.push("First Name must be at least 2 characters");
    }

    // 2. Last Name - Must be 1 and more than
    if (lastName.length < 1) {
      errors.push("Last Name is required");
    }

    // 3. Email ID - Strict Validation
    if (!email) {
      errors.push("Email is required");
    } else if (!email.includes("@")) {
      errors.push("Invalid email format (must contain @)");
    }

    // 4. Password
    if (password.length < 4) {
      errors.push("Password/New Password must be at least 4 characters");
    }

    // 5. Employee ID - Must be VTAB
    if (!employeeId) {
      errors.push("Employee ID is required");
    } else if (!/^VTAB/i.test(employeeId)) {
      errors.push("Employee ID must start with 'VTAB'");
    }

    return errors;
  };

  const loadCSV = (file) => {
    if (!file) return;
    Papa.parse(file, {
      header: true,
      skipEmptyLines: true,
      complete: res => {
        const data = res.data || [];
        setHeaders(res.meta.fields || []);

        const valid = [];
        const invalid = [];

        data.forEach((row, index) => {
          // Skip empty rows
          if (Object.keys(row).length === 0) return;

          const errors = validateRow(row, index);
          if (errors.length > 0) {
            invalid.push({
              index: index + 1,
              email: row["Email"] || row["Employee ID"] || "Unknown",
              errors
            });
          } else {
            valid.push(row);
          }
        });

        setRows(data);
        setValidRows(valid);
        setValidationErrors(invalid);
        setMsg("");

        if (invalid.length > 0) {
          setMsg(`Found ${invalid.length} invalid rows. Only valid rows will be uploaded.`);
        }
      }
    });
  };

  const upload = async () => {
    if (validRows.length === 0) {
      setMsg("No valid rows to upload.");
      return;
    }

    setLoading(true);
    setMsg("Uploading users...");
    try {
      const res = await api.post(
        "/api/users/bulk-upload", // ✅ Relative URL matches baseURL in axiosConfig
        { users: validRows }
      );

      let successMsg = res.data.message || "Upload successful";
      if (validationErrors.length > 0) {
        successMsg += ` (${validationErrors.length} invalid rows were skipped)`;
      }
      setMsg(successMsg);

    } catch {
      setMsg("Upload failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 animate-in fade-in duration-500">


      <div className="max-w-7xl mx-auto px-6 py-12">

        {/* HEADER */}
        <div className="mb-10 flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-slate-900 tracking-tight">
              Bulk User Upload
            </h1>
            <p className="text-slate-500 mt-2 text-lg">
              Import multiple user accounts via CSV file
            </p>
          </div>
          <div className="bg-blue-50 text-blue-700 px-4 py-2 rounded-lg text-sm font-medium flex items-center gap-2">
            <FileSpreadsheet size={18} />
            CSV Format Required
          </div>
        </div>

        {/* UPLOAD CARD */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-2xl shadow-card border border-slate-100 p-8"
        >
          {/* FILE INPUT AREA */}
          <label className="group flex flex-col items-center justify-center border-2 border-dashed border-slate-300 rounded-2xl p-16 cursor-pointer hover:bg-slate-50 hover:border-primary-400 transition-all duration-300">
            <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mb-4 group-hover:bg-primary-50 group-hover:text-primary-600 transition-colors text-slate-400">
              <Upload size={32} />
            </div>
            <p className="font-bold text-slate-700 text-lg group-hover:text-primary-700">
              Click to upload CSV file
            </p>
            <p className="text-sm text-slate-400 mt-2">
              Drag and drop or browse from your computer
            </p>
            <div className="mt-4 text-xs text-slate-400 bg-slate-100 px-3 py-1 rounded-full">
              Supported columns: any order, missing allowed
            </div>
            <input
              type="file"
              accept=".csv"
              className="hidden"
              onChange={e => loadCSV(e.target.files[0])}
            />
          </label>

          {/* ================= VALIDATION ERRORS ================= */}
          <AnimatePresence>
            {validationErrors.length > 0 && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                className="mt-8 bg-red-50 border border-red-100 rounded-xl p-6 overflow-hidden"
              >
                <div className="flex items-center gap-2 mb-4 text-red-800 font-bold text-lg">
                  <AlertTriangle size={24} />
                  Validation Errors ({validationErrors.length} Rows Skipped)
                </div>
                <div className="max-h-60 overflow-y-auto pr-2 custom-scrollbar">
                  <table className="w-full text-sm text-left">
                    <thead className="bg-red-100/50 text-red-900 font-semibold sticky top-0">
                      <tr>
                        <th className="p-3 rounded-l-lg">Row</th>
                        <th className="p-3">ID / Email</th>
                        <th className="p-3 rounded-r-lg">Errors</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-red-200/50">
                      {validationErrors.map((err, idx) => (
                        <tr key={idx} className="hover:bg-red-100/30 transition-colors">
                          <td className="p-3 font-mono text-red-700">#{err.index}</td>
                          <td className="p-3 text-red-800 font-medium">{err.email}</td>
                          <td className="p-3 text-red-600">
                            <ul className="list-disc pl-4 space-y-1">
                              {err.errors.map((e, i) => (
                                <li key={i}>{e}</li>
                              ))}
                            </ul>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* PREVIEW SECTION */}
          <AnimatePresence>
            {validRows.length > 0 && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                className="mt-10 overflow-hidden"
              >
                <div className="flex justify-between items-center mb-6">
                  <h3 className="font-bold text-lg text-slate-800 flex items-center gap-2">
                    <span className="w-2 h-6 bg-primary-500 rounded-full"></span>
                    Valid Rows Preview <span className="text-slate-400 text-sm font-normal ml-2">({validRows.length} ready to upload)</span>
                  </h3>
                  <span className="px-3 py-1 text-xs font-semibold bg-slate-100 text-slate-600 rounded-full border border-slate-200">
                    Showing first 10 entries
                  </span>
                </div>

                <div className="overflow-x-auto rounded-xl border border-slate-200">
                  <table className="w-full text-sm text-left">
                    <thead className="bg-slate-50 border-b border-slate-200">
                      <tr>
                        {headers.map(h => (
                          <th key={h} className="px-6 py-4 font-semibold text-slate-700 whitespace-nowrap">
                            {h}
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {validRows.slice(0, 10).map((r, i) => (
                        <tr key={i} className="hover:bg-slate-50 transition-colors">
                          {headers.map(h => (
                            <td key={h} className="px-6 py-3 text-slate-600 whitespace-nowrap">
                              {r[h] || <span className="text-slate-300 italic">-</span>}
                            </td>
                          ))}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                {/* ACTION BUTTON */}
                <div className="mt-8 flex justify-end">
                  <button
                    onClick={upload}
                    disabled={loading}
                    className={`px-8 py-3 rounded-xl text-white font-semibold shadow-lg transition-all flex items-center gap-2
                      ${loading
                        ? "bg-slate-400 cursor-not-allowed"
                        : "bg-slate-900 hover:bg-slate-800 hover:shadow-xl hover:-translate-y-0.5"}
                    `}
                  >
                    {loading ? "Processing..." : `Confirm Upload (${validRows.length} Valid)`}
                    {!loading && <ArrowRight size={18} />}
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* STATUS MESSAGE */}
          {msg && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className={`mt-8 p-4 rounded-xl border flex items-center gap-3 ${msg.toLowerCase().includes("success")
                ? "bg-emerald-50 border-emerald-100 text-emerald-800"
                : msg.toLowerCase().includes("failed")
                  ? "bg-red-50 border-red-100 text-red-800"
                  : "bg-blue-50 border-blue-100 text-blue-800"
                }`}
            >
              {msg.toLowerCase().includes("success") ? (
                <CheckCircle className="text-emerald-600" size={20} />
              ) : msg.toLowerCase().includes("failed") ? (
                <AlertCircle className="text-red-600" size={20} />
              ) : (
                <Upload className="text-blue-600" size={20} />
              )}
              <p className="font-medium">{msg}</p>
            </motion.div>
          )}
        </motion.div>
      </div>
    </div>
  );
}
