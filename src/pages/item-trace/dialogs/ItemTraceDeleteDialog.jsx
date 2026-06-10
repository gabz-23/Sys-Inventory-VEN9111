import { Info } from 'lucide-react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { useItemTraceStore } from '@/store/useItemTraceStore';

export const ItemTraceDeleteDialog = ({ itemTrace, open, onOpenChange }) => {
    const { deleteItemTrace } = useItemTraceStore();

    const handleDelete = (e) => {
        e.preventDefault();
        if (!itemTrace) { onOpenChange(); return; }
        deleteItemTrace(itemTrace.id);
        onOpenChange();
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-[430px]">
                <DialogHeader>
                    <DialogTitle>
                        <Info className="inline mr-2 h-5 w-5 text-destructive" />
                        Eliminar trazabilidad {itemTrace?.itemCode}
                    </DialogTitle>
                    <DialogDescription>
                        Al eliminar esta trazabilidad se eliminarán todos sus datos asociados. Esta acción no se puede deshacer.
                    </DialogDescription>
                </DialogHeader>
                <div className="flex justify-end mt-2">
                    <form onSubmit={handleDelete}>
                        <Button type="button" variant="outline" className="cursor-pointer mr-2"
                                onClick={() => onOpenChange(false)}>Cancelar</Button>
                        <Button type="submit" variant="destructive" className="cursor-pointer">Eliminar</Button>
                    </form>
                </div>
            </DialogContent>
        </Dialog>
    );
};
