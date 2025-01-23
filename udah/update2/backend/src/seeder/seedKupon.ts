import Kupon from "../models/Kupon";
import mongoose from "mongoose";

const kuponData = [
  {
    _id: 1,
    nama: "Diskon 30%",
    diskon: 30,
    min_pembelian: 80000,
    exp_date: "2024-12-27",
    pengguna: [],
  },
  {
    _id: 2,
    nama: "Diskon 20%",
    diskon: 20,
    min_pembelian: 50000,
    exp_date: "2023-12-15",
    pengguna: [],
  },
  {
    _id: 3,
    nama: "Diskon 40%",
    diskon: 40,
    min_pembelian: 120000,
    exp_date: "2025-02-02",
    pengguna: [],
  },
  {
    _id: 4,
    nama: "Diskon 45%",
    diskon: 45,
    min_pembelian: 350000,
    exp_date: "2025-02-09",
    pengguna: [],
  },
  {
    _id: 5,
    nama: "Diskon 45%",
    diskon: 45,
    min_pembelian: 50000,
    exp_date: "2024-12-30",
    pengguna: [],
  },
  {
    _id: 6,
    nama: "Diskon 67%",
    diskon: 67,
    min_pembelian: 400000,
    exp_date: "2025-02-11",
    pengguna: [],
  },
];

const seedKupon = async () => {
  try {
    await Kupon.deleteMany({});
    console.log("Old Kupon data removed.");

    await Kupon.insertMany(kuponData);
    console.log("Kupon seeder completed successfully!");
  } catch (error) {
    console.error("Error while seeding Kupon:", error);
  } finally {
    // Close database connection
  }
};

export default seedKupon;
