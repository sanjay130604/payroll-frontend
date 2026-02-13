import { useState } from "react";
import Papa from "papaparse";
import axios from "../utils/axiosConfig";
import { motion, AnimatePresence } from "framer-motion";
import { Upload, CheckCircle, AlertCircle, FileSpreadsheet, ArrowRight, AlertTriangle, Download } from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function PayFixationBulkUpload() {
    const navigate = useNavigate();
    const [rows, setRows] = useState([]);
    const [headers, setHeaders] = useState([]);
    const [msg, setMsg] = useState("");
    const [loading, setLoading] = useState(false);
    const [validationErrors, setValidationErrors] = useState([]);
    const [validRows, setValidRows] = useState([]);

    const validateRow = (row, index) => {
        const errors = [];

        // Flexible key matching (case insensitive, space insensitive)
        const findValue = (possibleKeys) => {
            const keys = Object.keys(row);
            const foundKey = keys.find(k =>
                possibleKeys.some(pk => k.toLowerCase().replace(/\s/g, "") === pk.toLowerCase().replace(/\s/g, ""))
            );
            return foundKey ? String(row[foundKey]).trim() : "";
        };

        const empId = findValue(["EmployeeID", "Employee", "ID", "EmpID"]);
        const basic = findValue(["BaseSalary", "Basic", "BaseSalar", "BasicSalary"]);
        const variable = findValue(["VariablePay", "Variable", "VarPay"]);

        // If the row is totally empty, return special flag or empty errors
        const isRowEmpty = !empId && !basic && !variable;
        if (isRowEmpty) return "EMPTY";

        if (!empId) {
            errors.push("Employee ID is required");
        } else if (!/^VTAB/i.test(empId)) {
            errors.push("Employee ID must start with 'VTAB'");
        }

        if (basic === "" || isNaN(basic)) {
            errors.push("Base Salary must be a number");
        }

        if (variable === "" || isNaN(variable)) {
            errors.push("Variable Pay must be a number");
        }

        return errors;
    };

    const loadCSV = (file) => {
        if (!file) return;
        Papa.parse(file, {
            header: true,
            skipEmptyLines: "greedy", // More aggressive skipping of empty lines
            complete: (res) => {
                const data = res.data || [];
                setHeaders(res.meta.fields || []);
                const valid = [];
                const invalid = [];

                data.forEach((row, index) => {
                    const errors = validateRow(row, index);

                    if (errors === "EMPTY") return; // Skip truly empty rows

                    if (errors.length > 0) {
                        invalid.push({
                            index: index + 2, // +2 because index 0 is Row 2 in CSV
                            id: row["Employee ID"] || row["Employee"] || row["ID"] || "Unknown",
                            errors
                        });
                    } else {
                        // Extract values again for final data
                        const getValue = (possibleKeys) => {
                            const keys = Object.keys(row);
                            const foundKey = keys.find(k =>
                                possibleKeys.some(pk => k.toLowerCase().replace(/\s/g, "") === pk.toLowerCase().replace(/\s/g, ""))
                            );
                            return foundKey ? String(row[foundKey]).trim() : "";
                        };

                        valid.push({
                            employeeId: getValue(["EmployeeID", "Employee", "ID", "EmpID"]),
                            firstName: getValue(["FirstName", "Name", "First Name"]),
                            lastName: getValue(["LastName", "Last Name"]),
                            email: getValue(["Email", "EmailID", "Mail"]),
                            basic: Number(getValue(["BaseSalary", "Basic", "BaseSalar", "BasicSalary", "Base Salary"])),
                            variablePay: Number(getValue(["VariablePay", "Variable", "VarPay", "Variable Pay"]))
                        });
                    }
                });

                setValidRows(valid);
                setValidationErrors(invalid);
                setMsg(invalid.length > 0 ? `Found ${invalid.length} invalid rows.` : "");
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
                // Clear state on success
                setValidRows([]);
                setValidationErrors([]);
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
        const headers = ["Employee", "First Name", "Last Name", "Email", "Base Salary", "Variable Pay"];
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

                <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-8">
                    <label className="group flex flex-col items-center justify-center border-2 border-dashed border-slate-300 rounded-2xl p-16 cursor-pointer hover:bg-slate-50 hover:border-primary-400 transition-all duration-300">
                        <Upload size={32} className="text-slate-400 mb-4 group-hover:text-primary-600" />
                        <p className="font-bold text-slate-700 text-lg group-hover:text-primary-700">Click to upload CSV file</p>
                        <input type="file" accept=".csv" className="hidden" onChange={e => loadCSV(e.target.files[0])} />
                    </label>

                    <AnimatePresence>
                        {validationErrors.length > 0 && (
                            <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} className="mt-8 bg-red-50 border border-red-100 rounded-xl p-6">
                                <div className="flex items-center gap-2 mb-4 text-red-800 font-bold text-lg">
                                    <AlertTriangle size={24} />
                                    Validation Errors ({validationErrors.length} rows skipped)
                                </div>
                                <div className="max-h-60 overflow-y-auto">
                                    <table className="w-full text-sm text-left">
                                        <thead><tr className="text-red-900 font-bold"><th>Row</th><th>ID</th><th>Errors</th></tr></thead>
                                        <tbody>
                                            {validationErrors.map((err, idx) => (
                                                <tr key={idx} className="border-t border-red-100/50 text-red-700">
                                                    <td className="py-2">#{err.index}</td>
                                                    <td className="py-2">{err.id}</td>
                                                    <td className="py-2">{err.errors.join(", ")}</td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>

                    {validRows.length > 0 && (
                        <div className="mt-8 flex justify-between items-center bg-slate-50 p-6 rounded-xl border border-slate-200">
                            <div>
                                <span className="font-bold text-slate-700">{validRows.length}</span> rows ready to upload
                            </div>
                            <button
                                onClick={upload}
                                disabled={loading}
                                className="px-8 py-3 bg-slate-900 text-white rounded-xl font-bold hover:bg-slate-800 transition-all flex items-center gap-2 disabled:opacity-50"
                            >
                                {loading ? "Processing..." : "Confirm Bulk Upload"}
                                {!loading && <ArrowRight size={18} />}
                            </button>
                        </div>
                    )}

                    {msg && (
                        <div className={`mt-6 p-4 rounded-xl border flex items-center gap-3 ${msg.toLowerCase().includes("success") ? "bg-emerald-50 border-emerald-100 text-emerald-800" : "bg-blue-50 border-blue-100 text-blue-800"}`}>
                            <AlertCircle size={20} />
                            <p className="font-medium">{msg}</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
