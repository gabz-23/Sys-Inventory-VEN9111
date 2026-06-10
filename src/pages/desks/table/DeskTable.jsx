import { useState, useEffect } from 'react';
import { DataTable } from '@/components/table/DataTable';
import { SearchDeskByCode } from '../SearchDesk';
import { useTable } from '@/hooks/useTable';
import { DataTablePagination } from '@/components/table/Pagination';
import { deskCols } from './columns';
import { useDeskStore } from '../store/useDeskStore';
import { DeskFilters } from '../components/DeskFilters';
import { SelectionToolbar } from '@/components/table/SelectionToolbar';
import { ConfirmDialog } from '@/components/ui/confirm-dialog';

const getSelectedIds = (table) =>
    table.getSelectedRowModel().rows.map((r) => r.original.id);

export const DeskTable = () => {
    const { desks, isLoading, loadDesks } = useDeskStore();
    const [isDuplicating, setIsDuplicating] = useState(false);
    const [isDeleting, setIsDeleting] = useState(false);
    const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

    useEffect(() => {
        loadDesks();
    }, [loadDesks]);

    const table = useTable(desks, deskCols);
    const selectedIds = getSelectedIds(table);

    const handleDuplicate = async () => {
        const ids = getSelectedIds(table);
        if (ids.length === 0) return;
        setIsDuplicating(true);
        try {
            await window.electronAPI.duplicateDeskTables(ids);
            table.resetRowSelection();
            await loadDesks(true);
        } catch (err) {
            console.error('Error al duplicar escritorios:', err);
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
            await window.electronAPI.deleteManyDeskTables(ids);
            table.resetRowSelection();
            await loadDesks(true);
        } catch (err) {
            console.error('Error al eliminar escritorios:', err);
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
                <SearchDeskByCode table={table} />
                <DeskFilters table={table} desks={desks} />
            </div>

            <DataTable table={table} columns={deskCols} isLoading={isLoading} />

            <div className="mt-8">
                <DataTablePagination table={table} />
            </div>

            <ConfirmDialog
                open={showDeleteConfirm}
                onOpenChange={setShowDeleteConfirm}
                title="Eliminar escritorios"
                description={`¿Estás seguro de eliminar ${selectedIds.length} escritorio(s) seleccionado(s)? Esta acción no se puede deshacer.`}
                confirmLabel="Sí, eliminar"
                cancelLabel="Cancelar"
                variant="destructive"
                onConfirm={handleDeleteConfirm}
            />
        </>
    );
};
