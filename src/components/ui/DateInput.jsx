import { X } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { createDateChangeHandler } from '@/lib/dateUtils';

export const DateInput = ({ field, ...props }) => {
    const handleChange = createDateChangeHandler(field.onChange);

    const handleClear = () => {
        field.onChange('');
    };

    return (
        <div className="relative">
            <Input
                type="date"
                value={field.value || ''}
                onChange={handleChange}
                onBlur={field.onBlur}
                name={field.name}
                ref={field.ref}
                {...props}
            />
            {field.value && (
                <button
                    type="button"
                    onClick={handleClear}
                    className="absolute right-8 top-1/2 -translate-y-1/2 cursor-pointer text-muted-foreground hover:text-foreground"
                    tabIndex={-1}
                >
                    <X className="h-4 w-4" />
                </button>
            )}
        </div>
    );
};
