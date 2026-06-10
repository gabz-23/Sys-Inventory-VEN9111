import { useEffect } from 'react';
import { ItemTraceAddDialog } from './dialogs/ItemTraceAddDialog';
import { useDialogStore } from '@/store/useDialogStore';
import { ItemTraceTable } from './table/ItemTraceTable';
import { ItemTraceDetailsDialog } from './dialogs/ItemTraceDetailsDialog';
import { ItemTraceEditDialog } from './dialogs/ItemTraceEditDialog';
import { ItemTraceDeleteDialog } from './dialogs/ItemTraceDeleteDialog';
import { useAuthStore } from '@/store/useAuthStore';

export const ItemTracePage = () => {
    const { isAddDialogOpen, detailsItem, editData, deleteData,
            openAddDialog, closeDialog, closeAddDialog } = useDialogStore();
    const { user } = useAuthStore();
    const isViewer = user?.role === 'viewer';

    useEffect(() => {
        const { isAddDialogOpen: isOpen } = useDialogStore.getState();
        if (isOpen) closeAddDialog();
    }, [closeAddDialog]);

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-3xl font-bold text-foreground">Trazabilidad de Items</h2>
                    <p className="mt-2 text-muted-foreground">Control y seguimiento del historial de estados de los bienes</p>
                </div>

                {!isViewer && (
                    <ItemTraceAddDialog
                        open={!!isAddDialogOpen}
                        onOpenChange={(open) => (open ? openAddDialog() : closeAddDialog())}
                    />
                )}

                <ItemTraceDetailsDialog
                    itemTrace={detailsItem}
                    open={!!detailsItem}
                    onOpenChange={(open) => !open && closeDialog()}
                />
                <ItemTraceEditDialog
                    itemTrace={editData}
                    open={!!editData}
                    onOpenChange={(open) => !open && closeDialog()}
                />
                <ItemTraceDeleteDialog
                    itemTrace={deleteData}
                    open={!!deleteData}
                    onOpenChange={(open) => !open && closeDialog()}
                />
            </div>

            <ItemTraceTable />
        </div>
    );
};
