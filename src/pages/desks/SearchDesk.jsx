import { Input } from '@/components/ui/input';
import { Search } from 'lucide-react';

export const SearchDeskByCode = ({ table }) => {
    return (
        <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
            <Input
                placeholder="Buscar por código de escritorio"
                value={table.getColumn('code').getFilterValue() || ''}
                onChange={(event) => table.getColumn('code').setFilterValue(event.target.value)}
                className="w-[300px] pl-9"
            />
        </div>
    );
};
