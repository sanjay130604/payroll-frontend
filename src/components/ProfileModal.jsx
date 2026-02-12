import { useState } from "react";
import axios from "../utils/axiosConfig";
import { motion, AnimatePresence } from "framer-motion";
import { User, Briefcase, CreditCard, MapPin, X, Save } from "lucide-react";

/* ================= OPTIONS ================= */

const BLOOD_GROUPS = ["A+", "A−", "B+", "B−", "AB+", "AB−", "O+", "O−", "Others"];

const EMPLOYEE_TYPES = [
    "Full-Time", "Part-Time", "Contract", "Temporary",
    "Intern", "Trainee", "Permanent"
];

const EDUCATION_LIST = [
    "Higher Secondary", "Diploma", "UG", "PG",
    "BSc", "MSc", "BTech", "MTech", "BCA", "BA", "MA"
];

const SPECIALIZATIONS = [
    "Computer Science", "Information Technology", "Software Engineering",
    "Data Science", "Artificial Intelligence", "Machine Learning",
    "Cyber Security", "Cloud Computing", "DevOps Engineering",
    "Full Stack Development", "Other"
];

const GENDER_OPTIONS = ["Male", "Female", "Other"];

const COUNTRIES = ["India", "USA", "UK", "Canada", "Australia"];

const STATES_BY_COUNTRY = {
    India: [
        "Tamil Nadu", "Kerala", "Karnataka", "Andhra Pradesh", "Telangana",
        "Maharashtra", "Delhi", "Gujarat", "Rajasthan", "Punjab", "West Bengal"
    ],
    USA: ["California", "Texas", "Florida", "New York"],
    UK: ["England", "Scotland", "Wales"],
    Canada: ["Ontario", "Quebec", "British Columbia"],
    Australia: ["New South Wales", "Victoria", "Queensland"]
};

export default function ProfileModal({ employee, onClose, onSaved }) {
    const [form, setForm] = useState({ ...employee, otherSpecialization: "" });
    const [edit, setEdit] = useState(false);

    /* ================= SAVE ================= */
    const save = async () => {
        const { row, otherSpecialization, ...updates } = form;

        if (updates["Specialization"] === "Other") {
            updates["Specialization"] = otherSpecialization;
        }

        // --- VALIDATIONS ---
        const validate = (val, msg) => {
            if (!val || val.trim() === "") { alert(msg + " must be selected"); return false; }
            return true;
        };

        // Required Fields Validation (User Requested)
        if (!validate(updates["gender"], "Gender")) return;
        if (!validate(updates["blood group"], "Blood Group")) return;
        if (!validate(updates["employee type"], "Employee Type")) return;
        if (!validate(updates["education"], "Education")) return;
        if (!validate(updates["Specialization"], "Specialization")) return;
        if (!validate(updates["city"], "City")) return;
        if (!validate(updates["country"], "Country")) return;
        if (!validate(updates["state"], "State")) return;

        // Existing checks
        const dobRegex = /^\d{2}\/\d{2}\/\d{4}$/;
        const phoneRegex = /^\d{10}$/;
        const emailRegex = /@/;
        const countWords = (str) => (str || "").trim().split(/\s+/).filter(w => w.length > 0).length;
        const alphanumericRegex = /^[A-Z0-9]+$/i;
        const digitsOnly = /^\d+$/;

        if (!dobRegex.test(updates["dob"])) { alert("Date of Birth must be in DD/MM/YYYY format (e.g., 13/06/2004)"); return; }

        // Age Validation (18+)
        const [d, m, y] = updates["dob"].split("/").map(Number);
        const dobDate = new Date(y, m - 1, d);
        const today = new Date();
        let age = today.getFullYear() - dobDate.getFullYear();
        const mDiff = today.getMonth() - dobDate.getMonth();
        if (mDiff < 0 || (mDiff === 0 && today.getDate() < dobDate.getDate())) {
            age--;
        }
        if (age < 18) { alert("Employee must be at least 18 years old"); return; }

        if (!phoneRegex.test(updates["phone"])) { alert("Phone Number must be exactly 10 digits"); return; }
        if (countWords(updates["father name"]) < 2) { alert("Father Name must be at least 2 words"); return; }
        if (countWords(updates["mother name"]) < 2) { alert("Mother Name must be at least 2 words"); return; }
        if (!emailRegex.test(updates["personal mail id"])) { alert("Personal Email must be a valid email address"); return; }
        if (countWords(updates["bank name"]) < 2) { alert("Bank Name must be at least 2 words"); return; }

        // Address & City (Min 3 chars)
        if (!updates["current address"] || updates["current address"].trim().length < 3) { alert("Current Address must be at least 3 characters"); return; }
        if (!updates["permanent address"] || updates["permanent address"].trim().length < 3) { alert("Permanent Address must be at least 3 characters"); return; }
        if (!updates["city"] || updates["city"].trim().length < 3) { alert("City must be at least 3 characters"); return; }

        const pfNo = String(updates["pf no"] || "").trim();
        if (pfNo.length < 3) { alert("PF Number must be at least 3 characters/digits"); return; }

        const accNo = String(updates["account number"] || "").trim();
        if (accNo.length < 11 || accNo.length > 16 || !alphanumericRegex.test(accNo)) {
            alert("Account Number must be 11 to 16 characters (letters and numbers allowed)");
            return;
        }

        const pan = String(updates["pan card"] || "").trim().toUpperCase();
        if (pan.length !== 10 || !alphanumericRegex.test(pan)) { alert("PAN Card must be a 10-digit alphanumeric number"); return; }

        const aadhaar = String(updates["aadhaar card"] || "").trim();
        if (aadhaar.length !== 12 || !digitsOnly.test(aadhaar)) { alert("Aadhaar Card must be exactly 12 digits"); return; }

        const pincode = String(updates["pincode"] || "").trim();
        if (pincode.length !== 6 || !digitsOnly.test(pincode)) { alert("Pincode must be exactly 6 digits"); return; }

        try {
            await axios.put("/api/profile/update", {
                row: employee.row,
                updates
            });

            onSaved();
            onClose();
        } catch (err) {
            alert(err.response?.data?.message || "Failed to update profile");
        }
    };

    /* ================= UI HELPERS ================= */

    const view = (v) => (
        <div className="mt-1 bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm font-medium text-slate-700 min-h-[42px] flex items-center">
            {v || <span className="text-slate-400 italic">Not set</span>}
        </div>
    );

    const input = (k, l, readOnly = false) => (
        <div>
            <label className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-1 block ml-1">{l}</label>
            {edit && !readOnly
                ? <input
                    value={form[k] || ""}
                    onChange={e => setForm({ ...form, [k]: e.target.value })}
                    className="mt-1 w-full border border-slate-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 transition-all text-slate-800" />
                : view(form[k])
            }
        </div>
    );

    const select = (k, l, o) => (
        <div>
            <label className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-1 block ml-1">{l}</label>
            {edit
                ? <div className="relative mt-1">
                    <select
                        value={form[k] || ""}
                        onChange={e => setForm({ ...form, [k]: e.target.value })}
                        className="w-full border border-slate-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 transition-all text-slate-800 appearance-none bg-white">
                        <option value="">Select Option</option>
                        {o.map(v => <option key={v} value={v}>{v}</option>)}
                    </select>
                    <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400">
                        <span className="text-[10px]">▼</span>
                    </div>
                </div>
                : view(form[k])
            }
        </div>
    );

    return (
        <AnimatePresence>
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm flex justify-center items-center z-50 p-4"
            >
                <motion.div
                    initial={{ scale: 0.95, opacity: 0, y: 20 }}
                    animate={{ scale: 1, opacity: 1, y: 0 }}
                    exit={{ scale: 0.95, opacity: 0, y: 20 }}
                    className="bg-white max-w-5xl w-full rounded-2xl shadow-2xl overflow-hidden max-h-[90vh] flex flex-col"
                >

                    {/* HEADER */}
                    <div className="px-8 py-6 border-b border-slate-100 flex justify-between items-center bg-white sticky top-0 z-10">
                        <div className="flex items-center gap-4">
                            <div className="h-12 w-12 rounded-full bg-primary-100 text-primary-600 flex items-center justify-center font-bold text-xl">
                                {form["frist name"]?.charAt(0)?.toUpperCase()}
                            </div>
                            <div>
                                <h2 className="text-xl font-bold text-slate-800">Employee Profile</h2>
                                <p className="text-sm text-slate-500 font-medium">
                                    {form["frist name"]} {form["last name"]} · {form["employeeld"]}
                                </p>
                            </div>
                        </div>
                        <button
                            onClick={onClose}
                            className="p-2 rounded-full hover:bg-slate-100 text-slate-400 hover:text-slate-600 transition-colors"
                        >
                            <X size={24} />
                        </button>
                    </div>

                    <div className="flex-1 overflow-y-auto p-8 bg-slate-50/50">
                        <div className="space-y-8 max-w-4xl mx-auto">

                            {/* PERSONAL */}
                            <section className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100">
                                <h3 className="text-lg font-bold text-slate-800 mb-6 flex items-center gap-2">
                                    <User className="text-primary-500" size={20} />
                                    Personal Information
                                </h3>
                                <div className="grid md:grid-cols-2 gap-x-6 gap-y-5">
                                    {input("frist name", "First Name", true)}
                                    {input("last name", "Last Name", true)}
                                    {select("gender", "Gender", GENDER_OPTIONS)}
                                    {input("dob", "Date of Birth")}
                                    {input("phone", "Phone Number")}
                                    {input("father name", "Father Name")}
                                    {input("mother name", "Mother Name")}
                                    {select("blood group", "Blood Group", BLOOD_GROUPS)}
                                </div>
                            </section>

                            {/* OFFICIAL */}
                            <section className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100">
                                <h3 className="text-lg font-bold text-slate-800 mb-6 flex items-center gap-2">
                                    <Briefcase className="text-orange-500" size={20} />
                                    Official Details
                                </h3>
                                <div className="grid md:grid-cols-2 gap-x-6 gap-y-5">
                                    {input("designation", "Designation")}
                                    {input("company mail id", "Company Email", true)}
                                    {input("personal mail id", "Personal Email")}
                                    {select("employee type", "Employee Type", EMPLOYEE_TYPES)}
                                    {select("education", "Education", EDUCATION_LIST)}
                                    {select("Specialization", "Specialization", SPECIALIZATIONS)}

                                    {edit && form["Specialization"] === "Other" &&
                                        input("otherSpecialization", "Specify Specialization")}
                                </div>
                            </section>

                            {/* BANK */}
                            <section className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100">
                                <h3 className="text-lg font-bold text-slate-800 mb-6 flex items-center gap-2">
                                    <CreditCard className="text-emerald-500" size={20} />
                                    Banking & Identity
                                </h3>
                                <div className="grid md:grid-cols-2 gap-x-6 gap-y-5">
                                    {input("bank name", "Bank Name")}
                                    {input("account number", "Account Number")}
                                    {input("pf no", "PF Number")}
                                    {input("pan card", "PAN Card")}
                                    {input("aadhaar card", "Aadhaar Card")}
                                </div>
                            </section>

                            {/* ADDRESS */}
                            <section className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100">
                                <h3 className="text-lg font-bold text-slate-800 mb-6 flex items-center gap-2">
                                    <MapPin className="text-red-500" size={20} />
                                    Address Details
                                </h3>
                                <div className="grid md:grid-cols-2 gap-x-6 gap-y-5">
                                    <div className="md:col-span-2">
                                        {input("current address", "Current Address")}
                                    </div>
                                    <div className="md:col-span-2">
                                        {input("permanent address", "Permanent Address")}
                                    </div>
                                    {input("city", "City")}

                                    {/* COUNTRY */}
                                    {select("country", "Country", COUNTRIES)}

                                    {/* STATE (DEPENDENT) */}
                                    <div>
                                        <label className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-1 block ml-1">State</label>
                                        {edit ? (
                                            <div className="relative mt-1">
                                                <select
                                                    value={form.state || ""}
                                                    onChange={e =>
                                                        setForm({ ...form, state: e.target.value })
                                                    }
                                                    className="w-full border border-slate-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 transition-all text-slate-800 appearance-none bg-white"
                                                    disabled={!form.country}
                                                >
                                                    <option value="">Select State</option>
                                                    {(STATES_BY_COUNTRY[form.country] || []).map(s =>
                                                        <option key={s} value={s}>{s}</option>
                                                    )}
                                                </select>
                                                <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400">
                                                    <span className="text-[10px]">▼</span>
                                                </div>
                                            </div>
                                        ) : view(form.state)}
                                    </div>

                                    {input("pincode", "Pincode")}
                                </div>
                            </section>
                        </div>
                    </div>

                    {/* FOOTER */}
                    <div className="px-8 py-5 border-t border-slate-100 flex justify-end gap-3 bg-white">
                        {edit
                            ? (
                                <>
                                    <button
                                        onClick={() => setEdit(false)}
                                        className="px-6 py-2.5 border border-slate-200 text-slate-600 rounded-xl font-medium hover:bg-slate-50 transition-colors"
                                    >
                                        Cancel Edit
                                    </button>
                                    <button
                                        onClick={save}
                                        className="px-8 py-2.5 bg-primary-600 text-white rounded-xl font-semibold hover:bg-primary-700 shadow-lg shadow-primary-500/20 transition-all flex items-center gap-2"
                                    >
                                        <Save size={18} />
                                        Save Changes
                                    </button>
                                </>
                            )
                            : (
                                <>
                                    <button onClick={onClose} className="px-6 py-2.5 border border-slate-200 text-slate-600 rounded-xl font-medium hover:bg-slate-50 transition-colors">Close</button>
                                    <button onClick={() => setEdit(true)} className="px-8 py-2.5 bg-slate-900 text-white rounded-xl font-semibold hover:bg-slate-800 shadow-lg transition-all">Edit Profile</button>
                                </>
                            )
                        }
                    </div>

                </motion.div>
            </motion.div>
        </AnimatePresence>
    );
}
