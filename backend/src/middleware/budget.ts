import type { Request, Response, NextFunction } from 'express'
import { param } from 'express-validator'
//import { handleInputErrors } from './validation'
import { validationResult } from 'express-validator'
import Budget from '../models/Budget'

declare global {
    namespace Express {
        interface Request {
            budget?: Budget
        }
    }
}

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


export const validateBudgetExists = async (req: Request, res: Response, next: NextFunction) => {
    try {
            //console.log(req.body)
            const idParam = req.params.id
            const id = Array.isArray(idParam) ? idParam[0] : idParam
            if (!id) {
                return res.status(400).json({error: 'ID inválido'})
            }
            const budget = await Budget.findByPk(id)
            if (!budget) {
                return res.status(404).json({error: 'Presupuesto no encontrado'})
            }
            req.budget = budget

            next()
        }
        catch (error) {
            //console.log(error)
            res.status(500).json({error: 'Error al obtener el presupuesto'})
        }
    
}