import { AlertTriangle } from 'lucide-react';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogTitle,
    DialogHeader,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';

export const ConfirmDialog = ({ open, onOpenChange, title, description, confirmLabel, cancelLabel, variant, onConfirm }) => {
    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="max-w-md">
                <DialogHeader>
                    <div className="flex items-start gap-3">
                        <div className="rounded-full bg-destructive/10 p-2 mt-0.5">
                            <AlertTriangle className="h-5 w-5 text-destructive" />
                        </div>
                        <div>
                            <DialogTitle>{title}</DialogTitle>
                            <DialogDescription className="whitespace-pre-line">{description}</DialogDescription>
                        </div>
                    </div>
                </DialogHeader>
                <div className="flex gap-2 justify-end pt-2">
                    <Button
                        type="button"
                        variant="outline"
                        onClick={() => onOpenChange(false)}
                        className="cursor-pointer"
                    >
                        {cancelLabel || 'Cancelar'}
                    </Button>
                    <Button
                        variant={variant || 'destructive'}
                        onClick={onConfirm}
                        className="cursor-pointer"
                    >
                        {confirmLabel || 'Confirmar'}
                    </Button>
                </div>
            </DialogContent>
        </Dialog>
    );
};