import mongoose from 'mongoose';
import dotenv from 'dotenv';
import ProductModel from '../models/product.model.js';
import productData from '../data/productData.json' assert { type: "json" };
import connectDB from '../config/db.js';

dotenv.config();

// Connect to MongoDB and seed
connectDB().then(seedProducts);

async function seedProducts() {
  try {
    await ProductModel.deleteMany({});
    const products = Object.values(productData).flat();
    await ProductModel.insertMany(products);
    console.log('Products have been seeded successfully');
  } catch (error) {
    console.error('Error seeding products:', error);
  } finally {
    mongoose.connection.close();
  }
}
