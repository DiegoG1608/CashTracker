import { Router } from "express"
import { body, param } from 'express-validator'
import { BudgetController } from "../controllers/BudgetController"
import { handleInputErrors } from "../middleware/validation"
import { validateBudgetExists, validateBudgetID, validateBudgetInput } from "../middleware/budget"

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



export default router