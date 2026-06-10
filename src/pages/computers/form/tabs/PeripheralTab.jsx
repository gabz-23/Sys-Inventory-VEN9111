import { useEffect } from 'react';
import { TabsContent } from '@/components/ui/tabs';
import { Search } from 'lucide-react';
import { AccessoryCombobox } from '@/components/form/accessory/AccessoryCombobox';
import { AccessoryCard } from '@/components/form/accessory/AccessoryCard';
import { usePeripheralStore } from '@/store/usePeripheralStore';

export const PeripheralTab = ({ form, computer }) => {
    const { peripherals, isLoading, loadPeripherals } = usePeripheralStore();

    useEffect(() => {
        loadPeripherals();
    }, [loadPeripherals]);

    const assignedPeripherals = form.watch('peripherals') || [];

    const availablePeripherals = peripherals.filter((item) => {
        if (!item.computerId) return true;
        if (computer && computer.id && item.computerId === computer.id) return true;
        return false;
    });

    const finalAvailable = availablePeripherals.filter(
        (item) => !assignedPeripherals.some((assigned) => assigned.id === item.id)
    );

    const handleAdd = (peripheral) => {
        const current = form.getValues('peripherals') || [];
        form.setValue('peripherals', [...current, peripheral], { shouldDirty: true });
    };

    const handleRemove = (id) => {
        const current = form.getValues('peripherals') || [];
        form.setValue(
            'peripherals',
            current.filter((p) => p.id !== id),
            { shouldDirty: true }
        );
    };

    return (
        <TabsContent value="peripherals" className="space-y-4 mt-4">
            <div className="rounded-lg">
                <div className="space-y-2">
                    <label className="text-sm font-medium text-black">Buscar periférico</label>
                    <AccessoryCombobox
                        availableAccessories={finalAvailable}
                        isLoading={isLoading}
                        onAddAccessory={handleAdd}
                    />
                </div>
            </div>

            <div className="space-y-3 mt-4">
                <div className="flex items-center">
                    <h3 className="text-sm font-semibold text-black">
                        Periféricos asignados ({assignedPeripherals.length})
                    </h3>
                </div>

                {assignedPeripherals.length === 0 ? (
                    <div className="border-2 border-dashed border-gray-300 rounded-lg py-4 text-center mb-5">
                        <Search className="w-11 h-11 text-gray-300 mx-auto mb-3" />
                        <p className="text-sm text-gray-500 font-medium">No hay periféricos asignados</p>
                        <p className="text-xs text-gray-400 mt-1">
                            Busque y agregue periféricos desde el campo superior
                        </p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 gap-3 max-h-60 overflow-auto border rounded-md p-3">
                        {assignedPeripherals.map((peripheral) => (
                            <AccessoryCard
                                key={peripheral.id}
                                accessory={peripheral}
                                onRemove={handleRemove}
                            />
                        ))}
                    </div>
                )}
            </div>
        </TabsContent>
    );
};
