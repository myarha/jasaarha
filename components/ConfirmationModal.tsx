
import React from 'react';

interface ConfirmationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  message: string;
}

const ConfirmationModal: React.FC<ConfirmationModalProps> = ({ isOpen, onClose, onConfirm, title, message }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-6">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm animate-in fade-in duration-300"
        onClick={onClose}
      />
      
      {/* Modal Card */}
      <div className="relative w-full max-w-sm bg-white rounded-[2.5rem] shadow-2xl shadow-slate-900/20 overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        <div className="p-8 flex flex-col items-center text-center">
          {/* Warning Icon Container */}
          <div className="w-20 h-20 bg-red-50 rounded-full flex items-center justify-center mb-6 animate-pulse">
            <div className="w-14 h-14 bg-red-100 rounded-full flex items-center justify-center">
              <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#ef4444" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M3 6h18"></path>
                <path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"></path>
                <path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"></path>
                <line x1="10" y1="11" x2="10" y2="17"></line>
                <line x1="14" y1="11" x2="14" y2="17"></line>
              </svg>
            </div>
          </div>

          <h3 className="text-xl font-black text-slate-900 mb-2 font-heading tracking-tight">
            {title}
          </h3>
          <p className="text-slate-500 text-sm font-medium leading-relaxed px-2">
            {message}
          </p>
        </div>

        {/* Actions */}
        <div className="flex gap-3 p-6 pt-0">
          <button 
            onClick={onClose}
            className="flex-1 py-4 px-6 bg-slate-50 text-slate-500 font-black text-[11px] uppercase tracking-widest rounded-2xl hover:bg-slate-100 transition-colors active:scale-95"
          >
            Batal
          </button>
          <button 
            onClick={() => {
              onConfirm();
              onClose();
            }}
            className="flex-1 py-4 px-6 bg-red-500 text-white font-black text-[11px] uppercase tracking-widest rounded-2xl shadow-lg shadow-red-100 hover:bg-red-600 transition-all active:scale-95"
          >
            Ya, Hapus
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmationModal;
