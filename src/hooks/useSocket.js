/**
 * ============================================================
 *  useSocket — React Hook for Socket.io Client
 * ============================================================
 *  Connects to the backend Socket.io server and provides a
 *  way to listen for real-time events inside any component.
 *
 *  Usage:
 *    import useSocket from "../hooks/useSocket";
 *
 *    function Dashboard() {
 *      useSocket("new_contact", (data) => {
 *        console.log("New contact received!", data);
 *      });
 *    }
 * ============================================================
 */

import { useEffect, useRef } from "react";
import { io } from "socket.io-client";

const SOCKET_URL = import.meta.env.VITE_SOCKET_URL || "http://localhost:5000";

// Singleton socket instance (shared across all hook consumers)
let socket = null;

const getSocket = () => {
    if (!socket) {
        socket = io(SOCKET_URL, {
            transports: ["websocket", "polling"],
            autoConnect: true,
        });

        socket.on("connect", () => {
            console.log("🔌 Socket connected:", socket.id);
        });

        socket.on("disconnect", () => {
            console.log("🔌 Socket disconnected");
        });
    }
    return socket;
};

/**
 * Hook to subscribe to a socket event.
 * Automatically cleans up on unmount.
 *
 * @param {string}   event    — event name to listen for
 * @param {function} handler  — callback when event fires
 */
const useSocket = (event, handler) => {
    const savedHandler = useRef(handler);

    // Keep handler ref fresh
    useEffect(() => {
        savedHandler.current = handler;
    }, [handler]);

    useEffect(() => {
        const s = getSocket();
        const listener = (data) => savedHandler.current(data);

        s.on(event, listener);

        return () => {
            s.off(event, listener);
        };
    }, [event]);
};

export default useSocket;
export { getSocket };
