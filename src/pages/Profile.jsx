import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { User, Mail, Lock, Globe, ArrowRight, LogOut, Camera } from "lucide-react";

export default function Profile() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    username: "Sanjay",
    email: "innocentsanjay2004@gmail.com",
    password: "",
    confirmPassword: "",
    language: "English",
    // New Fields
    gender: "",
    bloodGroup: "",
    employeeType: "",
    education: "",
    specialization: "",
    btech: "", // Keeping this as user asked, though redundant if specialization covers it. 
    // actually user said "BTech - must be select". I'll treat it as specific field if they insist, 
    // OR map it to 'education' = 'BTech'. 
    // Let's rely on Education list having BTech.
    city: "",
    country: "",
    state: "",
  });

  const BLOOD_GROUPS = ["A+", "A−", "B+", "B−", "AB+", "AB−", "O+", "O−", "Others"];
  const EMPLOYEE_TYPES = ["Full-Time", "Part-Time", "Contract", "Temporary", "Intern"];
  const EDUCATION_LIST = ["Higher Secondary", "Diploma", "UG", "PG", "BTech", "MTech", "BCA", "MCA"];
  const SPECIALIZATIONS = ["CS", "IT", "ECE", "EEE", "Mech", "Civil", "Other"];
  const GENDER_OPTIONS = ["Male", "Female", "Other"];
  const COUNTRIES = ["India", "USA", "UK", "Canada", "Australia"];
  const STATES_BY_COUNTRY = {
    India: ["Tamil Nadu", "Kerala", "Karnataka", "Maharashtra", "Delhi"],
    USA: ["California", "Texas", "New York"],
    UK: ["London", "Manchester"],
    Canada: ["Toronto", "Vancouver"],
    Australia: ["Sydney", "Melbourne"]
  };

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  // ✅ SUBMIT HANDLER
  const handleSubmit = (e) => {
    e.preventDefault();

    // 🔒 Validation
    if (form.password && form.password !== form.confirmPassword) {
      alert("Passwords do not match");
      return;
    }

    // Required Fields Check
    const required = [
      { k: "gender", l: "Gender" },
      { k: "bloodGroup", l: "Blood Group" },
      { k: "employeeType", l: "Employee Type" },
      { k: "education", l: "Education" },
      { k: "specialization", l: "Specialization" },
      { k: "city", l: "City" },
      { k: "country", l: "Country" },
      { k: "state", l: "State" }
    ];

    for (const f of required) {
      if (!form[f.k]) {
        alert(`${f.l} must be selected (Required)`);
        return;
      }
    }

    // ✅ TEMPORARY FRONTEND FLOW
    alert("Profile updated successfully");
    navigate("/api/payroll-summary");
  };

  const logout = () => {
    localStorage.clear();
    navigate("/");
  };

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-6 animate-in fade-in duration-500">

      {/* Background Decoration */}
      <div className="absolute top-0 left-0 w-full h-64 bg-primary-600 z-0"></div>

      <div className="w-full max-w-5xl bg-white rounded-3xl shadow-xl overflow-hidden flex flex-col md:flex-row relative z-10 border border-slate-100">

        {/* ================= LEFT SIDEBAR ================= */}
        <div className="w-full md:w-1/3 bg-slate-50/50 p-8 border-r border-slate-100 flex flex-col items-center">

          <div className="relative mb-6">
            <div className="w-32 h-32 rounded-full p-1 bg-white shadow-lg">
              <img
                src="https://i.pravatar.cc/150?img=12"
                className="w-full h-full rounded-full object-cover"
                alt="profile"
              />
            </div>
            <button className="absolute bottom-1 right-1 p-2 bg-primary-600 text-white rounded-full shadow-md hover:bg-primary-700 transition-colors">
              <Camera size={16} />
            </button>
          </div>

          <h2 className="text-2xl font-bold text-slate-800">{form.username}</h2>
          <p className="text-slate-500 text-sm font-medium mb-8">{form.email}</p>

          <div className="w-full space-y-2">
            <MenuItem active label="Account Settings" icon={<User size={18} />} />
            {/* <MenuItem label="Notifications" icon={<Bell size={18} />} /> */}
            <div className="h-px bg-slate-200 my-4 mx-4"></div>
            <MenuItem label="Sign Out" danger onClick={logout} icon={<LogOut size={18} />} />
          </div>
        </div>

        {/* ================= RIGHT FORM ================= */}
        <div className="w-full md:w-2/3 p-8 md:p-12">

          <div className="mb-8">
            <h1 className="text-2xl font-bold text-slate-800 mb-1">Edit Profile</h1>
            <p className="text-slate-500 text-sm">Update your personal details and password</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

              <InputGroup
                label="Full Name"
                icon={<User size={18} />}
                name="username"
                value={form.username}
                onChange={handleChange}
              />

              <InputGroup
                label="Email Address"
                icon={<Mail size={18} />}
                name="email"
                value={form.email}
                onChange={handleChange}
                disabled
              />

              <InputGroup
                label="New Password"
                icon={<Lock size={18} />}
                type="password"
                name="password"
                value={form.password}
                onChange={handleChange}
                placeholder="••••••••"
              />

              <InputGroup
                label="Confirm Password"
                icon={<Lock size={18} />}
                type="password"
                name="confirmPassword"
                value={form.confirmPassword}
                onChange={handleChange}
                placeholder="••••••••"
              />

              <div className="md:col-span-2">
                <SelectGroup
                  label="Language Preference"
                  icon={<Globe size={18} />}
                  name="language"
                  value={form.language}
                  onChange={handleChange}
                  options={["English", "Tamil", "Hindi"]}
                />
              </div>

              {/* NEW FIELDS */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:col-span-2">
                <SelectGroup
                  label="Gender"
                  icon={<User size={18} />}
                  name="gender"
                  value={form.gender}
                  onChange={handleChange}
                  options={GENDER_OPTIONS}
                />
                <SelectGroup
                  label="Blood Group"
                  icon={<User size={18} />}
                  name="bloodGroup"
                  value={form.bloodGroup}
                  onChange={handleChange}
                  options={BLOOD_GROUPS}
                />
                <SelectGroup
                  label="Employee Type"
                  icon={<User size={18} />}
                  name="employeeType"
                  value={form.employeeType}
                  onChange={handleChange}
                  options={EMPLOYEE_TYPES}
                />
                <SelectGroup
                  label="Education"
                  icon={<User size={18} />}
                  name="education"
                  value={form.education}
                  onChange={handleChange}
                  options={EDUCATION_LIST}
                />
                <SelectGroup
                  label="Specialization"
                  icon={<User size={18} />}
                  name="specialization"
                  value={form.specialization}
                  onChange={handleChange}
                  options={SPECIALIZATIONS}
                />
                <SelectGroup
                  label="Country"
                  icon={<Globe size={18} />}
                  name="country"
                  value={form.country}
                  onChange={handleChange}
                  options={COUNTRIES}
                />
                <SelectGroup
                  label="State"
                  icon={<Globe size={18} />}
                  name="state"
                  value={form.state}
                  onChange={handleChange}
                  options={STATES_BY_COUNTRY[form.country] || []}
                  disabled={!form.country}
                />
                <InputGroup
                  label="City"
                  icon={<Globe size={18} />}
                  name="city"
                  value={form.city}
                  onChange={handleChange}
                  placeholder="Enter City"
                />
              </div>
            </div>

            <div className="pt-6 flex justify-end">
              <button
                type="submit"
                className="px-8 py-3 bg-primary-600 text-white rounded-xl font-semibold shadow-lg shadow-primary-500/30 hover:bg-primary-700 hover:shadow-primary-600/40 transition-all flex items-center gap-2"
              >
                Save Changes
                <ArrowRight size={18} />
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

/* ================= COMPONENTS ================= */

const MenuItem = ({ label, active, danger, onClick, icon }) => (
  <div
    onClick={onClick}
    className={`flex items-center gap-3 px-4 py-3 rounded-xl cursor-pointer transition-all font-medium text-sm
      ${active
        ? "bg-white text-primary-600 shadow-sm border border-slate-100"
        : danger
          ? "text-red-600 hover:bg-red-50"
          : "text-slate-600 hover:bg-white hover:shadow-sm"
      }
    `}
  >
    {icon}
    <span>{label}</span>
  </div>
);

const InputGroup = ({ label, icon, ...props }) => (
  <div className="space-y-1.5">
    <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider ml-1">
      {label}
    </label>
    <div className="relative">
      <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400">
        {icon}
      </div>
      <input
        {...props}
        className={`w-full pl-11 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-slate-700 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 transition-all ${props.disabled ? "opacity-60 cursor-not-allowed" : ""}`}
      />
    </div>
  </div>
);

const SelectGroup = ({ label, icon, options, ...props }) => (
  <div className="space-y-1.5">
    <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider ml-1">
      {label}
    </label>
    <div className="relative">
      <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400">
        {icon}
      </div>
      <select
        {...props}
        className="w-full pl-11 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-slate-700 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 transition-all appearance-none"
      >
        {options.map((opt) => (
          <option key={opt} value={opt}>{opt}</option>
        ))}
      </select>
    </div>
  </div>
);
