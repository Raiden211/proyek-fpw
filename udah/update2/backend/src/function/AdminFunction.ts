import Barang, { IBarang } from "../models/Barang";
import Jenis, { IJenis } from "../models/Jenis";
import Kupon, { IKupon } from "../models/Kupon";
import Users, { IUser } from "../models/Users";
import Transaction from "../models/Transaction";
import midtransClient from "midtrans-client";
import Cart, { ICartItem } from "../models/Cart";
import AdminTransaction from "../models/AdminTransaction";
import { Request, Response } from "express";
import fs from "fs";
import path from "path";
import bcrypt from "bcrypt";

const myKey = "";

interface RegisterBody {
  username: string;
  first_name: string;
  last_name: string;
  email: string;
  password: string;
  confirm_password: string;
}

interface BarangBody {
  nama: String;
  deskripsi: String;
  id_jenis: Number;
  stok: Number;
  harga: Number;
}

interface KuponBody {
  id: number;
  diskon: number;
  min_pembelian: number;
  exp_date: string;
  pengguna: number[];
}

interface JenisBody {
  id: number;
  nama: string;
}

interface CartBody {
  id_user: number;
  jumlah: number;
}

const addBarang = async (
  req: Request<{}, {}, BarangBody>,
  res: Response
): Promise<void> => {
  try {
    const { nama, deskripsi, id_jenis, stok, harga } = req.body;
    const { id: id_user } = (req as Request & { user: { id: number } }).user;
    const imagePath = req.file?.path;
    if (!imagePath) {
      res.status(400).json({ message: "Image is required" });
      return;
    }

    const image = `${req.protocol}://${req.get("host")}/uploads/${path.basename(
      imagePath
    )}`;

    const words = nama.split(" ").filter((word) => word.length > 0); // Hilangkan spasi kosong

    let prefix = "";
    if (words.length === 1) {
      prefix = words[0].substring(0, 2).toUpperCase(); // apa -> ap
    } else {
      prefix = words
        .slice(0, 2)
        .map((word) => word[0].toUpperCase())
        .join(""); // apa apa -> aa
    }

    const carijenis = await Jenis.findOne({ _id: id_jenis });

    if (!carijenis) {
      res.status(404).json({ message: "Jenisnya apa?" });
      return;
    }

    const cariUsers = await Users.findOne({ _id: id_user });

    if (!cariUsers) {
      res.status(404).json({ message: "Usernya mana?" });
      return;
    }

    console.log("Extracted User ID:", id_user);
    console.log("Extracted User ID:", cariUsers);

    let id = 1;
    let paddingLength = id >= 10 ? 1 : 2;

    let kode = `${prefix}${id.toString().padStart(paddingLength, "0")}`;
    let cek = await Barang.findOne({ _id: kode });

    while (cek) {
      id++;
      paddingLength = id >= 10 ? 1 : 2;
      kode = `${prefix}${id.toString().padStart(paddingLength, "0")}`;
      cek = await Barang.findOne({ _id: kode }); // hs01 -> hs02 dst
    }

    const newBarang = new Barang({
        _id: kode,
        nama,
        image,
        deskripsi,
        id_jenis,
        id_user: cariUsers._id,
        stok,
        harga,
        reviews: [],
    });

    await newBarang.save();
    res
      .status(201)
      .json({ message: "Barang added successfully", barang: newBarang });
  } catch (error) {
    res.status(500).json({ message: error });
  }
};

const editBarang = async (
  req: Request<{ id: string }, {}, BarangBody>,
  res: Response
): Promise<void> => {
  try {
    const { id } = req.params;
    const { nama, deskripsi, id_jenis, stok, harga } = req.body;
    const newImagePath = req.file?.path;

    const barang = await Barang.findOne({ _id: id });
    if (!barang) {
      res.status(404).json({ message: "Barang tidak ditemukan" });
      return;
    }

    if (id_jenis) {
      const jenis = await Jenis.findOne({ _id: id_jenis });
      if (!jenis) {
        res.status(404).json({ message: "Jenis tidak ditemukan" });
        return;
      }
    }

    if (stok) {
      const stokNumber = Number(stok);
      const barangStokNumber = Number(barang.stok);

      if (isNaN(stokNumber) || isNaN(barangStokNumber)) {
        res.status(400).json({ message: "Invalid stock values" });
        return;
      }

      if (stokNumber < 1) {
        res.status(400).json({ message: "stok tidak boleh dibawah 1" });
        return;
      }

      if (stokNumber < barangStokNumber) {
        res
          .status(400)
          .json({ message: "Stok tidak boleh kurang dari stok sebelumnya" });
        return;
      }
    }

    if (harga) {
      const price = Number(harga);

      if (price < 1000) {
        res.status(400).json({ message: "harga tidak boleh dibawah 0" });
        return;
      }
    }

    if (newImagePath && barang.image) {
      const oldImageName = barang.image.split("/").pop();
      const oldImagePath = path.join(
        __dirname,
        "../uploads",
        oldImageName || ""
      );
      if (fs.existsSync(oldImagePath)) {
        fs.unlinkSync(oldImagePath);
      } else {
        console.warn(`File lama ${oldImagePath} tidak ditemukan.`);
      }
    }

    const updatedBarang = await Barang.findByIdAndUpdate(
      id,
      {
        nama,
        deskripsi,
        id_jenis,
        stok,
        harga,
        image: newImagePath
          ? `http://localhost:3000/uploads/${newImagePath.split("/").pop()}`
          : barang.image,
      },
      { new: true }
    );

    res
      .status(200)
      .json({ message: "Barang berhasil diupdate", data: updatedBarang });
  } catch (error) {
    res.status(500).json(error);
  }
};

const deleteBarang = async (
  req: Request<{ id: string }>,
  res: Response
): Promise<void> => {
  try {
    const { id } = req.params;

    const response = await Barang.findOne({ _id: id });

    if (!response) {
      res.status(404).json({ message: "G ada barangnya" });
      return;
    }

    const cartWithBarang = await Cart.findOne({ "cart.id_barang": id });

    if (cartWithBarang) {
      res.status(400).json({
        message: "Barang tidak dapat dihapus karena ada di dalam keranjang",
      });
      return;
    }

    // Hapus file jika ada
    // if (response.image) {
    //     const fileName = response.image.split("/").pop();
    //     const imagePath = path.join(__dirname, "../uploads", fileName || "");

    //     if (fs.existsSync(imagePath)) {
    //         fs.unlinkSync(imagePath);
    //     } else {
    //         console.warn(`File ${imagePath} tidak ditemukan.`);
    //     }
    // }

    // Hapus dokumen dari database
    await Barang.deleteOne({ _id: id });

    res.status(200).json({ message: "Barang dihapus" });
  } catch (error) {
    res.status(500).json(error);
  }
};

const createKupon = async (
  req: Request<{}, {}, KuponBody>,
  res: Response
): Promise<void> => {
  try {
    const { diskon, min_pembelian, exp_date } = req.body;

    const kuponCount = await Kupon.countDocuments();
    const id = kuponCount + 1;

    const generateNama = `Diskon ${diskon}%`;

    const kuponBaru: IKupon = new Kupon({
      _id: id,
      nama: generateNama,
      diskon,
      min_pembelian,
      exp_date,
      pengguna: [],
    });

    const kupon = await kuponBaru.save();
    res.status(201).json({ message: "Kupon berhasil dibuat", kupon });
  } catch (error) {
    console.error("Error creating Kupon:", error); // Log the error for debugging
    res
      .status(500)
      .json({ message: "An error occurred while creating the Kupon", error });
  }
};

const createJenis = async (
  req: Request<{}, {}, JenisBody>,
  res: Response
): Promise<void> => {
  try {
    const nama = req.body.nama;

    const cariNama = await Jenis.find({ nama: nama });

    if (cariNama.length > 0) {
      res.status(400).send({ message: "Jenis ini sudah ada :)" });
      return;
    }

    const generateId = await Jenis.countDocuments();
    const idGenerated = generateId + 1;

    await Jenis.create({ _id: idGenerated, nama });

    res.status(201).json({ message: "Berhasil membuat jenis" });
  } catch (error) {
    console.error("Error creating Kupon:", error); // Log the error for debugging
    res
      .status(500)
      .json({ message: "An error occurred while creating the Kupon", error });
  }
};

const addAnotherAdmin = async (
  req: Request<{}, {}, RegisterBody>,
  res: Response
): Promise<void> => {
  try {
    const {
      username,
      first_name,
      last_name,
      email,
      password,
      confirm_password,
    } = req.body;

    // Check if username already exists
    const searchUsername = await Users.findOne({ username: username });
    if (searchUsername) {
      res.status(400).json({ message: "Username sudah ada" });
      return;
    }

    // Check if email already exists
    const searchEmail = await Users.findOne({ email: email });
    if (searchEmail) {
      res.status(400).json({ message: "Email sudah ada" });
      return;
    }

    // Count total users to determine the next ID
    const userCount = await Users.countDocuments();
    const id = userCount + 1;

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create a new admin user
    const userBaru: IUser = new Users({
      _id: id,
      username,
      first_name,
      last_name,
      email,
      password: hashedPassword,
      saldo: 0,
      role: 1, // Default role for admin
    });

    // Save the user to the database
    const saveData = await userBaru.save();

    res.status(201).json({
      message: "Register successful",
      data: {
        id: saveData._id,
        username: saveData.username,
        first_name: saveData.first_name,
        last_name: saveData.last_name,
        email: saveData.email,
        role: saveData.role,
      },
    });
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ message: "An error occurred while creating data", error });
  }
};

const showReport = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id: id_user } = (req as Request & { user: { id: number } }).user;

    // Query all transactions
    const transactions = await Transaction.find()
      .populate({
        path: "barang.id",
        model: "Barang",
        select: "nama deskripsi harga",
      })
      .lean();

    if (!transactions || transactions.length === 0) {
      res.status(404).json({ message: "No transactions found" });
      return;
    }

    // Format the data for report and recalculate the subtotal for each transaction
    const report = transactions.map((transaction: any) => {
      // Recalculate subtotal for each item based on jumlah * harga
      const items = transaction.barang.map((item: any) => {
        const itemSubtotal = item.jumlah * item.harga; // calculate subtotal for each item
        return {
          id_barang: item.id._id,
          nama: item.id.nama,
          deskripsi: item.id.deskripsi,
          total_quantity: item.jumlah,
          subtotal_price: itemSubtotal,
        };
      });

      // Calculate the overall subtotal for the transaction
      const transactionSubtotal = items.reduce(
        (total: number, item: any) => total + item.subtotal_price,
        0
      );

      // Return the transaction details along with the recalculated subtotal
      return {
        transaction_id: transaction._id,
        username: transaction.username,
        payment_method: transaction.payment_method,
        date_of_buy: transaction.date_of_buy,
        subtotal: transactionSubtotal, // updated subtotal
        items: items,
      };
    });

    // Summarize the report by combining items with the same id_barang
    const summarizedReport = report.flatMap((transaction: any) =>
      transaction.items.map((item: any) => {
        return {
          id_barang: item.id_barang,
          nama: item.nama,
          deskripsi: item.deskripsi,
          total_quantity: item.total_quantity,
          subtotal_price: item.subtotal_price,
        };
      })
    );

    // Reduce to summarize the quantities and prices for the same item
    const finalReport = summarizedReport.reduce((acc: any, curr: any) => {
      const existingItem = acc.find(
        (item: any) => item.id_barang === curr.id_barang
      );
      if (existingItem) {
        existingItem.total_quantity += curr.total_quantity;
        existingItem.subtotal_price += curr.subtotal_price;
      } else {
        acc.push(curr);
      }
      return acc;
    }, []);

    res.status(200).json(finalReport);
  } catch (error) {
    res.status(500).json({ error: (error as Error).message });
  }
};

export default {
  addBarang,
  editBarang,
  deleteBarang,
  createKupon,
  createJenis,
  addAnotherAdmin,
  showReport
};
