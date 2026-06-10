import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Card, CardContent } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Barcode, Calendar, Wrench, History, Hammer, FileText } from 'lucide-react';

export const ItemTraceDetailsDialog = ({ open, onOpenChange, itemTrace }) => {
    if (!itemTrace) return null;

    const formatDate = (date) => {
        if (!date) return 'No registrado';
        return new Date(date + 'T00:00:00').toLocaleDateString('es-ES', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
        });
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="border-0 max-w-2xl flex flex-col max-h-[90vh] py-3 px-0">
                <DialogHeader className="pt-4 px-6 pb-0 shrink-0">
                    <div className="flex items-center gap-3 mb-2">
                        <div className="p-2 rounded-lg bg-amber-50">
                            <History className="w-5 h-5 text-amber-600" />
                        </div>
                        <div className="flex-1">
                            <DialogTitle className="text-2xl font-bold text-zinc-900">
                                {itemTrace?.itemCode || 'Trazabilidad'}
                            </DialogTitle>
                            <DialogDescription className="text-sm text-slate-600 mt-1">
                                Historial completo del estado del accesorio
                            </DialogDescription>
                        </div>
                    </div>
                </DialogHeader>

                <Separator className="shrink-0" />

                <Card className="border-0 shadow-none flex-1 overflow-y-auto min-h-0 px-6 pb-6 pt-0">
                    <CardContent className="space-y-6 pt-4 pb-0">
                        <div className="space-y-4">
                            <div className="flex items-center gap-2 mb-3">
                                <Barcode className="w-4 h-4 text-amber-600" />
                                <h3 className="text-sm font-semibold text-slate-700 uppercase tracking-wide">
                                    Información del Accesorio
                                </h3>
                            </div>
                            <div className="grid grid-cols-2 gap-4 bg-slate-50 p-4 rounded-lg">
                                <div className="space-y-1">
                                    <div className="flex items-center gap-1">
                                        <Barcode className="w-3 h-3 text-slate-400" />
                                        <p className="text-xs font-medium text-slate-500 uppercase tracking-wide">
                                            Tipo de Accesorio
                                        </p>
                                    </div>
                                    <p className="font-semibold text-slate-900">{itemTrace?.itemType || 'N/A'}</p>
                                </div>
                                <div className="space-y-1">
                                    <div className="flex items-center gap-1">
                                        <Barcode className="w-3 h-3 text-slate-400" />
                                        <p className="text-xs font-medium text-slate-500 uppercase tracking-wide">
                                            Código
                                        </p>
                                    </div>
                                    <p className="font-mono text-lg font-bold text-slate-900">{itemTrace?.itemCode || 'N/A'}</p>
                                </div>
                                {itemTrace?.itemDescription && (
                                    <div className="space-y-1 col-span-2">
                                        <div className="flex items-center gap-1">
                                            <FileText className="w-3 h-3 text-slate-400" />
                                            <p className="text-xs font-medium text-slate-500 uppercase tracking-wide">
                                                Descripción
                                            </p>
                                        </div>
                                        <p className="font-semibold text-slate-900">{itemTrace.itemDescription}</p>
                                    </div>
                                )}
                            </div>
                        </div>

                        <div className="space-y-4">
                            <div className="flex items-center gap-2 mb-3">
                                <Calendar className="w-4 h-4 text-amber-600" />
                                <h3 className="text-sm font-semibold text-slate-700 uppercase tracking-wide">
                                    Fechas del Evento
                                </h3>
                            </div>
                            <div className="grid grid-cols-2 gap-4 bg-slate-50 p-4 rounded-lg">
                                <div className="space-y-1">
                                    <div className="flex items-center gap-1">
                                        <Calendar className="w-3 h-3 text-red-400" />
                                        <p className="text-xs font-medium text-slate-500 uppercase tracking-wide">
                                            Fecha de Daño
                                        </p>
                                    </div>
                                    <p className="font-semibold text-red-700">
                                        {formatDate(itemTrace?.dateDamaged)}
                                    </p>
                                </div>
                                <div className="space-y-1">
                                    <div className="flex items-center gap-1">
                                        <Wrench className="w-3 h-3 text-yellow-400" />
                                        <p className="text-xs font-medium text-slate-500 uppercase tracking-wide">
                                            Fecha Ingreso Reparación
                                        </p>
                                    </div>
                                    <p className="font-semibold text-yellow-700">
                                        {formatDate(itemTrace?.dateInRepair)}
                                    </p>
                                </div>
                                <div className="space-y-1">
                                    <div className="flex items-center gap-1">
                                        <Wrench className="w-3 h-3 text-amber-400" />
                                        <p className="text-xs font-medium text-slate-500 uppercase tracking-wide">
                                            Fecha de Reparación
                                        </p>
                                    </div>
                                    <p className="font-semibold text-amber-700">
                                        {formatDate(itemTrace?.dateRepaired)}
                                    </p>
                                </div>
                                <div className="space-y-1">
                                    <div className="flex items-center gap-1">
                                        <History className="w-3 h-3 text-green-400" />
                                        <p className="text-xs font-medium text-slate-500 uppercase tracking-wide">
                                            Fecha de Reincorporación
                                        </p>
                                    </div>
                                    <p className="font-semibold text-green-700">
                                        {formatDate(itemTrace?.dateReinstated)}
                                    </p>
                                </div>
                                <div className="space-y-1">
                                    <div className="flex items-center gap-1">
                                        <Hammer className="w-3 h-3 text-slate-400" />
                                        <p className="text-xs font-medium text-slate-500 uppercase tracking-wide">
                                            Reconstruido
                                        </p>
                                    </div>
                                    <p className="font-semibold text-slate-900">
                                        {itemTrace?.rebuilt ? 'Sí' : 'No'}
                                    </p>
                                </div>
                                {itemTrace?.createdBy && (
                                    <div className="space-y-1">
                                        <p className="text-xs font-medium text-slate-500 uppercase tracking-wide">
                                            Registrado por
                                        </p>
                                        <p className="font-medium text-slate-900">
                                            {itemTrace.createdBy}
                                        </p>
                                    </div>
                                )}
                                {itemTrace?.createdAt && (
                                    <div className="space-y-1">
                                        <p className="text-xs font-medium text-slate-500 uppercase tracking-wide">
                                            Fecha de Registro
                                        </p>
                                        <p className="font-medium text-slate-900">
                                            {new Date(itemTrace.createdAt).toLocaleDateString()}
                                        </p>
                                    </div>
                                )}
                            </div>
                        </div>


                        {itemTrace?.observations && (
                            <div className="space-y-4">
                                <div className="flex items-center gap-2 mb-3">
                                    <FileText className="w-4 h-4 text-amber-600" />
                                    <h3 className="text-sm font-semibold text-slate-700 uppercase tracking-wide">Observaciones</h3>
                                </div>
                                <div className="bg-slate-50 p-4 rounded-lg">
                                    <p className="text-slate-900 whitespace-pre-wrap">{itemTrace.observations}</p>
                                </div>
                            </div>
                        )}
                    </CardContent>
                </Card>
            </DialogContent>
        </Dialog>
    );
};
