import mongoose from "mongoose";
import Retailer from "../models/Retailer.js"; // ✅ Use relative path
import Connection from "../lib/db.js"; // ✅ Use relative path

// Retailer data to insert
const retailersData = [
  { product_id: "67cc62458377e4ffb34a340e", Retailer: "B" },
  { product_id: "67cc62458377e4ffb34a340f", Retailer: "B" },
  { product_id: "67cc62458377e4ffb34a3410", Retailer: "C" },
  { product_id: "67cc62458377e4ffb34a3411", Retailer: "A" },
  { product_id: "67cc62458377e4ffb34a3412", Retailer: "C" },
  { product_id: "67cc62458377e4ffb34a3413", Retailer: "B" },
  { product_id: "67cc62458377e4ffb34a3414", Retailer: "A" },
  { product_id: "67cc62458377e4ffb34a3415", Retailer: "C" },
  { product_id: "67cc62458377e4ffb34a3416", Retailer: "A" },
  { product_id: "67cc62458377e4ffb34a3417", Retailer: "C" },
  { product_id: "67cc62458377e4ffb34a3418", Retailer: "C" },
  { product_id: "67cc62458377e4ffb34a3419", Retailer: "B" },
  { product_id: "67cc62458377e4ffb34a341a", Retailer: "C" },
  { product_id: "67cc62458377e4ffb34a341b", Retailer: "A" },
  { product_id: "67cc62458377e4ffb34a341c", Retailer: "A" },
  { product_id: "67cc62458377e4ffb34a341d", Retailer: "B" },
  { product_id: "67cc62458377e4ffb34a341e", Retailer: "A" },
  { product_id: "67cc62458377e4ffb34a341f", Retailer: "B" },
  { product_id: "67cc62458377e4ffb34a3420", Retailer: "C" },
  { product_id: "67cc62458377e4ffb34a3421", Retailer: "C" },
  { product_id: "67cc62458377e4ffb34a3422", Retailer: "C" },
  { product_id: "67cc62458377e4ffb34a3423", Retailer: "A" },
  { product_id: "67cc62458377e4ffb34a3424", Retailer: "C" },
  { product_id: "67cc62458377e4ffb34a3425", Retailer: "C" },
  { product_id: "67cc62458377e4ffb34a3426", Retailer: "B" },
  { product_id: "67cc62458377e4ffb34a3427", Retailer: "B" },
  { product_id: "67cc62458377e4ffb34a3428", Retailer: "B" },
  { product_id: "67cc62458377e4ffb34a3429", Retailer: "A" },
  { product_id: "67cc62458377e4ffb34a342a", Retailer: "C" },
  { product_id: "67cc62458377e4ffb34a342b", Retailer: "B" },
  { product_id: "67cc62458377e4ffb34a342c", Retailer: "C" },
  { product_id: "67cc62458377e4ffb34a342d", Retailer: "B" },
  { product_id: "67cc62458377e4ffb34a342e", Retailer: "C" },
  { product_id: "67cc62458377e4ffb34a342f", Retailer: "B" },
  { product_id: "67cc62458377e4ffb34a3430", Retailer: "A" },
  { product_id: "67cc62458377e4ffb34a3431", Retailer: "C" },
  { product_id: "67cc62458377e4ffb34a3432", Retailer: "C" },
  { product_id: "67cc62458377e4ffb34a3433", Retailer: "A" },
  { product_id: "67cc62458377e4ffb34a3434", Retailer: "A" },
  { product_id: "67cc62458377e4ffb34a3435", Retailer: "C" },
  { product_id: "67cc62458377e4ffb34a3436", Retailer: "B" },
  { product_id: "67cc62458377e4ffb34a3437", Retailer: "A" },
  { product_id: "67cc62458377e4ffb34a3438", Retailer: "C" },
  { product_id: "67cc62458377e4ffb34a3439", Retailer: "C" },
  { product_id: "67cc62458377e4ffb34a343a", Retailer: "C" },
  { product_id: "67cc62458377e", Retailer: "C" },
];

// Function to insert data
const insertData = async () => {
  try {
    await Connection(); // Connect to MongoDB
    await Retailer.insertMany(retailersData);
    console.log("Data inserted successfully!");
  } catch (error) {
    console.error("Error inserting data:", error);
  } finally {
    mongoose.connection.close(); // Close connection after insertion
  }
};

// Run the function
insertData();
