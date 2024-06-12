import { ProductDto } from "./ProductDto"
import { UserDto } from "./UserDto"

export interface OrderDto {
  _id: string
  products: ProductDto[]
  user: UserDto
  quantity: number[]
  status: 'validating order' | 'order sent' | 'order received' | 'canceled'
}
