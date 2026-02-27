import { useState } from "react";
import { useNavigate } from "react-router-dom";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

export default function AdminLogin() {
    const navigate = useNavigate();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError("");

        try {
            const res = await fetch(`${API_URL}/admin/login`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email, password }),
            });

            const data = await res.json();

            if (data.success) {
                localStorage.setItem("adminToken", data.token);
                navigate("/admin/dashboard");
            } else {
                setError(data.message || "Login failed.");
            }
        } catch {
            setError("Server unreachable.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <section className="w-full min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-900 to-gray-800 px-4">
            <div className="max-w-md w-full bg-white/10 backdrop-blur-xl p-8 rounded-2xl shadow-2xl border border-white/20">
                <h2 className="text-3xl font-bold text-white text-center mb-8">Admin Login</h2>

                {error && (
                    <div className="mb-4 p-3 rounded-xl bg-red-500/20 text-red-300 text-sm font-medium">
                        ❌ {error}
                    </div>
                )}

                <form className="space-y-5" onSubmit={handleSubmit}>
                    <div>
                        <label className="block text-gray-300 mb-1 text-sm">Email</label>
                        <input
                            type="email" value={email} onChange={(e) => setEmail(e.target.value)}
                            required placeholder="admin@sru.org"
                            className="w-full px-4 py-3 rounded-xl bg-white/10 border border-white/30 text-white placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                        />
                    </div>
                    <div>
                        <label className="block text-gray-300 mb-1 text-sm">Password</label>
                        <input
                            type="password" value={password} onChange={(e) => setPassword(e.target.value)}
                            required placeholder="••••••••"
                            className="w-full px-4 py-3 rounded-xl bg-white/10 border border-white/30 text-white placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                        />
                    </div>
                    <button
                        type="submit" disabled={loading}
                        className="w-full py-3 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-semibold transition disabled:opacity-60"
                    >
                        {loading ? "Logging in…" : "Login"}
                    </button>
                </form>
            </div>
        </section>
    );
}
