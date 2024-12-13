// Ejemplo de activación de HOT RELOAD
/*console.log("Hola desde NodeJS, esto esta en hot reload")*/

/*const express = require('express'); */
// Librerías globales del proyecto
import express from 'express';
import csrf from 'csurf';
import cookieParser from 'cookie-parser';
// Librerías específicas del proyecto
import generalRoutes from './routes/generalRoutes.js';
import userRoutes from './routes/userRoutes.js';
import db from './db/config.js';
import dotenv from 'dotenv';
import properties from './routes/properties.js'

dotenv.config({ path: '.env' });

const app = express();

// Habilitamos la lectura de datos desde formularios.
app.use(express.urlencoded({ extended: true }));

// Habilitar Cookie Parser
app.use(cookieParser());

// Habilitar CSRF
app.use(csrf({ cookie: true }));

// Configurar Template Engine - PUG
app.set('view engine', 'pug');
app.set('views', './views');

// Definir la carpeta pública de recursos estáticos (assets)
app.use(express.static('./public'));

// Conexión a la BD
try {
  await db.authenticate(); // Verifico las credenciales del usuario
  db.sync(); // Sincronizo las tablas con los modelos
  console.log('Conexión exitosa a la base de datos.');
} catch (error) {
  console.log(error);
}

// Configuramos nuestro servidor web
const port = process.env.BACKEND_PORT;
app.listen(port, () => {
  console.log(`La aplicación ha iniciado en el puerto: ${port}`);
});

// Routing - Enrutamiento para peticiones
app.use('/', generalRoutes);
app.use('/auth', userRoutes);
app.use('/myProperties',properties)
