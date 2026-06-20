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
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useComponentStore } from '@/store/useComponentStore';

const COMPONENT_STATES = ['Bueno', 'Repuesto', 'Dañado', 'En reparacion', 'Reincorporado'];

const componentFormSchema = zod.object({
    code: zod.string().min(1, 'El código es requerido'),
    serial: zod.string().optional().default(''),
    brand: zod.string().optional().default(''),
    model: zod.string().optional().default(''),
    specs: zod.string().optional().default(''),
    type: zod.string({ required_error: 'Seleccione el tipo' }).refine(v => ['Procesador', 'Memoria RAM', 'Disco / Almacenamiento', 'Tarjeta Gráfica'].includes(v), { message: 'Seleccione el tipo' }),
    state: zod.string({ required_error: 'Seleccione el estado' }).refine(v => ['Bueno', 'Repuesto', 'Dañado', 'En reparacion', 'Reincorporado'].includes(v), { message: 'Seleccione el estado' }),
});

const addFormSchema = componentFormSchema.extend({
    quantity: zod.coerce.number().int().positive('Debe ser un número positivo mayor a 0').max(100, 'El máximo es 100').default(1),
});

const defaultFormData = {
    code: '',
    serial: '',
    brand: '',
    model: '',
    specs: '',
    type: '',
    state: 'Bueno',
};

export const ComponentAddDialog = ({ open, onOpenChange }) => {
    const { addComponent } = useComponentStore();
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const form = useForm({
        resolver: zodResolver(addFormSchema),
        defaultValues: { ...defaultFormData, quantity: 1 },
    });

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

            const rand = () => Math.random().toString(36).substring(2, 7).toUpperCase();

            for (let i = 0; i < qty; i++) {
                const submitData = { ...data };
                if (i > 0) {
                    submitData.code = `COMP-${rand()}`;
                    submitData.serial = `SN-${rand()}-${rand()}`;
                }
                await addComponent(submitData);
            }
            onOpenChange(false);
        } catch (err) {
            let errorMessage = err.message || 'Error al agregar componente';
            errorMessage = errorMessage.replace(/^Error invoking remote method '[^']+': Error: /, '');
            const match = errorMessage.match(/^VALIDATION_ERROR:(\w+):(.+)$/);
            if (match) {
                form.setError(match[1], { message: match[2] });
            } else {
                setError(errorMessage);
            }
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogTrigger asChild>
                <Button className="cursor-pointer">
                    Agregar Componente
                    <Plus className="mr-1 h-4 w-4" />
                </Button>
            </DialogTrigger>

            <DialogContent className="border-0 max-w-2xl flex flex-col max-h-[90vh] py-3 px-0">
                <DialogHeader className="pt-4 px-6 pb-0 shrink-0">
                    <DialogTitle>Agregar nuevo componente</DialogTitle>
                    <DialogDescription>
                        Complete la información del componente
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

                            <div className="grid gap-4 grid-cols-2">
                                <FormField
                                    control={form.control}
                                    name="code"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Código</FormLabel>
                                            <FormControl>
                                                <Input placeholder="Ej: COMP-001" {...field} />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />

                                <FormField
                                    control={form.control}
                                    name="serial"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Serial</FormLabel>
                                            <FormControl>
                                                <Input placeholder="Serial del componente" {...field} />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />

                                <FormField
                                    control={form.control}
                                    name="brand"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Marca</FormLabel>
                                            <FormControl>
                                                <Input placeholder="Marca del componente" {...field} />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />

                                <FormField
                                    control={form.control}
                                    name="model"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Modelo</FormLabel>
                                            <FormControl>
                                                <Input placeholder="Modelo del componente" {...field} />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />

                                <FormField
                                    control={form.control}
                                    name="specs"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Especificaciones</FormLabel>
                                            <FormControl>
                                                <Input placeholder="Especificaciones técnicas" {...field} />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />

                                <FormField
                                    control={form.control}
                                    name="type"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Tipo</FormLabel>
                                            <Select onValueChange={field.onChange} value={field.value}>
                                                <FormControl>
                                                    <SelectTrigger>
                                                        <SelectValue placeholder="Seleccione el tipo" />
                                                    </SelectTrigger>
                                                </FormControl>
                                                <SelectContent>
                                                    <SelectItem value="Procesador">Procesador</SelectItem>
                                                    <SelectItem value="Memoria RAM">Memoria RAM</SelectItem>
                                                    <SelectItem value="Disco / Almacenamiento">Disco / Almacenamiento</SelectItem>
                                                    <SelectItem value="Tarjeta Gráfica">Tarjeta Gráfica</SelectItem>
                                                </SelectContent>
                                            </Select>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />

                                <FormField
                                    control={form.control}
                                    name="state"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Estado</FormLabel>
                                            <Select onValueChange={field.onChange} value={field.value}>
                                                <FormControl>
                                                    <SelectTrigger>
                                                        <SelectValue placeholder="Seleccione el estado" />
                                                    </SelectTrigger>
                                                </FormControl>
                                                <SelectContent>
                                                    {COMPONENT_STATES.map((s) => (
                                                        <SelectItem key={s} value={s}>{s}</SelectItem>
                                                    ))}
                                                </SelectContent>
                                            </Select>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                            </div>

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
                                <Button className="flex-1 cursor-pointer mt-0" type="submit" disabled={isLoading}>
                                {isLoading ? (
                                    <>
                                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                        Guardando...
                                    </>
                                ) : (
                                    'Agregar Componente'
                                )}
                            </Button>
                            </div>
                        </form>
                    </Form>
                </div>
            </DialogContent>
        </Dialog>
    );
};
