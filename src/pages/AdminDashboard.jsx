import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";
import useSocket from "../hooks/useSocket";
import Toast from "../components/Toast";

const TABS = [
    { key: "contacts", label: "Contacts" },
    { key: "help_requests", label: "Help Requests" },
    { key: "applicants", label: "Applicants" },
    { key: "donations", label: "Donations" },
];

export default function AdminDashboard() {
    const navigate = useNavigate();
    const [activeTab, setActiveTab] = useState("contacts");
    const [data, setData] = useState({});
    const [loading, setLoading] = useState(true);
    const [toast, setToast] = useState(null);

    const token = localStorage.getItem("adminToken");

    // ─── Redirect if not logged in ─────────────────────────────
    useEffect(() => { if (!token) navigate("/admin"); }, [token, navigate]);

    // ─── Fetch dashboard data ──────────────────────────────────
    const fetchData = async () => {
        setLoading(true);
        try {
            const json = await api.get("/admin/dashboard", token);
            if (json.success) setData(json.data);
        } catch (err) {
            console.error("Failed to load dashboard:", err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => { fetchData(); }, []);

    // ─── Real-time socket listeners ────────────────────────────
    useSocket("new_contact", (entry) => {
        setToast({ type: "info", message: `New contact from ${entry.name}` });
        fetchData();
    });
    useSocket("new_help_request", (entry) => {
        setToast({ type: "info", message: `New help request from ${entry.full_name}` });
        fetchData();
    });
    useSocket("new_applicant", (entry) => {
        setToast({ type: "info", message: `New application from ${entry.full_name}` });
        fetchData();
    });
    useSocket("new_donation", (entry) => {
        setToast({ type: "info", message: `New donation of ₹${entry.amount}` });
        fetchData();
    });

    // ─── Delete ────────────────────────────────────────────────
    const handleDelete = async (type, id) => {
        if (!confirm("Delete this entry?")) return;
        try {
            await api.del(`/admin/${type}/${id}`, token);
            setToast({ type: "success", message: `Deleted ${type} #${id}` });
            fetchData();
        } catch { setToast({ type: "error", message: "Delete failed." }); }
    };

    // ─── Status Update ─────────────────────────────────────────
    const handleStatus = async (type, id, newStatus) => {
        try {
            await api.patch(`/admin/${type}/${id}/status`, { status: newStatus }, token);
            fetchData();
        } catch { setToast({ type: "error", message: "Status update failed." }); }
    };

    // ─── Logout ────────────────────────────────────────────────
    const logout = () => { localStorage.removeItem("adminToken"); navigate("/admin"); };

    const rows = data[activeTab] || [];

    const statusBadge = (s) => {
        const colors = {
            new: "bg-blue-100 text-blue-800",
            reviewed: "bg-yellow-100 text-yellow-800",
            in_progress: "bg-purple-100 text-purple-800",
            resolved: "bg-green-100 text-green-800",
            closed: "bg-gray-100 text-gray-800",
        };
        return (
            <span className={`px-2 py-1 rounded-full text-xs font-semibold ${colors[s] || "bg-gray-100 text-gray-800"}`}>
                {s}
            </span>
        );
    };

    return (
        <section className="w-full min-h-screen bg-gray-100 pt-24 px-4 pb-12">
            <Toast data={toast} onClose={() => setToast(null)} />

            <div className="max-w-7xl mx-auto">
                {/* Header */}
                <div className="flex items-center justify-between mb-8">
                    <h1 className="text-3xl font-bold text-gray-900">Admin Dashboard</h1>
                    <button onClick={logout} className="px-4 py-2 text-sm rounded-full bg-red-500 text-white hover:bg-red-600 transition">
                        Logout
                    </button>
                </div>

                {/* Tabs */}
                <div className="flex gap-2 mb-6 flex-wrap">
                    {TABS.map((tab) => (
                        <button key={tab.key} onClick={() => setActiveTab(tab.key)}
                            className={`px-5 py-2 rounded-full text-sm font-medium transition ${activeTab === tab.key ? "bg-black text-white" : "bg-white text-gray-700 border border-gray-300 hover:bg-gray-50"
                                }`}>
                            {tab.label} ({(data[tab.key] || []).length})
                        </button>
                    ))}
                </div>

                {/* Table */}
                {loading ? (
                    <p className="text-gray-500">Loading…</p>
                ) : rows.length === 0 ? (
                    <p className="text-gray-500">No entries found.</p>
                ) : (
                    <div className="overflow-x-auto bg-white rounded-2xl shadow border border-gray-200">
                        <table className="w-full text-sm text-left">
                            <thead className="bg-gray-50 text-gray-600 uppercase text-xs">
                                <tr>
                                    <th className="px-4 py-3">ID</th>
                                    {activeTab === "contacts" && (<><th className="px-4 py-3">Name</th><th className="px-4 py-3">Email</th><th className="px-4 py-3">Phone</th><th className="px-4 py-3">Message</th></>)}
                                    {activeTab === "help_requests" && (<><th className="px-4 py-3">Name</th><th className="px-4 py-3">Phone</th><th className="px-4 py-3">Emergency</th><th className="px-4 py-3">Help Types</th></>)}
                                    {activeTab === "applicants" && (<><th className="px-4 py-3">Name</th><th className="px-4 py-3">Phone</th><th className="px-4 py-3">Email</th><th className="px-4 py-3">State</th></>)}
                                    {activeTab === "donations" && (<><th className="px-4 py-3">Name</th><th className="px-4 py-3">Mobile</th><th className="px-4 py-3">Email</th><th className="px-4 py-3">Amount</th></>)}
                                    <th className="px-4 py-3">Status</th>
                                    <th className="px-4 py-3">Date</th>
                                    <th className="px-4 py-3">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100">
                                {rows.map((row) => (
                                    <tr key={row.id} className="hover:bg-gray-50">
                                        <td className="px-4 py-3 font-mono text-xs">{row.id}</td>
                                        {activeTab === "contacts" && (<><td className="px-4 py-3">{row.name}</td><td className="px-4 py-3">{row.email}</td><td className="px-4 py-3">{row.phone}</td><td className="px-4 py-3 max-w-[200px] truncate">{row.message}</td></>)}
                                        {activeTab === "help_requests" && (<><td className="px-4 py-3">{row.full_name}</td><td className="px-4 py-3">{row.phone}</td><td className="px-4 py-3">{row.emergency}</td><td className="px-4 py-3 max-w-[200px] truncate">{row.help_types}</td></>)}
                                        {activeTab === "applicants" && (<><td className="px-4 py-3">{row.full_name}</td><td className="px-4 py-3">{row.phone}</td><td className="px-4 py-3">{row.email}</td><td className="px-4 py-3">{row.state}</td></>)}
                                        {activeTab === "donations" && (<><td className="px-4 py-3">{row.full_name}</td><td className="px-4 py-3">{row.mobile}</td><td className="px-4 py-3">{row.email}</td><td className="px-4 py-3 font-semibold">₹{row.amount}</td></>)}
                                        <td className="px-4 py-3">{statusBadge(row.status)}</td>
                                        <td className="px-4 py-3 text-xs text-gray-500">{new Date(row.created_at).toLocaleDateString()}</td>
                                        <td className="px-4 py-3 flex gap-2">
                                            <select value={row.status} onChange={(e) => handleStatus(activeTab, row.id, e.target.value)} className="text-xs border rounded-lg px-2 py-1">
                                                <option value="new">New</option>
                                                <option value="reviewed">Reviewed</option>
                                                <option value="in_progress">In Progress</option>
                                                <option value="resolved">Resolved</option>
                                                <option value="closed">Closed</option>
                                            </select>
                                            <button onClick={() => handleDelete(activeTab, row.id)} className="text-red-500 hover:text-red-700 text-xs font-semibold">Delete</button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>
        </section>
    );
}
