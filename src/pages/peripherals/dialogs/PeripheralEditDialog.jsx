import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as zod from 'zod';
import { Loader2 } from 'lucide-react';
import { Dialog, DialogContent, DialogDescription, DialogTitle, DialogHeader } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { usePeripheralStore } from '@/store/usePeripheralStore';

const PERIPHERAL_STATES = ['Bueno', 'Repuesto', 'Dañado', 'En reparacion', 'Reincorporado'];

const peripheralFormSchema = zod.object({
    code: zod.string().min(1, 'El código es requerido'),
    serial: zod.string().min(1, 'El serial es requerido'),
    description: zod.string().min(1, 'La descripción es requerida'),
    brand: zod.string().min(1, 'La marca es requerida'),
    model: zod.string().min(1, 'El modelo es requerido'),
    connectionType: zod.string({ required_error: 'Seleccione el tipo de conexión' }).refine(v => ['VGA', 'USB', 'Bluetooth', 'HDMI', 'Otro'].includes(v), { message: 'Seleccione el tipo de conexión' }),
    type: zod.string({ required_error: 'Seleccione el tipo' }).refine(v => ['Mouse', 'Monitor', 'Impresora', 'Teclado', 'Cargador'].includes(v), { message: 'Seleccione el tipo' }),
    state: zod.enum(['Bueno', 'Repuesto', 'Dañado', 'En reparacion', 'Reincorporado'], 'El estado es obligatorio'),
});

const defaultFormData = {
    code: '',
    serial: '',
    description: '',
    brand: '',
    model: '',
    connectionType: '',
    type: '',
    state: 'Bueno',
};

export const PeripheralEditDialog = ({ peripheral, open, onOpenChange }) => {
    const { updatePeripheral } = usePeripheralStore();
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const form = useForm({
        resolver: zodResolver(peripheralFormSchema),
        defaultValues: defaultFormData,
    });

    useEffect(() => {
        if (peripheral) {
            form.reset({
                code: peripheral.code || '',
                serial: peripheral.serial || '',
                description: peripheral.description || '',
                brand: peripheral.brand || '',
                model: peripheral.model || '',
                connectionType: peripheral.connectionType || '',
                type: peripheral.type || '',
                state: peripheral.state || 'Bueno',
            });
            setError('');
            setIsLoading(false);
        }
    }, [peripheral, form]);

    const handleSubmit = async (data) => {
        setIsLoading(true);
        setError('');

        try {
            await updatePeripheral(peripheral.id, data);
            onOpenChange(false);
        } catch (err) {
            let errorMessage = err.message || 'Error al actualizar periférico';
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
            <DialogContent className="border-0 max-w-2xl flex flex-col max-h-[90vh] py-3 px-0">
                <DialogHeader className="pt-4 px-6 pb-0 shrink-0">
                    <DialogTitle>Editar periférico: {peripheral?.code}</DialogTitle>
                    <DialogDescription>Modifique los datos del periférico seleccionado</DialogDescription>
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
                                                <Input placeholder="Ej: PER-001" {...field} />
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
                                                <Input placeholder="Serial del periférico" {...field} />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />

                                <FormField
                                    control={form.control}
                                    name="description"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Descripción</FormLabel>
                                            <FormControl>
                                                <Input placeholder="Descripción del periférico" {...field} />
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
                                                <Input placeholder="Marca del periférico" {...field} />
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
                                                <Input placeholder="Modelo del periférico" {...field} />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />

                                <FormField
                                    control={form.control}
                                    name="connectionType"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Tipo de Conexión</FormLabel>
                                            <Select onValueChange={field.onChange} value={field.value}>
                                                <FormControl>
                                                    <SelectTrigger>
                                                        <SelectValue placeholder="Seleccione conexión" />
                                                    </SelectTrigger>
                                                </FormControl>
                                                <SelectContent>
                                                    <SelectItem value="VGA">VGA</SelectItem>
                                                    <SelectItem value="USB">USB</SelectItem>
                                                    <SelectItem value="Bluetooth">Bluetooth</SelectItem>
                                                    <SelectItem value="HDMI">HDMI</SelectItem>
                                                    <SelectItem value="Otro">Otro</SelectItem>
                                                </SelectContent>
                                            </Select>
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
                                                    <SelectItem value="Mouse">Mouse</SelectItem>
                                                    <SelectItem value="Monitor">Monitor</SelectItem>
                                                    <SelectItem value="Impresora">Impresora</SelectItem>
                                                    <SelectItem value="Teclado">Teclado</SelectItem>
                                                    <SelectItem value="Cargador">Cargador</SelectItem>
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
                                                    {PERIPHERAL_STATES.map((s) => (
                                                        <SelectItem key={s} value={s}>{s}</SelectItem>
                                                    ))}
                                                </SelectContent>
                                            </Select>
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
                                    'Guardar Periférico'
                                )}
                            </Button>
                        </form>
                    </Form>
                </div>
            </DialogContent>
        </Dialog>
    );
};
