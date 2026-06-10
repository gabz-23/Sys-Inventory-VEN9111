import { useState } from 'react';
import { Loader2, AlertTriangle } from 'lucide-react';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogTitle,
    DialogHeader,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';

export const ConfirmDeleteDialog = ({ open, onOpenChange, user, onSuccess }) => {
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const handleDelete = async () => {
        setIsLoading(true);
        setError('');

        try {
            await window.electronAPI.adminDeleteUser(user.id);
            onSuccess?.();
            onOpenChange(false);
        } catch (err) {
            let errorMessage = err.message || 'Error al eliminar usuario';
            errorMessage = errorMessage.replace(/^Error invoking remote method '[^']+': Error: /, '');
            setError(errorMessage);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <Dialog open={open} onOpenChange={(open) => { if (!open) onOpenChange(false); }}>
            <DialogContent className="max-w-md">
                <DialogHeader>
                    <div className="flex items-center gap-3">
                        <div className="rounded-full bg-destructive/10 p-2">
                            <AlertTriangle className="h-5 w-5 text-destructive" />
                        </div>
                        <div>
                            <DialogTitle>Eliminar Usuario</DialogTitle>
                            <DialogDescription>
                                ¿Estás seguro de que deseas eliminar a <strong>{user?.username}</strong>?
                                Esta acción no se puede deshacer.
                            </DialogDescription>
                        </div>
                    </div>
                </DialogHeader>

                {error && (
                    <div className="p-3 text-sm text-destructive bg-destructive/10 border border-destructive/20 rounded-md">
                        {error}
                    </div>
                )}

                <div className="bg-muted/50 rounded-lg p-3 text-sm space-y-1">
                    <p><strong>Nombre:</strong> {user?.firstName}</p>
                    <p><strong>Usuario:</strong> {user?.username}</p>
                    <p><strong>Cédula:</strong> {user?.cedula}</p>
                    <p><strong>Rol:</strong> {user?.role === 'admin' ? 'Administrador' : 'Visualizador'}</p>
                </div>

                <div className="flex gap-2 justify-end">
                    <Button
                        type="button"
                        variant="outline"
                        onClick={() => onOpenChange(false)}
                        disabled={isLoading}
                        className="cursor-pointer"
                    >
                        Cancelar
                    </Button>
                    <Button
                        variant="destructive"
                        onClick={handleDelete}
                        disabled={isLoading}
                        className="cursor-pointer"
                    >
                        {isLoading ? (
                            <>
                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                Eliminando...
                            </>
                        ) : (
                            'Sí, eliminar usuario'
                        )}
                    </Button>
                </div>
            </DialogContent>
        </Dialog>
    );
};