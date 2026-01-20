
import { Transaction } from '../types';

const firebaseConfig = {
  apiKey: "AIzaSyA3SS2vL2rhZd1WUQ1Ali2IBP1TWbi6dBs",
  authDomain: "jasa-arha-db.firebaseapp.com",
  projectId: "jasa-arha-db",
  storageBucket: "jasa-arha-db.firebasestorage.app",
  messagingSenderId: "313316006955",
  appId: "1:313316006955:web:cd7b3206bae1410a209e6e",
  measurementId: "G-M9T03PH4SS"
};

const DB_KEY = 'jasa-arha-db-v1';

export const dbService = {
  async getFirestoreDB() {
    try {
      const { initializeApp, getApps } = await import("https://www.gstatic.com/firebasejs/10.8.0/firebase-app.js");
      const { getFirestore } = await import("https://www.gstatic.com/firebasejs/10.8.0/firebase-firestore.js");
      
      const apps = (getApps as any)().filter((a: any) => a.name === '[DEFAULT]');
      const app = apps.length === 0 ? (initializeApp as any)(firebaseConfig) : apps[0];
      return (getFirestore as any)(app);
    } catch (error) {
      console.error("Firebase Init Error:", error);
      throw error;
    }
  },

  async getAllTransactions(): Promise<Transaction[]> {
    const localData = localStorage.getItem(DB_KEY);
    const cached = localData ? JSON.parse(localData) : [];

    try {
      const db = await this.getFirestoreDB();
      const { collection, getDocs, query, orderBy, limit } = await import("https://www.gstatic.com/firebasejs/10.8.0/firebase-firestore.js");
      
      // Test koneksi dengan query ringan
      const q = (query as any)((collection as any)(db, "transactions"), (orderBy as any)("timestamp", "desc"), (limit as any)(500));
      const querySnapshot = await (getDocs as any)(q);
      
      const transactions: Transaction[] = [];
      querySnapshot.forEach((doc: any) => {
        transactions.push({ id: doc.id, ...doc.data() } as Transaction);
      });

      if (transactions.length > 0) {
        localStorage.setItem(DB_KEY, JSON.stringify(transactions));
        return transactions;
      }
      return cached;
    } catch (error: any) {
      console.warn("Koneksi Cloud Gagal:", error.message);
      if (error.message?.includes('permission-denied') || error.message?.includes('not-found')) {
        throw new Error('API_NOT_ENABLED');
      }
      return cached;
    }
  },

  async saveTransaction(transaction: Transaction): Promise<void> {
    const localData = localStorage.getItem(DB_KEY);
    const transactions = localData ? JSON.parse(localData) : [];
    const existingIndex = transactions.findIndex((t: any) => t.id === transaction.id);
    
    if (existingIndex > -1) {
      transactions[existingIndex] = transaction;
    } else {
      transactions.unshift(transaction);
    }
    localStorage.setItem(DB_KEY, JSON.stringify(transactions));

    try {
      const db = await this.getFirestoreDB();
      const { doc, setDoc } = await import("https://www.gstatic.com/firebasejs/10.8.0/firebase-firestore.js");
      await (setDoc as any)((doc as any)(db, "transactions", transaction.id), transaction);
    } catch (error: any) {
      console.error("Gagal Sinkron ke Cloud:", error.message);
      if (error.message?.includes('permission-denied')) {
        throw new Error('API_NOT_ENABLED');
      }
    }
  },

  async deleteTransaction(id: string): Promise<void> {
    const localData = localStorage.getItem(DB_KEY);
    const transactions = localData ? JSON.parse(localData) : [];
    const filtered = transactions.filter((t: any) => t.id !== id);
    localStorage.setItem(DB_KEY, JSON.stringify(filtered));

    try {
      const db = await this.getFirestoreDB();
      const { doc, deleteDoc } = await import("https://www.gstatic.com/firebasejs/10.8.0/firebase-firestore.js");
      await (deleteDoc as any)((doc as any)(db, "transactions", id));
    } catch (error) {
      console.error("Gagal Hapus di Cloud.");
    }
  }
};
