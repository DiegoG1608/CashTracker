import {createRequest, createResponse}from 'node-mocks-http'
import {budgets} from '../mocks/budgets'
import { describe, it, expect, jest, beforeEach, beforeAll, afterEach, afterAll } from '@jest/globals'
import { BudgetController } from '../../controllers/BudgetController'
import Budget from '../../models/Budget'

jest.mock('../../models/Budget', () => ({
    __esModule: true,
    default: {
        findAll: jest.fn(),
    }
}))

type FindAllOptions = {
    where: {
        userId: number
    }
}

describe('BudgetController.getAll', () => {

    //una vez antes de cada test, se ejecuta esta función
    beforeEach(() => {
        
        //const mockedFindAll = jest.mocked(Budget.findAll)

        (Budget.findAll as jest.Mock).mockReset(); // Reinicia el mock para evitar interferencias entre tests
        (Budget.findAll as jest.Mock).mockImplementation(
            (options: FindAllOptions) => {

                const updatedBudgets = budgets.filter(
                    budget => budget.userId === options.where.userId
                )

                return Promise.resolve(updatedBudgets)
            }
        )
    })

    /*
    //una vez antes de todos los test, se ejecuta esta función
    beforeAll(() => {
    })

    //una vez después de cada test, se ejecuta esta función
    afterEach(() => {

    })


    //una vez después de todos los test, se ejecuta esta función
    afterAll(() => {
    })
*/

    it('should return a list of budgets for user with ID 1', async () => {
        //expect(budgets).toHaveLength(3)
        //expect(budgets).not.toHaveLength(0)
        
        const req=createRequest({
            method: 'GET',
            url: '/api/budgets',
            user: {
                id: 1
            }
        })

        const res=createResponse();
    
        //const updatedBudgets = budgets.filter(budget => budget.userId === req.user.id);
        
        //linea del curso
        //(Budget.findAll as jest.Mock).mockResolvedValue(updatedBudgets)
        
        //lee el try y luego el catch, pero no se ejecuta el catch porque el error no es lanzado, sino que es devuelto como resultado de la función, por eso se debe usar mockRejectedValue para simular un error lanzado
        //const mockedFindAll = jest.mocked(Budget.findAll)
        //mockedFindAll.mockResolvedValue(updatedBudgets as any)
        await BudgetController.getAll(req, res)

        const data = res._getJSONData()
        console.log(data)
        expect(data).toHaveLength(2)
        expect(res.statusCode).toBe(200)
        expect(res.status).not.toBe(404)
        
    })



    it('should retrieve 1 budget for user with ID 2', async () => {
        //expect(budgets).toHaveLength(3)
        //expect(budgets).not.toHaveLength(0)
        
        const req=createRequest({
            method: 'GET',
            url: '/api/budgets',
            user: {
                id: 2
            }
        })

        const res=createResponse();

        //const updatedBudgets = budgets.filter(budget => budget.userId === req.user.id);

        //linea del curso
        //(Budget.findAll as jest.Mock).mockResolvedValue(updatedBudgets)

        //lee el try y luego el catch, pero no se ejecuta el catch porque el error no es lanzado, sino que es devuelto como resultado de la función, por eso se debe usar mockRejectedValue para simular un error lanzado
        //const mockedFindAll = jest.mocked(Budget.findAll)
        //mockedFindAll.mockResolvedValue(updatedBudgets as any)
        await BudgetController.getAll(req, res)

        const data = res._getJSONData()
        console.log(data)
        expect(data).toHaveLength(1)
        expect(res.statusCode).toBe(200)
        expect(res.status).not.toBe(404)
        
    })


    it('should retrieve 0 budgets for user with ID 10', async () => {
        //expect(budgets).toHaveLength(3)
        //expect(budgets).not.toHaveLength(0)
        
        const req=createRequest({
            method: 'GET',
            url: '/api/budgets',
            user: {
                id: 10
            }
        })

        const res=createResponse();

        //const updatedBudgets = budgets.filter(budget => budget.userId === req.user.id);
        
        //linea del curso
        //(Budget.findAll as jest.Mock).mockResolvedValue(updatedBudgets)  

        //lee el try y luego el catch, pero no se ejecuta el catch porque el error no es lanzado, sino que es devuelto como resultado de la función, por eso se debe usar mockRejectedValue para simular un error lanzado
        //const mockedFindAll = jest.mocked(Budget.findAll)
        //mockedFindAll.mockResolvedValue(updatedBudgets as any)
        await BudgetController.getAll(req, res)

        const data = res._getJSONData()
        console.log(data)
        expect(data).toHaveLength(0)
        expect(res.statusCode).toBe(200)
        expect(res.status).not.toBe(404)
        
    })

    it('should handle errors when fetching budgets', async () => {
        const req = createRequest({
            method: 'GET',
            url: '/api/budgets',
            user: {
                id: 100
            }
        })
        const res = createResponse();

        const mockedFindAll = jest.mocked(Budget.findAll)
        mockedFindAll.mockRejectedValue(new Error('Database error')) // Simula un error en la base de datos

        await BudgetController.getAll(req, res)

        
        expect(res.statusCode).toBe(500)
        expect(res._getJSONData()).toStrictEqual({ error: 'Error al obtener los presupuestos' })

    })
})