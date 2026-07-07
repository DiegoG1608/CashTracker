import {createRequest, createResponse} from 'node-mocks-http'
import { validateExpenseExists } from '../../../middleware/expense'
import Expense from '../../../models/Expense'
import { expenses } from '../../mocks/expenses'
import { hasAccess } from '../../../middleware/budget'
import { budgets } from '../../mocks/budgets'


jest.mock('../../../models/Expense', () => ({
    __esModule: true,
    default: {
        findByPk: jest.fn(),
    }
    
}))


describe('Expense Middleware - validateExpenseExists', () => {
    beforeEach(() => {
        (Expense.findByPk as jest.Mock).mockImplementation((id) =>{
            const expense = expenses.filter(e => e.id === id)[0] ?? null
            //console.log(expense)
            return Promise.resolve(expense)
        })
    })


    it('should handle a non-existent budget', async () => {
        const req = createRequest({
            params: { expenseId: 120 }
        });

        const res = createResponse();
        const next = jest.fn();

        await validateExpenseExists(req, res, next)

        const data = res._getJSONData()
        expect(res.statusCode).toBe(404)
        expect(data).toEqual({ message: 'Gasto no encontrado' })
        expect(next).not.toHaveBeenCalled()
    })


    it('should call next middleware if expense exists', async () => {
        const req = createRequest({
            params: { expenseId: 1 }
        });

        const res = createResponse();
        const next = jest.fn();

        await validateExpenseExists(req, res, next)

        expect(next).toHaveBeenCalled()
        expect(next).toHaveBeenCalledTimes(1)
        expect(req.expense).toEqual(expenses[0])
    })


    it('should handle internal server error', async () => {
        (Expense.findByPk as jest.Mock).mockRejectedValue(new Error)
        const req = createRequest({
            params: { expenseId: 1 }
        });

        const res = createResponse();
        const next = jest.fn();

        await validateExpenseExists(req, res, next)

        expect(res.statusCode).toBe(500)
        const data = res._getJSONData()
        expect(data).toEqual({ error: 'Error al obtener el gasto' })
        expect(next).not.toHaveBeenCalled()
    })

    it('should prevent unauthorized users from adding expenses', async () => {
        const req = createRequest({
            method: 'POST',
            url: '/api/budgets/:budgetId/expenses',
            budget: budgets[0], // Simulando un presupuesto existente
            user: { id: 20 }, // Simulando un usuario que no es el propietario del presupuesto
            body: {
                name: 'Gasto de prueba',
                amount: 100
            }
        });

        const res = createResponse();
        const next = jest.fn();

        hasAccess(req, res, next)

        expect(res.statusCode).toBe(401)
        const data = res._getJSONData()
        expect(data).toEqual({  error: 'Accion no válida'})
        expect(next).not.toHaveBeenCalled()

    })
    



})

