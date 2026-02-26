/**
 * ============================================================
 *  Toast Notification Component
 * ============================================================
 *  Lightweight, animated toast system.
 *
 *  Usage:
 *    import Toast from "../components/Toast";
 *
 *    const [toast, setToast] = useState(null);
 *    setToast({ type: "success", message: "Submitted!" });
 *    setToast({ type: "error",   message: "Failed!" });
 *    setToast({ type: "info",    message: "New data!" });
 *
 *    <Toast data={toast} onClose={() => setToast(null)} />
 * ============================================================
 */

import { useEffect } from "react";

const ICONS = {
    success: "✅",
    error: "❌",
    info: "ℹ️",
};

const COLORS = {
    success: "bg-green-500",
    error: "bg-red-500",
    info: "bg-blue-500",
};

export default function Toast({ data, onClose, duration = 4000 }) {
    // Auto-dismiss after duration
    useEffect(() => {
        if (!data) return;
        const timer = setTimeout(onClose, duration);
        return () => clearTimeout(timer);
    }, [data, onClose, duration]);

    if (!data) return null;

    const { type = "info", message } = data;

    return (
        <div className="fixed top-6 right-6 z-[9999] animate-slide-in">
            <div
                className={`${COLORS[type]} text-white px-6 py-4 rounded-xl shadow-2xl flex items-center gap-3 min-w-[300px] max-w-[450px]`}
            >
                <span className="text-xl">{ICONS[type]}</span>
                <p className="text-sm font-medium flex-1">{message}</p>
                <button
                    onClick={onClose}
                    className="text-white/80 hover:text-white text-lg font-bold ml-2"
                >
                    ×
                </button>
            </div>
        </div>
    );
}
