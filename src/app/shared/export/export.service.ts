import { Service } from '@angular/core';
import { writeXLSX } from 'xlsx';
import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';
@Service()
export class ExportService {
  exportToExcel(data: any[], fileName: string) {

    const worksheet = XLSX.utils.json_to_sheet(data);
    const workbook = {
      Sheets: {
        data: worksheet
      },
      SheetNames: ['data']
    };
    const excelBuffer = XLSX.write(workbook, {
      bookType: 'xlsx',
      type: 'array'
    });

    const blob = new Blob(
      [excelBuffer],
      {
        type: 'application/octet-stream'
      }
    );

    saveAs(blob, `${fileName}.xlsx`);
  }
}
