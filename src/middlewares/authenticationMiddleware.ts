import express from 'express'
import { get } from 'lodash'
import jwt from 'jsonwebtoken'
import { JWT_SECRET } from '../congif'
import { extractTokenFromHeader } from '../services/authentication.service'

export const verify = async (req: express.Request, res: express.Response, next: express.NextFunction) => {
    const tokenHeader = req.headers['x-access-token'] || req.headers['authorization'];
    const token = extractTokenFromHeader(tokenHeader);

    if (!token) {
        return res.status(401).json({ status:false, errors: ['No autorizado']});
    }

    jwt.verify(token, JWT_SECRET, (error) => {
        if(error) {
            return res.status(401).json({ status: false, errors: ['Invalid Token']});
        }
        else {
            next();
        }
    });
};

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