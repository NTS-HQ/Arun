/**
 * ============================================================
 *  useSocket — React Hook for Socket.io Client
 * ============================================================
 *  Connects to the backend Socket.io server and provides a
 *  way to listen for real-time events inside any component.
 *
 *  Key fixes:
 *  - Handler stored in ref so it's always current without
 *    triggering effect re-runs (avoids stale closures)
 *  - Socket listener registered only ONCE per event name
 *  - Stable cleanup on unmount
 * ============================================================
 */

import { useEffect, useRef } from "react";
import { io } from "socket.io-client";

const SOCKET_URL = import.meta.env.VITE_SOCKET_URL || "http://localhost:5000";

// ─── Module-level singleton socket ──────────────────────────
// Only one connection is created for the entire app lifetime.
let socket = null;

const getSocket = () => {
    if (!socket) {
        socket = io(SOCKET_URL, {
            transports: ["websocket", "polling"],
            autoConnect: true,
            reconnection: true,
            reconnectionAttempts: 5,
            reconnectionDelay: 1000,
        });

        socket.on("connect", () => console.log("🔌 Socket connected:", socket.id));
        socket.on("disconnect", (reason) => console.log("🔌 Socket disconnected:", reason));
        socket.on("connect_error", (err) => console.warn("🔌 Socket error:", err.message));
    }
    return socket;
};

/**
 * useSocket(event, handler)
 *
 * Subscribes to a socket event. The handler is stored in a ref
 * so it can freely access the latest component state/props without
 * needing to be listed as an effect dependency — this prevents
 * the listener from being re-registered on every render.
 *
 * @param {string}   event    — socket event name
 * @param {function} handler  — callback(data) when event fires
 */
const useSocket = (event, handler) => {
    // Always keep the ref pointing to the latest handler
    const handlerRef = useRef(handler);
    useEffect(() => {
        handlerRef.current = handler;
    }); // intentionally no deps — always sync

    useEffect(() => {
        const s = getSocket();

        // Stable listener function — uses ref to call latest handler
        const listener = (data) => {
            if (handlerRef.current) handlerRef.current(data);
        };

        s.on(event, listener);

        return () => {
            s.off(event, listener);
        };
    }, [event]); // only re-register if event name changes
};

export default useSocket;
export { getSocket };
