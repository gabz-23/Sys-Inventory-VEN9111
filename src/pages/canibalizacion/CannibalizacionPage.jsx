import { useEffect, useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useAuthStore } from '@/store/useAuthStore';
import { useComputerStore } from '@/pages/computers/store/useComputerStore';
import { useComponentStore } from '@/store/useComponentStore';
import { usePeripheralStore } from '@/store/usePeripheralStore';
import { CannibalizacionesTable } from './table/CannibalizacionesTable';
import { CannibalizacionAddDialog } from './dialogs/CannibalizacionAddDialog';
import { useDialogStore } from '@/store/useDialogStore';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { CannibalizationLogContent } from '@/pages/cannibalization-log/CannibalizationLogContent';

export const CannibalizacionPage = () => {
    const { user } = useAuthStore();
    const isViewer = user?.role === 'viewer';
    const { isAddDialogOpen, openAddDialog, closeAddDialog } = useDialogStore();
    const { computers, loadComputers } = useComputerStore();
    const { loadComponents } = useComponentStore();
    const { loadPeripherals } = usePeripheralStore();

    const [selectedComputer, setSelectedComputer] = useState('');
    const [missingItems, setMissingItems] = useState([]);
    const [loadingMissing, setLoadingMissing] = useState(false);

    useEffect(() => {
        loadComputers();
        loadComponents();
        loadPeripherals();
    }, [loadComputers, loadComponents, loadPeripherals]);

    const handleComputerChange = async (value) => {
        setSelectedComputer(value);
        if (!value) {
            setMissingItems([]);
            return;
        }
        setLoadingMissing(true);
        try {
            const result = await window.electronAPI.getMissingItemsByComputer(value);
            setMissingItems(result || []);
        } catch (err) {
            console.error('Error al obtener ítems faltantes:', err);
            setMissingItems([]);
        } finally {
            setLoadingMissing(false);
        }
    };

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-3xl font-bold text-foreground">Canibalización de Equipos</h2>
                    <p className="mt-2 text-muted-foreground">
                        Registro de movimiento de partes entre computadores
                    </p>
                </div>
                {!isViewer && (
                    <CannibalizacionAddDialog
                        open={!!isAddDialogOpen}
                        onOpenChange={(open) => (open ? openAddDialog() : closeAddDialog())}
                    />
                )}
            </div>

            <Tabs defaultValue="historial" className="w-full">
                <TabsList>
                    <TabsTrigger value="historial">Movimientos</TabsTrigger>
                    <TabsTrigger value="faltantes">Faltantes</TabsTrigger>
                    <TabsTrigger value="bitacora">Bitácora</TabsTrigger>
                </TabsList>

                <TabsContent value="historial">
                    <CannibalizacionesTable />
                </TabsContent>

                <TabsContent value="bitacora">
                    <CannibalizationLogContent />
                </TabsContent>

                <TabsContent value="faltantes" className="space-y-4">
                    <div className="max-w-xs">
                        <Select value={selectedComputer} onValueChange={handleComputerChange}>
                            <SelectTrigger>
                                <SelectValue placeholder="Seleccione un computador" />
                            </SelectTrigger>
                            <SelectContent>
                                {computers.map((comp) => (
                                    <SelectItem key={comp.id} value={comp.id}>
                                        {comp.code} — {comp.brand} {comp.model}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>

                    {loadingMissing && (
                        <p className="text-sm text-muted-foreground">Cargando...</p>
                    )}

                    {!loadingMissing && selectedComputer && missingItems.length > 0 && (
                        <div className="rounded-md border">
                            <table className="w-full text-sm">
                                <thead>
                                    <tr className="border-b bg-muted/50">
                                        <th className="text-left p-3 font-medium">Categoría</th>
                                        <th className="text-left p-3 font-medium">Tipo</th>
                                        <th className="text-left p-3 font-medium">Estado</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {missingItems.map((item, idx) => (
                                        <tr key={idx} className="border-b last:border-0">
                                            <td className="p-3">{item.itemCategory}</td>
                                            <td className="p-3">{item.itemType}</td>
                                            <td className="p-3">
                                                {item.present ? (
                                                    <Badge variant="default" className="bg-green-600 hover:bg-green-600">
                                                        Presente
                                                    </Badge>
                                                ) : (
                                                    <Badge variant="destructive">
                                                        Faltante
                                                    </Badge>
                                                )}
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}

                    {!loadingMissing && selectedComputer && missingItems.length === 0 && (
                        <p className="text-sm text-muted-foreground">No hay información de plantilla para este computador.</p>
                    )}
                </TabsContent>
            </Tabs>
        </div>
    );
};
