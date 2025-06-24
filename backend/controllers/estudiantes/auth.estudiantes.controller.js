import Usuario from '../../schemas/esquemaUsuario.js';
import bcrypt from 'bcrypt';
import { validarRegistro } from '../../schemas/validarDatos.js';


const buscarEstudiante = async (email) => {
  try {
    const estudiante = await Usuario.findOne({ email });
    return estudiante ?? null;
  } catch (err) {
    console.error('Error al buscar estudiante:', err);
    return null;
  }
};



export const registroEstudiante = async (req, res) => {
  const validarDatos = validarRegistro(req.body);

  if (!validarDatos.success) {
    res.status(400).json({
      error: validarDatos.error
    })
  }
  else {

    try {

      const { name, email, password } = validarDatos.data;
      const validarEstudiante = await buscarEstudiante(email);

      if(validarEstudiante !== null){
       return res.status(409).json({
          message:'El email ya ha sido registrado!'
        })
      }

      const passwordHashed = await bcrypt.hash(password, 10);

      const nuevoEstudiante = new Usuario({
        name,
        email,
        password: passwordHashed
      });

      const registrarEstudiante = await nuevoEstudiante.save();

      if (registrarEstudiante) {
        return res.status(201).json({
          status: "success",
          message: 'Usuario Registrado con Éxito'
        })
      }

    } catch (err) {
      console.log(err);
    }
  }
}

