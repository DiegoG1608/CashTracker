import type {Request, Response} from 'express'
import User from '../models/User'
import { hashPassword } from '../utils/auth'
import { generateToken } from '../utils/token'
import { AuthEmail } from '../emails/AuthEmail'


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
            user.token=generateToken()
            await user.save()

            await AuthEmail.sendConfirmationEmail({
                name: user.name,
                email: user.email,
                token: user.token
            })
            res.json('Cuenta creada exitosamente')
        } catch (error) {
            res.status(500).json({error: 'Error al crear la cuenta'})
        }
    }


    static confirmAccount = async(req: Request, res: Response) => {
        const {token} = req.body
        //console.log(token)

        const user = await User.findOne({where: {token}})
        if (!user) {
            return res.status(400).json({error: 'Token no válido'})
        }
        user.confirmed = true
        user.token = null
        await user.save()
        res.json('Cuenta confirmada exitosamente')
    }
}


    

export default AuthController