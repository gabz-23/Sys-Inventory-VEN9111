export const selectColumn = {
    id: 'select',
    header: ({ table }) => (
        <input
            type="checkbox"
            className="size-4 cursor-pointer rounded border-gray-300 text-primary focus:ring-primary"
            checked={table.getIsAllPageRowsSelected()}
            onChange={(e) => table.toggleAllPageRowsSelected(!!e.target.checked)}
            aria-label="Seleccionar todos"
        />
    ),
    cell: ({ row }) => (
        <input
            type="checkbox"
            className="size-4 cursor-pointer rounded border-gray-300 text-primary focus:ring-primary"
            checked={row.getIsSelected()}
            onChange={(e) => row.toggleSelected(!!e.target.checked)}
            aria-label="Seleccionar fila"
        />
    ),
    enableSorting: false,
    enableHiding: false,
};