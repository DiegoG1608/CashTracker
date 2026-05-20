import { transport } from "../config/nodemailer"


type EmailType = {
    name: string
    email: string
    token: string
}


export class AuthEmail {
    static sendConfirmationEmail = async (user: EmailType) => {
        //console.log(user)
        // Lógica para enviar correo de confirmación
        const email = await transport.sendMail({
            from: '"CashTracker" <admin@cashtracker.com>',
            to: user.email,
            subject: 'Confirma tu cuenta en CashTracker',
            html: `<p>Hola ${user.name},</p>
            <p>Gracias por registrarte en CashTracker. Para confirmar tu cuenta, por favor utiliza el siguiente código de verificación:</p>
            <a href="#">Confirmar Cuenta</a>
            <h2>${user.token}</h2> `
        })

        console.log('Correo enviado:', email.messageId)
    }
}