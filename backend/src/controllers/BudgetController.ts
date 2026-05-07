import type { Request, Response } from 'express';
import Budget from '../models/Budget'

export class BudgetController {
    static getAll= async (req: Request, res: Response) => {
        //console.log('Desde /api/budgets')
        try {
            const budgets = await Budget.findAll({
                    order: [
                        ['createdAt', 'DESC']
                    ],
                    limit: 2,
                    where: {
                        name: "Tacos"
                    }

            })
            res.json(budgets)
        }   catch (error) {  
            //console.log(error)
            res.status(500).json({error: 'Error al obtener los presupuestos'})
        }
    }

    static create= async (req: Request, res: Response) => {
        console.log(req.body)
        try {
            //console.log(req.body)
            const budget = new Budget(req.body)

            await budget.save()
            res.status(201).json(budget).json('Presupuesto creado exitosamente') 
        }
        catch (error) {
            //console.log(error)
            res.status(500).json({error: 'Error al crear el presupuesto'})
        }
    }

    static getBudgetByID= async (req: Request, res: Response) => {
        //console.log('Desde GET /api/budgets/id')
        //console.log(req.params.id)
        
        res.json(req.budget)
    }

    static updateBudgetByID= async (req: Request, res: Response) => {
        //console.log('Desde PUT /api/budgets/id')
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
            res.json(budget)
            // escribir los cambios del body
            await budget.update(req.body)
            res.json('Presupuesto actualizado exitosamente')
        }
        
        
        catch (error) {
            //console.log(error)
            res.status(500).json({error: 'Error al obtener el presupuesto'})
        }

    }

    static deleteBudgetByID= async (req: Request, res: Response) => {
        //console.log('Desde DELETE /api/budgets/id')
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
            await budget.destroy()
            res.json('Presupuesto eliminado exitosamente')
        }
        catch (error) {
            //console.log(error)
            res.status(500).json({error: 'Error al obtener el presupuesto'})
        }
    }
}

//investigar eliminado logico de una base de datos
