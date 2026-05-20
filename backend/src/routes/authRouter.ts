import { Router } from "express";

import {body} from 'express-validator'
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
    limiter,
    body('token').notEmpty().isLength({min:6, max:6}).withMessage('El token no es valido'),
    AuthController.confirmAccount
)

export default router