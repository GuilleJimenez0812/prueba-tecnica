import express from 'express'
import { get, merge } from 'lodash'
import { getuserBySessionToken } from '../repository/user'
import jwt from 'jsonwebtoken'
import { JWT_SECRET } from '../congif'

export const verify = async (req: express.Request, res: express.Response, next: express.NextFunction) => {
    let token: string | string[] = req.headers['x-access-token'] || req.headers['authorization']
    if (Array.isArray(token)) {
      token = token.join(' ')
    }

    if (!token) {
        return res.status(401).json({ status:false, errors: ['No autorizado']})
    }

    if (token.startsWith('Bearer')) {
        token = token.slice(7, token.length)
        jwt.verify(token, JWT_SECRET, (error, decoded) => {
            if(error) {
                return res.status(401).json({ status: false, errors: ['Invalid Token']})
            }
            else {
                next()
            }
        })
    }
}

export const isOwner = async (req: express.Request, res: express.Response, next: express.NextFunction) => {
    try{
        const { id} = req.params
        const currentUserId = get(req, 'identity._id') as string

        if (!currentUserId) {
            return res.sendStatus(403)
        }
        if (currentUserId.toString() !== id) {
            return res.sendStatus(403)
        }

        next()
    }catch (err) {
        console.log(err)
        return res.sendStatus(400)
    }
}