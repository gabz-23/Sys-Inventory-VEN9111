import { useEffect } from 'react';
import { ComponentAddDialog } from './dialogs/ComponentAddDialog';
import { useDialogStore } from '@/store/useDialogStore';
import { ComponentsTable } from './table/ComponentsTable';
import { ComponentDetailsDialog } from './dialogs/ComponentDetailsDialog';
import { ComponentEditDialog } from './dialogs/ComponentEditDialog';
import { ComponentDeleteDialog } from './dialogs/ComponentDeleteDialog';
import { useAuthStore } from '@/store/useAuthStore';

export const ComponentsPage = () => {
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
                    <h2 className="text-3xl font-bold text-foreground">Inventario de Componentes</h2>
                    <p className="mt-2 text-muted-foreground">
                        Control y Gestión de Componentes de Computadores
                    </p>
                </div>

                {!isViewer && (
                    <ComponentAddDialog
                        open={!!isAddDialogOpen}
                        onOpenChange={(open) => (open ? openAddDialog() : closeAddDialog())}
                    />
                )}

                <ComponentDetailsDialog
                    component={detailsItem}
                    open={!!detailsItem}
                    onOpenChange={(open) => !open && closeDialog()}
                />

                <ComponentEditDialog component={editData} open={!!editData} onOpenChange={(open) => !open && closeDialog()} />

                <ComponentDeleteDialog
                    component={deleteData}
                    open={!!deleteData}
                    onOpenChange={(open) => !open && closeDialog()}
                />
            </div>

            <ComponentsTable />
        </div>
    );
};
