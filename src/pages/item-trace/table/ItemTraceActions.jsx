import { EllipsisVertical, Eye, Pencil, Trash } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { useDialogStore } from '@/store/useDialogStore';
import { useAuthStore } from '@/store/useAuthStore';

export const ItemTraceActions = ({ itemTrace }) => {
    const { openDetailsDialog, openEditDialog, openDeleteDialog } = useDialogStore();
    const { user } = useAuthStore();
    const isViewer = user?.role === 'viewer';

    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="cursor-pointer" size="icon">
                    <EllipsisVertical />
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-52">
                <DropdownMenuLabel>Acciones</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem className="cursor-pointer" onClick={() => openDetailsDialog(itemTrace)}>
                    <Eye /> <span>Ver detalles</span>
                </DropdownMenuItem>
                {!isViewer && (
                    <>
                        <DropdownMenuItem className="cursor-pointer" onClick={() => openEditDialog(itemTrace)}>
                            <Pencil /> <span>Modificar Datos</span>
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem className="cursor-pointer text-destructive"
                                        onClick={() => openDeleteDialog(itemTrace)}>
                            <Trash /> <span>Eliminar</span>
                        </DropdownMenuItem>
                    </>
                )}
            </DropdownMenuContent>
        </DropdownMenu>
    );
};
