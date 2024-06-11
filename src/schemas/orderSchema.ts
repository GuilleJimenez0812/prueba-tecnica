import mongoose from 'mongoose'

const OrderSchema = new mongoose.Schema({
  product_id: [
    {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: 'Product',
    },
  ],
  user_id: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: 'User',
  },
  quantity: [{ type: Number, required: true, min: 1 }],
  status: {
    type: String,
    required: true,
    enum: ['validating order', 'order sent', 'order received', 'canceled'],
  },
  issueDate: { type: Date, required: true },
  end_date: { type: String, required: false}
})

export const OrderModel = mongoose.model('Order', OrderSchema)
