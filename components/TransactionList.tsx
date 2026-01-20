
import React from 'react';
import { Transaction, TransactionType } from '../types';

interface TransactionListProps {
  transactions: Transaction[];
  onDelete: (id: string) => void;
  onEdit: (transaction: Transaction) => void;
}

const TransactionList: React.FC<TransactionListProps> = ({ transactions, onDelete, onEdit }) => {
  const getJenisTransaksiColor = (type: string) => {
    switch (type) {
      case TransactionType.PENGESAHAN: return 'text-sky-600';
      case TransactionType.GANTI_STNK: return 'text-amber-600';
      case TransactionType.BALIK_NAMA: return 'text-emerald-600';
      case TransactionType.MUTASI: return 'text-violet-600';
      default: return 'text-indigo-500/70';
    }
  };

  if (transactions.length === 0) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center text-center p-12">
        <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mb-4">
          <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#cbd5e1" strokeWidth="2"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect><line x1="9" y1="9" x2="15" y2="9"></line><line x1="9" y1="13" x2="15" y2="13"></line></svg>
        </div>
        <h3 className="text-sm font-black text-slate-400 tracking-widest uppercase">Belum Ada Data</h3>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {transactions.map((t) => (
        <div key={t.id} className="bg-white rounded-2xl border border-slate-100 p-4 shadow-sm hover:border-indigo-100 transition-all">
          <div className="flex justify-between items-start mb-2">
            <div className="flex items-center gap-2">
              <span className="bg-slate-900 text-white text-[9px] font-black px-2 py-0.5 rounded tracking-tighter shadow-sm">{t.nopol}</span>
              <span className="text-[10px] font-bold text-slate-300 uppercase">{t.tanggal}</span>
            </div>
            <div className="flex gap-1">
              <button onClick={() => onEdit(t)} className="p-1.5 text-slate-300 hover:text-indigo-600 active:scale-75 transition-all">
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path></svg>
              </button>
              <button onClick={() => onDelete(t.id)} className="p-1.5 text-slate-300 hover:text-red-500 active:scale-75 transition-all">
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><path d="M3 6h18"></path><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"></path><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"></path></svg>
              </button>
            </div>
          </div>
          <div className="mb-3 text-left flex items-center gap-2.5">
            <div className="w-8 h-8 bg-indigo-50 rounded-lg flex items-center justify-center text-indigo-500 shrink-0 shadow-sm">
              <svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><circle cx="12" cy="8" r="5"></circle><path d="M20 21a8 8 0 1 0-16 0"></path></svg>
            </div>
            <div className="min-w-0">
              <h4 className="font-heading font-black text-slate-900 text-[13px] uppercase leading-tight truncate">{t.namaWajibPajak}</h4>
              <p className={`text-[10px] font-black uppercase tracking-wider mt-0.5 ${getJenisTransaksiColor(t.jenisTransaksi)}`}>
                {t.jenisTransaksi}
              </p>
            </div>
          </div>
          <div className="grid grid-cols-3 gap-2 py-2 px-3 bg-slate-50 rounded-xl border border-slate-100/50 mb-3">
            <div><p className="text-[7px] font-black text-slate-400 uppercase mb-1">Diterima</p><p className="text-[10px] font-bold text-slate-600">{new Intl.NumberFormat('id-ID').format(t.uangDiterima)}</p></div>
            <div className="border-x border-slate-200 px-2"><p className="text-[7px] font-black text-slate-400 uppercase mb-1">Proses</p><p className="text-[10px] font-bold text-slate-600">{new Intl.NumberFormat('id-ID').format(t.biayaProses)}</p></div>
            <div className="text-right"><p className="text-[7px] font-black text-indigo-400 uppercase mb-1">Keuntungan</p><p className="text-[11px] font-black text-indigo-600">{new Intl.NumberFormat('id-ID').format(t.keuntungan)}</p></div>
          </div>
        </div>
      ))}
    </div>
  );
};
export default TransactionList;
