import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Info } from 'lucide-react';
import { useDeskAccessoryStore } from '@/store/useDeskAccessoryStore';

export const DeskAccessoryDeleteDialog = ({ deskAccessory, open, onOpenChange }) => {
    const { deleteDeskAccessory } = useDeskAccessoryStore();

    const handleDelete = (e) => {
        e.preventDefault();
        if (!deskAccessory) {
            onOpenChange();
            return;
        }

        deleteDeskAccessory(deskAccessory.id);
        onOpenChange();
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-[430px]">
                <DialogHeader>
                    <DialogTitle className="flex items-center gap-1">
                        <Info />
                        <span> Eliminar accesorio {deskAccessory?.description} </span>
                    </DialogTitle>
                    <DialogDescription>
                        Al eliminar este accesorio se eliminarán todos sus datos asociados. Esta acción no se puede
                        deshacer.
                    </DialogDescription>
                </DialogHeader>

                <div className="flex justify-end mt-2">
                    <form onSubmit={(e) => handleDelete(e)}>
                        <Button
                            type="button"
                            variant="outline"
                            className="cursor-pointer mr-2"
                            onClick={() => onOpenChange(false)}
                        >
                            Cancelar
                        </Button>
                        <Button type="submit" variant="destructive" className="cursor-pointer">
                            Eliminar
                        </Button>
                    </form>
                </div>
            </DialogContent>
        </Dialog>
    );
};
