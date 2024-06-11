export interface OrderDto {
  _id: string
  product_id: string[]
  user_id: string
  quantity: number[]
  status: 'validating order' | 'order sent' | 'order received' | 'canceled'
}
