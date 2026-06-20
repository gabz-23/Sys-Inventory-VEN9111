import { forwardRef, useImperativeHandle, useMemo, useCallback } from "react";
import { useReportStore } from "../store/useReportStore";
import { useAuthStore } from "@/store/useAuthStore";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Download, FileSpreadsheet, ArrowRight } from "lucide-react";
import { useCannibalizationExport } from "../hooks/useCannibalizationExport";
import { format } from "date-fns";
import { es } from "date-fns/locale";

const formatDate = (date) => {
    if (!date) return "—";
    try {
        return format(new Date(date + "T00:00:00"), "PPP", { locale: es });
    } catch {
        return date;
    }
};

export const CannibalizationReport = forwardRef((_, ref) => {
    const { getAllData } = useReportStore();
    const { user } = useAuthStore();
    const { exportToExcel, exportToPDF } = useCannibalizationExport();
    const isViewer = user?.role === "viewer";

    const { movements } = getAllData();

    const flatItems = useMemo(() => {
        const items = [];
        (movements || []).forEach((m) => {
            const donor = m.donorComputer
                ? `${m.donorComputer.code} — ${m.donorComputer.brand}`
                : "Sin asignar";
            const receiver = m.receiverComputer
                ? `${m.receiverComputer.code} — ${m.receiverComputer.brand}`
                : "Sin asignar";
            const itemList = m.items || [];
            itemList.forEach((item) => {
                items.push({
                    ...item,
                    movementDate: m.movementDate,
                    donorComputer: donor,
                    receiverComputer: receiver,
                    observations: m.observations,
                    createdBy: m.createdBy,
                });
            });
            if (itemList.length === 0) {
                items.push({
                    itemCode: "—",
                    itemDescription: "Sin ítems",
                    itemType: "—",
                    movementDate: m.movementDate,
                    donorComputer: donor,
                    receiverComputer: receiver,
                    observations: m.observations,
                    createdBy: m.createdBy,
                });
            }
        });
        return items;
    }, [movements]);

    const handleExportExcel = useCallback(() => {
        return exportToExcel(flatItems);
    }, [flatItems, exportToExcel]);

    const handleExportPDF = useCallback(() => {
        return exportToPDF(flatItems);
    }, [flatItems, exportToPDF]);

    useImperativeHandle(ref, () => ({
        handleExportExcel,
        handleExportPDF,
    }));

    return (
        <div className="space-y-4">
            <div className="flex items-center justify-between">
                <p className="text-sm text-muted-foreground">
                    {movements.length} movimiento(s) registrado(s)
                </p>
                {!isViewer && (
                    <div className="flex items-center gap-2">
                        <Button variant="outline" size="sm" className="gap-2 cursor-pointer" onClick={handleExportExcel}>
                            <FileSpreadsheet className="h-4 w-4" />
                            Excel
                        </Button>
                        <Button size="sm" className="gap-2 cursor-pointer" onClick={handleExportPDF}>
                            <Download className="h-4 w-4" />
                            PDF
                        </Button>
                    </div>
                )}
            </div>

            {movements.length === 0 ? (
                <div className="text-center py-12 text-muted-foreground">
                    <p className="text-sm">No hay movimientos registrados</p>
                </div>
            ) : (
                <div className="rounded-md border overflow-x-auto">
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead className="whitespace-nowrap">Donante</TableHead>
                                <TableHead className="whitespace-nowrap w-10"></TableHead>
                                <TableHead className="whitespace-nowrap">Receptor</TableHead>
                                <TableHead className="whitespace-nowrap">Fecha</TableHead>
                                <TableHead className="whitespace-nowrap">Items</TableHead>
                                <TableHead className="whitespace-nowrap">Registrado por</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {movements.map((m) => {
                                const donor = m.donorComputer
                                    ? `${m.donorComputer.code} — ${m.donorComputer.brand}`
                                    : "Sin asignar";
                                const receiver = m.receiverComputer
                                    ? `${m.receiverComputer.code} — ${m.receiverComputer.brand}`
                                    : "Sin asignar";
                                const itemList = m.items || [];
                                return (
                                    <TableRow key={m.id}>
                                        <TableCell className="font-medium whitespace-nowrap">{donor}</TableCell>
                                        <TableCell className="text-muted-foreground px-1">
                                            <ArrowRight className="h-4 w-4" />
                                        </TableCell>
                                        <TableCell className="font-medium whitespace-nowrap">{receiver}</TableCell>
                                        <TableCell className="whitespace-nowrap">{formatDate(m.movementDate)}</TableCell>
                                        <TableCell className="whitespace-nowrap">
                                            {itemList.length} ítem(s)
                                        </TableCell>
                                        <TableCell className="whitespace-nowrap text-muted-foreground">
                                            {m.createdBy || "—"}
                                        </TableCell>
                                    </TableRow>
                                );
                            })}
                        </TableBody>
                    </Table>
                </div>
            )}
        </div>
    );
});

CannibalizationReport.displayName = "CannibalizationReport";