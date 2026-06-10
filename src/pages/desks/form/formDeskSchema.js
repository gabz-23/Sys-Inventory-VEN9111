import * as zod from 'zod';

export const deskFormSchema = zod.object({
    code: zod
        .string()
        .min(1, 'El código es obligatorio')
        .max(15, 'El código no puede exceder 15 caracteres'),
    computer: zod.string().optional(),
    employee: zod.string().optional(),
    accessories: zod.array(zod.any()).optional().default([]),
});
