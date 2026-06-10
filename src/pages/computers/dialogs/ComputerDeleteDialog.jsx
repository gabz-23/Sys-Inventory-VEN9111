import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { useComputerStore } from '../store/useComputerStore';
import { Info } from 'lucide-react';

export const ComputerDeleteDialog = ({ computer, open, onOpenChange }) => {
    const { deleteComputer } = useComputerStore();

    const handleDelete = (e) => {
        e.preventDefault();
        if (!computer) {
            onOpenChange();
            return;
        }

        deleteComputer(computer.id);
        onOpenChange();
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-[430px]">
                <DialogHeader>
                    <DialogTitle className="flex items-center gap-1">
                        <Info />
                        <span> Eliminar computador {computer?.code} </span>
                    </DialogTitle>
                    <DialogDescription>
                        Al eliminar este computador se eliminarán todos sus datos asociados. Esta acción no se puede
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
