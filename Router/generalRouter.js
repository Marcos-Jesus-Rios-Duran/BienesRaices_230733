import express from 'express';

const router = express.Router();


router.get("/", function(req, res) {
    res.send("Hola desde la Web, en NodeJS")
})

router.get("/quienEres", function(req, res) {
    res.json(
        {
            "nombre": "Marcos Jesus Rios Duran",
            "carrera": "TI DSM",
            "grado": "4°",
            "grupo": "B"
        }
    )
})


export default router;    //Esta palabra reservada de JS me permite exportar los elementos definidos y utilizarlos en otros archivos del mismo sitio.