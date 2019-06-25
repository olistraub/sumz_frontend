import { Injectable } from '@angular/core';
import * as XLSX from 'xlsx';

const EXCEL_EXTENSION = '.xlsx';

@Injectable()
export class ExcelService {
  //Service um JSON[] als Excel zu speichern
  constructor() { }

  public exportAsExcelFile(json: any[], excelFileName: string): void {
    const worksheet: XLSX.WorkSheet = XLSX.utils.json_to_sheet(json);
    let workbook: XLSX.WorkBook = { Sheets: { 'data': worksheet }, SheetNames: ['data'] };
    console.log(worksheet);
    
    XLSX.writeFile(workbook,excelFileName + EXCEL_EXTENSION);
    
  }

  /* TODO - Excelausgabe anpassen - Momentane Ausgabe in Browser-Console
   - Problem sind die Spalten mit JSONS (z.B. liabilities)
   - Idee -> Diese in eigene Worksheets im Workbook auslagern bzw. nur die Berechnungsergebnisse anzeigen
  */
  

  

}