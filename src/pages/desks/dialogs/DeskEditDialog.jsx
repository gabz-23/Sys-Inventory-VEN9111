import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Dialog, DialogContent, DialogDescription, DialogTitle, DialogHeader } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

import { SearchAccessory } from '@/components/form/accessory/SearchAccessory';
import { deskFormSchema } from '../form/formDeskSchema';
import { useDeskStore } from '../store/useDeskStore';
import { useComputerStore } from '@/pages/computers/store/useComputerStore';
import { useEmployeeStore } from '@/store/useEmployeeStore';

const defaultFormData = {
    code: '',
    computer: '',
    employee: '',
    accessories: [],
};

export const DeskEditDialog = ({ desk, open, onOpenChange }) => {
    const { updateDesk, desks, loadDesks } = useDeskStore();
    const { computers, loadComputers } = useComputerStore();
    const { employees, loadEmployees } = useEmployeeStore();

    const form = useForm({
        resolver: zodResolver(deskFormSchema),
        defaultValues: defaultFormData,
    });

    // Cargar escritorios, computadores y empleados cuando se abre el diálogo
    useEffect(() => {
        if (open) {
            loadDesks();
            loadComputers();
            loadEmployees();
        }
    }, [open, loadDesks, loadComputers, loadEmployees]);

    // Limpiar el formulario al cerrar el dialogo
    useEffect(() => {
        if (desk) {
            form.reset({
                code: desk.code || '',
                // Mapear computerId a computer para el formulario, usar 'none' si no hay computador
                computer: desk.computerId || 'none',
                employee: desk.employeeId || 'none',
                // Asegurar que los accesorios se carguen correctamente
                accessories: desk.accessories || [],
            });
        }
    }, [desk, form]);

    // Filtrar computadores disponibles para edición
    // Incluye: computadores sin escritorio asignado + el computador actual del escritorio (si existe)
    const availableComputers = computers.filter((computer) => {
        // Si es el computador actual del escritorio, siempre incluirlo
        if (desk?.computerId === computer.id) {
            return true;
        }
        // Si no tiene escritorio asignado, incluirlo
        const hasDesk = desks.some((d) => d.computerId === computer.id);
        return !hasDesk;
    });

    // Ordenar para que el computador asignado aparezca primero
    const sortedComputers = [...availableComputers].sort((a, b) => {
        if (a.id === desk?.computerId) return -1;
        if (b.id === desk?.computerId) return 1;
        return 0;
    });

    // Filtrar empleados que no tienen un escritorio asignado (incluir el actual)
    const assignedEmployeeIds = desks
        .filter((d) => d.employeeId && d.id !== desk?.id)
        .map((d) => d.employeeId);
    const availableEmployees = employees.filter((emp) => !assignedEmployeeIds.includes(emp.id));

    const handleSubmit = (data) => {
        const submitData = {
            ...data,
            computer: data.computer === '' || data.computer === 'none' ? null : data.computer,
            employee: data.employee === '' || data.employee === 'none' ? null : data.employee,
        };
        updateDesk(desk.id, submitData);
        onOpenChange(); // Cerrar el diálogo después de enviar
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="border-0 max-w-3xl flex flex-col max-h-[90vh] py-3 px-0">
                <DialogHeader className="pt-4 px-6 pb-0 shrink-0">
                    <DialogTitle>Editar el escritorio: {desk?.code} </DialogTitle>
                    <DialogDescription>La edición no afectara al computador relacionado</DialogDescription>
                </DialogHeader>

                <div className="flex-1 overflow-y-auto min-h-0 px-6 pb-6 pt-4">
                    <Form {...form}>
                        <form onSubmit={form.handleSubmit(handleSubmit)}>
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
                                                    <Select onValueChange={field.onChange} value={field.value || 'none'}>
                                                        <SelectTrigger className="w-full cursor-pointer">
                                                            <SelectValue placeholder="Seleccione un empleado" />
                                                        </SelectTrigger>
                                                        <SelectContent className="max-h-[200px] overflow-auto">
                                                            <SelectItem value="none" className="cursor-pointer">
                                                                Ninguno
                                                            </SelectItem>
                                                            {availableEmployees.length > 0
                                                                 ? availableEmployees.map((emp) => (
                                                                       <SelectItem key={emp.id} value={emp.id} className="cursor-pointer">
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
                                                    <Select onValueChange={field.onChange} value={field.value || 'none'}>
                                                        <SelectTrigger className="w-full cursor-pointer">
                                                            <SelectValue placeholder="Seleccione un computador" />
                                                        </SelectTrigger>
                                                        <SelectContent className="max-h-[200px] overflow-auto">
                                                            <SelectItem value="none" className="cursor-pointer">
                                                                Ninguno
                                                            </SelectItem>
                                                            {sortedComputers.length > 0 ? (
                                                                sortedComputers.map((computer) => (
                                                                    <SelectItem key={computer.id} value={computer.id} className="cursor-pointer">
                                                                        {computer.code}
                                                                    </SelectItem>
                                                                ))
                                                            ) : null}
                                                        </SelectContent>
                                                    </Select>
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                </div>
                                <div className="space-y-2">
                                    <SearchAccessory form={form} computer={undefined} desk={desk} />
                                </div>
                            </div>
                            <Button className="w-full cursor-pointer mt-6" type="submit">
                                Guardar Escritorio
                            </Button>
                        </form>
                    </Form>
                </div>
            </DialogContent>
        </Dialog>
    );
};
