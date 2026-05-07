import type { Request, Response, NextFunction } from 'express'
import { param } from 'express-validator'
//import { handleInputErrors } from './validation'
import { validationResult } from 'express-validator'
export const validateBudgetID = async (req: Request, res: Response, next: NextFunction) => {

    //console.log('Desde budget')
    await param('id')
        .isInt().withMessage('ID debe ser un número entero')
        .custom((value) => value > 0)
        .withMessage('ID no valido').run(req)
    let errors = validationResult(req)
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() })
        }
        next()
}