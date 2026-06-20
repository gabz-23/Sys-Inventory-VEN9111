import { useEffect, useState } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { Loader2 } from 'lucide-react';

import { Dialog, DialogContent, DialogDescription, DialogTitle, DialogHeader } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Form } from '@/components/ui/form';

import { compFormSchema } from '../form/form-schema';
import { GeneralTab } from '../form/tabs/GeneralTab';
import { SpecsTab } from '../form/tabs/SpecsTab';
import { PeripheralTab } from '../form/tabs/PeripheralTab';
import { useComputerStore } from '../store/useComputerStore';

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

export const ComputerEditDialog = ({ computer, open, onOpenChange }) => {
    const { updateComputer } = useComputerStore();
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const form = useForm({
        resolver: zodResolver(compFormSchema),
        defaultValues: defaultFormData,
    });

    // Limpiar el formulario y errores al abrir/cerrar el dialogo
    useEffect(() => {
        if (open && computer) {
            form.reset({
                ...computer,
                serial: computer.serial || '',
                code: computer.code || '',
                model: computer.model || '',
                brand: computer.brand || '',
                state: computer.state || '',
                cpu: computer.cpu || '',
                ramMemory: computer.ramMemory || '',
                storage: computer.storage || '',
                graphicCard: computer.graphicCard || '',
                powerSupply: computer.powerSupply || '',
                motherboard: computer.motherboard || '',
                cooler: computer.cooler || '',
                cdDvd: computer.cdDvd || '',
                peripherals: computer.peripherals || [],
                assignedComponents: computer.components || [],
            });
            setError('');
            setIsLoading(false);
        }
    }, [computer, form, open]);

    const handleSubmit = async (data) => {
        setIsLoading(true);
        setError('');

        try {
            await updateComputer(computer.id, data);
            onOpenChange(false); // Cerrar el diálogo después de enviar exitosamente
        } catch (err) {
            // Limpiar el mensaje de error para quitar el prefijo de Electron
            let errorMessage = err.message || 'Error al actualizar computadora';
            // Remover el prefijo "Error invoking remote method '[^']+': Error: "
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
            <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                    <DialogTitle>Editar el computador: {computer?.code} </DialogTitle>
                    <DialogDescription>
                        La edición no afectara al escritorio, bi a los accesorios relacionados
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

                            <GeneralTab form={form} computer={computer} />
                            <SpecsTab form={form} computer={computer} />
                            <PeripheralTab form={form} computer={computer} />

                            <Button 
                                className="w-full cursor-pointer mt-6" 
                                type="submit"
                                disabled={isLoading}
                            >
                                {isLoading ? (
                                    <>
                                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                        Guardando...
                                    </>
                                ) : (
                                    'Guardar edición'
                                )}
                            </Button>
                        </form>
                    </Form>
                </Tabs>
            </DialogContent>
        </Dialog>
    );
};
