//Importacion de dependencias necesarias para el funcionamiento del backend con express
import express from 'express';
import cors from 'cors';
import 'dotenv/config';
import { dbConnection } from './backend/database/connection.js';
import { routerEstudiante } from './backend/routes/estudianteRoutes.js';

const app = express();

app.use(express.json());
app.use(cors());
app.use('/api',routerEstudiante);
const PORT = process.env.PORT ?? 3000;

//Creacion de funcion para la validacion de la conexion e inicio del servidor
const startServer = async () => {
  try {
    await dbConnection();
    app.listen(PORT, () => {
      console.log(`Servidor escuchando en http://localhost:${PORT}`);
    });
  } catch (error) {
    console.error('Error al conectar a la base de datos:', error);
    process.exit(1); // Finaliza el proceso si no se puede conectar
  }
};

startServer();