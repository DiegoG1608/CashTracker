import { Router } from "express"
import { body, param } from 'express-validator'
import { BudgetController } from "../controllers/BudgetController"
import { handleInputErrors } from "../middleware/validation"
import { validateBudgetExists, validateBudgetID } from "../middleware/budget"

const router = Router()

router.get('/', BudgetController.getAll)

router.post('/', 
    body('name').notEmpty().withMessage('El nombre del presupuesto es requerido'), 
    body('amount').notEmpty().withMessage('El monto del presupuesto es requerido')
    .isNumeric().withMessage('Cantidad no válida')
    .custom((value) => value > 0).withMessage('El monto debe ser un número positivo'),
    handleInputErrors,
    BudgetController.create
)

router.get('/:id',
    validateBudgetID,
    validateBudgetExists,
    BudgetController.getBudgetByID)

router.put('/:id', 
    validateBudgetID,
    body('name').notEmpty().withMessage('El nombre del presupuesto no puede estar vacío'), 
    body('amount').notEmpty().withMessage('El monto del presupuesto no puede estar vacío')
    .custom((value) => value > 0).withMessage('El presupuesto debe ser mayor a 0'),
    handleInputErrors,    
    BudgetController.updateBudgetByID)

router.delete('/:id', 
    validateBudgetID,
    BudgetController.deleteBudgetByID)



export default router