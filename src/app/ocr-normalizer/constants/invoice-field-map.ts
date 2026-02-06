export const FIELD_SYNONYMS: Record<string, string[]> = {
  invoiceNumber: [
    'factura',
    'factura de venta',
    'nro',
    'no',
    'numero',
    'doc',
    'documento',
    'consecutivo'
  ],
  supplierNit: [
    'nit',
    'c.c',
    'cc nit',
    'rut',
    'identificacion'
  ],
  supplierName: [
    'razon social',
    'razon social/nombre',
    'nombre',
    'cliente',
    'proveedor'
  ],
  address: [
    'direccion',
    'dirección'
  ],
  date: [
    'fecha',
    'fecha emision',
    'fecha emisión',
    'fecha :'
  ],
  subtotal: ['subtotal'],
  tax: [
    'iva',
    'iv iva',
    'total iva',
    'impuesto'
  ],
  total: [
    'total',
    'total a pagar',
    'importe total'
  ]
};