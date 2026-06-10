import { useState } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { UserPlus, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { registerSchema } from './form/authSchema';
import { useAuthStore } from '@/store/useAuthStore';
import { SECURITY_QUESTIONS } from '@/constants/securityQuestions';
import logo from '/logo.png';
import { InputPassword } from '@/components/form/InputPassword';

export const RegisterPage = ({ onSwitchToLogin }) => {
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const login = useAuthStore((state) => state.login);

    const form = useForm({
        resolver: zodResolver(registerSchema),
        defaultValues: {
            firstName: '',
            username: '',
            cedula: '',
            password: '',
            confirmPassword: '',
            role: 'admin', // Valor por defecto: administrador
            securityQuestion1Id: undefined,
            securityAnswer1: '',
            securityQuestion2Id: undefined,
            securityAnswer2: '',
        },
    });

    const handleSubmit = async (data) => {
        setIsLoading(true);
        setError('');

        try {
            const user = await window.electronAPI.register({
                firstName: data.firstName,
                username: data.username,
                cedula: data.cedula,
                password: data.password,
                role: data.role, // Enviar el rol seleccionado al servidor
                securityQuestion1Id: Number(data.securityQuestion1Id),
                securityAnswer1: data.securityAnswer1,
                securityQuestion2Id: Number(data.securityQuestion2Id),
                securityAnswer2: data.securityAnswer2,
            });

            login(user);
        } catch (err) {
            // Limpiar el mensaje de error para quitar el prefijo de Electron
            let errorMessage = err.message || 'Error al crear la cuenta';

            // Remover el prefijo "Error invoking remote method '[^']+': Error: "
            errorMessage = errorMessage.replace(/^Error invoking remote method '[^']+': Error: /, '');
            setError(errorMessage);
        } finally {
            setIsLoading(false);
        }
    };

    // Obtener preguntas disponibles excluyendo las ya seleccionadas
    const selectedQuestion1Id = form.watch('securityQuestion1Id');
    const selectedQuestion2Id = form.watch('securityQuestion2Id');

    const availableQuestions1 = SECURITY_QUESTIONS.filter((q) => q.id !== selectedQuestion2Id);
    const availableQuestions2 = SECURITY_QUESTIONS.filter((q) => q.id !== selectedQuestion1Id);

    return (
        <div className="min-h-screen flex relative overflow-hidden">
            {/* Fondo con gradiente acorde a la paleta */}
            <div className="absolute inset-0 bg-linear-to-br from-primary/5 via-primary/10 to-primary/5 dark:from-primary/10 dark:via-primary/5 dark:to-primary/10" />
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(58.425%,0.19894,257.74,0.1),transparent_50%)]" />
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_80%,rgba(58.425%,0.19894,257.74,0.08),transparent_50%)]" />

            <div className="w-full flex items-center justify-center relative z-10 p-4">
                <div className="w-full max-w-7xl grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
                    <div className="hidden lg:flex flex-col items-center justify-center space-y-6 p-8">
                        <div className="p-6 rounded-2xl bg-linear-to-br from-primary/10 to-primary/5 dark:from-primary/20 dark:to-primary/10 border border-primary/20 dark:border-primary/30 shadow-lg">
                            <img src={logo} alt="VEN 9-1-1 Logo" className="h-32 w-32 object-contain" />
                        </div>
                        <div className="text-center space-y-2">
                            <h1 className="text-3xl font-bold text-foreground">Sistema de Inventario</h1>
                            <p className="text-lg text-muted-foreground">VEN 9-1-1</p>
                            <p className="text-sm text-muted-foreground max-w-md mt-4">
                                Crea tu cuenta para comenzar a gestionar el inventario. Completa el formulario con tus
                                datos y establece preguntas de seguridad para proteger tu cuenta.
                            </p>
                        </div>
                    </div>

                    <Card className="w-full max-w-2xl max-h-[90vh] mx-auto shadow-2xl border-primary/20 dark:border-primary/30 flex flex-col">
                        <CardHeader className="space-y-1 shrink-0">
                            <div className="flex flex-col items-center mb-6 lg:hidden">
                                <div className="mb-4 p-4 rounded-2xl bg-linear-to-br from-primary/10 to-primary/5 dark:from-primary/20 dark:to-primary/10 border border-primary/20 dark:border-primary/30 shadow-lg">
                                    <img src={logo} alt="VEN 9-1-1 Logo" className="h-16 w-16 object-contain" />
                                </div>
                                <div className="rounded-full bg-primary/10 dark:bg-primary/20 p-2">
                                    <UserPlus className="h-5 w-5 text-primary" />
                                </div>
                            </div>
                            <CardTitle className="text-2xl text-center">Crear Cuenta</CardTitle>
                            <CardDescription className="text-center">
                                Completa el formulario para crear tu cuenta. Las preguntas de seguridad te ayudarán a
                                recuperar tu contraseña.
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="flex-1 overflow-y-auto">
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
                                                        <Input
                                                            placeholder="juan.perez"
                                                            disabled={isLoading}
                                                            {...field}
                                                        />
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
                                                <InputPassword
                                                    field={field}
                                                    isLoading={isLoading}
                                                    label="Confirmar Contraseña"
                                                />
                                            )}
                                        />
                                    </div>

                                    {/* Selector de rol de usuario */}
                                    <FormField
                                        control={form.control}
                                        name="role"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Rol de Usuario</FormLabel>
                                                <Select
                                                    onValueChange={field.onChange}
                                                    value={field.value}
                                                    disabled={isLoading}
                                                >
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

                                    {/* Preguntas de Seguridad */}
                                    <div className="border-t pt-4 mt-4">
                                        <h3 className="text-sm font-semibold mb-4 text-muted-foreground">
                                            Preguntas de Seguridad
                                        </h3>
                                        <p className="text-xs text-muted-foreground mb-4">
                                            Selecciona y responde dos preguntas de seguridad. Estas te ayudarán a
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

                                    <Button type="submit" className="w-full mt-6 cursor-pointer" disabled={isLoading}>
                                        {isLoading ? (
                                            <>
                                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                                Creando cuenta...
                                            </>
                                        ) : (
                                            'Crear Cuenta'
                                        )}
                                    </Button>
                                </form>
                            </Form>

                            <div className="mt-4 text-center text-sm">
                                <span className="text-muted-foreground">¿Ya tienes una cuenta? </span>
                                <button
                                    type="button"
                                    onClick={onSwitchToLogin}
                                    className="text-primary hover:underline font-medium cursor-pointer"
                                >
                                    Iniciar sesión
                                </button>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    );
};
