import mongoose from "mongoose";
import dotenv from 'dotenv';

dotenv.config();

const connectionString = process.env.MONGO_URI;

export const connectToDatabase = async () => {
  try {
    await mongoose.connect(connectionString);
    console.log('Connected to MongoDB successfully');
  } catch (err) {
    console.error('Connection failed', err);
  }
};

