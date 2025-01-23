import mongoose from "mongoose";
import Barang from "../models/Barang";

const seedBarang = async () => {
  const barangData = [
    {
      _id: "BA01",
      nama: "Botol air",
      image: "http://localhost:3000/uploads/1733912730685-botolair.jpg",
      deskripsi: "Untuk mendaki gunung",
      id_jenis: 1,
      stok: 19,
      harga: 40000,
    },
    {
      _id: "HS01",
      nama: "Hand Sanitizer",
      image: "http://localhost:3000/uploads/1734031053953-handsanitizer.jpg",
      deskripsi: "Gunakan ini untuk mencuci tanganmu tanpa air dan sabun",
      id_jenis: 2,
      stok: 20,
      harga: 51000,
    },
    {
      _id: "TS01",
      nama: "Tong Sampah",
      image: "http://localhost:3000/uploads/1734031119614-tongsampah.jpg",
      deskripsi: "Untuk membuang sampah",
      id_jenis: 1,
      stok: 2,
      harga: 45000,
    },
    {
      _id: "BG01",
      nama: "Bedak Gatal",
      image: "http://localhost:3000/uploads/1734031192906-bedakgatal.jpg",
      deskripsi:
        "Solusi ketika gatal-gatal pada kulit, tapi hati2 tidak bagus untuk kulit sensitif",
      id_jenis: 5,
      stok: 6,
      harga: 36000,
    },
    {
      _id: "TM01",
      nama: "Tisu Muka",
      image: "http://localhost:3000/uploads/1734031283854-tisumuka.jpg",
      deskripsi:
        "Digunakan untuk me-ngelap muka, kotoran di wajah, meja dan dimana-mana",
      id_jenis: 8,
      stok: 19,
      harga: 25000,
    },
    {
      _id: "IG01",
      nama: "Indomie Goreng",
      image: "http://localhost:3000/uploads/IndomieGoreng80gr.png",
      deskripsi: "Mie instant murah dan lezat",
      id_jenis: 12,
      stok: 30,
      harga: 3000,
    },
    {
      _id: "RS01",
      nama: "Roti Sobek Rasa Cokelat",
      image: "http://localhost:3000/uploads/roti_sobek_cokelat.jpg",
      deskripsi: "Roti sobek rasa cokelat",
      id_jenis: 12,
      stok: 5,
      harga: 15000,
    },
    {
      _id: "BO01",
      nama: "Baby Oil",
      image: "http://localhost:3000/uploads/baby_oil.webp",
      deskripsi: "Botol minyak bayi 125ml",
      id_jenis: 5,
      stok: 5,
      harga: 29000,
    },
    {
      _id: "TM02",
      nama: "Teh manis",
      image: "http://localhost:3000/uploads/teh_manis.jpg",
      deskripsi: "Teh manis dingin segar",
      id_jenis: 2,
      stok: 50,
      harga: 4000,
    },
    {
      _id: "BT01",
      nama: "Buku tulis",
      image: "http://localhost:3000/uploads/buku_tulis.jpg",
      deskripsi: "Buku tulis hardcover kwarto garda 100 lembar",
      id_jenis: 6,
      stok: 10,
      harga: 14000,
    },
    {
      _id: "EK01",
      nama: "Es Krim",
      image: "http://localhost:3000/uploads/eskrim.jpg",
      deskripsi: "es krim dingin cocok untuk suasa panas",
      id_jenis: 12,
      stok: 10,
      harga: 8000,
    },
    {
      _id: "SU01",
      nama: "Susu",
      image: "http://localhost:3000/uploads/susu.jpg",
      deskripsi: "susu karton siap minum 1L",
      id_jenis: 2,
      stok: 2,
      harga: 18000,
    },
    {
      _id: "TO01",
      nama: "Topi",
      image: "http://localhost:3000/uploads/topi.webp",
      deskripsi: "Topi pria stylish",
      id_jenis: 7,
      stok: 3,
      harga: 44000,
    },
    {
      _id: "SO01",
      nama: "Soda",
      image: "http://localhost:3000/uploads/soda.jpg",
      deskripsi: "Soft drink segar 1 botol 500ml",
      id_jenis: 2,
      stok: 18,
      harga: 12000,
    },
    {
      _id: "KA01",
      nama: "Kardus",
      image: "http://localhost:3000/uploads/1734585192160-kardus.jpg",
      deskripsi: "Untuk bungkus barang dlm jumlah banyak",
      id_jenis: 9,
      stok: 13,
      harga: 20000,
    },
  ];

  try {
    // Remove old data from the 'Barang' collection
    await Barang.deleteMany({});
    console.log("Old barang data removed.");

    // Add new data
    await Barang.insertMany(barangData);
    console.log("Barang seeder completed successfully!");
  } catch (error) {
    console.error("Error while seeding Barang:", error);
  }
};

export default seedBarang;
