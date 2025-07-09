import express from 'express';
import { registroEstudiante, loginEstudiante, verificarCuenta } from '../controllers/estudiantes/auth.estudiantes.controller.js';

export const routerEstudiante = express.Router();

routerEstudiante.post('/registro',registroEstudiante);
routerEstudiante.post('/login',loginEstudiante);

routerEstudiante.get('/validacion/:token', verificarCuenta);