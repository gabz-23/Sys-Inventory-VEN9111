import { FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { InputRequired } from '@/components/form/InputRequired';

export const FormInput = ({ form, name, label, placeholder, required = false }) => {
    return (
        <FormField
            control={form.control}
            name={name}
            render={({ field }) => (
                <FormItem>
                    <FormLabel>
                        {label} {required && <InputRequired />}{' '}
                    </FormLabel>
                    <FormControl>
                        <Input placeholder={placeholder} {...field} />
                    </FormControl>
                    <FormMessage />
                </FormItem>
            )}
        />
    );
};
