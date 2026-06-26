import { useEffect, useRef } from 'react';
import { X, AlertTriangle, CheckCircle, Info, HelpCircle } from 'lucide-react';

type ModalType = 'info' | 'success' | 'warning' | 'confirm' | 'error';

interface ModalAlertProps {
    isOpen: boolean;
    onClose: () => void;
    title: string;
    message: string;
    type?: ModalType;
    confirmText?: string;
    cancelText?: string;
    onConfirm?: () => void;
    isDark?: boolean;
}

export function ModalAlert({
    isOpen,
    onClose,
    title,
    message,
    type = 'info',
    confirmText = 'OK',
    cancelText = 'Cancel',
    onConfirm,
    isDark = false
}: ModalAlertProps) {
    const modalRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (isOpen) {
            document.body.style.overflow = 'hidden';
            modalRef.current?.focus();
        } else {
            document.body.style.overflow = '';
        }
        return () => {
            document.body.style.overflow = '';
        };
    }, [isOpen]);

    useEffect(() => {
        const handleEsc = (e: KeyboardEvent) => {
            if (e.key === 'Escape' && isOpen) onClose();
        };
        window.addEventListener('keydown', handleEsc);
        return () => window.removeEventListener('keydown', handleEsc);
    }, [isOpen, onClose]);

    if (!isOpen) return null;

    const iconConfig = {
        info: { icon: Info, color: 'text-blue-500', bg: 'bg-blue-100' },
        success: { icon: CheckCircle, color: 'text-green-500', bg: 'bg-green-100' },
        warning: { icon: AlertTriangle, color: 'text-amber-500', bg: 'bg-amber-100' },
        confirm: { icon: HelpCircle, color: 'text-indigo-500', bg: 'bg-indigo-100' },
        error: { icon: AlertTriangle, color: 'text-red-500', bg: 'bg-red-100' }
    };

    const { icon: Icon, color, bg } = iconConfig[type];
    const isConfirmType = type === 'confirm' || !!onConfirm;

    return (
        <div
            className="fixed inset-0 z-[9999] flex items-center justify-center p-4"
            style={{ animation: 'fadeIn 0.15s ease-out' }}
        >
            {/* Backdrop */}
            <div
                className="absolute inset-0 bg-black/50 backdrop-blur-sm"
                onClick={onClose}
            />

            {/* Modal */}
            <div
                ref={modalRef}
                tabIndex={-1}
                className={`relative w-full max-w-md rounded-2xl shadow-2xl p-6 transform transition-all ${isDark
                        ? 'bg-[#1E1F23] border border-slate-700'
                        : 'bg-white'
                    }`}
                style={{ animation: 'scaleIn 0.2s ease-out' }}
            >
                {/* Close button */}
                <button
                    onClick={onClose}
                    className={`absolute top-4 right-4 p-1 rounded-lg transition-colors ${isDark
                            ? 'text-slate-400 hover:bg-slate-700 hover:text-slate-200'
                            : 'text-gray-400 hover:bg-gray-100 hover:text-gray-600'
                        }`}
                >
                    <X size={20} />
                </button>

                {/* Icon */}
                <div className={`w-12 h-12 rounded-full ${isDark ? 'bg-opacity-20' : ''} ${bg} flex items-center justify-center mb-4`}>
                    <Icon className={color} size={24} />
                </div>

                {/* Content */}
                <h3 className={`text-xl font-bold mb-2 ${isDark ? 'text-white' : 'text-gray-900'}`}>
                    {title}
                </h3>
                <p className={`text-sm mb-6 leading-relaxed ${isDark ? 'text-slate-300' : 'text-gray-600'}`}>
                    {message}
                </p>

                {/* Actions */}
                <div className="flex gap-3 justify-end">
                    {isConfirmType && (
                        <button
                            onClick={onClose}
                            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${isDark
                                    ? 'bg-slate-700 text-slate-200 hover:bg-slate-600'
                                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                                }`}
                        >
                            {cancelText}
                        </button>
                    )}
                    <button
                        onClick={() => {
                            if (onConfirm) onConfirm();
                            onClose();
                        }}
                        className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${type === 'error' || type === 'warning'
                                ? 'bg-red-600 text-white hover:bg-red-700'
                                : 'bg-blue-600 text-white hover:bg-blue-700'
                            }`}
                    >
                        {confirmText}
                    </button>
                </div>
            </div>

            <style>{`
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes scaleIn {
          from { opacity: 0; transform: scale(0.95); }
          to { opacity: 1; transform: scale(1); }
        }
      `}</style>
        </div>
    );
}
