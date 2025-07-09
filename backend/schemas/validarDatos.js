import { z } from 'zod';

const regex = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[.!@#$%^&*])[\S]{8,16}$/;

const userSchema = z.object({

  name: z.string()
    .min(12, { message: 'Se debe incluir al menos el primer nombre y el primer apellido' })
    .regex(/^[^0-9]*$/, { message: 'El nombre no debe contener números' }),

  email: z.string().email({
    message: 'El correo debe ser institucional "@ucundinamarca.edu.co"'
  }).refine(
    (email) => email.endsWith('@ucundinamarca.edu.co'), {
    message: 'El correo debe ser institucional "@ucundinamarca.edu.co"'
  }
  ),

  password: z.string().regex(regex, { message: 'La contraseña debe tener entre 8 y 16 caracteres, con mayúsculas, minúsculas, números y un carácter especial' }),

  role: z.enum(['student', 'teacher', 'admin']).optional().default('student')

});

export function validarRegistro(input) {
  return userSchema.safeParse(input);
};

export function validarLogin(input) {
  return userSchema.partial().safeParse(input);
}

