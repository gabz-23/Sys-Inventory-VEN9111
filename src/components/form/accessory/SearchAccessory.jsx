import { useEffect } from 'react';
import { AccessoryCard } from './AccessoryCard';
import { Search } from 'lucide-react';
import { AccessoryCombobox } from './AccessoryCombobox';
import { useDeskAccessoryStore } from '@/store/useDeskAccessoryStore';
import { useComponentStore } from '@/store/useComponentStore';
import { usePeripheralStore } from '@/store/usePeripheralStore';

export const SearchAccessory = ({ form, computer, desk }) => {
    const isComputerContext = computer !== undefined;
    const isDeskContext = desk !== undefined;

    const deskAccStore = useDeskAccessoryStore();
    const compStore = useComponentStore();
    const perStore = usePeripheralStore();

    useEffect(() => {
        if (isDeskContext) {
            deskAccStore.loadDeskAccessories();
        }
        if (isComputerContext) {
            compStore.loadComponents();
            perStore.loadPeripherals();
        }
    }, [isDeskContext, isComputerContext]);

    if (!form) {
        console.error('SearchAccessory: form prop is required');
        return null;
    }

    const assignedAccessories = form.watch('accessories') || [];

    const allItems = isComputerContext
        ? [...compStore.components, ...perStore.peripherals]
        : deskAccStore.deskAccessories;

    const isLoading = isComputerContext
        ? compStore.isLoading || perStore.isLoading
        : deskAccStore.isLoading;

    const availableAccessories = allItems.filter((item) => {
        if (isComputerContext) {
            if (!item.computerId) {
                return true;
            }
            if (computer && computer.id && item.computerId === computer.id) {
                return true;
            }
            return false;
        }

        if (isDeskContext) {
            if (!item.computerId && !item.deskTableId) {
                return true;
            }
            if (desk && desk.id && item.deskTableId === desk.id) {
                return true;
            }
            return false;
        }

        return !item.computerId && !item.deskTableId;
    });

    const finalAvailableAccessories = availableAccessories.filter(
        (item) => !assignedAccessories.some((assigned) => assigned.id === item.id)
    );

    const handleAddAccessory = (accessory) => {
        const currentAccessories = form.getValues('accessories') || [];
        form.setValue('accessories', [...currentAccessories, accessory], { shouldDirty: true });
    };

    const handleRemoveAccessory = (id) => {
        const currentAccessories = form.getValues('accessories') || [];
        form.setValue(
            'accessories',
            currentAccessories.filter((accessory) => accessory.id !== id),
            { shouldDirty: true }
        );
    };

    const label = isComputerContext ? 'Buscar componente o periférico' : 'Buscar accesorio';
    const assignedLabel = isComputerContext ? 'Componentes/Periféricos asignados' : 'Accesorios asignados';

    return (
        <>
            <div className="rounded-lg">
                <div className="space-y-2">
                    <label className="text-sm font-medium text-black">{label}</label>
                    <AccessoryCombobox
                        availableAccessories={finalAvailableAccessories}
                        isLoading={isLoading}
                        onAddAccessory={handleAddAccessory}
                    />
                </div>
            </div>

            <div className="space-y-3 mt-4">
                <div className="flex items-center">
                    <h3 className="text-sm font-semibold text-black">
                        {assignedLabel} ({assignedAccessories.length})
                    </h3>
                </div>

                {assignedAccessories.length === 0 ? (
                    <div className="border-2 border-dashed border-gray-300 rounded-lg  py-4 text-center mb-5">
                        <Search className="w-11 h-11 text-gray-300 mx-auto mb-3" />
                        <p className="text-sm text-gray-500 font-medium">No hay accesorios asignados</p>
                        <p className="text-xs text-gray-400 mt-1">
                            Seleccione un tipo y busque para agregar accesorios
                        </p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 gap-3 max-h-60 overflow-auto border rounded-md p-3 ">
                        {assignedAccessories.map((accessory) => (
                            <AccessoryCard key={accessory.id} accessory={accessory} onRemove={handleRemoveAccessory} />
                        ))}
                    </div>
                )}
            </div>
        </>
    );
};
