import { Injectable } from '@angular/core';
import * as XLSX from 'xlsx';
import { jsPDF } from 'jspdf';
import autoTable from 'jspdf-autotable';
import { Document, Packer, Paragraph, Table, TableRow, TableCell, TextRun, AlignmentType, HeadingLevel, BorderStyle, WidthType } from 'docx';
import { saveAs } from 'file-saver';

export interface ExportColumn {
    key: string;
    label: string;
}

export interface ExportFilter {
    label: string;
    value: string;
}

export interface ExportOptions {
    fileName: string;
    title: string;
    data: any[];
    columns: ExportColumn[];
    filters?: ExportFilter[];
}

@Injectable({
    providedIn: 'root'
})
export class ExportService {

    constructor() { }

    /**
     * Export data to Excel (.xlsx)
     */
    exportToExcel(options: ExportOptions): void {
        const { fileName, title, data, columns, filters } = options;

        // 1. Prepare data for Excel
        const excelData = data.map(item => {
            const row: any = {};
            columns.forEach(col => {
                row[col.label] = item[col.key];
            });
            return row;
        });

        // 2. Create workbook and worksheet
        const worksheet = XLSX.utils.json_to_sheet(excelData);
        const workbook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(workbook, worksheet, 'Data');

        // 3. Add Title (Optional: inserting a row at the top is complex with json_to_sheet, 
        // usually better to use aoa_to_sheet if custom formatting is needed)

        // 4. Adding filters at the end
        if (filters && filters.length > 0) {
            const filterStartRow = data.length + 3;
            XLSX.utils.sheet_add_aoa(worksheet, [['Applied Filters']], { origin: `A${filterStartRow}` });
            filters.forEach((f, index) => {
                XLSX.utils.sheet_add_aoa(worksheet, [[f.label, f.value]], { origin: `A${filterStartRow + index + 1}` });
            });
        }

        // 5. Save file
        const excelBuffer = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
        this.saveFile(excelBuffer, `${this.formatFileName(fileName)}.xlsx`, 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
    }

    /**
     * Export data to PDF (.pdf)
     */
    exportToPdf(options: ExportOptions): void {
        const { fileName, title, data, columns, filters } = options;
        const doc = new jsPDF('p', 'mm', 'a4');

        // 1. Add Title
        doc.setFontSize(18);
        doc.setTextColor(40, 40, 40);
        doc.text(title, 14, 22);

        // Date
        doc.setFontSize(10);
        doc.setTextColor(100, 100, 100);
        doc.text(`Generated on: ${new Date().toLocaleString()}`, 14, 28);

        // 2. Add Table
        const head = [columns.map(col => col.label)];
        const body = data.map(item => columns.map(col => item[col.key]));

        autoTable(doc, {
            head: head,
            body: body,
            startY: 35,
            theme: 'grid',
            headStyles: { fillColor: [99, 102, 241], textColor: [255, 255, 255], fontStyle: 'bold' },
            styles: { fontSize: 9, cellPadding: 3 },
            alternateRowStyles: { fillColor: [250, 250, 250] }
        });

        // 3. Add Filters at the end
        if (filters && filters.length > 0) {
            const lastY = (doc as any).lastAutoTable.finalY + 15;
            doc.setFontSize(12);
            doc.setTextColor(40, 40, 40);
            doc.text('Applied Filters:', 14, lastY);

            doc.setFontSize(9);
            doc.setTextColor(80, 80, 80);
            filters.forEach((f, index) => {
                doc.text(`${f.label}: ${f.value}`, 14, lastY + 7 + (index * 5));
            });
        }

        // 4. Save file
        doc.save(`${this.formatFileName(fileName)}.pdf`);
    }

    /**
     * Export data to Word (.docx)
     */
    async exportToWord(options: ExportOptions): Promise<void> {
        const { fileName, title, data, columns, filters } = options;

        // 1. Create Table Header
        const headerRow = new TableRow({
            children: columns.map(col => new TableCell({
                children: [new Paragraph({
                    children: [new TextRun({ text: col.label, bold: true, color: 'FFFFFF' })],
                    alignment: AlignmentType.CENTER
                })],
                shading: { fill: '6366F1' },
            })),
        });

        // 2. Create Table Rows
        const dataRows = data.map(item => new TableRow({
            children: columns.map(col => new TableCell({
                children: [new Paragraph({ text: String(item[col.key] || '') })],
            })),
        }));

        // 3. Create the Document
        const doc = new Document({
            sections: [{
                properties: {},
                children: [
                    new Paragraph({
                        text: title,
                        heading: HeadingLevel.HEADING_1,
                        alignment: AlignmentType.CENTER,
                        spacing: { after: 400 },
                    }),
                    new Paragraph({
                        children: [
                            new TextRun({ text: `Generated on: ${new Date().toLocaleString()}`, italics: true, size: 18 })
                        ],
                        spacing: { after: 400 },
                    }),
                    new Table({
                        width: { size: 100, type: WidthType.PERCENTAGE },
                        rows: [headerRow, ...dataRows],
                    }),
                    ...(filters && filters.length > 0 ? [
                        new Paragraph({
                            text: 'Applied Filters:',
                            heading: HeadingLevel.HEADING_3,
                            spacing: { before: 800, after: 200 },
                        }),
                        ...filters.map(f => new Paragraph({
                            children: [
                                new TextRun({ text: `${f.label}: `, bold: true }),
                                new TextRun({ text: f.value }),
                            ],
                        }))
                    ] : [])
                ],
            }],
        });

        // 4. Save file
        const blob = await Packer.toBlob(doc);
        saveAs(blob, `${this.formatFileName(fileName)}.docx`);
    }

    private formatFileName(baseName: string): string {
        const today = new Date().toISOString().split('T')[0];
        return `${baseName}_${today}`.replace(/\s+/g, '_').toLowerCase();
    }

    private saveFile(buffer: any, fileName: string, fileType: string): void {
        const data: Blob = new Blob([buffer], { type: fileType });
        saveAs(data, fileName);
    }
}
