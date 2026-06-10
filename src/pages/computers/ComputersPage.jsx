import { useEffect } from 'react';
import { useDialogStore } from '@/store/useDialogStore';
import { useComputerStore } from './store/useComputerStore';
import { useAuthStore } from '@/store/useAuthStore';

import { ComputerAddDialog } from './dialogs/ComputerAddDialog';
import { ComputersTable } from './table/ComputersTable';
import { ComputerEditDialog } from './dialogs/ComputerEditDialog';
import { ComputerDetailsDialog } from './dialogs/ComputerDetailsDialog';
import { ComputerDeleteDialog } from './dialogs/ComputerDeleteDialog';

export function ComputadoresContent() {
    const { isAddDialogOpen, openAddDialog, detailsItem, editData, deleteData, closeDialog, closeAddDialog } =
        useDialogStore();
    const { user } = useAuthStore();
    // Verificar si el usuario tiene rol de viewer (solo lectura)
    const isViewer = user?.role === 'viewer';

    const { loadComputers } = useComputerStore();

    useEffect(() => {
        loadComputers();
    }, []);

    // Cerrar el diálogo de agregar accesorio si está abierto al entrar a esta página
    useEffect(() => {
        const { isAddDialogOpen: isOpen } = useDialogStore.getState();
        if (isOpen) {
            closeAddDialog();
        }
    }, [closeAddDialog]);

    // Manejar el cierre del diálogo
    const handleAddDialogChange = (open) => {
        if (!open) {
            closeAddDialog();
        } else {
            openAddDialog();
        }
    };

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-3xl font-bold text-foreground">Inventario de Computadores </h2>
                    <p className="mt-2 text-muted-foreground">Administración Centralizada de Activos de Cómputo</p>
                </div>

                {/* Ocultar botón de agregar si el usuario es viewer */}
                {!isViewer && (
                    <ComputerAddDialog open={isAddDialogOpen} onOpenChange={handleAddDialogChange} />
                )}

                <ComputerDetailsDialog
                    computer={detailsItem}
                    open={!!detailsItem}
                    onOpenChange={(open) => !open && closeDialog()}
                />

                <ComputerEditDialog
                    computer={editData}
                    open={!!editData}
                    onOpenChange={(open) => !open && closeDialog()}
                />

                <ComputerDeleteDialog
                    computer={deleteData}
                    open={!!deleteData}
                    onOpenChange={(open) => !open && closeDialog()}
                />
            </div>

            <ComputersTable />
        </div>
    );
}
