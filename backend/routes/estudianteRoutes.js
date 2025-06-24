import express from 'express';
import { registroEstudiante } from '../controllers/estudiantes.js';

export const routerEstudiante = express.Router();

routerEstudiante.post('/registro',registroEstudiante);