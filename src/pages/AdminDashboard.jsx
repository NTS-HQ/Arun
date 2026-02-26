import { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";
import useSocket from "../hooks/useSocket";
import Toast from "../components/Toast";

const SOCKET_URL = import.meta.env.VITE_SOCKET_URL || "http://localhost:5000";

const TABS = [
    { key: "contacts", label: "Contacts" },
    { key: "help_requests", label: "Help Requests" },
    { key: "applicants", label: "Applicants" },
    { key: "donations", label: "Donations" },
];

const STATUSES = ["new", "reviewed", "in_progress", "resolved", "closed"];

const STATUS_COLORS = {
    new: "bg-blue-100 text-blue-800",
    reviewed: "bg-yellow-100 text-yellow-800",
    in_progress: "bg-purple-100 text-purple-800",
    resolved: "bg-green-100 text-green-800",
    closed: "bg-gray-200 text-gray-700",
};

// ─── Column definitions per tab ────────────────────────────
const COLUMNS = {
    contacts: [
        { key: "name", label: "Name" },
        { key: "email", label: "Email" },
        { key: "phone", label: "Phone" },
        { key: "message", label: "Message", truncate: true },
        { key: "attachment_url", label: "File", isFile: true },
        { key: "terms_accepted", label: "Terms", isBool: true },
    ],
    help_requests: [
        { key: "full_name", label: "Name" },
        { key: "dob", label: "DOB" },
        { key: "gender", label: "Gender" },
        { key: "phone", label: "Phone" },
        { key: "email", label: "Email" },
        { key: "emergency", label: "Emergency" },
        { key: "help_types", label: "Help Types", truncate: true },
        { key: "state", label: "State" },
        { key: "district", label: "District" },
        { key: "attachment_url", label: "File", isFile: true },
        { key: "terms_accepted", label: "Terms", isBool: true },
    ],
    applicants: [
        { key: "full_name", label: "Name" },
        { key: "phone", label: "Phone" },
        { key: "email", label: "Email" },
        { key: "state", label: "State" },
        { key: "district", label: "District" },
        { key: "city", label: "City" },
        { key: "pincode", label: "Pincode" },
        { key: "referred_by", label: "Referred By" },
        { key: "photo_url", label: "Photo", isImage: true },
        { key: "terms_accepted", label: "Terms", isBool: true },
    ],
    donations: [
        { key: "full_name", label: "Name" },
        { key: "mobile", label: "Mobile" },
        { key: "email", label: "Email" },
        { key: "amount", label: "Amount", isAmount: true },
        { key: "attachment_url", label: "Receipt", isFile: true },
        { key: "terms_accepted", label: "Terms", isBool: true },
    ],
};

// ─── Image Preview Modal ────────────────────────────────────
function ImageModal({ src, onClose }) {
    if (!src) return null;
    return (
        <div className="fixed inset-0 z-50 bg-black/70 flex items-center justify-center p-4" onClick={onClose}>
            <div className="relative max-w-3xl w-full" onClick={(e) => e.stopPropagation()}>
                <img src={src} alt="Preview" className="w-full rounded-2xl shadow-2xl object-contain max-h-[80vh]" />
                <button onClick={onClose}
                    className="absolute -top-3 -right-3 bg-white text-gray-800 rounded-full w-8 h-8 flex items-center justify-center shadow-lg font-bold hover:bg-red-500 hover:text-white transition">
                    ×
                </button>
            </div>
        </div>
    );
}

// ─── Cell Renderer ──────────────────────────────────────────
function Cell({ col, value, onImageClick }) {
    const fileBase = import.meta.env.VITE_SOCKET_URL || "http://localhost:5000";

    if (col.isImage && value) {
        return (
            <td className="px-3 py-2">
                <img src={`${fileBase}${value}`} alt="photo"
                    className="w-10 h-10 rounded-lg object-cover cursor-pointer hover:opacity-80 transition border border-gray-200"
                    onClick={() => onImageClick(`${fileBase}${value}`)} />
            </td>
        );
    }
    if (col.isFile && value) {
        const isImage = /\.(jpg|jpeg|png|gif|webp)$/i.test(value);
        return (
            <td className="px-3 py-2">
                <div className="flex items-center gap-2">
                    {isImage && (
                        <img src={`${fileBase}${value}`} alt="attach"
                            className="w-8 h-8 rounded object-cover cursor-pointer hover:opacity-80"
                            onClick={() => onImageClick(`${fileBase}${value}`)} />
                    )}
                    <a href={`${fileBase}${value}`} target="_blank" rel="noreferrer"
                        className="text-xs text-blue-600 hover:underline font-medium">
                        {isImage ? "View" : "Download"}
                    </a>
                </div>
            </td>
        );
    }
    if (col.isBool) {
        return (
            <td className="px-3 py-2">
                <span className={`px-2 py-0.5 rounded-full text-xs font-semibold ${value ? "bg-green-100 text-green-700" : "bg-red-100 text-red-600"}`}>
                    {value ? "✓ Yes" : "✗ No"}
                </span>
            </td>
        );
    }
    if (col.isAmount) {
        return <td className="px-3 py-2 font-semibold text-green-700">₹{value}</td>;
    }
    return (
        <td className={`px-3 py-2 text-gray-700 ${col.truncate ? "max-w-[150px] truncate" : ""}`}>
            {value || <span className="text-gray-400 text-xs">—</span>}
        </td>
    );
}

// ─── Main Dashboard ─────────────────────────────────────────
export default function AdminDashboard() {
    const navigate = useNavigate();
    const [activeTab, setActiveTab] = useState("contacts");
    const [data, setData] = useState({});
    const [loading, setLoading] = useState(true);
    const [toast, setToast] = useState(null);
    const [search, setSearch] = useState("");
    const [statusFilter, setStatusFilter] = useState("all");
    const [previewImg, setPreviewImg] = useState(null);

    const token = localStorage.getItem("adminToken");
    useEffect(() => { if (!token) navigate("/admin"); }, [token, navigate]);

    // ─── Fetch data ─────────────────────────────────────────
    const fetchData = useCallback(async () => {
        setLoading(true);
        try {
            const json = await api.get("/admin/dashboard", token);
            if (json.success) setData(json.data);
        } catch (err) {
            console.error("Dashboard load failed:", err);
        } finally {
            setLoading(false);
        }
    }, [token]);

    useEffect(() => { fetchData(); }, [fetchData]);

    // ─── Realtime ───────────────────────────────────────────
    useSocket("new_contact", (e) => { setToast({ type: "info", message: `New contact from ${e.name}` }); fetchData(); });
    useSocket("new_help_request", (e) => { setToast({ type: "info", message: `Help request from ${e.full_name}` }); fetchData(); });
    useSocket("new_applicant", (e) => { setToast({ type: "info", message: `Application from ${e.full_name}` }); fetchData(); });
    useSocket("new_donation", (e) => { setToast({ type: "info", message: `Donation ₹${e.amount} received` }); fetchData(); });

    // ─── Actions ─────────────────────────────────────────────
    const handleDelete = async (type, id) => {
        if (!confirm("Delete this entry permanently?")) return;
        try {
            await api.del(`/admin/${type}/${id}`, token);
            setToast({ type: "success", message: `Deleted ${type} #${id}` });
            fetchData();
        } catch { setToast({ type: "error", message: "Delete failed." }); }
    };

    const handleStatus = async (type, id, newStatus) => {
        try {
            await api.patch(`/admin/${type}/${id}/status`, { status: newStatus }, token);
            fetchData();
        } catch { setToast({ type: "error", message: "Status update failed." }); }
    };

    const logout = () => { localStorage.removeItem("adminToken"); navigate("/admin"); };

    // ─── Filter rows ──────────────────────────────────────────
    const allRows = data[activeTab] || [];
    const filtered = allRows.filter((row) => {
        const matchesStatus = statusFilter === "all" || row.status === statusFilter;
        const name = (row.name || row.full_name || "").toLowerCase();
        const email = (row.email || "").toLowerCase();
        const q = search.toLowerCase();
        const matchesSearch = !q || name.includes(q) || email.includes(q);
        return matchesStatus && matchesSearch;
    });

    const cols = COLUMNS[activeTab] || [];

    return (
        <section className="w-full min-h-screen bg-gray-100 pt-20 px-4 pb-12">
            <Toast data={toast} onClose={() => setToast(null)} />
            <ImageModal src={previewImg} onClose={() => setPreviewImg(null)} />

            <div className="max-w-full mx-auto">
                {/* ── Header ─────────────────────────────── */}
                <div className="flex items-center justify-between mb-6">
                    <h1 className="text-2xl font-bold text-gray-900">Admin Dashboard</h1>
                    <button onClick={logout}
                        className="px-4 py-2 text-sm rounded-full bg-red-500 text-white hover:bg-red-600 transition font-medium">
                        Logout
                    </button>
                </div>

                {/* ── Tabs ───────────────────────────────── */}
                <div className="flex gap-2 mb-4 flex-wrap">
                    {TABS.map((tab) => (
                        <button key={tab.key} onClick={() => { setActiveTab(tab.key); setSearch(""); setStatusFilter("all"); }}
                            className={`px-5 py-2 rounded-full text-sm font-medium transition ${activeTab === tab.key ? "bg-black text-white" : "bg-white text-gray-700 border border-gray-300 hover:bg-gray-50"
                                }`}>
                            {tab.label}
                            <span className={`ml-2 text-xs px-1.5 py-0.5 rounded-full ${activeTab === tab.key ? "bg-white/20" : "bg-gray-200"}`}>
                                {(data[tab.key] || []).length}
                            </span>
                        </button>
                    ))}
                </div>

                {/* ── Search + Filter Bar ─────────────────── */}
                <div className="flex flex-col sm:flex-row gap-3 mb-4">
                    <input
                        type="text" value={search} onChange={(e) => setSearch(e.target.value)}
                        placeholder="Search by name or email…"
                        className="flex-1 px-4 py-2 rounded-xl border border-gray-300 focus:ring-2 focus:ring-black focus:outline-none text-sm"
                    />
                    <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}
                        className="px-4 py-2 rounded-xl border border-gray-300 focus:ring-2 focus:ring-black focus:outline-none text-sm bg-white">
                        <option value="all">All Statuses</option>
                        {STATUSES.map((s) => (
                            <option key={s} value={s}>{s.replace("_", " ").replace(/\b\w/g, (c) => c.toUpperCase())}</option>
                        ))}
                    </select>
                    <button onClick={fetchData}
                        className="px-4 py-2 rounded-xl bg-black text-white text-sm hover:bg-gray-800 transition font-medium">
                        ↻ Refresh
                    </button>
                </div>

                {/* ── Stats Row ─────────────────────────── */}
                <div className="flex gap-4 mb-4 flex-wrap text-sm">
                    <span className="bg-blue-50 text-blue-800 px-3 py-1 rounded-full font-medium">
                        Total: {allRows.length}
                    </span>
                    <span className="bg-gray-50 text-gray-700 px-3 py-1 rounded-full font-medium">
                        Showing: {filtered.length}
                    </span>
                    {statusFilter !== "all" && (
                        <button onClick={() => setStatusFilter("all")}
                            className="text-xs text-gray-500 hover:text-red-500 underline">
                            Clear filter
                        </button>
                    )}
                </div>

                {/* ── Table ─────────────────────────────── */}
                {loading ? (
                    <div className="flex items-center justify-center py-20">
                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-black"></div>
                    </div>
                ) : filtered.length === 0 ? (
                    <div className="bg-white rounded-2xl p-12 text-center text-gray-400 shadow border border-gray-200">
                        No entries found.
                    </div>
                ) : (
                    <div className="overflow-x-auto bg-white rounded-2xl shadow border border-gray-200">
                        <table className="w-full text-sm text-left">
                            <thead className="bg-gray-50 text-gray-500 text-xs uppercase sticky top-0">
                                <tr>
                                    <th className="px-3 py-3 font-semibold">ID</th>
                                    {cols.map((c) => (
                                        <th key={c.key} className="px-3 py-3 font-semibold">{c.label}</th>
                                    ))}
                                    <th className="px-3 py-3 font-semibold">Status</th>
                                    <th className="px-3 py-3 font-semibold">Date</th>
                                    <th className="px-3 py-3 font-semibold">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100">
                                {filtered.map((row) => (
                                    <tr key={row.id} className="hover:bg-gray-50 transition">
                                        <td className="px-3 py-2 font-mono text-xs text-gray-400">#{row.id}</td>

                                        {cols.map((col) => (
                                            <Cell key={col.key} col={col} value={row[col.key]} onImageClick={setPreviewImg} />
                                        ))}

                                        {/* Status badge */}
                                        <td className="px-3 py-2">
                                            <span className={`px-2 py-1 rounded-full text-xs font-semibold ${STATUS_COLORS[row.status] || "bg-gray-100 text-gray-600"}`}>
                                                {row.status}
                                            </span>
                                        </td>

                                        {/* Date */}
                                        <td className="px-3 py-2 text-xs text-gray-400 whitespace-nowrap">
                                            {new Date(row.created_at).toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" })}
                                        </td>

                                        {/* Actions */}
                                        <td className="px-3 py-2">
                                            <div className="flex items-center gap-1.5 flex-wrap">
                                                {/* Approve */}
                                                <button onClick={() => handleStatus(activeTab, row.id, "resolved")}
                                                    title="Approve / Resolve"
                                                    className="px-2.5 py-1 rounded-lg bg-green-100 text-green-700 hover:bg-green-200 text-xs font-semibold transition">
                                                    ✓ Approve
                                                </button>
                                                {/* Reject */}
                                                <button onClick={() => handleStatus(activeTab, row.id, "closed")}
                                                    title="Reject / Close"
                                                    className="px-2.5 py-1 rounded-lg bg-red-100 text-red-700 hover:bg-red-200 text-xs font-semibold transition">
                                                    ✗ Reject
                                                </button>
                                                {/* Status dropdown */}
                                                <select value={row.status}
                                                    onChange={(e) => handleStatus(activeTab, row.id, e.target.value)}
                                                    className="text-xs border border-gray-200 rounded-lg px-2 py-1 bg-white focus:outline-none focus:ring-1 focus:ring-gray-400">
                                                    {STATUSES.map((s) => (
                                                        <option key={s} value={s}>{s.replace("_", " ")}</option>
                                                    ))}
                                                </select>
                                                {/* Delete */}
                                                <button onClick={() => handleDelete(activeTab, row.id)}
                                                    title="Delete"
                                                    className="px-2.5 py-1 rounded-lg bg-gray-100 text-gray-500 hover:bg-red-100 hover:text-red-600 text-xs font-semibold transition">
                                                    🗑
                                                </button>
                                            </div>
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
