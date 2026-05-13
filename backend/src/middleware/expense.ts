import type { Request, Response, NextFunction } from 'express'
import { body, param } from 'express-validator'
//import { handleInputErrors } from './validation'
import { validationResult } from 'express-validator'


export const validateExpenseInput = async (req: Request, res: Response, next: NextFunction) => {

    
        body('name').notEmpty().withMessage('El nombre del gasto no puede estar vacío').run(req)
        body('amount').notEmpty().withMessage('El monto del gasto no puede estar vacío')
        .isNumeric().withMessage('Cantidad no válida')
        .custom((value) => value > 0).withMessage('El gasto debe ser mayor a 0').run(req)

        
        next()
}