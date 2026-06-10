import { useEffect } from 'react';
import { DeskAccessoryAddDialog } from './dialogs/DeskAccessoryAddDialog';
import { useDialogStore } from '@/store/useDialogStore';
import { DeskAccessoriesTable } from './table/DeskAccessoriesTable';
import { DeskAccessoryDetailsDialog } from './dialogs/DeskAccessoryDetailsDialog';
import { DeskAccessoryEditDialog } from './dialogs/DeskAccessoryEditDialog';
import { DeskAccessoryDeleteDialog } from './dialogs/DeskAccessoryDeleteDialog';
import { useAuthStore } from '@/store/useAuthStore';

export const DeskAccessoriesPage = () => {
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
                    <h2 className="text-3xl font-bold text-foreground">Accesorios de Escritorio</h2>
                    <p className="mt-2 text-muted-foreground">
                        Gestión de accesorios asignados a escritorios del sistema
                    </p>
                </div>

                {!isViewer && (
                    <DeskAccessoryAddDialog
                        open={!!isAddDialogOpen}
                        onOpenChange={(open) => (open ? openAddDialog() : closeAddDialog())}
                    />
                )}

                <DeskAccessoryDetailsDialog
                    deskAccessory={detailsItem}
                    open={!!detailsItem}
                    onOpenChange={(open) => !open && closeDialog()}
                />

                <DeskAccessoryEditDialog
                    deskAccessory={editData}
                    open={!!editData}
                    onOpenChange={(open) => !open && closeDialog()}
                />

                <DeskAccessoryDeleteDialog
                    deskAccessory={deleteData}
                    open={!!deleteData}
                    onOpenChange={(open) => !open && closeDialog()}
                />
            </div>

            <DeskAccessoriesTable />
        </div>
    );
};
