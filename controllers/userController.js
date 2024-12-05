import {check, validationResult} from 'express-validator'
import User from '../models/User.js'
import { generatetId } from '../helpers/tokens.js'
import { emailAfterRegister, emailChangePassword } from '../helpers/emails.js' 


const formularioLogin = (request, response) =>   {
    response.render("auth/login", {
        page : "Ingresa a la plataforma",
    })
}

const formularioRegister = (request, response) =>  {
    response.render('auth/register', {
        page : "Crea una nueva cuenta...", 
        csrfToken: request.csrfToken()
    })};

const formularioPasswordRecovery = (request, response) =>  {
response.render('auth/passwordRecovery', {
        page : "Recuperación de Contraseña",
        csrfToken: request.csrfToken()
 })};

const  createNewUser= async(request, response) =>
{
    //console.log("Iniciando la validación previa a la creación de la cuenta")
    //Validación de los campos que se reciben del formulario
    await check('nombre_usuario').notEmpty().withMessage("El nombre del usuario es un campo obligatorio.").run(request)
    await check('correo_usuario').notEmpty().withMessage("El correo electrónico es un campo obligatorio.").isEmail().withMessage("El correo electrónico no tiene el formato de: usuario@dominio.extesion").run(request)
    await check('pass_usuario').notEmpty().withMessage("La contraseña es un campo obligatorio.").isLength({min:8}).withMessage("La constraseña debe ser de almenos 8 carácteres.").run(request)
    await check("pass2_usuario").equals(request.body.pass_usuario).withMessage("La contraseña y su confirmación deben coincidir").run(request)

    let result = validationResult(request)
    
    //Verificamos si hay errores de validacion
    if(!result.isEmpty())
    {
        return response.render("auth/register", {
            page: 'Error al intentar crear la Cuenta de Usuario',
            errors: result.array(),
            csrfToken: request.csrfToken(),
            user: {
                name: request.body.nombre_usuario,
                email: request.body.email
            }
        })
    }
    
    //Desestructurar los parametros del request
    const {nombre_usuario:name , correo_usuario:email, pass_usuario:password} = request.body

    //Verificar que el usuario no existe previamente en la bd
    const existingUser = await User.findOne({ where: { email}})

    console.log(existingUser);

    if(existingUser)
    { 
        return response.render("auth/register", {
        page: 'Error al intentar crear la Cuenta de Usuario',
        csrfToken: request.csrfToken(),
        errors: [{msg: `El usuario ${email} ya se encuentra registrado.` }],
        user: {
            name:name
        }
    })
    }
         
    /*console.log("Registrando a un nuevo usuario.")
    console.log(request.body);*/

    //Registramos los datos en la base de datos.
        const newUser = await User.create({
        name: request.body.nombre_usuario, 
        email: request.body.correo_usuario,
        password: request.body.pass_usuario,
        token: generatetId()
        }); 
        //response.json(newUser); 

    //Enviar el correo de confirmación
    emailAfterRegister({
        name: newUser.name,
        email: newUser.email,
        token: newUser.token 
    })


    response.render('templates/message', {
        csrfToken: request.csrfToken(),
        page: 'Cuenta creada satisfactoriamente.',
        msg: `Hemos enviado un correo a : ${email}, para la confirmación se cuenta.`
    })
    
}

const confirm = async(request, response) => 
    {
        const {token } = request.params
        //validarToken - Si existe
        console.log(`Intentando confirmar la cuenta con el token: ${token}`)
        const userWithToken = await User.findOne({where: {token}});

        if(!userWithToken){
            response.render('auth/accountConfirmed', {
                page: 'Error al confirmar tu cuenta.',
                msg: 'El token no existe o ya ha sido utilizado, si ya has confirmado tu cuenta y aún no puedes ingresar, recupera tu contraseña aqui.',
                error: true
            })
        }
        else
        {
            userWithToken.token=null
            userWithToken.confirmed=true;
            await userWithToken.save();

            response.render('auth/accountConfirmed', {
                page: 'Excelente..!',
                msg: 'Tu cuenta ha sido confirmada de manera exitosa.',
                error: false
            })

        }
        
        
        //confirmar cuenta
        //enviar mensaje
        

    }

const passwordReset = async(request, response) =>{

    //console.log("Validando los datos para la recuperación de la contraseña")
    //Validación de los campos que se reciben del formulario
    //Validación de Frontend
    await check('correo_usuario').notEmpty().withMessage("El correo electrónico es un campo obligatorio.").isEmail().withMessage("El correo electrónico no tiene el formato de: usuario@dominio.extesion").run(request)
    let result = validationResult(request)
    
    //Verificamos si hay errores de validacion
    if(!result.isEmpty())
    {
        console.log("Hay errores")
        return response.render("auth/passwordRecovery", {
            page: 'Error al intentar resetear la contraseña',
            errors: result.array(),
            csrfToken: request.csrfToken()
        })
    }
    
    //Desestructurar los parametros del request
    const {correo_usuario:email} = request.body

    //Validacion de BACKEND
    //Verificar que el usuario no existe previamente en la bd
    const existingUser = await User.findOne({ where: { email, confirmed:1}})

    if(!existingUser)
    { 
        
        return response.render("auth/passwordRecovery", {
        page: 'Error, no existe una cuenta autentificada asociada al correo electrónico ingresado.',
        csrfToken: request.csrfToken(),
        errors: [{msg: `Por favor revisa los datos e intentalo de nuevo` }],
        user: {
            email:email
        }
    })
    }
        
        console.log("El usuario si existe en la bd")
        //Registramos los datos en la base de datos.
        existingUser.password="";
        existingUser.token=  generatetId();
        existingUser.save();
      

    //Enviar el correo de confirmación
    emailChangePassword({
        name: existingUser.name,
        email: existingUser.email,
        token: existingUser.token   
    })


    response.render('templates/message', {
        csrfToken: request.csrfToken(),
        page: 'Solicitud de actualización de contraseña aceptada',
        msg: `Hemos enviado un correo a : ${email}, para la la actualización de tu contraseña.`
    })


}


const verifyTokenPasswordChange =async(request, response)=>{

    const {token} = request.params;
    const userTokenOwner = await User.findOne({where :{token}})

    if(!userTokenOwner)
        { 
            response.render('templates/message', {
                csrfToken: request.csrfToken(),
                page: 'Error',
                msg: 'El token ha expirado o no existe.'
            })
        }

     
   
    response.render('auth/reset-password', {
        csrfToken: request.csrfToken(),
        page: 'Restablece tu password',
        msg: 'Por favor ingresa tu nueva contraseña'
    })
}

const updatePassword = async (request, response) => {

    const { token } = request.params;

    // Validar que el token existe en la base de datos
    const userTokenOwner = await User.findOne({ where: { token } });

    if (!userTokenOwner) {
        return response.render("auth/reset-password", {
            page: 'Error al intentar crear la Cuenta de Usuario',
            errors: [{ msg: 'Token inválido o expirado' }],
            csrfToken: request.csrfToken(),
            token: token
        });
    }

    // Validar campos de contraseñas
    await check('new_password')
        .notEmpty().withMessage("La contraseña es un campo obligatorio.")
        .isLength({ min: 8 }).withMessage("La contraseña debe ser de al menos 8 carácteres.")
        .run(request);

    await check("confirm_new_password")
        .equals(request.body.new_password)
        .withMessage("La contraseña y su confirmación deben coincidir")
        .run(request);

    let result = validationResult(request);

    if (!result.isEmpty()) {
        return response.render("auth/reset-password", {
            page: 'Error al intentar crear la Cuenta de Usuario',
            errors: result.array(),
            csrfToken: request.csrfToken(),
            token: token
        });
    }

    // Actualizar la contraseña en la base de datos
    userTokenOwner.password = request.body.new_password;
    userTokenOwner.token = null;  // Anular el token
    await userTokenOwner.save();

    // Renderizar la respuesta
    response.render('auth/accountConfirmed', {
        page: 'Excelente..! ',
        msg: 'Tu contraseña ha sido confirmada de manera exitosa.',
        error: false
    });
};

export {formularioLogin, formularioRegister, formularioPasswordRecovery, createNewUser, confirm, passwordReset, verifyTokenPasswordChange, updatePassword}