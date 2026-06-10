import { useState } from 'react';
import { Database, Download, Upload, Loader2, CheckCircle, AlertCircle } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ConfirmDialog } from '@/components/ui/confirm-dialog';

export const BackupCard = () => {
    const [isBackingUp, setIsBackingUp] = useState(false);
    const [isRestoring, setIsRestoring] = useState(false);
    const [message, setMessage] = useState(null);
    const [showRestoreConfirm, setShowRestoreConfirm] = useState(false);

    const handleBackup = async () => {
        setIsBackingUp(true);
        setMessage(null);
        try {
            const result = await window.electronAPI.backupDatabase();
            if (result.cancelled) return;
            setMessage({ type: 'success', text: 'Respaldo creado exitosamente.' });
        } catch (err) {
            let msg = err.message || 'Error al crear respaldo';
            msg = msg.replace(/^Error invoking remote method '[^']+': Error: /, '');
            setMessage({ type: 'error', text: msg });
        } finally {
            setIsBackingUp(false);
        }
    };

    const handleRestoreConfirm = async () => {
        setShowRestoreConfirm(false);
        setIsRestoring(true);
        setMessage(null);
        try {
            const result = await window.electronAPI.restoreDatabase();
            if (result.cancelled) return;
            setMessage({ type: 'success', text: 'Base de datos restaurada exitosamente.' });
        } catch (err) {
            let msg = err.message || 'Error al restaurar respaldo';
            msg = msg.replace(/^Error invoking remote method '[^']+': Error: /, '');
            setMessage({ type: 'error', text: msg });
        } finally {
            setIsRestoring(false);
        }
    };

    return (
        <Card className="border-border bg-card transition-shadow hover:shadow-md">
            <CardHeader>
                <div className="flex items-center gap-2">
                    <Database className="h-5 w-5 text-primary" />
                    <CardTitle className="text-base font-semibold">Respaldo de Base de Datos</CardTitle>
                </div>
                <CardDescription>
                    Crea respaldos completos de la base de datos o restaura desde uno existente.
                </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
                {message && (
                    <div
                        className={`flex items-start gap-2 p-3 rounded-md text-sm ${
                            message.type === 'success'
                                ? 'bg-green-50 text-green-800 border border-green-200'
                                : 'bg-red-50 text-red-800 border border-red-200'
                        }`}
                    >
                        {message.type === 'success' ? (
                            <CheckCircle className="h-4 w-4 mt-0.5 shrink-0" />
                        ) : (
                            <AlertCircle className="h-4 w-4 mt-0.5 shrink-0" />
                        )}
                        <span className="whitespace-pre-line">{message.text}</span>
                    </div>
                )}

                <div className="flex gap-3">
                    <Button
                        variant="default"
                        className="flex-1 gap-2 cursor-pointer"
                        onClick={handleBackup}
                        disabled={isBackingUp || isRestoring}
                    >
                        {isBackingUp ? (
                            <Loader2 className="h-4 w-4 animate-spin" />
                        ) : (
                            <Download className="h-4 w-4" />
                        )}
                        Crear Respaldo
                    </Button>
                    <Button
                        variant="outline"
                        className="flex-1 gap-2 cursor-pointer"
                        onClick={() => setShowRestoreConfirm(true)}
                        disabled={isBackingUp || isRestoring}
                    >
                        {isRestoring ? (
                            <Loader2 className="h-4 w-4 animate-spin" />
                        ) : (
                            <Upload className="h-4 w-4" />
                        )}
                        Restaurar
                    </Button>
                </div>
            </CardContent>

            <ConfirmDialog
                open={showRestoreConfirm}
                onOpenChange={setShowRestoreConfirm}
                title="Restaurar base de datos"
                description={
                    '¿Estás seguro de que deseas restaurar la base de datos?\n\n' +
                    'Esto SOBREESCRIBIRÁ todos los datos actuales con los del respaldo.\n' +
                    'Esta acción no se puede deshacer.'
                }
                confirmLabel="Sí, restaurar"
                cancelLabel="Cancelar"
                variant="destructive"
                onConfirm={handleRestoreConfirm}
            />
        </Card>
    );
};