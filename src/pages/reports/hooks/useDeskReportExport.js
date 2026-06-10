import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { useReportStore } from '../store/useReportStore';

export const useDeskReportExport = () => {
    const exportDeskReport = () => {
        try {
            const { getAllData } = useReportStore.getState();
            const { computers, desks } = getAllData();

            const doc = new jsPDF();
            const pageWidth = doc.internal.pageSize.getWidth();
            const pageHeight = doc.internal.pageSize.getHeight();
            const margin = 20;
            let yPosition = 30;

            // Title
            doc.setFontSize(16);
            doc.setFont('helvetica', 'bold');
            doc.setTextColor(30, 30, 30);
            doc.text('REPORTE DE INVENTARIO POR ESCRITORIO', pageWidth / 2, yPosition, { align: 'center' });
            yPosition += 10;

            // Separator line
            doc.setDrawColor(200, 200, 200);
            doc.setLineWidth(0.5);
            doc.line(margin, yPosition, pageWidth - margin, yPosition);
            yPosition += 12;

            // Filter desks with computer
            const desksWithComputer = desks.filter((d) => d.computerId || d.computer);

            if (desksWithComputer.length === 0) {
                doc.setFontSize(12);
                doc.setFont('helvetica', 'normal');
                doc.setTextColor(100, 100, 100);
                doc.text('No hay escritorios con computador asignado.', pageWidth / 2, yPosition, { align: 'center' });
                doc.save('reporte-escritorios.pdf');
                return;
            }

            // Build table rows
            let unidadCounter = 0;
            const tableBody = desksWithComputer.map((desk) => {
                unidadCounter++;
                const computerCode = desk.computer || desk.computerId;
                const computer = computers.find(
                    (c) => c.code === computerCode || c.id === desk.computerId
                );

                // PC column: computer code + component specs
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

                return [
                    unidadCounter,
                    escritorioText,
                    empName,
                    pcText,
                    accText || ' - ',
                ];
            });

            // 5 columns: UNIDAD, ESCRITORIO, RESPONSABLE, PC, ACCESORIOS
            const colWidth = (pageWidth - 2 * margin) / 5;

            autoTable(doc, {
                startY: yPosition,
                head: [['UNIDAD', 'ESCRITORIO', 'RESPONSABLE', 'PC', 'ACCESORIOS']],
                body: tableBody,
                theme: 'grid',
                headStyles: {
                    fillColor: [255, 255, 255],
                    textColor: [0, 0, 0],
                    fontStyle: 'bold',
                    fontSize: 10,
                    font: 'helvetica',
                    halign: 'center',
                    valign: 'middle',
                    lineColor: [0, 0, 0],
                    lineWidth: 0.5,
                },
                styles: {
                    fontSize: 10,
                    font: 'helvetica',
                    cellPadding: 3,
                    valign: 'middle',
                    lineColor: [0, 0, 0],
                    lineWidth: 0.5,
                    textColor: [0, 0, 0],
                },
                columnStyles: {
                    0: { cellWidth: colWidth * 0.6, halign: 'center' },
                    1: { cellWidth: colWidth, halign: 'center' },
                    2: { cellWidth: colWidth, halign: 'center' },
                    3: { cellWidth: colWidth * 1.2, halign: 'left' },
                    4: { cellWidth: colWidth * 1.2, halign: 'left' },
                },
                margin: { left: margin, right: margin },
            });

            // Footer: page numbers
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
            const fileName = `reporte-escritorios-${new Date().toISOString().split('T')[0]}-${randomId}.pdf`;
            doc.save(fileName);
            return fileName;
        } catch (error) {
            console.error('Error al generar reporte de escritorios:', error);
            alert('Error al generar el reporte de escritorios. Por favor, intente nuevamente.');
            return null;
        }
    };

    return { exportDeskReport };
};
