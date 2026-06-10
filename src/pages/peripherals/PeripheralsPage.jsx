import { useEffect } from 'react';
import { PeripheralAddDialog } from './dialogs/PeripheralAddDialog';
import { useDialogStore } from '@/store/useDialogStore';
import { PeripheralsTable } from './table/PeripheralsTable';
import { PeripheralDetailsDialog } from './dialogs/PeripheralDetailsDialog';
import { PeripheralEditDialog } from './dialogs/PeripheralEditDialog';
import { PeripheralDeleteDialog } from './dialogs/PeripheralDeleteDialog';
import { useAuthStore } from '@/store/useAuthStore';

export const PeripheralsPage = () => {
    const { isAddDialogOpen, detailsItem, editData, deleteData, openAddDialog, closeDialog, closeAddDialog } =
        useDialogStore();
    const { user } = useAuthStore();
    const isViewer = user?.role === 'viewer';

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
                    <h2 className="text-3xl font-bold text-foreground">Inventario de Periféricos</h2>
                    <p className="mt-2 text-muted-foreground">
                        Control y Asignación de Periféricos
                    </p>
                </div>

                {!isViewer && (
                    <PeripheralAddDialog
                        open={!!isAddDialogOpen}
                        onOpenChange={(open) => (open ? openAddDialog() : closeAddDialog())}
                    />
                )}

                <PeripheralDetailsDialog
                    peripheral={detailsItem}
                    open={!!detailsItem}
                    onOpenChange={(open) => !open && closeDialog()}
                />

                <PeripheralEditDialog peripheral={editData} open={!!editData} onOpenChange={(open) => !open && closeDialog()} />

                <PeripheralDeleteDialog
                    peripheral={deleteData}
                    open={!!deleteData}
                    onOpenChange={(open) => !open && closeDialog()}
                />
            </div>

            <PeripheralsTable />
        </div>
    );
};
