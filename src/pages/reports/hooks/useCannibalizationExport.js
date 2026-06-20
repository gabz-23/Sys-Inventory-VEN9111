import * as XLSX from 'xlsx-js-style';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

const formatDate = (date) => {
    if (!date) return '-';
    return new Date(date + 'T00:00:00').toLocaleDateString('es-ES', {
        year: 'numeric', month: '2-digit', day: '2-digit',
    });
};

export const useCannibalizationExport = () => {
    const exportToExcel = (items) => {
        try {
            const workbook = XLSX.utils.book_new();
            const headers = [
                'Código', 'Descripción', 'Tipo', 'Fecha Movimiento',
                'Donante', 'Receptor', 'Observaciones', 'Registrado por',
            ];
            const tableData = [headers];

            items.forEach((item) => {
                tableData.push([
                    item.itemCode || '-',
                    item.itemDescription || '-',
                    item.itemType || '-',
                    formatDate(item.movementDate),
                    item.donorComputer || '-',
                    item.receiverComputer || '-',
                    item.observations || '-',
                    item.createdBy || '-',
                ]);
            });

            const worksheet = XLSX.utils.aoa_to_sheet(tableData);
            worksheet['!cols'] = [
                { wch: 15 }, { wch: 30 }, { wch: 15 }, { wch: 15 },
                { wch: 25 }, { wch: 25 }, { wch: 30 }, { wch: 20 },
            ];

            const headerStyle = {
                fill: { fgColor: { rgb: '424242' } },
                font: { bold: true, color: { rgb: 'FFFFFF' }, sz: 11 },
                alignment: { horizontal: 'center', vertical: 'center' },
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

            XLSX.utils.book_append_sheet(workbook, worksheet, 'Canibalización');
            const randomId = Math.random().toString(36).substring(2, 8).toUpperCase();
            const fileName = `canibalizacion-${new Date().toISOString().split('T')[0]}-${randomId}.xlsx`;
            XLSX.writeFile(workbook, fileName);
            return fileName;
        } catch (error) {
            console.error('Error al generar Excel de canibalización:', error);
            alert('Error al generar el archivo Excel.');
            return null;
        }
    };

    const exportToPDF = (items) => {
        try {
            const doc = new jsPDF();
            const pageWidth = doc.internal.pageSize.getWidth();
            const pageHeight = doc.internal.pageSize.getHeight();
            const margin = 20;
            let yPosition = 30;

            doc.setFontSize(20);
            doc.setFont('helvetica', 'bold');
            doc.setTextColor(30, 30, 30);
            doc.text('BITÁCORA DE CANIBALIZACIÓN', pageWidth / 2, yPosition, { align: 'center' });
            yPosition += 6;

            doc.setDrawColor(200, 200, 200);
            doc.setLineWidth(0.5);
            doc.line(margin, yPosition, pageWidth - margin, yPosition);
            yPosition += 12;

            const tableData = items.map((item) => [
                item.itemCode || '-',
                item.itemDescription || '-',
                item.itemType || '-',
                formatDate(item.movementDate),
                item.donorComputer || '-',
                item.receiverComputer || '-',
                item.createdBy || '-',
            ]);

            doc.setFontSize(12);
            doc.setFont('helvetica', 'bold');
            doc.text('Detalle de Movimientos', pageWidth / 2, yPosition, { align: 'center' });
            yPosition += 8;

            const tableWidth = 170;
            const leftMargin = (pageWidth - tableWidth) / 2;

            autoTable(doc, {
                startY: yPosition,
                head: [['Código', 'Descripción', 'Tipo', 'Fecha', 'Donante', 'Receptor', 'Registrado por']],
                body: tableData,
                theme: 'striped',
                tableWidth,
                headStyles: {
                    fillColor: [66, 66, 66],
                    textColor: 255,
                    fontStyle: 'bold',
                    halign: 'center',
                },
                styles: { fontSize: 7, cellPadding: 2, halign: 'center' },
                columnStyles: {
                    0: { cellWidth: 20 },
                    1: { cellWidth: 40 },
                    2: { cellWidth: 18 },
                    3: { cellWidth: 22 },
                    4: { cellWidth: 35 },
                    5: { cellWidth: 35 },
                    6: { cellWidth: 20 },
                },
                margin: { left: leftMargin, right: leftMargin },
            });

            const pageCount = doc.internal.getNumberOfPages();
            const currentDate = new Date().toLocaleDateString('es-ES', {
                year: 'numeric', month: 'long', day: 'numeric',
            });
            const currentTime = new Date().toLocaleTimeString('es-ES', {
                hour: '2-digit', minute: '2-digit',
            });

            for (let i = 1; i <= pageCount; i++) {
                doc.setPage(i);
                doc.setDrawColor(200, 200, 200);
                doc.setLineWidth(0.3);
                doc.line(margin, pageHeight - 15, pageWidth - margin, pageHeight - 15);
                doc.setFontSize(8);
                doc.setFont('helvetica', 'italic');
                doc.setTextColor(120, 120, 120);
                doc.text(`Página ${i} de ${pageCount}`, pageWidth / 2, pageHeight - 8, { align: 'center' });
                if (i === 1) {
                    doc.setFontSize(7);
                    doc.text(`Generado el ${currentDate} a las ${currentTime}`, pageWidth / 2, pageHeight - 3, { align: 'center' });
                }
            }

            const randomId = Math.random().toString(36).substring(2, 8).toUpperCase();
            const fileName = `canibalizacion-${new Date().toISOString().split('T')[0]}-${randomId}.pdf`;
            doc.save(fileName);
            return fileName;
        } catch (error) {
            console.error('Error al generar PDF de canibalización:', error);
            alert('Error al generar el PDF.');
            return null;
        }
    };

    return { exportToExcel, exportToPDF };
};
