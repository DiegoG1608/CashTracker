import type {Request, Response} from 'express'
import User from '../models/User'
import { hashPassword } from '../utils/auth'


export class AuthController {
    static createAccount= async(req: Request, res: Response) => {
        const {email, password} = req.body

        // prevenir duplicados
        const userExists = await User.findOne({where: {email}})
        if (userExists) {
            return res.status(409).json({error: 'El correo electrónico ya está en uso'})
        }

        //res.json('Creando cuenta...')
        try {
            // Lógica para crear una cuent
            
            const user = new User(req.body)
            user.password = await hashPassword(password)
            await user.save()
            res.json('Cuenta creada exitosamente')
        } catch (error) {
            res.status(500).json({error: 'Error al crear la cuenta'})
        }
    }
}


export default AuthController