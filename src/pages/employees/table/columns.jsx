import { TruncatedCell } from '@/components/table/TruncatedCell';
import { EmployeeActions } from './EmployeeActions';
import { selectColumn } from '@/components/table/selectionColumn';

export const employeeCols = [
    {
        accessorKey: 'nombres',
        header: 'Nombres',
        cell: ({ row }) => <TruncatedCell value={row.getValue('nombres')} minWidth="100px" maxWidth="150px" />,
    },
    {
        accessorKey: 'apellidos',
        header: 'Apellidos',
        cell: ({ row }) => <TruncatedCell value={row.getValue('apellidos')} minWidth="100px" maxWidth="150px" />,
    },
    {
        accessorKey: 'cedula',
        header: 'Cédula',
        cell: ({ row }) => <TruncatedCell value={row.getValue('cedula')} minWidth="100px" maxWidth="120px" />,
    },
    {
        accessorKey: 'telefono',
        header: 'Teléfono',
        cell: ({ row }) => <TruncatedCell value={row.getValue('telefono')} minWidth="100px" maxWidth="120px" />,
    },
    {
        accessorKey: 'correo',
        header: 'Correo',
        cell: ({ row }) => <TruncatedCell value={row.getValue('correo')} minWidth="120px" maxWidth="180px" />,
    },
    {
        accessorKey: 'tipoEmpleado',
        header: 'Tipo de Empleado',
        cell: ({ row }) => <TruncatedCell value={row.getValue('tipoEmpleado')} minWidth="100px" maxWidth="130px" />,
    },
    {
        accessorKey: 'estado',
        header: 'Estado',
        cell: ({ row }) => <TruncatedCell value={row.getValue('estado')} minWidth="80px" maxWidth="100px" />,
    },
    selectColumn,
    {
        id: 'actions',
        cell: ({ row }) => {
            const employee = row.original;
            return <EmployeeActions employee={employee} />;
        },
    },
];
