import { useEffect, useState } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import * as zod from 'zod';
import { Plus, Loader2, Copy } from 'lucide-react';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogTitle,
    DialogTrigger,
    DialogHeader,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';

import { compFormSchema } from '../form/form-schema';
import { GeneralTab } from '../form/tabs/GeneralTab';
import { SpecsTab } from '../form/tabs/SpecsTab';
import { PeripheralTab } from '../form/tabs/PeripheralTab';
import { useComputerStore } from '../store/useComputerStore';

const addFormSchema = compFormSchema.extend({
    quantity: zod.coerce.number().int().positive('Debe ser un número positivo mayor a 0').max(100, 'El máximo es 100').default(1),
});

const defaultFormData = {
    computerType: '',
    code: '',
    serial: '',
    model: '',
    brand: '',
    state: '',
    cpu: '',
    ramMemory: '',
    storage: '',
    graphicCard: '',
    powerSupply: '',
    motherboard: '',
    cooler: '',
    cdDvd: '',
    peripherals: [],
    assignedComponents: [],
    componentIds: [],
};

export const ComputerAddDialog = ({ open, onOpenChange }) => {
    const { addComputer } = useComputerStore();
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const form = useForm({
        resolver: zodResolver(addFormSchema),
        defaultValues: { ...defaultFormData, quantity: 1 },
    });

    // Limpiar el formulario y errores al cerrar el dialogo
    useEffect(() => {
        if (open) {
            form.reset({ ...defaultFormData, quantity: 1 });
            setError('');
            setIsLoading(false);
        }
    }, [open, form]);

    const handleSubmit = async (data) => {
        setIsLoading(true);
        setError('');

        try {
            const qty = data.quantity || 1;

            for (let i = 0; i < qty; i++) {
                if (i === 0) {
                    await addComputer(data);
                } else {
                    const { computerType, serial, brand, model, state } = data;
                    await addComputer({
                        computerType, brand, model, state,
                        serial: `${serial}-COPIA`.slice(0, 30),
                        code: 'comp-copia',
                        cpu: '', ramMemory: '', storage: '', graphicCard: '',
                        powerSupply: '', motherboard: '', cooler: '', cdDvd: '',
                        peripherals: [],
                        assignedComponents: [],
                        componentIds: [],
                    });
                }
            }
            onOpenChange(false);
        } catch (err) {
            let errorMessage = err.message || 'Error al agregar computadora';
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
                    Agregar Computador
                    <Plus className="mr-1 h-4 w-4" />
                </Button>
            </DialogTrigger>

            <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                    <DialogTitle>Agregar nuevo computador</DialogTitle>
                    <DialogDescription>
                        Complete la información del computador, periféricos y especificaciones técnicas
                    </DialogDescription>
                </DialogHeader>

                <Tabs defaultValue="general" className="w-full">
                    <TabsList className="grid w-full grid-cols-3 ">
                        <TabsTrigger className={'cursor-pointer'} value="general">
                            General
                        </TabsTrigger>
                        <TabsTrigger className={'cursor-pointer'} value="specs">
                            Componentes
                        </TabsTrigger>
                        <TabsTrigger className={'cursor-pointer'} value="peripherals">
                            Periféricos
                        </TabsTrigger>
                    </TabsList>

                    <Form {...form}>
                        <form onSubmit={form.handleSubmit(handleSubmit)}>
                            {error && (
                                <div className="mt-4 p-3 text-sm text-destructive bg-destructive/10 border border-destructive/20 rounded-md">
                                    {error}
                                </div>
                            )}

                            <GeneralTab form={form} />
                            <SpecsTab form={form} computer={undefined} />
                            <PeripheralTab form={form} />

                            <div className="mt-4 flex items-end gap-4">
                                <FormField
                                    control={form.control}
                                    name="quantity"
                                    render={({ field }) => (
                                        <FormItem className="flex-1">
                                            <FormLabel>Cantidad de registros</FormLabel>
                                            <FormControl>
                                                <div className="relative">
                                                    <Copy className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                                                    <Input
                                                        type="number"
                                                        min={1}
                                                        step={1}
                                                        className="pl-9"
                                                        {...field}
                                                    />
                                                </div>
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                <Button
                                    className="flex-1 cursor-pointer"
                                    type="submit"
                                    disabled={isLoading}
                                >
                                    {isLoading ? (
                                        <>
                                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                            Guardando...
                                        </>
                                    ) : (
                                        'Guardar Computador'
                                    )}
                                </Button>
                            </div>
                        </form>
                    </Form>
                </Tabs>
            </DialogContent>
        </Dialog>
    );
};
