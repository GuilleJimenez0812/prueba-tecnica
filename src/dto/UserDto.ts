export interface UserDto {
  _id: string
  username: string
  email: string
  password?: string
}

export interface LoggedUserDto extends UserDto {
  token: string
}