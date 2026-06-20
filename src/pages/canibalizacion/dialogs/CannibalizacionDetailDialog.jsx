import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogTitle,
    DialogHeader,
} from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';

export const CannibalizacionDetailDialog = ({ movement, open, onOpenChange }) => {
    if (!movement) return null;

    const donor = movement.donorComputer;
    const receiver = movement.receiverComputer;
    const items = movement.items || [];

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="border-0 max-w-xl flex flex-col max-h-[90vh] py-3 px-0">
                <DialogHeader className="pt-4 px-6 pb-0 shrink-0">
                    <DialogTitle>Detalles del movimiento</DialogTitle>
                    <DialogDescription>
                        Ítems transferidos entre computadores
                    </DialogDescription>
                </DialogHeader>

                <div className="flex-1 overflow-y-auto min-h-0 px-6 pb-6 pt-4 space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                        <div className="rounded-md border p-3">
                            <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-1">
                                Donante
                            </p>
                            <p className="font-medium">
                                {donor ? `${donor.code} — ${donor.brand} ${donor.model || ''}` : 'Sin asignar'}
                            </p>
                        </div>
                        <div className="rounded-md border p-3">
                            <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-1">
                                Receptor
                            </p>
                            <p className="font-medium">
                                {receiver ? `${receiver.code} — ${receiver.brand} ${receiver.model || ''}` : 'Sin asignar'}
                            </p>
                        </div>
                    </div>

                    {movement.movementDate && (
                        <div className="rounded-md border p-3">
                            <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-1">
                                Fecha de movimiento
                            </p>
                            <p className="font-medium">{movement.movementDate}</p>
                        </div>
                    )}

                    {movement.observations && (
                        <div className="rounded-md border p-3">
                            <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-1">
                                Observaciones
                            </p>
                            <p className="text-sm">{movement.observations}</p>
                        </div>
                    )}

                    <div className="space-y-2">
                        <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">
                            Ítems transferidos ({items.length})
                        </p>
                        <div className="rounded-md border divide-y">
                            {items.map((item, idx) => (
                                <div key={idx} className="flex items-center justify-between px-3 py-2 text-sm">
                                    <div className="flex items-center gap-2">
                                        <span className="font-medium">{item.itemCode}</span>
                                        <span className="text-muted-foreground">{item.itemDescription}</span>
                                    </div>
                                    <Badge variant="outline">
                                        {item.itemType}
                                    </Badge>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    );
};
