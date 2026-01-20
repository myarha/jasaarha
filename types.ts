
export enum TransactionType {
  PENGESAHAN = 'Pengesahan',
  GANTI_STNK = 'Ganti STNK',
  BALIK_NAMA = 'Balik Nama',
  MUTASI = 'Mutasi'
}
export interface Transaction {
  id: string;
  tanggal: string;
  nopol: string;
  namaWajibPajak: string;
  jenisTransaksi: TransactionType;
  uangDiterima: number;
  biayaProses: number;
  keuntungan: number;
  keterangan: string;
  diprosesOleh: string;
  timestamp: number;
}
export interface FormState {
  tanggal: string;
  nopol: string;
  namaWajibPajak: string;
  jenisTransaksi: string;
  uangDiterima: string;
  biayaProses: string;
  keuntungan: string;
  keterangan: string;
  diprosesOleh: string;
}
