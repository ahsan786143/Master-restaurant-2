import mongoose from "mongoose";

const connectToDatabase = async () => {
  if (mongoose.connection.readyState >= 1) {
    console.log("Already connected to MongoDB");
    return mongoose.connection;
  }

  const mongoURI = process.env.MONGODB_URI || "mongodb://localhost:27017/dfc-app";

  try {
    await mongoose.connect(mongoURI, {
      dbName: "food-delivery",
    });

    console.log("Connected to MongoDB successfully");
    return mongoose.connection;
  } catch (error) {
    console.error(" Error connecting to MongoDB:", error.message);
    throw new Error("Database connection failed");
  }
};

export default connectToDatabase;
