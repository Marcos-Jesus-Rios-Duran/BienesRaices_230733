import express from 'express';
import generalRoutes from './Routes/generalRoutes.js'
import userRoutes from './routes/userRoutes.js'
import db from './db/config.js'
import dotenv from 'dotenv'

dotenv.config({path: '.env'})


//conexión a la base de datos.
try{
    await db.authenticate();  //verifica las credenciales del usuario
    db.sync(); //sincronizo las tablas con los modelos
    console.log("Conexión correcta a la Base de Datos");

}catch(error){

    console.log(error);
}


//const express=require(`express`);//Importar la libreria para crear un servidor web

//Ibstanciar nuestra aplicacion web
const app=express()

//Habilitar la lectura de datos de formularios
app.use(express.urlencoded({ extended: true }));


 
//Habilitar Pug 
app.set('view engine', 'pug')
app.set('views', './views')

//Definir la carpeta pública de recursos estáticos (assets)
app.use(express.static('./public'));


// configuramos nuestro servidor web
const port= process.env.BACKEND_PORT; 
app.listen(port, ()=>{
    console.log(`La aplicación ha iniciado al puerto: ${port}`);
})

//Probamos las rutas para poder presentar mensajes al usuario a través del navegador
/*app.get("/", function(req,res){
    res.send("Hola mundo desde Node, a través del navegador")
})

app.get("/QuienSoy", function(req, res){
    res.json({"estudiante": "Esther Gonzalez Peralta",
        "carrera": "TI DSM",
        "grado": "4°",
        "grupo":"B",
        "asignatura": "Aplicaciones web orientada a servicios"

    })
})*/

//Routing - Enrutamiento
app.use('/',generalRoutes);
///app.use('/usuario/',userRoutes);
app.use('/auth/',userRoutes);
