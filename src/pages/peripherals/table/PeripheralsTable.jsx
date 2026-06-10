import { useState, useEffect } from 'react';
import { DataTable } from '@/components/table/DataTable';
import { useTable } from '@/hooks/useTable';
import { DataTablePagination } from '@/components/table/Pagination';
import { peripheralCols } from './columns';
import { usePeripheralStore } from '@/store/usePeripheralStore';
import { SelectionToolbar } from '@/components/table/SelectionToolbar';
import { ConfirmDialog } from '@/components/ui/confirm-dialog';

const getSelectedIds = (table) =>
    table.getSelectedRowModel().rows.map((r) => r.original.id);

export const PeripheralsTable = () => {
    const { peripherals, isLoading, loadPeripherals } = usePeripheralStore();
    const [isDuplicating, setIsDuplicating] = useState(false);
    const [isDeleting, setIsDeleting] = useState(false);
    const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

    useEffect(() => {
        loadPeripherals();
    }, [loadPeripherals]);

    const table = useTable(peripherals, peripheralCols);
    const selectedIds = getSelectedIds(table);

    const handleDuplicate = async () => {
        const ids = getSelectedIds(table);
        if (ids.length === 0) return;
        setIsDuplicating(true);
        try {
            await window.electronAPI.duplicatePeripherals(ids);
            table.resetRowSelection();
            await loadPeripherals(true);
        } catch (err) {
            console.error('Error al duplicar periféricos:', err);
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
            await window.electronAPI.deleteManyPeripherals(ids);
            table.resetRowSelection();
            await loadPeripherals(true);
        } catch (err) {
            console.error('Error al eliminar periféricos:', err);
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

            <DataTable table={table} columns={peripheralCols} isLoading={isLoading} />

            <div className="mt-8">
                <DataTablePagination table={table} />
            </div>

            <ConfirmDialog
                open={showDeleteConfirm}
                onOpenChange={setShowDeleteConfirm}
                title="Eliminar periféricos"
                description={`¿Estás seguro de eliminar ${selectedIds.length} periférico(s) seleccionado(s)? Esta acción no se puede deshacer.`}
                confirmLabel="Sí, eliminar"
                cancelLabel="Cancelar"
                variant="destructive"
                onConfirm={handleDeleteConfirm}
            />
        </>
    );
};
