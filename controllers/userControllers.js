const formularioLogin = (request, response) =>   {
    response.render("auth/login", {
        page : "Ingresa a la plataforma"
    })
}

const formularioRegister = (request, response) =>  {
    response.render('auth/register', {
        page : "Crea una nueva cuenta..."
    })};

const formularioPasswordRecovery = (request, response) =>  {
response.render('auth/passwordRecovery', {
        page : "Recuperación de Contraseña"
 })};
 
 const registrer= async(req,res)=>{
    const usuer=await Usuario.create(req.body);
    res.json(usuario);
 }
export {formularioLogin, formularioRegister, formularioPasswordRecovery,registrer}