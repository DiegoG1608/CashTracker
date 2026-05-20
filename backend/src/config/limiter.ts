import { rateLimit } from 'express-rate-limit'

export const limiter = rateLimit({
    windowMs: 60 * 1000, // 15 minutos
    limit:5,
    //max: 100, // Limitar a 100 solicitudes por ventana
    message: {"error": "Has alcanzado el limite de peticiones, por favor intenta nuevamente más tarde."}
})