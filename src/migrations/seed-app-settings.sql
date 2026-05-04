-- Seed para configuraciones de la aplicación
-- Ejecutar después de crear la tabla app_settings

-- Configuraciones del grupo 'retiros'
INSERT INTO app_settings (key, value, type, description, "group", "isEditable", "createdAt", "updatedAt")
VALUES 
  (
    'valor_del_retiro',
    '3000',
    'number',
    'Valor monetario del retiro en la moneda base',
    'retiros',
    true,
    NOW(),
    NOW()
  ),
  (
    'aplica_4x1000',
    'true',
    'boolean',
    'Indica si se aplica el impuesto 4x1000 en las transacciones',
    'retiros',
    true,
    NOW(),
    NOW()
  );

-- Configuraciones del grupo 'general'
INSERT INTO app_settings (key, value, type, description, "group", "isEditable", "createdAt", "updatedAt")
VALUES 
  (
    'nombre_aplicacion',
    'Travel Expenses System',
    'string',
    'Nombre de la aplicación',
    'general',
    true,
    NOW(),
    NOW()
  ),
  (
    'max_archivos_upload',
    '10',
    'number',
    'Número máximo de archivos permitidos en una carga',
    'general',
    true,
    NOW(),
    NOW()
  );

-- Configuración tipo JSON
INSERT INTO app_settings (key, value, type, description, "group", "isEditable", "createdAt", "updatedAt")
VALUES 
  (
    'formatos_permitidos',
    '["pdf","jpg","png","xlsx"]',
    'json',
    'Formatos de archivo permitidos para uploads',
    'archivos',
    true,
    NOW(),
    NOW()
  );

-- Configuración no editable (sistema)
INSERT INTO app_settings (key, value, type, description, "group", "isEditable", "createdAt", "updatedAt")
VALUES 
  (
    'version_sistema',
    '1.0.0',
    'string',
    'Versión actual del sistema',
    'sistema',
    false,
    NOW(),
    NOW()
  );
