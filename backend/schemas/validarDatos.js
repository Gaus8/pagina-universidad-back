import { z } from 'zod';

const regex = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[.!@#$%^&*])[\S]{8,16}$/;

const userSchema = z.object({
  name: z.string()
    .min(6, { message: 'error1' }),

  email: z.string().email({
    message: 'El correo debe ser un correo valido'
  }).refine(
    (email) => email.endsWith('@ucundinamarca.edu.co'), {
      message: 'error2'
    }
  ),

  password: z.string().regex(regex, { message: 'error3' }),

  role: z.enum(['student', 'teacher', 'admin']).optional().default('student')

});

export function validarRegistro (input) {
  return userSchema.safeParse(input);
};

export function validarLogin (input) {
  return userSchema.partial().safeParse(input);
}
