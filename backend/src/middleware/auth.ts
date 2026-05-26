import type { Request, Response, NextFunction } from 'express'
import User from '../models/User'
import jwt from 'jsonwebtoken'

declare global {
    namespace Express {
        interface Request {
            user?: User
        }
    }
}

export const authenticate = async (req: Request, res: Response, next: NextFunction) => {
    const bearer = req.headers.authorization
            if (!bearer) {
                return res.status(401).json({error: 'No autorizado'})
            }
            const [, token]= bearer.split(' ')
    
            if (!token) {
                return res.status(401).json({error: 'Token no valido'})
            }
    
            try {
                const decoded = jwt.verify(token, process.env.JWT_SECRET || '')
                //res.json(decoded)
                if(typeof decoded === 'object' && decoded.id) {
                req.user = await User.findByPk(decoded.id, {
                    attributes: ['id', 'name', 'email']
                })
    
                //res.json(user)
                next()
                }
            }
                catch (error) {
                    
                    return res.status(500).json({error: 'Token no valido'})
                }
            
            //res.json({token})
            
}