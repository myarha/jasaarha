
import React from 'react';

interface LoadingOverlayProps {
  isVisible: boolean;
  message?: string;
}

const LoadingOverlay: React.FC<LoadingOverlayProps> = ({ isVisible, message = "Memproses Data..." }) => {
  if (!isVisible) return null;

  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center">
      {/* Backdrop dengan blur halus */}
      <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-[2px] animate-in fade-in duration-300" />
      
      {/* Container Pesan */}
      <div className="relative bg-white px-8 py-6 rounded-[2rem] shadow-2xl flex flex-col items-center gap-4 animate-in zoom-in-95 duration-200">
        <div className="relative w-12 h-12">
          {/* Ring luar yang berputar lambat */}
          <div className="absolute inset-0 border-4 border-indigo-50 rounded-full"></div>
          {/* Spinner utama yang berputar cepat */}
          <div className="absolute inset-0 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin"></div>
          {/* Titik tengah statis */}
          <div className="absolute inset-[35%] bg-indigo-200 rounded-full animate-pulse"></div>
        </div>
        
        <div className="flex flex-col items-center">
          <span className="text-[11px] font-black text-indigo-600 uppercase tracking-[0.2em] animate-pulse">
            {message}
          </span>
          <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest mt-1">
            Mohon Tunggu Sebentar
          </span>
        </div>
      </div>
    </div>
  );
};

export default LoadingOverlay;
