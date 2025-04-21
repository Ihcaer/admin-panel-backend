import mongoose from "mongoose";

const dbUri: string = String(process.env.DB_URI);

const connectDB = async () => {
   try {
      await mongoose.connect(dbUri);
      console.log('Connected to MongoDB');
   } catch (error) {
      console.error('Connection error', error);
   }
};

export default connectDB;