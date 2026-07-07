import {createRequest, createResponse} from 'node-mocks-http'
import AuthController from '../../../controllers/AuthController'
import User from '../../../models/User'
import { hashPassword } from '../../../utils/auth'
import { generateToken } from '../../../utils/token'
import { AuthEmail } from '../../../emails/AuthEmail'


jest.mock('../../../models/User')
jest.mock('../../../utils/auth')
jest.mock('../../../utils/token')


describe('AuthController.createAccount', () => {

    beforeEach(() => {
        jest.resetAllMocks()
    })

    it('should return 409 and an error message if the email already registered', async () => {
        (User.findOne as jest.Mock).mockResolvedValue(true)
        const req = createRequest({
            method: 'POST',
            url: '/api/auth/create-account',
            body:{
                email: "test@test.com",
                password: "password123"
            }
        })
        const res = createResponse()

        await AuthController.createAccount(req, res)

        expect(res.statusCode).toBe(409)
        const data = res._getJSONData()
        //expect(data).toEqual({error: 'El correo electrónico ya está en uso'})
        expect(data).toHaveProperty('error', 'El correo electrónico ya está en uso')
        expect(User.findOne).toHaveBeenCalled()
        expect(User.findOne).toHaveBeenCalledTimes(1)

    })


    it('should create a new user and return a success message', async () => {
        //(User.findOne as jest.Mock).mockResolvedValue(null)
          
        const req = createRequest({
            method: 'POST',
            url: '/api/auth/create-account',
            body:{
                email: "test@test.com",
                password: "password123",
                name: "Test User",
            }
        })
        const res = createResponse()

        const mockUser = {...req.body, save: jest.fn()}; // Mock user object with a save method

        (User.create as jest.Mock).mockResolvedValue(mockUser);
        (hashPassword as jest.Mock).mockResolvedValue('hashedPassword');
        (generateToken as jest.Mock).mockReturnValue('123456');
        jest.spyOn(AuthEmail, "sendConfirmationEmail").mockImplementation(() => Promise.resolve());

        await AuthController.createAccount(req, res)

        expect(res.statusCode).toBe(201)
        const data = res._getJSONData()
        expect(data).toEqual('Cuenta creada exitosamente')

        expect(User.create).toHaveBeenCalledWith(req.body)
        expect(User.create).toHaveBeenCalledTimes(1)
        expect(hashPassword).toHaveBeenCalledWith(req.body.password)
        expect(hashPassword).toHaveBeenCalledTimes(1)
        expect(mockUser.password).toBe('hashedPassword')
        expect(mockUser.token).toBe('123456')
        expect(generateToken).toHaveBeenCalled()
        expect(generateToken).toHaveBeenCalledTimes(1)
        expect(mockUser.save).toHaveBeenCalled()
        expect(mockUser.save).toHaveBeenCalledTimes(1)
        expect(AuthEmail.sendConfirmationEmail).toHaveBeenCalledWith({
            name: req.body.name,
            email: req.body.email,
            token: '123456'
        })
        expect(AuthEmail.sendConfirmationEmail).toHaveBeenCalledTimes(1)
    })
})