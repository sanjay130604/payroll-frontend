import { useState } from "react";
import Papa from "papaparse";
import axios from "../utils/axiosConfig";

import { motion, AnimatePresence } from "framer-motion";
import { Upload, CheckCircle, AlertCircle, FileDown, ArrowRight, XCircle, AlertTriangle } from "lucide-react";

export default function ProfileBulkUpload() {
    const [rows, setRows] = useState([]);
    const [headers, setHeaders] = useState([]);
    const [msg, setMsg] = useState("");
    const [failedEmails, setFailedEmails] = useState([]);
    const [loading, setLoading] = useState(false);

    // Validation State
    const [validationErrors, setValidationErrors] = useState([]);
    const [validRows, setValidRows] = useState([]);

    /* ================= VALIDATION LOGIC ================= */
    const validateRow = (row, index) => {
        const errors = [];
        const isPopulated = (v) => v !== "" && v !== null && v !== undefined;

        // 1. Employee ID (Starts with EMP)
        if (!String(row["employeeld"] || "").trim().toUpperCase().startsWith("EMP")) {
            errors.push("Employee ID must start with EMP");
        }

        // 2. First Name (>= 2 chars)
        if (String(row["frist name"] || "").trim().length < 2) {
            errors.push("First Name must be 2+ characters");
        }

        // 3. Last Name (>= 1 char)
        if (String(row["last name"] || "").trim().length < 1) {
            errors.push("Last Name must be 1+ character");
        }

        // 4. Designation (Not Empty)
        if (!isPopulated(row["designation"])) errors.push("Designation is required");

        // 5. Company Mail ID (@gmail.com)
        const companyEmail = String(row["company mail id"] || "").toLowerCase().trim();
        if (!companyEmail.endsWith("@gmail.com")) {
            errors.push("Company Mail ID must be @gmail.com");
        }

        // 6. Phone (10 digits)
        if (!/^\d{10}$/.test(String(row["phone"] || "").trim())) {
            errors.push("Phone must be exactly 10 digits");
        }

        // 7. Father & Mother Name (Not Empty)
        if (!isPopulated(row["father name"])) errors.push("Father Name is required");
        if (!isPopulated(row["mother name"])) errors.push("Mother Name is required");

        // 8. DOB (DD/MM/YYYY)
        const dob = String(row["dob"] || "").trim();
        if (!/^\d{1,2}\/\d{1,2}\/\d{4}$/.test(dob)) {
            errors.push("DOB must be DD/MM/YYYY");
        } else {
            // Age Validation (18+)
            const [d, m, y] = dob.split("/").map(Number);
            const dobDate = new Date(y, m - 1, d);
            const today = new Date();
            let age = today.getFullYear() - dobDate.getFullYear();
            const mDiff = today.getMonth() - dobDate.getMonth();
            if (mDiff < 0 || (mDiff === 0 && today.getDate() < dobDate.getDate())) {
                age--;
            }
            if (age < 18) {
                errors.push("Age must be 18+");
            }
        }

        // 9. Aadhaar (12 digits)
        const aadhaar = String(row["aadhaar card"] || "").replace(/\s+/g, "").trim();
        if (!/^\d{12}$/.test(aadhaar)) {
            errors.push(`Aadhaar must be exactly 12 digits (Received: ${aadhaar})`);
        }

        // 10. PAN (10 alphanumeric)
        if (!/^[a-zA-Z0-9]{10}$/.test(String(row["pan card"] || "").trim())) {
            errors.push("PAN must be 10 alphanumeric characters");
        }

        // 11. PF No (Not Empty)
        if (!isPopulated(row["pf no"])) errors.push("PF No is required");

        // 12. Education & Specialization (Not Empty)
        if (!isPopulated(row["education"])) errors.push("Education is required");
        if (!isPopulated(row["Specialization"])) errors.push("Specialization is required");

        // 13. Blood Group (Not Empty)
        if (!isPopulated(row["blood group"])) errors.push("Blood Group is required");

        // 14. Bank Name (Not Empty)
        if (!isPopulated(row["bank name"])) errors.push("Bank Name is required");

        // 15. Account Number (11-16 alphanumeric)
        // User said "11 to 16 words (it is mean letter or digits/number mixed )"
        const accNo = String(row["account number"] || "").trim();
        if (!/^[a-zA-Z0-9]{11,16}$/.test(accNo)) {
            errors.push("Account Number must be 11-16 alphanumeric characters");
        }

        // 16. Employee Type (Not Empty)
        if (!isPopulated(row["employee type"])) errors.push("Employee Type is required");

        // 17. Addresses (Not Empty)
        if (!isPopulated(row["current address"])) errors.push("Current Address is required");
        if (!isPopulated(row["permanent address"])) errors.push("Permanent Address is required");

        // 18. City, State, Country (Not Empty)
        if (!isPopulated(row["city"])) errors.push("City is required");
        if (!isPopulated(row["state"])) errors.push("State is required");
        if (!isPopulated(row["country"])) errors.push("Country is required");

        // 19. Pincode (6 digits)
        if (!/^\d{6}$/.test(String(row["pincode"] || "").trim())) {
            errors.push("Pincode must be 6 digits");
        }

        // 20. Gender (Male or Female)
        const gender = String(row["gender"] || "").trim().toLowerCase();
        if (gender !== "male" && gender !== "female") {
            errors.push("Gender must be Male or Female");
        }

        // 21. Personal Mail ID (@gmail.com)
        const personalEmail = String(row["personal mail id"] || "").toLowerCase().trim();
        if (!personalEmail.endsWith("@gmail.com")) {
            errors.push("Personal Mail ID must be @gmail.com");
        }

        return errors;
    };

    /* ================= LOAD CSV ================= */
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
                    // Check if row is empty
                    if (Object.keys(row).length === 0) return;

                    const errors = validateRow(row, index);
                    if (errors.length > 0) {
                        invalid.push({
                            index: index + 1,
                            email: row["company mail id"] || row["employeeld"] || "Unknown",
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
            "employeeld", "frist name", "last name", "designation", "company mail id",
            "phone", "father name", "mother name", "dob", "aadhaar card",
            "pan card", "pf no", "education", "Specialization", "blood group",
            "bank name", "account number", "employee type", "current address",
            "permanent address", "city", "state", "country", "pincode",
            "gender", "personal mail id"
        ];

        const csvContent = headers.join(",") + "\n";
        const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
        const url = URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.href = url;
        link.setAttribute("download", "Profile_Upload_Template.csv");
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
        setMsg("Uploading profiles...");
        setFailedEmails([]); // Reset errors

        try {
            const res = await axios.post(
                "/api/profile/bulk-upload",
                { profiles: validRows }
            );

            const { success, message, data } = res.data;

            if (success) {
                // Construct a helpful success message
                let successMsg = message || "Upload successful";

                // Handle duplicates/skipped rows from backend
                if (data && data.skipped && data.skipped.length > 0) {
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

                if (validationErrors.length > 0) {
                    successMsg += ` (${validationErrors.length} invalid rows were skipped)`;
                }

                setMsg(successMsg);

                if (data && data.failedEmails && data.failedEmails.length > 0) {
                    setFailedEmails(data.failedEmails);
                }
            } else {
                setMsg(message || "Upload failed");
            }
        } catch (err) {
            console.error(err);
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
                            Profile Bulk Upload
                        </h1>
                        <p className="text-slate-500 mt-2 text-lg">
                            Batch import employee profile details via CSV
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
                            Click to upload Profiles CSV
                        </p>
                        <p className="text-sm text-slate-400 mt-2">
                            Supports A to Z column order (Employee ID to Personal Mail ID)
                        </p>
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
                                                    <th
                                                        key={h}
                                                        className="px-6 py-4 font-semibold text-slate-700 whitespace-nowrap"
                                                    >
                                                        {h}
                                                    </th>
                                                ))}
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y divide-slate-100">
                                            {validRows.slice(0, 10).map((r, i) => (
                                                <tr
                                                    key={i}
                                                    className="hover:bg-slate-50 transition-colors"
                                                >
                                                    {headers.map(h => (
                                                        <td
                                                            key={h}
                                                            className="px-6 py-3 text-slate-600 whitespace-nowrap"
                                                        >
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
                                        {loading ? "Processing..." : `Import ${validRows.length} Valid Profiles`}
                                        {!loading && <ArrowRight size={18} />}
                                    </button>
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>

                    {/* STATUS MESSAGE & ERROR LIST */}
                    {msg && (
                        <motion.div
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            className={`mt-8 p-6 rounded-xl border ${msg.toLowerCase().includes("success")
                                ? "bg-emerald-50 border-emerald-100"
                                : "bg-red-50 border-red-100"
                                }`}
                        >
                            <div className="flex items-center gap-3 mb-2">
                                {msg.toLowerCase().includes("success") ? (
                                    <CheckCircle className="text-emerald-600" size={24} />
                                ) : (
                                    <AlertCircle className="text-red-600" size={24} />
                                )}
                                <p className={`font-bold text-lg ${msg.toLowerCase().includes("success") ? "text-emerald-800" : "text-red-800"}`}>
                                    {msg}
                                </p>
                            </div>

                            {/* FAILED EMAILS LIST */}
                            {failedEmails.length > 0 && (
                                <div className="mt-4 bg-white border border-red-200 rounded-xl p-4 shadow-sm">
                                    <p className="text-sm font-bold text-red-700 mb-3 flex items-center gap-2">
                                        <XCircle size={16} />
                                        Failed to process the following users (Email mismatch):
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
