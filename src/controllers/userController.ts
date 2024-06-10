import express from "express";
import { UserService } from '../services/userService'

export class UserController {
  private userService: UserService
  constructor() {
    this.userService = new UserService()
    this.getAllUsers = this.getAllUsers.bind(this)
    this.deleteUser = this.deleteUser.bind(this)
    this.updateUser = this.updateUser.bind(this)
  }

  async getAllUsers(req: express.Request, res: express.Response) {
    try {
      const users = await this.userService.getAllUsers()
      return res.status(200).json(users)
    } catch (err) {
      console.error(err)
      return res.status(400).json({ error: 'Failed to fetch users' })
    }
  }

  async deleteUser(req: express.Request, res: express.Response) {
    try {
      const { id } = req.params
      const deletedUser = await this.userService.removeUserById(id)
      if (!deletedUser) {
        return res.status(404).json({ error: 'User not found' })
      }
      return res.json(deletedUser)
    } catch (err) {
      console.error(err)
      return res.status(400).json({ error: 'Failed to delete user' })
    }
  }

  async updateUser(req: express.Request, res: express.Response) {
    try {
      const { id } = req.params
      const { username } = req.body

      if (!username) {
        return res.status(400).json({ error: 'Username is required' })
      }

      const user = await this.userService.findUserById(id)
      if (!user) {
        return res.status(404).json({ error: 'User not found' })
      }

      user.username = username
      await user.save()

      return res.status(200).json({ message: 'User updated successfully' })
    } catch (err) {
      console.error(err)
      return res.status(400).json({ error: 'Failed to update user' })
    }
  }
}