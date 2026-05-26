import type { Request, Response, NextFunction } from 'express'
import { body, param } from 'express-validator'
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
    await param('budgetId')
        .isInt().withMessage('ID debe ser un número entero')
        .custom((value) => value > 0)
        .withMessage('ID no valido').run(req)
    let errors = validationResult(req)
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() })
        }
        next()
}

/*
export const validateBudgetExists = async (req: Request, res: Response, next: NextFunction) => {
    try {
            //console.log(req.body)
            const idParam = req.params.id
            const budgetId = Array.isArray(idParam) ? idParam[0] : idParam
            if (!budgetId) {
                return res.status(400).json({error: 'ID inválido'})
            }
            const budget = await Budget.findByPk(budgetId)
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
        */
export const validateBudgetExists = async (req, res, next) => {
    try {
        const { budgetId } = req.params;
        const budget = await Budget.findByPk(budgetId);

        if (!budget) {
            return res.status(404).json({ message: 'Presupuesto no encontrado' });
        }

        
        req.budget = budget
        next();
    } catch (error) {
        return res.status(500).json({ error: 'Error al obtener el presupuesto' });
    }
}

export const validateBudgetInput = async (req: Request, res: Response, next: NextFunction) => {

    
        body('name').notEmpty().withMessage('El nombre del presupuesto no puede estar vacío').run(req)
        body('amount').notEmpty().withMessage('El monto del presupuesto no puede estar vacío')
        .isNumeric().withMessage('Cantidad no válida')
        .custom((value) => value > 0).withMessage('El presupuesto debe ser mayor a 0').run(req)

        
        next()
}

export function hasAccess(req: Request, res: Response, next: NextFunction) {
    

    if(req.budget.userId !== req.user.id) {
        return res.status(401).json({error: 'Accion no válida'})
    }
    next()
}