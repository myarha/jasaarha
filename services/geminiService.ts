import { GoogleGenAI } from "@google/genai";

export const getSmartGreeting = async (userName: string) => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: `Berikan sambutan hangat, profesional, dan sangat singkat untuk aplikasi "Jasa Arha". Sapa admin dengan ramah. Nama admin: ${userName}. Gunakan Bahasa Indonesia yang sopan.`,
    });
    return response.text || "Selamat datang kembali di Jasa Arha!";
  } catch (error) {
    console.error("Gemini Error:", error);
    return "Selamat datang di Jasa Arha Management Dashboard.";
  }
};

export const getFinancialAdvice = async (totalRevenue: number, totalExpenses: number) => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: `Ringkas performa keuangan berikut dalam 1 kalimat menyemangati: Pendapatan Kotor: Rp ${totalRevenue}, Biaya Operasional: Rp ${totalExpenses}. Berikan insight singkat dalam Bahasa Indonesia.`,
    });
    return response.text || "Terus pantau transaksi Anda untuk pertumbuhan bisnis.";
  } catch (error) {
    return "Rekapitulasi data berhasil dilakukan.";
  }
};