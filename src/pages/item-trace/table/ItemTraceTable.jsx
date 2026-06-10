import { useState, useEffect } from 'react';
import { DataTable } from '@/components/table/DataTable';
import { useTable } from '@/hooks/useTable';
import { DataTablePagination } from '@/components/table/Pagination';
import { itemTraceCols } from './columns';
import { useItemTraceStore } from '@/store/useItemTraceStore';
import { SelectionToolbar } from '@/components/table/SelectionToolbar';
import { ConfirmDialog } from '@/components/ui/confirm-dialog';

const getSelectedIds = (table) =>
    table.getSelectedRowModel().rows.map((r) => r.original.id);

export const ItemTraceTable = () => {
    const { itemTraces, isLoading, loadItemTraces } = useItemTraceStore();
    const [isDeleting, setIsDeleting] = useState(false);
    const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

    useEffect(() => {
        loadItemTraces();
    }, [loadItemTraces]);

    const table = useTable(itemTraces, itemTraceCols);
    const selectedIds = getSelectedIds(table);

    const handleDeleteConfirm = async () => {
        const ids = getSelectedIds(table);
        if (ids.length === 0) return;
        setShowDeleteConfirm(false);
        setIsDeleting(true);
        try {
            await window.electronAPI.deleteManyItemTraces(ids);
            table.resetRowSelection();
            await loadItemTraces(true);
        } catch (err) {
            console.error('Error al eliminar trazabilidades:', err);
        } finally {
            setIsDeleting(false);
        }
    };

    return (
        <>
            <div className="pt-4">
                <SelectionToolbar
                    selectedCount={selectedIds.length}
                    onDelete={() => setShowDeleteConfirm(true)}
                    isDeleting={isDeleting}
                />
            </div>

            <DataTable table={table} columns={itemTraceCols} isLoading={isLoading} />

            <div className="mt-8">
                <DataTablePagination table={table} />
            </div>

            <ConfirmDialog
                open={showDeleteConfirm}
                onOpenChange={setShowDeleteConfirm}
                title="Eliminar trazabilidades"
                description={`¿Estás seguro de eliminar ${selectedIds.length} trazabilidad(es) seleccionada(s)? Esta acción no se puede deshacer.`}
                confirmLabel="Sí, eliminar"
                cancelLabel="Cancelar"
                variant="destructive"
                onConfirm={handleDeleteConfirm}
            />
        </>
    );
};
