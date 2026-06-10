import { TruncatedCell } from '@/components/table/TruncatedCell';
import { ComponentActions } from './ComponentActions';
import { ComputerCell } from './ComputerCell';
import { selectColumn } from '@/components/table/selectionColumn';

export const componentCols = [
    {
        accessorKey: 'code',
        header: 'Código',
        cell: ({ row }) => <TruncatedCell value={row.getValue('code')} charLimit={15} minWidth="80px" maxWidth="100px" />,
    },
    {
        accessorKey: 'serial',
        header: 'Serial',
        cell: ({ row }) => <TruncatedCell value={row.getValue('serial')} charLimit={15} minWidth="100px" maxWidth="150px" />,
    },
    {
        accessorKey: 'brand',
        header: 'Marca',
        cell: ({ row }) => <TruncatedCell value={row.getValue('brand')} minWidth="80px" maxWidth="120px" />,
    },
    {
        accessorKey: 'model',
        header: 'Modelo',
        cell: ({ row }) => <TruncatedCell value={row.getValue('model')} minWidth="80px" maxWidth="120px" />,
    },
    {
        accessorKey: 'type',
        header: 'Tipo',
        cell: ({ row }) => <TruncatedCell value={row.getValue('type')} minWidth="80px" maxWidth="100px" />,
    },
    {
        accessorKey: 'state',
        header: 'Estado',
    },
    {
        accessorKey: 'computerId',
        header: 'Computador',
        cell: ({ row }) => <ComputerCell computerId={row.getValue('computerId')} />,
    },
    selectColumn,
    {
        id: 'actions',
        cell: ({ row }) => {
            const component = row.original;
            return <ComponentActions component={component} />;
        },
    },
];
