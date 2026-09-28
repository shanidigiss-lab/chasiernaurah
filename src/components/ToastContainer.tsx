import React from 'react';
import { CheckCircle2, AlertCircle, Info, X } from 'lucide-react';
import { usePOS } from '../context/POSContext';

export const ToastContainer: React.FC = () => {
  const { toasts, removeToast } = usePOS();

  if (toasts.length === 0) return null;

  return (
    <div className="fixed bottom-5 right-5 z-50 flex flex-col gap-2.5 max-w-sm w-full pointer-events-none">
      {toasts.map((toast) => {
        const isSuccess = toast.type === 'success';
        const isError = toast.type === 'error';

        return (
          <div
            key={toast.id}
            className={`
              pointer-events-auto p-4 rounded-xl shadow-lg border flex items-start gap-3 transition-all duration-200 animate-in slide-in-from-bottom-5
              ${
                isSuccess
                  ? 'bg-[#ffffff] border-emerald-300 text-[#191c1e]'
                  : isError
                  ? 'bg-[#ffffff] border-[#ba1a1a] text-[#191c1e]'
                  : 'bg-[#ffffff] border-[#2f6481] text-[#191c1e]'
              }
            `}
          >
            <div className="shrink-0 mt-0.5">
              {isSuccess && <CheckCircle2 className="w-5 h-5 text-emerald-600" />}
              {isError && <AlertCircle className="w-5 h-5 text-[#ba1a1a]" />}
              {!isSuccess && !isError && <Info className="w-5 h-5 text-[#2f6481]" />}
            </div>
            <div className="flex-1 min-w-0">
              <h5 className="font-bold text-[13px] leading-snug">{toast.title}</h5>
              <p className="text-[12px] text-[#71787e] mt-0.5 leading-tight">{toast.message}</p>
            </div>
            <button
              onClick={() => removeToast(toast.id)}
              className="text-[#71787e] hover:text-[#191c1e] p-1 rounded-md transition-colors shrink-0"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        );
      })}
    </div>
  );
};
