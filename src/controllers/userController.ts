import express from 'express'
import { UserService } from '../services/userService'
import { UserDto } from '../dto/UserDto'
import { CustomRequest } from '../dto/Request'

export class UserController {
  private userService: UserService
  constructor() {
    this.userService = new UserService()
    this.getAllUsers = this.getAllUsers.bind(this)
    this.deleteUser = this.deleteUser.bind(this)
    this.updateUser = this.updateUser.bind(this)
  }

  async getAllUsers(req: CustomRequest, res: express.Response) {
    try {
      const page = parseInt(req.query.page as string) || 1
      const limit = parseInt(req.query.limit as string) || 10
      const users: UserDto[] = await this.userService.getAllUsers(page, limit)
      return res.status(200).json(users)
    } catch (err) {
      console.error(err)
      return res.status(400).json({ error: 'Failed to fetch users' })
    }
  }

  async deleteUser(req: CustomRequest, res: express.Response) {
    try {
      const { id } = req.params
      const deletedUser: UserDto = await this.userService.removeUserById(id)
      if (!deletedUser) {
        return res.status(404).json({ error: 'User not found' })
      }
      return res.json(deletedUser)
    } catch (err) {
      console.error(err)
      return res.status(400).json({ error: 'Failed to delete user' })
    }
  }

  async updateUser(req: CustomRequest, res: express.Response) {
    try {
      const { id } = req.params
      const updateValues = req.body

      const updatedUser: UserDto = await this.userService.updateUserDetails(id, updateValues)
      if (!updatedUser) {
        return res.status(404).json({ error: 'User not found' })
      }

      return res.status(200).json(updatedUser)
    } catch (err) {
      console.error(err)
      return res.status(400).json({ error: 'Failed to update user' })
    }
  }
}
