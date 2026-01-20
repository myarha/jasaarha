
import React from 'react';
import { TransactionType } from '../types';

interface FilterModalProps {
  isOpen: boolean;
  onClose: () => void;
  filters: {
    month: number;
    year: number;
    nopol: string;
    type: string;
  };
  setFilters: (filters: any) => void;
  onReset: () => void;
}

const MONTHS = ["JANUARI", "FEBRUARI", "MARET", "APRIL", "MEI", "JUNI", "JULI", "AGUSTUS", "SEPTEMBER", "OKTOBER", "NOVEMBER", "DESEMBER"];
const YEARS = [2024, 2025, 2026];

const FilterModal: React.FC<FilterModalProps> = ({ isOpen, onClose, filters, setFilters, onReset }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-end sm:items-center justify-center p-0 sm:p-6 overflow-hidden">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm animate-in fade-in duration-300"
        onClick={onClose}
      />
      
      {/* Modal Content */}
      <div className="relative w-full max-w-lg bg-white rounded-t-[2.5rem] sm:rounded-[2.5rem] shadow-2xl flex flex-col h-[85vh] h-[85dvh] sm:h-auto sm:max-h-[90vh] animate-in slide-in-from-bottom-10 duration-300 overflow-hidden">
        
        {/* FIXED HEADER */}
        <div className="flex justify-between items-center p-8 pb-4 bg-white border-b border-slate-50">
          <div>
            <h3 className="text-xl font-black text-slate-900 font-heading tracking-tight">Filter Data</h3>
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mt-1">Sesuaikan tampilan laporan</p>
          </div>
          <button 
            onClick={onReset} 
            className="px-3 py-2 bg-slate-50 hover:bg-slate-100 text-[10px] font-black text-indigo-600 uppercase tracking-widest rounded-lg transition-all active:scale-95"
          >
            Reset
          </button>
        </div>

        {/* SCROLLABLE BODY */}
        <div className="overflow-y-auto no-scrollbar p-8 pt-6 flex-1 space-y-8 pb-32">
          {/* 1. Pencarian Nopol */}
          <div className="space-y-3">
            <label className="text-[11px] font-black text-slate-400 uppercase tracking-widest ml-1">Cari Nomor Polisi</label>
            <div className="relative group">
              <input 
                type="text"
                placeholder="CONTOH: DK 1234 ABC"
                className="w-full px-5 py-4 bg-slate-50 border border-slate-100 rounded-2xl font-bold text-slate-700 outline-none focus:border-indigo-400 focus:bg-white transition-all placeholder:text-slate-300 placeholder:font-medium"
                value={filters.nopol}
                onChange={(e) => setFilters({...filters, nopol: e.target.value.toUpperCase()})}
              />
              <div className="absolute right-5 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-indigo-400 transition-colors">
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>
              </div>
            </div>
          </div>

          {/* 2. Jenis Transaksi */}
          <div className="space-y-3">
            <label className="text-[11px] font-black text-slate-400 uppercase tracking-widest ml-1">Jenis Layanan</label>
            <div className="grid grid-cols-2 gap-2">
              <button 
                onClick={() => setFilters({...filters, type: ''})}
                className={`px-4 py-3.5 rounded-xl text-[10px] font-black uppercase tracking-wider transition-all border ${filters.type === '' ? 'bg-indigo-600 text-white border-indigo-600 shadow-lg shadow-indigo-100' : 'bg-slate-50 text-slate-400 border-slate-50 hover:border-slate-200'}`}
              >
                Semua Layanan
              </button>
              {Object.values(TransactionType).map((type) => (
                <button 
                  key={type}
                  onClick={() => setFilters({...filters, type})}
                  className={`px-4 py-3.5 rounded-xl text-[10px] font-black uppercase tracking-wider transition-all border ${filters.type === type ? 'bg-indigo-600 text-white border-indigo-600 shadow-lg shadow-indigo-100' : 'bg-slate-50 text-slate-400 border-slate-50 hover:border-slate-200'}`}
                >
                  {type}
                </button>
              ))}
            </div>
          </div>

          {/* 3. Periode */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-3">
              <label className="text-[11px] font-black text-slate-400 uppercase tracking-widest ml-1">Bulan</label>
              <div className="relative">
                <select 
                  className="w-full px-5 py-4 bg-slate-50 border border-slate-100 rounded-2xl font-bold text-slate-700 outline-none focus:border-indigo-400 appearance-none cursor-pointer"
                  value={filters.month}
                  onChange={(e) => setFilters({...filters, month: parseInt(e.target.value)})}
                >
                  {MONTHS.map((m, i) => <option key={m} value={i}>{m}</option>)}
                </select>
                <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400">
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><polyline points="6 9 12 15 18 9"></polyline></svg>
                </div>
              </div>
            </div>
            <div className="space-y-3">
              <label className="text-[11px] font-black text-slate-400 uppercase tracking-widest ml-1">Tahun</label>
              <div className="relative">
                <select 
                  className="w-full px-5 py-4 bg-slate-50 border border-slate-100 rounded-2xl font-bold text-slate-700 outline-none focus:border-indigo-400 appearance-none cursor-pointer"
                  value={filters.year}
                  onChange={(e) => setFilters({...filters, year: parseInt(e.target.value)})}
                >
                  {YEARS.map(y => <option key={y} value={y}>{y}</option>)}
                </select>
                <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400">
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><polyline points="6 9 12 15 18 9"></polyline></svg>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* FIXED FOOTER WITH BUTTON */}
        <div className="absolute bottom-0 inset-x-0 p-8 pt-4 bg-white/80 backdrop-blur-md border-t border-slate-50">
          <button 
            onClick={onClose}
            className="w-full py-4 bg-indigo-600 text-white font-black text-[12px] uppercase tracking-[0.2em] rounded-2xl shadow-xl shadow-indigo-100 hover:bg-indigo-700 active:scale-[0.98] transition-all flex items-center justify-center gap-2"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><polyline points="20 6 9 17 4 12"></polyline></svg>
            Terapkan Filter
          </button>
        </div>
      </div>
    </div>
  );
};

export default FilterModal;
