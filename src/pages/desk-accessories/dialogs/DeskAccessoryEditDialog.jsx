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
import { useDeskAccessoryStore } from '@/store/useDeskAccessoryStore';

const accessoryStateOptions = [
    { label: 'Bueno', value: 'Bueno' },
    { label: 'Dañado', value: 'Dañado' },
    { label: 'Repuesto', value: 'Repuesto' },
    { label: 'En reparacion', value: 'En reparacion' },
    { label: 'Reincorporado', value: 'Reincorporado' },

];

const deskAccessoryFormSchema = zod.object({
    code: zod.string().min(1, 'El código es requerido'),
    serial: zod.string().optional().default(''),
    description: zod.string().optional().default(''),
    type: zod.enum(['Silla', 'Lampara', 'Papelera', 'Archivero', 'Telefono'], { required_error: 'El tipo es requerido' }),
    state: zod.string().min(1, 'El estado es requerido'),
});

const defaultFormData = {
    code: '',
    serial: '',
    description: '',
    type: '',
    state: 'bueno',
};

export const DeskAccessoryEditDialog = ({ deskAccessory, open, onOpenChange }) => {
    const { updateDeskAccessory } = useDeskAccessoryStore();
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const form = useForm({
        resolver: zodResolver(deskAccessoryFormSchema),
        defaultValues: defaultFormData,
    });

    useEffect(() => {
        if (deskAccessory) {
            form.reset({
                code: deskAccessory.code || '',
                serial: deskAccessory.serial || '',
                description: deskAccessory.description || '',
                type: deskAccessory.type || '',
                state: deskAccessory.state || 'bueno',
            });
            setError('');
            setIsLoading(false);
        }
    }, [deskAccessory, form]);

    const handleSubmit = async (data) => {
        setIsLoading(true);
        setError('');

        try {
            await updateDeskAccessory(deskAccessory.id, data);
            onOpenChange(false);
        } catch (err) {
            let errorMessage = err.message || 'Error al actualizar accesorio de escritorio';
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
                    <DialogTitle>Editar accesorio de escritorio: {deskAccessory?.code}</DialogTitle>
                    <DialogDescription>Modifique los datos del accesorio de escritorio seleccionado</DialogDescription>
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
                                                <Input placeholder="Ej: ACC-001" {...field} />
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
                                                <Input placeholder="Número de serie" {...field} />
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
                                                <Input placeholder="Descripción del accesorio" {...field} />
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
                                                    <SelectItem value="Silla">Silla</SelectItem>
                                                    <SelectItem value="Lampara">Lámpara</SelectItem>
                                                    <SelectItem value="Papelera">Papelera</SelectItem>
                                                    <SelectItem value="Archivero">Archivero</SelectItem>
                                                    <SelectItem value="Telefono">Teléfono</SelectItem>
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
                                            <FormControl>
                                                <Select onValueChange={field.onChange} value={field.value}>
                                                    <SelectTrigger className="w-full cursor-pointer">
                                                        <SelectValue placeholder="Seleccione un estado" />
                                                    </SelectTrigger>
                                                    <SelectContent>
                                                        {accessoryStateOptions.map((opt) => (
                                                            <SelectItem key={opt.value} value={opt.value} className="cursor-pointer">
                                                                {opt.label}
                                                            </SelectItem>
                                                        ))}
                                                    </SelectContent>
                                                </Select>
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
                                    'Guardar Accesorio de Escritorio'
                                )}
                            </Button>
                        </form>
                    </Form>
                </div>
            </DialogContent>
        </Dialog>
    );
};
