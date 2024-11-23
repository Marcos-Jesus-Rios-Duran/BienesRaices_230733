import nodemailer from 'nodemailer'
import dotenv from 'dotenv'

dotenv.config({path: '.env'})

const emailAfterRegister=async (newUserData)=>{
    const transport = nodemailer.createTransport({
        host: process.env.EMAIL_HOST,
        port: process.env.EMAIL_PORT,
        auth:{
            user:process.env.EMAIL_USER,
            pass:process.env.EMAIL_PASS
        }
    })

    //console.log(data)
    const{email, name, token}=newUserData

    //Enviar el email
    await transport.sendMail({
        from: 'bienesraices_230297.com',
        to:email,
        subject: 'Bienvenido/a al BienesRaices_230297',
        text: 'Ya casi puedes usar nuestra plataforma, solo falta...',
        html: `<p> Hola, <span style="color: red"> ${name}</span>, <br>
        Bienvenido a la plataforma BienesRaíces, elsitio seguro donde podrás buscar, comprar y ofertar propiedades a travéz de internet.
        <br>
        <p>Ya sólo necesitamos que confirmes la cuenta que create, dando click a la siguiente
        liga: <a href='${process.env.BACKEND_DOMAIN}:${process.env.BACKEND_PORT}/auth/confirmAccount/${token}'> Confirmar cuenta</a></p>
        <br>
        <p>Si tu no has creado la cuenta, ignora este mensaje.</p>` 
    })
}

export{emailAfterRegister}
