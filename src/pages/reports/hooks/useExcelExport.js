import * as XLSX from 'xlsx-js-style';
import { useReportStore } from '../store/useReportStore';

/**
 * Hook personalizado para exportar reportes a Excel.
 *
 * Genera un archivo Excel con la tabla de items filtrados.
 * Incluye headers con color para mejor visualización.
 *
 */
export const useExcelExport = () => {
    /**
     * Genera y descarga un archivo Excel con el reporte de inventario.
     *
     * El Excel incluye:
     * - Una sola hoja con la tabla de items filtrados
     * - Headers con fondo de color para mejor visualización
     * - Formato profesional con anchos de columna optimizados
     */
    const exportToExcel = (filteredItems) => {
        try {
            const workbook = XLSX.utils.book_new();

            // Encabezados de la tabla
            const headers = ['Código', 'Tipo', 'Descripción', 'Estado', 'Categoría', 'Fecha'];
            const tableData = [headers];

            // Agregar datos de items
            filteredItems.forEach((item) => {
                tableData.push([
                    item.code,
                    item.type,
                    item.description,
                    item.status,
                    item.category,
                    new Date(item.date).toLocaleDateString('es-ES', {
                        year: 'numeric',
                        month: '2-digit',
                        day: '2-digit',
                    }),
                ]);
            });

            // Crear hoja de trabajo
            const worksheet = XLSX.utils.aoa_to_sheet(tableData);

            // Configurar anchos de columna
            worksheet['!cols'] = [
                { wch: 15 }, // Código
                { wch: 15 }, // Tipo
                { wch: 40 }, // Descripción
                { wch: 15 }, // Estado
                { wch: 20 }, // Categoría
                { wch: 12 }, // Fecha
            ];

            // Aplicar estilos al header (fila 1)
            const headerStyle = {
                fill: {
                    fgColor: { rgb: '424242' }, // Gris oscuro
                },
                font: {
                    bold: true,
                    color: { rgb: 'FFFFFF' }, // Texto blanco
                    sz: 11,
                },
                alignment: {
                    horizontal: 'center',
                    vertical: 'center',
                },
                border: {
                    top: { style: 'thin', color: { rgb: '000000' } },
                    bottom: { style: 'thin', color: { rgb: '000000' } },
                    left: { style: 'thin', color: { rgb: '000000' } },
                    right: { style: 'thin', color: { rgb: '000000' } },
                },
            };

            // Aplicar estilos a cada celda del header (primera fila)
            headers.forEach((_, colIndex) => {
                const cellAddress = XLSX.utils.encode_cell({ r: 0, c: colIndex });
                // Las celdas ya existen después de aoa_to_sheet, solo aplicar estilos
                if (worksheet[cellAddress]) {
                    worksheet[cellAddress].s = headerStyle;
                }
            });

            // Agregar hoja al workbook
            XLSX.utils.book_append_sheet(workbook, worksheet, 'Reporte de Inventario');

            // Generar ID aleatorio para el nombre del archivo
            const randomId = Math.random().toString(36).substring(2, 8).toUpperCase();
            
            // Generar y descargar archivo
            const fileName = `reporte-inventario-${new Date().toISOString().split('T')[0]}-${randomId}.xlsx`;
            XLSX.writeFile(workbook, fileName);
            return fileName;
        } catch (error) {
            console.error('Error al generar Excel:', error);
            alert('Error al generar el archivo Excel. Por favor, intente nuevamente.');
            return null;
        }
    };

    /**
     * Genera y descarga un archivo Excel con el reporte de escritorios.
     *
     * El Excel incluye:
     * - Una sola hoja con la tabla de escritorios
     * - Headers con fondo de color
     * - Formato profesional con anchos de columna optimizados
     */
    const exportDeskToExcel = () => {
        try {
            const { getAllData } = useReportStore.getState();
            const { computers, desks } = getAllData();

            const workbook = XLSX.utils.book_new();

            const headers = ['UNIDAD', 'ESCRITORIO', 'RESPONSABLE', 'PC', 'ACCESORIOS'];
            const tableData = [headers];

            const desksWithComputer = desks.filter((d) => d.computerId || d.computer);
            let unidadCounter = 0;

            desksWithComputer.forEach((desk) => {
                unidadCounter++;

                const computerCode = desk.computer || desk.computerId;
                const computer = computers.find(
                    (c) => c.code === computerCode || c.id === desk.computerId
                );

                let pcText = computer ? (computer.code || '') : '';
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

                // ACCESORIOS column: peripherals only
                const accLines = [];
                if (computer) {
                    const perifs = computer.peripherals || [];
                    perifs.forEach((p) => {
                        const desc = p.description || p.code || '';
                        if (desc) accLines.push(desc.toUpperCase());
                    });
                }
                const accText = accLines.join('\n');

                // Employee name
                const empName = desk.employeeName
                    || (desk.employee?.nombres && desk.employee?.apellidos
                        ? `${desk.employee.nombres} ${desk.employee.apellidos}`
                        : '')
                    || '-';

                // ESCRITORIO column: desk code + desk accessories
                const deskAccLines = [];
                const deskAccessories = desk.accessories || [];
                deskAccessories.forEach((a) => {
                    const desc = a.description || a.type || '';
                    if (desc) deskAccLines.push(desc.toUpperCase());
                });
                const deskText = desk.code || '';
                const escritorioText = deskAccLines.length > 0
                    ? `${deskText}\n${deskAccLines.join('\n')}`
                    : deskText;

                tableData.push([
                    unidadCounter,
                    escritorioText,
                    empName,
                    pcText,
                    accText || ' - ',
                ]);
            });

            const worksheet = XLSX.utils.aoa_to_sheet(tableData);

            worksheet['!cols'] = [
                { wch: 8 },
                { wch: 20 },
                { wch: 30 },
                { wch: 45 },
                { wch: 45 },
            ];

            const headerStyle = {
                fill: {
                    fgColor: { rgb: '424242' },
                },
                font: {
                    bold: true,
                    color: { rgb: 'FFFFFF' },
                    sz: 11,
                },
                alignment: {
                    horizontal: 'center',
                    vertical: 'center',
                },
                border: {
                    top: { style: 'thin', color: { rgb: '000000' } },
                    bottom: { style: 'thin', color: { rgb: '000000' } },
                    left: { style: 'thin', color: { rgb: '000000' } },
                    right: { style: 'thin', color: { rgb: '000000' } },
                },
            };

            headers.forEach((_, colIndex) => {
                const cellAddress = XLSX.utils.encode_cell({ r: 0, c: colIndex });
                if (worksheet[cellAddress]) {
                    worksheet[cellAddress].s = headerStyle;
                }
            });

            XLSX.utils.book_append_sheet(workbook, worksheet, 'Reporte de Escritorios');

            const randomId = Math.random().toString(36).substring(2, 8).toUpperCase();
            const fileName = `reporte-escritorios-${new Date().toISOString().split('T')[0]}-${randomId}.xlsx`;
            XLSX.writeFile(workbook, fileName);
            return fileName;
        } catch (error) {
            console.error('Error al generar Excel de escritorios:', error);
            alert('Error al generar el archivo Excel. Por favor, intente nuevamente.');
            return null;
        }
    };

    return { exportToExcel, exportDeskToExcel };
};
