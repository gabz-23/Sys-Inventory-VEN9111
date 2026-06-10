import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

/**
 * Hook personalizado para exportar reportes a PDF.
 *
 * Genera un PDF profesional con:
 * - Título del reporte
 * - Tabla detallada de items
 * - Pie de página con paginación y fecha de generación

 */
export const usePDFExport = () => {
    /**
     * Genera y descarga un PDF con el reporte de inventario.
     *
     * El PDF incluye:
     * 1. Encabezado con título
     * 2. Tabla detallada con todos los items
     * 3. Pie de página con paginación y fecha/hora de generación
     */
    const exportToPDF = (filteredItems) => {
        try {
            const doc = new jsPDF();
            // Dimensiones de la página
            const pageWidth = doc.internal.pageSize.getWidth();
            const pageHeight = doc.internal.pageSize.getHeight();
            const margin = 20;
            let yPosition = 30;

            // ========== ENCABEZADO ==========
            // Título principal del reporte - más grande y destacado
            doc.setFontSize(24);
            doc.setFont('helvetica', 'bold');
            doc.setTextColor(30, 30, 30);
            doc.text('REPORTE DE INVENTARIO', pageWidth / 2, yPosition, { align: 'center' });
            yPosition += 6;

            // Línea decorativa debajo del título
            doc.setDrawColor(200, 200, 200);
            doc.setLineWidth(0.5);
            doc.line(margin, yPosition, pageWidth - margin, yPosition);
            yPosition += 12;

            // ========== TABLA DE DATOS ==========
            // Preparar datos para la tabla
            const tableData = filteredItems.map((item) => [
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

            // Título de la tabla - centrado
            doc.setFontSize(12);
            doc.setFont('helvetica', 'bold');
            doc.setTextColor(30, 30, 30);
            doc.text('Detalle de Items', pageWidth / 2, yPosition, { align: 'center' });
            yPosition += 8;

            // Calcular ancho total de la tabla y centrarla
            // Anchos de columnas
            const tableWidth = 30 + 30 + 50 + 30 + 30 + 25;
            const leftMargin = (pageWidth - tableWidth) / 2;

            autoTable(doc, {
                startY: yPosition,
                head: [['Código', 'Tipo', 'Descripción', 'Estado', 'Categoría', 'Fecha']],
                body: tableData,
                theme: 'striped',
                tableWidth: tableWidth,
                headStyles: {
                    fillColor: [66, 66, 66],
                    textColor: 255,
                    fontStyle: 'bold',
                    halign: 'center',
                },
                styles: {
                    fontSize: 8,
                    cellPadding: 3,
                    halign: 'center',
                },
                columnStyles: {
                    0: { cellWidth: 30, halign: 'center' },
                    1: { cellWidth: 30, halign: 'center' },
                    2: { cellWidth: 50, halign: 'left' },
                    3: { cellWidth: 30, halign: 'center' },
                    4: { cellWidth: 30, halign: 'center' },
                    5: { cellWidth: 25, halign: 'center' },
                },
                margin: { left: leftMargin, right: leftMargin },
            });

            // ========== PIE DE PÁGINA ==========
            // Agregar paginación y fecha de generación a todas las páginas
            const pageCount = doc.internal.getNumberOfPages();
            const currentDate = new Date().toLocaleDateString('es-ES', {
                year: 'numeric',
                month: 'long',
                day: 'numeric',
            });
            const currentTime = new Date().toLocaleTimeString('es-ES', {
                hour: '2-digit',
                minute: '2-digit',
            });

            for (let i = 1; i <= pageCount; i++) {
                doc.setPage(i);

                // Línea separadora en el pie de página
                doc.setDrawColor(200, 200, 200);
                doc.setLineWidth(0.3);
                doc.line(margin, pageHeight - 15, pageWidth - margin, pageHeight - 15);

                doc.setFontSize(8);
                doc.setFont('helvetica', 'italic');
                doc.setTextColor(120, 120, 120);
                doc.text(`Página ${i} de ${pageCount}`, pageWidth / 2, pageHeight - 8, { align: 'center' });

                // Fecha y hora de generación en la primera página
                if (i === 1) {
                    doc.setFontSize(7);
                    doc.text(`Generado el ${currentDate} a las ${currentTime}`, pageWidth / 2, pageHeight - 3, {
                        align: 'center',
                    });
                }
            }

            // Generar ID aleatorio para el nombre del archivo
            const randomId = Math.random().toString(36).substring(2, 8).toUpperCase();
            
            // Generar nombre del archivo
            const fileName = `reporte-inventario-${new Date().toISOString().split('T')[0]}-${randomId}.pdf`;
            doc.save(fileName);
            return fileName;
        } catch (error) {
            console.error('Error al generar PDF:', error);
            alert('Error al generar el PDF. Por favor, intente nuevamente.');
            return null;
        }
    };

    return { exportToPDF };
};
