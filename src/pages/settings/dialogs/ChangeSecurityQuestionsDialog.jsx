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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { changeSecurityQuestionsSchema } from '@/pages/auth/form/authSchema';
import { useAuthStore } from '@/store/useAuthStore';
import { Loader2, Shield } from 'lucide-react';
import { SECURITY_QUESTIONS } from '@/constants/securityQuestions';

export const ChangeSecurityQuestionsDialog = ({ open, onOpenChange }) => {
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [isSuccess, setIsSuccess] = useState(false);
    const { user } = useAuthStore();

    const form = useForm({
        resolver: zodResolver(changeSecurityQuestionsSchema),
        defaultValues: {
            currentPassword: '',
            securityQuestion1Id: undefined,
            securityAnswer1: '',
            securityQuestion2Id: undefined,
            securityAnswer2: '',
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

    // Obtener preguntas disponibles excluyendo las ya seleccionadas
    const selectedQuestion1Id = form.watch('securityQuestion1Id');
    const selectedQuestion2Id = form.watch('securityQuestion2Id');

    const availableQuestions1 = SECURITY_QUESTIONS.filter((q) => q.id !== selectedQuestion2Id);
    const availableQuestions2 = SECURITY_QUESTIONS.filter((q) => q.id !== selectedQuestion1Id);

    const handleSubmit = async (data) => {
        setIsLoading(true);
        setError('');

        try {
            await window.electronAPI.changeSecurityQuestions({
                userId: user.id,
                currentPassword: data.currentPassword,
                securityQuestion1Id: Number(data.securityQuestion1Id),
                securityAnswer1: data.securityAnswer1,
                securityQuestion2Id: Number(data.securityQuestion2Id),
                securityAnswer2: data.securityAnswer2,
            });

            setIsSuccess(true);
            // Cerrar el diálogo después de 2 segundos
            setTimeout(() => {
                onOpenChange(false);
                setIsSuccess(false);
            }, 2000);
        } catch (err) {
            let errorMessage = err.message || 'Error al cambiar las preguntas de seguridad';
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
            <DialogContent className="sm:max-w-2xl max-h-[90vh] flex flex-col">
                <DialogHeader>
                    <div className="flex items-center gap-2">
                        <div className="rounded-full bg-primary/10 p-2">
                            <Shield className="h-5 w-5 text-primary" />
                        </div>
                        <DialogTitle>Cambiar Preguntas de Seguridad</DialogTitle>
                    </div>
                    <DialogDescription>
                        Ingresa tu contraseña actual y selecciona nuevas preguntas de seguridad con sus respuestas.
                    </DialogDescription>
                </DialogHeader>

                {isSuccess ? (
                    <div className="py-4">
                        <div className="rounded-lg bg-green-500/10 border border-green-500/20 p-4">
                            <p className="text-sm text-green-600 dark:text-green-400 font-medium text-center">
                                ✓ Preguntas de seguridad actualizadas exitosamente
                            </p>
                        </div>
                    </div>
                ) : (
                    <Form {...form}>
                        <form onSubmit={form.handleSubmit(handleSubmit)} className="flex flex-col flex-1 min-h-0">
                            <div className="flex-1 overflow-y-auto min-h-0 space-y-4 px-2 py-4">
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

                                <div className="border-t pt-4 mt-4">
                                    <h3 className="text-sm font-semibold mb-2 text-muted-foreground">
                                        Nuevas Preguntas de Seguridad
                                    </h3>
                                    <p className="text-xs text-muted-foreground mb-5">
                                        Selecciona y responde dos preguntas de seguridad diferentes. Estas te ayudarán a
                                        recuperar tu contraseña si la olvidas.
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
                                                            onValueChange={(value) => field.onChange(Number(value))}
                                                            value={field.value?.toString()}
                                                            disabled={isLoading}
                                                        >
                                                            <SelectTrigger className="w-full cursor-pointer">
                                                                <SelectValue placeholder="Selecciona una pregunta" />
                                                            </SelectTrigger>
                                                            <SelectContent>
                                                                {availableQuestions1.map((question) => (
                                                                    <SelectItem
                                                                        key={question.id}
                                                                        className="cursor-pointer"
                                                                        value={question.id.toString()}
                                                                    >
                                                                        {question.question}
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
                                                        <Input
                                                            placeholder="Tu respuesta"
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
                                            name="securityQuestion2Id"
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormLabel>Pregunta de Seguridad 2</FormLabel>
                                                    <FormControl>
                                                        <Select
                                                            onValueChange={(value) => field.onChange(Number(value))}
                                                            value={field.value?.toString()}
                                                            disabled={isLoading}
                                                        >
                                                            <SelectTrigger className="w-full cursor-pointer">
                                                                <SelectValue placeholder="Selecciona una pregunta" />
                                                            </SelectTrigger>
                                                            <SelectContent>
                                                                {availableQuestions2.map((question) => (
                                                                    <SelectItem
                                                                        key={question.id}
                                                                        className="cursor-pointer"
                                                                        value={question.id.toString()}
                                                                    >
                                                                        {question.question}
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
                                                        <Input
                                                            placeholder="Tu respuesta"
                                                            disabled={isLoading}
                                                            {...field}
                                                        />
                                                    </FormControl>
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />
                                    </div>
                                </div>
                            </div>

                            <DialogFooter className="gap-2 sm:gap-0 mt-4">
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
                                        'Actualizar Preguntas'
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
