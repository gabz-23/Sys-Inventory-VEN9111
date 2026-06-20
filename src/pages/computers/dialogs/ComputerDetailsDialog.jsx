import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Monitor, Cpu, Mouse, Box } from 'lucide-react';
import { statusStyles } from '@/constants/badgeColorStatus';

export const ComputerDetailsDialog = ({ open, onOpenChange, computer }) => {
    // Asegurar que los periféricos y componentes sean arrays
    const peripherals = Array.isArray(computer?.peripherals) ? computer.peripherals : [];
    const components = Array.isArray(computer?.components) ? computer.components : [];

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="border-0 max-w-3xl flex flex-col max-h-[90vh] py-3 px-0">
                <DialogHeader className="pt-4 px-6 pb-0 shrink-0">
                    <div className="flex items-center gap-3 mb-2">
                        <div className="p-2 rounded-lg bg-orange-50">
                            <Monitor className="w-5 h-5 text-orange-600" />
                        </div>
                        <div className="flex-1">
                            <DialogTitle className="text-2xl font-bold text-zinc-900">
                                {computer?.code || 'Computador'}
                            </DialogTitle>
                            <DialogDescription className="text-sm text-slate-600 mt-1">
                                Información completa del equipo registrado
                            </DialogDescription>
                        </div>
                    </div>
                </DialogHeader>

                <Separator className="shrink-0" />

                <Card className="border-0 shadow-none flex-1 overflow-y-auto min-h-0 px-6 pb-6 pt-0">
                    <CardContent className="space-y-6 pt-4 pb-0">
                        {/* Información General */}
                        <div className="space-y-4">
                            <div className="flex items-center gap-2 mb-3">
                                <Monitor className="w-4 h-4 text-blue-600" />
                                <h3 className="text-sm font-semibold text-slate-700 uppercase tracking-wide">
                                    Información General
                                </h3>
                            </div>
                            <div className="grid grid-cols-2 gap-4 bg-slate-50 p-4 rounded-lg">
                                <div className="space-y-1">
                                    <p className="text-xs font-medium text-slate-500 uppercase tracking-wide">Código</p>
                                    <p className="font-mono text-lg font-bold text-slate-900">
                                        {computer?.code || 'N/A'}
                                    </p>
                                </div>
                                <div className="space-y-1">
                                    <p className="text-xs font-medium text-slate-500 uppercase tracking-wide">Estado</p>
                                    <Badge className={statusStyles[computer?.state] || 'bg-slate-100 text-slate-700'}>
                                        {computer?.state || 'N/A'}
                                    </Badge>
                                </div>
                                <div className="space-y-1">
                                    <p className="text-xs font-medium text-slate-500 uppercase tracking-wide">
                                        Ubicación
                                    </p>
                                    <p className="font-semibold text-slate-900">
                                        {computer?.deskTable?.code || computer?.desktop || 'No asignado'}
                                    </p>
                                </div>
                                {computer?.createdAt && (
                                    <div className="space-y-1">
                                        <p className="text-xs font-medium text-slate-500 uppercase tracking-wide">
                                            Fecha de Registro
                                        </p>
                                        <p className="font-medium text-slate-900">
                                            {new Date(computer.createdAt).toLocaleDateString()}
                                        </p>
                                    </div>
                                )}
                            </div>
                        </div>

                        <Separator />

                        {/* Especificaciones Técnicas */}
                        <div className="space-y-4">
                            <div className="flex items-center gap-2 mb-3">
                                <Cpu className="w-4 h-4 text-orange-600" />
                                <h3 className="text-sm font-semibold text-slate-700 uppercase tracking-wide">
                                    Especificaciones Técnicas
                                </h3>
                            </div>
                            <div className="grid grid-cols-2 gap-4 bg-orange-50 p-4 rounded-lg">
                                <div className="space-y-1">
                                    <p className="text-xs font-medium text-slate-500 uppercase tracking-wide">
                                        Tipo de Computador
                                    </p>
                                    <p className="font-semibold text-slate-900">{computer?.computerType || 'N/A'}</p>
                                </div>
                                <div className="space-y-1">
                                    <p className="text-xs font-medium text-slate-500 uppercase tracking-wide">
                                        Número de Serial
                                    </p>
                                    <p className="font-mono text-sm font-semibold text-slate-900">
                                        {computer?.serial || 'N/A'}
                                    </p>
                                </div>
                                <div className="space-y-1">
                                    <p className="text-xs font-medium text-slate-500 uppercase tracking-wide">Marca</p>
                                    <p className="font-semibold text-slate-900">{computer?.brand || 'N/A'}</p>
                                </div>
                                <div className="space-y-1">
                                    <p className="text-xs font-medium text-slate-500 uppercase tracking-wide">Modelo</p>
                                    <p className="font-semibold text-slate-900">{computer?.model || 'N/A'}</p>
                                </div>
                            </div>

                            <div className="p-4 rounded-lg bg-orange-50">
                                <div className="flex items-center gap-2 mb-3">
                                    <Box className="w-4 h-4 text-orange-600" />
                                    <h4 className="text-sm font-semibold text-slate-700 uppercase tracking-wide">
                                        Componentes
                                    </h4>
                                </div>
                                {components.length > 0 ? (
                                    <div className="grid grid-cols-1 gap-2">
                                        {components.map((comp) => (
                                            <div
                                                key={comp.id}
                                                className="flex items-center justify-between p-3 bg-white border border-orange-200 rounded-lg"
                                            >
                                                <div className="flex flex-col flex-1">
                                                    <p className="text-sm font-semibold text-slate-900">
                                                        {comp.specs || `${comp.brand} ${comp.model}`.trim() || 'Sin especificaciones'}
                                                    </p>
                                                    <div className="flex items-center gap-3 mt-1 flex-wrap">
                                                        <span className="text-xs text-slate-600">
                                                            Tipo: <span className="font-semibold">{comp.type}</span>
                                                        </span>
                                                        <span className="text-xs text-slate-600">
                                                            Código: <span className="font-mono font-semibold">{comp.code}</span>
                                                        </span>
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                ) : (
                                    <p className="text-sm text-slate-500 italic text-center py-2">
                                        No hay componentes registrados para este computador
                                    </p>
                                )}
                            </div>
                        </div>

                        <Separator />

                        {/* Periféricos */}
                        <div className="space-y-4">
                            <div className="flex items-center gap-2 mb-3">
                                <Mouse className="w-4 h-4 text-purple-600" />
                                <h3 className="text-sm font-semibold text-slate-700 uppercase tracking-wide">
                                    Periféricos
                                </h3>
                            </div>
                            <div className="p-4 rounded-lg bg-purple-50">
                                {peripherals.length > 0 ? (
                                    <div className="grid grid-cols-1 gap-3">
                                        {peripherals.map((peripheral) => (
                                            <div
                                                key={peripheral.id || peripheral.code}
                                                className="flex items-center justify-between p-3 bg-white border border-purple-200 rounded-lg hover:border-purple-300 transition-colors"
                                            >
                                                <div className="flex flex-col flex-1">
                                                    <p className="text-sm font-semibold text-slate-900">
                                                        {peripheral.description || 'Sin descripción'}
                                                    </p>
                                                    <div className="flex items-center gap-4 mt-1 flex-wrap">
                                                        <span className="text-xs text-slate-600">
                                                            Código:{' '}
                                                            <span className="font-mono font-semibold">
                                                                {peripheral.code}
                                                            </span>
                                                        </span>
                                                        {peripheral.serial && (
                                                            <span className="text-xs text-slate-600">
                                                                Serial:{' '}
                                                                <span className="font-mono font-semibold">
                                                                    {peripheral.serial}
                                                                </span>
                                                            </span>
                                                        )}
                                                    </div>
                                                    {peripheral.type && (
                                                        <span className="text-xs text-slate-600 mt-1 font-medium">
                                                            Tipo: {peripheral.type}
                                                        </span>
                                                    )}
                                                    {peripheral.connectionType && (
                                                        <span className="text-xs text-purple-600 font-medium">
                                                            Tipo de conexión: {peripheral.connectionType}
                                                        </span>
                                                    )}
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                ) : (
                                    <p className="text-sm text-slate-500 italic text-center py-2">
                                        No hay periféricos registrados para este computador
                                    </p>
                                )}
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </DialogContent>
        </Dialog>
    );
};
