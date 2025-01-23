import mongoose from "mongoose";
import Transaction from "../models/Transaction";

const seedTransactions = async () => {
  const transactionData = [
    {
      _id: 1,
      id_user: 2,
      username: "paul777",
      subtotal: 321000,
      payment_method: "qris",
      date_of_buy: new Date("2024-12-24T03:33:28+0700"),
      barang: [
        {
          id: "HS01",
          jumlah: 1,
          harga: 51000,
          _id: "6769c91950c9c2a4c525520b",
        },
        {
          id: "TS01",
          jumlah: 6,
          harga: 45000,
          _id: "6769c91950c9c2a4c525520c",
        },
      ],
    },
    {
      _id: 2,
      id_user: 2,
      username: "paul777",
      subtotal: 81000,
      payment_method: "qris",
      date_of_buy: new Date("2024-12-24T04:03:23+0700"),
      barang: [
        {
          id: "TS01",
          jumlah: 1,
          harga: 45000,
          _id: "6769d01bc8df5f44c3d0695d",
        },
        {
          id: "BG01",
          jumlah: 1,
          harga: 36000,
          _id: "6769d01bc8df5f44c3d0695e",
        },
      ],
    },
    {
      _id: 3,
      id_user: 3,
      username: "agoy",
      subtotal: 108000,
      payment_method: "qris",
      date_of_buy: new Date("2024-12-24T12:05:04+0700"),
      barang: [
        {
          id: "BG01",
          jumlah: 3,
          harga: 36000,
          _id: "676a4101ab4129004c6296b2",
        },
      ],
    },
    {
      _id: 4,
      id_user: 1,
      username: "Rio Fahmi",
      subtotal: 40000,
      payment_method: "qris",
      date_of_buy: new Date("2025-01-09T19:45:35+0700"),
      barang: [
        {
          id: "BA01",
          jumlah: 1,
          harga: 40000,
          _id: "677fc4f00078912f2f9786c2",
        },
      ],
    },
    {
      _id: 5,
      id_user: 3,
      username: "agoy",
      subtotal: 111000,
      payment_method: "cash",
      date_of_buy: new Date("2025-01-09T20:03:01+0700"),
      barang: [
        {
          id: "HS01",
          jumlah: 1,
          harga: 51000,
          _id: "677fc9068e7804020d37c3ab",
        },
        {
          id: "KA01",
          jumlah: 3,
          harga: 20000,
          _id: "677fc9068e7804020d37c3ac",
        },
      ],
    },
    {
      _id: 6,
      id_user: 4,
      username: "Mili",
      subtotal: 16000,
      payment_method: "qris",
      date_of_buy: new Date("2025-01-10T06:59:21+0700"),
      barang: [
        { id: "EK01", jumlah: 2, harga: 8000, _id: "678062dafbe3ef1de987f84c" },
      ],
    },
    {
      _id: 7,
      id_user: 1,
      username: "don quixote",
      subtotal: 126000,
      payment_method: "qris",
      date_of_buy: new Date("2025-01-10T09:35:56+0700"),
      barang: [
        {
          id: "BT01",
          jumlah: 3,
          harga: 42000,
          _id: "6780878dfbe3ef1de987f8ea",
        },
      ],
    },
  ];

  try {
    await Transaction.deleteMany({});
    console.log("Old transactions removed.");

    await Transaction.insertMany(transactionData);
    console.log("Transactions seeder completed successfully!");
  } catch (error) {
    console.error("Error while seeding transactions:", error);
  } finally {
    mongoose.connection.close();
  }
};

export default seedTransactions;
