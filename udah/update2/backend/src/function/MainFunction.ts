import { Request, Response } from "express";
import Users, { IUser } from "../models/Users";
import Barang, { IBarang } from "../models/Barang";
import Kupon from "../models/Kupon";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import Jenis from "../models/Jenis";
import Transaction from "../models/Transaction";
const JWT_KEY = "TOKOSERBAADA";

interface RegisterBody {
  username: string;
  first_name: string;
  last_name: string;
  email: string;
  password: string;
  confirm_password: string;
}

interface LoginBody {
  username: string;
  password: string;
}

const doRegister = async (
  req: Request<{}, {}, RegisterBody>,
  res: Response
): Promise<void> => {
  const { username, first_name, last_name, email, password } = req.body;

  try {
    // Check if username already exists
    const userAda = await Users.findOne({ username });
    if (userAda) {
      res.status(400).json({ message: "Username sudah ada" });
      return;
    }

    // Check if email already exists
    const emailAda = await Users.findOne({ email });
    if (emailAda) {
      res.status(400).json({ message: "Email sudah ada" });
      return;
    }

    // Count total users to determine the next ID
    const userCount = await Users.countDocuments();
    const id = userCount + 1;

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create a new user
    const userBaru: IUser = new Users({
      _id: id,
      username,
      first_name,
      last_name,
      email,
      password: hashedPassword,
      saldo: 0,
      role: 2,
    });

    // Save the user to the database
    await userBaru.save();

    res.status(201).json({
      message: "Register successful",
    });
  } catch (error) {
    res.status(500).json({ error: (error as Error).message });
  }
};

const doLogin = async (
  req: Request<{}, {}, LoginBody>,
  res: Response
): Promise<void> => {
  const { username, password } = req.body;

  try {
    const cekuser = await Users.findOne({ username });
    if (!cekuser) {
      res.status(404).json({ message: "Usernya tidak ada" });
      return;
    }

    const isPasswordValid = await bcrypt.compare(password, cekuser.password);

    if (!isPasswordValid) {
      res.status(400).json({ message: "Password salah" });
      return;
    }

    const token = jwt.sign(
      { id: cekuser._id, username, role: cekuser.role },
      JWT_KEY,
      { expiresIn: "2h" }
    );

    const currUser = {
      id: cekuser._id,
      username,
      role: cekuser.role,
      saldo: cekuser.saldo,
    };

    res.status(200).json({ message: "Login succesful", currUser, token });
  } catch (error) {
    console.error("Error during login:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

const getUsername = async (req: Request, res: Response): Promise<void> => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader) {
      res.status(401).json({ message: "Authorization missing" });
      return;
    }

    const token = authHeader.split(" ")[1];
    const decoded = jwt.verify(token, JWT_KEY) as {
      id: number;
      username: string;
      role: number;
    };
    console.log(decoded);

    res.status(200).json({
      id: decoded.id,
      username: decoded.username,
      role: decoded.role,
    });
  } catch (error: any) {
    if (error.name === "TokenExpiredError") {
      res.status(401).json({ message: "JWT expired" });
      return;
    }
    res.status(401).json({ message: "Invalid token" });
  }
};

const showAllUsers = async (req: Request, res: Response): Promise<void> => {
  try {
    const users = await Users.find();
    res.status(200).json(users);
  } catch (error) {
    res.status(500).json({ message: error });
  }
};

const showAllBarang = async (req: Request, res: Response): Promise<void> => {
  try {
    const barangs = await Barang.find(); // Find all barang

    // Fetch each barang's jenis
    const barangWithJenis = await Promise.all(
      barangs.map(async (barang) => {
        const jenis = await Jenis.findOne({ _id: barang.id_jenis });
        return {
          id: barang._id,
          nama: barang.nama,
          image: barang.image,
          deskripsi: barang.deskripsi,
          jenis: jenis?.nama || "Tidak ada jenis",
          id_user: barang.id_user,
          stok: barang.stok,
          harga: barang.harga,
        };
      })
    );

    res.status(200).json(barangWithJenis);
  } catch (error) {
    res.status(500).json({ message: error });
  }
};

const showActiveKupon = async (
  req: Request<{}, {}, {}>,
  res: Response
): Promise<void> => {
  try {
    const today = new Date().toISOString().split("T")[0];
    const activeKupons = await Kupon.find({
      exp_date: { $gte: today },
    });

    res.status(200).json(activeKupons);
  } catch (error) {
    res.status(500).json({ error: (error as Error).message });
  }
};

const showABarang = async (
  req: Request<{ id: string }, {}, {}>,
  res: Response
): Promise<void> => {
  const id = req.params.id;

  try {
    // Cari barang berdasarkan ID
    const barang = await Barang.findOne({ _id: id });

    if (!barang) {
      res.status(404).json({ message: "Barang tidak ditemukan" });
      return;
    }

    // Cari jenis barang berdasarkan id_jenis
    const jenis = await Jenis.findOne({ _id: barang.id_jenis });

    if (!jenis) {
      res.status(404).json({ message: "Jenis tidak ditemukan" });
      return;
    }

    // Cari username berdasarkan id_user
    const user = await Users.findOne({ _id: barang.id_user });

    const username = user ? user.username : "Tidak diketahui";

    // Berikan response
    res.status(200).json({
      id: barang._id,
      nama: barang.nama,
      image: barang.image,
      deskripsi: barang.deskripsi,
      jenis: jenis.nama, // Asumsi field nama ada di Jenis
      id_user: barang.id_user,
      stok: barang.stok,
      harga: barang.harga,
      rating: barang.rating, // Virtual field rating
      reviews: barang.reviews, // Semua ulasan
      username, // Hanya username
    });
  } catch (error) {
    res.status(500).json({ message: (error as Error).message });
  }
};

const showAllJenis = async (req: Request, res: Response): Promise<void> => {
  try {
    const response = await Jenis.find();

    const formattedResponse = response.map((item) => ({
      id: item._id,
      name: item.nama,
    }));

    res.status(200).json(formattedResponse);
  } catch (error) {
    res.status(500).json({ message: error });
  }
};

const showKupon = async (
  req: Request<{}, {}, {}>,
  res: Response
): Promise<void> => {
  try {
    const kupon = await Kupon.find();
    res.status(200).json(kupon);
  } catch (error) {
    res.status(500).json({ message: error });
  }
};

const showTransaction = async (req: Request, res: Response): Promise<void> => {
  try {
    // Ambil semua transaksi
    const transactions = await Transaction.find();

    // Hasil akhir dengan mapping nama barang
    const result = [];

    // Iterasi transaksi satu per satu
    for (const transaction of transactions) {
      const barangWithNames = [];

      // Iterasi barang di dalam transaksi
      for (const item of transaction.barang) {
        // Cari barang berdasarkan id di koleksi Barang
        const barang = await Barang.findOne({ _id: item.id });

        // Tambahkan data barang dengan nama ke array baru
        barangWithNames.push({
          jumlah: item.jumlah,
          harga: item.harga,
          nama: barang ? barang.nama : "Nama tidak ditemukan", // Ambil nama jika ditemukan
        });
      }

      // Buat salinan transaksi dengan barang yang sudah dimapping
      result.push({
        _id: transaction._id,
        id_user: transaction.id_user,
        username: transaction.username,
        subtotal: transaction.subtotal,
        payment_method: transaction.payment_method,
        date_of_buy: transaction.date_of_buy,
        barang: barangWithNames,
        id: transaction.id,
      });
    }

    // Kembalikan hasil
    res.status(200).json(result);
  } catch (error) {
    const errorMessage = (error as Error).message || "Terjadi kesalahan";
    res.status(500).json({ message: errorMessage });
  }
};

export default {
  doRegister,
  doLogin,
  getUsername,
  showAllUsers,
  showAllBarang,
  showABarang,
  showAllJenis,
  showKupon,
  showTransaction,
  showActiveKupon,
};
