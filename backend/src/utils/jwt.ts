import jwt from 'jsonwebtoken'

export const generateJWT = (id: string):string => {
    console.log('Generando token para id:', id)
    const token = jwt.sign({ id }, process.env.JWT_SECRET,
        {
            expiresIn: '30d'
        })
        return token
}