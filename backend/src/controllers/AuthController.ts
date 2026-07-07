import type {Request, Response} from 'express'
import User from '../models/User'
import { checkPassword, hashPassword } from '../utils/auth'
import { generateToken } from '../utils/token'
import { AuthEmail } from '../emails/AuthEmail'
import { generateJWT } from '../utils/jwt'
import jwt from 'jsonwebtoken'


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
            
            const user = await User.create(req.body)
            user.password = await hashPassword(password)
            user.token=generateToken()
            await user.save()

            await AuthEmail.sendConfirmationEmail({
                name: user.name,
                email: user.email,
                token: user.token
            })
            res.status(201).json('Cuenta creada exitosamente')
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

    static login = async(req: Request, res: Response) => {
        const {email, password} = req.body

        const user = await User.findOne({where: {email}})
        if (!user) {
            return res.status(409).json({error: 'Usuario no encontrado'})
        }


        if (!user.confirmed) {
            return res.status(403).json({error: 'La cuenta no ha sido confirmada'})
        }

        const isPasswordCorrect = await checkPassword( password, user.password)

        
        if (!isPasswordCorrect) {
            return res.status(401).json({error: 'Password incorrecto'})
        }

        const token = generateJWT(user.id)
        res.json(token)

        //res.json(user)
        //console.log(isPasswordCorrect);
        
    }

    static forgotPassword = async(req: Request, res: Response) => {
        //res.json('Olvidé mi contraseña')

        const {email} = req.body

        const user = await User.findOne({where: {email}})
        if (!user) {
            return res.status(404).json({error: 'Usuario no encontrado'})
        }

        user.token = generateToken()
        await user.save()

        await AuthEmail.sendPasswordResetToken({
            name: user.name,
            email: user.email,
            token: user.token
        })

        res.json('Revisa tu email para reestablecer tu contraseña')
    }


    static validateToken = async(req: Request, res: Response) => {
        const {token} = req.body
        const tokenExists = await User.findOne({where: {token}})
        if (!tokenExists) {
            return res.status(404).json({error: 'Token no válido'})
        }

        res.json('Token válido')
    }

    static resetPasswordWithToken = async(req: Request, res: Response) => {
        const {token} = req.params
        const {password} = req.body

        const user = await User.findOne({where: {token}})
        if (!user) {
            return res.status(404).json({error: 'Token no válido'})
        }

        user.password = await hashPassword(password)
        user.token = null
        await user.save()

        res.json('Contraseña restablecida exitosamente')
    }


    static user = async(req: Request, res: Response) => {
        //res.json('Información del usuario autenticado')

        res.json(req.user)

    }
    static updateCurrentUserPassword = async(req: Request, res: Response) => {
        const {current_password, password} = req.body
        const {id} = req.user

        const user = await User.findByPk(id)

        const isPasswordCorrect = await checkPassword(current_password, user.password)
        if (!isPasswordCorrect) {
            return res.status(401).json({error: 'La contraseña actual es incorrecta'})
        }

        user.password = await hashPassword(password)
        await user.save()

        //res.json('Actualizar contraseña del usuario autenticado')
        res.json('El password se modifico exitosamente')
    }


    static checkPassword = async(req: Request, res: Response) => {
        const {password} = req.body
        const {id} = req.user

        const user = await User.findByPk(id)

        const isPasswordCorrect = await checkPassword(password, user.password)
        if (!isPasswordCorrect) {
            return res.status(401).json({error: 'La contraseña actual es incorrecta'})
        }

        //res.json('Actualizar contraseña del usuario autenticado')
        res.json('El password es correcto')
    }
}


export default AuthController