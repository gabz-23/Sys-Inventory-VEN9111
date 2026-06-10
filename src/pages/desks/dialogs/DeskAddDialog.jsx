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

import { deskFormSchema } from '../form/formDeskSchema';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { SearchAccessory } from '@/components/form/accessory/SearchAccessory';
import { useDeskStore } from '../store/useDeskStore';
import { useComputerStore } from '@/pages/computers/store/useComputerStore';
import { useEmployeeStore } from '@/store/useEmployeeStore';

const addFormSchema = deskFormSchema.extend({
    quantity: zod.coerce.number().int().positive('Debe ser un número positivo mayor a 0').max(100, 'El máximo es 100').default(1),
});

const defaultFormData = {
    code: '',
    computer: '',
    employee: '',
    accessories: [],
};

export const DeskAddDialog = ({ open, onOpenChange }) => {
    const { addDesk, desks, loadDesks } = useDeskStore();
    const { computers, loadComputers } = useComputerStore();
    const { employees, loadEmployees } = useEmployeeStore();
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const form = useForm({
        resolver: zodResolver(addFormSchema),
        defaultValues: { ...defaultFormData, quantity: 1 },
    });

    // Cargar escritorios, computadores y empleados cuando se abre el diálogo
    useEffect(() => {
        if (open) {
            loadDesks();
            loadComputers();
            loadEmployees();
        }
    }, [open, loadDesks, loadComputers, loadEmployees]);

    // Limpiar el formulario y errores al cerrar el dialogo
    useEffect(() => {
        if (open) {
            form.reset({ ...defaultFormData, quantity: 1 });
            setError('');
            setIsLoading(false);
        }
    }, [open, form]);

    // Filtrar computadores que no tienen un escritorio asignado
    const computersWithoutDesk = computers.filter((computer) => {
        const hasDesk = desks.some((desk) => desk.computerId === computer.id);
        return !hasDesk;
    });

    // Filtrar empleados que no tienen un escritorio asignado
    const assignedEmployeeIds = desks.filter((d) => d.employeeId).map((d) => d.employeeId);
    const availableEmployees = employees.filter((emp) => !assignedEmployeeIds.includes(emp.id));

    const handleSubmit = async (data) => {
        setIsLoading(true);
        setError('');

        try {
            const qty = data.quantity || 1;

            for (let i = 0; i < qty; i++) {
                const submitData = {
                    ...data,
                    computer: data.computer === '' || data.computer === 'none' ? null : data.computer,
                    employee: data.employee === '' || data.employee === 'none' ? null : data.employee,
                };
                if (i > 0) {
                    submitData.code = 'esc-copia';
                    submitData.computer = null;
                    submitData.employee = null;
                    submitData.accessories = [];
                }
                await addDesk(submitData);
            }
            onOpenChange(false);
        } catch (err) {
            let errorMessage = err.message || 'Error al agregar escritorio';
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
                    Agregar Escritorio
                    <Plus className="mr-1 h-4 w-4" />
                </Button>
            </DialogTrigger>

            <DialogContent className="border-0 max-w-3xl flex flex-col max-h-[90vh] py-3 px-0">
                <DialogHeader className="pt-4 px-6 pb-0 shrink-0">
                    <DialogTitle>Agregar nuevo escritorio</DialogTitle>
                    <DialogDescription>
                        Complete la información del escritorio, indicando los accesorios que le pertenecen
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

                            <div className="grid gap-4 grid-cols-1">
                                <div className="space-y-2">
                                    <FormField
                                        control={form.control}
                                        name="code"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Código</FormLabel>
                                                <FormControl>
                                                    <Input placeholder="Ej: ESC-001" {...field} />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                </div>
                                <div className="space-y-2">
                                    <FormField
                                        control={form.control}
                                        name="employee"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Empleado Asignado</FormLabel>
                                                <FormControl>
                                                    <Select
                                                        onValueChange={field.onChange}
                                                        value={field.value || 'none'}
                                                    >
                                                        <SelectTrigger className="w-full cursor-pointer">
                                                            <SelectValue placeholder="Seleccione un empleado" />
                                                        </SelectTrigger>
                                                        <SelectContent className="max-h-[200px] overflow-auto">
                                                            <SelectItem value="none" className="cursor-pointer">
                                                                Ninguno
                                                            </SelectItem>
                                                            {availableEmployees.length > 0
                                                                 ? availableEmployees.map((emp) => (
                                                                       <SelectItem
                                                                           key={emp.id}
                                                                           value={emp.id}
                                                                           className="cursor-pointer"
                                                                       >
                                                                           {emp.nombres} {emp.apellidos}
                                                                       </SelectItem>
                                                                   ))
                                                                 : null}
                                                        </SelectContent>
                                                    </Select>
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                </div>
                                <div className="space-y-2">
                                    <FormField
                                        control={form.control}
                                        name="computer"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Computador</FormLabel>
                                                <FormControl>
                                                    <Select
                                                        onValueChange={field.onChange}
                                                        value={field.value || 'none'}
                                                    >
                                                        <SelectTrigger className="w-full cursor-pointer">
                                                            <SelectValue placeholder="Seleccione un computador" />
                                                        </SelectTrigger>
                                                        <SelectContent className="max-h-[200px] overflow-auto">
                                                            <SelectItem value="none" className="cursor-pointer">
                                                                Ninguno
                                                            </SelectItem>
                                                            {computersWithoutDesk.length > 0
                                                                ? computersWithoutDesk.map((computer) => (
                                                                      <SelectItem
                                                                          key={computer.id}
                                                                          value={computer.id}
                                                                          className="cursor-pointer"
                                                                      >
                                                                          {computer.code}
                                                                      </SelectItem>
                                                                  ))
                                                                : null}
                                                        </SelectContent>
                                                    </Select>
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                </div>
                                <div className="space-y-2">
                                    <SearchAccessory form={form} computer={undefined} desk={null} />
                                </div>
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
                                    'Guardar Escritorio'
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
