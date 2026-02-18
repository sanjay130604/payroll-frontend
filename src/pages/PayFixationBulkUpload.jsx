import { useState } from "react";
import Papa from "papaparse";
import axios from "../utils/axiosConfig";
import { motion, AnimatePresence } from "framer-motion";
import { Upload, CheckCircle, AlertCircle, FileSpreadsheet, ArrowRight, AlertTriangle, Download, X, Loader2 } from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function PayFixationBulkUpload() {
    const navigate = useNavigate();
    const [headers, setHeaders] = useState([]);
    const [msg, setMsg] = useState("");
    const [loading, setLoading] = useState(false);

    // Preview State
    const [showPreview, setShowPreview] = useState(false);
    const [validRows, setValidRows] = useState([]);
    const [invalidRows, setInvalidRows] = useState([]); // Contains both format errors and duplicates

    const validateRow = (row, index, seenIds) => {
        const errors = [];

        // Flexible key matching
        const findValue = (possibleKeys) => {
            const keys = Object.keys(row);
            const foundKey = keys.find(k =>
                possibleKeys.some(pk => k.toLowerCase().replace(/\s/g, "") === pk.toLowerCase().replace(/\s/g, ""))
            );
            return foundKey ? String(row[foundKey]).trim() : "";
        };

        const empId = findValue(["EmployeeID", "Employee", "ID", "EmpID"]);
        const basic = findValue(["BaseSalary", "Basic", "BaseSalar", "BasicSalary"]);
        const variablePay = findValue(["VariablePay", "Variable", "Incentive", "Variable Pay"]);

        // Check for empty row
        if (!empId && !basic && !variablePay) return { status: "EMPTY" };

        // 1. Check for duplicates within the file
        if (empId && seenIds.has(empId.toUpperCase())) {
            errors.push("Duplicate Employee ID in this file");
        } else if (empId) {
            seenIds.add(empId.toUpperCase());
        }

        // 2. Format Validations
        if (!empId) {
            errors.push("Employee ID is required");
        } else if (!/^VTAB/i.test(empId)) {
            errors.push("Employee ID must start with 'VTAB'");
        }

        const numFields = [
            { val: basic, label: "Base Salary" },
            { val: variablePay, label: "Variable Pay" }
        ];

        numFields.forEach(f => {
            if (f.val !== "" && isNaN(f.val)) {
                errors.push(`${f.label} must be a number`);
            }
        });

        // Return Data Object
        return {
            status: errors.length > 0 ? "INVALID" : "VALID",
            data: {
                employeeId: empId,
                basic: basic ? Number(basic) : 0,
                variablePay: variablePay ? Number(variablePay) : 0,
                // store original row for debugging if needed
                _original: row
            },
            errors,
            id: empId || `Row ${index + 2}`
        };
    };

    const loadCSV = (file) => {
        if (!file) return;
        setMsg("");
        setLoading(true);

        Papa.parse(file, {
            header: true,
            skipEmptyLines: "greedy",
            complete: async (res) => {
                const data = res.data || [];
                setHeaders(res.meta.fields || []);

                const locallyValid = [];
                const invalid = [];
                const seenIds = new Set();

                data.forEach((row, index) => {
                    const result = validateRow(row, index, seenIds);

                    if (result.status === "EMPTY") return;

                    if (result.status === "VALID") {
                        locallyValid.push({ ...result.data, index: index + 2 });
                    } else {
                        invalid.push({
                            index: index + 2,
                            id: result.id,
                            errors: result.errors
                        });
                    }
                });

                if (locallyValid.length === 0) {
                    setValidRows([]);
                    setInvalidRows(invalid);
                    setLoading(false);
                    setShowPreview(true);
                    document.getElementById("csvInput").value = "";
                    return;
                }

                // --- BACKEND VALIDATION ---
                try {
                    const validateRes = await axios.post("/api/finance/pay-fixation/validate", { rows: locallyValid });

                    if (validateRes.data.success) {
                        const verifiedRows = validateRes.data.validatedRows || [];
                        const finalValid = [];
                        const finalInvalid = [...invalid]; // Start with format errors

                        verifiedRows.forEach(row => {
                            if (row.status === "VALID") {
                                finalValid.push(row);
                            } else {
                                finalInvalid.push({
                                    index: row.index,
                                    id: row.employeeId,
                                    errors: row.errors && row.errors.length > 0 ? row.errors : [row.message]
                                });
                            }
                        });

                        // Sort by Row Index
                        finalInvalid.sort((a, b) => a.index - b.index);

                        setValidRows(finalValid);
                        setInvalidRows(finalInvalid);
                        setShowPreview(true);
                    } else {
                        setMsg("Validation failed: " + validateRes.data.message);
                    }
                } catch (err) {
                    setMsg("Server Verification Failed: " + (err.response?.data?.message || err.message));
                } finally {
                    setLoading(false);
                    document.getElementById("csvInput").value = "";
                }
            }
        });
    };

    const upload = async () => {
        if (validRows.length === 0) return setMsg("No valid rows to upload.");
        setLoading(true);
        setMsg("Uploading data...");
        try {
            const res = await axios.post("/api/finance/pay-fixation/bulk-upload", { rows: validRows });
            if (res.data.success) {
                setMsg(`Successfully updated ${res.data.message}`);
                setShowPreview(false); // Close Modal on success
            } else {
                setMsg(res.data.message || "Upload failed");
            }
        } catch (err) {
            setMsg("Upload failed. Please check your data.");
        } finally {
            setLoading(false);
        }
    };

    const downloadTemplate = () => {
        const headers = ["Employee", "Base Salary", "Variable Pay"];
        const csvContent = "data:text/csv;charset=utf-8," + headers.join(",") + "\n";
        const encodedUri = encodeURI(csvContent);
        const link = document.createElement("a");
        link.setAttribute("href", encodedUri);
        link.setAttribute("download", "pay_fixation_template.csv");
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    return (
        <div className="min-h-screen bg-slate-50 p-8">
            <div className="max-w-7xl mx-auto">
                <div className="flex justify-between items-center mb-8">
                    <div>
                        <h1 className="text-3xl font-bold text-slate-900">Pay Fixation Bulk Upload</h1>
                        <p className="text-slate-500 mt-2">Update employee salaries in bulk via CSV</p>
                    </div>
                    <button onClick={downloadTemplate} className="flex items-center gap-2 px-4 py-2 bg-white border border-slate-200 rounded-lg hover:bg-slate-50 transition-all font-medium">
                        <Download size={18} />
                        Download Template
                    </button>
                </div>

                <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-8 relative overflow-hidden">
                    {loading && (
                        <div className="absolute inset-0 bg-white/80 backdrop-blur-sm flex flex-col items-center justify-center z-10">
                            <Loader2 size={40} className="text-primary-600 animate-spin mb-4" />
                            <p className="font-bold text-slate-700">Processing Data...</p>
                        </div>
                    )}

                    <label className="group flex flex-col items-center justify-center border-2 border-dashed border-slate-300 rounded-2xl p-16 cursor-pointer hover:bg-slate-50 hover:border-primary-400 transition-all duration-300">
                        <Upload size={32} className="text-slate-400 mb-4 group-hover:text-primary-600" />
                        <p className="font-bold text-slate-700 text-lg group-hover:text-primary-700">Click to upload CSV file</p>
                        <input id="csvInput" type="file" accept=".csv" className="hidden" onChange={e => loadCSV(e.target.files[0])} />
                    </label>

                    {msg && (
                        <div className={`mt-6 p-4 rounded-xl border flex items-center gap-3 ${msg.toLowerCase().includes("success") ? "bg-emerald-50 border-emerald-100 text-emerald-800" : "bg-blue-50 border-blue-100 text-blue-800"}`}>
                            <AlertCircle size={20} />
                            <p className="font-medium">{msg}</p>
                        </div>
                    )}
                </div>
            </div>

            {/* PREVIEW MODAL */}
            <AnimatePresence>
                {showPreview && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
                    >
                        <motion.div
                            initial={{ scale: 0.95, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0.95, opacity: 0 }}
                            className="bg-white rounded-2xl shadow-2xl w-full max-w-4xl max-h-[90vh] flex flex-col overflow-hidden"
                        >
                            {/* Modal Header */}
                            <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
                                <div>
                                    <h2 className="text-2xl font-bold text-slate-900">Upload Preview</h2>
                                    <p className="text-slate-500 text-sm mt-1">
                                        Review your data before confirming upload
                                    </p>
                                </div>
                                <button
                                    onClick={() => setShowPreview(false)}
                                    className="p-2 hover:bg-slate-200 rounded-full transition-colors"
                                >
                                    <X size={20} className="text-slate-500" />
                                </button>
                            </div>

                            {/* Modal Content */}
                            <div className="flex-1 overflow-y-auto p-6 space-y-8">

                                {/* Summary Cards */}
                                <div className="grid grid-cols-3 gap-4">
                                    <div className="bg-slate-50 p-4 rounded-xl border border-slate-100">
                                        <p className="text-slate-500 text-xs uppercase font-bold tracking-wider">Total Rows</p>
                                        <p className="text-2xl font-bold text-slate-800 mt-1">{validRows.length + invalidRows.length}</p>
                                    </div>
                                    <div className="bg-emerald-50 p-4 rounded-xl border border-emerald-100">
                                        <p className="text-emerald-600 text-xs uppercase font-bold tracking-wider">Valid Records</p>
                                        <p className="text-2xl font-bold text-emerald-700 mt-1">{validRows.length}</p>
                                    </div>
                                    <div className="bg-red-50 p-4 rounded-xl border border-red-100">
                                        <p className="text-red-600 text-xs uppercase font-bold tracking-wider">Errors Found</p>
                                        <p className="text-2xl font-bold text-red-700 mt-1">{invalidRows.length}</p>
                                    </div>
                                </div>

                                {/* Invalid Rows Table */}
                                {invalidRows.length > 0 && (
                                    <div className="space-y-3">
                                        <h3 className="font-bold text-red-700 flex items-center gap-2">
                                            <AlertTriangle size={18} />
                                            Issues to Fix ({invalidRows.length})
                                        </h3>
                                        <div className="border border-red-100 rounded-xl overflow-hidden">
                                            <table className="w-full text-sm text-center">
                                                <thead className="bg-red-50 text-red-900 font-bold border-b border-red-100">
                                                    <tr>
                                                        <th className="py-3 px-4 w-20">Row</th>
                                                        <th className="py-3 px-4 w-32">ID</th>
                                                        <th className="py-3 px-4 text-left">Error Details</th>
                                                    </tr>
                                                </thead>
                                                <tbody className="divide-y divide-red-100/50">
                                                    {invalidRows.map((err, idx) => (
                                                        <tr key={idx} className="bg-red-50/30 text-red-800">
                                                            <td className="py-2 px-4">#{err.index}</td>
                                                            <td className="py-2 px-4 font-mono text-xs">{err.id}</td>
                                                            <td className="py-2 px-4 text-left">{err.errors.join(", ")}</td>
                                                        </tr>
                                                    ))}
                                                </tbody>
                                            </table>
                                        </div>
                                    </div>
                                )}

                                {/* Valid Rows Table (Preview of first 50) */}
                                {validRows.length > 0 && (
                                    <div className="space-y-3">
                                        <h3 className="font-bold text-emerald-700 flex items-center gap-2">
                                            <CheckCircle size={18} />
                                            Valid Records Preview ({validRows.length})
                                        </h3>
                                        <div className="border border-slate-200 rounded-xl overflow-hidden">
                                            <table className="w-full text-sm text-center">
                                                <thead className="bg-slate-50 text-slate-700 font-bold border-b border-slate-200">
                                                    <tr>
                                                        <th className="py-3 px-2">Emp ID</th>
                                                        <th className="py-3 px-2">Basic Salary</th>
                                                        <th className="py-3 px-2">Variable Pay</th>
                                                        <th className="py-3 px-4">Status</th>
                                                    </tr>
                                                </thead>
                                                <tbody className="divide-y divide-slate-100">
                                                    {validRows.slice(0, 10).map((row, idx) => (
                                                        <tr key={idx} className="hover:bg-slate-50 text-[11px]">
                                                            <td className="py-2 px-2 font-mono text-slate-600">{row.employeeId}</td>
                                                            <td className="py-2 px-2 font-bold text-slate-700">₹{row.basic}</td>
                                                            <td className="py-2 px-2 font-bold text-slate-700">₹{row.variablePay || 0}</td>
                                                            <td className="py-2 px-4 whitespace-nowrap">
                                                                <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-medium bg-emerald-100 text-emerald-800">
                                                                    {row.message || "Ready"}
                                                                </span>
                                                            </td>
                                                        </tr>
                                                    ))}
                                                    {validRows.length > 10 && (
                                                        <tr>
                                                            <td colSpan="4" className="py-2 text-xs text-slate-400 italic bg-slate-50">
                                                                ...and {validRows.length - 10} more records
                                                            </td>
                                                        </tr>
                                                    )}
                                                </tbody>
                                            </table>
                                        </div>
                                    </div>
                                )}
                            </div>

                            {/* Modal Footer */}
                            <div className="p-6 border-t border-slate-100 bg-slate-50/50 flex justify-end gap-3">
                                <button
                                    onClick={() => setShowPreview(false)}
                                    className="px-6 py-2.5 rounded-xl font-medium text-slate-600 hover:bg-slate-200 transition-colors"
                                >
                                    Cancel
                                </button>
                                <button
                                    onClick={upload}
                                    disabled={loading || validRows.length === 0}
                                    className="px-8 py-2.5 bg-slate-900 text-white rounded-xl font-bold hover:bg-slate-800 transition-all flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    {loading ? "Processing..." : `Confirm Upload (${validRows.length})`}
                                    {!loading && <ArrowRight size={18} />}
                                </button>
                            </div>

                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}
