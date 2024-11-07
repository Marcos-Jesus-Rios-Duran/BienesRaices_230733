// Ejemplo de activación de HOT RELOAD
/*console.log("Hola desde NodeJS, esto esta en hot reload")*/

/*const express = require('express'); */


import express from 'express';
import generalRoutes from './Router/generalRouter.js'
import userRoutes from './Router/userRouters.js'
import db from './config/db.js'


const app = express()
//conexion a la base de datos 
try{
    await db.authenticate();
    console.log('conexion exitosa a la base de datos ')
} catch(error){
    console.log(error)
}
// Configurar Templeate Engine - PUG
app.set('view engine', 'pug')
app.set('views','./views')

//Definir la carpeta ública de recursos estáticos (assets)
app.use(express.static('./public'));

// Configuramos nuestro servidor web
const port =3000;
app.listen(port, ()=>{
    console.log(`La aplicación ha iniciado en el puerto: ${port}` );
})

// Routing - Enrutamiento para peticiones
app.use('/',generalRoutes);
app.use('/auth',userRoutes);

app.use(express.static('./public'))