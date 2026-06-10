import { forwardRef, useEffect, useImperativeHandle, useCallback } from "react";
import { useItemTraceStore } from "@/store/useItemTraceStore";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useCannibalizationExport } from "../hooks/useCannibalizationExport";

const formatDate = (date) => {
    if (!date) return "-";
    const d = new Date(date + "T00:00:00");
    if (isNaN(d.getTime())) return "-";
    return d.toLocaleDateString("es-ES", {
        year: "numeric", month: "2-digit", day: "2-digit",
    });
};

export const TraceabilityReport = forwardRef((_, ref) => {
    const { itemTraces, loadItemTraces } = useItemTraceStore();
    const { exportToExcel, exportToPDF } = useCannibalizationExport();

    useEffect(() => {
        loadItemTraces(true);
    }, [loadItemTraces]);

    const handleExportExcel = useCallback(() => {
        return exportToExcel(itemTraces || []);
    }, [itemTraces, exportToExcel]);

    const handleExportPDF = useCallback(() => {
        return exportToPDF(itemTraces || []);
    }, [itemTraces, exportToPDF]);

    useImperativeHandle(ref, () => ({
        handleExportExcel,
        handleExportPDF,
    }));

    return (
        <div className="rounded-md border overflow-x-auto">
            <Table className="text-xs">
                <TableHeader>
                    <TableRow>
                        <TableHead className="whitespace-nowrap h-8 px-2">Tipo</TableHead>
                        <TableHead className="whitespace-nowrap h-8 px-2">Código</TableHead>
                        <TableHead className="whitespace-nowrap h-8 px-2">Descripción</TableHead>
                        <TableHead className="whitespace-nowrap h-8 px-2">Fecha mov.</TableHead>
                        <TableHead className="whitespace-nowrap h-8 px-2">Origen</TableHead>
                        <TableHead className="whitespace-nowrap h-8 px-2">Destino</TableHead>
                        <TableHead className="whitespace-nowrap h-8 px-2">Razón</TableHead>
                        <TableHead className="whitespace-nowrap h-8 px-2">Dañado</TableHead>
                        <TableHead className="whitespace-nowrap h-8 px-2">Reparac.</TableHead>
                        <TableHead className="whitespace-nowrap h-8 px-2">Reparado</TableHead>
                        <TableHead className="whitespace-nowrap h-8 px-2">Reconst.</TableHead>
                        <TableHead className="whitespace-nowrap h-8 px-2">Reg. por</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {(itemTraces || []).length === 0 ? (
                        <TableRow>
                            <TableCell colSpan={12} className="h-16 text-center text-muted-foreground text-xs">
                                No hay registros de trazabilidad
                            </TableCell>
                        </TableRow>
                    ) : (
                        (itemTraces || []).map((trace) => (
                            <TableRow key={trace.id}>
                                <TableCell className="whitespace-nowrap px-2 py-1.5">{trace.itemType || "-"}</TableCell>
                                <TableCell className="font-medium whitespace-nowrap px-2 py-1.5">{trace.itemCode}</TableCell>
                                <TableCell className="max-w-[140px] truncate px-2 py-1.5" title={trace.itemDescription || ""}>
                                    {trace.itemDescription || "-"}
                                </TableCell>
                                <TableCell className="whitespace-nowrap px-2 py-1.5">{formatDate(trace.movementDate)}</TableCell>
                                <TableCell className="whitespace-nowrap px-2 py-1.5">{trace.movedFrom || "-"}</TableCell>
                                <TableCell className="whitespace-nowrap px-2 py-1.5">{trace.movedTo || "-"}</TableCell>
                                <TableCell className="max-w-[120px] truncate px-2 py-1.5" title={trace.movementReason || ""}>
                                    {trace.movementReason || "-"}
                                </TableCell>
                                <TableCell className="whitespace-nowrap px-2 py-1.5">{formatDate(trace.dateDamaged)}</TableCell>
                                <TableCell className="whitespace-nowrap px-2 py-1.5">{formatDate(trace.dateInRepair)}</TableCell>
                                <TableCell className="whitespace-nowrap px-2 py-1.5">{formatDate(trace.dateRepaired)}</TableCell>
                                <TableCell className="whitespace-nowrap px-2 py-1.5">
                                    {trace.rebuilt ? (
                                        <Badge variant="default" className="bg-purple-600 text-[10px] px-1 py-0">Sí</Badge>
                                    ) : (
                                        <Badge variant="secondary" className="text-[10px] px-1 py-0">No</Badge>
                                    )}
                                </TableCell>
                                <TableCell className="whitespace-nowrap px-2 py-1.5">{trace.createdBy || "-"}</TableCell>
                            </TableRow>
                        ))
                    )}
                </TableBody>
            </Table>
        </div>
    );
});

TraceabilityReport.displayName = "TraceabilityReport";
