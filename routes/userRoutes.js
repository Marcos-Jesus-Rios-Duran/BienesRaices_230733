import express from 'express';

import {formularioLogin, formularioRegister, createNewUser,confirm, formularioPasswordRecovery} from '../controllers/userController.js';
const router = express.Router()

//GET- se utiliza para la lectura de datos e informacion del servidor al cliente
//EndPoint- son las rutas para acceder a las secciones o funciones de nuestra aplicacion web
//2 componentes de una peticion ruta (a donde voy), funcion callback (que hago)
//":" en una ruta define de manera posicional los parametros de entrada 
router.get("/busquedaPorID/:id", (request, response)=>{
    response.send(`Se esta solicitando buscar al usuario con ID: ${request.params.id}`)
})  //2 componentes de una petición - ruta -callback

//POST- se utiliza para el envio de datos e inforamción del cliente al servidor 
router.post("/newUser", createNewUser);

//PUT- se utiliza para la actualizacion total de informacion del cliente al servidor 

router.put("/replaceUserByEmail/:name/:email/:password", function(a, b){
    b.send(`Se esta solicitado la reemplazo de toda la información del usuario: ${a.params.name},
        con correo: ${a.params.email} y contraseña: ${a.params.password}`)
}) 

//PATCH- S e utiliza para la actualización parcial
router.patch("/updatePassword/:email/:newPassword/:newPasswordConfirm", function(request,response){
    const {email, newPassword, newPasswordConfirm }= request.params //destructuracion de un objeto

    if(newPassword===newPasswordConfirm)
    {
        response.send(`Se a solicitado la actualizacion de la contraseña del ususario con correo: ${email}, se aceptan los cambios ya que la constraseña y confirmacion son la misma`)
        console.log(newPassword);
        console.log(newPasswordConfirm);
    }
    else
    {
        response.send(`Se a solicitado la actualizacion de la contraseña del ususario con correo: ${email} con la nueva contraseña ${newPassword}, pero se reachaza el cambio dado que la nueva contraseña y su confirmacion no coincidan`)
        console.log(newPassword);
        console.log(newPasswordConfirm);
    }
})

//DELETE
router.delete("/deleteUser/:email", function(request,response){
    response.send(`Se esta solicitando la eliminacion del usuario asociado al correo: ${request.params.email}`)
})

router.get("/login", formularioLogin)
router.get("/createAccount", formularioRegister)
router.get("/passwordRecovery", formularioPasswordRecovery)
router.get("/confirmAccount/:token", confirm)
router.post("/createAccount", createNewUser)

export default router;