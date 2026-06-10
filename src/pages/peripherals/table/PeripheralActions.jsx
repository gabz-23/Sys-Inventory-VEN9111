import { Button } from '@/components/ui/button';
import {
    DropdownMenu,
    DropdownMenuTrigger,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
} from '@/components/ui/dropdown-menu';
import { useDialogStore } from '@/store/useDialogStore';
import { useAuthStore } from '@/store/useAuthStore';
import { EllipsisVertical, Eye, Pencil, Trash } from 'lucide-react';

export const PeripheralActions = ({ peripheral }) => {
    const { openDetailsDialog, openEditDialog, openDeleteDialog } = useDialogStore();
    const { user } = useAuthStore();
    const isViewer = user?.role === 'viewer';

    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button
                    variant="ghost"
                    className="data-[state=open]:bg-muted cursor-pointer text-muted-foreground flex size-8"
                    size="icon"
                >
                    <EllipsisVertical />
                </Button>
            </DropdownMenuTrigger>

            <DropdownMenuContent align="end" className="w-52">
                <DropdownMenuLabel>Acciones</DropdownMenuLabel>
                <DropdownMenuSeparator />

                <DropdownMenuItem className="cursor-pointer flex items-center" onClick={() => openDetailsDialog(peripheral)}>
                    <Eye />
                    <span>Ver detalles</span>
                </DropdownMenuItem>

                {!isViewer && (
                    <>
                        <DropdownMenuItem className="cursor-pointer flex items-center" onClick={() => openEditDialog(peripheral)}>
                            <Pencil />
                            <span>Modificar Datos</span>
                        </DropdownMenuItem>

                        <DropdownMenuSeparator />

                        <DropdownMenuItem
                            className="cursor-pointer flex items-center text-destructive focus:text-destructive focus:bg-destructive/10"
                            onClick={() => openDeleteDialog(peripheral)}
                        >
                            <Trash className="text-red-400" />
                            <span>Eliminar</span>
                        </DropdownMenuItem>
                    </>
                )}
            </DropdownMenuContent>
        </DropdownMenu>
    );
};
