import { check, validationResult } from 'express-validator';
import User from '../models/User.js';
import { generateId } from '../helpers/tokens.js';
import { emailAfterRegister } from '../helpers/emails.js';

// Renderizar formulario de inicio de sesión
const formularioLogin = (req, res) => {
    res.render('auth/login', {
        autenticado: false,
        page: 'Ingresa a la plataforma',
        csrfToken: req.csrfToken(),
    });
};

// Renderizar formulario de registro
const formularioRegister = (req, res) => {
    res.render('auth/register', {
        page: 'Crea una nueva cuenta',
        csrfToken: req.csrfToken(),
    });
};

// Crear un nuevo usuario
const createNewUser = async (req, res) => {
    // Validaciones
    await check('nombre_usuario').notEmpty().withMessage('El nombre no puede ir vacío').run(req);
    await check('correo_usuario').notEmpty().withMessage('El correo electrónico es un campo obligatorio')
        .isEmail().withMessage('No es un email correcto').run(req);
    await check('pass_usuario').notEmpty().withMessage('La contraseña es un campo obligatorio')
        .isLength({ min: 8 }).withMessage('La contraseña debería tener al menos 8 caracteres').run(req);
    await check('pass2_usuario').equals(req.body.pass_usuario).withMessage('Las contraseñas no coinciden').run(req);

    const result = validationResult(req);

    // Si hay errores, regresar al formulario con los mensajes
    if (!result.isEmpty()) {
        return res.render('auth/register', {
            page: 'Error al intentar crear la cuenta',
            errors: result.array(),
            user: {
                name: req.body.nombre_usuario,
                email: req.body.correo_usuario,
            },
            csrfToken: req.csrfToken(), // Asegurarse de enviar el token CSRF nuevamente
        });
    }

    // Desestructurar los parámetros del request
    const { nombre_usuario: name, correo_usuario: email, pass_usuario: password } = req.body;

    // Verificar que el usuario no exista
    const existingUser = await User.findOne({ where: { email } });
    if (existingUser) {
        return res.render('auth/register', {
            page: 'Error al intentar crear la cuenta de Usuario',
            errors: [{ msg: `El usuario ${email} ya está registrado.` }],
            user: { name },
            csrfToken: req.csrfToken(), // Asegurarse de enviar el token CSRF nuevamente
        });
    }

    // Crear nuevo usuario
    try {
        const newUser = await User.create({
            name,
            email,
            password,
            token: generateId(),
        });

        console.log("Nuevo usuario creado:", newUser);

        // Enviar correo de confirmación
        emailAfterRegister({
            name: newUser.name,
            email: newUser.email,
            token: newUser.token,
        });

        res.render('templates/message', {
            page: 'Cuenta creada correctamente',
            message: `Hemos enviado un email de confirmación al correo: ${email}`,
        });
    } catch (error) {
        console.error("Error al crear usuario:", error);
        res.status(500).json({ error: 'Error al registrar el usuario' });
    }
};

// Confirmar cuenta
const confirm = async (req, res) => {
    const { token } = req.params;
    console.log(`Token recibido: ${token}`); // Verificar si el token se está recibiendo correctamente

    // Verificar si el token es válido
    const user = await User.findOne({ where: { token } });
    if (!user) {
        return res.render('auth/confirmAccount', {
            page: 'Error al confirmar tu cuenta...',
            msg: 'Hubo un error al confirmar tu cuenta, intenta de nuevo.',
            error: true,
        });
    }

    // Confirmar la cuenta
    user.token = null;
    user.confirmacion = true; 
    await user.save(); // Guardar cambios

    console.log("Usuario confirmado:", user);

    res.render('auth/confirmAccount', {
        page: 'Cuenta Confirmada',
        msg: 'La cuenta se ha confirmado correctamente.',
        error: false,
    });
};

// Renderizar formulario de recuperación de contraseña
const formularioPasswordRecovery = (req, res) => {
    res.render('auth/passwordRecovery', {
        page: 'Recupera tu contraseña',
        csrfToken: req.csrfToken(),
    });
};

// Recuperar contraseña
const resetpassword = async (req, res) => {
    // Validar el correo electrónico
    await check('correo_usuario').notEmpty().withMessage('El correo electrónico es un campo obligatorio')
        .isEmail().withMessage('No es un email correcto').run(req);

    const result = validationResult(req);

    // Si hay errores, regresar al formulario con los mensajes
    if (!result.isEmpty()) {
        return res.render('auth/passwordRecovery', {
            page: 'Error al intentar recuperar la contraseña',
            errors: result.array(),
            email: req.body.correo_usuario,
            csrfToken: req.csrfToken(), // Asegurarse de enviar el token CSRF nuevamente
        });
    }

    // Verificar que el usuario exista
    const { correo_usuario: email } = req.body;
    const user = await User.findOne({ where: { email } });
    if (!user) {
        return res.render('auth/passwordRecovery', {
            page: 'Error al intentar recuperar la contraseña',
            errors: [{ msg: `El usuario ${email} no está registrado.` }],
            csrfToken: req.csrfToken(), // Asegurarse de enviar el token CSRF nuevamente
        });
    }

    // Aquí puedes añadir la lógica para enviar un correo de recuperación de contraseña o mostrar un mensaje de éxito
    res.render('templates/message', {
        page: 'Recuperación de contraseña',
        message: `Si el usuario ${email} está registrado, recibirás un email con instrucciones para recuperar tu contraseña.`,
    });
};

export {
    formularioLogin,
    formularioRegister,
    createNewUser,
    confirm,
    formularioPasswordRecovery,
    resetpassword,
};
