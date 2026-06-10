import { useEffect } from 'react';
import { TabsContent } from '@/components/ui/tabs';
import { Search } from 'lucide-react';
import { AccessoryCombobox } from '@/components/form/accessory/AccessoryCombobox';
import { AccessoryCard } from '@/components/form/accessory/AccessoryCard';
import { useComponentStore } from '@/store/useComponentStore';

const componentFieldMap = {
    'Procesador': 'cpu',
    'Memoria RAM': 'ramMemory',
    'Disco / Almacenamiento': 'storage',
    'Tarjeta Gráfica': 'graphicCard',
    'Fuente de Poder': 'powerSupply',
    'Placa Madre': 'motherboard',
    'Ventilador': 'cooler',
    'Unidad CD/DVD': 'cdDvd',
};

export const SpecsTab = ({ form, computer }) => {
    const { components, isLoading, loadComponents } = useComponentStore();

    useEffect(() => {
        loadComponents();
    }, [loadComponents]);

    const assignedComponents = form.watch('assignedComponents') || [];

    useEffect(() => {
        const ids = assignedComponents.map((comp) => comp.id);
        form.setValue('componentIds', ids, { shouldDirty: false });
    }, [assignedComponents, form]);

    const availableComponents = components.filter((item) => {
        if (!item.computerId) return true;
        if (computer && computer.id && item.computerId === computer.id) return true;
        return false;
    }).filter((item) => !assignedComponents.some((a) => a.id === item.id));

    const handleAdd = (component) => {
        const current = form.getValues('assignedComponents') || [];
        form.setValue('assignedComponents', [...current, component], { shouldDirty: true });

        const field = componentFieldMap[component.type];
        if (field) {
            const label = component.specs || `${component.brand} ${component.model}`.trim();
            form.setValue(field, label, { shouldDirty: true });
        }

        const currentIds = form.getValues('componentIds') || [];
        form.setValue('componentIds', [...currentIds, component.id], { shouldDirty: true });
    };

    const handleRemove = (id) => {
        const current = form.getValues('assignedComponents') || [];
        const removed = current.find((c) => c.id === id);
        form.setValue(
            'assignedComponents',
            current.filter((c) => c.id !== id),
            { shouldDirty: true }
        );

        if (removed) {
            const field = componentFieldMap[removed.type];
            if (field) {
                form.setValue(field, '', { shouldDirty: true });
            }
            const currentIds = form.getValues('componentIds') || [];
            form.setValue('componentIds', currentIds.filter((cid) => cid !== id), { shouldDirty: true });
        }
    };

    return (
        <TabsContent value="specs" className="space-y-4 mt-4">
            <div className="rounded-lg">
                <div className="space-y-2">
                    <label className="text-sm font-medium text-black">Buscar componente</label>
                    <AccessoryCombobox
                        availableAccessories={availableComponents}
                        isLoading={isLoading}
                        onAddAccessory={handleAdd}
                    />
                </div>
            </div>

            <div className="space-y-3 mt-4">
                <div className="flex items-center">
                    <h3 className="text-sm font-semibold text-black">
                        Componentes asignados ({assignedComponents.length})
                    </h3>
                </div>

                {assignedComponents.length === 0 ? (
                    <div className="border-2 border-dashed border-gray-300 rounded-lg py-4 text-center mb-5">
                        <Search className="w-11 h-11 text-gray-300 mx-auto mb-3" />
                        <p className="text-sm text-gray-500 font-medium">No hay componentes asignados</p>
                        <p className="text-xs text-gray-400 mt-1">
                            Busque y agregue componentes desde el campo superior
                        </p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 gap-3 max-h-60 overflow-auto border rounded-md p-3">
                        {assignedComponents.map((component) => (
                            <AccessoryCard
                                key={component.id}
                                accessory={component}
                                onRemove={handleRemove}
                            />
                        ))}
                    </div>
                )}
            </div>
        </TabsContent>
    );
};