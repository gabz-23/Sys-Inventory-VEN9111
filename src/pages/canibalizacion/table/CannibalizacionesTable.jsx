import { useState, useEffect } from 'react';
import { DataTable } from '@/components/table/DataTable';
import { useTable } from '@/hooks/useTable';
import { DataTablePagination } from '@/components/table/Pagination';
import { cannibalizacionCols } from './columns';
import { CannibalizacionActions } from './CannibalizacionActions';
import { useCannibalizationStore } from '@/store/useCannibalizationStore';
import { CannibalizacionDetailDialog } from '../dialogs/CannibalizacionDetailDialog';
import { SelectionToolbar } from '@/components/table/SelectionToolbar';
import { ConfirmDialog } from '@/components/ui/confirm-dialog';

const getSelectedIds = (table) =>
    table.getSelectedRowModel().rows.map((r) => r.original.id);

export const CannibalizacionesTable = () => {
    const { movements, isLoading, loadMovements, deleteMovements } = useCannibalizationStore();
    const [detailMovement, setDetailMovement] = useState(null);
    const [isDeleting, setIsDeleting] = useState(false);
    const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
    const [deleteTarget, setDeleteTarget] = useState(null);

    useEffect(() => {
        loadMovements();
    }, [loadMovements]);

    const handleViewDetails = (item) => {
        setDetailMovement(item);
    };

    const handleIndividualDelete = (item) => {
        setDeleteTarget(item);
        setShowDeleteConfirm(true);
    };

    const columns = cannibalizacionCols.map((col) => {
        if (col.id === 'actions') {
            return {
                ...col,
                cell: ({ row }) => (
                    <CannibalizacionActions
                        item={row.original}
                        onViewDetails={handleViewDetails}
                        onDelete={handleIndividualDelete}
                    />
                ),
            };
        }
        return col;
    });

    const table = useTable(movements, columns);
    const selectedIds = getSelectedIds(table);

    const handleDeleteConfirm = async () => {
        const ids = deleteTarget ? [deleteTarget.id] : getSelectedIds(table);
        if (ids.length === 0) return;
        setShowDeleteConfirm(false);
        setDeleteTarget(null);
        setIsDeleting(true);
        try {
            await deleteMovements(ids);
            table.resetRowSelection();
        } catch (err) {
            console.error('Error al eliminar movimientos:', err);
        } finally {
            setIsDeleting(false);
        }
    };

    return (
        <>
            <div className="pt-4">
                <SelectionToolbar
                    selectedCount={selectedIds.length}
                    onDuplicate={() => {}}
                    onDelete={() => setShowDeleteConfirm(true)}
                    isDuplicating={false}
                    isDeleting={isDeleting}
                />
            </div>

            <DataTable table={table} columns={columns} isLoading={isLoading} />

            <div className="mt-8">
                <DataTablePagination table={table} />
            </div>

            <CannibalizacionDetailDialog
                movement={detailMovement}
                open={!!detailMovement}
                onOpenChange={(open) => { if (!open) setDetailMovement(null); }}
            />

            <ConfirmDialog
                open={showDeleteConfirm}
                onOpenChange={(open) => { if (!open) setDeleteTarget(null); setShowDeleteConfirm(open); }}
                title="Eliminar movimiento"
                description={
                    deleteTarget
                        ? `¿Estás seguro de eliminar este movimiento? Esta acción no se puede deshacer.`
                        : `¿Estás seguro de eliminar ${selectedIds.length} movimiento(s) seleccionado(s)? Esta acción no se puede deshacer.`
                }
                confirmLabel="Sí, eliminar"
                cancelLabel="Cancelar"
                variant="destructive"
                onConfirm={handleDeleteConfirm}
            />
        </>
    );
};
