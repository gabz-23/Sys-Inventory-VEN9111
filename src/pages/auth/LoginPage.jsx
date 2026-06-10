import { useState } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { LogIn, Loader2, EyeIcon, EyeOffIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { loginSchema } from './form/authSchema';
import { useAuthStore } from '@/store/useAuthStore';
import logo from '/logo.png';
import { InputPassword } from '@/components/form/InputPassword';

export const LoginPage = ({ onSwitchToRecover }) => {
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const login = useAuthStore((state) => state.login);

    const form = useForm({
        resolver: zodResolver(loginSchema),
        defaultValues: {
            username: '',
            password: '',
        },
    });

    const handleSubmit = async (data) => {
        setIsLoading(true);
        setError('');

        try {
            const user = await window.electronAPI.login({
                username: data.username,
                password: data.password,
            });

            login(user);
        } catch (err) {
            // Limpiar el mensaje de error para quitar el prefijo de Electron
            let errorMessage = err.message || 'Error al iniciar sesión';
            // Remover el prefijo "Error invoking remote method 'auth:login': Error: "
            errorMessage = errorMessage.replace(/^Error invoking remote method '[^']+': Error: /, '');
            setError(errorMessage);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex relative overflow-hidden">
            {/* Fondo con gradiente acorde a la paleta */}
            <div className="absolute inset-0 bg-linear-to-br from-primary/5 via-primary/10 to-primary/5 dark:from-primary/10 dark:via-primary/5 dark:to-primary/10" />
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(58.425%,0.19894,257.74,0.1),transparent_50%)]" />
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_80%,rgba(58.425%,0.19894,257.74,0.08),transparent_50%)]" />

            <div className="w-full flex items-center justify-center relative z-10 p-4">
                <div className="w-full max-w-6xl grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
                    {/* Sección izquierda - Logo y descripción */}
                    <div className="hidden lg:flex flex-col items-center justify-center space-y-6 p-8">
                        <div className="p-6 rounded-2xl bg-linear-to-br from-primary/10 to-primary/5 dark:from-primary/20 dark:to-primary/10 border border-primary/20 dark:border-primary/30 shadow-lg">
                            <img src={logo} alt="VEN 9-1-1 Logo" className="h-32 w-32 object-contain" />
                        </div>
                        <div className="text-center space-y-2">
                            <h1 className="text-3xl font-bold text-foreground">Sistema de Inventario</h1>
                            <p className="text-lg text-muted-foreground">VEN 9-1-1</p>
                            <p className="text-sm text-muted-foreground max-w-md mt-4">
                                Gestiona y controla el inventario de computadores, escritorios y accesorios de manera
                                eficiente y organizada.
                            </p>
                        </div>
                    </div>

                    {/* Sección derecha - Formulario */}
                    <Card className="w-full max-w-md mx-auto shadow-2xl border-primary/20 dark:border-primary/30">
                        <CardHeader className="space-y-1">
                            <div className="flex flex-col items-center mb-6 lg:hidden">
                                <div className="mb-4 p-4 rounded-2xl bg-linear-to-br from-primary/10 to-primary/5 dark:from-primary/20 dark:to-primary/10 border border-primary/20 dark:border-primary/30 shadow-lg">
                                    <img src={logo} alt="VEN 9-1-1 Logo" className="h-16 w-16 object-contain" />
                                </div>
                                <div className="rounded-full bg-primary/10 dark:bg-primary/20 p-2">
                                    <LogIn className="h-5 w-5 text-primary" />
                                </div>
                            </div>
                            <CardTitle className="text-2xl text-center">Iniciar Sesión</CardTitle>
                            <CardDescription className="text-center">
                                Ingresa tus credenciales para acceder al sistema
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <Form {...form}>
                                <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
                                    {error && (
                                        <div className="p-3 text-sm text-destructive bg-destructive/10 border border-destructive/20 rounded-md">
                                            {error}
                                        </div>
                                    )}

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
                                        name="password"
                                        render={({ field }) => <InputPassword field={field} isLoading={isLoading} label="Contraseña" />}
                                    />

                                    <Button type="submit" className="w-full cursor-pointer" disabled={isLoading}>
                                        {isLoading ? (
                                            <>
                                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                                Iniciando sesión...
                                            </>
                                        ) : (
                                            'Iniciar Sesión'
                                        )}
                                    </Button>
                                </form>
                            </Form>

                            <div className="mt-4 text-center text-sm">
                                <button
                                    type="button"
                                    onClick={onSwitchToRecover}
                                    className="text-primary hover:underline font-medium cursor-pointer"
                                >
                                    ¿Olvidaste tu contraseña?
                                </button>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    );
};
