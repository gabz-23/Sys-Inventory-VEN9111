import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as zod from 'zod';
import { Dialog, DialogContent, DialogDescription, DialogTitle, DialogHeader } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useComponentStore } from '@/store/useComponentStore';

const COMPONENT_STATES = ['Bueno', 'Repuesto', 'Dañado', 'En reparacion', 'Reparado', 'Reconstruido'];

const componentFormSchema = zod.object({
    code: zod.string().min(1, 'El código es requerido'),
    serial: zod.string().optional().default(''),
    brand: zod.string().optional().default(''),
    model: zod.string().optional().default(''),
    specs: zod.string().optional().default(''),
    type: zod.string().min(1, 'El tipo es requerido'),
    state: zod.enum(['Bueno', 'Repuesto', 'Dañado', 'En reparacion', 'Reparado', 'Reconstruido'], 'El estado es obligatorio'),
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

export const ComponentEditDialog = ({ component, open, onOpenChange }) => {
    const { updateComponent } = useComponentStore();

    const form = useForm({
        resolver: zodResolver(componentFormSchema),
        defaultValues: defaultFormData,
    });

    useEffect(() => {
        if (component) {
            form.reset({
                code: component.code || '',
                serial: component.serial || '',
                brand: component.brand || '',
                model: component.model || '',
                specs: component.specs || '',
                type: component.type || '',
                state: component.state || 'Bueno',
            });
        }
    }, [component, form]);

    const handleSubmit = (data) => {
        updateComponent(component.id, data);
        onOpenChange();
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="border-0 max-w-2xl flex flex-col max-h-[90vh] py-3 px-0">
                <DialogHeader className="pt-4 px-6 pb-0 shrink-0">
                    <DialogTitle>Editar componente: {component?.code}</DialogTitle>
                    <DialogDescription>Modifique los datos del componente seleccionado</DialogDescription>
                </DialogHeader>

                <div className="flex-1 overflow-y-auto min-h-0 px-6 pb-6 pt-4">
                    <Form {...form}>
                        <form onSubmit={form.handleSubmit(handleSubmit)}>
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
                                            <FormControl>
                                                <Input placeholder="Ej: Procesador, Memoria RAM" {...field} />
                                            </FormControl>
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

                            <Button className="w-full cursor-pointer mt-6" type="submit">
                                Guardar Componente
                            </Button>
                        </form>
                    </Form>
                </div>
            </DialogContent>
        </Dialog>
    );
};
