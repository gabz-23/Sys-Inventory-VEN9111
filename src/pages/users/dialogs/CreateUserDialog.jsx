import { useState, useEffect } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { Loader2 } from 'lucide-react';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogTitle,
    DialogHeader,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { SECURITY_QUESTIONS } from '@/constants/securityQuestions';
import { InputPassword } from '@/components/form/InputPassword';

const createUserSchema = z
    .object({
        firstName: z.string().min(1, 'El nombre es requerido'),
        username: z
            .string()
            .min(3, 'El nombre de usuario debe tener al menos 3 caracteres')
            .regex(/^[a-zA-Z0-9._]+$/, 'Solo letras, números, puntos y guiones bajos'),
        cedula: z.string().min(1, 'La cédula es requerida').regex(/^\d+$/, 'Solo números'),
        password: z.string().min(6, 'La contraseña debe tener al menos 6 caracteres'),
        confirmPassword: z.string().min(1, 'Debes confirmar la contraseña'),
        role: z.enum(['admin', 'viewer'], { required_error: 'Selecciona un rol' }),
        securityQuestion1Id: z.string({ required_error: 'Selecciona una pregunta' }),
        securityAnswer1: z.string().min(1, 'La respuesta es requerida'),
        securityQuestion2Id: z.string({ required_error: 'Selecciona una pregunta' }),
        securityAnswer2: z.string().min(1, 'La respuesta es requerida'),
    })
    .refine((data) => data.password === data.confirmPassword, {
        message: 'Las contraseñas no coinciden',
        path: ['confirmPassword'],
    })
    .refine((data) => data.securityQuestion1Id !== data.securityQuestion2Id, {
        message: 'Las preguntas de seguridad deben ser diferentes',
        path: ['securityQuestion2Id'],
    });

const defaultValues = {
    firstName: '',
    username: '',
    cedula: '',
    password: '',
    confirmPassword: '',
    role: 'viewer',
    securityQuestion1Id: '',
    securityAnswer1: '',
    securityQuestion2Id: '',
    securityAnswer2: '',
};

export const CreateUserDialog = ({ open, onOpenChange, onSuccess }) => {
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const form = useForm({
        resolver: zodResolver(createUserSchema),
        defaultValues,
        mode: 'onBlur',
        reValidateMode: 'onBlur',
    });

    useEffect(() => {
        if (open) {
            form.reset(defaultValues, { keepErrors: false, shouldValidate: false });
            setError('');
            setIsLoading(false);
        }
    }, [open, form]);

    const handleSubmit = async (data) => {
        setIsLoading(true);
        setError('');

        try {
            await window.electronAPI.register({
                firstName: data.firstName,
                username: data.username,
                cedula: data.cedula,
                password: data.password,
                role: data.role,
                securityQuestion1Id: Number(data.securityQuestion1Id),
                securityAnswer1: data.securityAnswer1,
                securityQuestion2Id: Number(data.securityQuestion2Id),
                securityAnswer2: data.securityAnswer2,
            });

            form.reset(defaultValues, { keepErrors: false, shouldValidate: false });
            onSuccess?.();
            onOpenChange(false);
        } catch (err) {
            let errorMessage = err.message || 'Error al crear usuario';
            errorMessage = errorMessage.replace(/^Error invoking remote method '[^']+': Error: /, '');
            setError(errorMessage);
        } finally {
            setIsLoading(false);
        }
    };

    const selectedQuestion1Id = form.watch('securityQuestion1Id');
    const selectedQuestion2Id = form.watch('securityQuestion2Id');

    const availableQuestions1 = SECURITY_QUESTIONS.filter((q) => q.id.toString() !== selectedQuestion2Id);
    const availableQuestions2 = SECURITY_QUESTIONS.filter((q) => q.id.toString() !== selectedQuestion1Id);

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                    <DialogTitle>Crear nuevo usuario</DialogTitle>
                    <DialogDescription>
                        Completa la información del nuevo usuario. Se le asignará un rol y preguntas de seguridad.
                    </DialogDescription>
                </DialogHeader>

                <Form {...form}>
                    <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
                        {error && (
                            <div className="p-3 text-sm text-destructive bg-destructive/10 border border-destructive/20 rounded-md">
                                {error}
                            </div>
                        )}

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <FormField
                                control={form.control}
                                name="firstName"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Nombre</FormLabel>
                                        <FormControl>
                                            <Input placeholder="Juan" disabled={isLoading} {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            <FormField
                                control={form.control}
                                name="username"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Nombre de Usuario</FormLabel>
                                        <FormControl>
                                            <Input placeholder="juan.perez" disabled={isLoading} {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </div>

                        <FormField
                            control={form.control}
                            name="cedula"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Número de Cédula</FormLabel>
                                    <FormControl>
                                        <Input
                                            placeholder="12345678"
                                            disabled={isLoading}
                                            {...field}
                                            onChange={(e) => {
                                                const value = e.target.value.replace(/[^0-9]/g, '');
                                                field.onChange(value);
                                            }}
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <FormField
                                control={form.control}
                                name="password"
                                render={({ field }) => (
                                    <InputPassword field={field} isLoading={isLoading} label="Contraseña" />
                                )}
                            />

                            <FormField
                                control={form.control}
                                name="confirmPassword"
                                render={({ field }) => (
                                    <InputPassword field={field} isLoading={isLoading} label="Confirmar Contraseña" />
                                )}
                            />
                        </div>

                        <FormField
                            control={form.control}
                            name="role"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Rol de Usuario</FormLabel>
                                    <Select onValueChange={field.onChange} value={field.value} disabled={isLoading}>
                                        <FormControl>
                                            <SelectTrigger className="w-full cursor-pointer">
                                                <SelectValue placeholder="Selecciona un rol" />
                                            </SelectTrigger>
                                        </FormControl>
                                        <SelectContent>
                                            <SelectItem className="cursor-pointer" value="admin">
                                                Administrador - Acceso completo
                                            </SelectItem>
                                            <SelectItem className="cursor-pointer" value="viewer">
                                                Visualizador - Solo consulta
                                            </SelectItem>
                                        </SelectContent>
                                    </Select>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <div className="border-t pt-4 mt-4">
                            <h3 className="text-sm font-semibold mb-4 text-muted-foreground">
                                Preguntas de Seguridad
                            </h3>
                            <p className="text-xs text-muted-foreground mb-4">
                                Selecciona y responde dos preguntas de seguridad para que el usuario pueda recuperar su
                                contraseña.
                            </p>

                            <div className="space-y-4">
                                <FormField
                                    control={form.control}
                                    name="securityQuestion1Id"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Pregunta de Seguridad 1</FormLabel>
                                            <FormControl>
                                                <Select
                                                    onValueChange={field.onChange}
                                                    value={field.value}
                                                    disabled={isLoading}
                                                >
                                                    <SelectTrigger className="w-full cursor-pointer">
                                                        <SelectValue placeholder="Selecciona una pregunta" />
                                                    </SelectTrigger>
                                                    <SelectContent>
                                                        {availableQuestions1.map((q) => (
                                                            <SelectItem
                                                                key={q.id}
                                                                className="cursor-pointer"
                                                                value={q.id.toString()}
                                                            >
                                                                {q.question}
                                                            </SelectItem>
                                                        ))}
                                                    </SelectContent>
                                                </Select>
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />

                                <FormField
                                    control={form.control}
                                    name="securityAnswer1"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Respuesta 1</FormLabel>
                                            <FormControl>
                                                <Input placeholder="Tu respuesta" disabled={isLoading} {...field} />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />

                                <FormField
                                    control={form.control}
                                    name="securityQuestion2Id"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Pregunta de Seguridad 2</FormLabel>
                                            <FormControl>
                                                <Select
                                                    onValueChange={field.onChange}
                                                    value={field.value}
                                                    disabled={isLoading}
                                                >
                                                    <SelectTrigger className="w-full cursor-pointer">
                                                        <SelectValue placeholder="Selecciona una pregunta" />
                                                    </SelectTrigger>
                                                    <SelectContent>
                                                        {availableQuestions2.map((q) => (
                                                            <SelectItem
                                                                key={q.id}
                                                                className="cursor-pointer"
                                                                value={q.id.toString()}
                                                            >
                                                                {q.question}
                                                            </SelectItem>
                                                        ))}
                                                    </SelectContent>
                                                </Select>
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />

                                <FormField
                                    control={form.control}
                                    name="securityAnswer2"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Respuesta 2</FormLabel>
                                            <FormControl>
                                                <Input placeholder="Tu respuesta" disabled={isLoading} {...field} />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                            </div>
                        </div>

                        <Button className="w-full cursor-pointer mt-6" type="submit" disabled={isLoading}>
                            {isLoading ? (
                                <>
                                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                    Creando usuario...
                                </>
                            ) : (
                                'Crear Usuario'
                            )}
                        </Button>
                    </form>
                </Form>
            </DialogContent>
        </Dialog>
    );
};