import mongoose from "mongoose";
import Users from "../models/Users";

const seedUsers = async () => {
  const userData = [
    {
      _id: 1,
      username: "serlok",
      password: "$2b$10$ol5WfL7z16cfz5P/xcrX6eqgFlUoHAhjXVdzWGT/EwBlTvRsjpi4.",
      role: 1,
    },
    {
      _id: 2,
      username: "paul777",
      password: "$2b$10$tm92DCjy9.izllzFYHZ2de4iO5NM1KeupyLaSTYx4QEYwF7mNOOPK",
      role: 2,
    },
    {
      _id: 3,
      username: "agoy",
      password: "$2b$10$fC/PXU4V9doJ7DlD3hu9duLlJREfxLK0ruaIAMnR8LtESjhl3ehle",
      role: 2,
    },
    {
      _id: 4,
      username: "Mili",
      password: "$2b$10$2ERjJgM9WDSTLQVdDf5y9eOLL3W9eKw0JUUohL7hnABlvUm1FETay",
      role: 2,
    },
    {
      _id: 5,
      username: "Atlas",
      password: "$2b$10$Urohni2Mvl3ekNjvBo3f4e4FU3kJ20sKdhMHBEWPpt5QePVkAqjDC",
      role: 2,
    },
  ];

  try {
    await Users.deleteMany({});
    console.log("Old user data removed.");

    await Users.insertMany(userData);
    console.log("User seeder completed successfully!");
  } catch (error) {
    console.error("Error while seeding Users:", error);
  } finally {
    // Close database connection
  }
};

export default seedUsers;
