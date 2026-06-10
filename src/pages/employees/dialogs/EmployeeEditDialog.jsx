import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as zod from 'zod';
import { Dialog, DialogContent, DialogDescription, DialogTitle, DialogHeader } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useEmployeeStore } from '@/store/useEmployeeStore';

const employeeFormSchema = zod.object({
    nombres: zod.string().min(1, 'Los nombres son requeridos'),
    apellidos: zod.string().min(1, 'Los apellidos son requeridos'),
    cedula: zod.string().regex(/^\d+$/, 'La cédula solo debe contener números'),
    telefono: zod.string().regex(/^\d+$/, 'El teléfono solo debe contener números').optional().or(zod.literal('')).default(''),
    correo: zod.string().email('Correo inválido').refine(
        (val) => !val || val.endsWith('@gmail.com') || val.endsWith('@outlook.com'),
        'Solo se permiten correos de @gmail.com o @outlook.com'
    ).optional().or(zod.literal('')).default(''),
    tipoEmpleado: zod.string().min(1, 'El tipo de empleado es requerido'),
    estado: zod.string().min(1, 'El estado es requerido'),
});

const defaultFormData = {
    nombres: '',
    apellidos: '',
    cedula: '',
    telefono: '',
    correo: '',
    tipoEmpleado: '',
    estado: 'Activo',
};

export const EmployeeEditDialog = ({ employee, open, onOpenChange }) => {
    const { updateEmployee } = useEmployeeStore();

    const form = useForm({
        resolver: zodResolver(employeeFormSchema),
        defaultValues: defaultFormData,
    });

    useEffect(() => {
        if (employee) {
            form.reset({
                nombres: employee.nombres || '',
                apellidos: employee.apellidos || '',
                cedula: employee.cedula || '',
                telefono: employee.telefono || '',
                correo: employee.correo || '',
                tipoEmpleado: employee.tipoEmpleado || '',
                estado: employee.estado || 'Activo',
            });
        }
    }, [employee, form]);

    const handleSubmit = (data) => {
        updateEmployee(employee.id, data);
        onOpenChange();
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="border-0 max-w-2xl flex flex-col max-h-[90vh] py-3 px-0">
                <DialogHeader className="pt-4 px-6 pb-0 shrink-0">
                    <DialogTitle>Editar empleado: {employee?.code}</DialogTitle>
                    <DialogDescription>Modifique los datos del empleado seleccionado</DialogDescription>
                </DialogHeader>

                <div className="flex-1 overflow-y-auto min-h-0 px-6 pb-6 pt-4">
                    <Form {...form}>
                        <form onSubmit={form.handleSubmit(handleSubmit)}>
                            <div className="grid gap-4 grid-cols-2">
                                <FormField
                                    control={form.control}
                                    name="nombres"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Nombres</FormLabel>
                                            <FormControl>
                                                <Input placeholder="Nombres" {...field} />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />

                                <FormField
                                    control={form.control}
                                    name="apellidos"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Apellidos</FormLabel>
                                            <FormControl>
                                                <Input placeholder="Apellidos" {...field} />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />

                                <FormField
                                    control={form.control}
                                    name="cedula"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Cédula</FormLabel>
                                            <FormControl>
                                                <Input
                                                    placeholder="12345678"
                                                    {...field}
                                                    onChange={(e) => {
                                                        const val = e.target.value.replace(/\D/g, '');
                                                        field.onChange(val);
                                                    }}
                                                />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />

                                <FormField
                                    control={form.control}
                                    name="telefono"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Teléfono</FormLabel>
                                            <FormControl>
                                                <Input
                                                    placeholder="04121234567"
                                                    {...field}
                                                    onChange={(e) => {
                                                        const val = e.target.value.replace(/\D/g, '');
                                                        field.onChange(val);
                                                    }}
                                                />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />

                                <FormField
                                    control={form.control}
                                    name="correo"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Correo Electrónico</FormLabel>
                                            <FormControl>
                                                <Input placeholder="correo@gmail.com" {...field} />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />

                                <FormField
                                    control={form.control}
                                    name="tipoEmpleado"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Tipo de Empleado</FormLabel>
                                            <FormControl>
                                                <Input placeholder="Ej: Administrativo, Técnico, Supervisor" {...field} />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />

                                <FormField
                                    control={form.control}
                                    name="estado"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Estado</FormLabel>
                                            <FormControl>
                                                <Select onValueChange={field.onChange} value={field.value}>
                                                    <SelectTrigger className="w-full cursor-pointer">
                                                        <SelectValue placeholder="Seleccione un estado" />
                                                    </SelectTrigger>
                                                    <SelectContent>
                                                        <SelectItem value="Activo" className="cursor-pointer">Activo</SelectItem>
                                                        <SelectItem value="Inactivo" className="cursor-pointer">Inactivo</SelectItem>
                                                        <SelectItem value="Vacaciones" className="cursor-pointer">Vacaciones</SelectItem>
                                                        <SelectItem value="Suspenso" className="cursor-pointer">Suspenso</SelectItem>
                                                    </SelectContent>
                                                </Select>
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                            </div>

                            <Button className="w-full cursor-pointer mt-6" type="submit">
                                Guardar Empleado
                            </Button>
                        </form>
                    </Form>
                </div>
            </DialogContent>
        </Dialog>
    );
};
