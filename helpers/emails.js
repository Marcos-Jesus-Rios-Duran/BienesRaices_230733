import nodemailer from 'nodemailer'
import dotenv from 'dotenv'

dotenv.config({path: '.env'})

const emailAfterRegister = async (newUserData) => {
    const transport = nodemailer.createTransport({
        host: process.env.EMAIL_HOST, 
        port: process.env.EMAIL_PORT,
        auth:{
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASS
        }
    })

    //console.log(data)
    const {email, name, token} = newUserData

    //Enviar el email
    await transport.sendMail({
        from: 'bieneracices-matricula.com',
        to: email,
        subject: 'Bienvenido/a al BienesRaices-Matricula',
        text: 'Ya casi puedes usar nuestra plataforma, solo falta...',
        html: `<p> Hola,  <span style="color: red"> ${name}</span>, <br>
        Bienvenido a la plataforma de BienesRaíces, el sitio seguro donde podrás buscar, comprar y ofertar propiedades a través de internet.
        <br>
        <p>Ya solo necesitamos confirmes la cuenta que creaste, dando click a la siguiente liga:  <a href="${process.env.BACKEND_DOMAIN}:${process.env.BACKEND_PORT}/auth/confirmAccount/${token}">Confrimar cuenta</a></p> 
        <br>
        <p>Si tu no has creado la cuenta ignora este mensaje.</p>
        `
     })

}


const emailChangePassword = async (userData) => {
    const transport = nodemailer.createTransport({
        host: process.env.EMAIL_HOST, 
        port: process.env.EMAIL_PORT,
        auth:{
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASS
        }
    })

    //console.log(data)
    const {email, name, token} = userData

    //Enviar el email
    await transport.sendMail({
        from: 'bieneracices-matricula.com',
        to: email,
        subject: 'Solicitud de actualización de contraseña en BienesRaíces.com',
        text: 'Por favor actualiza tu contraseña para ingresar a la plataforma',
        html: `<p> Hola,  <span style="color: red"> ${name}</span>, <br>
        Haz reportado el olvido o perdida de tu contraseña para acceder a tu cuenta de BienesRaices.
        <br>
        <p>Por lo que necesitamos que  igreses a la siguiente liga para: <a href="${process.env.BACKEND_DOMAIN}:${process.env.BACKEND_PORT}/auth/passwordRecovery/${token}">Actualizar Contraseña</a></p> 
        <br>`
     })

}
 
export {emailAfterRegister, emailChangePassword}