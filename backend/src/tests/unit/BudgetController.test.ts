import {createRequest, createResponse}from 'node-mocks-http'
import {budgets} from '../mocks/budgets'
import { describe, it, expect, jest, beforeEach, beforeAll, afterEach, afterAll } from '@jest/globals'
import { BudgetController } from '../../controllers/BudgetController'
import Budget from '../../models/Budget'
import Expense from '../../models/Expense'

jest.mock('../../models/Budget', () => ({
    __esModule: true,
    default: {
        findAll: jest.fn(),
        create: jest.fn(),
        findByPk: jest.fn(),
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


describe('BudgetController.create', () => {
    it('should create a new budget successfully and respond with statusCode 201', async () => {

        const mockBudget = {
            save: jest.fn<()=>Promise<boolean>>().mockResolvedValue(true) // Simula el método save del modelo Budget
            //save: jest.fn().mockResolvedValue(true)
        };
        (Budget.create as jest.MockedFunction<any>).mockResolvedValue(mockBudget) // Simula el método create del modelo Budget para que devuelva el mockBudget
        //(Budget.create as jest.Mock).mockResolvedValue(mockBudget)
        const req=createRequest({
            method: 'POST',
            url: '/api/budgets',
            user: {
                id: 1
            },
            body: {
                name: 'Nuevo Presupuesto',
                amount: 1000
            }
        })

        const res=createResponse();
        await BudgetController.create(req, res)

        const data = res._getJSONData()
        console.log(data)

        expect(res.statusCode).toBe(201)
        expect(data).toBe('Presupuesto creado exitosamente') // Verifica que el mensaje de éxito sea el esperado (importante respetar el mensaje exacto, incluyendo mayúsculas y acentos)
        expect(Budget.create).toHaveBeenCalledWith(req.body) // Verifica que el método create del modelo Budget haya sido llamado con los datos del cuerpo de la solicitud
        expect(mockBudget.save).toHaveBeenCalled() // Verifica que el método save del mockBudget haya sido llamado
        expect(mockBudget.save).toHaveBeenCalledTimes(1) // Verifica que el método save del mockBudget haya sido llamado exactamente una vez
    })


    it('should handle budget creation error', async () => {

        const mockBudget = {
            save: jest.fn()
        };
        (Budget.create as jest.MockedFunction<any>).mockRejectedValue(new Error) // Simula un error en la base de datos al intentar crear un presupuesto
        const req=createRequest({
            method: 'POST',
            url: '/api/budgets',
            user: {
                id: 1
            },
            body: {
                name: 'Nuevo Presupuesto',
                amount: 1000
            }
        })

        const res=createResponse();
        await BudgetController.create(req, res)

        const data = res._getJSONData()
        console.log(data)

        expect(res.statusCode).toBe(500)
        expect(data).toStrictEqual({ error: 'Error al crear el presupuesto' }) // Verifica que el mensaje de error sea el esperado (importante respetar el mensaje exacto, incluyendo mayúsculas y acentos)
        expect(Budget.create).toHaveBeenCalledWith(req.body) // Verifica que el método create del modelo Budget haya sido llamado con los datos del cuerpo de la solicitud


        
        expect(Budget.create).toHaveBeenCalledWith(req.body) // Verifica que el método create del modelo Budget haya sido llamado con los datos del cuerpo de la solicitud
        expect(mockBudget.save).not.toHaveBeenCalled() // Verifica que el método save del mockBudget haya sido llamado
    })
})


describe('BudgetController.getBudgetByID', () => {

    //una vez antes de cada test, se ejecuta esta función
    beforeEach(() => {
        
        //const mockedFindAll = jest.mocked(Budget.findAll)

        
        (Budget.findByPk as jest.Mock).mockImplementation(id =>{
            const budget = budgets.filter(b => b.id === id)[0]
            return Promise.resolve(budget)
        })
    })

    it('should return a budget with ID 1 and 3 expenses', async () => {
        const req=createRequest({
            method: 'GET',
            url: '/api/budgets/:budgetId',
            budget: {
                id: 1
            }
        })

        const res=createResponse();
        await BudgetController.getBudgetByID(req, res)

        const data = res._getJSONData()
        expect(res.statusCode).toBe(200)
        expect(data.expenses).toHaveLength(3)
        expect(Budget.findByPk).toHaveBeenCalledTimes(1)
        expect(Budget.findByPk).toHaveBeenCalledWith(req.budget.id, {include: [Expense]})
        
    })

    it('should return a budget with ID 2 and 2 expenses', async () => {
        const req=createRequest({
            method: 'GET',
            url: '/api/budgets/:id',
            budget: {
                id: 2
            }
        })

        const res=createResponse();
        await BudgetController.getBudgetByID(req, res)

        const data = res._getJSONData()
        expect(res.statusCode).toBe(200)
        expect(data.expenses).toHaveLength(2)
        
    })


    it('should return a budget with ID 3 and 0 expenses', async () => {
        const req=createRequest({
            method: 'GET',
            url: '/api/budgets/:id',
            budget: {
                id: 3
            }
        })

        const res=createResponse();
        await BudgetController.getBudgetByID(req, res)

        const data = res._getJSONData()
        expect(res.statusCode).toBe(200)
        expect(data.expenses).toHaveLength(0)
        
    })
})


describe('BudgetController.updateBudgetByID', () => {
    it('should update the budget with ID 1 successfully', async () => {
        const budgetMock = {
            update: jest.fn<()=>Promise<boolean>>().mockResolvedValue(true) // Simula el método save del modelo Budget
        };
        const req=createRequest({
            method: 'PUT',
            url: '/api/budgets/:budgetId',
            budget: budgetMock,
            body: { name: 'Presupuesto Actualizado', amount: 5000 }
        })

        const res=createResponse();
        await BudgetController.updateBudgetByID(req, res)

        const data = res._getJSONData()
        expect(res.statusCode).toBe(200)
        expect(data).toBe('Presupuesto actualizado exitosamente') // Verifica que el mensaje de éxito sea el esperado (importante respetar el mensaje exacto, incluyendo mayúsculas y acentos)
        expect(budgetMock.update).toHaveBeenCalled() // Verifica que el método update del mockBudget haya sido llamado
        expect(budgetMock.update).toHaveBeenCalledTimes(1) // Verifica que el método update del mockBudget haya sido llamado exactamente una vez
        expect(budgetMock.update).toHaveBeenCalledWith(req.body) // Verifica que el método update del mockBudget haya sido llamado con los datos del cuerpo de la solicitud
    })
})

describe('BudgetController.deleteBudgetByID', () => {
    it('should delete the budget with ID 1 successfully', async () => {
        const budgetMock = {
            destroy: jest.fn<()=>Promise<boolean>>().mockResolvedValue(true) // Simula el método save del modelo Budget
        };
        const req=createRequest({
            method: 'DELETE',
            url: '/api/budgets/:budgetId',
            budget: budgetMock,
            
        })

        const res=createResponse();
        await BudgetController.deleteBudgetByID(req, res)

        const data = res._getJSONData()
        expect(res.statusCode).toBe(200)
        expect(data).toBe('Presupuesto eliminado exitosamente') // Verifica que el mensaje de éxito sea el esperado (importante respetar el mensaje exacto, incluyendo mayúsculas y acentos)
        expect(budgetMock.destroy).toHaveBeenCalled() // Verifica que el método destroy del mockBudget haya sido llamado
        expect(budgetMock.destroy).toHaveBeenCalledTimes(1) // Verifica que el método destroy del mockBudget haya sido llamado exactamente una vez
    })
})