import { useEffect, useCallback } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { useCannibalizationLogStore } from '@/store/useCannibalizationLogStore';
import { Wrench, RotateCcw, CheckCircle, Loader2 } from 'lucide-react';

const formatDate = (date) => {
    if (!date) return '-';
    const d = new Date(date + 'T00:00:00');
    if (isNaN(d.getTime())) return '-';
    return d.toLocaleDateString('es-ES', {
        year: 'numeric', month: '2-digit', day: '2-digit',
    });
};

const STATUS_BADGES = {
    'Dañado': 'bg-red-500/10 text-red-700 dark:text-red-400',
    'En reparacion': 'bg-yellow-500/10 text-yellow-700 dark:text-yellow-400',
    'Reconstruido': 'bg-purple-500/10 text-purple-700 dark:text-purple-400',
    'Bueno': 'bg-green-500/10 text-green-700 dark:text-green-400',
};

const SubBitacoraTable = ({ items, actionLabel, actionIcon: ActionIcon, actionColor, onAction, transitioningId, isLoading }) => {
    if (isLoading) {
        return (
            <div className="flex items-center justify-center h-32 text-sm text-muted-foreground">
                <Loader2 className="h-4 w-4 animate-spin mr-2" />
                Cargando...
            </div>
        );
    }

    if (!items || items.length === 0) {
        return (
            <div className="flex items-center justify-center h-32 text-sm text-muted-foreground">
                No hay registros en esta bitácora
            </div>
        );
    }

    return (
        <div className="rounded-md border overflow-x-auto">
            <Table className="text-xs">
                <TableHeader>
                    <TableRow>
                        <TableHead className="whitespace-nowrap h-8 px-2">Código</TableHead>
                        <TableHead className="whitespace-nowrap h-8 px-2">Serial</TableHead>
                        <TableHead className="whitespace-nowrap h-8 px-2">Tipo</TableHead>
                        <TableHead className="whitespace-nowrap h-8 px-2">Fecha Ingreso</TableHead>
                        <TableHead className="whitespace-nowrap h-8 px-2">Estado</TableHead>
                        {actionLabel && <TableHead className="whitespace-nowrap h-8 px-2 text-right">Acción</TableHead>}
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {items.map((item) => {
                        const isTransitioning = transitioningId === `${item.itemType}-${item.code}`;
                        return (
                            <TableRow key={`${item.itemType}-${item.id}`}>
                                <TableCell className="font-medium whitespace-nowrap px-2 py-1.5">{item.code}</TableCell>
                                <TableCell className="whitespace-nowrap px-2 py-1.5">{item.serial}</TableCell>
                                <TableCell className="whitespace-nowrap px-2 py-1.5">
                                    <Badge variant="outline" className="text-[10px] px-1 py-0">{item.type}</Badge>
                                    <span className="ml-1 text-muted-foreground">{item.itemType}</span>
                                </TableCell>
                                <TableCell className="whitespace-nowrap px-2 py-1.5">{formatDate(item.entryDate)}</TableCell>
                                <TableCell className="whitespace-nowrap px-2 py-1.5">
                                    <span className={`inline-block px-2 py-0.5 rounded text-[10px] font-medium ${STATUS_BADGES[item.state] || ''}`}>
                                        {item.state}
                                    </span>
                                </TableCell>
                                {actionLabel && (
                                    <TableCell className="whitespace-nowrap px-2 py-1.5 text-right">
                                        <Button
                                            variant="outline"
                                            size="sm"
                                            className={`h-7 gap-1 text-xs cursor-pointer ${actionColor || ''}`}
                                            onClick={() => onAction(item.itemType, item.code)}
                                            disabled={isTransitioning}
                                        >
                                            {isTransitioning ? (
                                                <Loader2 className="h-3 w-3 animate-spin" />
                                            ) : (
                                                ActionIcon && <ActionIcon className="h-3 w-3" />
                                            )}
                                            {actionLabel}
                                        </Button>
                                    </TableCell>
                                )}
                            </TableRow>
                        );
                    })}
                </TableBody>
            </Table>
        </div>
    );
};

export const CannibalizationLogPage = () => {
    const { damagedItems, repairItems, rebuiltItems, availableItems, isLoading, transitioningId, loadAll, transitionItem } = useCannibalizationLogStore();

    useEffect(() => {
        loadAll();
    }, [loadAll]);

    const handleRepair = useCallback(async (itemType, itemCode) => {
        try { await transitionItem(itemType, itemCode, 'En reparacion'); }
        catch { /* error handled in store */ }
    }, [transitionItem]);

    const handleRebuild = useCallback(async (itemType, itemCode) => {
        try { await transitionItem(itemType, itemCode, 'Reconstruido'); }
        catch { /* error handled in store */ }
    }, [transitionItem]);

    const handleAvailable = useCallback(async (itemType, itemCode) => {
        try { await transitionItem(itemType, itemCode, 'Bueno'); }
        catch { /* error handled in store */ }
    }, [transitionItem]);

    return (
        <div className="space-y-6">
            <div>
                <h2 className="text-3xl font-bold text-foreground">Bitácora de Canibalización</h2>
                <p className="mt-2 text-muted-foreground">
                    Pipeline de recuperación de items: Dañados → Reparación → Reconstruidos → Disponible
                </p>
            </div>

            <Tabs defaultValue="damaged" className="w-full">
                <TabsList className="w-full justify-start overflow-x-auto">
                    <TabsTrigger value="damaged" className="text-xs sm:text-sm">
                        Dañados ({damagedItems.length})
                    </TabsTrigger>
                    <TabsTrigger value="repair" className="text-xs sm:text-sm">
                        Reparación ({repairItems.length})
                    </TabsTrigger>
                    <TabsTrigger value="rebuilt" className="text-xs sm:text-sm">
                        Reconstruidos ({rebuiltItems.length})
                    </TabsTrigger>
                    <TabsTrigger value="available" className="text-xs sm:text-sm">
                        Disponible ({availableItems.length})
                    </TabsTrigger>
                </TabsList>

                <TabsContent value="damaged" className="mt-4 space-y-4">
                    <p className="text-sm text-muted-foreground">
                        Items marcados como <span className="font-medium text-red-600 dark:text-red-400">Dañado</span> que requieren reparación
                    </p>
                    <SubBitacoraTable
                        items={damagedItems}
                        actionLabel="Reparar"
                        actionIcon={Wrench}
                        onAction={handleRepair}
                        transitioningId={transitioningId}
                        isLoading={isLoading}
                    />
                </TabsContent>

                <TabsContent value="repair" className="mt-4 space-y-4">
                    <p className="text-sm text-muted-foreground">
                        Items en <span className="font-medium text-yellow-600 dark:text-yellow-400">reparación</span> que serán reconstruidos
                    </p>
                    <SubBitacoraTable
                        items={repairItems}
                        actionLabel="Reconstruir"
                        actionIcon={RotateCcw}
                        onAction={handleRebuild}
                        transitioningId={transitioningId}
                        isLoading={isLoading}
                    />
                </TabsContent>

                <TabsContent value="rebuilt" className="mt-4 space-y-4">
                    <p className="text-sm text-muted-foreground">
                        Items <span className="font-medium text-purple-600 dark:text-purple-400">reconstruidos</span> listos para estar disponibles
                    </p>
                    <SubBitacoraTable
                        items={rebuiltItems}
                        actionLabel="Disponible"
                        actionIcon={CheckCircle}
                        onAction={handleAvailable}
                        transitioningId={transitioningId}
                        isLoading={isLoading}
                    />
                </TabsContent>

                <TabsContent value="available" className="mt-4 space-y-4">
                    <p className="text-sm text-muted-foreground">
                        Items <span className="font-medium text-green-600 dark:text-green-400">disponibles</span> sin asignación
                    </p>
                    <SubBitacoraTable
                        items={availableItems}
                        actionLabel={null}
                        transitioningId={transitioningId}
                        isLoading={isLoading}
                    />
                </TabsContent>
            </Tabs>
        </div>
    );
};
