import { useEffect, useCallback } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { useCannibalizationLogStore } from '@/store/useCannibalizationLogStore';
import { Wrench, RotateCcw, Loader2, CheckCircle } from 'lucide-react';
import { useAuthStore } from '@/store/useAuthStore';

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
    'Reconstruido': 'bg-purple-500/10 text-purple-700 dark:text-purple-400',
    'Reincorporado': 'bg-green-500/10 text-green-700 dark:text-green-400',
};

const SubBitacoraTable = ({ items, actions, transitioningId, isLoading }) => {
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
                        {actions && actions.length > 0 && <TableHead className="whitespace-nowrap h-8 px-2 text-right">Acción</TableHead>}
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {items.map((item) => {
                        const key = `${item.itemType}-${item.code}`;
                        const isTransitioning = transitioningId === key;
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
                                {actions && actions.length > 0 && (
                                    <TableCell className="whitespace-nowrap px-2 py-1.5 text-right">
                                        <div className="flex gap-1 justify-end">
                                            {actions.map((action, idx) => (
                                                <Button
                                                    key={idx}
                                                    variant="outline"
                                                    size="sm"
                                                    className="h-7 gap-1 text-xs cursor-pointer"
                                                    onClick={() => action.onClick(item.itemType, item.code)}
                                                    disabled={isTransitioning}
                                                >
                                                    {isTransitioning ? (
                                                        <Loader2 className="h-3 w-3 animate-spin" />
                                                    ) : (
                                                        action.icon && <action.icon className="h-3 w-3" />
                                                    )}
                                                    {action.label}
                                                </Button>
                                            ))}
                                        </div>
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

export const CannibalizationLogContent = () => {
    const { damagedItems, rebuiltItems, availableItems, isLoading, transitioningId, loadAll, transitionItem } = useCannibalizationLogStore();
    const { user } = useAuthStore();
    const isViewer = user?.role === 'viewer';

    useEffect(() => {
        loadAll();
    }, [loadAll]);

    const handleRepair = useCallback(async (itemType, itemCode) => {
        try { await transitionItem(itemType, itemCode, 'Reincorporado'); }
        catch { /* error handled in store */ }
    }, [transitionItem]);

    const handleRebuild = useCallback(async (itemType, itemCode) => {
        try { await transitionItem(itemType, itemCode, 'Reconstruido'); }
        catch { /* error handled in store */ }
    }, [transitionItem]);

    const handleAvailable = useCallback(async (itemType, itemCode) => {
        try { await transitionItem(itemType, itemCode, 'Reincorporado'); }
        catch { /* error handled in store */ }
    }, [transitionItem]);

    const damagedActions = isViewer ? [] : [
        { label: 'Reparar', icon: Wrench, onClick: handleRepair },
        { label: 'Reconstruir', icon: RotateCcw, onClick: handleRebuild },
    ];

    const rebuiltActions = isViewer ? [] : [
        { label: 'Disponible', icon: CheckCircle, onClick: handleAvailable },
    ];

    return (
        <div className="space-y-4">
            <p className="text-sm text-muted-foreground">
                Aquí puedes gestionar el ciclo de vida de los elementos: desde que se dañan hasta que vuelven a estar disponibles
            </p>

            <Tabs defaultValue="damaged" className="w-full">
                <TabsList className="w-full justify-start overflow-x-auto">
                    <TabsTrigger value="damaged" className="text-xs sm:text-sm">
                        Dañados ({damagedItems.length})
                    </TabsTrigger>
                    <TabsTrigger value="rebuilt" className="text-xs sm:text-sm">
                        Reconstruidos ({rebuiltItems.length})
                    </TabsTrigger>
                    <TabsTrigger value="available" className="text-xs sm:text-sm">
                        Reincorporados ({availableItems.length})
                    </TabsTrigger>
                </TabsList>

                <TabsContent value="damaged" className="mt-4 space-y-4">
                    <p className="text-sm text-muted-foreground">
                        Elementos marcados como <span className="font-medium text-red-600 dark:text-red-400">Dañado</span>
                    </p>
                    <SubBitacoraTable
                        items={damagedItems}
                        actions={damagedActions}
                        transitioningId={transitioningId}
                        isLoading={isLoading}
                    />
                </TabsContent>

                <TabsContent value="rebuilt" className="mt-4 space-y-4">
                    <p className="text-sm text-muted-foreground">
                        Elementos <span className="font-medium text-purple-600 dark:text-purple-400">reconstruidos</span> listos para estar disponibles
                    </p>
                    <SubBitacoraTable
                        items={rebuiltItems}
                        actions={rebuiltActions}
                        transitioningId={transitioningId}
                        isLoading={isLoading}
                    />
                </TabsContent>

                <TabsContent value="available" className="mt-4 space-y-4">
                    <p className="text-sm text-muted-foreground">
                        Elementos <span className="font-medium text-green-600 dark:text-green-400">reincorporados</span> sin asignación
                    </p>
                    <SubBitacoraTable
                        items={availableItems}
                        transitioningId={transitioningId}
                        isLoading={isLoading}
                    />
                </TabsContent>
            </Tabs>
        </div>
    );
};
