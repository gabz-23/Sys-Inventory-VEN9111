import { useEffect } from 'react';
import { DeskAddDialog } from './dialogs/DeskAddDialog';
import { useDialogStore } from '@/store/useDialogStore';
import { DeskTable } from './table/DeskTable';
import { DeskDetailsDialog } from './dialogs/DeskDetailsDialog';
import { DeskEditDialog } from './dialogs/DeskEditDialog';
import { DeskDeleteDialog } from './dialogs/DeskDeleteDialog';
import { useAuthStore } from '@/store/useAuthStore';

export const DesksPage = () => {
    const { isAddDialogOpen, detailsItem, editData, deleteData, openAddDialog, closeDialog, closeAddDialog } =
        useDialogStore();
    const { user } = useAuthStore();
    // Verificar si el usuario tiene rol de viewer (solo lectura)
    const isViewer = user?.role === 'viewer';

    // Cerrar el diálogo de agregar accesorio si está abierto al entrar a esta página
    useEffect(() => {
        const { isAddDialogOpen: isOpen } = useDialogStore.getState();
        if (isOpen) {
            closeAddDialog();
        }
    }, [closeAddDialog]);

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-3xl font-bold text-foreground">Inventario de Escritorios</h2>
                    <p className="mt-2 text-muted-foreground">
                        Control y Asignación de Mobiliario (Escritorios y Complementos)
                    </p>
                </div>

                {/* Ocultar botón de agregar si el usuario es viewer */}
                {!isViewer && (
                    <DeskAddDialog
                        open={!!isAddDialogOpen}
                        onOpenChange={(open) => (open ? openAddDialog() : closeAddDialog())}
                    />
                )}

                <DeskDetailsDialog
                    desk={detailsItem}
                    open={!!detailsItem}
                    onOpenChange={(open) => !open && closeDialog()}
                />

                <DeskEditDialog desk={editData} open={!!editData} onOpenChange={(open) => !open && closeDialog()} />

                <DeskDeleteDialog
                    desk={deleteData}
                    open={!!deleteData}
                    onOpenChange={(open) => !open && closeDialog()}
                />
            </div>

            <DeskTable />
        </div>
    );
};
