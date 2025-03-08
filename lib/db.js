import mongoose from "mongoose";

const Connection = async () => {
  try {
    await mongoose.connect(
      "mongodb+srv://quicksort:newquicksort@quicksort.1bv5w.mongodb.net/?retryWrites=true&w=majority&appName=quicksort"
    );

    console.log("Connected to MongoDB");
  } catch (error) {
    console.error(error);
  }
};

export default Connection;
