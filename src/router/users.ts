import express from 'express'
import { deleteUser, getAllUsers, updateUser } from '../controllers/user'
import { isOwner, verify } from '../middlewares'

export default (router: express.Router) => {
    router.get('/users', verify, getAllUsers)
    router.delete('users/:id', verify, isOwner, deleteUser)
    router.patch('/users/:id', verify, isOwner, updateUser)
}