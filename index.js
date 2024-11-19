// Ejemplo de activación de HOT RELOAD
/*console.log("Hola desde NodeJS, esto esta en hot reload")*/

/*const express = require('express'); */


import express from 'express';
import generalRoutes from './routes/generalRoutes.js'
import userRoutes from './routes/userRoutes.js'
import db from './db/config.js'

const app = express()

// Configurar Templeate Engine - PUG
app.set('view engine', 'pug')
app.set('views','./views')

//Definir la carpeta ública de recursos estáticos (assets)
app.use(express.static('./public'));

//Conexión a la BD
try
{
  await db.authenticate();  // Verifico las credenciales del usuario
  db.sync();  // Sincronizo las tablas con los modelos
  console.log("Conexión exitosa a la base de datos.")
}
catch(error)
{
    console.log(error)
}

//Habilitamos la lectura de datos desde formularios.
app.use(express.urlencoded({encoded:true}))



// Configuramos nuestro servidor web
const port =3000;
app.listen(port, ()=>{
    console.log(`La aplicación ha iniciado en el puerto: ${port}` );
})

// Routing - Enrutamiento para peticiones
app.use('/',generalRoutes);
app.use('/auth',userRoutes);

