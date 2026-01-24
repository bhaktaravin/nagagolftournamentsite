"use client";

import React, { createContext, useContext, useState, useCallback } from "react";
import { cn } from "@/lib/utils";

type ToastType = "success" | "error" | "info";

interface Toast {
    id: number;
    message: string;
    type: ToastType;
}

interface ToastContextType {
    addToast: (message: string, type?: ToastType) => void;
}

const ToastContext = createContext<ToastContextType | undefined>(undefined);

export function useToast() {
    const context = useContext(ToastContext);
    if (!context) {
        throw new Error("useToast must be used within a ToastProvider");
    }
    return context;
}

export function ToastProvider({ children }: { children: React.ReactNode }) {
    const [toasts, setToasts] = useState<Toast[]>([]);

    const addToast = useCallback((message: string, type: ToastType = "info") => {
        const id = Date.now();
        setToasts((prev) => [...prev, { id, message, type }]);

        // Auto dismiss
        setTimeout(() => {
            setToasts((prev) => prev.filter((t) => t.id !== id));
        }, 5000); // 5s
    }, []);

    const removeToast = useCallback((id: number) => {
        setToasts((prev) => prev.filter((t) => t.id !== id));
    }, []);

    return (
        <ToastContext.Provider value={{ addToast }}>
            {children}
            <div className="fixed bottom-4 right-4 z-50 flex flex-col gap-2">
                {toasts.map((toast) => (
                    <div
                        key={toast.id}
                        className={cn(
                            "flex min-w-[300px] items-center justify-between rounded-lg px-4 py-3 shadow-lg transition-all border-l-4",
                            toast.type === "success" && "bg-white text-gray-800 border-[#2d5a3d]",
                            toast.type === "error" && "bg-white text-gray-800 border-red-500",
                            toast.type === "info" && "bg-white text-gray-800 border-blue-500"
                        )}
                    >
                        <div className="flex items-center gap-3">
                            {toast.type === "success" && <span className="text-[#2d5a3d]">✓</span>}
                            {toast.type === "error" && <span className="text-red-500">✕</span>}
                            <p className="text-sm font-medium">{toast.message}</p>
                        </div>
                        <button
                            onClick={() => removeToast(toast.id)}
                            className="ml-4 text-gray-400 hover:text-gray-600"
                        >
                            ×
                        </button>
                    </div>
                ))}
            </div>
        </ToastContext.Provider>
    );
}
