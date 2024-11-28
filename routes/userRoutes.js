import express from 'express';
import {
    formularioLogin,
    formularioRegister,
    createNewUser,
    confirm,
    formularioPasswordRecovery,
    resetpassword
} from '../controllers/userController.js';

const router = express.Router();

// GET - Se utiliza para la lectura de datos e información del servidor al cliente
// EndPoint - Son las rutas para acceder a las secciones o funciones de nuestra aplicación web

router.get("/busquedaPorID/:id", (req, res) => {
    res.send(`Se está solicitando buscar al usuario con ID: ${req.params.id}`);
});

// POST - Se utiliza para el envío de datos e información del cliente al servidor 
router.post("/newUser", createNewUser);

// PUT - Se utiliza para la actualización total de información del cliente al servidor 
router.put("/replaceUserByEmail/:name/:email/:password", (req, res) => {
    res.send(`Se está solicitando la sustitución de toda la información del usuario: ${req.params.name}, con correo: ${req.params.email} y contraseña: ${req.params.password}`);
});

// PATCH - Se utiliza para la actualización parcial
router.patch("/updatePassword/:email/:newPassword/:newPasswordConfirm", (req, res) => {
    const { email, newPassword, newPasswordConfirm } = req.params; // Desestructuración de un objeto

    if (newPassword === newPasswordConfirm) {
        res.send(`Se ha solicitado la actualización de la contraseña del usuario con correo: ${email}. Se aceptan los cambios ya que la contraseña y la confirmación son las mismas.`);
        console.log(newPassword);
        console.log(newPasswordConfirm);
    } else {
        res.send(`Se ha solicitado la actualización de la contraseña del usuario con correo: ${email}, pero se rechaza el cambio dado que la nueva contraseña y su confirmación no coinciden.`);
        console.log(newPassword);
        console.log(newPasswordConfirm);
    }
});

// DELETE - Se utiliza para la eliminación de recursos
router.delete("/deleteUser/:email", (req, res) => {
    res.send(`Se está solicitando la eliminación del usuario asociado al correo: ${req.params.email}`);
});

// Rutas adicionales basadas en tus controladores y archivos Pug
router.get("/login", formularioLogin);
router.get("/createAccount", formularioRegister);
router.get("/passwordRecovery", formularioPasswordRecovery);
router.post("/resetpassword", resetpassword);
router.get("/confirmAccount/:token", confirm);
router.post("/createAccount", createNewUser);

export default router;
