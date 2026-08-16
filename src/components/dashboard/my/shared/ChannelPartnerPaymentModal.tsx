"use client";

interface PartnerPaymentModalProps {
    isOpen: boolean;
    isProcessing: boolean;
    statusMessage: string;
    onClose: () => void;
    onConfirm: () => void;
}

export function ChannelPartnerPaymentModal({
    isOpen, isProcessing, statusMessage, onClose, onConfirm
}: PartnerPaymentModalProps) {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-in fade-in duration-200">
            <div className="bg-white rounded-xl shadow-xl w-full max-w-sm overflow-hidden border border-slate-100">
                <div className="p-5 border-b border-slate-100 bg-slate-50">
                    <h3 className="text-sm font-bold text-slate-900">Channel Partner Subscription</h3>
                    <p className="text-[11px] text-slate-500 mt-0.5">Instant activation over secure mobile network billing ports</p>
                </div>

                <div className="p-5 space-y-4">
                    <div className="bg-orange-50/70 border border-orange-100 rounded-lg p-3 text-[12px] text-amber-900 space-y-1.5">
                        <p className="font-semibold">Plan Specifications:</p>
                        <p>• Period: 3 Months Complete Routing License</p>
                        <p>• Price: 4,000 XAF (Flat payment)</p>
                    </div>

                    {statusMessage && (
                        <p className="text-[12px] font-medium text-center text-orange-600 bg-orange-50 p-2 rounded">
                            {statusMessage}
                        </p>
                    )}
                </div>

                <div className="p-3 bg-slate-50 border-t border-slate-100 flex items-center justify-end gap-1.5">
                    <button
                        type="button"
                        disabled={isProcessing}
                        onClick={onClose}
                        className="px-3 py-1.5 text-[12px] font-medium text-slate-600 hover:bg-slate-100 rounded-md transition-colors"
                    >
                        Abort
                    </button>
                    <button
                        type="button"
                        disabled={isProcessing}
                        onClick={onConfirm}
                        className="px-3 py-1.5 text-[12px] font-semibold text-white bg-orange-600 hover:bg-orange-700 rounded-md shadow transition-colors disabled:opacity-50"
                    >
                        {isProcessing ? "Connecting..." : "Confirm 4,000 XAF"}
                    </button>
                </div>
            </div>
        </div>
    );
}
