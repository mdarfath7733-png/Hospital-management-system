import React, { useEffect } from 'react';
import { X, AlertTriangle, CheckCircle2, Info } from 'lucide-react';

export const Modal = ({
  isOpen,
  onClose,
  title,
  children,
  confirmText,
  cancelText = 'Cancel',
  onConfirm,
  confirmVariant = 'danger',
  isLoading = false,
  maxWidth = 'max-w-md',
}) => {
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape' && isOpen && !isLoading) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, isLoading, onClose]);

  if (!isOpen) return null;

  const variantButtonStyles = {
    danger: 'bg-rose-600 hover:bg-rose-700 text-white focus:ring-rose-500',
    primary: 'bg-teal-600 hover:bg-teal-700 text-white focus:ring-teal-500',
    emerald: 'bg-emerald-600 hover:bg-emerald-700 text-white focus:ring-emerald-500',
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm transition-opacity"
        onClick={() => !isLoading && onClose()}
      />

      <div className="flex min-h-full items-center justify-center p-4 text-center sm:p-0">
        <div
          className={`relative transform overflow-hidden rounded-2xl bg-white text-left shadow-2xl transition-all sm:my-8 w-full ${maxWidth} border border-slate-200`}
        >
          {/* Header */}
          <div className="flex items-center justify-between border-b border-slate-100 px-6 py-4">
            <h3 className="text-lg font-semibold text-slate-900">{title}</h3>
            <button
              type="button"
              disabled={isLoading}
              onClick={onClose}
              className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-100 hover:text-slate-600 transition"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Body */}
          <div className="px-6 py-5">{children}</div>

          {/* Footer */}
          {(onConfirm || cancelText) && (
            <div className="flex items-center justify-end gap-3 bg-slate-50/80 border-t border-slate-100 px-6 py-3.5">
              {cancelText && (
                <button
                  type="button"
                  disabled={isLoading}
                  onClick={onClose}
                  className="rounded-lg border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50 transition focus:outline-none focus:ring-2 focus:ring-teal-500 focus:ring-offset-2 disabled:opacity-50"
                >
                  {cancelText}
                </button>
              )}
              {onConfirm && (
                <button
                  type="button"
                  disabled={isLoading}
                  onClick={onConfirm}
                  className={`inline-flex items-center justify-center rounded-lg px-4 py-2 text-sm font-medium transition focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 ${
                    variantButtonStyles[confirmVariant] || variantButtonStyles.primary
                  }`}
                >
                  {isLoading ? 'Processing...' : confirmText || 'Confirm'}
                </button>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Modal;
