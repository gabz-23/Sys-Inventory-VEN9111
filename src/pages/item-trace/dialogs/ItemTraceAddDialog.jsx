import { useEffect, useState, useRef } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import * as zod from 'zod';
import { Plus, Loader2, ChevronsUpDown, Search } from 'lucide-react';
import {
    Dialog, DialogContent, DialogDescription, DialogTitle,
    DialogTrigger, DialogHeader,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useItemTraceStore } from '@/store/useItemTraceStore';
import { DateInput } from '@/components/ui/DateInput';

const itemTraceFormSchema = zod.object({
    itemType: zod.string().min(1, 'El tipo de accesorio es requerido'),
    itemCode: zod.string().min(1, 'Debe seleccionar un accesorio'),
    itemDescription: zod.string().optional().default(''),
    itemId: zod.string().optional().default(''),
    dateDamaged: zod.string().optional().default(''),
    dateInRepair: zod.string().optional().default(''),
    dateRepaired: zod.string().optional().default(''),
    dateReinstated: zod.string().optional().default(''),
    rebuilt: zod.boolean().default(false),
    observations: zod.string().optional().default(''),
});

const defaultFormData = {
    itemType: '',
    itemCode: '',
    itemDescription: '',
    itemId: '',
    dateDamaged: '',
    dateInRepair: '',
    dateRepaired: '',
    dateReinstated: '',
    rebuilt: false,
    observations: '',
};

const categoryOptions = [
    { value: 'Computadoras', label: 'Computadoras' },
    { value: 'Acc. Escritorio', label: 'Acc. Escritorio' },
    { value: 'Componentes', label: 'Componentes' },
    { value: 'Periféricos', label: 'Periféricos' },
];

const loadAccessoriesByCategory = async (category) => {
    switch (category) {
        case 'Computadoras':
            return await window.electronAPI.getAllComputers();
        case 'Acc. Escritorio':
            return await window.electronAPI.getAllDeskAccessories();
        case 'Componentes':
            return await window.electronAPI.getAllComponents();
        case 'Periféricos':
            return await window.electronAPI.getAllPeripherals();
        default:
            return [];
    }
};

const getAccessoryDisplay = (acc) => {
    const desc = acc.description || acc.specs || acc.brand || '';
    const type = acc.type || acc.computerType || '';
    return { code: acc.code, description: desc, type };
};

export const ItemTraceAddDialog = ({ open, onOpenChange }) => {
    const { addItemTrace } = useItemTraceStore();
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [accessories, setAccessories] = useState([]);
    const [loadingAcc, setLoadingAcc] = useState(false);
    const [searchOpen, setSearchOpen] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedLabel, setSelectedLabel] = useState('');
    const searchRef = useRef(null);

    const form = useForm({
        resolver: zodResolver(itemTraceFormSchema),
        defaultValues: defaultFormData,
    });

    const watchItemType = form.watch('itemType');

    useEffect(() => {
        if (open) {
            form.reset(defaultFormData);
            setAccessories([]);
            setSearchTerm('');
            setSelectedLabel('');
            setError('');
            setIsLoading(false);
        }
    }, [open, form]);

    useEffect(() => {
        if (watchItemType) {
            setLoadingAcc(true);
            setSearchTerm('');
            setSelectedLabel('');
            form.setValue('itemCode', '');
            form.setValue('itemDescription', '');
            form.setValue('itemId', '');
            setAccessories([]);
            loadAccessoriesByCategory(watchItemType)
                .then((data) => setAccessories(data || []))
                .catch(() => setAccessories([]))
                .finally(() => setLoadingAcc(false));
        } else {
            setAccessories([]);
        }
    }, [watchItemType, form]);

    const filteredAccessories = accessories.filter((acc) => {
        if (!searchTerm) return true;
        const q = searchTerm.toLowerCase();
        const { code, description, type } = getAccessoryDisplay(acc);
        return code.toLowerCase().includes(q) ||
               description.toLowerCase().includes(q) ||
               type.toLowerCase().includes(q);
    });

    const selectAccessory = (acc) => {
        const label = `${acc.type || acc.computerType || ''} - ${acc.code}`;
        form.setValue('itemCode', acc.code);
        form.setValue('itemDescription', acc.description || acc.specs || acc.brand || '');
        form.setValue('itemId', acc.id);
        setSelectedLabel(label);
        setSearchOpen(false);
        setSearchTerm('');
    };

    const handleSubmit = async (data) => {
        setIsLoading(true);
        setError('');
        try {
            await addItemTrace(data);
            onOpenChange(false);
        } catch (err) {
            let errorMessage = err.message || 'Error al agregar trazabilidad';
            errorMessage = errorMessage.replace(/^Error invoking remote method '[^']+': Error: /, '');
            setError(errorMessage);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogTrigger asChild>
                <Button className="cursor-pointer">
                    Agregar Trazabilidad
                    <Plus className="mr-1 h-4 w-4" />
                </Button>
            </DialogTrigger>

            <DialogContent className="border-0 max-w-2xl flex flex-col max-h-[90vh] py-3 px-0">
                <DialogHeader className="pt-4 px-6 pb-0 shrink-0">
                    <DialogTitle>Agregar trazabilidad de item</DialogTitle>
                    <DialogDescription>
                        Registre el historial de estado y movimientos del item
                    </DialogDescription>
                </DialogHeader>

                <div className="flex-1 overflow-y-auto min-h-0 px-6 pb-6 pt-4">
                    <Form {...form}>
                        <form onSubmit={form.handleSubmit(handleSubmit)}>
                            {error && (
                                <div className="mb-4 p-3 text-sm text-destructive bg-destructive/10 border border-destructive/20 rounded-md">
                                    {error}
                                </div>
                            )}

                            <div className="grid gap-4 grid-cols-2 mb-4">
                                <FormField
                                    control={form.control}
                                    name="itemType"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Tipo de Item</FormLabel>
                                            <Select onValueChange={field.onChange} value={field.value}>
                                                <FormControl>
                                                    <SelectTrigger className="cursor-pointer">
                                                        <SelectValue placeholder="Seleccione categoría" />
                                                    </SelectTrigger>
                                                </FormControl>
                                                <SelectContent>
                                                    {categoryOptions.map((opt) => (
                                                        <SelectItem key={opt.value} value={opt.value} className="cursor-pointer">
                                                            {opt.label}
                                                        </SelectItem>
                                                    ))}
                                                </SelectContent>
                                            </Select>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />

                                <FormItem>
                                    <FormLabel>Item</FormLabel>
                                    <FormControl>
                                        <div className="relative" ref={searchRef}>
                                            <Button
                                                type="button"
                                                variant="outline"
                                                role="combobox"
                                                className="w-full cursor-pointer justify-between font-normal"
                                                disabled={!watchItemType || loadingAcc}
                                                onClick={() => setSearchOpen(!searchOpen)}
                                            >
                                                {selectedLabel || (loadingAcc ? 'Cargando...' : 'Buscar item...')}
                                                <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                                            </Button>
                                            {searchOpen && watchItemType && (
                                                <div className="absolute z-50 mt-1 w-full rounded-md border bg-popover shadow-md">
                                                    <div className="flex items-center gap-2 border-b px-3 py-2">
                                                        <Search className="h-4 w-4 shrink-0 opacity-50" />
                                                        <input
                                                            className="flex h-8 w-full bg-transparent text-sm outline-none placeholder:text-muted-foreground"
                                                            placeholder="Buscar por código, tipo, marca o descripción..."
                                                            value={searchTerm}
                                                            onChange={(e) => setSearchTerm(e.target.value)}
                                                            autoFocus
                                                        />
                                                    </div>
                                                    <div className="max-h-[220px] overflow-y-auto">
                                                        {filteredAccessories.length === 0 ? (
                                                            <p className="py-6 text-center text-sm text-muted-foreground">
                                                                {loadingAcc ? 'Cargando...' : 'No se encontraron items'}
                                                            </p>
                                                        ) : (
                                                            filteredAccessories.map((acc) => {
                                                                const { code, description, type } = getAccessoryDisplay(acc);
                                                                return (
                                                                    <button
                                                                        key={acc.id}
                                                                        type="button"
                                                                        className="flex w-full cursor-pointer items-center gap-2 px-3 py-2 text-sm hover:bg-accent text-left"
                                                                        onClick={() => selectAccessory(acc)}
                                                                    >
                                                                        <div className="flex flex-col flex-1">
                                                                            <span className="font-mono text-sm font-medium">
                                                                                {code}
                                                                            </span>
                                                                            <span className="text-xs text-muted-foreground">
                                                                                {type}{description ? ` - ${description}` : ''}
                                                                            </span>
                                                                        </div>
                                                                        <Plus className="h-4 w-4 shrink-0 text-blue-600" />
                                                                    </button>
                                                                );
                                                            })
                                                        )}
                                                    </div>
                                                </div>
                                            )}
                                        </div>
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            </div>

                            <div className="grid gap-4 grid-cols-2">
                                <FormField
                                    control={form.control}
                                    name="dateDamaged"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Fecha de Daño</FormLabel>
                                            <FormControl>
                                                <DateInput field={field} />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />

                                <FormField
                                    control={form.control}
                                    name="dateInRepair"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Fecha de Ingreso a Reparación</FormLabel>
                                            <FormControl>
                                                <DateInput field={field} />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />

                                <FormField
                                    control={form.control}
                                    name="dateRepaired"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Fecha de Reparación</FormLabel>
                                            <FormControl>
                                                <DateInput field={field} />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />

                                <FormField
                                    control={form.control}
                                    name="dateReinstated"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Fecha de Reincorporación</FormLabel>
                                            <FormControl>
                                                <DateInput field={field} />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />

                                <FormField
                                    control={form.control}
                                    name="rebuilt"
                                    render={({ field }) => (
                                        <FormItem className="flex items-end pb-2">
                                            <FormControl>
                                                <div className="flex items-center gap-2">
                                                    <Checkbox
                                                        checked={field.value}
                                                        onCheckedChange={field.onChange}
                                                        id="add-rebuilt"
                                                    />
                                                    <FormLabel htmlFor="add-rebuilt" className="cursor-pointer mb-0">
                                                        Item reconstruido
                                                    </FormLabel>
                                                </div>
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />

                                <FormField
                                    control={form.control}
                                    name="observations"
                                    render={({ field }) => (
                                        <FormItem className="col-span-2">
                                            <FormLabel>Observaciones</FormLabel>
                                            <FormControl>
                                                <Textarea
                                                    placeholder="Observaciones adicionales..."
                                                    className="resize-none"
                                                    {...field}
                                                />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                            </div>

                            <Button className="w-full cursor-pointer mt-6" type="submit" disabled={isLoading}>
                                {isLoading ? (
                                    <>
                                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                        Guardando...
                                    </>
                                ) : (
                                    'Guardar Trazabilidad'
                                )}
                            </Button>
                        </form>
                    </Form>
                </div>
            </DialogContent>
        </Dialog>
    );
};
