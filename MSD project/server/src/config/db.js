import mongoose from 'mongoose';

const { MONGODB_URI = 'mongodb://127.0.0.1:27017/preorder' } = process.env;

let isConnected = false;

export const connectDB = async () => {
  if (isConnected) return mongoose.connection;

  try {
    mongoose.set('strictQuery', false);
    await mongoose.connect(MONGODB_URI, {
      dbName: process.env.MONGODB_DB || undefined,
    });
    isConnected = true;
    // eslint-disable-next-line no-console
    console.log('✅ MongoDB connected');
    return mongoose.connection;
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error('❌ MongoDB connection error:', error.message);
    throw error;
  }
};

export default connectDB;
