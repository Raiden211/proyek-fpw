import mongoose from "mongoose";
import seedJenis from "./seedJenis";
import seedUsers from "./seedUsers";
import seedBarang from "./seedBarang";
import seedKupon from "./seedKupon";
import seedCart from "./seedCart";
import seedTransaction from "./seedTransaction";
import seedAdminTransaction from "./seedAdminTransaction";

const seedDatabase = async () => {
  try {
    // Connect to MongoDB
    await mongoose.connect("mongodb://localhost:27017/toserbafpw");
    console.log("Database connected successfully.");

    console.log("Seeding Admin Transaction...");
    await seedAdminTransaction();

    // Execute seeders
    console.log("Seeding Jenis...");
    await seedJenis();

    console.log("Seeding Users...");
    await seedUsers();

    console.log("Seeding Barang...");
    await seedBarang();

    console.log("Seeding Kupon...");
    await seedKupon();

    console.log("Seeding Cart...");
    await seedCart();

    console.log("Seeding Transaction...");
    await seedTransaction();

    console.log("All seeders executed successfully!");
  } catch (error) {
    console.error("Error during seeding process:", error);
  } finally {
    mongoose.connection.close();
    console.log("Database connection closed.");
  }
};

seedDatabase();
