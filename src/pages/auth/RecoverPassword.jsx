import { useState } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { KeyRound, Loader2, ArrowLeft, CheckCircle2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import {
    recoverPasswordCedulaSchema,
    recoverPasswordUsernameSchema,
    recoverPasswordQuestionsSchema,
    recoverPasswordNewPasswordSchema,
} from './form/authSchema';
import { getQuestionById } from '@/constants/securityQuestions';
import logo from '/logo.png';
import { InputPassword } from '@/components/form/InputPassword';

export const RecoverPassword = ({ onSwitchToLogin }) => {
    const [step, setStep] = useState(1); // 0: cedula, 1: username, 2: security questions, 3: new password
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [username, setUsername] = useState('');
    const [securityQuestions, setSecurityQuestions] = useState(null);
    const [isSuccess, setIsSuccess] = useState(false);
    const [foundUsername, setFoundUsername] = useState(null);

    // formulario para el paso 0: buscar por cédula
    const cedulaForm = useForm({
        resolver: zodResolver(recoverPasswordCedulaSchema),
        defaultValues: {
            cedula: '',
        },
    });

    // formulario para el paso 1: nombre de usuario
    const usernameForm = useForm({
        resolver: zodResolver(recoverPasswordUsernameSchema),
        defaultValues: {
            username: '',
        },
    });

    // formulario para el paso 2: preguntas de seguridad
    const questionsForm = useForm({
        resolver: zodResolver(recoverPasswordQuestionsSchema),
        defaultValues: {
            answer1: '',
            answer2: '',
        },
    });

    // formulario para el paso 3: nueva contraseña
    const passwordForm = useForm({
        resolver: zodResolver(recoverPasswordNewPasswordSchema),
        defaultValues: {
            newPassword: '',
            confirmPassword: '',
        },
    });

    // buscar usuario por cédula
    const handleCedulaSubmit = async (data) => {
        setIsLoading(true);
        setError('');

        try {
            const result = await window.electronAPI.getUserByCedula(data.cedula);
            setFoundUsername(result.username);
        } catch (err) {
            let errorMessage = err.message || 'Error al buscar usuario por cédula';
            errorMessage = errorMessage.replace(/^Error invoking remote method '[^']+': Error: /, '');
            setError(errorMessage);
        } finally {
            setIsLoading(false);
        }
    };

    // obtener nombre de usuario y obtener preguntas de seguridad
    const handleUsernameSubmit = async (data) => {
        setIsLoading(true);
        setError('');

        try {
            const questions = await window.electronAPI.getSecurityQuestions(data.username);
            setUsername(data.username);
            setSecurityQuestions(questions);
            setStep(2);
        } catch (err) {
            let errorMessage = err.message || 'Error al obtener las preguntas de seguridad';
            errorMessage = errorMessage.replace(/^Error invoking remote method '[^']+': Error: /, '');
            setError(errorMessage);
        } finally {
            setIsLoading(false);
        }
    };

    // verificar preguntas de seguridad
    const handleSecurityQuestionsSubmit = async (data) => {
        setIsLoading(true);
        setError('');

        try {
            await window.electronAPI.verifySecurityQuestions({
                username: username,
                answer1: data.answer1,
                answer2: data.answer2,
            });
            setStep(3);
        } catch (err) {
            let errorMessage = err.message || 'Error al verificar las respuestas';
            errorMessage = errorMessage.replace(/^Error invoking remote method '[^']+': Error: /, '');
            setError(errorMessage);
        } finally {
            setIsLoading(false);
        }
    };

    // Step 3: Reset password
    const handlePasswordReset = async (data) => {
        setIsLoading(true);
        setError('');

        try {
            await window.electronAPI.resetPassword({
                username: username,
                newPassword: data.newPassword,
            });
            setIsSuccess(true);
        } catch (err) {
            let errorMessage = err.message || 'Error al restablecer la contraseña';
            errorMessage = errorMessage.replace(/^Error invoking remote method '[^']+': Error: /, '');
            setError(errorMessage);
        } finally {
            setIsLoading(false);
        }
    };

    // manejar botón de regresar
    const handleBack = () => {
        if (step === 0) {
            onSwitchToLogin?.();
        } else {
            setStep(0);
            setError('');
            onSwitchToLogin?.();
            setFoundUsername(null);
        }
    };

    const handleUseFoundUsername = () => {
        setUsername(foundUsername);
        setStep(1);
        setFoundUsername(null);
    };

    if (isSuccess) {
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
                                    Tu contraseña ha sido restablecida exitosamente. Ahora puedes iniciar sesión con tu
                                    nueva contraseña de forma segura.
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
                                    <div className="rounded-full bg-green-500/10 dark:bg-green-500/20 p-2">
                                        <CheckCircle2 className="h-5 w-5 text-green-500" />
                                    </div>
                                </div>
                                <CardTitle className="text-2xl text-center">Contraseña restablecida</CardTitle>
                                <CardDescription className="text-center">
                                    Tu contraseña ha sido restablecida exitosamente. Ahora puedes iniciar sesión con tu
                                    nueva contraseña.
                                </CardDescription>
                            </CardHeader>
                            <CardContent>
                                <Button type="button" className="w-full cursor-pointer" onClick={onSwitchToLogin}>
                                    Volver al inicio de sesión
                                </Button>
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen flex relative overflow-hidden">
            {/* Fondo con gradiente*/}
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
                                Recupera tu contraseña de forma segura respondiendo las preguntas de seguridad que
                                configuraste al crear tu cuenta.
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
                                    <KeyRound className="h-5 w-5 text-primary" />
                                </div>
                            </div>
                            <CardTitle className="text-2xl text-center mb-0 ">
                                {step === 0 ? 'Recuperar Usuario' : 'Recuperar Contraseña'}
                            </CardTitle>
                            <CardDescription className="text-center ">
                                {step === 0 &&
                                    !foundUsername &&
                                    'Ingresa tu cédula para recuperar tu nombre de usuario'}

                                {step === 1 && 'Ingresa tu nombre de usuario para comenzar'}
                                {step === 2 && 'Responde las preguntas de seguridad'}
                                {step === 3 && 'Ingresa tu nueva contraseña'}
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            {step === 0 && (
                                <Form {...cedulaForm}>
                                    <form onSubmit={cedulaForm.handleSubmit(handleCedulaSubmit)} className="space-y-4">
                                        {error && (
                                            <div className="p-3 text-sm text-destructive bg-destructive/10 border border-destructive/20 rounded-md">
                                                {error}
                                            </div>
                                        )}

                                        {foundUsername ? (
                                            <div className="space-y-4 ">
                                                <div className="p-4 bg-muted rounded-md border border-primary/20">
                                                    <p className="text-sm text-muted-foreground mb-2">
                                                        Nombre de usuario encontrado:
                                                    </p>
                                                    <p className="text-lg font-semibold text-foreground">
                                                        {foundUsername}
                                                    </p>
                                                </div>
                                                <div className="flex gap-2">
                                                    <Button
                                                        type="button"
                                                        variant="outline"
                                                        className="flex-1"
                                                        onClick={handleBack}
                                                    >
                                                        <ArrowLeft className="mr-2 h-4 w-4" />
                                                        Regresar
                                                    </Button>
                                                    <Button
                                                        type="button"
                                                        className="flex-1"
                                                        onClick={handleUseFoundUsername}
                                                    >
                                                        Usar este usuario
                                                    </Button>
                                                </div>
                                            </div>
                                        ) : (
                                            <>
                                                <FormField
                                                    control={cedulaForm.control}
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
                                                                        const value = e.target.value.replace(
                                                                            /[^0-9]/g,
                                                                            ''
                                                                        );
                                                                        field.onChange(value);
                                                                    }}
                                                                />
                                                            </FormControl>
                                                            <FormMessage />
                                                        </FormItem>
                                                    )}
                                                />

                                                <div className="flex gap-2">
                                                    <Button
                                                        type="button"
                                                        variant="outline"
                                                        className="flex-1 cursor-pointer"
                                                        onClick={step === 0 ? onSwitchToLogin : handleBack}
                                                    >
                                                        <ArrowLeft className="mr-2 h-4 w-4" />
                                                        Cancelar
                                                    </Button>
                                                    <Button
                                                        type="submit"
                                                        className="flex-1 cursor-pointer"
                                                        disabled={isLoading}
                                                    >
                                                        {isLoading ? (
                                                            <>
                                                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                                                Buscando...
                                                            </>
                                                        ) : (
                                                            'Buscar'
                                                        )}
                                                    </Button>
                                                </div>
                                            </>
                                        )}
                                    </form>
                                </Form>
                            )}

                            {step === 1 && (
                                <Form {...usernameForm}>
                                    <form
                                        onSubmit={usernameForm.handleSubmit(handleUsernameSubmit)}
                                        className="space-y-4"
                                    >
                                        {error && (
                                            <div className="p-3 text-sm text-destructive bg-destructive/10 border border-destructive/20 rounded-md">
                                                {error}
                                            </div>
                                        )}

                                        <FormField
                                            control={usernameForm.control}
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

                                        <div className="text-center">
                                            <button
                                                type="button"
                                                onClick={() => setStep(0)}
                                                className="text-sm text-primary hover:underline cursor-pointer"
                                            >
                                                ¿Olvidaste tu usuario?
                                            </button>
                                        </div>

                                        <div className="flex gap-2">
                                            <Button
                                                type="button"
                                                variant="outline"
                                                className="flex-1 cursor-pointer"
                                                onClick={handleBack}
                                            >
                                                <ArrowLeft className="mr-2 h-4 w-4" />
                                                Cancelar
                                            </Button>
                                            <Button
                                                type="submit"
                                                className="flex-1 cursor-pointer"
                                                disabled={isLoading}
                                            >
                                                {isLoading ? (
                                                    <>
                                                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                                        Verificando...
                                                    </>
                                                ) : (
                                                    'Continuar'
                                                )}
                                            </Button>
                                        </div>
                                    </form>
                                </Form>
                            )}

                            {step === 2 && securityQuestions && (
                                <Form {...questionsForm}>
                                    <form
                                        onSubmit={questionsForm.handleSubmit(handleSecurityQuestionsSubmit)}
                                        className="space-y-4"
                                    >
                                        {error && (
                                            <div className="p-3 text-sm text-destructive bg-destructive/10 border border-destructive/20 rounded-md">
                                                {error}
                                            </div>
                                        )}

                                        <div className="p-3 bg-muted rounded-md mb-4">
                                            <p className="text-sm text-muted-foreground">
                                                Usuario:{' '}
                                                <span className="font-semibold text-foreground">{username}</span>
                                            </p>
                                        </div>

                                        <div className="space-y-4">
                                            <div>
                                                <FormLabel className="text-sm font-semibold mb-2 block">
                                                    {getQuestionById(securityQuestions.securityQuestion1Id)?.question}
                                                </FormLabel>
                                                <FormField
                                                    control={questionsForm.control}
                                                    name="answer1"
                                                    render={({ field }) => (
                                                        <FormItem>
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

                                            <div>
                                                <FormLabel className="text-sm font-semibold mb-2 block">
                                                    {getQuestionById(securityQuestions.securityQuestion2Id)?.question}
                                                </FormLabel>
                                                <FormField
                                                    control={questionsForm.control}
                                                    name="answer2"
                                                    render={({ field }) => (
                                                        <FormItem>
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

                                        <div className="flex gap-2">
                                            <Button
                                                type="button"
                                                variant="outline"
                                                className="flex-1 cursor-pointer"
                                                onClick={handleBack}
                                            >
                                                <ArrowLeft className="mr-2 h-4 w-4" />
                                                Atrás
                                            </Button>
                                            <Button
                                                type="submit"
                                                className="flex-1 cursor-pointer"
                                                disabled={isLoading}
                                            >
                                                {isLoading ? (
                                                    <>
                                                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                                        Verificando...
                                                    </>
                                                ) : (
                                                    'Verificar'
                                                )}
                                            </Button>
                                        </div>
                                    </form>
                                </Form>
                            )}

                            {step === 3 && (
                                <Form {...passwordForm}>
                                    <form
                                        onSubmit={passwordForm.handleSubmit(handlePasswordReset)}
                                        className="space-y-4"
                                    >
                                        {error && (
                                            <div className="p-3 text-sm text-destructive bg-destructive/10 border border-destructive/20 rounded-md">
                                                {error}
                                            </div>
                                        )}

                                        <FormField
                                            control={passwordForm.control}
                                            name="newPassword"
                                            render={({ field }) => (
                                                <FormItem>
                                                    <InputPassword
                                                        field={field}
                                                        isLoading={isLoading}
                                                        label="Nueva Contraseña"
                                                    />
                                                </FormItem>
                                            )}
                                        />

                                        <FormField
                                            control={passwordForm.control}
                                            name="confirmPassword"
                                            render={({ field }) => (
                                                <InputPassword
                                                    field={field}
                                                    isLoading={isLoading}
                                                    label="Confirmar Contraseña"
                                                />
                                            )}
                                        />

                                        <div className="flex gap-2">
                                            <Button
                                                type="button"
                                                variant="outline"
                                                className="flex-1 cursor-pointer"
                                                onClick={handleBack}
                                            >
                                                <ArrowLeft className="mr-2 h-4 w-4" />
                                                Atrás
                                            </Button>
                                            <Button
                                                type="submit"
                                                className="flex-1 cursor-pointer"
                                                disabled={isLoading}
                                            >
                                                {isLoading ? (
                                                    <>
                                                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                                        Restableciendo...
                                                    </>
                                                ) : (
                                                    'Restablecer Contraseña'
                                                )}
                                            </Button>
                                        </div>
                                    </form>
                                </Form>
                            )}
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    );
};
