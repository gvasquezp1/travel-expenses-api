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
    'impuesto',
    'impuesto al consumo',
    'Impoconsumo',
    'impuesto consumo',
    'impuesto al valor agregado',
    'iva 19%',
    'iva 5%',
    'iva 0%'
  ],
  tip: [
    'propina',
    'propinas',
    'total propina',
    'total propinas',
    'propina total',
    'propinas total'
  ],
  total: [
    'total',
    'total a pagar',
    'importe total'
  ]
};