import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Card, CardContent } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Monitor, Hash, AlignLeft, Building2, Cpu, Usb, Tag, CircleCheck } from 'lucide-react';

export const PeripheralDetailsDialog = ({ open, onOpenChange, peripheral }) => {
    if (!peripheral) return null;

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="border-0 max-w-2xl flex flex-col max-h-[90vh] py-3 px-0">
                <DialogHeader className="pt-4 px-6 pb-0 shrink-0">
                    <div className="flex items-center gap-3 mb-2">
                        <div className="p-2 rounded-lg bg-purple-50">
                            <Monitor className="w-5 h-5 text-purple-600" />
                        </div>
                        <div className="flex-1">
                            <DialogTitle className="text-2xl font-bold text-zinc-900">
                                {peripheral?.code || 'Periférico'}
                            </DialogTitle>
                            <DialogDescription className="text-sm text-slate-600 mt-1">
                                Información completa del periférico registrado
                            </DialogDescription>
                        </div>
                    </div>
                </DialogHeader>

                <Separator className="shrink-0" />

                <Card className="border-0 shadow-none flex-1 overflow-y-auto min-h-0 px-6 pb-6 pt-0">
                    <CardContent className="space-y-6 pt-4 pb-0">
                        <div className="space-y-4">
                            <div className="flex items-center gap-2 mb-3">
                                <Monitor className="w-4 h-4 text-purple-600" />
                                <h3 className="text-sm font-semibold text-slate-700 uppercase tracking-wide">
                                    Información del Periférico
                                </h3>
                            </div>
                            <div className="grid grid-cols-2 gap-4 bg-slate-50 p-4 rounded-lg">
                                <div className="space-y-1">
                                    <div className="flex items-center gap-1">
                                        <Hash className="w-3 h-3 text-slate-400" />
                                        <p className="text-xs font-medium text-slate-500 uppercase tracking-wide">Código</p>
                                    </div>
                                    <p className="font-mono text-lg font-bold text-slate-900">{peripheral?.code || 'N/A'}</p>
                                </div>
                                <div className="space-y-1">
                                    <div className="flex items-center gap-1">
                                        <Hash className="w-3 h-3 text-slate-400" />
                                        <p className="text-xs font-medium text-slate-500 uppercase tracking-wide">Serial</p>
                                    </div>
                                    <p className="font-semibold text-slate-900">{peripheral?.serial || 'N/A'}</p>
                                </div>
                                <div className="space-y-1">
                                    <div className="flex items-center gap-1">
                                        <AlignLeft className="w-3 h-3 text-slate-400" />
                                        <p className="text-xs font-medium text-slate-500 uppercase tracking-wide">Descripción</p>
                                    </div>
                                    <p className="font-semibold text-slate-900">{peripheral?.description || 'N/A'}</p>
                                </div>
                                <div className="space-y-1">
                                    <div className="flex items-center gap-1">
                                        <Building2 className="w-3 h-3 text-slate-400" />
                                        <p className="text-xs font-medium text-slate-500 uppercase tracking-wide">Marca</p>
                                    </div>
                                    <p className="font-semibold text-slate-900">{peripheral?.brand || 'N/A'}</p>
                                </div>
                                <div className="space-y-1">
                                    <div className="flex items-center gap-1">
                                        <Cpu className="w-3 h-3 text-slate-400" />
                                        <p className="text-xs font-medium text-slate-500 uppercase tracking-wide">Modelo</p>
                                    </div>
                                    <p className="font-semibold text-slate-900">{peripheral?.model || 'N/A'}</p>
                                </div>
                                <div className="space-y-1">
                                    <div className="flex items-center gap-1">
                                        <Usb className="w-3 h-3 text-slate-400" />
                                        <p className="text-xs font-medium text-slate-500 uppercase tracking-wide">Tipo de Conexión</p>
                                    </div>
                                    <p className="font-semibold text-slate-900">{peripheral?.connectionType || 'N/A'}</p>
                                </div>
                                <div className="space-y-1">
                                    <div className="flex items-center gap-1">
                                        <Tag className="w-3 h-3 text-slate-400" />
                                        <p className="text-xs font-medium text-slate-500 uppercase tracking-wide">Tipo</p>
                                    </div>
                                    <p className="font-semibold text-slate-900">{peripheral?.type || 'N/A'}</p>
                                </div>
                                <div className="space-y-1">
                                    <div className="flex items-center gap-1">
                                        <CircleCheck className="w-3 h-3 text-slate-400" />
                                        <p className="text-xs font-medium text-slate-500 uppercase tracking-wide">Estado</p>
                                    </div>
                                    <p className="font-semibold text-slate-900">{peripheral?.state || 'N/A'}</p>
                                </div>
                                <div className="space-y-1">
                                    <div className="flex items-center gap-1">
                                        <Monitor className="w-3 h-3 text-slate-400" />
                                        <p className="text-xs font-medium text-slate-500 uppercase tracking-wide">Computador</p>
                                    </div>
                                    <p className="font-semibold text-slate-900">{peripheral?.computer?.code || 'Sin asignar'}</p>
                                </div>
                                {peripheral?.createdAt && (
                                    <div className="space-y-1">
                                        <p className="text-xs font-medium text-slate-500 uppercase tracking-wide">
                                            Fecha de Registro
                                        </p>
                                        <p className="font-medium text-slate-900">
                                            {new Date(peripheral.createdAt).toLocaleDateString()}
                                        </p>
                                    </div>
                                )}
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </DialogContent>
        </Dialog>
    );
};
