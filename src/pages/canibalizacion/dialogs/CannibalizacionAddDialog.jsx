import { useEffect, useState, useMemo } from 'react';
import { Plus, Loader2 } from 'lucide-react';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogTitle,
    DialogTrigger,
    DialogHeader,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { useCannibalizationStore } from '@/store/useCannibalizationStore';
import { useAuthStore } from '@/store/useAuthStore';
import { useComputerStore } from '@/pages/computers/store/useComputerStore';
import { useComponentStore } from '@/store/useComponentStore';
import { usePeripheralStore } from '@/store/usePeripheralStore';

export const CannibalizacionAddDialog = ({ open, onOpenChange }) => {
    const { addMovement } = useCannibalizationStore();
    const { user } = useAuthStore();
    const { computers, loadComputers } = useComputerStore();
    const { components, loadComponents } = useComponentStore();
    const { peripherals, loadPeripherals } = usePeripheralStore();
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const [donorComputerId, setDonorComputerId] = useState('');
    const [receiverComputerId, setReceiverComputerId] = useState('');
    const [selectedItems, setSelectedItems] = useState([]);
    const [movementDate, setMovementDate] = useState('');
    const [observations, setObservations] = useState('');

    useEffect(() => {
        if (open) {
            setDonorComputerId('');
            setReceiverComputerId('');
            setSelectedItems([]);
            setMovementDate(new Date().toISOString().split('T')[0]);
            setObservations('');
            setError('');
            setIsLoading(false);
            loadComputers();
            loadComponents();
            loadPeripherals();
        }
    }, [open, loadComputers, loadComponents, loadPeripherals]);

    const donorComponents = useMemo(
        () => components.filter((c) => c.computerId === donorComputerId),
        [components, donorComputerId]
    );
    const donorPeripherals = useMemo(
        () => peripherals.filter((p) => p.computerId === donorComputerId),
        [peripherals, donorComputerId]
    );

    const hasItems = donorComponents.length > 0 || donorPeripherals.length > 0;
    const filteredReceivers = computers.filter((c) => c.id !== donorComputerId);

    const toggleItem = (itemType, itemId) => {
        setSelectedItems((prev) => {
            const exists = prev.find((i) => i.itemType === itemType && i.itemId === itemId);
            if (exists) return prev.filter((i) => !(i.itemType === itemType && i.itemId === itemId));
            return [...prev, { itemType, itemId }];
        });
    };

    const isItemSelected = (itemType, itemId) => {
        return selectedItems.some((i) => i.itemType === itemType && i.itemId === itemId);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');

        if (!donorComputerId) {
            setError('Seleccione un computador donante');
            return;
        }
        if (!receiverComputerId) {
            setError('Seleccione un computador receptor');
            return;
        }
        if (selectedItems.length === 0) {
            setError('Seleccione al menos un ítem para transferir');
            return;
        }

        setIsLoading(true);
        try {
            await addMovement({
                items: selectedItems,
                donorComputerId,
                receiverComputerId,
                movementDate: movementDate || null,
                observations: observations || null,
                createdBy: user?.firstName || user?.username || 'Desconocido',
            });
            onOpenChange(false);
        } catch (err) {
            let errorMessage = err.message || 'Error al registrar canibalización';
            errorMessage = errorMessage.replace(/^Error invoking remote method '[^']+': Error: /, '');
            setError(errorMessage);
        } finally {
            setIsLoading(false);
        }
    };

    const handleDonorChange = (val) => {
        const id = val === 'none' ? '' : val;
        setDonorComputerId(id);
        setSelectedItems([]);
        if (id === receiverComputerId) setReceiverComputerId('');
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogTrigger asChild>
                <Button className="cursor-pointer">
                    <Plus className="mr-1 h-4 w-4" />
                    Registrar Canibalización
                </Button>
            </DialogTrigger>

            <DialogContent className="border-0 max-w-2xl flex flex-col max-h-[90vh] py-3 px-0">
                <DialogHeader className="pt-4 px-6 pb-0 shrink-0">
                    <DialogTitle>Registrar Canibalización</DialogTitle>
                    <DialogDescription>
                        Seleccione un computador donante, escoja los ítems a transferir y elija el computador receptor
                    </DialogDescription>
                </DialogHeader>

                <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto min-h-0 px-6 pb-6 pt-4 space-y-5">
                    {error && (
                        <div className="p-3 text-sm text-destructive bg-destructive/10 border border-destructive/20 rounded-md">
                            {error}
                        </div>
                    )}

                    <div className="space-y-2">
                        <Label>Computador donante</Label>
                        <Select value={donorComputerId || 'none'} onValueChange={handleDonorChange}>
                            <SelectTrigger>
                                <SelectValue placeholder="Seleccione donante" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="none">Seleccione un computador</SelectItem>
                                {computers.map((comp) => (
                                    <SelectItem key={comp.id} value={comp.id}>
                                        {comp.code} — {comp.brand} {comp.model}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>

                    {donorComputerId && (
                        <div className="space-y-3">
                            <Label>Ítems a transferir</Label>
                            {!hasItems && (
                                <p className="text-sm text-muted-foreground">
                                    Este computador no tiene componentes ni periféricos asignados
                                </p>
                            )}
                            {donorComponents.length > 0 && (
                                <div className="space-y-1">
                                    <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">
                                        Componentes
                                    </p>
                                    <div className="rounded-md border divide-y">
                                        {donorComponents.map((comp) => (
                                            <label
                                                key={comp.id}
                                                className="flex items-center gap-3 px-3 py-2 hover:bg-muted/50 cursor-pointer text-sm"
                                            >
                                                <Checkbox
                                                    checked={isItemSelected('Componente', comp.id)}
                                                    onCheckedChange={() => toggleItem('Componente', comp.id)}
                                                />
                                                <span className="font-medium">{comp.code}</span>
                                                <span className="text-muted-foreground">{comp.type}</span>
                                                {comp.brand && (
                                                    <span className="text-muted-foreground">— {comp.brand}</span>
                                                )}
                                                {comp.specs && (
                                                    <span className="text-muted-foreground">({comp.specs})</span>
                                                )}
                                            </label>
                                        ))}
                                    </div>
                                </div>
                            )}
                            {donorPeripherals.length > 0 && (
                                <div className="space-y-1">
                                    <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">
                                        Periféricos
                                    </p>
                                    <div className="rounded-md border divide-y">
                                        {donorPeripherals.map((per) => (
                                            <label
                                                key={per.id}
                                                className="flex items-center gap-3 px-3 py-2 hover:bg-muted/50 cursor-pointer text-sm"
                                            >
                                                <Checkbox
                                                    checked={isItemSelected('Periférico', per.id)}
                                                    onCheckedChange={() => toggleItem('Periférico', per.id)}
                                                />
                                                <span className="font-medium">{per.code}</span>
                                                <span className="text-muted-foreground">{per.type}</span>
                                                {per.brand && (
                                                    <span className="text-muted-foreground">— {per.brand}</span>
                                                )}
                                                {per.description && (
                                                    <span className="text-muted-foreground">({per.description})</span>
                                                )}
                                            </label>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>
                    )}

                    <div className="space-y-2">
                        <Label>Computador receptor</Label>
                        <Select
                            value={receiverComputerId || 'none'}
                            onValueChange={(val) => setReceiverComputerId(val === 'none' ? '' : val)}
                        >
                            <SelectTrigger>
                                <SelectValue placeholder="Seleccione receptor" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="none">Seleccione un computador</SelectItem>
                                {filteredReceivers.map((comp) => (
                                    <SelectItem key={comp.id} value={comp.id}>
                                        {comp.code} — {comp.brand} {comp.model}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>

                    <div className="space-y-2">
                        <Label>Observaciones</Label>
                        <Textarea
                            placeholder="Observaciones opcionales"
                            value={observations}
                            onChange={(e) => setObservations(e.target.value)}
                        />
                    </div>

                    <div className="flex justify-end pt-2">
                        <Button type="submit" disabled={isLoading} className="cursor-pointer">
                            {isLoading ? (
                                <>
                                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                    Guardando...
                                </>
                            ) : (
                                'Registrar Canibalización'
                            )}
                        </Button>
                    </div>
                </form>
            </DialogContent>
        </Dialog>
    );
};
