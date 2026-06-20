import { FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { TabsContent } from '@/components/ui/tabs';
import { FormInput } from '../FormInput';
import { InputRequired } from '@/components/form/InputRequired';

const STATE_OPTIONS = ['Bueno', 'Repuesto', 'Dañado', 'Reconstruido', 'Reincorporado'];
const RECONSTRUIDO_TRANSITIONS = ['Reconstruido', 'Repuesto', 'Dañado', 'Reincorporado'];

export const GeneralTab = ({ form, computer }) => {
    const isReconstruido = computer?.state === 'Reconstruido';
    const stateOptions = isReconstruido ? RECONSTRUIDO_TRANSITIONS : STATE_OPTIONS;
    return (
        <TabsContent value="general" className="space-y-4 mt-4 mb-6">
            <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2 md:col-span-2">
                    <FormField
                        control={form.control}
                        name="computerType"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>
                                    Tipo de Computador <InputRequired />
                                </FormLabel>
                                <FormControl>
                                    <Select onValueChange={field.onChange} value={field.value}>
                                        <SelectTrigger className="w-full cursor-pointer">
                                            <SelectValue placeholder="Seleccione el tipo" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="Laptop" className="cursor-pointer">Laptop</SelectItem>
                                            <SelectItem value="Escritorio" className="cursor-pointer">Computador de escritorio</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                </div>

                <div className="space-y-2 md:col-span-2">
                    <FormInput
                        form={form}
                        name="code"
                        label="Código"
                        placeholder="Ej: COMP-001"
                        required={true}
                    />
                </div>

                <div className="space-y-2">
                    <FormInput
                        form={form}
                        name="serial"
                        label="Numero de serial"
                        placeholder="Ej: 00000000000"
                        required={true}
                    />
                </div>

                <div className="space-y-2">
                    <FormInput form={form} name="brand" label="Marca" placeholder="Ej: DELL" required={true} />
                </div>

                <div className="space-y-2">
                    <FormInput form={form} name="model" label="Modelo" placeholder="Ej: Inspiron 14" required={true} />
                </div>

                <div className="space-y-2">
                    <FormField
                        control={form.control}
                        name="state"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>
                                    Estado <InputRequired />
                                </FormLabel>
                                <FormControl>
                                    <Select onValueChange={field.onChange} value={field.value}>
                                        <SelectTrigger className="w-full cursor-pointer">
                                            <SelectValue placeholder="Seleccione el estado" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {stateOptions.map((opt) => (
                                                <SelectItem key={opt} value={opt} className="cursor-pointer">{opt}</SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                </div>
            </div>
        </TabsContent>
    );
};
