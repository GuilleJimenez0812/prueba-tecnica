import express from 'express'
import { UserService } from '../services/userService'
import { UserDto } from '../dto/UserDto'
import { CustomRequest } from '../dto/Request'

export class UserController {
  constructor(private userService: UserService = new UserService()) {
    this.userService = userService
    this.getAllUsers = this.getAllUsers.bind(this)
    this.deleteUser = this.deleteUser.bind(this)
    this.updateUser = this.updateUser.bind(this)
  }

  /**
   * Controller that retrieves a list of all users in the system.
   * @param req The request object. It may contain query parameters to filter or sort the user list.
   * @param res The response object. Used to send the retrieved list of users back to the client.
   * @returns void
   */
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

  /**
   * Deletes a user from the system based on the provided user ID.
   * @param req The request object, containing the user ID in the route parameters.
   * @param res The response object, used to send back the result of the delete operation.
   * @returns void
   */
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

  /**
   * Updates the details of an existing user. The user ID is provided in the route parameters.
   * @param req The request object, containing the user ID in the route parameters and the update values in the body.
   * @param res The response object, used to send back the updated user details or an error message.
   * @returns void
   */
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
