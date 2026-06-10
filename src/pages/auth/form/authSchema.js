import { z } from 'zod';

export const loginSchema = z.object({
    username: z
        .string()
        .min(1, 'El nombre de usuario es requerido')
        .min(3, 'El nombre de usuario debe tener al menos 3 caracteres'),
    password: z.string().min(6, 'Debe tener al menos 6 caracteres'),
});

export const registerSchema = z
    .object({
        firstName: z.string().min(1, 'El nombre es requerido').min(2, 'El nombre debe tener al menos 2 caracteres'),
        username: z
            .string()
            .min(1, 'El nombre de usuario es requerido')
            .min(3, 'El nombre de usuario debe tener al menos 3 caracteres'),
        cedula: z
            .string()
            .min(1, 'El número de cédula es requerido')
            .min(6, 'El número de cédula debe tener al menos 6 caracteres')
            .regex(/^[0-9]+$/, 'El número de cédula solo debe contener números'),
        password: z.string().min(6, 'Debe tener al menos 6 caracteres'),
        confirmPassword: z.string().min(1, 'Confirma tu contraseña'),
        // Campo de rol: admin (acceso completo) o viewer (solo lectura)
        role: z.enum(['admin', 'viewer'], { required_error: 'Selecciona un rol' }),
        securityQuestion1Id: z.number().min(1).optional(),
        securityAnswer1: z.string().min(2, 'La respuesta debe tener al menos 2 caracteres'),
        securityQuestion2Id: z.number().min(1).optional(),
        securityAnswer2: z.string().min(2, 'La respuesta debe tener al menos 2 caracteres'),
    })
    .refine((data) => data.password === data.confirmPassword, {
        message: 'Las contraseñas no coinciden',
        path: ['confirmPassword'],
    })
    .refine((data) => data.securityQuestion1Id !== undefined, {
        message: 'Selecciona una pregunta',
        path: ['securityQuestion1Id'],
    })
    .refine((data) => data.securityQuestion2Id !== undefined, {
        message: 'Selecciona una pregunta',
        path: ['securityQuestion2Id'],
    })
    .refine((data) => data.securityQuestion1Id !== data.securityQuestion2Id, {
        message: 'Las preguntas de seguridad deben ser diferentes',
        path: ['securityQuestion2Id'],
    });

// schema para buscar usuario por cédula
export const recoverPasswordCedulaSchema = z.object({
    cedula: z
        .string()
        .min(1, 'El número de cédula es requerido')
        .min(6, 'El número de cédula debe tener al menos 6 caracteres')
        .regex(/^[0-9]+$/, 'El número de cédula solo debe contener números'),
});

// schema para el paso 1: nombre de usuario
export const recoverPasswordUsernameSchema = z.object({
    username: z
        .string()
        .min(1, 'El nombre de usuario es requerido')
        .min(3, 'El nombre de usuario debe tener al menos 3 caracteres'),
});

// schema para el paso 2: preguntas de seguridad
export const recoverPasswordQuestionsSchema = z.object({
    answer1: z.string().min(1, 'La respuesta es requerida').min(2, 'La respuesta debe tener al menos 2 caracteres'),
    answer2: z.string().min(1, 'La respuesta es requerida').min(2, 'La respuesta debe tener al menos 2 caracteres'),
});

// schema para el paso 3: nueva contraseña
export const recoverPasswordNewPasswordSchema = z
    .object({
        newPassword: z.string().min(6, 'La contraseña debe tener al menos 6 caracteres'),
        confirmPassword: z.string().min(1, 'Confirma tu contraseña'),
    })
    .refine((data) => data.newPassword === data.confirmPassword, {
        message: 'Las contraseñas no coinciden',
        path: ['confirmPassword'],
    });

// Schema para cambiar contraseña desde configuración
export const changePasswordSchema = z
    .object({
        currentPassword: z.string().min(1, 'La contraseña actual es requerida'),
        newPassword: z.string().min(6, 'Debe tener al menos 6 caracteres'),
        confirmPassword: z.string().min(1, 'Confirma tu contraseña'),
    })
    .refine((data) => data.newPassword === data.confirmPassword, {
        message: 'Las contraseñas no coinciden',
        path: ['confirmPassword'],
    })
    .refine((data) => data.currentPassword !== data.newPassword, {
        message: 'La nueva contraseña debe ser diferente a la actual',
        path: ['newPassword'],
    });

// Schema para cambiar preguntas de seguridad desde configuración
export const changeSecurityQuestionsSchema = z
    .object({
        currentPassword: z.string().min(1, 'La contraseña actual es requerida'),
        securityQuestion1Id: z.number().min(1).optional(),
        securityAnswer1: z.string().min(2, 'La respuesta debe tener al menos 2 caracteres'),
        securityQuestion2Id: z.number().min(1).optional(),
        securityAnswer2: z.string().min(2, 'La respuesta debe tener al menos 2 caracteres'),
    })
    .refine((data) => data.securityQuestion1Id !== undefined, {
        message: 'Selecciona una pregunta',
        path: ['securityQuestion1Id'],
    })
    .refine((data) => data.securityQuestion2Id !== undefined, {
        message: 'Selecciona una pregunta',
        path: ['securityQuestion2Id'],
    })
    .refine((data) => data.securityQuestion1Id !== data.securityQuestion2Id, {
        message: 'Las preguntas de seguridad deben ser diferentes',
        path: ['securityQuestion2Id'],
    });

// Schema para actualizar información del usuario
export const updateUserInfoSchema = z.object({
    firstName: z.string().min(1, 'El nombre es requerido').min(2, 'El nombre debe tener al menos 2 caracteres'),
    username: z
        .string()
        .min(1, 'El nombre de usuario es requerido')
        .min(3, 'El nombre de usuario debe tener al menos 3 caracteres'),
    cedula: z
        .string()
        .min(1, 'El número de cédula es requerido')
        .min(6, 'El número de cédula debe tener al menos 6 caracteres')
        .regex(/^[0-9]+$/, 'El número de cédula solo debe contener números'),
});

// Schema para eliminar la cuenta
export const deleteAccountSchema = z.object({
    password: z.string().min(6, 'Debe tener al menos 6 caracteres'),
});
