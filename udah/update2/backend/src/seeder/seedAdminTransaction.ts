import mongoose from "mongoose";
import AdminTransaction from "../models/AdminTransaction";

const seedAdminTransaction = async () => {
  const adminTransactionData = [
    {
      _id: 1,
      id_admin: 1,
      barang: [
        {
          id: "BA01",
          nama: "Botol air",
          image: "http://localhost:3000/uploads/1733912730685-botolair.jpg",
          deskripsi: "Untuk mendaki gunung",
          jumlah_beli: 1,
          total: 40000,
          _id: "678088705313da621a880360",
        },
      ],
      users: [
        {
          first_name: "Rio",
          last_name: "Fahmi",
          email: "riof@gmail.com",
          _id: "678088705313da621a880361",
        },
      ],
      subtotal: 40000,
      pay_method: "qris",
      date_of_buy: new Date(
        "Fri Jan 10 2025 09:39:44 GMT+0700 (Western Indonesia Time)"
      ),
    },
    {
      _id: 2,
      id_admin: 1,
      barang: [
        {
          id: "BT01",
          nama: "Buku tulis",
          image: "http://localhost:3000/uploads/buku_tulis.jpg",
          deskripsi: "Buku tulis hardcover kwarto garda 100 lembar",
          jumlah_beli: 3,
          total: 42000,
          _id: "67808c42790d44604fa19efd",
        },
      ],
      users: [
        {
          first_name: "don",
          last_name: "quixote",
          email: "dq123@gmail.com",
          _id: "67808c42790d44604fa19efe",
        },
      ],
      subtotal: 42000,
      pay_method: "cash",
      date_of_buy: new Date(
        "Fri Jan 10 2025 09:56:02 GMT+0700 (Western Indonesia Time)"
      ),
    },
  ];

  try {
    await AdminTransaction.deleteMany({});
    console.log("Old AdminTransaction data removed.");
    await AdminTransaction.insertMany(adminTransactionData);
    console.log("AdminTransaction seeder completed successfully!");
  } catch (error) {
    console.error("Error while seeding AdminTransaction:", error);
  }
};

export default seedAdminTransaction;
