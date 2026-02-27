import { useState, useEffect, useCallback, useRef } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";
import contentApi from "../services/contentApi";
import useSocket from "../hooks/useSocket";
import Toast from "../components/Toast";

const TABS = [
    { key: "contacts", label: "Contacts" },
    { key: "help_requests", label: "Help Requests" },
    { key: "applicants", label: "Applicants" },
    { key: "donations", label: "Donations" },
    { key: "content", label: "Content Management" },
    { key: "admins", label: "Admin Management" },
];

const STATUSES = ["new", "reviewed", "in_progress", "resolved", "closed"];

const STATUS_COLORS = {
    new: "bg-blue-100 text-blue-800",
    reviewed: "bg-yellow-100 text-yellow-800",
    in_progress: "bg-purple-100 text-purple-800",
    resolved: "bg-green-100 text-green-800",
    closed: "bg-gray-200 text-gray-700",
};

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
        { key: "phone", label: "Phone" },
        { key: "email", label: "Email" },
        { key: "emergency", label: "Emergency" },
        { key: "help_types", label: "Help Types", truncate: true },
        { key: "state", label: "State" },
        { key: "district", label: "District" },
    ],
    applicants: [
        { key: "member_id", label: "Member ID" },
        { key: "full_name", label: "Name" },
        { key: "phone", label: "Phone" },
        { key: "email", label: "Email" },
        { key: "state", label: "State" },
        { key: "district", label: "District" },
        { key: "city", label: "City" },
    ],
    donations: [
        { key: "full_name", label: "Name" },
        { key: "mobile", label: "Mobile" },
        { key: "email", label: "Email" },
        { key: "amount", label: "Amount", isAmount: true },
    ],
};

const FILE_BASE = import.meta.env.VITE_SOCKET_URL || "http://localhost:5000";

const PAGES = [
    { key: "home", label: "Home Page" },
    { key: "about", label: "About Page" },
    { key: "contact", label: "Contact Page" },
    { key: "faq", label: "FAQ Page" },
    { key: "footer", label: "Footer" },
];

function ImageModal({ src, onClose }) {
    if (!src) return null;
    return (
        <div className="fixed inset-0 z-50 bg-black/70 flex items-center justify-center p-4" onClick={onClose}>
            <div className="relative max-w-3xl w-full" onClick={(e) => e.stopPropagation()}>
                <img src={src} alt="Preview" className="w-full rounded-2xl shadow-2xl object-contain max-h-[80vh]" />
                <button onClick={onClose} className="absolute -top-3 -right-3 bg-white text-gray-800 rounded-full w-8 h-8 flex items-center justify-center shadow-lg font-bold hover:bg-red-500 hover:text-white transition">×</button>
            </div>
        </div>
    );
}

function Cell({ col, value, onImageClick }) {
    if (col.isImage && value) {
        return (
            <td className="px-3 py-2">
                <img src={`${FILE_BASE}${value}`} alt="photo" className="w-10 h-10 rounded-lg object-cover cursor-pointer hover:opacity-80 transition border border-gray-200" onClick={() => onImageClick(`${FILE_BASE}${value}`)} />
            </td>
        );
    }
    if (col.isFile && value) {
        const isImg = /\.(jpg|jpeg|png|gif|webp)$/i.test(value);
        return (
            <td className="px-3 py-2">
                <div className="flex items-center gap-2">
                    {isImg && <img src={`${FILE_BASE}${value}`} alt="attach" className="w-8 h-8 rounded object-cover cursor-pointer hover:opacity-80" onClick={() => onImageClick(`${FILE_BASE}${value}`)} />}
                    <a href={`${FILE_BASE}${value}`} target="_blank" rel="noreferrer" className="text-xs text-blue-600 hover:underline font-medium">{isImg ? "View" : "Download"}</a>
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

// Content Management Component
function ContentManagement({ token, onToast }) {
    const [selectedPage, setSelectedPage] = useState("home");
    const [content, setContent] = useState({});
    const [loading, setLoading] = useState(true);
    const [editingItem, setEditingItem] = useState(null);
    const [editValue, setEditValue] = useState("");

    const fetchContent = useCallback(async () => {
        setLoading(true);
        try {
            const res = await contentApi.getPageContent(selectedPage, token);
            if (res.success) {
                setContent(res.data || {});
            }
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    }, [selectedPage, token]);

    useEffect(() => {
        fetchContent();
    }, [fetchContent]);

    const handleEdit = (section, key, value) => {
        setEditingItem({ section, key });
        setEditValue(value || "");
    };

    const handleSave = async () => {
        if (!editingItem) return;
        try {
            const res = await contentApi.updateContentByKey(selectedPage, editingItem.section, editingItem.key, editValue, token);
            if (res.success) {
                onToast({ type: "success", message: "Content updated successfully!" });
                fetchContent();
            } else {
                onToast({ type: "error", message: res.message || "Failed to update" });
            }
        } catch (err) {
            onToast({ type: "error", message: "Error updating content" });
        }
        setEditingItem(null);
    };

    const flattenContent = () => {
        const flat = [];
        Object.entries(content).forEach(([section, items]) => {
            Object.entries(items).forEach(([key, data]) => {
                flat.push({ section, key, ...data });
            });
        });
        return flat;
    };

    return (
        <div className="space-y-4">
            <div className="flex gap-2 flex-wrap">
                {PAGES.map((page) => (
                    <button key={page.key} onClick={() => setSelectedPage(page.key)}
                        className={`px-4 py-2 rounded-full text-sm font-medium transition ${selectedPage === page.key ? "bg-black text-white" : "bg-white border border-gray-300"}`}>
                        {page.label}
                    </button>
                ))}
            </div>

            {loading ? (
                <div className="flex justify-center py-10"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-black" /></div>
            ) : (
                <div className="bg-white rounded-2xl shadow border border-gray-200 overflow-hidden">
                    <table className="w-full text-sm">
                        <thead className="bg-gray-50 text-gray-500 text-xs uppercase">
                            <tr>
                                <th className="px-4 py-3">Section</th>
                                <th className="px-4 py-3">Key</th>
                                <th className="px-4 py-3">Value</th>
                                <th className="px-4 py-3">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                            {flattenContent().map((item, idx) => (
                                <tr key={idx} className="hover:bg-gray-50">
                                    <td className="px-4 py-3 font-medium">{item.section}</td>
                                    <td className="px-4 py-3 text-gray-500">{item.key}</td>
                                    <td className="px-4 py-3 max-w-xs truncate">{item.value || "—"}</td>
                                    <td className="px-4 py-3">
                                        <button onClick={() => handleEdit(item.section, item.key, item.value)}
                                            className="px-3 py-1 bg-blue-100 text-blue-700 rounded-lg text-xs hover:bg-blue-200">
                                            Edit
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}

            {editingItem && (
                <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4">
                    <div className="bg-white rounded-2xl p-6 max-w-lg w-full">
                        <h3 className="text-lg font-semibold mb-4">Edit Content</h3>
                        <p className="text-sm text-gray-500 mb-2">{editingItem.section} - {editingItem.key}</p>
                        <textarea value={editValue} onChange={(e) => setEditValue(e.target.value)}
                            className="w-full px-4 py-2 border rounded-xl focus:ring-2 focus:ring-black focus:outline-none" rows={4} />
                        <div className="flex gap-2 mt-4">
                            <button onClick={handleSave} className="flex-1 py-2 bg-black text-white rounded-xl hover:bg-gray-800">Save</button>
                            <button onClick={() => setEditingItem(null)} className="px-4 py-2 border rounded-xl hover:bg-gray-50">Cancel</button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

// Admin Management Component
function AdminManagement({ token, onToast }) {
    const [admins, setAdmins] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [formData, setFormData] = useState({ email: "", password: "", name: "", role: "manager" });

    const fetchAdmins = useCallback(async () => {
        setLoading(true);
        try {
            const res = await api.get("/admin/admins", token);
            if (res.success) {
                setAdmins(res.data || []);
            }
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    }, [token]);

    useEffect(() => {
        fetchAdmins();
    }, [fetchAdmins]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const res = await api.post("/admin/admins", formData, token);
            if (res.success) {
                onToast({ type: "success", message: "Admin created successfully! Credentials sent to email." });
                setShowModal(false);
                setFormData({ email: "", password: "", name: "", role: "manager" });
                fetchAdmins();
            } else {
                onToast({ type: "error", message: res.message || "Failed to create admin" });
            }
        } catch (err) {
            onToast({ type: "error", message: "Error creating admin" });
        }
    };

    const handleDelete = async (id) => {
        if (!confirm("Delete this admin?")) return;
        try {
            const res = await api.del(`/admin/admins/${id}`, token);
            if (res.success) {
                onToast({ type: "success", message: "Admin deleted" });
                fetchAdmins();
            }
        } catch (err) {
            onToast({ type: "error", message: "Error deleting admin" });
        }
    };

    const roleColors = { super_admin: "bg-purple-100 text-purple-700", manager: "bg-blue-100 text-blue-700", viewer: "bg-gray-100 text-gray-700" };

    return (
        <div className="space-y-4">
            <div className="flex justify-between items-center">
                <h3 className="text-lg font-semibold">Manage Admins</h3>
                <button onClick={() => setShowModal(true)} className="px-4 py-2 bg-black text-white rounded-full text-sm hover:bg-gray-800">
                    + Add Admin
                </button>
            </div>

            {loading ? (
                <div className="flex justify-center py-10"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-black" /></div>
            ) : (
                <div className="bg-white rounded-2xl shadow border border-gray-200 overflow-hidden">
                    <table className="w-full text-sm">
                        <thead className="bg-gray-50 text-gray-500 text-xs uppercase">
                            <tr>
                                <th className="px-4 py-3">Email</th>
                                <th className="px-4 py-3">Name</th>
                                <th className="px-4 py-3">Role</th>
                                <th className="px-4 py-3">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                            {admins.map((admin) => (
                                <tr key={admin.id} className="hover:bg-gray-50">
                                    <td className="px-4 py-3">{admin.email}</td>
                                    <td className="px-4 py-3">{admin.name || "—"}</td>
                                    <td className="px-4 py-3">
                                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${roleColors[admin.role] || "bg-gray-100"}`}>
                                            {admin.role}
                                        </span>
                                    </td>
                                    <td className="px-4 py-3">
                                        <button onClick={() => handleDelete(admin.id)} className="px-3 py-1 bg-red-100 text-red-700 rounded-lg text-xs hover:bg-red-200">
                                            Delete
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}

            {showModal && (
                <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4">
                    <div className="bg-white rounded-2xl p-6 max-w-md w-full">
                        <h3 className="text-lg font-semibold mb-4">Add New Admin</h3>
                        <form onSubmit={handleSubmit} className="space-y-4">
                            <input type="text" placeholder="Name" value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                className="w-full px-4 py-2 border rounded-xl focus:ring-2 focus:ring-black focus:outline-none" />
                            <input type="email" placeholder="Email" value={formData.email} onChange={(e) => setFormData({ ...formData, email: e.target.value })} required
                                className="w-full px-4 py-2 border rounded-xl focus:ring-2 focus:ring-black focus:outline-none" />
                            <input type="password" placeholder="Password" value={formData.password} onChange={(e) => setFormData({ ...formData, password: e.target.value })} required
                                className="w-full px-4 py-2 border rounded-xl focus:ring-2 focus:ring-black focus:outline-none" />
                            <select value={formData.role} onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                                className="w-full px-4 py-2 border rounded-xl focus:ring-2 focus:ring-black focus:outline-none">
                                <option value="manager">Manager</option>
                                <option value="viewer">Viewer</option>
                            </select>
                            <div className="flex gap-2">
                                <button type="submit" className="flex-1 py-2 bg-black text-white rounded-xl hover:bg-gray-800">Create Admin</button>
                                <button type="button" onClick={() => setShowModal(false)} className="px-4 py-2 border rounded-xl hover:bg-gray-50">Cancel</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}

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

    useEffect(() => {
        if (!token) navigate("/admin");
    }, [token, navigate]);

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

    const fetchDataRef = useRef(fetchData);
    useEffect(() => { fetchDataRef.current = fetchData; }, [fetchData]);

    useEffect(() => { fetchData(); }, [fetchData]);

    useSocket("new_contact", useCallback((e) => {
        setToast({ type: "info", message: `New contact from ${e.name}` });
        fetchDataRef.current();
    }, []));

    useSocket("new_help_request", useCallback((e) => {
        setToast({ type: "info", message: `Help request from ${e.full_name}` });
        fetchDataRef.current();
    }, []));

    useSocket("new_applicant", useCallback((e) => {
        setToast({ type: "info", message: `Application from ${e.full_name}` });
        fetchDataRef.current();
    }, []));

    useSocket("new_donation", useCallback((e) => {
        setToast({ type: "info", message: `Donation ₹${e.amount} received` });
        fetchDataRef.current();
    }, []));

    const handleDelete = useCallback(async (type, id) => {
        if (!confirm("Delete this entry permanently?")) return;
        try {
            await api.del(`/admin/${type}/${id}`, token);
            setToast({ type: "success", message: `Deleted #${id}` });
            fetchDataRef.current();
        } catch {
            setToast({ type: "error", message: "Delete failed." });
        }
    }, [token]);

    const handleStatus = useCallback(async (type, id, newStatus) => {
        try {
            await api.patch(`/admin/${type}/${id}/status`, { status: newStatus }, token);
            setData((prev) => ({
                ...prev,
                [type]: (prev[type] || []).map((row) => row.id === id ? { ...row, status: newStatus } : row),
            }));
        } catch {
            setToast({ type: "error", message: "Status update failed." });
        }
    }, [token]);

    const logout = useCallback(() => {
        localStorage.removeItem("adminToken");
        navigate("/admin");
    }, [navigate]);

    const handleTabChange = useCallback((key) => {
        setActiveTab(key);
        setSearch("");
        setStatusFilter("all");
    }, []);

    const allRows = data[activeTab] || [];
    const filtered = activeTab !== "content" && activeTab !== "admins" ? allRows.filter((row) => {
        const matchStatus = statusFilter === "all" || row.status === statusFilter;
        const name = (row.name || row.full_name || "").toLowerCase();
        const email = (row.email || "").toLowerCase();
        const q = search.toLowerCase().trim();
        const matchSearch = !q || name.includes(q) || email.includes(q);
        return matchStatus && matchSearch;
    }) : allRows;

    const cols = COLUMNS[activeTab] || [];

    return (
        <section className="w-full min-h-screen bg-gray-100 pt-20 px-4 pb-12">
            <Toast data={toast} onClose={() => setToast(null)} />
            <ImageModal src={previewImg} onClose={() => setPreviewImg(null)} />

            <div className="max-w-full mx-auto">
                <div className="flex items-center justify-between mb-6">
                    <h1 className="text-2xl font-bold text-gray-900">Admin Dashboard</h1>
                    <button onClick={logout} className="px-4 py-2 text-sm rounded-full bg-red-500 text-white hover:bg-red-600 transition font-medium">
                        Logout
                    </button>
                </div>

                <div className="flex gap-2 mb-4 flex-wrap">
                    {TABS.map((tab) => (
                        <button key={tab.key} onClick={() => handleTabChange(tab.key)}
                            className={`px-5 py-2 rounded-full text-sm font-medium transition ${activeTab === tab.key ? "bg-black text-white" : "bg-white text-gray-700 border border-gray-300 hover:bg-gray-50"}`}>
                            {tab.label}
                            {tab.key !== "content" && tab.key !== "admins" && (
                                <span className={`ml-2 text-xs px-1.5 py-0.5 rounded-full ${activeTab === tab.key ? "bg-white/20" : "bg-gray-200"}`}>
                                    {(data[tab.key] || []).length}
                                </span>
                            )}
                        </button>
                    ))}
                </div>

                {activeTab === "content" ? (
                    <ContentManagement token={token} onToast={setToast} />
                ) : activeTab === "admins" ? (
                    <AdminManagement token={token} onToast={setToast} />
                ) : (
                    <>
                        <div className="flex flex-col sm:flex-row gap-3 mb-4">
                            <input type="text" value={search} onChange={(e) => setSearch(e.target.value)}
                                placeholder="Search by name or email…" className="flex-1 px-4 py-2 rounded-xl border border-gray-300 focus:ring-2 focus:ring-black focus:outline-none text-sm" />
                            <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}
                                className="px-4 py-2 rounded-xl border border-gray-300 focus:outline-none text-sm bg-white">
                                <option value="all">All Statuses</option>
                                {STATUSES.map((s) => (<option key={s} value={s}>{s.replace("_", " ").replace(/\b\w/g, (c) => c.toUpperCase())}</option>))}
                            </select>
                            <button onClick={fetchData} className="px-4 py-2 rounded-xl bg-black text-white text-sm hover:bg-gray-800 transition font-medium">↻ Refresh</button>
                        </div>

                        <div className="flex gap-3 mb-4 text-sm flex-wrap">
                            <span className="bg-blue-50 text-blue-800 px-3 py-1 rounded-full font-medium">Total: {allRows.length}</span>
                            <span className="bg-gray-50 text-gray-700 px-3 py-1 rounded-full font-medium">Showing: {filtered.length}</span>
                            {(search || statusFilter !== "all") && (
                                <button onClick={() => { setSearch(""); setStatusFilter("all"); }} className="text-xs text-gray-500 hover:text-red-500 underline">Clear filters</button>
                            )}
                        </div>

                        {loading ? (
                            <div className="flex items-center justify-center py-20"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-black" /></div>
                        ) : filtered.length === 0 ? (
                            <div className="bg-white rounded-2xl p-12 text-center text-gray-400 shadow border border-gray-200">No entries found.</div>
                        ) : (
                            <div className="overflow-x-auto bg-white rounded-2xl shadow border border-gray-200">
                                <table className="w-full text-sm text-left">
                                    <thead className="bg-gray-50 text-gray-500 text-xs uppercase">
                                        <tr>
                                            <th className="px-3 py-3 font-semibold">ID</th>
                                            {cols.map((c) => (<th key={c.key} className="px-3 py-3 font-semibold">{c.label}</th>))}
                                            <th className="px-3 py-3 font-semibold">Status</th>
                                            <th className="px-3 py-3 font-semibold">Date</th>
                                            <th className="px-3 py-3 font-semibold">Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-gray-100">
                                        {filtered.map((row) => (
                                            <tr key={row.id} className="hover:bg-gray-50 transition">
                                                <td className="px-3 py-2 font-mono text-xs text-gray-400">#{row.id}</td>
                                                {cols.map((col) => (<Cell key={col.key} col={col} value={row[col.key]} onImageClick={setPreviewImg} />))}
                                                <td className="px-3 py-2">
                                                    <span className={`px-2 py-1 rounded-full text-xs font-semibold ${STATUS_COLORS[row.status] || "bg-gray-100 text-gray-600"}`}>{row.status}</span>
                                                </td>
                                                <td className="px-3 py-2 text-xs text-gray-400 whitespace-nowrap">
                                                    {new Date(row.created_at || row.createdAt).toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" })}
                                                </td>
                                                <td className="px-3 py-2">
                                                    <div className="flex items-center gap-1.5 flex-wrap">
                                                        <button onClick={() => handleStatus(activeTab, row.id, "resolved")} title="Approve" className="px-2.5 py-1 rounded-lg bg-green-100 text-green-700 hover:bg-green-200 text-xs font-semibold transition">✓</button>
                                                        <button onClick={() => handleStatus(activeTab, row.id, "closed")} title="Reject" className="px-2.5 py-1 rounded-lg bg-red-100 text-red-700 hover:bg-red-200 text-xs font-semibold transition">✗</button>
                                                        <select value={row.status} onChange={(e) => handleStatus(activeTab, row.id, e.target.value)} className="text-xs border border-gray-200 rounded-lg px-2 py-1 bg-white focus:outline-none">
                                                            {STATUSES.map((s) => (<option key={s} value={s}>{s.replace("_", " ")}</option>))}
                                                        </select>
                                                        <button onClick={() => handleDelete(activeTab, row.id)} title="Delete" className="px-2.5 py-1 rounded-lg bg-gray-100 text-gray-500 hover:bg-red-100 hover:text-red-600 text-xs font-semibold transition">🗑</button>
                                                    </div>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        )}
                    </>
                )}
            </div>
        </section>
    );
}
