import { BackupCard } from '@/pages/dashboard/components/BackupCard';

export const BackupPage = () => {
    return (
        <div className="flex flex-col items-center justify-center space-y-6 text-center">
            <div>
                <h1 className="text-3xl font-bold tracking-tight text-foreground">Respaldo Base de Datos</h1>
                <p className="mt-2 text-muted-foreground">
                    Crea y restaura respaldos completos de la base de datos del sistema.
                </p>
            </div>
            <div className="max-w-md">
                <BackupCard />
            </div>
        </div>
    );
};
