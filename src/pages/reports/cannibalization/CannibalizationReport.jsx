import { forwardRef, useEffect, useImperativeHandle, useMemo, useState, useCallback } from "react";
import { useReportStore } from "../store/useReportStore";
import { useItemTraceStore } from "@/store/useItemTraceStore";
import { useAuthStore } from "@/store/useAuthStore";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Wrench, RefreshCw, Hammer, CheckCircle, Download, FileSpreadsheet } from "lucide-react";
import { usePDFExport } from "../hooks/usePDFExport";
import { useExcelExport } from "../hooks/useExcelExport";

const TABS = [
    { key: "damaged", label: "Dañados", icon: Wrench, state: "Dañado" },
    { key: "repair", label: "Reparación", icon: RefreshCw, state: "En reparacion" },
    { key: "reconstructed", label: "Reconstruidos", icon: Hammer, state: "Reconstruido" },
    { key: "available", label: "Disponibles", icon: CheckCircle, state: null },
];

const statusBadge = (status) => {
    const colors = {
        "Dañado": "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400",
        "En reparacion": "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400",
        "Reconstruido": "bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400",
        "Disponible": "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400",
    };
    return colors[status] || "bg-gray-100 text-gray-700";
};

const formatDate = (date) => {
    if (!date) return "-";
    const d = new Date(date + "T00:00:00");
    if (isNaN(d.getTime())) return "-";
    return d.toLocaleDateString("es-ES", {
        year: "numeric", month: "2-digit", day: "2-digit",
    });
};

export const CannibalizationReport = forwardRef((_, ref) => {
    const { getAllData, loadAllData } = useReportStore();
    const { itemTraces, loadItemTraces } = useItemTraceStore();
    const { user } = useAuthStore();
    const { exportToPDF } = usePDFExport();
    const { exportToExcel } = useExcelExport();

    const [activeTab, setActiveTab] = useState("damaged");

    useEffect(() => {
        loadAllData();
        loadItemTraces(true);
    }, [loadAllData, loadItemTraces]);

    const { computers, desks, deskAccessories, components, peripherals } = getAllData();
    const isViewer = user?.role === "viewer";

    const deskComputerIds = useMemo(
        () => new Set((desks || []).map((d) => d.computerId).filter(Boolean)),
        [desks]
    );

    const traceMap = useMemo(() => {
        const map = {};
        (itemTraces || []).forEach((t) => {
            const key = `${t.itemType}::${t.itemCode}`;
            if (!map[key] || new Date(t.createdAt) > new Date(map[key].createdAt)) {
                map[key] = t;
            }
        });
        return map;
    }, [itemTraces]);

    const allItems = useMemo(() => {
        const items = [];
        const pipelineStates = new Set(["Dañado", "En reparacion", "Reconstruido"]);

        (computers || []).forEach((c) => {
            const key = `Computadoras::${c.code}`;
            const trace = traceMap[key];
            const state = c.state || "Bueno";
            const isAssigned = deskComputerIds.has(c.id);
            const status = !isAssigned && !pipelineStates.has(state) ? "Disponible" : state;
            items.push({
                id: c.id,
                code: c.code,
                serial: c.serial,
                typeLabel: "Computador",
                state,
                isAssigned,
                status,
                traceDateDamaged: trace?.dateDamaged,
                traceDateInRepair: trace?.dateInRepair,
                traceDateReinstated: trace?.dateReinstated,
                description: `${c.brand || ""} ${c.model || ""}`.trim() || c.code,
            });
        });

        (components || []).forEach((c) => {
            const key = `Componentes::${c.code}`;
            const trace = traceMap[key];
            const state = c.state || "Bueno";
            const isAssigned = Boolean(c.computerId);
            const status = !isAssigned && !pipelineStates.has(state) ? "Disponible" : state;
            items.push({
                id: c.id,
                code: c.code,
                serial: c.serial,
                typeLabel: "Componente",
                state,
                isAssigned,
                status,
                traceDateDamaged: trace?.dateDamaged,
                traceDateInRepair: trace?.dateInRepair,
                traceDateReinstated: trace?.dateReinstated,
                description: c.description || c.code,
            });
        });

        (peripherals || []).forEach((p) => {
            const key = `Periféricos::${p.code}`;
            const trace = traceMap[key];
            const state = p.state || "Bueno";
            const isAssigned = Boolean(p.computerId);
            const status = !isAssigned && !pipelineStates.has(state) ? "Disponible" : state;
            items.push({
                id: p.id,
                code: p.code,
                serial: p.serial,
                typeLabel: "Periférico",
                state,
                isAssigned,
                status,
                traceDateDamaged: trace?.dateDamaged,
                traceDateInRepair: trace?.dateInRepair,
                traceDateReinstated: trace?.dateReinstated,
                description: p.description || p.code,
            });
        });

        (deskAccessories || []).forEach((a) => {
            const key = `Acc. Escritorio::${a.code}`;
            const trace = traceMap[key];
            const state = a.state || "Bueno";
            const isAssigned = Boolean(a.deskTableId);
            const status = !isAssigned && !pipelineStates.has(state) ? "Disponible" : state;
            items.push({
                id: a.id,
                code: a.code,
                serial: a.serial,
                typeLabel: "Acc. Escritorio",
                state,
                isAssigned,
                status,
                traceDateDamaged: trace?.dateDamaged,
                traceDateInRepair: trace?.dateInRepair,
                traceDateReinstated: trace?.dateReinstated,
                description: a.description || a.code,
            });
        });

        return items;
    }, [computers, components, peripherals, deskAccessories, deskComputerIds, traceMap]);

    const getEntryDate = (item) => {
        if (activeTab === "damaged") return item.traceDateDamaged;
        if (activeTab === "repair") return item.traceDateInRepair;
        if (activeTab === "reconstructed") return item.traceDateReinstated;
        if (activeTab === "available") return item.traceDateReinstated;
        return null;
    };

    const damagedItems = useMemo(
        () => allItems.filter((i) => i.state === "Dañado"),
        [allItems]
    );
    const repairItems = useMemo(
        () => allItems.filter((i) => i.state === "En reparacion"),
        [allItems]
    );
    const reconstructedItems = useMemo(
        () => allItems.filter((i) => i.state === "Reconstruido"),
        [allItems]
    );
    const availableItems = useMemo(
        () => allItems.filter((i) => i.status === "Disponible"),
        [allItems]
    );

    const currentItems = useMemo(() => {
        switch (activeTab) {
            case "damaged": return damagedItems;
            case "repair": return repairItems;
            case "reconstructed": return reconstructedItems;
            case "available": return availableItems;
            default: return [];
        }
    }, [activeTab, damagedItems, repairItems, reconstructedItems, availableItems]);

    const getStateLabel = () => {
        const tab = TABS.find((t) => t.key === activeTab);
        return tab ? tab.label.replace(/ó/g, "o") : "";
    };

    const handleExport = useCallback(() => {
        return exportToExcel(currentItems);
    }, [currentItems, exportToExcel]);

    const handleExportPdf = useCallback(() => {
        return exportToPDF(currentItems);
    }, [currentItems, exportToPDF]);

    useImperativeHandle(ref, () => ({
        handleExportExcel: handleExport,
        handleExportPDF: handleExportPdf,
    }));

    return (
        <div className="space-y-4">
            <div className="flex items-center justify-between">
                <div className="flex items-center bg-muted rounded-lg p-0.5">
                    {TABS.map((tab) => {
                        const Icon = tab.icon;
                        const count =
                            tab.key === "damaged" ? damagedItems.length :
                            tab.key === "repair" ? repairItems.length :
                            tab.key === "reconstructed" ? reconstructedItems.length :
                            availableItems.length;

                        return (
                            <button
                                key={tab.key}
                                className={`flex items-center gap-1.5 px-3 py-1.5 text-sm rounded-md cursor-pointer transition-all ${
                                    activeTab === tab.key
                                        ? "bg-background shadow-sm font-medium text-foreground"
                                        : "text-muted-foreground hover:text-foreground"
                                }`}
                                onClick={() => setActiveTab(tab.key)}
                            >
                                <Icon className="h-4 w-4" />
                                {tab.label}
                                <Badge variant="secondary" className="ml-0.5 text-xs px-1.5">{count}</Badge>
                            </button>
                        );
                    })}
                </div>
                {!isViewer && (
                    <div className="flex items-center gap-2">
                        <Button variant="outline" size="sm" className="gap-2 cursor-pointer" onClick={handleExport}>
                            <FileSpreadsheet className="h-4 w-4" />
                            Excel
                        </Button>
                        <Button size="sm" className="gap-2 cursor-pointer" onClick={handleExportPdf}>
                            <Download className="h-4 w-4" />
                            PDF
                        </Button>
                    </div>
                )}
            </div>

            {currentItems.length === 0 ? (
                <div className="text-center py-12 text-muted-foreground">
                    <p className="text-sm">No hay items en esta categoría</p>
                </div>
            ) : (
                <div className="rounded-md border overflow-x-auto">
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead className="whitespace-nowrap">Código</TableHead>
                                <TableHead className="whitespace-nowrap">Serial</TableHead>
                                <TableHead className="whitespace-nowrap">Tipo</TableHead>
                                <TableHead className="whitespace-nowrap">Fecha de ingreso</TableHead>
                                <TableHead className="whitespace-nowrap">Estado</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {currentItems.map((item) => (
                                <TableRow key={`${item.id}-${item.typeLabel}`}>
                                    <TableCell className="font-medium whitespace-nowrap">{item.code}</TableCell>
                                    <TableCell className="whitespace-nowrap">{item.serial || "-"}</TableCell>
                                    <TableCell className="whitespace-nowrap">{item.typeLabel}</TableCell>
                                    <TableCell className="whitespace-nowrap">{formatDate(getEntryDate(item))}</TableCell>
                                    <TableCell className="whitespace-nowrap">
                                        <Badge variant="outline" className={statusBadge(getStateLabel())}>
                                            {getStateLabel()}
                                        </Badge>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </div>
            )}
        </div>
    );
});

CannibalizationReport.displayName = "CannibalizationReport";
