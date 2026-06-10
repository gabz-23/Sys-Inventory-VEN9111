import * as zod from 'zod';
import { capitalize } from '@/constants/capitalize';

export const compFormSchema = zod.object({
    // general
    code: zod
        .string()
        .min(1, 'El código es obligatorio')
        .max(15, 'El código no puede exceder 15 caracteres'),
    serial: zod
        .string()
        .min(1, 'El serial es obligatorio')
        .max(30, 'El serial no puede exceder 30 caracteres')
        .transform((str) => str.toUpperCase()),

    brand: zod
        .string()
        .min(1, 'Asigna una marca')
        .max(30, 'La marca no puede exceder 30 caracteres')
        .transform(capitalize),
    model: zod
        .string()
        .min(1, 'Coloca el modelo')
        .max(30, 'El modelo no puede exceder 30 caracteres')
        .transform(capitalize),
    state: zod.enum(['Bueno', 'Repuesto', 'Dañado', 'En reparacion', 'Reparado', 'Reconstruido'], 'El estado es obligatorio'),
    computerType: zod.enum(['Laptop', 'Escritorio'], 'El tipo de computador es obligatorio'),

    // Componentes
    cpu: zod.string().optional().default('').transform(capitalize),
    ramMemory: zod
        .string()
        .optional()
        .default('')
        .transform((str) => str.toUpperCase()),
    storage: zod
        .string()
        .optional()
        .default('')
        .transform((str) => str.toUpperCase()),
    graphicCard: zod
        .string()
        .optional()
        .default('')
        .transform((str) => str.toUpperCase()),
    powerSupply: zod.string().optional().default('').transform(capitalize),
    motherboard: zod.string().optional().default('').transform(capitalize),
    cooler: zod.string().optional().default('').transform(capitalize),
    cdDvd: zod.string().optional().default('').transform(capitalize),
    peripherals: zod.array(zod.any()).default([]),
    assignedComponents: zod.array(zod.any()).default([]),
    componentIds: zod.any().default([]),
});
