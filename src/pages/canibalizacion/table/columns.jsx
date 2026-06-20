import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import { TruncatedCell } from '@/components/table/TruncatedCell';
import { CannibalizacionActions } from './CannibalizacionActions';
import { selectColumn } from '@/components/table/selectionColumn';

export const cannibalizacionCols = [
    {
        id: 'donorComputer',
        header: 'Donante',
        cell: ({ row }) => {
            const donor = row.original.donorComputer;
            const val = donor ? `${donor.code} — ${donor.brand}` : 'Sin asignar';
            return <TruncatedCell value={val} minWidth="120px" maxWidth="180px" />;
        },
    },
    {
        id: 'receiverComputer',
        header: 'Receptor',
        cell: ({ row }) => {
            const receiver = row.original.receiverComputer;
            const val = receiver ? `${receiver.code} — ${receiver.brand}` : 'Sin asignar';
            return <TruncatedCell value={val} minWidth="120px" maxWidth="180px" />;
        },
    },
    {
        accessorKey: 'movementDate',
        header: 'Fecha de movimiento',
        cell: ({ row }) => {
            const date = row.getValue('movementDate');
            if (!date) return <span className="text-muted-foreground">—</span>;
            try {
                const formatted = format(new Date(date + 'T00:00:00'), 'PPP', { locale: es });
                return <span>{formatted}</span>;
            } catch {
                return <span>{date}</span>;
            }
        },
    },
    {
        accessorKey: 'createdBy',
        header: 'Registrado por',
        cell: ({ row }) => {
            const val = row.getValue('createdBy');
            return <span className="text-muted-foreground">{val || '—'}</span>;
        },
    },
    selectColumn,
    {
        id: 'actions',
        cell: ({ row }) => {
            const item = row.original;
            return <CannibalizacionActions item={item} />;
        },
    },
];
