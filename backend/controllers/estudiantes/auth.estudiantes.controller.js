import Usuario from '../../schemas/esquemaUsuario.js';
import bcrypt from 'bcrypt';
import { validarRegistro, validarLogin } from '../../schemas/validarDatos.js';
import jwt from 'jsonwebtoken';

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

      if (validarEstudiante !== null) {
        return res.status(409).json({
          message: 'El email ya ha sido registrado!'
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

export const loginEstudiante = async (req, res) => {
  const validarDatos = validarLogin(req.body);

  if (!validarDatos.success) {
    res.status(400).json({
      error: validarDatos.error
    })
  }
  else {
    const { email, password } = validarDatos.data;
    const estudiante = await buscarEstudiante(email);

    if (estudiante === null) {
      return res.status(404).json({
        status: 'error',
        message: "El email no se encuntra registrado"
      })
    }

    const validarPassword = await bcrypt.compare(password, estudiante.password);
    if (!validarPassword) {
      return res.status(404).json({
        status: 'error',
        message: 'Contraseña incorrecta'
      });
    }

    const token = jwt.sign(
      {
        id: estudiante._id,
        name: estudiante.name,
        email: estudiante.email
      },
      process.env.JWT_TOKEN,
      {
        expiresIn: '1h'
      }
    )

    res.cookie('access_token', token, {
      httpOnly: true,        // No accesible desde JS
      secure: false,          // Solo HTTPS
      sameSite: 'Strict',    // Evita envío entre sitios
      maxAge: 3600000,       // 1 hora
    })
    .status(200).json({
      status:'success',
      message:"Login Exitoso"
    })


  }

}
