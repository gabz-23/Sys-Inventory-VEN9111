import { useState, useEffect } from 'react';
import { computerCols } from './columns';
import { DataTable } from '@/components/table/DataTable';
import { SearchComputerBySerial } from '../SearchComputer';
import { useTable } from '@/hooks/useTable';
import { DataTablePagination } from '@/components/table/Pagination';
import { useComputerStore } from '../store/useComputerStore';
import { ComputerFilters } from '../components/ComputerFilters';
import { SelectionToolbar } from '@/components/table/SelectionToolbar';
import { ConfirmDialog } from '@/components/ui/confirm-dialog';

const getSelectedIds = (table) =>
    table.getSelectedRowModel().rows.map((r) => r.original.id);

export const ComputersTable = () => {
    const { computers, isLoading, loadComputers } = useComputerStore();
    const [isDuplicating, setIsDuplicating] = useState(false);
    const [isDeleting, setIsDeleting] = useState(false);
    const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

    useEffect(() => {
        loadComputers();
    }, [loadComputers]);

    const table = useTable(computers, computerCols);
    const selectedIds = getSelectedIds(table);

    const handleDuplicate = async () => {
        const ids = getSelectedIds(table);
        if (ids.length === 0) return;
        setIsDuplicating(true);
        try {
            await window.electronAPI.duplicateComputers(ids);
            table.resetRowSelection();
            await loadComputers(true);
        } catch (err) {
            console.error('Error al duplicar computadores:', err);
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
            await window.electronAPI.deleteManyComputers(ids);
            table.resetRowSelection();
            await loadComputers(true);
        } catch (err) {
            console.error('Error al eliminar computadores:', err);
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

            <div className="flex items-center pt-4 gap-2">
                <SearchComputerBySerial table={table} />
                <ComputerFilters table={table} computers={computers} />
            </div>

            <DataTable table={table} columns={computerCols} isLoading={isLoading} />

            <div className="mt-8">
                <DataTablePagination table={table} />
            </div>

            <ConfirmDialog
                open={showDeleteConfirm}
                onOpenChange={setShowDeleteConfirm}
                title="Eliminar computadores"
                description={`¿Estás seguro de eliminar ${selectedIds.length} computador(es) seleccionado(s)? Esta acción no se puede deshacer.`}
                confirmLabel="Sí, eliminar"
                cancelLabel="Cancelar"
                variant="destructive"
                onConfirm={handleDeleteConfirm}
            />
        </>
    );
};
