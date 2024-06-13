import mongoose from 'mongoose'

const ProductSchema = new mongoose.Schema({
  product_name: { type: String, required: true, unique: true},
  description: { type: String, required: true },
  price: { type: Number, required: true },
  availability: { type: Number, required: true, min: 0 },
})

export const ProductModel = mongoose.model('Product', ProductSchema)