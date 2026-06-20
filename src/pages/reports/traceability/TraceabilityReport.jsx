import { useEffect, useCallback, forwardRef, useImperativeHandle } from 'react';
import * as XLSX from 'xlsx-js-style';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Loader2, X } from 'lucide-react';
import { useTraceabilityReportStore } from '@/store/useTraceabilityReportStore';

const formatDate = (date) => {
    if (!date) return '-';
    const d = new Date(date + 'T00:00:00');
    if (isNaN(d.getTime())) return '-';
    return d.toLocaleDateString('es-ES', { year: 'numeric', month: '2-digit', day: '2-digit' });
};

const MOVEMENT_BADGES = {
    cannibalization: 'bg-blue-500/10 text-blue-700 dark:text-blue-400',
    state_change: 'bg-amber-500/10 text-amber-700 dark:text-amber-400',
    assignment: 'bg-emerald-500/10 text-emerald-700 dark:text-emerald-400',
};

export const TraceabilityReport = forwardRef((_, ref) => {
    const { records, itemTypes, isLoading, filters, loadRecords, loadFilters, setFilter, clearFilters } = useTraceabilityReportStore();

    useEffect(() => {
        loadFilters();
    }, [loadFilters]);

    useEffect(() => {
        const activeFilters = {};
        if (filters.movementTypes?.length) activeFilters.movementTypes = filters.movementTypes;
        if (filters.dateStart) activeFilters.dateStart = filters.dateStart;
        if (filters.dateEnd) activeFilters.dateEnd = filters.dateEnd;
        if (filters.itemTypes?.length) activeFilters.itemTypes = filters.itemTypes;
        if (filters.users?.length) activeFilters.users = filters.users;
        loadRecords(Object.keys(activeFilters).length > 0 ? activeFilters : {});
    }, [loadRecords, filters]);

    const handleExportExcel = useCallback(() => {
        try {
            const workbook = XLSX.utils.book_new();
            const headers = ['Fecha', 'Tipo Movimiento', 'Código', 'Descripción', 'Registrado por'];
            const tableData = [headers];
            records.forEach((r) => {
                tableData.push([
                    formatDate(r.date), r.movementTypeLabel, r.itemCode,
                    r.itemDescription, r.createdBy,
                ]);
            });
            const ws = XLSX.utils.aoa_to_sheet(tableData);
            ws['!cols'] = [{ wch: 14 }, { wch: 18 }, { wch: 14 }, { wch: 30 }, { wch: 18 }];
            headers.forEach((_, col) => {
                const addr = XLSX.utils.encode_cell({ r: 0, c: col });
                if (ws[addr]) ws[addr].s = { fill: { fgColor: { rgb: '424242' } }, font: { bold: true, color: { rgb: 'FFFFFF' } } };
            });
            XLSX.utils.book_append_sheet(workbook, ws, 'Trazabilidad');
            const id = Math.random().toString(36).substring(2, 8).toUpperCase();
            const name = `trazabilidad-${new Date().toISOString().split('T')[0]}-${id}.xlsx`;
            XLSX.writeFile(workbook, name);
            return name;
        } catch (error) {
            console.error('Error al exportar Excel:', error);
            return null;
        }
    }, [records]);

    const handleExportPDF = useCallback(() => {
        try {
            const doc = new jsPDF();
            const pw = doc.internal.pageSize.getWidth();
            doc.setFontSize(16);
            doc.setFont('helvetica', 'bold');
            doc.text('REPORTE DE TRAZABILIDAD', pw / 2, 25, { align: 'center' });
            doc.setDrawColor(200, 200, 200);
            doc.line(20, 30, pw - 20, 30);

            const tableData = records.map((r) => [
                formatDate(r.date), r.movementTypeLabel, r.itemCode, r.createdBy,
            ]);

            autoTable(doc, {
                startY: 38,
                head: [['Fecha', 'Tipo', 'Código', 'Registrado por']],
                body: tableData,
                theme: 'striped',
                headStyles: { fillColor: [66, 66, 66], textColor: 255, fontStyle: 'bold' },
                styles: { fontSize: 7, cellPadding: 1.5 },
            });

            const pages = doc.internal.getNumberOfPages();
            for (let i = 1; i <= pages; i++) {
                doc.setPage(i);
                doc.setFontSize(8);
                doc.setTextColor(120, 120, 120);
                doc.text(`Página ${i} de ${pages}`, pw / 2, doc.internal.pageSize.getHeight() - 8, { align: 'center' });
            }

            const id = Math.random().toString(36).substring(2, 8).toUpperCase();
            const name = `trazabilidad-${new Date().toISOString().split('T')[0]}-${id}.pdf`;
            doc.save(name);
            return name;
        } catch (error) {
            console.error('Error al exportar PDF:', error);
            return null;
        }
    }, [records]);

    useImperativeHandle(ref, () => ({ handleExportExcel, handleExportPDF }));

    const hasActiveFilters = filters.movementTypes?.length || filters.dateStart || filters.dateEnd || filters.itemTypes?.length || filters.users?.length;

    return (
        <div className="space-y-4">
            {/* Filters */}
            <div className="flex flex-wrap items-center gap-2 p-3 rounded-lg border bg-muted/30">
                <Select
                    value={filters.movementTypes?.[0] || 'all'}
                    onValueChange={(v) => setFilter('movementTypes', v === 'all' ? [] : [v])}
                >
                    <SelectTrigger className="w-[160px] h-8 text-xs">
                        <SelectValue placeholder="Todo movimiento" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="all">Todo movimiento</SelectItem>
                        <SelectItem value="cannibalization">Canibalización</SelectItem>
                        <SelectItem value="state_change">Cambio de estado</SelectItem>
                        <SelectItem value="assignment">Asignación</SelectItem>
                    </SelectContent>
                </Select>

                {itemTypes.length > 0 && (
                    <Select
                        value={filters.itemTypes?.[0] || 'all'}
                        onValueChange={(v) => setFilter('itemTypes', v === 'all' ? [] : [v])}
                    >
                        <SelectTrigger className="w-[160px] h-8 text-xs">
                            <SelectValue placeholder="Todo tipo" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="all">Todo tipo</SelectItem>
                            {itemTypes.map((t) => (
                                <SelectItem key={t} value={t}>{t}</SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                )}



                <div className="flex items-center gap-1.5">
                    <label className="text-xs text-muted-foreground whitespace-nowrap">Desde:</label>
                    <input
                        type="date"
                        value={filters.dateStart || ''}
                        onChange={(e) => setFilter('dateStart', e.target.value || null)}
                        className="h-8 rounded-md border px-2 text-xs bg-background"
                    />
                </div>
                <div className="flex items-center gap-1.5">
                    <label className="text-xs text-muted-foreground whitespace-nowrap">Hasta:</label>
                    <input
                        type="date"
                        value={filters.dateEnd || ''}
                        onChange={(e) => setFilter('dateEnd', e.target.value || null)}
                        className="h-8 rounded-md border px-2 text-xs bg-background"
                    />
                </div>

                {hasActiveFilters && (
                    <Button variant="ghost" size="sm" className="h-8 text-xs cursor-pointer gap-1" onClick={clearFilters}>
                        <X className="h-3 w-3" />
                        Limpiar
                    </Button>
                )}
            </div>

            {/* Counter */}
            <p className="text-sm text-muted-foreground">
                {isLoading ? 'Cargando...' : `${records.length} registro(s)`}
            </p>

            {/* Table */}
            {isLoading ? (
                <div className="flex items-center justify-center h-32 text-sm text-muted-foreground">
                    <Loader2 className="h-4 w-4 animate-spin mr-2" /> Cargando...
                </div>
            ) : records.length === 0 ? (
                <div className="flex items-center justify-center h-32 text-sm text-muted-foreground">
                    No hay registros de trazabilidad
                </div>
            ) : (
                <div className="rounded-md border overflow-x-auto">
                    <Table className="text-xs">
                        <TableHeader>
                            <TableRow>
                                <TableHead className="whitespace-nowrap h-8 px-2">Fecha</TableHead>
                                <TableHead className="whitespace-nowrap h-8 px-2">Tipo</TableHead>
                                <TableHead className="whitespace-nowrap h-8 px-2">Código</TableHead>
                                <TableHead className="whitespace-nowrap h-8 px-2">Descripción</TableHead>
                                <TableHead className="whitespace-nowrap h-8 px-2">Registrado por</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {records.map((r) => (
                                <TableRow key={r.id}>
                                    <TableCell className="whitespace-nowrap px-2 py-1.5">{formatDate(r.date)}</TableCell>
                                    <TableCell className="whitespace-nowrap px-2 py-1.5">
                                        <span className={`inline-block px-2 py-0.5 rounded text-[10px] font-medium ${MOVEMENT_BADGES[r.movementType] || ''}`}>
                                            {r.movementTypeLabel}
                                        </span>
                                    </TableCell>
                                    <TableCell className="font-medium whitespace-nowrap px-2 py-1.5">{r.itemCode}</TableCell>
                                    <TableCell className="max-w-[140px] truncate px-2 py-1.5" title={r.itemDescription}>{r.itemDescription}</TableCell>
                                    <TableCell className="whitespace-nowrap px-2 py-1.5">{r.createdBy}</TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </div>
            )}
        </div>
    );
});

TraceabilityReport.displayName = 'TraceabilityReport';
