
import React, { useState, useEffect, useMemo } from 'react';
import { Transaction, TransactionType } from './types';
import { dbService } from './services/dbService';
import TransactionForm from './components/TransactionForm';
import TransactionList from './components/TransactionList';
import ConfirmationModal from './components/ConfirmationModal';
import FilterModal from './components/FilterModal';
import LoadingOverlay from './components/LoadingOverlay';
import jsPDF from 'jspdf';
import 'jspdf-autotable';

const App: React.FC = () => {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [view, setView] = useState<'list' | 'form'>('list');
  const [editingTransaction, setEditingTransaction] = useState<Transaction | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSyncing, setIsSyncing] = useState(false);
  const [cloudError, setCloudError] = useState<string | null>(null);
  
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [idToDelete, setIdToDelete] = useState<string | null>(null);
  const [showFilterModal, setShowFilterModal] = useState(false);
  
  const [filters, setFilters] = useState({
    month: new Date().getMonth(),
    year: new Date().getFullYear(),
    nopol: '',
    type: ''
  });

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setIsLoading(true);
    setIsSyncing(true);
    try {
      const data = await dbService.getAllTransactions();
      setTransactions(data);
      setCloudError(null);
    } catch (err: any) {
      if (err.message === 'API_NOT_ENABLED') {
        setCloudError('Setup Firestore Diperlukan');
      }
    } finally {
      setIsLoading(false);
      setIsSyncing(false);
    }
  };

  const handleBackup = () => {
    const dataStr = JSON.stringify(transactions, null, 2);
    const dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr);
    const exportFileDefaultName = `backup-jasa-arha-${new Date().toISOString().split('T')[0]}.json`;
    const linkElement = document.createElement('a');
    linkElement.setAttribute('href', dataUri);
    linkElement.setAttribute('download', exportFileDefaultName);
    linkElement.click();
  };

  const handleGeneratePDF = () => {
    const doc = new jsPDF();
    const MONTHS = ["JANUARI", "FEBRUARI", "MARET", "APRIL", "MEI", "JUNI", "JULI", "AGUSTUS", "SEPTEMBER", "OKTOBER", "NOVEMBER", "DESEMBER"];
    const currentMonth = MONTHS[filters.month];
    
    doc.setFontSize(8);
    doc.setTextColor(79, 70, 229); 
    doc.setFont("helvetica", "bold");
    doc.text("JASA", 14, 18, { charSpace: 2 });
    
    doc.setFontSize(22);
    doc.setTextColor(30, 41, 59); 
    doc.setFont("helvetica", "bold");
    doc.text("ARHA", 14, 26);
    doc.setTextColor(79, 70, 229); 
    doc.text(".", 40, 26);
    
    doc.setDrawColor(230, 230, 230);
    doc.setLineWidth(0.5);
    doc.line(14, 32, 196, 32);
    
    doc.setFontSize(14);
    doc.setTextColor(30, 41, 59);
    doc.setFont("helvetica", "bold");
    doc.text(`LAPORAN TRANSAKSI BULAN ${currentMonth} ${filters.year}`, 14, 45);
    
    const tableData = filteredTransactions.map((t, index) => [
      index + 1,
      t.tanggal,
      t.nopol,
      t.namaWajibPajak,
      t.jenisTransaksi.toUpperCase(),
      t.keuntungan.toLocaleString('id-ID')
    ]);
    
    (doc as any).autoTable({
      startY: 52,
      head: [['NO', 'TANGGAL', 'NOPOL', 'NAMA WAJIB PAJAK', 'JENIS', 'KEUNTUNGAN (RP)']],
      body: tableData,
      theme: 'grid',
      headStyles: { fillColor: [79, 70, 229], fontSize: 8, fontStyle: 'bold', halign: 'center', valign: 'middle', cellPadding: 4 },
      styles: { fontSize: 8, cellPadding: 3, overflow: 'linebreak', font: 'helvetica', valign: 'middle' },
      columnStyles: {
        0: { cellWidth: 12, halign: 'center' },
        1: { cellWidth: 25, halign: 'center' },
        2: { cellWidth: 35, halign: 'center', fontStyle: 'bold' },
        3: { cellWidth: 'auto', halign: 'left' },
        4: { cellWidth: 25, halign: 'center' },
        5: { cellWidth: 35, halign: 'right', fontStyle: 'bold' }
      }
    });
    
    const finalY = (doc as any).lastAutoTable.finalY || 70;
    doc.setDrawColor(241, 245, 249);
    doc.setLineWidth(1);
    doc.line(14, finalY + 8, 196, finalY + 8);

    doc.setFontSize(9);
    doc.setTextColor(100, 116, 139);
    doc.setFont("helvetica", "bold");
    doc.text(`Total Terdaftar:`, 14, finalY + 18);
    doc.setFont("helvetica", "normal");
    doc.text(`${filteredTransactions.length} Wajib Pajak`, 42, finalY + 18);
    
    doc.setFillColor(248, 250, 252); 
    doc.roundedRect(110, finalY + 12, 86, 25, 3, 3, 'F');
    
    doc.setFontSize(9);
    doc.setTextColor(100, 116, 139);
    doc.setFont("helvetica", "bold");
    doc.text("TOTAL KEUNTUNGAN BERSIH", 115, finalY + 20);
    
    doc.setFontSize(16);
    doc.setTextColor(79, 70, 229);
    doc.setFont("helvetica", "bold");
    doc.text(`Rp ${totalProfit.toLocaleString('id-ID')}`, 191, finalY + 30, { align: 'right' });
    
    doc.save(`Laporan_Arha_${currentMonth}_${filters.year}.pdf`);
  };

  const handleSave = async (formData: any) => {
    setIsSyncing(true);
    const transaction: Transaction = {
      id: editingTransaction?.id || crypto.randomUUID(),
      ...formData,
      uangDiterima: parseFloat(formData.uangDiterima),
      biayaProses: parseFloat(formData.biayaProses),
      keuntungan: parseFloat(formData.keuntungan),
      timestamp: Date.now()
    };
    try {
      await dbService.saveTransaction(transaction);
      await loadData();
      setView('list');
      setEditingTransaction(null);
    } catch (err) { 
      await loadData();
      setView('list');
    } finally { 
      setIsSyncing(false); 
    }
  };

  const handleDelete = async () => {
    if (idToDelete) {
      setIsSyncing(true);
      try {
        await dbService.deleteTransaction(idToDelete);
        await loadData();
      } catch (err) {}
      setIdToDelete(null);
      setIsSyncing(false);
    }
  };

  const filteredTransactions = useMemo(() => {
    return transactions.filter(t => {
      const date = new Date(t.tanggal);
      return date.getMonth() === filters.month && 
             date.getFullYear() === filters.year && 
             t.nopol.toLowerCase().includes(filters.nopol.toLowerCase()) && 
             (filters.type === '' || t.jenisTransaksi === filters.type);
    });
  }, [transactions, filters]);

  const totalProfit = filteredTransactions.reduce((acc, curr) => acc + curr.keuntungan, 0);

  return (
    <div className="min-h-screen bg-[#f8fafc] font-sans text-slate-900 overflow-x-hidden">
      <LoadingOverlay isVisible={isSyncing && (view === 'form' || transactions.length > 0)} />

      {view === 'list' ? (
        <div className="flex flex-col h-screen">
          <div className="bg-white border-b border-slate-100 sticky top-0 z-30 pt-4 pb-5 px-5">
            <div className="max-w-4xl mx-auto">
              
              {cloudError && (
                <div className="mb-4 p-4 bg-amber-50 border-2 border-amber-200 rounded-3xl flex items-start gap-4 shadow-sm">
                  <div className="w-12 h-12 rounded-2xl bg-amber-100 flex items-center justify-center text-amber-600 shrink-0 shadow-inner">
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z"/><path d="M12 9v4"/><path d="M12 17h.01"/></svg>
                  </div>
                  <div className="flex-1 py-1">
                    <h4 className="text-[11px] font-black text-amber-900 uppercase tracking-wider mb-1">Database Cloud Offline</h4>
                    <p className="text-[10px] font-bold text-amber-700 leading-snug">Data disimpan secara lokal di HP ini.</p>
                  </div>
                </div>
              )}

              <header className="flex justify-between items-center mb-6">
                <div className="flex flex-col">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-[9px] font-black text-indigo-600 tracking-[0.3em] uppercase leading-none">JASA</span>
                    <div className="flex items-center gap-1">
                      <div className={`w-1.5 h-1.5 rounded-full ${cloudError ? 'bg-amber-400' : isSyncing ? 'bg-slate-300 animate-pulse' : 'bg-emerald-400'}`}></div>
                      <span className={`text-[7px] font-black uppercase tracking-widest ${cloudError ? 'text-amber-500' : isSyncing ? 'text-slate-400' : 'text-emerald-500'}`}>
                        {cloudError ? 'Offline Mode' : isSyncing ? 'Syncing...' : 'Online'}
                      </span>
                    </div>
                  </div>
                  <h1 className="text-xl font-black tracking-tight leading-none font-heading text-slate-900">ARHA<span className="text-indigo-600 ml-0.5">.</span></h1>
                </div>

                <div className="flex items-center gap-2">
                  <button onClick={handleGeneratePDF} className="w-10 h-10 flex items-center justify-center rounded-xl border border-slate-50 bg-white text-indigo-600 shadow-sm active:scale-95 transition-all">
                    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z"/><polyline points="14 2 14 8 20 8"/><path d="M12 18v-6"/><path d="m9 15 3 3 3-3"/></svg>
                  </button>
                  <button onClick={() => setShowFilterModal(true)} className={`w-10 h-10 flex items-center justify-center rounded-xl border transition-all shadow-sm ${showFilterModal ? 'bg-indigo-600 text-white border-indigo-600' : 'bg-white text-slate-500 border-slate-50'}`}>
                    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3"></polygon></svg>
                  </button>
                  <button onClick={() => { setEditingTransaction(null); setView('form'); }} className="flex items-center gap-1.5 px-4 py-2.5 bg-[#4f46e5] text-white rounded-xl font-bold text-[10px] uppercase tracking-wider shadow-lg active:scale-95 transition-all">
                    <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="4"><line x1="12" y1="5" x2="12" y2="19"></line><line x1="5" y1="12" x2="19" y2="12"></line></svg>
                    TAMBAH
                  </button>
                </div>
              </header>

              <div className="grid grid-cols-2 gap-3">
                <div className="bg-[#f8fafc]/50 p-3.5 rounded-2xl border border-slate-100 flex items-start gap-2.5">
                  <div className="p-1.5 bg-white rounded-lg text-slate-400 shadow-sm shrink-0">
                    <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                      <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
                      <circle cx="9" cy="7" r="4"></circle>
                      <path d="M23 21v-2a4 4 0 0 0-3-3.87"></path>
                      <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
                    </svg>
                  </div>
                  <div className="flex flex-col">
                    <span className="text-[7px] font-black text-slate-400 uppercase tracking-widest leading-none mb-1">WAJIB PAJAK</span>
                    <span className="text-sm font-black text-slate-800 leading-none">{filteredTransactions.length}</span>
                  </div>
                </div>
                <div className="bg-[#f5f7ff] p-3.5 rounded-2xl border border-indigo-50 flex items-start gap-2.5">
                  <div className="p-1.5 bg-white rounded-lg text-indigo-500 shadow-sm shrink-0"><svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><rect x="2" y="7" width="20" height="14" rx="2" ry="2"></rect><path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"></path></svg></div>
                  <div className="flex flex-col">
                    <span className="text-[7px] font-black text-indigo-400 uppercase tracking-widest leading-none mb-1">KEUNTUNGAN</span>
                    <span className="text-sm font-black text-indigo-600 leading-none"><span className="text-[10px] mr-0.5">Rp</span>{totalProfit.toLocaleString('id-ID')}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="flex-1 overflow-y-auto no-scrollbar pt-4 pb-20 px-4">
            <div className="max-w-4xl mx-auto">
              <TransactionList transactions={filteredTransactions} onDelete={(id) => { setIdToDelete(id); setShowDeleteModal(true); }} onEdit={(t) => { setEditingTransaction(t); setView('form'); }} />
            </div>
          </div>
        </div>
      ) : (
        <div className="max-w-xl mx-auto px-6 pt-10 pb-20">
          <header className="flex items-center gap-5 mb-10">
            <button onClick={() => { setView('list'); setEditingTransaction(null); }} className="w-12 h-12 bg-white rounded-full shadow-md border border-slate-100 flex items-center justify-center text-slate-800 active:scale-90 transition-all">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><line x1="19" y1="12" x2="5" y2="12"></line><polyline points="12 19 5 12 12 5"></polyline></svg>
            </button>
            <h2 className="text-xl font-black text-slate-900 tracking-tight">{editingTransaction ? 'Edit Transaksi' : 'Tambah Transaksi'}</h2>
          </header>
          <div className="bg-white rounded-[2rem] shadow-xl p-8">
            <TransactionForm onSave={handleSave} initialData={editingTransaction ? {
                tanggal: editingTransaction.tanggal, nopol: editingTransaction.nopol, namaWajibPajak: editingTransaction.namaWajibPajak, jenisTransaksi: editingTransaction.jenisTransaksi, uangDiterima: editingTransaction.uangDiterima.toString(), biayaProses: editingTransaction.biayaProses.toString(), keuntungan: editingTransaction.keuntungan.toString(), keterangan: editingTransaction.keterangan, diprosesOleh: editingTransaction.diprosesOleh
              } : undefined} 
            />
          </div>
        </div>
      )}
      <ConfirmationModal isOpen={showDeleteModal} onClose={() => setShowDeleteModal(false)} onConfirm={handleDelete} title="Hapus Data?" message="Data akan dihapus permanen dari HP dan Cloud." />
      <FilterModal isOpen={showFilterModal} onClose={() => setShowFilterModal(false)} filters={filters} setFilters={setFilters} onReset={() => setFilters({ month: new Date().getMonth(), year: new Date().getFullYear(), nopol: '', type: '' })} />
    </div>
  );
};
export default App;
