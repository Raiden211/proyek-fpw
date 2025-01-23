import Barang, { IBarang } from "../models/Barang";
import Jenis, { IJenis } from "../models/Jenis";
import Kupon, { IKupon } from "../models/Kupon";
import { Request, Response } from "express";
import path from "path";
import bcrypt from "bcrypt";
import multer from "multer";
import Users from "../models/Users";
import Transaction from "../models/Transaction";
import midtransClient from "midtrans-client";
import Cart, { ICartItem } from "../models/Cart";

interface CartBody {
  id_user: number;
  jumlah: number;
}
const upload = multer();
const myKey = "SB-Mid-server-1RvUeJgceFjMIkFdbkGJ6MN1";

const addReview = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id: id_user } = (req as Request & { user: { id: string } }).user;
    const { id: id_barang } = req.params;
    const { review, rating } = req.body;

    // Validate input
    if (rating < 0 || rating > 5) {
      res.status(400).json({ message: "Rating must be between 0 and 5." });
      return;
    }

    // Find the barang (item) by its ID
    const barang = await Barang.findOne({ _id: id_barang });

    if (!barang) {
      res.status(404).json({ message: "Barang not found." });
      return;
    }

    if (!Array.isArray(barang.reviews)) {
      barang.reviews = [];
    }

    // Generate a new ID for the review
    const newReviewId =
      barang.reviews.length > 0
        ? barang.reviews[barang.reviews.length - 1].id + 1
        : 1;

    const newReview = {
      id: newReviewId,
      id_user: parseInt(id_user),
      review,
      rating,
    };

    barang.reviews.push(newReview);

    await barang.save();

    res.status(200).json({
      message: "Review added successfully.",
      data: {
        barang: {
          ...barang.toObject(),
          rating: barang.rating, // Include the virtual field explicitly if needed
        },
      },
    });
  } catch (error) {
    // Handle unexpected errors
    res.status(500).json({ error: (error as Error).message });
  }
};

const deleteReview = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id: id_user } = (req as Request & { user: { id: string } }).user;
    const { id_barang, id_review } = req.params;

    // Cari barang yang memiliki review dengan id yang sesuai
    const barang = await Barang.findOne({ _id: id_barang });

    if (!barang) {
      res.status(404).json({ message: "Review not found" });
      return;
    }

    // Cek apakah review dimiliki oleh pengguna saat ini
    const review = barang.reviews.find((r) => r.id === parseInt(id_review));
    if (!review || review.id_user !== parseInt(id_user)) {
      res.status(403).json({ message: "Not authorized to delete this review" });
      return;
    }

    // Hapus review dari array menggunakan $pull
    await Barang.updateOne(
      { "reviews.id": id_review },
      { $pull: { reviews: { id: id_review } } }
    );

    res.status(200).json({ message: "Review deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: (error as Error).message });
  }
};

const addToCart = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id: id_user } = (req as Request & { user: { id: number } }).user;

    const { id_barang, jumlah } = req.body;

    const barang = await Barang.findOne({ _id: id_barang });

    if (!barang) {
      res.status(404).json({ message: "Barang tidak ditemukan" });
      return;
    }

    if (barang.stok < jumlah) {
      res.status(400).json({ message: "Stok barang tidak cukup" });
      return;
    }

    const total = barang.harga * jumlah;

    let cart = await Cart.findOne({ id_user });

    if (cart) {
      const itemIndex = cart.cart.findIndex(
        (item) => item.id_barang === id_barang
      );

      if (itemIndex > -1) {
        cart.cart[itemIndex].jumlah =
          Number(cart.cart[itemIndex].jumlah) + Number(jumlah);
        cart.cart[itemIndex].total = cart.cart[itemIndex].jumlah * barang.harga;
      } else {
        cart.cart.push({ id_barang, jumlah: Number(jumlah), total });
      }

      cart.subtotal = cart.cart.reduce((acc, item) => acc + item.total, 0);
    } else {
      let count = await Cart.countDocuments();
      let uniqueId = count + 1;

      // Pastikan `_id` unik
      while (await Cart.findOne({ _id: uniqueId })) {
        uniqueId++;
      }

      cart = new Cart({
        _id: uniqueId,
        id_user,
        cart: [{ id_barang, jumlah, total }],
        subtotal: total,
      });
    }

    await cart.save();

    barang.stok -= jumlah;
    await barang.save();

    res
      .status(200)
      .json({ message: "Barang berhasil ditambahkan ke keranjang", cart });
  } catch (error) {
    res.status(500).json({ error: (error as Error).message });
  }
};

const showCart = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id: id_user } = (req as Request & { user: { id: number } }).user;

    // Query data cart
    const cart = await Cart.findOne({ id_user })
      .populate({
        path: "cart.id_barang", // Referensi ke model Barang
        model: "Barang",
        select: "_id id_barang nama image deskripsi harga", // Pastikan _id disertakan
      })
      .lean();

    if (!cart) {
      res.status(404).json({ message: "Cart not found" });
      return;
    }

    // Strukturkan ulang data sesuai dengan kebutuhan
    const responseCart = {
      _id: cart._id,
      id_user: cart.id_user,
      cart: cart.cart.map((item: any) => ({
        id_barang: item.id_barang._id, // _id MongoDB asli untuk barang
        barang: {
          nama: item.id_barang.nama,
          image: item.id_barang.image,
          deskripsi: item.id_barang.deskripsi,
          harga: item.id_barang.harga,
        },
        jumlah: item.jumlah,
        total: item.total,
      })),
      subtotal: cart.subtotal,
    };

    res.status(200).json(responseCart);
  } catch (error) {
    res.status(500).json({ error: (error as Error).message });
  }
};

const editCart = async (req: Request, res: Response): Promise<void> => {
  try {
    // Extract the user ID and item data from the request
    const { id: id_user } = (req as Request & { user: { id: number } }).user;
    const { id_barang, action } = req.body;

    const cart = await Cart.findOne({ id_user });
    if (!cart) {
      res.status(404).json({ error: "Cart not found" });
      return;
    }

    // Find the item in the cart
    const cartItemIndex = cart.cart.findIndex(
      (item) => item.id_barang === id_barang
    );

    if (cartItemIndex === -1) {
      res.status(404).json({ error: "Item not found in cart" });
      return;
    }

    const cartItem = cart.cart[cartItemIndex];

    // Fetch the original item details from the Barang collection
    const barang = await Barang.findOne({ _id: id_barang });
    if (!barang) {
      res.status(404).json({ error: "Barang not found" });
      return;
    }

    if (action === "increase") {
      cartItem.jumlah += 1;
    } else if (action === "decrease") {
      if (cartItem.jumlah > 1) {
        cartItem.jumlah -= 1;
      } else {
        res.status(400).json({ error: "Minimum quantity reached" });
        return;
      }
    } else if (action === "delete") {
      cart.cart.splice(cartItemIndex, 1); // Remove the item from the cart
    } else {
      res.status(400).json({ error: "Invalid action" });
      return;
    }

    // Recalculate the total price for the item using the original price
    if (action !== "delete") {
      cartItem.total = cartItem.jumlah * barang.harga;
    }

    // Recalculate the subtotal for the cart
    cart.subtotal = cart.cart.reduce((sum, item) => sum + item.total, 0);

    await cart.save();

    res.status(200).json({ message: "Cart updated successfully", cart });
  } catch (error) {
    res.status(500).json({ error: (error as Error).message });
  }
};

const checkoutCart = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id: id_user } = (req as Request & { user: { id: number } }).user;
    const { id_cart, payment_method, coupon_id } = req.body;

    const cart = await Cart.findOne({ _id: id_cart, id_user });
    if (!cart) {
      res.status(404).json({ status: "error", message: "Cart not found" });
      return;
    }

    const cartItems = cart?.cart || [];
    const subtotal = cart?.subtotal || 0;

    const calculatedSubtotal = cartItems.reduce(
      (sum: number, item: any) => sum + item.total,
      0
    );
    if (calculatedSubtotal !== subtotal) {
      res.status(400).json({
        status: "error",
        message: `Calculated subtotal (${calculatedSubtotal}) does not match the provided subtotal (${subtotal})`,
      });
      return;
    }

    let kupon = null;
    if (coupon_id) {
      kupon = await Kupon.findOne({ _id: coupon_id });
      if (!kupon) {
        res.status(404).json({ status: "error", message: "Coupon not found" });
        return;
      }

      const today = new Date();
      const expDate = new Date(kupon.exp_date);
      if (expDate < today) {
        res
          .status(400)
          .json({ status: "error", message: "Coupon has expired" });
        return;
      }

      if (kupon.pengguna.includes(id_user)) {
        res.status(400).json({
          status: "error",
          message: "You have already used this coupon",
        });
        return;
      }

      if (subtotal < kupon.min_pembelian) {
        res.status(400).json({
          status: "error",
          message: `Minimum purchase for this coupon is Rp${kupon.min_pembelian.toLocaleString()}`,
        });
        return;
      }

      const discount = (subtotal * kupon.diskon) / 100;
      const adjustedSubtotal = subtotal - discount;
      cart.subtotal = adjustedSubtotal;
    }

    const user = await Users.findOne({ _id: id_user });
    if (!user) {
      res.status(404).json({ status: "error", message: "User not found" });
      return;
    }

    const username = user.username;
    const date_of_buy = new Date();

    const midtrans = new midtransClient.Snap({
      isProduction: false,
      serverKey: myKey,
    });

    const itemDetails = cartItems.map((item: any) => ({
      id: item.id_barang,
      price: item.total / item.jumlah,
      quantity: item.jumlah,
      name: item.barang?.nama || item.id_barang,
    }));

    const calculatedGrossAmount = itemDetails.reduce(
      (sum: number, item: any) => sum + item.price * item.quantity,
      0
    );

    const transactionDetails = {
      order_id: `ORDER-${new Date().getTime()}`,
      gross_amount: calculatedGrossAmount,
    };

    const customerDetails = { first_name: username };

    const midtransTransactionData = {
      transaction_details: transactionDetails,
      customer_details: customerDetails,
      item_details: itemDetails,
    };

    const paymentResponse = await midtrans.createTransaction(
      midtransTransactionData
    );

    const transactionCount = await Transaction.countDocuments();
    const newTransactionId = transactionCount + 1;

    const transaction = new Transaction({
      _id: newTransactionId,
      id_user,
      username,
      subtotal: cart.subtotal,
      payment_method,
      date_of_buy,
      barang: cartItems.map((item: any) => ({
        id: item.id_barang,
        jumlah: item.jumlah,
        harga: item.total,
      })),
      midtrans_transaction_id: paymentResponse.transaction_id,
      payment_url: paymentResponse.redirect_url,
    });

    await transaction.save();

    if (kupon && coupon_id) {
      kupon.pengguna.push(id_user);
      await kupon.save();
    }

    await Cart.deleteMany({ id_user });

    res.json({
      status: "success",
      message: "Transaction created successfully",
      payment_url: paymentResponse.redirect_url,
    });
  } catch (error) {
    console.error("Error during checkout:", error);
    const errorMessage =
      error instanceof Error ? error.message : "Something went wrong";
    res.status(500).json({ status: "error", message: errorMessage });
  }
};

const showMyTrans = async (req: Request, res: Response): Promise<void> => {
  try {
    // Extract the user's ID from the authenticated request
    const { id: id_user } = (req as Request & { user: { id: number } }).user;

    // Query the database to find all transactions for the user
    const transactions = await Transaction.find({ id_user }).sort({
      date_of_buy: -1,
    });

    // Check if there are no transactions
    if (!transactions || transactions.length === 0) {
      res.status(404).json({
        status: "error",
        message: "No transactions found for this user.",
      });
      return;
    }

    // Enhance transaction items by fetching detailed information from the Barang collection
    const enhancedTransactions = await Promise.all(
      transactions.map(async (transaction) => {
        const enhancedBarang = await Promise.all(
          transaction.barang.map(async (item: any) => {
            const barangDetails = await Barang.findOne({ _id: item.id }); // Find the item in the Barang collection
            return {
              _id: barangDetails?._id || null,
              nama: barangDetails?.nama || "Unknown",
              image: barangDetails?.image || null,
              deskripsi: barangDetails?.deskripsi || "No description available",
              jumlah: item.jumlah, // Include the original jumlah from the transaction
            };
          })
        );

        return {
          ...transaction.toObject(),
          barang: enhancedBarang, // Replace original barang with enhanced data
        };
      })
    );

    // Respond with the enhanced list of transactions
    res.status(200).json({
      status: "success",
      message: "Transactions retrieved successfully.",
      transactions: enhancedTransactions,
    });
  } catch (error) {
    console.error("Error fetching transactions:", error);
    res.status(500).json({
      status: "error",
      message:
        error instanceof Error
          ? error.message
          : "An unexpected error occurred.",
    });
  }
};

const topupSaldo = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id: id_user } = (req as Request & { user: { id: number } }).user; // Extract user ID from the authenticated request
    const { amount } = req.body; // Extract the top-up amount from the request body

    // Validate the amount
    if (!amount || isNaN(amount) || amount <= 0) {
      res.status(400).json({ message: "Invalid top-up amount." });
      return;
    }

    // Find the user by ID
    const user = await Users.findOne({ _id: id_user });

    if (!user) {
      res.status(404).json({ message: "User not found." });
      return;
    }

    // Update the user's saldo
    user.saldo += parseFloat(amount); // Add the top-up amount to the current saldo
    await user.save(); // Save the updated user document

    // Return the updated saldo in the response
    res.status(200).json({ saldo: user.saldo, message: "Topup successful!" });
  } catch (error) {
    res.status(500).json({ error: (error as Error).message });
  }
};

const getCurrentSaldo = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id: id_user } = (req as Request & { user: { id: number } }).user;

    const user = await Users.findOne({ _id: id_user });

    if (!user) {
      res.status(404).json({ message: "User not found." });
      return;
    }

    res.status(200).json({ saldo: user.saldo });
  } catch (error) {
    res.status(500).json({ error: (error as Error).message });
  }
};

const getUserDetails = async (req: Request, res: Response): Promise<void> => {
  try {
    // Extract the user's ID from the authenticated request
    const { id: id_user } = (req as Request & { user: { id: number } }).user;

    // Query the database to find the user's details
    const userDetails = await Users.findOne(
      { _id: id_user },
      {
        _id: 1,
        username: 1,
        first_name: 1,
        last_name: 1,
        email: 1,
        password: 1,
      } // Select only necessary fields
    );

    // Check if the user was not found
    if (!userDetails) {
      res.status(404).json({
        status: "error",
        message: "User details not found.",
      });
      return;
    }

    // Respond with the user details
    res.status(200).json({
      status: "success",
      message: "User details retrieved successfully.",
      user: userDetails,
    });
  } catch (error) {
    console.error("Error fetching user details:", error);
    res.status(500).json({
      status: "error",
      message:
        error instanceof Error
          ? error.message
          : "An unexpected error occurred.",
    });
  }
};

const updatePassword = async (req: Request, res: Response): Promise<void> => {
  try {
    // Extract the user ID from the authenticated request
    const { id: userId } = (req as Request & { user: { id: number } }).user;

    // Extract the new password and confirm password from the form-data
    const { newPassword, confirmPassword } = req.body;

    // Debug the request body
    console.log("Request Body:", req.body);

    // Validate that the new password and confirm password match
    if (newPassword !== confirmPassword) {
      res.status(400).json({ message: "Passwords do not match." });
      return;
    }

    // Ensure newPassword is provided
    if (!newPassword) {
      res.status(400).json({ message: "New password is required." });
      return;
    }

    // Find the user by ID
    const user = await Users.findById(userId);
    if (!user) {
      res.status(404).json({ message: "User not found." });
      return;
    }

    // Hash the new password
    const hashedPassword = await bcrypt.hash(newPassword, 10); // Ensure newPassword is a valid string

    // Update the password
    user.password = hashedPassword;
    await user.save();

    res.status(200).json({ message: "Password updated successfully." });
  } catch (error) {
    console.error("Error updating password:", error);
    res.status(500).json({
      message:
        error instanceof Error
          ? error.message
          : "An unexpected error occurred.",
    });
  }
};

export default {
  addReview,
  addToCart,
  showCart,
  editCart,
  checkoutCart,
  showMyTrans,
  topupSaldo,
  getCurrentSaldo,
  deleteReview,
  getUserDetails,
  updatePassword,
};
