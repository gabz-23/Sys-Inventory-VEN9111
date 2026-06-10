import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Loader2, Trash2 } from 'lucide-react';
import { deleteAccountSchema } from '@/pages/auth/form/authSchema';
import { useAuthStore } from '@/store/useAuthStore';

export const DeleteUserDialog = ({ open, onOpenChange }) => {
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [isSuccess, setIsSuccess] = useState(false);
    const { user, logout } = useAuthStore();

    const form = useForm({
        resolver: zodResolver(deleteAccountSchema),
        defaultValues: { password: '' },
    });

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
            await window.electronAPI.deleteUser({
                userId: user.id,
                password: data.password,
            });

            setIsSuccess(true);
            logout();

            setTimeout(() => {
                onOpenChange(false);
                setIsSuccess(false);
            }, 1000);
        } catch (err) {
            let errorMessage = err.message || 'Error al eliminar usuario';
            errorMessage = errorMessage.replace(/^Error invoking remote method '[^']+': Error: /, '');

            if (errorMessage.toLowerCase().includes('contraseña')) {
                form.setValue('password', '');
                form.setFocus('password');
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
                        <div className="rounded-full bg-destructive/10 p-2">
                            <Trash2 className="h-5 w-5 text-destructive" />
                        </div>
                        <DialogTitle>Eliminar cuenta</DialogTitle>
                    </div>
                    <DialogDescription>
                        Esta acción es irreversible. Ingresa tu contraseña para confirmar y se eliminarán tus datos y
                        sesión.
                    </DialogDescription>
                </DialogHeader>

                {isSuccess ? (
                    <div className="py-4">
                        <div className="rounded-lg bg-green-500/10 border border-green-500/20 p-4">
                            <p className="text-sm text-green-600 dark:text-green-400 font-medium text-center">
                                ✓ Cuenta eliminada exitosamente
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
                                name="password"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Contraseña</FormLabel>
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
                                <Button type="submit" variant="destructive" className="cursor-pointer" disabled={isLoading}>
                                    {isLoading ? (
                                        <>
                                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                            Eliminando...
                                        </>
                                    ) : (
                                        'Eliminar Cuenta'
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
