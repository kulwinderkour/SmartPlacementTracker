// ==================================================
// DATABASE CONNECTION FILE
// ==================================================
// This file handles connecting our app to MongoDB database

import mongoose from 'mongoose';
import process from 'process';

// Function to connect to MongoDB
export const connectDB = async () => {
  try {
    // mongoose.connect() connects to MongoDB
    // process.env.MONGODB_URI gets the connection string from .env file
    const conn = await mongoose.connect(process.env.MONGODB_URI);

    // If connection successful, print success message
    console.log(`✅ MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    // If connection fails, print error and exit
    console.error(`❌ Error: ${error.message}`);
    process.exit(1); // Exit with failure code
  }
};
export default connectDB;