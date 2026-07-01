import type { Request, Response } from 'express'
import Expense from '../models/Expense'

export class ExpensesController {
    
  
    static create = async (req: Request, res: Response) => {
        console.log(req.params.budgetId)
        console.log(req.budget.id)
        try {
            const expense = await Expense.create(req.body)
            expense.budgetId = req.budget.id
            await expense.save()
            res.status(201).json("Gasto creado exitosamente")
        }
        catch (error) {
            res.status(500).json('Error al crear el gasto')
        }

    }
  
    static getById = async (req: Request, res: Response) => {
        res.json(req.expense)
    }

    static updateById = async (req: Request, res: Response) => {
        await req.expense.update(req.body)
        res.json('Gasto actualizado exitosamente')
    }
  
    static deleteById = async (req: Request, res: Response) => {
        await req.expense.destroy()
        res.json('Gasto eliminado exitosamente')
    }
}