import { useEffect, useState } from "react";
import axios from "../utils/axiosConfig";
import { Plus, Upload, Search, FileText, Edit, Trash2, X, Download } from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function PayFixation() {
    const navigate = useNavigate();
    const [list, setList] = useState([]);
    const [loading, setLoading] = useState(false);
    const [searchTerm, setSearchTerm] = useState("");
    const [showEdit, setShowEdit] = useState(false);
    const [editingUser, setEditingUser] = useState(null);

    useEffect(() => {
        fetchFixation();
    }, []);

    const fetchFixation = async () => {
        setLoading(true);
        try {
            const res = await axios.get("/api/finance/pay-fixation");
            if (res.data.success) {
                setList(res.data.list);
            }
        } catch (err) {
            console.error("Failed to fetch fixation data", err);
        } finally {
            setLoading(false);
        }
    };

    const handleUpdate = async (e) => {
        e.preventDefault();
        try {
            const res = await axios.post("/api/finance/pay-fixation/update", editingUser);
            if (res.data.success) {
                alert("Updated successfully");
                setShowEdit(false);
                fetchFixation();
            }
        } catch (err) {
            alert("Update failed");
        }
    };

    const handleDelete = async (empId) => {
        if (!window.confirm("Are you sure you want to delete pay data for this employee? Values will be set to 0.")) return;
        try {
            const res = await axios.post("/api/finance/pay-fixation/delete", { employeeId: empId });
            if (res.data.success) {
                alert("Deleted successfully");
                fetchFixation();
            }
        } catch (err) {
            alert("Delete failed");
        }
    };

    const downloadTemplate = () => {
        const headers = ["Employee ID", "First Name", "Last Name", "Email", "Base Salary", "Variable Pay"];
        const csvContent = "data:text/csv;charset=utf-8," + headers.join(",") + "\n";
        const encodedUri = encodeURI(csvContent);
        const link = document.createElement("a");
        link.setAttribute("href", encodedUri);
        link.setAttribute("download", "pay_fixation_template.csv");
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    const filteredList = list.filter(u =>
        u.employeeId.toLowerCase().includes(searchTerm.toLowerCase()) ||
        u.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        u.lastName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        u.email.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="min-h-screen bg-slate-50 p-8">
            <div className="max-w-7xl mx-auto">
                {/* Header */}
                <div className="flex justify-between items-center mb-8">
                    <div>
                        <h2 className="text-3xl font-bold text-slate-900">Pay Fixation</h2>
                        <p className="text-slate-500">Manage employee basic and variable pay details</p>
                    </div>
                    <div className="flex gap-4">
                        <button
                            onClick={downloadTemplate}
                            className="flex items-center gap-2 px-4 py-2 bg-white border border-slate-200 rounded-lg hover:bg-slate-50 transition-all font-medium"
                        >
                            <Download size={18} />
                            Template
                        </button>
                        <button
                            onClick={() => navigate("/admin/pay-fixation/bulk-upload")}
                            className="flex items-center gap-2 px-4 py-2 bg-white border border-slate-200 rounded-lg hover:bg-slate-50 transition-all font-medium"
                        >
                            <Upload size={18} />
                            Bulk Upload
                        </button>
                    </div>
                </div>

                {/* Search */}
                <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 mb-8">
                    <div className="relative max-w-md">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                        <input
                            type="text"
                            placeholder="Search by ID, Name or Email..."
                            className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 outline-none transition-all"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                </div>

                {/* Table */}
                <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
                    <table className="w-full text-left">
                        <thead className="bg-slate-50 border-b border-slate-100">
                            <tr>
                                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Employee ID</th>
                                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Name</th>
                                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Email</th>
                                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Basic</th>
                                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Variable</th>
                                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                            {loading ? (
                                <tr><td colSpan="6" className="text-center py-10 text-slate-500">Loading...</td></tr>
                            ) : filteredList.length === 0 ? (
                                <tr><td colSpan="6" className="text-center py-10 text-slate-500">No records found</td></tr>
                            ) : (
                                filteredList.map((u) => (
                                    <tr key={u.employeeId} className="hover:bg-slate-50 transition-colors">
                                        <td className="px-6 py-4 font-medium text-slate-900">{u.employeeId}</td>
                                        <td className="px-6 py-4 text-slate-600">{u.firstName} {u.lastName}</td>
                                        <td className="px-6 py-4 text-slate-600">{u.email}</td>
                                        <td className="px-6 py-4 text-slate-900 font-semibold">₹{u.basic}</td>
                                        <td className="px-6 py-4 text-slate-900 font-semibold">₹{u.variablePay}</td>
                                        <td className="px-6 py-4 text-right">
                                            <div className="flex justify-end gap-2">
                                                <button
                                                    onClick={() => { setEditingUser(u); setShowEdit(true); }}
                                                    className="p-2 text-slate-400 hover:text-primary-600 hover:bg-primary-50 rounded-lg transition-all"
                                                >
                                                    <Edit size={18} />
                                                </button>
                                                <button
                                                    onClick={() => handleDelete(u.employeeId)}
                                                    className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all"
                                                >
                                                    <Trash2 size={18} />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Edit Modal */}
            {showEdit && (
                <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm flex justify-center items-center z-50">
                    <div className="bg-white w-[500px] rounded-2xl p-8 shadow-2xl animate-in slide-in-from-bottom-4">
                        <div className="flex justify-between items-center mb-6">
                            <h3 className="text-xl font-bold text-slate-800">Edit Pay Details</h3>
                            <button onClick={() => setShowEdit(false)} className="text-slate-400 hover:text-slate-600"><X size={24} /></button>
                        </div>
                        <form onSubmit={handleUpdate} className="space-y-4">
                            <div>
                                <label className="block text-sm font-semibold text-slate-500 mb-1 uppercase tracking-wider">Employee ID</label>
                                <input type="text" readOnly className="w-full bg-slate-50 border border-slate-200 rounded-lg px-4 py-2 text-slate-500 outline-none" value={editingUser.employeeId} />
                            </div>
                            <div>
                                <label className="block text-sm font-semibold text-slate-500 mb-1 uppercase tracking-wider">Employee Name</label>
                                <input type="text" readOnly className="w-full bg-slate-50 border border-slate-200 rounded-lg px-4 py-2 text-slate-500 outline-none" value={`${editingUser.firstName} ${editingUser.lastName}`} />
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-semibold text-slate-700 mb-1">Base Salary</label>
                                    <input
                                        type="number"
                                        required
                                        className="w-full border border-slate-200 rounded-lg px-4 py-2 focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 outline-none"
                                        value={editingUser.basic}
                                        onChange={(e) => setEditingUser({ ...editingUser, basic: e.target.value })}
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-semibold text-slate-700 mb-1">Variable Pay</label>
                                    <input
                                        type="number"
                                        required
                                        className="w-full border border-slate-200 rounded-lg px-4 py-2 focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 outline-none"
                                        value={editingUser.variablePay}
                                        onChange={(e) => setEditingUser({ ...editingUser, variablePay: e.target.value })}
                                    />
                                </div>
                            </div>
                            <div className="flex gap-4 pt-4">
                                <button type="button" onClick={() => setShowEdit(false)} className="flex-1 py-2 border border-slate-200 rounded-xl font-medium hover:bg-slate-50 transition-colors">Cancel</button>
                                <button type="submit" className="flex-1 py-2 bg-primary-600 text-white rounded-xl font-bold hover:bg-primary-700 transition-colors shadow-lg shadow-primary-500/20">Save Changes</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}
