import Usuario from '../../schemas/esquemaUsuario.js';
import bcrypt from 'bcrypt';
import { validarRegistro, validarLogin } from '../../schemas/validarDatos.js';
import { generarTokenVerificacion, enviarCorreoVerificacion } from '../../middleware/validarEmail.js';
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
      error: validarDatos.error.issues
    })
  }
  else {

    try {

      const { name, email, password } = validarDatos.data;
      const validarEstudiante = await buscarEstudiante(email);
      const tokenValidacion = generarTokenVerificacion();


      if (validarEstudiante !== null) {
        return res.status(409).json({
          message: 'El email ya ha sido registrado!'
        })
      }

      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(password, salt);
      const nuevoRegistro = {
        name,
        email,
        password: hashedPassword,
        verificationToken: tokenValidacion
      };

        await enviarCorreoVerificacion(nuevoRegistro, tokenValidacion);
      const sendMessage = await Usuario.create(nuevoRegistro); //Guardar el nuevo usuario en la base de datos
    

      if (sendMessage) {
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

    if (!estudiante.verified) { //verificar si el usuario ya verifico la cuenta
      return res.status(403).json({
        status: 'error',
        message: 'Debes verificar tu cuenta por correo antes de iniciar sesión.'
      });
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
        status: 'success',
        message: "Login Exitoso"
      })
  }
}

export const verificarCuenta = async (req, res) => {
  const { token } = req.params;
  try {
    const user = await Usuario.findOne({ verificationToken: token });

    if (!user) {
      return res.status(400).json({ mensaje: 'Token de verificación inválido o expirado.' });
    }

    user.verified = true;
    user.verificationToken = undefined;
    await user.save();

    // Responder con mensaje JSON, el frontend se encarga de la redirección
    res.status(200).json({ mensaje: 'Cuenta verificada correctamente.' });
  } catch (err) {
    res.status(500).json({ mensaje: 'Error al verificar la cuenta.' });
  }
};