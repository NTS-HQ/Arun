import { useState, useEffect, useCallback } from "react";
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

const FILE_BASE = import.meta.env.VITE_SOCKET_URL || "http://localhost:5000";

const PAGES = [
    { key: "home", label: "Home Page" },
    { key: "about", label: "About Page" },
    { key: "contact", label: "Contact Page" },
    { key: "faq", label: "FAQ Page" },
    { key: "footer", label: "Footer" },
];

// Content Management with Image Upload
function ContentManagement({ token, onToast }) {
    const [selectedPage, setSelectedPage] = useState("home");
    const [content, setContent] = useState({});
    const [loading, setLoading] = useState(true);
    const [editingItem, setEditingItem] = useState(null);
    const [editValue, setEditValue] = useState("");
    const [uploading, setUploading] = useState(false);

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

    const handleEdit = (section, key, value, type) => {
        setEditingItem({ section, key, type });
        setEditValue(value || "");
    };

    const handleSave = async () => {
        if (!editingItem) return;
        try {
            const res = await contentApi.updateContentByKey(
                selectedPage, 
                editingItem.section, 
                editingItem.key, 
                editValue, 
                token
            );
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

    const handleImageUpload = async (section, key, file) => {
        if (!file) return;
        setUploading(true);
        try {
            const res = await contentApi.uploadImage(file, token);
            if (res.success) {
                // Update content with image URL
                await contentApi.updateContentByKey(selectedPage, section, key, res.url, token);
                onToast({ type: "success", message: "Image uploaded successfully!" });
                fetchContent();
            } else {
                onToast({ type: "error", message: "Upload failed" });
            }
        } catch (err) {
            onToast({ type: "error", message: "Error uploading image" });
        }
        setUploading(false);
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

    const items = flattenContent();

    return (
        <div className="space-y-6">
            <div className="flex gap-2 flex-wrap">
                {PAGES.map((page) => (
                    <button key={page.key} onClick={() => setSelectedPage(page.key)}
                        className={`px-4 py-2 rounded-full text-sm font-medium transition ${selectedPage === page.key ? "bg-black text-white" : "bg-white border border-gray-300"}`}>
                        {page.label}
                    </button>
                ))}
            </div>

            {/* Add New Content Button */}
            <div className="flex gap-2">
                <button onClick={() => {
                    const key = prompt("Enter key name (e.g., hero_image):");
                    if (key) {
                        const section = prompt("Enter section (e.g., hero):");
                        if (section) {
                            handleEdit(section, key, "", "text");
                        }
                    }
                }} className="px-4 py-2 bg-green-600 text-white rounded-full text-sm hover:bg-green-700">
                    + Add New Field
                </button>
            </div>

            {loading ? (
                <div className="flex justify-center py-10"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-black" /></div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {items.map((item, idx) => (
                        <div key={idx} className="bg-white rounded-xl shadow border border-gray-200 p-4">
                            <div className="flex justify-between items-start mb-2">
                                <span className="text-xs font-medium text-gray-500">{item.section}</span>
                                <span className="text-xs px-2 py-0.5 bg-gray-100 rounded">{item.type}</span>
                            </div>
                            <h4 className="font-semibold text-gray-900 mb-2">{item.key}</h4>
                            
                            {item.type === 'image' || item.key.includes('image') || item.key.includes('img') || item.key.includes('photo') || item.key.includes('banner') || item.key.includes('hero') ? (
                                <div className="space-y-2">
                                    {item.value ? (
                                        <img src={`${FILE_BASE}${item.value}`} alt={item.key} className="w-full h-32 object-cover rounded-lg" />
                                    ) : (
                                        <div className="w-full h-32 bg-gray-100 rounded-lg flex items-center justify-center text-gray-400">No image</div>
                                    )}
                                    <input 
                                        type="file" 
                                        accept="image/*"
                                        onChange={(e) => handleImageUpload(item.section, item.key, e.target.files[0])}
                                        className="text-xs w-full"
                                        disabled={uploading}
                                    />
                                </div>
                            ) : item.type === 'video' || item.key.includes('video') ? (
                                <div className="space-y-2">
                                    {item.value ? (
                                        <video src={`${FILE_BASE}${item.value}`} className="w-full h-32 object-cover rounded-lg" controls />
                                    ) : (
                                        <div className="w-full h-32 bg-gray-100 rounded-lg flex items-center justify-center text-gray-400">No video</div>
                                    )}
                                    <input 
                                        type="file" 
                                        accept="video/*"
                                        onChange={(e) => handleImageUpload(item.section, item.key, e.target.files[0])}
                                        className="text-xs w-full"
                                        disabled={uploading}
                                    />
                                </div>
                            ) : (
                                <p className="text-sm text-gray-600 truncate">{item.value || "—"}</p>
                            )}
                            
                            <button onClick={() => handleEdit(item.section, item.key, item.value, item.type)}
                                className="mt-2 w-full py-2 bg-blue-100 text-blue-700 rounded-lg text-sm hover:bg-blue-200">
                                {item.type === 'image' || item.key.includes('image') ? 'Change Image' : 
                                 item.type === 'video' ? 'Change Video' : 'Edit'}
                            </button>
                        </div>
                    ))}
                </div>
            )}

            {editingItem && (
                <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4">
                    <div className="bg-white rounded-2xl p-6 max-w-lg w-full">
                        <h3 className="text-lg font-semibold mb-4">Edit Content</h3>
                        <p className="text-sm text-gray-500 mb-2">{editingItem.section} - {editingItem.key}</p>
                        <p className="text-xs text-gray-400 mb-4">Type: {editingItem.type}</p>
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

    useEffect(() => { fetchData(); }, [fetchData]);

    useSocket("new_contact", useCallback(() => { fetchData(); }, [fetchData]));
    useSocket("new_help_request", useCallback(() => { fetchData(); }, [fetchData]));
    useSocket("new_applicant", useCallback(() => { fetchData(); }, [fetchData]));
    useSocket("new_donation", useCallback(() => { fetchData(); }, [fetchData]));

    const handleDelete = useCallback(async (type, id) => {
        if (!confirm("Delete this entry permanently?")) return;
        try {
            await api.del(`/admin/${type}/${id}`, token);
            setToast({ type: "success", message: `Deleted #${id}` });
            fetchData();
        } catch {
            setToast({ type: "error", message: "Delete failed." });
        }
    }, [token, fetchData]);

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
        const name = (row.name || row.fullName || row.full_name || "").toLowerCase();
        const email = (row.email || "").toLowerCase();
        const q = search.toLowerCase().trim();
        const matchSearch = !q || name.includes(q) || email.includes(q);
        return matchStatus && matchSearch;
    }) : allRows;

    const columns = {
        contacts: [
            { key: "name", label: "Name" },
            { key: "email", label: "Email" },
            { key: "phone", label: "Phone" },
            { key: "message", label: "Message", truncate: true },
            { key: "attachmentUrl", label: "File", isFile: true },
            { key: "termsAccepted", label: "Terms", isBool: true },
        ],
        help_requests: [
            { key: "fullName", label: "Name" },
            { key: "phone", label: "Phone" },
            { key: "email", label: "Email" },
            { key: "emergency", label: "Emergency" },
            { key: "helpTypes", label: "Help Types" },
            { key: "state", label: "State" },
            { key: "district", label: "District" },
        ],
        applicants: [
            { key: "memberId", label: "Member ID" },
            { key: "fullName", label: "Name" },
            { key: "phone", label: "Phone" },
            { key: "email", label: "Email" },
            { key: "state", label: "State" },
            { key: "district", label: "District" },
            { key: "photoUrl", label: "Photo", isImage: true },
        ],
        donations: [
            { key: "fullName", label: "Name" },
            { key: "mobile", label: "Mobile" },
            { key: "email", label: "Email" },
            { key: "amount", label: "Amount", isAmount: true },
        ],
    };

    const cols = columns[activeTab] || [];

    return (
        <section className="w-full min-h-screen bg-gray-100 pt-20 px-4 pb-12">
            <Toast data={toast} onClose={() => setToast(null)} />
            {previewImg && (
                <div className="fixed inset-0 z-50 bg-black/70 flex items-center justify-center p-4" onClick={() => setPreviewImg(null)}>
                    <div className="relative max-w-3xl w-full" onClick={(e) => e.stopPropagation()}>
                        <img src={previewImg} alt="Preview" className="w-full rounded-2xl shadow-2xl object-contain max-h-[80vh]" />
                        <button onClick={() => setPreviewImg(null)} className="absolute -top-3 -right-3 bg-white text-gray-800 rounded-full w-8 h-8 flex items-center justify-center shadow-lg font-bold hover:bg-red-500 hover:text-white">×</button>
                    </div>
                </div>
            )}

            <div className="max-w-full mx-auto">
                <div className="flex items-center justify-between mb-6">
                    <h1 className="text-2xl font-bold text-gray-900">Admin Dashboard</h1>
                    <button onClick={logout} className="px-4 py-2 text-sm rounded-full bg-red-500 text-white hover:bg-red-600">Logout</button>
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
                            <button onClick={fetchData} className="px-4 py-2 rounded-xl bg-black text-white text-sm hover:bg-gray-800">↻ Refresh</button>
                        </div>

                        <div className="flex gap-3 mb-4 text-sm flex-wrap">
                            <span className="bg-blue-50 text-blue-800 px-3 py-1 rounded-full font-medium">Total: {allRows.length}</span>
                            <span className="bg-gray-50 text-gray-700 px-3 py-1 rounded-full font-medium">Showing: {filtered.length}</span>
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
                                            <tr key={row.id} className="hover:bg-gray-50">
                                                <td className="px-3 py-2 font-mono text-xs text-gray-400">#{row.id}</td>
                                                {cols.map((col) => {
                                                    const value = row[col.key];
                                                    if (col.isImage && value) {
                                                        return <td key={col.key} className="px-3 py-2"><img src={`${FILE_BASE}${value}`} alt="" className="w-10 h-10 rounded-lg object-cover cursor-pointer" onClick={() => setPreviewImg(`${FILE_BASE}${value}`)} /></td>;
                                                    }
                                                    if (col.isFile && value) {
                                                        const isImg = /\.(jpg|jpeg|png|gif|webp)$/i.test(value);
                                                        return <td key={col.key} className="px-3 py-2"><a href={`${FILE_BASE}${value}`} target="_blank" rel="noreferrer" className="text-blue-600 hover:underline">{isImg ? "View" : "Download"}</a></td>;
                                                    }
                                                    if (col.isBool) {
                                                        return <td key={col.key} className="px-3 py-2"><span className={`px-2 py-0.5 rounded-full text-xs font-semibold ${value ? "bg-green-100 text-green-700" : "bg-red-100 text-red-600"}`}>{value ? "✓ Yes" : "✗ No"}</span></td>;
                                                    }
                                                    if (col.isAmount) {
                                                        return <td key={col.key} className="px-3 py-2 font-semibold text-green-700">₹{value}</td>;
                                                    }
                                                    return <td key={col.key} className={`px-3 py-2 text-gray-700 ${col.truncate ? "max-w-[150px] truncate" : ""}`}>{value || <span className="text-gray-400">—</span>}</td>;
                                                })}
                                                <td className="px-3 py-2"><span className={`px-2 py-1 rounded-full text-xs font-semibold ${STATUS_COLORS[row.status] || "bg-gray-100 text-gray-600"}`}>{row.status}</span></td>
                                                <td className="px-3 py-2 text-xs text-gray-400">{new Date(row.createdAt).toLocaleDateString("en-IN")}</td>
                                                <td className="px-3 py-2">
                                                    <div className="flex items-center gap-1">
                                                        <button onClick={() => handleStatus(activeTab, row.id, "resolved")} className="px-2 py-1 rounded-lg bg-green-100 text-green-700 hover:bg-green-200 text-xs">✓</button>
                                                        <button onClick={() => handleStatus(activeTab, row.id, "closed")} className="px-2 py-1 rounded-lg bg-red-100 text-red-700 hover:bg-red-200 text-xs">✗</button>
                                                        <select value={row.status} onChange={(e) => handleStatus(activeTab, row.id, e.target.value)} className="text-xs border rounded px-1">
                                                            {STATUSES.map((s) => (<option key={s} value={s}>{s}</option>))}
                                                        </select>
                                                        <button onClick={() => handleDelete(activeTab, row.id)} className="px-2 py-1 rounded-lg bg-gray-100 text-gray-500 hover:bg-red-100 hover:text-red-600 text-xs">🗑</button>
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
