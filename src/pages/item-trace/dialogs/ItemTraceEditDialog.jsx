import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as zod from 'zod';
import { Dialog, DialogContent, DialogDescription, DialogTitle, DialogHeader } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import { useItemTraceStore } from '@/store/useItemTraceStore';
import { DateInput } from '@/components/ui/DateInput';

const itemTraceFormSchema = zod.object({
    itemType: zod.string().optional().default(''),
    itemCode: zod.string().optional().default(''),
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

export const ItemTraceEditDialog = ({ itemTrace, open, onOpenChange }) => {
    const { updateItemTrace } = useItemTraceStore();

    const form = useForm({
        resolver: zodResolver(itemTraceFormSchema),
        defaultValues: defaultFormData,
    });

    useEffect(() => {
        if (itemTrace) {
            form.reset({
                itemType: itemTrace.itemType || '',
                itemCode: itemTrace.itemCode || '',
                itemDescription: itemTrace.itemDescription || '',
                itemId: itemTrace.itemId || '',
                dateDamaged: itemTrace.dateDamaged || '',
                dateInRepair: itemTrace.dateInRepair || '',
                dateRepaired: itemTrace.dateRepaired || '',
                dateReinstated: itemTrace.dateReinstated || '',
                rebuilt: itemTrace.rebuilt || false,
                observations: itemTrace.observations || '',
            });
        }
    }, [itemTrace, form]);

    const handleSubmit = async (data) => {
        try {
            await updateItemTrace(itemTrace.id, data);
            onOpenChange();
        } catch (err) {
            console.error('Error al actualizar trazabilidad:', err);
        }
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="border-0 max-w-2xl flex flex-col max-h-[90vh] py-3 px-0">
                <DialogHeader className="pt-4 px-6 pb-0 shrink-0">
                    <DialogTitle>Editar trazabilidad: {itemTrace?.itemCode}</DialogTitle>
                    <DialogDescription>Modifique los datos de la trazabilidad seleccionada</DialogDescription>
                </DialogHeader>

                <div className="flex-1 overflow-y-auto min-h-0 px-6 pb-6 pt-4">
                    <Form {...form}>
                        <form onSubmit={form.handleSubmit(handleSubmit)}>
                            <div className="grid gap-4 grid-cols-2 mb-4">
                                <div className="space-y-1.5">
                                    <FormLabel>Tipo de Item</FormLabel>
                                    <p className="text-sm font-medium text-foreground border rounded-md px-3 py-2 bg-muted/50">
                                        {itemTrace?.itemType || 'N/A'}
                                    </p>
                                </div>
                                <div className="space-y-1.5">
                                    <FormLabel>Item</FormLabel>
                                    <p className="text-sm font-medium text-foreground border rounded-md px-3 py-2 bg-muted/50">
                                        {itemTrace?.itemCode || 'N/A'}
                                        {itemTrace?.itemDescription ? ` - ${itemTrace.itemDescription}` : ''}
                                    </p>
                                </div>
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
                                                        id="edit-rebuilt"
                                                    />
                                                    <FormLabel htmlFor="edit-rebuilt" className="cursor-pointer mb-0">
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

                            <Button className="w-full cursor-pointer mt-6" type="submit">
                                Guardar Trazabilidad
                            </Button>
                        </form>
                    </Form>
                </div>
            </DialogContent>
        </Dialog>
    );
};
