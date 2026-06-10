import { Input } from '@/components/ui/input';
import { Search } from 'lucide-react';

export const SearchComputerBySerial = ({ table }) => {
    return (
        <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
            <Input
                placeholder="Filtrar por código o serial..."
                value={table.getState().globalFilter ?? ''}
                onChange={(event) => table.setGlobalFilter(event.target.value)}
                className="w-[300px] pl-9"
            />
        </div>
    );
};
