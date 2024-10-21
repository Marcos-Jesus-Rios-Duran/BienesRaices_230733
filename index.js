
const express = require('express'); // Importar la librería para crear un servidor web

// Instanciar nuestra aplicación web
const app = express();

// Configuramos nuestro servidor web
const port = 3000;
app.listen(port, () => {
    console.log(`La aplicación está funcionando en el puerto ${port}`);
});
app.get("/", function(req,res){
    res.send("Hola mundo desde Node, atraves del navegador ")
})

app.get("/quien-soy ", function(req,res){
    res.send("Hola mundo desde NODE, atraves del navegador");
})