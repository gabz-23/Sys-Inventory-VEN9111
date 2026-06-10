import { useEffect } from 'react';
import { EmployeeAddDialog } from './dialogs/EmployeeAddDialog';
import { useDialogStore } from '@/store/useDialogStore';
import { EmployeesTable } from './table/EmployeesTable';
import { EmployeeDetailsDialog } from './dialogs/EmployeeDetailsDialog';
import { EmployeeEditDialog } from './dialogs/EmployeeEditDialog';
import { EmployeeDeleteDialog } from './dialogs/EmployeeDeleteDialog';
import { useAuthStore } from '@/store/useAuthStore';

export const EmployeesPage = () => {
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
                    <h2 className="text-3xl font-bold text-foreground">Gestión de Empleados</h2>
                    <p className="mt-2 text-muted-foreground">
                        Administración del personal registrado en el sistema
                    </p>
                </div>

                {!isViewer && (
                    <EmployeeAddDialog
                        open={!!isAddDialogOpen}
                        onOpenChange={(open) => (open ? openAddDialog() : closeAddDialog())}
                    />
                )}

                <EmployeeDetailsDialog
                    employee={detailsItem}
                    open={!!detailsItem}
                    onOpenChange={(open) => !open && closeDialog()}
                />

                <EmployeeEditDialog
                    employee={editData}
                    open={!!editData}
                    onOpenChange={(open) => !open && closeDialog()}
                />

                <EmployeeDeleteDialog
                    employee={deleteData}
                    open={!!deleteData}
                    onOpenChange={(open) => !open && closeDialog()}
                />
            </div>

            <EmployeesTable />
        </div>
    );
};
