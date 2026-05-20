import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import * as ExcelJS from 'exceljs';
import { InjectRepository } from '@nestjs/typeorm';
import { In, Repository, DataSource } from 'typeorm';
import { TravelExpenseRequest } from './entities/travel-expense-request.entity';
import { CreateTravelExpenseRequestDto } from './dto/create-travel-expense-request.dto';
import { UpdateTravelExpenseRequestDto } from './dto/update-travel-expense-request.dto';
import { UserApprover } from '../user-approver/entities/user-approver.entity';

@Injectable()
export class TravelExpenseRequestService {
  constructor(
    @InjectRepository(TravelExpenseRequest)
    private readonly repository: Repository<TravelExpenseRequest>,
    @InjectRepository(UserApprover)
    private readonly userApproverRepository: Repository<UserApprover>,
    private readonly dataSource: DataSource,
  ) {}

  async create(createDto: CreateTravelExpenseRequestDto): Promise<TravelExpenseRequest> {
    try {
      // Obtener el siguiente número de documento automáticamente
      const nextDocumentNumber = await this.getNextDocumentNumber();
      
      const entity = this.repository.create({
        ...createDto,
        documentNumber: nextDocumentNumber,
      });
      
      return await this.repository.save(entity);
    } catch (error) {
      throw new BadRequestException('Error creating travel expense request');
    }
  }

  async findAll(): Promise<TravelExpenseRequest[]> {
    return await this.repository.find({
      order: { createdAt: 'DESC' },
    });
  }

  async findOne(id: string): Promise<TravelExpenseRequest> {
    const entity = await this.repository.findOne({
      where: { id },
    });
    if (!entity) {
      throw new NotFoundException(`Travel Expense Request with ID ${id} not found`);
    }
    return entity;
  }

  async findByRequestedForUser(userId: string): Promise<TravelExpenseRequest[]> {
    return await this.repository.find({
      where: { requestedForUserId: userId },
      order: { createdAt: 'DESC' },
    });
  }

  async findByCreatedBy(userId: string): Promise<TravelExpenseRequest[]> {
    return await this.repository.find({
      where: { createdBy: userId },
      order: { createdAt: 'DESC' },
    });
  }

  async findByCostCenter(costCenterId: string): Promise<TravelExpenseRequest[]> {
    return await this.repository.find({
      where: { costCenterId },
      order: { createdAt: 'DESC' },
    });
  }

  async findByApprover(approverUserId: string): Promise<TravelExpenseRequest[]> {
    const assignments = await this.userApproverRepository.find({
      where: { approverUserId },
    });

    if (!assignments.length) return [];

    const userIds = assignments.map((a) => a.userId);

    return await this.repository.find({
      where: { requestedForUserId: In(userIds) },
      order: { createdAt: 'DESC' },
    });
  }

  async update(
    id: string,
    updateDto: UpdateTravelExpenseRequestDto,
  ): Promise<TravelExpenseRequest> {
    const entity = await this.findOne(id);

    if (entity.locked) {
      throw new BadRequestException('Cannot update a locked travel expense request');
    }

    try {
      await this.repository.update(id, updateDto);
      return await this.findOne(id);
    } catch (error) {
      throw new BadRequestException('Error updating travel expense request');
    }
  }

  async remove(id: string): Promise<{ message: string }> {
    const entity = await this.findOne(id);

    if (entity.locked) {
      throw new BadRequestException('Cannot delete a locked travel expense request');
    }

    try {
      await this.repository.remove(entity);
      return { message: 'Travel Expense Request deleted successfully' };
    } catch (error) {
      throw new BadRequestException('Error deleting travel expense request');
    }
  }

  async lock(id: string): Promise<TravelExpenseRequest> {
    const entity = await this.findOne(id);
    entity.locked = true;
    return await this.repository.save(entity);
  }

  async unlock(id: string): Promise<TravelExpenseRequest> {
    const entity = await this.findOne(id);
    entity.locked = false;
    return await this.repository.save(entity);
  }

  async incrementLegalizationConsecutive(id: string): Promise<number> {
    const entity = await this.findOne(id);
    entity.legalizationConsecutive = (entity.legalizationConsecutive || 0) + 1;
    await this.repository.save(entity);
    return entity.legalizationConsecutive;
  }

  private async getNextDocumentNumber(): Promise<number> {
    const result = await this.repository
      .createQueryBuilder('request')
      .select('MAX(request.documentNumber)', 'max')
      .getRawOne<{ max: string | null }>();
    
    const maxNumber = result?.max ? Number(result.max) : 0;
    return maxNumber + 1;
  }

  async generateTreasuryFlatFile(documentNumbers: number[]): Promise<string> {
    // Buscar las solicitudes por número de documento
    const requests = await this.repository.find({
      where: { documentNumber: In(documentNumbers) },
    });

    if (requests.length === 0) {
      throw new NotFoundException('No travel expense requests found with the provided document numbers');
    }

    // Configuración de la entidad (estos valores deberían venir de configuración)
    const ENTITY_NIT = '0800015615';
    const ENTITY_NAME = 'Marpico sas';
    const TRANSACTION_CLASS = '220';
    const PURPOSE_DESC = 'CARGA';
    const DEBIT_ACCOUNT = '23794442328';
    const DEBIT_ACCOUNT_TYPE = 'D';

    // Generar fecha de transmisión (DDMMYY)
    const today = new Date();
    const transmissionDate = this.formatDateDDMMYY(today);
    const applicationDate = transmissionDate;
    
    // Secuencia del día (por ahora fija en 'A')
    const sequenceOfDay = 'A';

    // Calcular número de registros y sumatoria de créditos
    const numberOfRecords = requests.length;
    const totalCredits = requests.reduce((sum, req) => sum + Number(req.amount), 0);
    const totalDebits = 0; // Siempre 0 según especificación

    // Generar línea de cabecera (Control) - 95 caracteres
    const headerLine = this.generateControlLine({
      entityNit: ENTITY_NIT,
      entityName: ENTITY_NAME,
      transactionClass: TRANSACTION_CLASS,
      purposeDesc: PURPOSE_DESC,
      transmissionDate,
      sequenceOfDay,
      applicationDate,
      numberOfRecords,
      totalDebits,
      totalCredits,
      debitAccount: DEBIT_ACCOUNT,
      debitAccountType: DEBIT_ACCOUNT_TYPE,
    });

    // Generar líneas de detalle - 95 caracteres cada una
    const detailLines = requests.map((request, index) => {
      const consecutive = (index + 1).toString().padStart(2, '0');
      return this.generateDetailLine({
        beneficiaryId: ENTITY_NIT,
        beneficiaryName: request.requestedForUserName,
        bankCode: '000000000', // Debe venir de configuración o base de datos
        accountNumber: '0000000000000000', // Debe venir de usuario o base de datos
        paymentLocation: 'S',
        transactionType: '40',
        transactionAmount: Number(request.amount),
        consecutive,
        reference: request.documentNumber.toString(),
      });
    });

    // Unir todas las líneas con salto de línea
    const fileContent = [headerLine, ...detailLines].join('\n');

    return fileContent;
  }

  private formatDateDDMMYY(date: Date): string {
    const day = date.getDate().toString().padStart(2, '0');
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const year = date.getFullYear().toString().slice(-2);
    return `${day}${month}${year}`;
  }

  private padRight(value: string, length: number, char: string = ' '): string {
    return value.substring(0, length).padEnd(length, char);
  }

  private padLeft(value: string, length: number, char: string = '0'): string {
    return value.substring(0, length).padStart(length, char);
  }

  private generateControlLine(params: {
    entityNit: string;
    entityName: string;
    transactionClass: string;
    purposeDesc: string;
    transmissionDate: string;
    sequenceOfDay: string;
    applicationDate: string;
    numberOfRecords: number;
    totalDebits: number;
    totalCredits: number;
    debitAccount: string;
    debitAccountType: string;
  }): string {
    const {
      entityNit,
      entityName,
      transactionClass,
      purposeDesc,
      transmissionDate,
      sequenceOfDay,
      applicationDate,
      numberOfRecords,
      totalDebits,
      totalCredits,
      debitAccount,
      debitAccountType,
    } = params;

    // Campo 1: Tipo de registro (1) - 1 caracter
    const recordType = '1';

    // Campo 2: NIT entidad (10 caracteres numéricos)
    const nitField = this.padLeft(entityNit, 10);

    // Campo 3: Nombre entidad (16 caracteres alfanuméricos)
    const nameField = this.padRight(entityName, 16);

    // Campo 4: Clase transacciones (3 caracteres numéricos)
    const classField = this.padLeft(transactionClass, 3);

    // Campo 5: Descripción propósito (10 caracteres alfanuméricos)
    const purposeField = this.padRight(purposeDesc, 10);

    // Campo 6: Fecha transmisión (6 caracteres DDMMYY)
    const transmissionDateField = transmissionDate;

    // Campo 7: Secuencia envío (1 caracter alfanumérico)
    const sequenceField = sequenceOfDay;

    // Campo 8: Fecha aplicación (6 caracteres DDMMYY)
    const applicationDateField = applicationDate;

    // Campo 9: Número registros (6 caracteres numéricos)
    const recordsField = this.padLeft(numberOfRecords.toString(), 6);

    // Campo 10: Sumatoria débitos (12 caracteres numéricos)
    const debitsField = this.padLeft(Math.round(totalDebits * 100).toString(), 12);

    // Campo 11: Sumatoria créditos (12 caracteres numéricos)
    const creditsField = this.padLeft(Math.round(totalCredits * 100).toString(), 12);

    // Campo 12: Cuenta cliente a debitar (11 caracteres numéricos)
    const debitAccountField = this.padLeft(debitAccount, 11);

    // Campo 13: Tipo cuenta cliente (1 caracter alfanumérico)
    const accountTypeField = debitAccountType;

    return (
      recordType +
      nitField +
      nameField +
      classField +
      purposeField +
      transmissionDateField +
      sequenceField +
      applicationDateField +
      recordsField +
      debitsField +
      creditsField +
      debitAccountField +
      accountTypeField
    );
  }

  private generateDetailLine(params: {
    beneficiaryId: string;
    beneficiaryName: string;
    bankCode: string;
    accountNumber: string;
    paymentLocation: string;
    transactionType: string;
    transactionAmount: number;
    consecutive: string;
    reference: string;
  }): string {
    const {
      beneficiaryId,
      beneficiaryName,
      bankCode,
      accountNumber,
      paymentLocation,
      transactionType,
      transactionAmount,
      consecutive,
      reference,
    } = params;

    // Campo 1: Tipo registro (1) - 1 caracter
    const recordType = '6';

    // Campo 2: Identificación beneficiario (15 caracteres numéricos)
    const beneficiaryIdField = this.padLeft(beneficiaryId, 15);

    // Campo 3: Nombre beneficiario (18 caracteres alfanuméricos)
    const beneficiaryNameField = this.padRight(beneficiaryName, 18);

    // Campo 4: Banco cuenta del beneficiario (9 caracteres numéricos)
    const bankField = this.padLeft(bankCode, 9);

    // Campo 5: Número cuenta beneficiario (17 caracteres numéricos)
    const accountField = this.padRight(accountNumber, 17);

    // Campo 6: Indicador lugar de pago (1 caracter alfanumérico)
    const locationField = paymentLocation;

    // Campo 7: Tipo transacción (2 caracteres numéricos)
    const transactionTypeField = this.padLeft(transactionType, 2);

    // Campo 8: Valor de transacción (10 caracteres numéricos)
    const amountField = this.padLeft(Math.round(transactionAmount * 100).toString(), 10);

    // Campo 9: Concepto (9 caracteres alfanuméricos)
    const conceptField = this.padRight(consecutive, 9);

    // Campo 10: Referencia (12 caracteres alfanuméricos)
    const referenceField = this.padRight(reference, 12);

    // Campo 11: Relleno (1 caracter alfanumérico)
    const fillerField = ' ';

    return (
      recordType +
      beneficiaryIdField +
      beneficiaryNameField +
      bankField +
      accountField +
      locationField +
      transactionTypeField +
      amountField +
      conceptField +
      referenceField +
      fillerField
    );
  }

  async generateSapFlatFile(documentNumbers: number[]): Promise<Buffer> {
    // Construir la consulta con los números de documento proporcionados
    const documentNumbersStr = documentNumbers.map(num => `'${num}'`).join(',');
    
    // Primera parte del UNION - Detalles de gastos
    const query1 = `
      WITH detalle AS (
        SELECT
          to_char(now(), 'DD/MM/YYYY') AS "Fe.contabilizacion DDMY(008) BUDAT",
          CONCAT('LEG', ter."documentNumber") AS "Referencia C(016) XBLNR",
          ec.description AS "Texto cab.documento C(025) BKTXT",
          '40' AS "Clave Contabilizacion C(002) NEWBS",
          ec.account AS "Cuenta ContableC(010) NEWKO",
          '' AS "CME C(001) NEWUM",
          '' AS "Cuenta de mayor C(010) HKONT",
          tel."amountApproved" - tel."taxAmount" - tel."consumptionTaxAmount" AS "Importe Mon C(020) WRBTR",
          ti.code AS "Indicador impuestos C(002) MWSKZ",
          '' AS "Importe Impuesto C(013) FWSTE",
          cc."centerCode" AS "Centro de costo C(010) KOSTL",
          '' AS "ORDEN",
          '' AS "Centro de beneficio,C(010) PRCTR",
          tel."supplierNit" AS "Asignacion C(018) ZUONR",
          UPPER(CONCAT(tel."invoiceNumber",' ',ec.description,' ', tel.city, ' ', tel.municipality, ' ', ter."createdByName")) AS "Texto C(050) SGTXT"
        FROM travel_expense_requests ter
        INNER JOIN travel_expense_request_details terd ON ter.id = terd."travelExpenseRequestId"
        INNER JOIN travel_expense_legalizations tel ON tel."travelExpenseRequestId" = ter.id
          AND tel."travelExpenseRequestDetailId" = terd.id
        LEFT JOIN expense_category ec ON terd."categoryId" = ec.id
        LEFT JOIN tax_indicators ti ON tel."taxIndicatorId" = ti.id
        LEFT JOIN cost_centers cc ON ter."costCenterId" = cc.id
        WHERE ter."documentNumber" IN (${documentNumbersStr})

        UNION

        SELECT
          to_char(now(), 'DD/MM/YYYY') AS "Fe.contabilizacion DDMY(008) BUDAT",
          CONCAT('LEG', ter."documentNumber") AS "Referencia C(016) XBLNR",
          'IMPOCONSUMO' AS "Texto cab.documento C(025) BKTXT",
          '40' AS "Clave Contabilizacion C(002) NEWBS",
          (SELECT value FROM app_settings WHERE key = 'cuenta_contable_archivo_sap_impoconsumo') AS "Cuenta Contable,C(010),NEWKO",
          '' AS "CME C(001) NEWUM",
          '' AS "Cuenta de mayor C(010) HKONT",
          tel."consumptionTaxAmount" AS "Importe Mon C(020) WRBTR",
          ti.code AS "Indicador impuestos C(002) MWSKZ",
          '' AS "Importe Impuesto C(013) FWSTE",
          cc."centerCode" AS "Centro de costo C(010) KOSTL",
          '' AS "ORDEN",
          '' AS "Centro de beneficio C(010) PRCTR",
          tel."supplierNit" AS "Asignacion C(018) ZUONR",
          UPPER(CONCAT(tel."invoiceNumber",' ',ec.description,' ', tel.city, ' ', tel.municipality, ' ', ter."createdByName")) AS "Texto C(050) SGTXT"
        FROM travel_expense_requests ter
        INNER JOIN travel_expense_request_details terd ON ter.id = terd."travelExpenseRequestId"
        INNER JOIN travel_expense_legalizations tel ON tel."travelExpenseRequestId" = ter.id
          AND tel."travelExpenseRequestDetailId" = terd.id
        LEFT JOIN expense_category ec ON terd."categoryId" = ec.id
        LEFT JOIN tax_indicators ti ON tel."taxIndicatorId" = ti.id
        LEFT JOIN cost_centers cc ON ter."costCenterId" = cc.id
        WHERE ter."documentNumber" IN (${documentNumbersStr})

        UNION

        SELECT
          to_char(now(), 'DD/MM/YYYY') AS "Fe.contabilizacion DDMY(008) BUDAT",
          CONCAT('LEG', ter."documentNumber") AS "Referencia C(016) XBLNR",
          'PROPINAS' AS "Texto cab.documento C(025) BKTXT",
          '40' AS "Clave Contabilizacion C(002) NEWBS",
          (SELECT value FROM app_settings WHERE key = 'cuenta_contable_archivo_sap_propinas') AS "Cuenta Contable,C(010),NEWKO",
          '' AS "CME C(001) NEWUM",
          '' AS "Cuenta de mayor C(010) HKONT",
          COALESCE(tel."tipAmount", 0.00) AS "Importe Mon C(020) WRBTR",
          ti.code AS "Indicador impuestos C(002) MWSKZ",
          '' AS "Importe Impuesto C(013) FWSTE",
          cc."centerCode" AS "Centro de costo C(010) KOSTL",
          '' AS "ORDEN",
          '' AS "Centro de beneficio C(010) PRCTR",
          tel."supplierNit" AS "Asignacion C(018) ZUONR",
          UPPER(CONCAT(tel."invoiceNumber",' ',ec.description,' ', tel.city, ' ', tel.municipality, ' ', ter."createdByName")) AS "Texto C(050) SGTXT"
        FROM travel_expense_requests ter
        INNER JOIN travel_expense_request_details terd ON ter.id = terd."travelExpenseRequestId"
        INNER JOIN travel_expense_legalizations tel ON tel."travelExpenseRequestId" = ter.id
          AND tel."travelExpenseRequestDetailId" = terd.id
        LEFT JOIN expense_category ec ON terd."categoryId" = ec.id
        LEFT JOIN tax_indicators ti ON tel."taxIndicatorId" = ti.id
        LEFT JOIN cost_centers cc ON ter."costCenterId" = cc.id
        WHERE ter."documentNumber" IN (${documentNumbersStr})

        UNION

        SELECT
          to_char(now(), 'DD/MM/YYYY') AS "Fe.contabilizacion DDMY(008) BUDAT",
          CONCAT('LEG', ter."documentNumber") AS "Referencia C(016) XBLNR",
          'GRAVAMENT A LOS MOVIMIENTOS FINANCIEROS' AS "Texto cab.documento C(025) BKTXT",
          '40' AS "Clave Contabilizacion C(002) NEWBS",
          COALESCE((SELECT value FROM app_settings WHERE key = 'cuenta_contable_archivo_sap_gravamen_financiero'), '0') AS "Cuenta Contable,C(010),NEWKO",
          '' AS "CME C(001) NEWUM",
          '' AS "Cuenta de mayor C(010) HKONT",
          COALESCE(SUM(tel."amountApproved" - tel."taxAmount" - tel."consumptionTaxAmount" - tel."tipAmount"), 0)
            * COALESCE((SELECT value FROM app_settings WHERE key = 'gravamen_a_los_movimientos_financieros_porcentaje')::NUMERIC / 1000, 0) AS "Importe Mon C(020) WRBTR",
          ti.code AS "Indicador impuestos C(002) MWSKZ",
          '' AS "Importe Impuesto C(013) FWSTE",
          cc."centerCode" AS "Centro de costo C(010) KOSTL",
          '' AS "ORDEN",
          '' AS "Centro de beneficio C(010) PRCTR",
          tel."supplierNit" AS "Asignacion C(018) ZUONR",
          UPPER(CONCAT(tel."invoiceNumber",' ',ec.description,' ', tel.city, ' ', tel.municipality, ' ', ter."createdByName")) AS "Texto C(050) SGTXT"
        FROM travel_expense_requests ter
        INNER JOIN travel_expense_request_details terd ON ter.id = terd."travelExpenseRequestId"
        INNER JOIN travel_expense_legalizations tel ON tel."travelExpenseRequestId" = ter.id
          AND tel."travelExpenseRequestDetailId" = terd.id
        LEFT JOIN expense_category ec ON terd."categoryId" = ec.id
        LEFT JOIN tax_indicators ti ON tel."taxIndicatorId" = ti.id
        LEFT JOIN cost_centers cc ON ter."costCenterId" = cc.id
        WHERE ter."documentNumber" IN (${documentNumbersStr})
        GROUP BY tel.id, ter."documentNumber", ti.code, cc."centerCode", tel."supplierNit",
                 tel."invoiceNumber", ec.description, tel.city, tel.municipality, ter."createdByName"

        UNION

        SELECT
          to_char(now(), 'DD/MM/YYYY') AS "Fe.contabilizacion DDMY(008) BUDAT",
          CONCAT('LEG', ter."documentNumber") AS "Referencia C(016) XBLNR",
          'COMISIONES BANCARIAS' AS "Texto cab.documento C(025) BKTXT",
          '40' AS "Clave Contabilizacion C(002) NEWBS",
          (SELECT value FROM app_settings WHERE key = 'cuenta_contable_archivo_sap_comision_por_retiro') AS "Cuenta Contable,C(010),NEWKO",
          '' AS "CME C(001) NEWUM",
          '' AS "Cuenta de mayor C(010) HKONT",
          CASE
            WHEN ter."cashWithdrawal" = FALSE
            THEN (SELECT value FROM app_settings WHERE key = 'comision_por_retiro')::NUMERIC
            ELSE 0
          END AS "Importe Mon C(020) WRBTR",
          ti.code AS "Indicador impuestos C(002) MWSKZ",
          '' AS "Importe Impuesto C(013) FWSTE",
          cc."centerCode" AS "Centro de costo C(010) KOSTL",
          '' AS "ORDEN",
          '' AS "Centro de beneficio C(010) PRCTR",
          tel."supplierNit" AS "Asignacion C(018) ZUONR",
          UPPER(CONCAT(tel."invoiceNumber",' ',ec.description,' ', tel.city, ' ', tel.municipality, ' ', ter."createdByName")) AS "Texto C(050) SGTXT"
        FROM travel_expense_requests ter
        INNER JOIN travel_expense_request_details terd ON ter.id = terd."travelExpenseRequestId"
        INNER JOIN travel_expense_legalizations tel ON tel."travelExpenseRequestId" = ter.id
          AND tel."travelExpenseRequestDetailId" = terd.id
        LEFT JOIN expense_category ec ON terd."categoryId" = ec.id
        LEFT JOIN tax_indicators ti ON tel."taxIndicatorId" = ti.id
        LEFT JOIN cost_centers cc ON ter."costCenterId" = cc.id
        WHERE ter."documentNumber" IN (${documentNumbersStr})
        GROUP BY ter."cashWithdrawal", tel.id, ter."documentNumber", ti.code, cc."centerCode",
                 tel."supplierNit", tel."invoiceNumber", ec.description, tel.city, tel.municipality, ter."createdByName"
      ),
      resultado AS (
        SELECT * FROM detalle

        UNION ALL

        SELECT
          to_char(now(), 'DD/MM/YYYY') AS "Fe.contabilizacion DDMY(008) BUDAT",
          CONCAT('LEG', (SELECT REPLACE(MAX("Referencia C(016) XBLNR"), 'LEG', '') FROM detalle)) AS "Referencia C(016) XBLNR",
          'GASTOS DE VIAJE' AS "Texto cab.documento C(025) BKTXT",
          '39' AS "Clave Contabilizacion C(002) NEWBS",
          (SELECT value FROM app_settings WHERE key = 'cuenta_contable_archivo_sap_contrapartida') AS "Cuenta ContableC(010) NEWKO",
          'Z' AS "CME C(001) NEWUM",
          '' AS "Cuenta de mayor C(010) HKONT",
          SUM("Importe Mon C(020) WRBTR")::NUMERIC AS "Importe Mon C(020) WRBTR",
          '' AS "Indicador impuestos C(002) MWSKZ",
          '' AS "Importe Impuesto C(013) FWSTE",
          '' AS "Centro de costo C(010) KOSTL",
          '' AS "ORDEN",
          (SELECT MAX("Centro de costo C(010) KOSTL") FROM detalle) AS "Centro de beneficio,C(010) PRCTR",
          '' AS "Asignacion C(018) ZUONR",
          CONCAT('LEG.ANT.', (SELECT REPLACE(MAX("Referencia C(016) XBLNR"), 'LEG', '') FROM detalle)) AS "Texto C(050) SGTXT"
        FROM detalle
      )
      SELECT * FROM resultado res WHERE res."Importe Mon C(020) WRBTR">0
    `;

    try {
      const results = await this.dataSource.query(query1);

      if (!results || results.length === 0) {
        throw new NotFoundException('No se encontraron datos para los números de documento proporcionados');
      }

      return await this.convertToExcel(results);
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      const errorMessage = error instanceof Error ? error.message : 'Error desconocido';
      throw new BadRequestException(`Error generando archivo SAP: ${errorMessage}`);
    }
  }

  private async convertToExcel(data: Record<string, unknown>[]): Promise<Buffer> {
    const workbook = new ExcelJS.Workbook();
    const sheet = workbook.addWorksheet('SAP');

    if (data.length > 0) {
      const headers = Object.keys(data[0]);

      // Header row
      const headerRow = sheet.addRow(headers);
      headerRow.eachCell(cell => {
        cell.font = { bold: true };
      });

      // Data rows
      for (const row of data) {
        sheet.addRow(headers.map(h => row[h] ?? ''));
      }

      // Auto-fit column widths
      sheet.columns.forEach((col, i) => {
        const maxLength = Math.max(
          headers[i].length,
          ...data.map(row => String(row[headers[i]] ?? '').length),
        );
        col.width = Math.min(maxLength + 2, 60);
      });
    }

    return Buffer.from(await workbook.xlsx.writeBuffer());
  }
}
