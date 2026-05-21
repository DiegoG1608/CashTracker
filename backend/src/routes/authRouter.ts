import { Router } from "express";

import {body, param} from 'express-validator'
import { AuthController } from "../controllers/AuthController";
import { handleInputErrors } from "../middleware/validation";
import { limiter } from "../config/limiter";

const router = Router()


router.use(limiter)

router.post('/create-account', 
    body('name').notEmpty().withMessage('El nombre es requerido'),
    body('password').isLength({ min: 8 }).withMessage('La contraseña debe tener al menos 8 caracteres'),
    body('email').isEmail().withMessage('Correo electrónico no válido'),
    handleInputErrors,
    AuthController.createAccount)


router.post('/confirm-account',
    body('token').notEmpty().isLength({min:6, max:6}).withMessage('El token no es valido'),
    AuthController.confirmAccount
)



router.post('/login',
    body('email').isEmail().withMessage('Correo electrónico no válido'),
    body('password').notEmpty().withMessage('La contraseña es requerida'),
    handleInputErrors,
    AuthController.login
)



router.post('/forgot-password',
    body('email').isEmail().withMessage('Correo electrónico no válido'),
    handleInputErrors,
    AuthController.forgotPassword
)


router.post('/validate-token',
    body('token').notEmpty().isLength({min:6, max:6}).withMessage('El token no es valido'),
    handleInputErrors,
    AuthController.validateToken
)

router.post('/reset-password/:token',
    param('token').notEmpty().isLength({min:6, max:6}).withMessage('El token no es valido'),
    body('password').isLength({ min: 8 }).withMessage('La contraseña debe tener al menos 8 caracteres'),
    handleInputErrors,
    AuthController.resetPasswordWithToken
)

router.get('/user', AuthController.user)
export default router