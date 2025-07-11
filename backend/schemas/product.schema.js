import mongoose from 'mongoose';

const ProductSchema = new mongoose.Schema({
  id: { type: Number, required: true, unique: true },
  name: String,
  brand: String,
  image: String,
  rating: Number,
  price: Number,
  quantity: Number,
  category: String
});

export default ProductSchema;
