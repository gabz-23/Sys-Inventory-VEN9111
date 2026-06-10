import { useState, useEffect } from 'react';
import { DataTable } from '@/components/table/DataTable';
import { useTable } from '@/hooks/useTable';
import { DataTablePagination } from '@/components/table/Pagination';
import { employeeCols } from './columns';
import { useEmployeeStore } from '@/store/useEmployeeStore';
import { useDeskStore } from '@/pages/desks/store/useDeskStore';
import { SelectionToolbar } from '@/components/table/SelectionToolbar';
import { ConfirmDialog } from '@/components/ui/confirm-dialog';

const getSelectedIds = (table) =>
    table.getSelectedRowModel().rows.map((r) => r.original.id);

export const EmployeesTable = () => {
    const { employees, isLoading, loadEmployees } = useEmployeeStore();
    const { loadDesks } = useDeskStore();
    const [isDuplicating, setIsDuplicating] = useState(false);
    const [isDeleting, setIsDeleting] = useState(false);
    const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

    useEffect(() => {
        loadEmployees();
    }, [loadEmployees]);

    const table = useTable(employees, employeeCols);
    const selectedIds = getSelectedIds(table);

    const handleDuplicate = async () => {
        const ids = getSelectedIds(table);
        if (ids.length === 0) return;
        setIsDuplicating(true);
        try {
            await window.electronAPI.duplicateEmployees(ids);
            table.resetRowSelection();
            await loadEmployees(true);
        } catch (err) {
            console.error('Error al duplicar empleados:', err);
        } finally {
            setIsDuplicating(false);
        }
    };

    const handleDeleteConfirm = async () => {
        const ids = getSelectedIds(table);
        if (ids.length === 0) return;
        setShowDeleteConfirm(false);
        setIsDeleting(true);
        try {
            await window.electronAPI.deleteManyEmployees(ids);
            table.resetRowSelection();
            await loadEmployees(true);
            await loadDesks(true);
        } catch (err) {
            console.error('Error al eliminar empleados:', err);
        } finally {
            setIsDeleting(false);
        }
    };

    return (
        <>
            <div className="pt-4">
                <SelectionToolbar
                    selectedCount={selectedIds.length}
                    onDuplicate={handleDuplicate}
                    onDelete={() => setShowDeleteConfirm(true)}
                    isDuplicating={isDuplicating}
                    isDeleting={isDeleting}
                />
            </div>

            <DataTable table={table} columns={employeeCols} isLoading={isLoading} />

            <div className="mt-8">
                <DataTablePagination table={table} />
            </div>

            <ConfirmDialog
                open={showDeleteConfirm}
                onOpenChange={setShowDeleteConfirm}
                title="Eliminar empleados"
                description={`¿Estás seguro de eliminar ${selectedIds.length} empleado(s) seleccionado(s)? Esta acción no se puede deshacer.`}
                confirmLabel="Sí, eliminar"
                cancelLabel="Cancelar"
                variant="destructive"
                onConfirm={handleDeleteConfirm}
            />
        </>
    );
};
