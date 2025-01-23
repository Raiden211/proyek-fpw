import mongoose from "mongoose";
import Jenis from "../models/Jenis";

const seedJenis = async () => {
  const jenisData = [
    { _id: 1, nama: "Plastik" },
    { _id: 2, nama: "Cairan" },
    { _id: 3, nama: "Alat Tulis" },
    { _id: 4, nama: "Kaca" },
    { _id: 5, nama: "Alat Kesehatan" },
    { _id: 6, nama: "Kertas" },
    { _id: 7, nama: "Aksesori" },
    { _id: 8, nama: "Perlengkapan harian" },
    { _id: 9, nama: "Karton" },
    { _id: 10, nama: "Daur ulang" },
    { _id: 11, nama: "Kimia" },
    { _id: 12, nama: "Makanan" },
  ];

  try {
    // Hapus semua data lama di koleksi 'Jenis'
    await Jenis.deleteMany({});
    console.log("Old data removed.");

    // Tambahkan data baru
    await Jenis.insertMany(jenisData);
    console.log("Seeder completed successfully!");
  } catch (error) {
    console.error("Error while seeding Jenis:", error);
  } finally {
    // Tutup koneksi database
  }
};

export default seedJenis;
