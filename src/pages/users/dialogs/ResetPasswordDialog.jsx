import { useState, useEffect } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { Loader2, KeyRound } from 'lucide-react';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogTitle,
    DialogHeader,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { InputPassword } from '@/components/form/InputPassword';

const resetPasswordSchema = z
    .object({
        newPassword: z.string().min(6, 'La contraseña debe tener al menos 6 caracteres'),
        confirmPassword: z.string().min(1, 'Debes confirmar la contraseña'),
    })
    .refine((data) => data.newPassword === data.confirmPassword, {
        message: 'Las contraseñas no coinciden',
        path: ['confirmPassword'],
    });

const defaultValues = {
    newPassword: '',
    confirmPassword: '',
};

export const ResetPasswordDialog = ({ open, onOpenChange, user, onSuccess }) => {
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const form = useForm({
        resolver: zodResolver(resetPasswordSchema),
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
            await window.electronAPI.adminResetPassword({
                userId: user.id,
                newPassword: data.newPassword,
            });

            form.reset(defaultValues, { keepErrors: false, shouldValidate: false });
            onSuccess?.();
            onOpenChange(false);
        } catch (err) {
            let errorMessage = err.message || 'Error al restablecer contraseña';
            errorMessage = errorMessage.replace(/^Error invoking remote method '[^']+': Error: /, '');
            setError(errorMessage);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="max-w-md">
                <DialogHeader>
                    <div className="flex items-center gap-3">
                        <div className="rounded-full bg-primary/10 p-2">
                            <KeyRound className="h-5 w-5 text-primary" />
                        </div>
                        <div>
                            <DialogTitle>Restablecer Contraseña</DialogTitle>
                            <DialogDescription>
                                Ingresa la nueva contraseña para <strong>{user?.username}</strong>
                            </DialogDescription>
                        </div>
                    </div>
                </DialogHeader>

                <Form {...form}>
                    <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
                        {error && (
                            <div className="p-3 text-sm text-destructive bg-destructive/10 border border-destructive/20 rounded-md">
                                {error}
                            </div>
                        )}

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
                                <InputPassword
                                    field={field}
                                    isLoading={isLoading}
                                    label="Confirmar Contraseña"
                                />
                            )}
                        />

                        <div className="flex gap-2 justify-end pt-2">
                            <Button
                                type="button"
                                variant="outline"
                                onClick={() => onOpenChange(false)}
                                disabled={isLoading}
                                className="cursor-pointer"
                            >
                                Cancelar
                            </Button>
                            <Button type="submit" disabled={isLoading} className="cursor-pointer">
                                {isLoading ? (
                                    <>
                                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                        Guardando...
                                    </>
                                ) : (
                                    'Guardar Contraseña'
                                )}
                            </Button>
                        </div>
                    </form>
                </Form>
            </DialogContent>
        </Dialog>
    );
};