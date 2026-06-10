import { flexRender } from '@tanstack/react-table';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { BadgeStatus } from './BadgeStatus';
import { Inbox, Loader } from 'lucide-react';

export const DataTable = ({ table, columns, isLoading }) => {
    return (
        <div className="rounded-md border overflow-hidden">
            <div className="overflow-auto relative" style={{ height: '336px' }}>
                <Table>
                    <TableHeader className="bg-gray-100">
                        {table.getHeaderGroups().map((headerGroup) => (
                            <TableRow key={headerGroup.id}>
                                {headerGroup.headers.map((header) => (
                                    <TableHead key={header.id} className="text-black/60 font-normal">
                                        {header.isPlaceholder
                                            ? null
                                            : flexRender(header.column.columnDef.header, header.getContext())}
                                    </TableHead>
                                ))}
                            </TableRow>
                        ))}
                    </TableHeader>
                    <TableBody className="relative">
                        {isLoading ? (
                            <TableRow>
                                <TableCell colSpan={columns.length} className="text-zinc-800 h-[250px]">
                                    <div className="flex flex-col items-center">
                                        <Loader className="animate-spin transition-all duration-300" />
                                        <span>Cargando</span>
                                    </div>
                                </TableCell>
                            </TableRow>
                        ) : table.getRowModel().rows.length ? (
                            table.getRowModel().rows.map((row) => (
                                <TableRow key={row.id} data-state={row.getIsSelected() && 'selected'}>
                                    {row.getVisibleCells().map((cell) => (
                                        <TableCell key={cell.id} className="font-light text-zinc-800">
                                            {cell.column.columnDef.accessorKey === 'state' ? (
                                                <BadgeStatus cell={cell} />
                                            ) : (
                                                flexRender(cell.column.columnDef.cell, cell.getContext())
                                            )}
                                        </TableCell>
                                    ))}
                                </TableRow>
                            ))
                        ) : (
                            <TableRow>
                                <TableCell colSpan={columns.length} className="text-zinc-800 h-[250px]">
                                    <div className="flex flex-col items-center">
                                        <Inbox className="w-10 h-10 text-zinc-400 mb-3" />
                                        <span className="text-zinc-600">No hay datos disponibles para mostrar</span>
                                    </div>
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </div>
        </div>
    );
};
