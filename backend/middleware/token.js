import jwt from 'jsonwebtoken'

const validarToken = (req, res) =>{

  const token = req.cookies.access_token;
  
  if(!token){
    res.status(403).json({
      message: 'Ingreso Invalido'
    })
  }

  try{
    const data = jwt.verify(token, process.env.JWT_TOKEN);
    req.user = data;
    next();
  }
  catch (error) {
    console.error('Error de autenticación:', error);
    return res.status(403).json({ message: 'ACCESS NO AUTHORIZED' });
  }
}