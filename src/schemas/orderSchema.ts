import mongoose from 'mongoose'

const OrderSchema = new mongoose.Schema({
  product_id: [{ type: String, required: true }],
  user_id: { type: String, required: true },
  quantity: [{ type: Number, required: true, min: 1 }],
  status: {
    type: String,
    required: true,
    enum: ['validating order', 'order sent', 'order received', 'canceled'],
  },
})

export const OrderModel = mongoose.model('Order', OrderSchema)