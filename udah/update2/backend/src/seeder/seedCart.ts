import mongoose from "mongoose";
import Cart from "../models/Cart";

const seedCart = async () => {
  const cartData = [
    {
      _id: 1,
      id_user: 2,
      cart: [
        {
          id_barang: "HS01",
          jumlah: 1,
          total: 51000,
          _id: "676ced433ea10580d861c4eb",
        },
      ],
      subtotal: 51000,
    },
  ];

  try {
    await Cart.deleteMany({});
    console.log("Old data removed");
    await Cart.insertMany(cartData);
    console.log("Seeder successfully inserted");
  } catch (error) {
    console.error("Error while seeding Cart:", error);
  }
};

export default seedCart;
