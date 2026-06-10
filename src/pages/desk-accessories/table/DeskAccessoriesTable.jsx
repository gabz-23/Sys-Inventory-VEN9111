import { useState, useEffect } from 'react';
import { DataTable } from '@/components/table/DataTable';
import { useTable } from '@/hooks/useTable';
import { DataTablePagination } from '@/components/table/Pagination';
import { deskAccessoryCols } from './columns';
import { useDeskAccessoryStore } from '@/store/useDeskAccessoryStore';
import { SelectionToolbar } from '@/components/table/SelectionToolbar';
import { ConfirmDialog } from '@/components/ui/confirm-dialog';

const getSelectedIds = (table) =>
    table.getSelectedRowModel().rows.map((r) => r.original.id);

export const DeskAccessoriesTable = () => {
    const { deskAccessories, isLoading, loadDeskAccessories } = useDeskAccessoryStore();
    const [isDuplicating, setIsDuplicating] = useState(false);
    const [isDeleting, setIsDeleting] = useState(false);
    const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

    useEffect(() => {
        loadDeskAccessories();
    }, [loadDeskAccessories]);

    const table = useTable(deskAccessories, deskAccessoryCols);
    const selectedIds = getSelectedIds(table);

    const handleDuplicate = async () => {
        const ids = getSelectedIds(table);
        if (ids.length === 0) return;
        setIsDuplicating(true);
        try {
            await window.electronAPI.duplicateDeskAccessories(ids);
            table.resetRowSelection();
            await loadDeskAccessories(true);
        } catch (err) {
            console.error('Error al duplicar accesorios de escritorio:', err);
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
            await window.electronAPI.deleteManyDeskAccessories(ids);
            table.resetRowSelection();
            await loadDeskAccessories(true);
        } catch (err) {
            console.error('Error al eliminar accesorios de escritorio:', err);
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

            <DataTable table={table} columns={deskAccessoryCols} isLoading={isLoading} />

            <div className="mt-8">
                <DataTablePagination table={table} />
            </div>

            <ConfirmDialog
                open={showDeleteConfirm}
                onOpenChange={setShowDeleteConfirm}
                title="Eliminar accesorios de escritorio"
                description={`¿Estás seguro de eliminar ${selectedIds.length} accesorio(s) de escritorio seleccionado(s)? Esta acción no se puede deshacer.`}
                confirmLabel="Sí, eliminar"
                cancelLabel="Cancelar"
                variant="destructive"
                onConfirm={handleDeleteConfirm}
            />
        </>
    );
};
