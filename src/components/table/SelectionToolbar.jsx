import { Copy, Trash2, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useAuthStore } from '@/store/useAuthStore';

export const SelectionToolbar = ({
    selectedCount,
    onDuplicate,
    onDelete,
    isDuplicating,
    isDeleting,
}) => {
    const { user } = useAuthStore();
    const isViewer = user?.role === 'viewer';

    if (selectedCount === 0) return null;

    return (
        <div className="flex items-center justify-between rounded-lg border bg-muted/40 px-4 py-2.5">
            <span className="text-sm font-medium text-muted-foreground">
                {selectedCount} seleccionado{selectedCount !== 1 ? 's' : ''}
            </span>
            <div className="flex items-center gap-2">
                {!isViewer && (
                    <>
                        <Button
                            variant="outline"
                            size="sm"
                            className="gap-2 cursor-pointer"
                            onClick={onDuplicate}
                            disabled={isDuplicating}
                        >
                            {isDuplicating ? (
                                <Loader2 className="h-4 w-4 animate-spin" />
                            ) : (
                                <Copy className="h-4 w-4" />
                            )}
                            Duplicar
                        </Button>
                        <Button
                            variant="destructive"
                            size="sm"
                            className="gap-2 cursor-pointer"
                            onClick={onDelete}
                            disabled={isDeleting}
                        >
                            {isDeleting ? (
                                <Loader2 className="h-4 w-4 animate-spin" />
                            ) : (
                                <Trash2 className="h-4 w-4" />
                            )}
                            Eliminar
                        </Button>
                    </>
                )}
            </div>
        </div>
    );
};