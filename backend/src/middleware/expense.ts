import type { Request, Response, NextFunction } from 'express'
import { body, param } from 'express-validator'
//import { handleInputErrors } from './validation'
import { validationResult } from 'express-validator'
import Expense from '../models/Expense'

declare global {
        namespace Express {
                interface Request {
                        expense?: Expense
                }
        }
}


export const validateExpenseInput = async (req: Request, res: Response, next: NextFunction) => {

    
        body('name').notEmpty().withMessage('El nombre del gasto no puede estar vacío').run(req)
        body('amount').notEmpty().withMessage('El monto del gasto no puede estar vacío')
        .isNumeric().withMessage('Cantidad no válida')
        .custom((value) => value > 0).withMessage('El gasto debe ser mayor a 0').run(req)

        
        next()
}
export const validateExpenseID = async (req: Request, res: Response, next: NextFunction) => {
        await param('expenseId').isInt().custom(value => value > 0).withMessage('ID de gasto no válido').run(req)
        let errors = validationResult(req)
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() })
        }
        next()
}


export const validateExpenseExists = async (req, res, next) => {
    try {
        const { expenseId } = req.params;
        const expense = await Expense.findByPk(expenseId);

        if (!expense) {
                const error = new Error('Gasto no encontrado');
                return res.status(404).json({ message: 'Gasto no encontrado' });
        }

        
        req.expense = expense
        next();
    } catch (error) {
        return res.status(500).json({ error: 'Error al obtener el gasto' });
    }
}