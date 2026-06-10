import { useState, useEffect } from 'react';
import { Settings, User, KeyRound, Shield, Lock, Edit, Trash2 } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useAuthStore } from '@/store/useAuthStore';
import { ChangePasswordDialog } from './dialogs/ChangePasswordDialog';
import { ChangeSecurityQuestionsDialog } from './dialogs/ChangeSecurityQuestionsDialog';
import { EditUserInfoDialog } from './dialogs/EditUserInfoDialog';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import { DeleteUserDialog } from './dialogs/DeleteUserDialog';

export const SettingsPage = () => {
    const { user, login } = useAuthStore();
    const [isChangePasswordDialogOpen, setIsChangePasswordDialogOpen] = useState(false);
    const [isChangeSecurityQuestionsDialogOpen, setIsChangeSecurityQuestionsDialogOpen] = useState(false);
    const [isEditUserInfoDialogOpen, setIsEditUserInfoDialogOpen] = useState(false);
    const [isDeleteUserDialogOpen, setIsDeleteUserDialogOpen] = useState(false);

    // Cargar información actualizada del usuario al montar el componente
    useEffect(() => {
        const loadUserInfo = async () => {
            if (user?.id) {
                try {
                    const updatedUser = await window.electronAPI.getCurrentUser(user.id);
                    // Actualizar el store solo si falta la cédula o hay diferencias
                    if (!user.cedula || updatedUser.cedula !== user.cedula) {
                        login(updatedUser);
                    }
                } catch (error) {
                    console.error('Error al cargar información del usuario:', error);
                }
            }
        };

        loadUserInfo();
    }, [user?.id]);

    const formatDate = (dateString) => {
        if (!dateString) return 'N/A';
        try {
            const date = new Date(dateString);
            return format(date, "d 'de' MMMM 'de' yyyy", { locale: es });
        } catch {
            return 'N/A';
        }
    };

    return (
        <div className="space-y-6">
            <div>
                <h2 className="text-3xl font-bold text-foreground">Configuración</h2>
                <p className="mt-2 text-muted-foreground">Gestiona tu cuenta y preferencias del sistema</p>
            </div>

            <div className="grid gap-6 md:grid-cols-2">
                {/* Información del Usuario */}
                <Card>
                    <CardHeader>
                        <div className="flex items-center gap-2">
                            <div className="rounded-full bg-primary/10 p-2">
                                <User className="h-5 w-5 text-primary" />
                            </div>
                            <CardTitle>Información del Usuario</CardTitle>
                        </div>
                        <CardDescription>Datos de tu cuenta en el sistema</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="space-y-2">
                            <div className="flex items-center justify-between">
                                <span className="text-sm font-medium text-muted-foreground">Nombre</span>
                                <span className="text-sm font-semibold text-foreground">
                                    {user?.firstName || 'N/A'}
                                </span>
                            </div>
                            <div className="h-px bg-border" />
                        </div>

                        <div className="space-y-2">
                            <div className="flex items-center justify-between">
                                <span className="text-sm font-medium text-muted-foreground">Nombre de Usuario</span>
                                <span className="text-sm font-semibold text-foreground">{user?.username || 'N/A'}</span>
                            </div>
                            <div className="h-px bg-border" />
                        </div>

                        <div className="space-y-2">
                            <div className="flex items-center justify-between">
                                <span className="text-sm font-medium text-muted-foreground">Número de Cédula</span>
                                <span className="text-sm font-semibold text-foreground">{user?.cedula || 'N/A'}</span>
                            </div>
                            <div className="h-px bg-border" />
                        </div>

                        <Button
                            onClick={() => setIsEditUserInfoDialogOpen(true)}
                            className="w-full mt-4 cursor-pointer"
                            variant="outline"
                        >
                            <Edit className="mr-2 h-4 w-4" />
                            Editar Información
                        </Button>

                        <div className="space-y-2">
                            <div className="flex items-center justify-between">
                                <span className="text-sm font-medium text-muted-foreground">ID de Usuario</span>
                                <span className="text-sm font-mono text-muted-foreground">{user?.id || 'N/A'}</span>
                            </div>
                            <div className="h-px bg-border" />
                        </div>

                        <div className="space-y-2">
                            <div className="flex items-center justify-between">
                                <span className="text-sm font-medium text-muted-foreground">Fecha de Registro</span>
                                <span className="text-sm text-foreground">{formatDate(user?.createdAt)}</span>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* Seguridad */}
                <Card className="flex flex-col justify-between">
                    <CardHeader>
                        <div className="flex items-center gap-2">
                            <div className="rounded-full bg-primary/10 p-2">
                                <Shield className="h-5 w-5 text-primary" />
                            </div>
                            <CardTitle>Seguridad</CardTitle>
                        </div>
                        <CardDescription>
                            <p className="mb-2">Gestiona la seguridad de tu cuenta</p>

                            <div className="space-y-2">
                                <p className="text-sm text-muted-foreground">
                                    Mantén tu cuenta segura cambiando tu contraseña y preguntas de seguridad
                                    regularmente. Asegúrate de usar una contraseña fuerte y única.
                                </p>
                            </div>
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="space-y-2">
                            <Button
                                onClick={() => setIsChangePasswordDialogOpen(true)}
                                className="w-full cursor-pointer"
                                variant="outline"
                            >
                                <KeyRound className="mr-2 h-4 w-4" />
                                Cambiar Contraseña
                            </Button>
                            <Button
                                onClick={() => setIsChangeSecurityQuestionsDialogOpen(true)}
                                className="w-full cursor-pointer"
                                variant="outline"
                            >
                                <Lock className="mr-2 h-4 w-4" />
                                Cambiar Preguntas de Seguridad
                            </Button>
                        </div>
                    </CardContent>
                </Card>

                {/* Información del Sistema */}

                <Card className="flex flex-col justify-between">
                    <CardHeader>
                        <div className="flex items-center gap-2">
                            <div className="rounded-full bg-primary/10 p-2">
                                <Settings className="h-5 w-5 text-primary" />
                            </div>
                            <CardTitle>Información del Sistema</CardTitle>
                        </div>
                        <CardDescription>Detalles sobre el sistema </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="grid gap-4 md:grid-cols-2">
                            <div className="space-y-2">
                                <div className="flex items-center justify-between">
                                    <span className="text-sm font-medium text-muted-foreground">Versión</span>
                                    <span className="text-sm font-semibold text-foreground">1.0.0</span>
                                </div>
                                <div className="h-px bg-border" />
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* Zona de peligro */}
                <Card className="border-destructive/30">
                    <CardHeader>
                        <div className="flex items-center gap-2">
                            <div className="rounded-full bg-destructive/10 p-2">
                                <Trash2 className="h-5 w-5 text-destructive" />
                            </div>
                            <CardTitle className="text-destructive">Eliminar Cuenta</CardTitle>
                        </div>
                        <CardDescription className="text-sm text-muted-foreground w-[80%]">
                            Esta acción eliminará tu cuenta de forma permanente y cerrará tu sesión en este equipo. Para
                            continuar deberás confirmar tu contraseña. No podrás deshacer este cambio.
                            <br />
                            <span className="text-xs text-destructive">Esta acción es irreversible.</span>
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="flex flex-col gap-3">
                        <Button
                            onClick={() => setIsDeleteUserDialogOpen(true)}
                            variant="destructive"
                            className="w-full cursor-pointer"
                        >
                            <Trash2 className="mr-2 h-4 w-4" />
                            Eliminar mi cuenta
                        </Button>
                    </CardContent>
                </Card>
            </div>

            <ChangePasswordDialog open={isChangePasswordDialogOpen} onOpenChange={setIsChangePasswordDialogOpen} />
            <ChangeSecurityQuestionsDialog
                open={isChangeSecurityQuestionsDialogOpen}
                onOpenChange={setIsChangeSecurityQuestionsDialogOpen}
            />
            <EditUserInfoDialog open={isEditUserInfoDialogOpen} onOpenChange={setIsEditUserInfoDialogOpen} />

            <DeleteUserDialog open={isDeleteUserDialogOpen} onOpenChange={setIsDeleteUserDialogOpen} />
        </div>
    );
};
