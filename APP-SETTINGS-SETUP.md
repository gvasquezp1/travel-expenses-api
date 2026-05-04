# 🎉 Módulo de Configuraciones - Instalación Completa

## ✅ Archivos Creados

Se ha implementado un módulo completo de configuraciones generales para tu aplicación. Los siguientes archivos han sido creados:

### Estructura del módulo:
```
src/app/app-settings/
├── dto/
│   ├── create-app-setting.dto.ts    ✅ DTO para crear configuraciones
│   └── update-app-setting.dto.ts    ✅ DTO para actualizar configuraciones
├── entities/
│   └── app-setting.entity.ts        ✅ Entidad TypeORM con campos tipados
├── app-settings.controller.ts       ✅ Controlador REST con 6 endpoints
├── app-settings.service.ts          ✅ Servicio con toda la lógica de negocio
├── app-settings.module.ts           ✅ Módulo NestJS
└── README.md                        ✅ Documentación completa del módulo

src/migrations/
├── 1714000000000-create-app-settings-table.ts  ✅ Migración TypeORM
└── seed-app-settings.sql                        ✅ Datos de ejemplo

src/app/app.module.ts                ✅ Actualizado con AppSettingsModule
```

## 🚀 Pasos para activar el módulo

### 1. La tabla se creará automáticamente
Como tienes `synchronize: true` en tu configuración de TypeORM, la tabla `app_settings` se creará automáticamente al iniciar la aplicación.

### 2. Iniciar el backend

```bash
npm run start:prod
```

### 3. (Opcional) Insertar datos de ejemplo

Si deseas cargar las configuraciones de ejemplo (valor_del_retiro, aplica_4x1000, etc.):

**Opción A - Usando SQL directamente:**
```bash
psql -U tu_usuario -d tu_base_de_datos -f src/migrations/seed-app-settings.sql
```

**Opción B - Usando los endpoints REST:**
```bash
# Crear valor_del_retiro
curl -X POST http://localhost:3000/settings \
  -H "Content-Type: application/json" \
  -d '{
    "key": "valor_del_retiro",
    "value": "3000",
    "type": "number",
    "description": "Valor monetario del retiro en la moneda base",
    "group": "retiros"
  }'

# Crear aplica_4x1000
curl -X POST http://localhost:3000/settings \
  -H "Content-Type: application/json" \
  -d '{
    "key": "aplica_4x1000",
    "value": "true",
    "type": "boolean",
    "description": "Indica si se aplica el impuesto 4x1000",
    "group": "retiros"
  }'
```

## 📋 Endpoints Disponibles

Una vez que el backend esté corriendo, tendrás acceso a:

| Método | Endpoint | Descripción |
|--------|----------|-------------|
| GET | `/settings` | Obtener todas las configuraciones |
| GET | `/settings/:key` | Obtener una configuración específica |
| GET | `/settings/:key/value` | Obtener solo el valor parseado |
| POST | `/settings` | Crear nueva configuración |
| PATCH | `/settings/:key` | Actualizar configuración |
| DELETE | `/settings/:key` | Eliminar configuración |

## ✨ Ejemplos de Uso

### Obtener todas las configuraciones
```bash
curl http://localhost:3000/settings
```

### Obtener una configuración específica
```bash
curl http://localhost:3000/settings/valor_del_retiro
```

Respuesta:
```json
{
  "id": 1,
  "key": "valor_del_retiro",
  "value": "3000",
  "type": "number",
  "parsedValue": 3000,
  "description": "Valor monetario del retiro",
  "group": "retiros",
  "isEditable": true,
  "createdAt": "2026-04-29T19:00:00.000Z",
  "updatedAt": "2026-04-29T19:00:00.000Z"
}
```

### Obtener solo el valor parseado
```bash
curl http://localhost:3000/settings/aplica_4x1000/value
```

Respuesta:
```json
{
  "key": "aplica_4x1000",
  "value": true
}
```

### Actualizar una configuración
```bash
curl -X PATCH http://localhost:3000/settings/valor_del_retiro \
  -H "Content-Type: application/json" \
  -d '{"value": "5000"}'
```

## 🔧 Uso desde Angular

Desde tu frontend Angular, puedes consumir estos endpoints así:

```typescript
// settings.service.ts
export class SettingsService {
  private apiUrl = 'http://localhost:3000/settings';

  constructor(private http: HttpClient) {}

  getAllSettings() {
    return this.http.get<any[]>(this.apiUrl);
  }

  getSetting(key: string) {
    return this.http.get<any>(`${this.apiUrl}/${key}`);
  }

  getSettingValue(key: string) {
    return this.http.get<{key: string, value: any}>(`${this.apiUrl}/${key}/value`);
  }

  createSetting(data: any) {
    return this.http.post(this.apiUrl, data);
  }

  updateSetting(key: string, data: any) {
    return this.http.patch(`${this.apiUrl}/${key}`, data);
  }

  deleteSetting(key: string) {
    return this.http.delete(`${this.apiUrl}/${key}`);
  }
}
```

## 🎯 Tipos de Datos Soportados

| Tipo | Almacenamiento | Valor Parseado | Ejemplo |
|------|----------------|----------------|---------|
| `string` | `"texto"` | `"texto"` | `"Travel Expenses"` |
| `number` | `"3000"` | `3000` | `3000` |
| `boolean` | `"true"` | `true` | `true` o `false` |
| `json` | `"[1,2,3]"` | `[1,2,3]` | Arrays u objetos JSON |

## 🛡️ Validaciones Incluidas

✅ Key única (no se pueden duplicar)  
✅ Validación de tipo (number debe ser numérico, boolean debe ser "true"/"false", etc.)  
✅ Configuraciones no editables (isEditable: false)  
✅ Manejo de errores con excepciones NestJS (NotFoundException, ConflictException, etc.)

## 📖 Documentación Completa

Para más detalles, consulta el archivo:
```
src/app/app-settings/README.md
```

Contiene:
- Ejemplos completos de cada endpoint
- Uso programático del servicio
- Validaciones y reglas de negocio
- Ejemplos de testing
- Y mucho más!

## 🎊 ¡Listo para usar!

El módulo está completamente integrado y listo para usar. Solo inicia tu backend y comienza a crear configuraciones.

**Comando para iniciar:**
```bash
npm run start:prod
```

**Verificar que funciona:**
```bash
curl http://localhost:3000/settings
```

Si recibes un array vacío `[]`, todo está funcionando correctamente. Ahora puedes empezar a crear configuraciones! 🚀
