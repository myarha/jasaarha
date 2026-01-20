
import React, { useState, useEffect } from 'react';
import { FormState, TransactionType } from '../types';
import Input from './Input';

interface TransactionFormProps {
  onSave: (data: FormState) => Promise<void>;
  initialData?: FormState;
}

const TransactionForm: React.FC<TransactionFormProps> = ({ onSave, initialData }) => {
  const [formData, setFormData] = useState<FormState>(initialData || {
    tanggal: new Date().toISOString().split('T')[0],
    nopol: '',
    namaWajibPajak: '',
    jenisTransaksi: '',
    uangDiterima: '',
    biayaProses: '',
    keuntungan: '0',
    keterangan: '',
    diprosesOleh: ''
  });

  const [errors, setErrors] = useState<Partial<Record<keyof FormState, string>>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (initialData) setFormData(initialData);
  }, [initialData]);

  const parseAngka = (val: string) => val.replace(/\D/g, '');
  
  const formatRibuan = (val: string) => {
    const digits = parseAngka(val);
    return digits ? new Intl.NumberFormat('id-ID').format(parseInt(digits)) : '';
  };

  useEffect(() => {
    const uang = parseFloat(parseAngka(formData.uangDiterima)) || 0;
    const biaya = parseFloat(parseAngka(formData.biayaProses)) || 0;
    setFormData(prev => ({ ...prev, keuntungan: (uang - biaya).toString() }));
  }, [formData.uangDiterima, formData.biayaProses]);

  const validate = (): boolean => {
    const newErrors: Partial<Record<keyof FormState, string>> = {};
    
    if (!formData.tanggal) newErrors.tanggal = 'PILIH TANGGAL TRANSAKSI';
    if (!formData.nopol.trim()) newErrors.nopol = 'HARAP MASUKKAN NOMOR POLISI';
    if (!formData.namaWajibPajak.trim()) newErrors.namaWajibPajak = 'NAMA PEMILIK HARUS DIISI';
    if (!formData.jenisTransaksi) newErrors.jenisTransaksi = 'SILAKAN PILIH JENIS LAYANAN';
    if (!formData.uangDiterima || parseInt(parseAngka(formData.uangDiterima)) <= 0) newErrors.uangDiterima = 'MASUKKAN NOMINAL PEMBAYARAN';
    if (!formData.biayaProses === undefined || formData.biayaProses === '') newErrors.biayaProses = 'BIAYA PROSES TIDAK BOLEH KOSONG';
    if (!formData.diprosesOleh.trim()) newErrors.diprosesOleh = 'NAMA PETUGAS WAJIB DIISI';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (validate() && !isSubmitting) {
      setIsSubmitting(true);
      try {
        await onSave({
          ...formData,
          uangDiterima: parseAngka(formData.uangDiterima),
          biayaProses: parseAngka(formData.biayaProses)
        });
      } finally {
        setIsSubmitting(false);
      }
    }
  };

  const handleInputChange = (field: keyof FormState, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => {
        const newErrs = { ...prev };
        delete newErrs[field];
        return newErrs;
      });
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <div className="flex flex-col gap-1.5">
        <label className="text-[14px] font-bold text-slate-700 ml-1 uppercase tracking-tight">Tanggal Transaksi</label>
        <input 
          type="date" 
          value={formData.tanggal} 
          onChange={(e) => handleInputChange('tanggal', e.target.value)}
          className={`w-full px-4 py-3.5 bg-white border rounded-xl font-medium text-slate-600 outline-none transition-colors ${errors.tanggal ? 'border-red-400 bg-red-50' : 'border-slate-200 focus:border-indigo-400'}`}
        />
        {errors.tanggal && <span className="text-[11px] text-red-500 font-bold ml-1 uppercase tracking-wider">{errors.tanggal}</span>}
      </div>

      <Input 
        label="Nomor Polisi" 
        placeholder="CONTOH: DK 1234 ABC" 
        value={formData.nopol} 
        error={errors.nopol} 
        onChange={(e) => handleInputChange('nopol', e.target.value.toUpperCase())} 
      />
      
      <Input 
        label="Nama Wajib Pajak" 
        placeholder="NAMA SESUAI STNK / KTP" 
        value={formData.namaWajibPajak} 
        error={errors.namaWajibPajak} 
        onChange={(e) => handleInputChange('namaWajibPajak', e.target.value.toUpperCase())} 
      />

      <div className="flex flex-col gap-1.5">
        <label className="text-[14px] font-bold text-slate-700 ml-1 uppercase tracking-tight">Jenis Layanan</label>
        <div className="relative">
          <select 
            value={formData.jenisTransaksi} 
            onChange={(e) => handleInputChange('jenisTransaksi', e.target.value)}
            className={`w-full px-4 py-3.5 bg-white border rounded-xl font-bold text-slate-700 outline-none appearance-none transition-colors ${errors.jenisTransaksi ? 'border-red-400 bg-red-50' : 'border-slate-200 focus:border-indigo-400'}`}
          >
            <option value="">-- PILIH JENIS LAYANAN --</option>
            {Object.values(TransactionType).map(type => <option key={type} value={type}>{type.toUpperCase()}</option>)}
          </select>
          <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400">
            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><polyline points="6 9 12 15 18 9"></polyline></svg>
          </div>
        </div>
        {errors.jenisTransaksi && <span className="text-[11px] text-red-500 font-bold ml-1 uppercase tracking-wider">{errors.jenisTransaksi}</span>}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Input 
          label="Uang Diterima" 
          placeholder="NOMINAL DARI KONSUMEN"
          inputMode="numeric" 
          value={formatRibuan(formData.uangDiterima)} 
          error={errors.uangDiterima} 
          onChange={(e) => handleInputChange('uangDiterima', e.target.value)} 
        />
        <Input 
          label="Biaya Proses" 
          placeholder="BIAYA OPERASIONAL"
          inputMode="numeric" 
          value={formatRibuan(formData.biayaProses)} 
          error={errors.biayaProses} 
          onChange={(e) => handleInputChange('biayaProses', e.target.value)} 
        />
      </div>

      <div className="flex flex-col gap-1.5">
        <label className="text-[14px] font-bold text-slate-700 ml-1 tracking-tight">Estimasi Keuntungan</label>
        <div className="w-full px-5 py-4 bg-indigo-50/50 border border-indigo-100 rounded-xl font-black text-indigo-600 text-xl shadow-inner">
          <span className="text-sm mr-1 opacity-60">Rp</span>
          {formatRibuan(formData.keuntungan) || '0'}
        </div>
      </div>

      <Input 
        label="Diproses Oleh" 
        placeholder="NAMA ADMIN / PETUGAS" 
        value={formData.diprosesOleh} 
        error={errors.diprosesOleh} 
        onChange={(e) => handleInputChange('diprosesOleh', e.target.value.toUpperCase())} 
      />
      
      <Input 
        label="Catatan / Keterangan" 
        placeholder="TAMBAHKAN CATATAN (OPSIONAL)" 
        value={formData.keterangan} 
        error={errors.keterangan} 
        onChange={(e) => handleInputChange('keterangan', e.target.value.toUpperCase())} 
      />

      <button 
        type="submit" 
        disabled={isSubmitting}
        className={`w-full py-4 text-white font-black rounded-xl shadow-lg transition-all flex items-center justify-center gap-3 uppercase tracking-[0.2em] text-[12px] mt-8 ${isSubmitting ? 'bg-indigo-400 cursor-not-allowed shadow-none scale-95' : 'bg-[#4f46e5] shadow-indigo-100 active:scale-[0.98] hover:bg-indigo-700'}`}
      >
        {isSubmitting ? (
          <>
            <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
            MENYIMPAN...
          </>
        ) : (
          'SIMPAN TRANSAKSI'
        )}
      </button>
    </form>
  );
};

export default TransactionForm;
