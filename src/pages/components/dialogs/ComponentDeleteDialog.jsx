import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Info } from 'lucide-react';
import { useComponentStore } from '@/store/useComponentStore';

export const ComponentDeleteDialog = ({ component, open, onOpenChange }) => {
    const { deleteComponent } = useComponentStore();

    const handleDelete = (e) => {
        e.preventDefault();
        if (!component) {
            onOpenChange();
            return;
        }

        deleteComponent(component.id);
        onOpenChange();
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-[430px]">
                <DialogHeader>
                    <DialogTitle className="flex items-center gap-1">
                        <Info />
                        <span> Eliminar componente {component?.description} </span>
                    </DialogTitle>
                    <DialogDescription>
                        Al eliminar este componente se eliminarán todos sus datos asociados. Esta acción no se puede
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
