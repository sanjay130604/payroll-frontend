import { useState } from "react";
import Papa from "papaparse";
import axios from "../utils/axiosConfig";

import { motion, AnimatePresence } from "framer-motion";
import { Upload, CheckCircle, AlertCircle, FileDown, ArrowRight, XCircle, AlertTriangle } from "lucide-react";

export default function FinanceBulkUpload() {
  const [rows, setRows] = useState([]);
  const [headers, setHeaders] = useState([]);
  const [msg, setMsg] = useState("");
  const [loading, setLoading] = useState(false);
  const [failedEmails, setFailedEmails] = useState([]);

  // Validation State
  const [validationErrors, setValidationErrors] = useState([]); // Array of { row, email, errors: [] }
  const [validRows, setValidRows] = useState([]);

  /* ================= VALIDATION LOGIC ================= */
  const validateRow = (row, index) => {
    const errors = [];
    const isNum = (v) => v !== "" && v !== null && v !== undefined && !isNaN(v);

    // Normalize keys to handle case sensitivity if needed, but CSV usually matches template
    // We'll assume the CSV headers match the template keys provided below.

    // 1. Salary Month (YYYY-MM)
    if (!/^\d{4}-\d{2}$/.test(row["Salary Month"])) {
      errors.push("Salary Month must be YYYY-MM");
    }

    // 2. Email (@gmail.com)
    const email = String(row["Employee Mail id"] || "").toLowerCase().trim();
    if (!email.endsWith("@gmail.com")) {
      errors.push("Employee Mail id must be @gmail.com");
    }

    // 3. Employee ID (Starts with VTAB)
    if (!String(row["Employee ID"] || "").trim().toUpperCase().startsWith("VTAB")) {
      errors.push("Employee ID must start with VTAB");
    }

    // 4. First Name (>= 2 letters)
    if (String(row["frist name"] || "").trim().length < 2) {
      errors.push("frist name must be 2 letters or more");
    }

    // 5. Last Name (>= 1 letter)
    if (String(row["last name"] || "").trim().length < 1) {
      errors.push("last name must be 1 letter or more");
    }

    // 6. Numeric Fields (NotEmpty & Digits)
    const numericFields = [
      "No of Working Days",
      "Leaves Availed",
      "Leaves Used",
      "Total Leaves",
      "Pay Days",
      "Remaining Paid leaves",
      "Basic",
      "HRA",
      "Other Allowance",
      "Special Pay",
      "Incentive", // Assuming Incentive follows same rule
      "TDS",
      "Other Deductions",
      "lop days"
    ];

    numericFields.forEach(field => {
      if (!isNum(row[field])) {
        errors.push(`${field} must be a number (cannot be empty)`);
      }
    });

    // 7. PAN Card (10 chars, Alphanumeric)
    // const pan = String(row["Pancard No"] || "").trim();
    // if (!/^[A-Z0-9]{10}$/i.test(pan)) {
    //   errors.push("Pancard No must be 10 alphanumeric characters");
    // }

    // 8. Date of Joining (DD/MM/YYYY or DD-MM-YYYY)
    // Regex allows / or - separator
    if (!/^\d{1,2}[\/-]\d{1,2}[\/-]\d{4}$/.test(row["date of joining"])) {
      errors.push("date of joining must be DD/MM/YYYY");
    }

    return errors;
  };

  /* ================= LOAD CSV ================= */
  const loadCSV = (file) => {
    if (!file) return; // Prevent crash if file undefined
    Papa.parse(file, {
      header: true,
      skipEmptyLines: true,
      complete: res => {
        const data = res.data || [];
        setHeaders(res.meta.fields || []);

        const valid = [];
        const invalid = [];

        data.forEach((row, index) => {
          // Basic check: ignore completely empty rows that might slip through
          if (Object.keys(row).length === 0) return;

          const errors = validateRow(row, index);
          if (errors.length > 0) {
            invalid.push({
              index: index + 1, // 1-based index for UI
              email: row["Employee Mail id"] || "Unknown Email",
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
        setFailedEmails([]);

        if (invalid.length > 0) {
          setMsg(`Found ${invalid.length} invalid rows. Only valid rows will be uploaded.`);
        }
      }
    });
  };

  /* ================= DOWNLOAD TEMPLATE ================= */
  const downloadTemplate = () => {
    const headers = [
      "Salary Month", "Employee Mail id", "Employee ID", "frist name", "last name",
      "No of Working Days", "Leaves Availed", "Leaves Used", "Total Leaves", "Pay Days",
      "Remaining Paid leaves", "Basic", "HRA", "Other Allowance", "Special Pay",
      "Incentive", "TDS", "Pancard No", "Other Deductions", "enter details data",
      "date of joining", "Pay Date", "lop days"
    ];

    const csvContent = headers.join(",") + "\n";
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", "Finance_Upload_Template.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  /* ================= UPLOAD ================= */
  const upload = async () => {
    if (validRows.length === 0) {
      setMsg("No valid rows to upload.");
      return;
    }

    setLoading(true);
    setMsg("Uploading finance data...");
    setFailedEmails([]);

    try {
      const res = await axios.post(
        "/api/finance/bulk-upload",
        { rows: validRows }
      );

      const { success, message, data } = res.data;

      // Handle both boolean true and string "true" if API behaves oddly, though usually boolean
      if (success) {
        let successMsg = message || "Upload successful";

        if (data) {
          // If we have specific counts, construct a detailed message
          if (typeof data.inserted === 'number') {
            successMsg = `Successfully uploaded ${data.inserted} rows.`;
          }

          // Handle duplicates/skipped rows from backend
          if (data.skipped && data.skipped.length > 0) {
            const backendErrors = data.skipped.map((skipStr, i) => {
              const parts = skipStr.split(": ");
              const idOrEmail = parts[0] || "Unknown";
              const reason = parts[1] || skipStr;

              return {
                index: "Server",
                email: idOrEmail,
                errors: [reason]
              };
            });

            // Add to existing validation errors
            setValidationErrors(prev => [...prev, ...backendErrors]);
            successMsg += ` (${data.skipped.length} duplicates skipped)`;
          }

          if (data.failedEmails && data.failedEmails.length > 0) {
            setFailedEmails(data.failedEmails);
          }
        }

        if (validationErrors.length > 0) {
          successMsg += ` (${validationErrors.length} invalid rows were skipped)`;
        }

        setMsg(successMsg);
      } else {
        setMsg(message || "Upload failed");
      }
    } catch (err) {
      console.error("Bulk Upload Error:", err);
      setMsg("Upload failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 animate-in fade-in duration-500">


      <div className="max-w-7xl mx-auto px-6 py-12">

        {/* ================= HEADER ================= */}
        <div className="mb-10 flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div>
            <h1 className="text-3xl font-bold text-slate-900 tracking-tight">
              Finance Bulk Upload
            </h1>
            <p className="text-slate-500 mt-2 text-lg">
              Batch process payroll entries via CSV
            </p>
          </div>

          <button
            onClick={downloadTemplate}
            className="flex items-center gap-2 bg-white border border-slate-200 text-slate-700 px-5 py-2.5 rounded-xl hover:bg-slate-50 hover:border-slate-300 transition-all font-medium shadow-sm"
          >
            <FileDown className="w-5 h-5 text-primary-600" />
            Download Template
          </button>
        </div>

        {/* ================= UPLOAD CARD ================= */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-2xl shadow-card border border-slate-100 p-8"
        >

          {/* FILE INPUT */}
          <label className="group flex flex-col items-center justify-center border-2 border-dashed border-slate-300 rounded-2xl p-16 cursor-pointer hover:bg-slate-50 hover:border-primary-400 transition-all duration-300">
            <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mb-4 group-hover:bg-primary-50 group-hover:text-primary-600 transition-colors text-slate-400">
              <Upload size={32} />
            </div>
            <p className="font-bold text-slate-700 text-lg group-hover:text-primary-700">
              Click to upload Payroll CSV
            </p>
            <p className="text-sm text-slate-400 mt-2">
              Ensure column headers match the template
            </p>
            <input
              type="file"
              accept=".csv"
              className="hidden"
              onChange={e => loadCSV(e.target.files[0])}
            />
          </label>

          {/* ================= VALIDATION ERROR POPUP / SECTION ================= */}
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
                        <th className="p-3">Email</th>
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

          {/* ================= PREVIEW ================= */}
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
                    Showing first 10
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

                {/* ACTION */}
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
                    {loading ? "Processing..." : `Upload ${validRows.length} Valid Rows`}
                    {!loading && <ArrowRight size={18} />}
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* STATUS & ERRORS (General) */}
          {msg && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className={`mt-8 p-6 rounded-xl border ${msg.toLowerCase().includes("success")
                ? "bg-emerald-50 border-emerald-100"
                : "bg-slate-50 border-slate-200"
                }`}
            >
              <div className="flex items-center gap-3 mb-2">
                {msg.toLowerCase().includes("success") ? (
                  <CheckCircle className="text-emerald-600" size={24} />
                ) : (
                  <AlertCircle className="text-slate-600" size={24} />
                )}
                <p className={`font-bold text-lg ${msg.toLowerCase().includes("success") ? "text-emerald-800" : "text-slate-800"}`}>
                  {msg}
                </p>
              </div>

              {/* FAILED EMAILS LIST (Backend Failures) */}
              {failedEmails.length > 0 && (
                <div className="mt-4 bg-white border border-red-200 rounded-xl p-4 shadow-sm">
                  <p className="text-sm font-bold text-red-700 mb-3 flex items-center gap-2">
                    <XCircle size={16} />
                    Failed to process the following users (Backend Error):
                  </p>
                  <ul className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2">
                    {failedEmails.map((email, idx) => (
                      <li key={idx} className="text-xs text-red-600 bg-red-50 px-2 py-1 rounded border border-red-100 truncate">
                        {email || "Unknown Email"}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </motion.div>
          )}

        </motion.div>
      </div>
    </div>
  );
}
