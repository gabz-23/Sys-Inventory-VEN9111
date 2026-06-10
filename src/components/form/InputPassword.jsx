import { EyeIcon, EyeOffIcon } from 'lucide-react';
import { FormItem, FormLabel, FormControl, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { useState } from 'react';

export const InputPassword = ({ field, isLoading, label }) => {
    const [type, setType] = useState('password');
    return (
        <FormItem className="relative flex flex-col gap-1">
            <FormLabel>{label}</FormLabel>
            <FormControl>
                <Input type={type} placeholder="••••••••" disabled={isLoading} {...field} />
            </FormControl>
            <div>
                {type === 'password' ? (
                    <EyeIcon
                        className="absolute right-3 top-9 -translate-y-1/2 transform text-muted-foreground cursor-pointer size-5"
                        onClick={() => setType('text')}
                    />
                ) : (
                    <EyeOffIcon
                        className="absolute right-3 top-9 -translate-y-1/2 transform text-muted-foreground cursor-pointer size-5"
                        onClick={() => setType('password')}
                    />
                )}
                <FormMessage />
            </div>
        </FormItem>
    );
};
