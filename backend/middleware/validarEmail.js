import crypto from 'crypto';
import nodemailer from 'nodemailer'

export const generarTokenVerificacion = () => {
  return crypto.randomBytes(32).toString('hex');
};

export const enviarCorreoVerificacion = async (usuario, token) => {

  const transporter = nodemailer.createTransport({
    host: 'smtp.gmail.com',
    port: 465, // Usa 587 si prefieres STARTTLS
    secure: true, // true para 465, false para 587
    auth: {
      user: process.env.EMAIL,
      pass: process.env.PASSWORD_EMAIL
    }
  });
  const FRONTEND_URL = process.env.FRONTEND_URL || `http://localhost:3000/api/validacion/${token}`;

  const mailOptions = {
    to: usuario.email,
    subject: 'Creación de Cuenta',
    html: `
      <h1>Universidad de Cundinamarca</h1>
      <p>Para verificar tu cuenta da click en el siguiente enlace</p>
       <a href="${FRONTEND_URL}">Verificacion de correo</a>
      <p>Este enlace expirará en 10 minutos</p>
    `
  };

  try {
    await transporter.sendMail(mailOptions);
  } catch (error) {
    console.log("error al enviar el mensaje")
  }
};


