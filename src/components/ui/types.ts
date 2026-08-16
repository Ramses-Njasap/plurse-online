export type ToastType = "success" | "error" | "warning" | "info";

export interface ToastOptions {
    /** Optional bold lead-in shown above the message (e.g. a business name or "Operation failed"). */
    title?: string;
    /**
     * Time in ms before the toast auto-dismisses.
     * Pass `Infinity` to keep it up until the user closes it manually.
     * Defaults: error/warning = 6000ms, success/info = 4000ms.
     */
    duration?: number;
}

export interface ToastItem extends ToastOptions {
    id: string;
    type: ToastType;
    message: string;
}

export interface ToastContextValue {
    success: (message: string, options?: ToastOptions) => string;
    error: (message: string, options?: ToastOptions) => string;
    warning: (message: string, options?: ToastOptions) => string;
    info: (message: string, options?: ToastOptions) => string;
    dismiss: (id: string) => void;
}