import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogTitle,
    DialogHeader,
    DialogFooter,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { updateUserInfoSchema } from '@/pages/auth/form/authSchema';
import { useAuthStore } from '@/store/useAuthStore';
import { Loader2, Edit } from 'lucide-react';

export const EditUserInfoDialog = ({ open, onOpenChange }) => {
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [isSuccess, setIsSuccess] = useState(false);
    const { user, login } = useAuthStore();

    const form = useForm({
        resolver: zodResolver(updateUserInfoSchema),
        defaultValues: {
            firstName: '',
            username: '',
            cedula: '',
        },
    });

    // Cargar datos del usuario cuando se abre el diálogo
    useEffect(() => {
        if (open && user) {
            form.reset({
                firstName: user.firstName || '',
                username: user.username || '',
                cedula: user.cedula || '',
            });
            setError('');
            setIsSuccess(false);
        }
    }, [open, user, form]);

    const handleSubmit = async (data) => {
        setIsLoading(true);
        setError('');

        try {
            const updatedUser = await window.electronAPI.updateUserInfo({
                userId: user.id,
                firstName: data.firstName,
                username: data.username,
                cedula: data.cedula,
            });

            setIsSuccess(true);

            // Cerrar el diálogo después de 2 segundos para que el usuario vea el mensaje
            setTimeout(() => {
                onOpenChange(false);
                setIsSuccess(false);

                // Actualizar el store de autenticación con la información actualizada
                login(updatedUser);
            }, 2000);
        } catch (err) {
            let errorMessage = err.message || 'Error al actualizar la información';
            errorMessage = errorMessage.replace(/^Error invoking remote method '[^']+': Error: /, '');
            setError(errorMessage);
        } finally {
            setIsLoading(false);
        }
    };

    const handleClose = () => {
        if (!isLoading) {
            form.reset();
            setError('');
            setIsSuccess(false);
            onOpenChange(false);
        }
    };

    return (
        <Dialog open={open} onOpenChange={handleClose}>
            <DialogContent className="sm:max-w-md">
                <DialogHeader>
                    <div className="flex items-center gap-2">
                        <div className="rounded-full bg-primary/10 p-2">
                            <Edit className="h-5 w-5 text-primary" />
                        </div>
                        <DialogTitle>Editar Información</DialogTitle>
                    </div>
                    <DialogDescription>
                        Actualiza tu nombre, nombre de usuario y cédula. El nombre de usuario y la cédula deben ser
                        únicos.
                    </DialogDescription>
                </DialogHeader>

                {isSuccess ? (
                    <div className="py-4">
                        <div className="rounded-lg bg-green-500/10 border border-green-500/20 p-4">
                            <p className="text-sm text-green-600 dark:text-green-400 font-medium text-center">
                                ✓ Información actualizada exitosamente
                            </p>
                        </div>
                    </div>
                ) : (
                    <Form {...form}>
                        <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
                            {error && (
                                <div className="p-3 text-sm text-destructive bg-destructive/10 border border-destructive/20 rounded-md">
                                    {error}
                                </div>
                            )}

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
                                                    // Solo permitir números
                                                    const value = e.target.value.replace(/[^0-9]/g, '');
                                                    field.onChange(value);
                                                }}
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            <DialogFooter className="gap-2 sm:gap-0">
                                <Button
                                    type="button"
                                    variant="outline"
                                    className="cursor-pointer mr-2"
                                    onClick={handleClose}
                                    disabled={isLoading}
                                >
                                    Cancelar
                                </Button>
                                <Button type="submit" className="cursor-pointer" disabled={isLoading}>
                                    {isLoading ? (
                                        <>
                                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                            Actualizando...
                                        </>
                                    ) : (
                                        'Guardar Cambios'
                                    )}
                                </Button>
                            </DialogFooter>
                        </form>
                    </Form>
                )}
            </DialogContent>
        </Dialog>
    );
};
