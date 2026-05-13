import { Router } from "express"
import { body, param } from 'express-validator'
import { BudgetController } from "../controllers/BudgetController"
import { handleInputErrors } from "../middleware/validation"
import { validateBudgetExists, validateBudgetID, validateBudgetInput } from "../middleware/budget"
import { ExpensesController } from "../controllers/ExpenseController"

const router = Router()

router.param('budgetId', validateBudgetID)
router.param('budgetId', validateBudgetExists)

router.get('/', BudgetController.getAll)

router.post('/', 
    validateBudgetInput,
    handleInputErrors,
    BudgetController.create
)

router.get('/:budgetId',
    BudgetController.getBudgetByID)

router.put('/:budgetId', 
       validateBudgetInput,
       handleInputErrors,
    BudgetController.updateBudgetByID)

router.delete('/:budgetId', 
    BudgetController.deleteBudgetByID)

//----------Routes for Expenses----------
router.get('/:budgetId/expenses', 
    ExpensesController.getAll)//Obtener todos los gastos de un presupuesto

router.post('/:budgetId/expenses',
    ExpensesController.create)//Crear un nuevo gasto para un presupuesto

router.get('/:budgetId/expenses/:expenseId',
    ExpensesController.getById)//

router.put('/:budgetId/expenses/:expenseId',
    ExpensesController.updateById)//Actualizar un gasto específico de un presupuesto

router.delete('/:budgetId/expenses/:expenseId',
    ExpensesController.deleteById)//

export default router