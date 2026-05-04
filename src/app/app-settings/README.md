# App Settings Module

Módulo de configuraciones generales para la aplicación Travel Expenses API. Permite manejar configuraciones de forma dinámica usando un modelo key-value tipado.

## 📁 Estructura de carpetas

```
src/app/app-settings/
├── dto/
│   ├── create-app-setting.dto.ts
│   └── update-app-setting.dto.ts
├── entities/
│   └── app-setting.entity.ts
├── app-settings.controller.ts
├── app-settings.service.ts
├── app-settings.module.ts
└── README.md
```

## 🚀 Instalación y Configuración

### 1. Importar el módulo en `app.module.ts`

```typescript
import { Module } from '@nestjs/common';
import { AppSettingsModule } from './app-settings/app-settings.module';

@Module({
  imports: [
    // ... otros imports
    AppSettingsModule,
  ],
})
export class AppModule {}
```

### 2. Ejecutar la migración

```bash
# Generar la tabla en la base de datos
npm run typeorm migration:run
```

### 3. Insertar datos iniciales (opcional)

```bash
# Ejecutar el archivo seed SQL
psql -U your_user -d your_database -f src/migrations/seed-app-settings.sql
```

## 📊 Tipos de datos soportados

El módulo soporta 4 tipos de configuraciones:

| Tipo | Descripción | Ejemplo de valor |
|------|-------------|------------------|
| `string` | Texto simple | `"Travel Expenses System"` |
| `number` | Números enteros o decimales | `"3000"` |
| `boolean` | Verdadero o falso | `"true"` o `"false"` |
| `json` | Objetos JSON válidos | `"[\"pdf\",\"jpg\",\"png\"]"` |

**Nota:** Todos los valores se almacenan como `string` en la base de datos y se parsean al tipo correspondiente.

## 🔌 Endpoints disponibles

### 1. Crear una configuración

**POST** `/settings`

```json
{
  "key": "valor_del_retiro",
  "value": "3000",
  "type": "number",
  "description": "Valor monetario del retiro",
  "group": "retiros",
  "isEditable": true
}
```

**Respuesta:**
```json
{
  "id": 1,
  "key": "valor_del_retiro",
  "value": "3000",
  "type": "number",
  "description": "Valor monetario del retiro",
  "group": "retiros",
  "isEditable": true,
  "parsedValue": 3000,
  "createdAt": "2026-04-29T19:00:00.000Z",
  "updatedAt": "2026-04-29T19:00:00.000Z"
}
```

### 2. Obtener todas las configuraciones

**GET** `/settings`

**Respuesta:**
```json
[
  {
    "id": 1,
    "key": "valor_del_retiro",
    "value": "3000",
    "type": "number",
    "parsedValue": 3000,
    "group": "retiros",
    ...
  },
  {
    "id": 2,
    "key": "aplica_4x1000",
    "value": "true",
    "type": "boolean",
    "parsedValue": true,
    "group": "retiros",
    ...
  }
]
```

### 3. Obtener una configuración por key

**GET** `/settings/:key`

```bash
GET /settings/valor_del_retiro
```

**Respuesta:**
```json
{
  "id": 1,
  "key": "valor_del_retiro",
  "value": "3000",
  "type": "number",
  "parsedValue": 3000,
  ...
}
```

### 4. Obtener solo el valor parseado

**GET** `/settings/:key/value`

```bash
GET /settings/valor_del_retiro/value
```

**Respuesta:**
```json
{
  "key": "valor_del_retiro",
  "value": 3000
}
```

### 5. Actualizar una configuración

**PATCH** `/settings/:key`

```json
{
  "value": "5000",
  "description": "Nuevo valor del retiro"
}
```

**Respuesta:**
```json
{
  "id": 1,
  "key": "valor_del_retiro",
  "value": "5000",
  "parsedValue": 5000,
  ...
}
```

### 6. Eliminar una configuración

**DELETE** `/settings/:key`

**Respuesta:** `204 No Content`

## 🛡️ Validaciones y Reglas

### Validaciones de tipo

- **number**: El valor debe poder convertirse a número válido (no NaN)
- **boolean**: El valor debe ser exactamente `"true"` o `"false"`
- **json**: El valor debe ser JSON válido
- **string**: Acepta cualquier texto

### Reglas de negocio

1. **Key única**: No se pueden crear dos configuraciones con la misma key
2. **isEditable**: Si una configuración tiene `isEditable: false`, no se puede actualizar ni eliminar
3. **Validación de tipo**: Al crear o actualizar, se valida que el valor corresponda al tipo especificado

### Manejo de errores

| Código | Error | Descripción |
|--------|-------|-------------|
| `404` | NotFoundException | La configuración no existe |
| `409` | ConflictException | Ya existe una configuración con esa key |
| `400` | BadRequestException | El valor no corresponde al tipo especificado |
| `403` | ForbiddenException | La configuración no es editable |

## 💡 Ejemplos de uso

### Crear configuración tipo NUMBER

```bash
curl -X POST http://localhost:3000/settings \
  -H "Content-Type: application/json" \
  -d '{
    "key": "valor_del_retiro",
    "value": "3000",
    "type": "number",
    "description": "Valor monetario del retiro",
    "group": "retiros"
  }'
```

### Crear configuración tipo BOOLEAN

```bash
curl -X POST http://localhost:3000/settings \
  -H "Content-Type: application/json" \
  -d '{
    "key": "aplica_4x1000",
    "value": "true",
    "type": "boolean",
    "description": "Aplica impuesto 4x1000",
    "group": "retiros"
  }'
```

### Crear configuración tipo JSON

```bash
curl -X POST http://localhost:3000/settings \
  -H "Content-Type: application/json" \
  -d '{
    "key": "formatos_permitidos",
    "value": "[\"pdf\",\"jpg\",\"png\"]",
    "type": "json",
    "description": "Formatos de archivo permitidos",
    "group": "archivos"
  }'
```

### Crear configuración tipo STRING

```bash
curl -X POST http://localhost:3000/settings \
  -H "Content-Type: application/json" \
  -d '{
    "key": "nombre_aplicacion",
    "value": "Travel Expenses System",
    "type": "string",
    "group": "general"
  }'
```

### Actualizar una configuración

```bash
curl -X PATCH http://localhost:3000/settings/valor_del_retiro \
  -H "Content-Type: application/json" \
  -d '{
    "value": "5000"
  }'
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

## 🔧 Uso programático del servicio

Si necesitas usar el servicio en otro módulo de tu aplicación:

### 1. Importar el módulo

```typescript
import { Module } from '@nestjs/common';
import { AppSettingsModule } from '../app-settings/app-settings.module';

@Module({
  imports: [AppSettingsModule],
  // ...
})
export class MiModulo {}
```

### 2. Inyectar el servicio

```typescript
import { Injectable } from '@nestjs/common';
import { AppSettingsService } from '../app-settings/app-settings.service';

@Injectable()
export class MiServicio {
  constructor(
    private readonly appSettingsService: AppSettingsService,
  ) {}

  async obtenerValorRetiro() {
    // Obtener el valor parseado directamente
    const valor = await this.appSettingsService.getParsedValue('valor_del_retiro');
    console.log(valor); // 3000 (como number)
    
    // O obtener la configuración completa
    const setting = await this.appSettingsService.findByKey('aplica_4x1000');
    const aplica = this.appSettingsService.parseValue(setting.value, setting.type);
    console.log(aplica); // true (como boolean)
  }
}
```

## 📝 Notas importantes

1. **Valores como string**: Aunque los valores se almacenan como `string` en la base de datos, el campo `parsedValue` en las respuestas contiene el valor convertido al tipo correcto.

2. **Configuraciones del sistema**: Usa `isEditable: false` para configuraciones que no deberían modificarse manualmente (ejemplo: versión del sistema).

3. **Grupos**: Usa el campo `group` para organizar configuraciones relacionadas (retiros, archivos, general, etc.).

4. **Índices**: La tabla tiene índices en `key` y `group` para optimizar las búsquedas.

## 🧪 Testing

Ejemplos de prueba con diferentes tipos:

```bash
# Crear configuración NUMBER válida
POST /settings {"key":"test_number","value":"123.45","type":"number"}

# Crear configuración NUMBER inválida (lanza error)
POST /settings {"key":"test_number","value":"abc","type":"number"}

# Crear configuración BOOLEAN válida
POST /settings {"key":"test_bool","value":"true","type":"boolean"}

# Crear configuración BOOLEAN inválida (lanza error)
POST /settings {"key":"test_bool","value":"yes","type":"boolean"}

# Crear configuración JSON válida
POST /settings {"key":"test_json","value":"{\"name\":\"John\"}","type":"json"}

# Crear configuración JSON inválida (lanza error)
POST /settings {"key":"test_json","value":"not-json","type":"json"}
```

## 🤝 Contribución

Para agregar nuevos tipos de configuración:

1. Actualizar el enum `SettingType` en `entities/app-setting.entity.ts`
2. Agregar validación en `validateValueByType()` en `app-settings.service.ts`
3. Agregar lógica de parseo en `parseValue()` en `app-settings.service.ts`
4. Actualizar la migración y este README
