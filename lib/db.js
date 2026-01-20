import mongoose from "mongoose";

const MONGODB_URI = process.env.MONGODB_URI;

// Use a global cache so hot reload / lambda reuse works
let cached = global.mongoose;

if (!cached) {
  cached = global.mongoose = { conn: null, promise: null };
}

export async function connectToDB() {
  // ✅ Move env check INSIDE the function (runtime only)
  if (!MONGODB_URI) {
    throw new Error("❌ MONGODB_URI is not defined (runtime error)");
  }

  if (cached.conn) {
    console.log("✅ Using cached MongoDB connection");
    return cached.conn;
  }

  if (!cached.promise) {
    console.log("🔌 Connecting to MongoDB...");
    cached.promise = mongoose
      .connect(MONGODB_URI, { bufferCommands: false })
      .then((mongoose) => {
        console.log("✅ MongoDB connection established");
        return mongoose;
      });
  }

  cached.conn = await cached.promise;
  return cached.conn;
}
