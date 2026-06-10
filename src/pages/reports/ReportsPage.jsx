import { useState, useEffect, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Download, FileSpreadsheet, CheckCircle } from 'lucide-react';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';
import { useReportStore } from './store/useReportStore';
import { useReportData } from './hooks/useReportData';
import { usePDFExport } from './hooks/usePDFExport';
import { useExcelExport } from './hooks/useExcelExport';
import { useDeskReportExport } from './hooks/useDeskReportExport';
import { ReportFilters } from './components/ReportFilters';
import { ReportTable } from './components/ReportTable';
import { DeskReportTable } from './components/DeskReportTable';
import { CannibalizationReport } from './cannibalization/CannibalizationReport';
import { TraceabilityReport } from './cannibalization/TraceabilityReport';
import { useAuthStore } from '@/store/useAuthStore';

const DESCRIPTIONS = {
    general: 'Utilice los filtros para personalizar la vista del inventario',
    desks: 'Vista del inventario organizado por escritorio',
    cannibalization: 'Gestión del flujo de canibalización: seguimiento de items dañados, en reparación, reconstruidos y disponibles',
    traceability: 'Historial completo de movimientos y cambios de estado de todos los items',
};

export const ReportsPage = () => {
    const [dateRange, setDateRange] = useState([]);
    const [itemType, setItemType] = useState([]);
    const [status, setStatus] = useState([]);
    const [assignment, setAssignment] = useState('all');
    const [category, setCategory] = useState([]);
    const [sortBy, setSortBy] = useState('date');
    const [reportType, setReportType] = useState('general');
    const [successFileName, setSuccessFileName] = useState(null);
    const [successDialogOpen, setSuccessDialogOpen] = useState(false);

    const { loadAllData } = useReportStore();

    useEffect(() => {
        loadAllData();
    }, [loadAllData]);

    const categories = [];

    const filters = { dateRange, itemType, status, assignment, category, sortBy };
    const { filteredItems } = useReportData(filters);

    const { exportToPDF } = usePDFExport();
    const { exportToExcel, exportDeskToExcel } = useExcelExport();
    const { exportDeskReport } = useDeskReportExport();

    const cannibalizationRef = useRef(null);
    const traceabilityRef = useRef(null);

    const { user } = useAuthStore();
    const isViewer = user?.role === 'viewer';

    const handleFilterChange = (filterName, value) => {
        switch (filterName) {
            case 'dateRange':
                setDateRange(value);
                break;
            case 'itemType':
                setItemType(value);
                break;
            case 'status':
                setStatus(value);
                break;
            case 'assignment':
                setAssignment(value);
                break;
            case 'category':
                setCategory(value);
                break;
            case 'sortBy':
                setSortBy(value);
                break;
            default:
                break;
        }
    };

    const handleClearFilters = () => {
        setDateRange([]);
        setItemType([]);
        setStatus([]);
        setAssignment('all');
        setCategory([]);
        setSortBy('date');
    };

    const handleExportPDF = async () => {
        let fileName;
        if (reportType === 'desks') {
            fileName = await exportDeskReport();
        } else if (reportType === 'cannibalization') {
            fileName = cannibalizationRef.current?.handleExportPDF();
        } else if (reportType === 'traceability') {
            fileName = traceabilityRef.current?.handleExportPDF();
        } else {
            fileName = await exportToPDF(filteredItems);
        }
        if (fileName) {
            setSuccessFileName(fileName);
            setSuccessDialogOpen(true);
        }
    };

    const handleExportExcel = async () => {
        let fileName;
        if (reportType === 'desks') {
            fileName = await exportDeskToExcel();
        } else if (reportType === 'cannibalization') {
            fileName = cannibalizationRef.current?.handleExportExcel();
        } else if (reportType === 'traceability') {
            fileName = traceabilityRef.current?.handleExportExcel();
        } else {
            fileName = exportToExcel(filteredItems);
        }
        if (fileName) {
            setSuccessFileName(fileName);
            setSuccessDialogOpen(true);
        }
    };

    return (
        <div className="space-y-6">
            <div>
                <h2 className="text-3xl font-bold text-foreground">Reportes Personalizados</h2>
                <p className="mt-2 text-muted-foreground">
                    {DESCRIPTIONS[reportType] || DESCRIPTIONS.general}
                </p>
            </div>

            <div className="flex items-center justify-between">
                <div className="flex items-center bg-muted rounded-lg p-0.5">
                    <button
                        className={`px-3 py-1.5 text-sm rounded-md cursor-pointer transition-all ${
                            reportType === 'general'
                                ? 'bg-background shadow-sm font-medium text-foreground'
                                : 'text-muted-foreground hover:text-foreground'
                        }`}
                        onClick={() => setReportType('general')}
                    >
                        General
                    </button>
                    <button
                        className={`px-3 py-1.5 text-sm rounded-md cursor-pointer transition-all ${
                            reportType === 'desks'
                                ? 'bg-background shadow-sm font-medium text-foreground'
                                : 'text-muted-foreground hover:text-foreground'
                        }`}
                        onClick={() => setReportType('desks')}
                    >
                        Escritorios
                    </button>
                    <button
                        className={`px-3 py-1.5 text-sm rounded-md cursor-pointer transition-all ${
                            reportType === 'cannibalization'
                                ? 'bg-background shadow-sm font-medium text-foreground'
                                : 'text-muted-foreground hover:text-foreground'
                        }`}
                        onClick={() => setReportType('cannibalization')}
                    >
                        Canibalización
                    </button>
                    <button
                        className={`px-3 py-1.5 text-sm rounded-md cursor-pointer transition-all ${
                            reportType === 'traceability'
                                ? 'bg-background shadow-sm font-medium text-foreground'
                                : 'text-muted-foreground hover:text-foreground'
                        }`}
                        onClick={() => setReportType('traceability')}
                    >
                        Trazabilidad
                    </button>
                </div>
                {!isViewer && (
                    <div className="flex items-center gap-2">
                        <Button variant="outline" size="sm" className="gap-2 cursor-pointer" onClick={handleExportExcel}>
                            <FileSpreadsheet className="h-4 w-4" />
                            Exportar Excel
                        </Button>
                        <Button size="sm" className="gap-2 cursor-pointer" onClick={handleExportPDF}>
                            <Download className="h-4 w-4" />
                            Exportar PDF
                        </Button>
                    </div>
                )}
            </div>

            <p className="text-sm text-muted-foreground -mt-4">
                {DESCRIPTIONS[reportType] || DESCRIPTIONS.general}
            </p>

            {reportType === 'general' && (
                <>
                    <ReportFilters
                        filters={filters}
                        onFilterChange={handleFilterChange}
                        onClearFilters={handleClearFilters}
                        categories={categories}
                    />

                    <ReportTable filteredItems={filteredItems} />
                </>
            )}

            {reportType === 'desks' && <DeskReportTable />}

            {reportType === 'cannibalization' && <CannibalizationReport ref={cannibalizationRef} />}

            {reportType === 'traceability' && <TraceabilityReport ref={traceabilityRef} />}

            <Dialog open={successDialogOpen} onOpenChange={setSuccessDialogOpen}>
                <DialogContent className="sm:max-w-md">
                    <DialogHeader>
                        <div className="flex items-center gap-3">
                            <CheckCircle className="h-6 w-6 text-green-500" />
                            <DialogTitle>Reporte generado exitosamente</DialogTitle>
                        </div>
                        <DialogDescription className="pt-3">
                            El archivo <span className="font-medium text-foreground">{successFileName}</span> se ha
                            descargado correctamente.
                        </DialogDescription>
                    </DialogHeader>
                </DialogContent>
            </Dialog>
        </div>
    );
};
