import { Router } from "express"
import { body, param } from 'express-validator'
import { BudgetController } from "../controllers/BudgetController"
import { handleInputErrors } from "../middleware/validation"
import { hasAccess, validateBudgetExists, validateBudgetID, validateBudgetInput } from "../middleware/budget"
import { ExpensesController } from "../controllers/ExpenseController"
import { validateExpenseExists, validateExpenseID, validateExpenseInput } from "../middleware/expense"
import { authenticate } from "../middleware/auth"

const router = Router()

router.use(authenticate) // Middleware de autenticación para todas las rutas de presupuestos

router.param('budgetId', validateBudgetID)
router.param('budgetId', validateBudgetExists)
router.param('budgetId', hasAccess)

router.param('expenseId', validateExpenseID)
router.param('expenseId', validateExpenseExists)



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


router.post('/:budgetId/expenses',
    validateExpenseInput,
    handleInputErrors,
    ExpensesController.create)//Crear un nuevo gasto para un presupuesto

router.get('/:budgetId/expenses/:expenseId',
    ExpensesController.getById)//Obtener un gasto específico de un presupuesto

router.put('/:budgetId/expenses/:expenseId',
    validateExpenseInput,
    handleInputErrors,
    ExpensesController.updateById)//Actualizar un gasto específico de un presupuesto

router.delete('/:budgetId/expenses/:expenseId',
    ExpensesController.deleteById)//Eliminar un gasto específico de un presupuesto

export default router