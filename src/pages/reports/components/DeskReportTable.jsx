import { useMemo } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { useReportStore } from '../store/useReportStore';

export const DeskReportTable = () => {
    const { getAllData } = useReportStore();
    const { computers, desks } = getAllData();

    const deskRows = useMemo(() => {
        const desksWithComputer = desks.filter((d) => d.computerId || d.computer);
        let unidadCounter = 0;
        return desksWithComputer.map((desk) => {
            unidadCounter++;

            const computerCode = desk.computer || desk.computerId;
            const computer = computers.find(
                (c) => c.code === computerCode || c.id === desk.computerId
            );

            let pcText = computer ? computer.code || '' : '';
            if (computer) {
                const comps = computer.components || [];
                if (comps.length > 0) {
                    const specParts = comps.map((c) => {
                        const name = c.type || '';
                        const specs = c.specs || '';
                        const qty = c.quantity ? ` x${c.quantity}` : '';
                        return `${name}${specs ? `: ${specs}` : ''}${qty}`;
                    });
                    pcText += ` (${specParts.join(', ')})`;
                }
            }

            const accLines = [];
            if (computer) {
                const perifs = computer.peripherals || [];
                perifs.forEach((p) => {
                    const desc = p.description || p.code || '';
                    if (desc) accLines.push(desc.toUpperCase());
                });
            }
            const accessories = desk.accessories || [];
            accessories.forEach((a) => {
                const desc = a.description || a.type || '';
                if (desc) accLines.push(desc.toUpperCase());
            });

            const empName = desk.employeeName
                || (desk.employee?.nombres && desk.employee?.apellidos
                    ? `${desk.employee.nombres} ${desk.employee.apellidos}`
                    : '')
                || '-';

            return {
                unidad: unidadCounter,
                escritorio: desk.code || '',
                responsable: empName,
                pc: pcText,
                accesorios: accLines.join(', ') || ' - ',
            };
        });
    }, [computers, desks]);

    return (
        <Card>
            <CardHeader>
                <CardTitle>Reporte de Inventario por Escritorio</CardTitle>
                <CardDescription>
                    {deskRows.length > 0
                        ? `Total de escritorios con computador: ${deskRows.length}`
                        : 'No hay escritorios con computador asignado.'}
                </CardDescription>
            </CardHeader>
            <CardContent>
                {deskRows.length > 0 ? (
                    <div className="rounded-md border">
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead className="w-12 text-center">UNIDAD</TableHead>
                                    <TableHead>ESCRITORIO</TableHead>
                                    <TableHead>RESPONSABLE</TableHead>
                                    <TableHead>PC</TableHead>
                                    <TableHead>ACCESORIOS</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {deskRows.map((row) => (
                                    <TableRow key={row.unidad}>
                                        <TableCell className="text-center">{row.unidad}</TableCell>
                                        <TableCell className="font-medium">{row.escritorio}</TableCell>
                                        <TableCell>{row.responsable}</TableCell>
                                        <TableCell className="whitespace-pre-line">{row.pc}</TableCell>
                                        <TableCell className="whitespace-pre-line">{row.accesorios}</TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </div>
                ) : (
                    <div className="flex flex-col items-center justify-center h-24">
                        <p className="text-sm text-muted-foreground">No hay escritorios con computador asignado.</p>
                    </div>
                )}
            </CardContent>
        </Card>
    );
};
