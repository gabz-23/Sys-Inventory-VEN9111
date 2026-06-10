import { TruncatedCell } from '@/components/table/TruncatedCell';
import { DeskActions } from './DeskActions';
import { selectColumn } from '@/components/table/selectionColumn';

const capitalize = (str) => str ? str.charAt(0).toUpperCase() + str.slice(1).toLowerCase() : '';

const accCell = (row, key) => {
    const item = row.getValue(key);
    if (typeof item === 'object' && item) {
        return <TruncatedCell value={capitalize(item.type)} minWidth="80px" maxWidth="100px" />;
    }
    return <TruncatedCell value="Sin asignar" minWidth="80px" maxWidth="100px" />;
};

export const deskCols = [
    {
        accessorKey: 'code',
        header: 'Código',
        cell: ({ row }) => <TruncatedCell value={row.getValue('code')} minWidth="80px" maxWidth="100px" />,
    },
    {
        accessorKey: 'employeeName',
        header: 'Empleado Asignado',
        cell: ({ row }) => <TruncatedCell value={row.getValue('employeeName')} minWidth="100px" maxWidth="150px" />,
        filterFn: (row, id, filterValue) => {
            if (!filterValue || filterValue.length === 0) return true;
            const employee = row.getValue(id);

            const hasUnassigned = filterValue.includes('Sin asignar');
            const hasAssigned = filterValue.includes('Asignado');

            if (hasUnassigned && hasAssigned) return true;
            if (hasUnassigned) return !employee || employee === null;
            if (hasAssigned) return !!employee && employee !== null;

            return false;
        },
    },
    {
        accessorKey: 'computer',
        header: 'Computador',
        cell: ({ row }) => {
            const computerCode = row.getValue('computer');
            return <TruncatedCell value={computerCode} minWidth="80px" maxWidth="100px" />;
        },
        filterFn: (row, id, filterValue) => {
            if (!filterValue || filterValue.length === 0) return true;
            const computer = row.getValue(id);

            const hasUnassigned = filterValue.includes('Sin asignar');
            const hasAssigned = filterValue.includes('Asignado');

            if (hasUnassigned && hasAssigned) return true;
            if (hasUnassigned) return !computer || computer === null;
            if (hasAssigned) return !!computer && computer !== null;

            return false;
        },
    },
    {
        accessorKey: 'chair',
        header: 'Silla',
        cell: ({ row }) => accCell(row, 'chair'),
    },
    {
        accessorKey: 'lamp',
        header: 'Lámpara',
        cell: ({ row }) => accCell(row, 'lamp'),
    },
    {
        accessorKey: 'bin',
        header: 'Papelera',
        cell: ({ row }) => accCell(row, 'bin'),
    },
    {
        accessorKey: 'archive',
        header: 'Archivero',
        cell: ({ row }) => accCell(row, 'archive'),
    },
    {
        accessorKey: 'phone',
        header: 'Teléfono',
        cell: ({ row }) => accCell(row, 'phone'),
    },

    selectColumn,
    {
        id: 'actions',
        cell: ({ row }) => {
            const desk = row.original;
            return <DeskActions desk={desk} />;
        },
    },
];
