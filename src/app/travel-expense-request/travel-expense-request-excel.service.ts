import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as ExcelJS from 'exceljs';
import { TravelExpenseRequest } from './entities/travel-expense-request.entity';
import { TravelExpenseRequestDetail } from '../travel-expense-request-detail/entities/travel-expense-request-detail.entity';
import { TravelExpenseRequestCustomer } from '../travel-expense-request-customer/entities/travel-expense-request-customer.entity';

@Injectable()
export class TravelExpenseRequestExcelService {
  constructor(
    @InjectRepository(TravelExpenseRequest)
    private readonly requestRepo: Repository<TravelExpenseRequest>,
    @InjectRepository(TravelExpenseRequestDetail)
    private readonly detailRepo: Repository<TravelExpenseRequestDetail>,
    @InjectRepository(TravelExpenseRequestCustomer)
    private readonly customerRepo: Repository<TravelExpenseRequestCustomer>,
  ) {}

  async generateExcel(id: string): Promise<Buffer> {
    const request = await this.requestRepo.findOne({ where: { id } });
    if (!request) throw new NotFoundException(`Travel expense request ${id} not found`);

    const [details, customers] = await Promise.all([
      this.detailRepo.find({ where: { travelExpenseRequestId: id }, order: { createdAt: 'ASC' } }),
      this.customerRepo.find({ where: { travelExpenseRequestId: id }, order: { createdAt: 'ASC' } }),
    ]);

    const workbook = new ExcelJS.Workbook();
    const sheet = workbook.addWorksheet('Anticipo Viáticos');

    // ── Styles ────────────────────────────────────────────────────────────────
    const headerFill: ExcelJS.Fill = {
      type: 'pattern',
      pattern: 'solid',
      fgColor: { argb: 'FF1F3864' },
    };
    const subHeaderFill: ExcelJS.Fill = {
      type: 'pattern',
      pattern: 'solid',
      fgColor: { argb: 'FF2F5496' },
    };
    const headerFont: Partial<ExcelJS.Font> = { bold: true, color: { argb: 'FFFFFFFF' }, size: 11 };
    const labelFont: Partial<ExcelJS.Font> = { bold: true, size: 10 };
    const borderStyle: Partial<ExcelJS.Borders> = {
      top: { style: 'thin' },
      left: { style: 'thin' },
      bottom: { style: 'thin' },
      right: { style: 'thin' },
    };

    const setHeaderRow = (row: ExcelJS.Row, text: string, fromCol: number, toCol: number) => {
      const cell = row.getCell(fromCol);
      cell.value = text;
      cell.font = headerFont;
      cell.fill = headerFill;
      cell.alignment = { horizontal: 'center', vertical: 'middle' };
      cell.border = borderStyle;
      sheet.mergeCells(row.number, fromCol, row.number, toCol);
    };

    const setLabel = (row: ExcelJS.Row, col: number, label: string) => {
      const cell = row.getCell(col);
      cell.value = label;
      cell.font = labelFont;
      cell.border = borderStyle;
    };

    const setValue = (row: ExcelJS.Row, col: number, value: unknown) => {
      const cell = row.getCell(col);
      cell.value = value as ExcelJS.CellValue;
      cell.border = borderStyle;
    };

    const setCurrency = (row: ExcelJS.Row, col: number, value: number | null) => {
      const cell = row.getCell(col);
      cell.value = value;
      cell.numFmt = '#,##0.00';
      cell.border = borderStyle;
      cell.alignment = { horizontal: 'right' };
    };

    // ── Column widths ─────────────────────────────────────────────────────────
    sheet.columns = [
      { width: 5 },   // A
      { width: 20 },  // B
      { width: 20 },  // C
      { width: 20 },  // D
      { width: 20 },  // E
      { width: 18 },  // F
      { width: 18 },  // G
      { width: 18 },  // H
    ];

    // ── Title ─────────────────────────────────────────────────────────────────
    let rowIdx = 1;
    const titleRow = sheet.getRow(rowIdx++);
    setHeaderRow(titleRow, 'ANTICIPO DE VIÁTICOS - DETALLADO', 1, 8);
    titleRow.height = 25;

    // ── General info ──────────────────────────────────────────────────────────
    const infoRow1 = sheet.getRow(rowIdx++);
    setLabel(infoRow1, 1, 'Empleado:');
    setValue(infoRow1, 2, request.requestedForUserName);
    setLabel(infoRow1, 5, 'Fecha:');
    setValue(infoRow1, 6, new Date(request.docDate).toLocaleDateString('es-GT'));

    const infoRow2 = sheet.getRow(rowIdx++);
    setLabel(infoRow2, 1, 'Centro de Costo:');
    setValue(infoRow2, 2, request.costCenterName);
    setLabel(infoRow2, 5, 'Estado:');
    setValue(infoRow2, 6, request.status ?? 'PENDIENTE');

    const infoRow3 = sheet.getRow(rowIdx++);
    setLabel(infoRow3, 1, 'Creado por:');
    setValue(infoRow3, 2, request.createdByName);
    setLabel(infoRow3, 5, 'Días:');
    setValue(infoRow3, 6, request.numberOfDays ?? '');

    const infoRow4 = sheet.getRow(rowIdx++);
    setLabel(infoRow4, 1, 'Origen:');
    setValue(infoRow4, 2, `${request.originCity}, ${request.originCountry}`);
    setLabel(infoRow4, 5, 'Destino:');
    setValue(infoRow4, 6, `${request.destinationCity}, ${request.destinationCountry}`);

    const infoRow5 = sheet.getRow(rowIdx++);
    setLabel(infoRow5, 1, 'Motivo:');
    setValue(infoRow5, 2, request.reason);
    sheet.mergeCells(infoRow5.number, 2, infoRow5.number, 8);

    rowIdx++; // blank

    // ── Customers section ─────────────────────────────────────────────────────
    if (customers.length > 0) {
      const custTitleRow = sheet.getRow(rowIdx++);
      setHeaderRow(custTitleRow, 'CLIENTES VISITADOS', 1, 8);
      custTitleRow.height = 20;

      const custHeaderRow = sheet.getRow(rowIdx++);
      ['#', 'SAP Code', 'Nombre del Cliente'].forEach((h, i) => {
        const cell = custHeaderRow.getCell(i + 1);
        cell.value = h;
        cell.font = { bold: true, color: { argb: 'FFFFFFFF' }, size: 10 };
        cell.fill = subHeaderFill;
        cell.border = borderStyle;
        cell.alignment = { horizontal: 'center' };
      });
      sheet.mergeCells(rowIdx - 1, 3, rowIdx - 1, 8);

      customers.forEach((c, idx) => {
        const r = sheet.getRow(rowIdx++);
        setValue(r, 1, idx + 1);
        setValue(r, 2, c.sapCode);
        const nameCell = r.getCell(3);
        nameCell.value = c.name;
        nameCell.border = borderStyle;
        sheet.mergeCells(r.number, 3, r.number, 8);
      });

      rowIdx++; // blank
    }

    // ── Details section ───────────────────────────────────────────────────────
    const detailTitleRow = sheet.getRow(rowIdx++);
    setHeaderRow(detailTitleRow, 'DETALLE DE GASTOS', 1, 8);
    detailTitleRow.height = 20;

    const detailHeaderRow = sheet.getRow(rowIdx++);
    const detailHeaders = ['#', 'Categoría', 'Tope', 'Monto Solicitado', 'Monto Presentado', 'Monto Aprobado', 'Saldo', 'Aprobado'];
    detailHeaders.forEach((h, i) => {
      const cell = detailHeaderRow.getCell(i + 1);
      cell.value = h;
      cell.font = { bold: true, color: { argb: 'FFFFFFFF' }, size: 10 };
      cell.fill = subHeaderFill;
      cell.border = borderStyle;
      cell.alignment = { horizontal: 'center' };
    });

    let totalRequested = 0;
    let totalSubmitted = 0;
    let totalApproved = 0;
    let totalBalance = 0;

    details.forEach((d, idx) => {
      const r = sheet.getRow(rowIdx++);
      setValue(r, 1, idx + 1);
      setValue(r, 2, d.categoryName);
      setCurrency(r, 3, parseFloat(d.categoryLimit as unknown as string) || 0);
      setCurrency(r, 4, parseFloat(d.amountRequested as unknown as string) || 0);
      setCurrency(r, 5, d.amountSubmitted != null ? parseFloat(d.amountSubmitted as unknown as string) : null);
      setCurrency(r, 6, d.amountApproved != null ? parseFloat(d.amountApproved as unknown as string) : null);
      setCurrency(r, 7, d.balance != null ? parseFloat(d.balance as unknown as string) : null);
      setValue(r, 8, d.approved ? 'Sí' : 'No');

      totalRequested += parseFloat(d.amountRequested as unknown as string) || 0;
      totalSubmitted += parseFloat(d.amountSubmitted as unknown as string) || 0;
      totalApproved += parseFloat(d.amountApproved as unknown as string) || 0;
      totalBalance += parseFloat(d.balance as unknown as string) || 0;
    });

    // Totals row
    const totalsRow = sheet.getRow(rowIdx++);
    const totalCell = totalsRow.getCell(1);
    totalCell.value = 'TOTALES';
    totalCell.font = { bold: true };
    totalCell.border = borderStyle;
    sheet.mergeCells(totalsRow.number, 1, totalsRow.number, 2);

    [
      { col: 3, val: null },
      { col: 4, val: totalRequested },
      { col: 5, val: totalSubmitted },
      { col: 6, val: totalApproved },
      { col: 7, val: totalBalance },
    ].forEach(({ col, val }) => {
      const cell = totalsRow.getCell(col);
      cell.value = val;
      cell.font = { bold: true };
      cell.border = borderStyle;
      cell.numFmt = '#,##0.00';
      cell.alignment = { horizontal: 'right' };
    });

    // ── Payment method & amount summary ───────────────────────────────────────
    rowIdx++;
    const summaryRow = sheet.getRow(rowIdx++);
    setLabel(summaryRow, 1, 'Método de Pago:');
    setValue(summaryRow, 2, request.paymentMethodName);
    setLabel(summaryRow, 5, 'Monto Total:');
    const totalAmtCell = summaryRow.getCell(6);
    totalAmtCell.value = parseFloat(request.amount as unknown as string) || 0;
    totalAmtCell.numFmt = '#,##0.00';
    totalAmtCell.border = borderStyle;
    totalAmtCell.font = { bold: true };
    totalAmtCell.alignment = { horizontal: 'right' };

    const buffer = await workbook.xlsx.writeBuffer();
    return Buffer.from(buffer);
  }
}
