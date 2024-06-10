import mongoose from 'mongoose'

const ProductSchema = new mongoose.Schema({
  product_name: { type: String, required: true },
  description: { type: String, required: true },
  price: { type: Number, required: true },
  availability: { type: Number, required: true },
})

export const ProductModel = mongoose.model('Product', ProductSchema)