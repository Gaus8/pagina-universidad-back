import express from 'express';
import { registroEstudiante } from '../controllers/estudiantes/auth.estudiantes.controller.js';

export const routerEstudiante = express.Router();

routerEstudiante.post('/registro',registroEstudiante);