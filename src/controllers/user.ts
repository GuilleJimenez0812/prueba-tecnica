import express from 'express'
import { deleteuserById, getUserById, getUsers } from '../repository/user'

export const getAllUsers = async (req: express.Request, res: express.Response) => {
    try {
        const users = await getUsers()

        return res.status(200).json(users)
    } catch (err) {
        console.log(err)
        return res.sendStatus(400)
    }
}

export const deleteUser = async (req: express.Request, res: express.Response) => {
    try {
        const { id } = req.params

        const deletedUser = await deleteuserById(id)

        return res.json(deletedUser)
    } catch (err) {
        console.log(err)
        return res.sendStatus(400)
    }
}

export const updateUser = async (req: express.Request, res: express.Response) => {
    try {
        const { id } = req.params
        const { username } = req.body

        if (!username) {
            return res.sendStatus(400)
        }

        const user = await getUserById(id)

        user.username = username
        await user.save()

        return res.status(200)
    } catch (err) {
        console.log(err)
        return res.sendStatus(400)
    }
}