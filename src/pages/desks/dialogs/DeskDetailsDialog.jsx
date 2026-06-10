import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Card, CardContent } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Armchair, LampDesk, UserCircle } from 'lucide-react';

// Función helper para obtener el nombre del tipo en español
const getTypeName = (type) => {
    if (!type) return 'Accesorio';
    const normalized = type.toLowerCase().trim();
    const typeMap = {
        silla: 'Silla',
        lampara: 'Lámpara',
        papelera: 'Papelera',
        archivero: 'Archivero',
        telefono: 'Teléfono',
        casillero: 'Casillero',
    };
    return typeMap[normalized] || type;
};

// Función helper para renderizar un item de accesorio
const renderAccessoryItem = (accessory, index) => {
    const accessoryData = accessory.value || {};
    const hasValue = accessoryData.code;

    if (!hasValue) {
        return null; // No renderizar accesorios sin código
    }

    return (
        <div
            key={index}
            className="flex items-center justify-between p-3 bg-white border border-orange-200 rounded-lg hover:border-orange-300 transition-colors"
        >
            <div className="flex flex-col flex-1">
                <p className="text-sm font-semibold text-slate-900">{accessoryData.description || 'Sin descripción'}</p>
                <div className="flex items-center gap-4 mt-1 flex-wrap">
                    <span className="text-xs text-slate-600">
                        Código: <span className="font-mono font-semibold">{accessoryData.code}</span>
                    </span>
                    {accessoryData.serial && (
                        <span className="text-xs text-slate-600">
                            Serial: <span className="font-mono font-semibold">{accessoryData.serial}</span>
                        </span>
                    )}
                    {accessory.label && <span className="text-xs text-orange-600 font-medium">{accessory.label}</span>}
                </div>
                {accessoryData.connectionType && (
                    <span className="text-xs text-orange-600 mt-1 font-medium">
                        Tipo de conexión: {accessoryData.connectionType}
                    </span>
                )}
            </div>
        </div>
    );
};

// Función para obtener todos los accesorios del escritorio
const getAllAccessories = (desk) => {
    const accessories = [];

    // Mapeo de campos específicos a nombres en español
    const mappedAccessories = [
        { key: 'chair', label: 'Silla', value: desk?.chair },
        { key: 'lamp', label: 'Lámpara', value: desk?.lamp },
        { key: 'bin', label: 'Papelera', value: desk?.bin },
        { key: 'locker', label: 'Casillero', value: desk?.locker },
        { key: 'archive', label: 'Archivero', value: desk?.archive },
        { key: 'phone', label: 'Teléfono', value: desk?.phone },
    ];

    // Agregar accesorios mapeados que tengan valor
    mappedAccessories.forEach(({ label, value }) => {
        if (value) {
            const accessoryData = typeof value === 'object' ? value : { description: '', code: value };
            accessories.push({
                label,
                value: {
                    ...accessoryData,
                    code: accessoryData.code || value,
                },
            });
        }
    });

    // Agregar accesorios del array que no estén ya mapeados
    if (desk?.accessories && Array.isArray(desk.accessories)) {
        desk.accessories.forEach((acc) => {
            const accData = acc.toJSON ? acc.toJSON() : acc;
            const label = getTypeName(accData.type);
            const value = {
                description: accData.description || '',
                code: accData.code || '',
                serial: accData.serial || '',
                connectionType: accData.connectionType || '',
            };

            // Verificar si ya existe en los mapeados
            const exists = mappedAccessories.some((mapped) => {
                if (!mapped.value) return false;
                const mappedCode = typeof mapped.value === 'object' ? mapped.value.code : mapped.value;
                return mappedCode === value.code;
            });

            if (!exists && value.code) {
                accessories.push({ label, value });
            }
        });
    }

    return accessories;
};

export const DeskDetailsDialog = ({ open, onOpenChange, desk }) => {
    const allAccessories = getAllAccessories(desk);

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="border-0 max-w-3xl flex flex-col max-h-[90vh] py-3 px-0">
                <DialogHeader className="pt-4 px-6 pb-0 shrink-0">
                    <div className="flex items-center gap-3 mb-2">
                        <div className="p-2 rounded-lg bg-orange-50">
                            <Armchair className="w-5 h-5 text-orange-600" />
                        </div>
                        <div className="flex-1">
                            <DialogTitle className="text-2xl font-bold text-zinc-900">
                                {desk?.code || 'Escritorio'}
                            </DialogTitle>
                            <DialogDescription className="text-sm text-slate-600 mt-1">
                                Información completa del escritorio registrado
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
                                <Armchair className="w-4 h-4 text-blue-600" />
                                <h3 className="text-sm font-semibold text-slate-700 uppercase tracking-wide">
                                    Información General
                                </h3>
                            </div>
                            <div className="grid grid-cols-2 gap-4 bg-slate-50 p-4 rounded-lg">
                                <div className="space-y-1">
                                    <p className="text-xs font-medium text-slate-500 uppercase tracking-wide">Código</p>
                                    <p className="font-mono text-lg font-bold text-slate-900">{desk?.code || 'N/A'}</p>
                                </div>
                                <div className="space-y-1">
                                    <p className="text-xs font-medium text-slate-500 uppercase tracking-wide">
                                        Computador
                                    </p>
                                    <p className="font-semibold text-slate-900">{desk?.computer || 'No asignado'}</p>
                                </div>
                                <div className="space-y-1">
                                    <div className="flex items-center gap-1">
                                        <UserCircle className="w-3 h-3 text-slate-400" />
                                        <p className="text-xs font-medium text-slate-500 uppercase tracking-wide">
                                            Empleado Asignado
                                        </p>
                                    </div>
                                    <p className="font-semibold text-slate-900">{desk?.employeeName || 'Sin asignar'}</p>
                                </div>
                                {desk?.createdAt && (
                                    <div className="space-y-1">
                                        <p className="text-xs font-medium text-slate-500 uppercase tracking-wide">
                                            Fecha de Registro
                                        </p>
                                        <p className="font-medium text-slate-900">
                                            {new Date(desk.createdAt).toLocaleDateString()}
                                        </p>
                                    </div>
                                )}
                            </div>
                        </div>

                        <Separator />

                        {/* Accesorios */}
                        <div className="space-y-4">
                            <div className="flex items-center gap-2 mb-3">
                                <LampDesk className="w-4 h-4 text-orange-600" />
                                <h3 className="text-sm font-semibold text-slate-700 uppercase tracking-wide">
                                    Accesorios del escritorio
                                    {allAccessories.length > 0 && (
                                        <span className="ml-2 text-xs font-normal text-slate-500 normal-case">
                                            ({allAccessories.length})
                                        </span>
                                    )}
                                </h3>
                            </div>

                            <div className="p-4 rounded-lg bg-orange-50">
                                {allAccessories.length > 0 ? (
                                    <div className="grid grid-cols-1 gap-3">
                                        {allAccessories
                                            .map((item, index) => renderAccessoryItem(item, index))
                                            .filter(Boolean)}
                                    </div>
                                ) : (
                                    <p className="text-sm text-slate-500 italic text-center py-2">
                                        No hay accesorios registrados para este escritorio
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
