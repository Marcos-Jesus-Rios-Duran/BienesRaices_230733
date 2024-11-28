//globales
import express from 'express';
import cookieParser from 'cookie-parser';
import csrf from 'csurf';
//librerias creadas por nosotros
import generalRoutes from './routes/generalRoutes.js';
import userRoutes from './routes/userRoutes.js';
import db from './db/config.js';
import dotenv from 'dotenv';
dotenv.config({ path: '.env' });

// Conexión a la base de datos
const connectDB = async () => {
    try {
        await db.authenticate();  // Verifica las credenciales del usuario
        db.sync(); // Sincroniza las tablas con los modelos
        console.log("Conexión correcta a la Base de Datos");
    } catch (error) {
        console.log(error);
    }
};

connectDB(); // Llamar a la función asíncrona para conectar a la base de datos

// Instanciar nuestra aplicación web
const app = express();

// Habilitar la lectura de datos de formularios
app.use(express.urlencoded({ extended: true }));

// Habilitar Pug
app.set('view engine', 'pug');
app.set('views', './views');

// Definir la carpeta pública de recursos estáticos (assets)
app.use(express.static('./public'));

// Middleware para manejar cookies y CSRF
app.use(cookieParser());
app.use(csrf({ cookie: true }));

app.use((req, res, next) => {
    res.locals.csrfToken = req.csrfToken();
    next();
});

// Configuramos nuestro servidor web
const port = process.env.BACKEND_PORT || 3000;
app.listen(port, () => {
    console.log(`La aplicación ha iniciado en el puerto: ${port}`);
});

// Routing - Enrutamiento
app.use('/', generalRoutes);
app.use('/auth/', userRoutes);
