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
import { changePasswordSchema } from '@/pages/auth/form/authSchema';
import { useAuthStore } from '@/store/useAuthStore';
import { Loader2, KeyRound } from 'lucide-react';
import { InputPassword } from '@/components/form/InputPassword';

export const ChangePasswordDialog = ({ open, onOpenChange }) => {
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [isSuccess, setIsSuccess] = useState(false);
    const { user } = useAuthStore();

    const form = useForm({
        resolver: zodResolver(changePasswordSchema),
        defaultValues: {
            currentPassword: '',
            newPassword: '',
            confirmPassword: '',
        },
    });

    // Limpiar el formulario cuando se abre/cierra el diálogo
    useEffect(() => {
        if (open) {
            form.reset();
            setError('');
            setIsSuccess(false);
        }
    }, [open, form]);

    const handleSubmit = async (data) => {
        setIsLoading(true);
        setError('');

        try {
            await window.electronAPI.changePassword({
                userId: user.id,
                currentPassword: data.currentPassword,
                newPassword: data.newPassword,
            });

            setIsSuccess(true);
            // Cerrar el diálogo después de 2 segundos
            setTimeout(() => {
                onOpenChange(false);
                setIsSuccess(false);
            }, 2000);
        } catch (err) {
            let errorMessage = err.message || 'Error al cambiar la contraseña';
            errorMessage = errorMessage.replace(/^Error invoking remote method '[^']+': Error: /, '');

            // Si es un error de contraseña actual incorrecta, limpiar el campo
            if (errorMessage.includes('contraseña actual')) {
                form.setValue('currentPassword', '');
                form.setFocus('currentPassword');
            }

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
                            <KeyRound className="h-5 w-5 text-primary" />
                        </div>
                        <DialogTitle>Cambiar Contraseña</DialogTitle>
                    </div>
                    <DialogDescription>
                        Ingresa tu contraseña actual y la nueva contraseña que deseas usar.
                    </DialogDescription>
                </DialogHeader>

                {isSuccess ? (
                    <div className="py-4">
                        <div className="rounded-lg bg-green-500/10 border border-green-500/20 p-4">
                            <p className="text-sm text-green-600 dark:text-green-400 font-medium text-center">
                                ✓ Contraseña cambiada exitosamente
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
                                name="currentPassword"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Contraseña Actual</FormLabel>
                                        <FormControl>
                                            <Input
                                                type="password"
                                                placeholder="••••••••"
                                                disabled={isLoading}
                                                {...field}
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            <FormField
                                control={form.control}
                                name="newPassword"
                                render={({ field }) => (
                                    <InputPassword field={field} isLoading={isLoading} label="Nueva Contraseña" />
                                )}
                            />

                            <FormField
                                control={form.control}
                                name="confirmPassword"
                                render={({ field }) => (
                                    <InputPassword field={field} isLoading={isLoading} label="Nueva Contraseña" />
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
                                            Cambiando...
                                        </>
                                    ) : (
                                        'Cambiar Contraseña'
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
