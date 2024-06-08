import { createUser, getUserByEmail } from "../repository/user"
import express from "express"
import { authentication, random } from "../helpers"
import jwt from 'jsonwebtoken'
import bcryptjs from 'bcryptjs'
import { JWT_EXPIRES, JWT_SECRET } from "../congif"

export const login = async (req: express.Request, res: express.Response) => {
    try {
        const { email, password} = req.body

        if (!email || !password) {
            return res.sendStatus(400)
        }

        const user = await getUserByEmail(email)

        if (!user || !(await bcryptjs.compare(password, user.password))) {
            return res.sendStatus(400)
        }

        const token = jwt.sign({ id: user._id }, JWT_SECRET, { expiresIn: JWT_EXPIRES})

        const loggedUser = {id: user._id, username: user.username, email: user.email, token: token}

        return res.status(200).json({ status: true, data:loggedUser, message: 'Login Succesfull' })
    }catch (err) {
        console.log(err)
        return res.sendStatus(400)
    }
}

export const register = async (req: express.Request, res: express.Response) => {
    try {
        const { email, password, username } = req.body

        if (!email || !password || !username) {
            return res.sendStatus(400)
        }

        const existingUser = await getUserByEmail(email)

        if (existingUser) {
            return res.sendStatus(409)
        }
        
        // const salt = random()
        let pass = await bcryptjs.hash(password, 10)

        const user = await createUser({
            email,
            username,
            password: pass
        })

        return res.status(200).json({satatus: true, message: 'Usuario creado'}).end()
    }catch (err) {
        console.log(err)
        // return res.sendStatus(400)
        return res.status(500).json({status: false, message: [err.message]})
    }
}