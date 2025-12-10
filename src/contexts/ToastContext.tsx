import { createContext, useContext, useState, ReactNode } from "react";

type ToastType = "success" | "error" | "info" | "warning";

interface Toast {
    id: number;
    message: string;
    type: ToastType;
}

interface ToastContextType {
    showToast: (message: string, type?: ToastType) => void;
}

const ToastContext = createContext<ToastContextType | undefined>(undefined);

export const useToast = () => {
    const context = useContext(ToastContext);
    if (!context) {
        throw new Error("useToast must be used within ToastProvider");
    }
    return context;
};

export const ToastProvider = ({ children }: { children: ReactNode }) => {
    const [toasts, setToasts] = useState<Toast[]>([]);

    const showToast = (message: string, type: ToastType = "info") => {
        const id = Date.now();
        setToasts((prev) => [...prev, { id, message, type }]);

        setTimeout(() => {
            setToasts((prev) => prev.filter((toast) => toast.id !== id));
        }, 3000);
    };

    const removeToast = (id: number) => {
        setToasts((prev) => prev.filter((toast) => toast.id !== id));
    };

    return (
        <ToastContext.Provider value={{ showToast }}>
            {children}
            <div className="fixed top-4 right-4 z-50 space-y-2">
                {
                    toasts.map((toast) => (
                        <div
                            key={toast.id}
                            className={`min-w-[300px] px-4 py-3 rounded-lg shadow-lg flex items-start gap-3 animate-slide-in ${toast.type === "success"
                                ? "bg-emerald-500 text-white"
                                : toast.type === "error"
                                    ? "bg-rose-500 text-white"
                                    : toast.type === "warning"
                                        ? "bg-amber-500 text-white"
                                        : "bg-blue-500 text-white"
                                }`}
                        >
                            <div className="flex-1 font-medium" > {toast.message} </div>
                            <button
                                onClick={() => removeToast(toast.id)}
                                className="text-white/80 hover:text-white transition"
                            >
                                ×
                            </button>
                        </div>
                    ))}
            </div>
        </ToastContext.Provider>
    );
};
