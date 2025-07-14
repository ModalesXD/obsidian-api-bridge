
# Obsidian API Bridge Plugin

Un plugin para Obsidian que permite ejecutar endpoints de API directamente desde la aplicación, con validación robusta y una arquitectura modular.

## 🏗️ Arquitectura

El plugin está estructurado siguiendo principios de separación de responsabilidades y modularidad:

### 📁 Estructura de Directorios

```
src/
├── constants/           # Constantes y configuraciones centralizadas
├── core/               # Lógica de negocio central
│   ├── api/           # Funcionalidades relacionadas con APIs
│   ├── endpoint/      # Lógica específica de endpoints
│   ├── input-handler.ts
│   └── logger.ts
├── services/          # Servicios de alto nivel
│   ├── EndpointService.ts    # Gestión de endpoints
│   ├── CommandService.ts     # Gestión de comandos
│   └── EventService.ts       # Gestión de eventos
├── types/             # Definiciones de tipos TypeScript
├── ui/                # Componentes de interfaz de usuario
├── utils/             # Utilidades y helpers
└── main.ts           # Punto de entrada del plugin
```

### 🔧 Servicios Principales

#### EndpointService
- **Responsabilidad**: Gestión completa de endpoints (CRUD, validación, ejecución)
- **Características**:
  - Validación robusta de endpoints
  - Ejecución segura de peticiones HTTP
  - Manejo de errores centralizado
  - Almacenamiento persistente

#### CommandService
- **Responsabilidad**: Gestión de comandos de Obsidian
- **Características**:
  - Registro dinámico de comandos
  - Limpieza automática de comandos obsoletos
  - Integración con el sistema de comandos de Obsidian

#### EventService
- **Responsabilidad**: Manejo de eventos y triggers automáticos
- **Características**:
  - Triggers basados en eventos de Obsidian
  - Ejecución automática de endpoints
  - Manejo de contextos específicos

### 🛡️ Validación de Endpoints

El sistema incluye validación completa de endpoints:

```typescript
// Ejemplo de validación
const validator = new EndpointValidator();
const result = validator.validate(endpoint);

if (!result.isValid) {
    console.log("Errores:", result.errors);
}
```

**Campos validados**:
- ✅ ID único y formato válido
- ✅ URL válida
- ✅ Método HTTP soportado
- ✅ Headers válidos
- ✅ Body template (JSON válido)
- ✅ Trigger types válidos
- ✅ Insert actions válidos

### 🎯 Separación de Lógica y UI

La arquitectura separa claramente la lógica de negocio de la interfaz de usuario:

- **Lógica de Negocio**: En `services/` y `core/`
- **Interfaz de Usuario**: En `ui/`
- **Comunicación**: A través de interfaces bien definidas

## 🚀 Características

### ✨ Funcionalidades Principales

1. **Gestión de Endpoints**
   - Crear, editar, eliminar endpoints
   - Validación automática
   - Importar/exportar configuraciones

2. **Ejecución de APIs**
   - Múltiples métodos HTTP
   - Headers personalizables
   - Body templates dinámicos
   - Manejo de respuestas flexible

3. **Triggers Automáticos**
   - Manual (comandos)
   - Al abrir notas
   - Al guardar notas
   - Al seleccionar texto

4. **Manejo de Respuestas**
   - Modal de notificación
   - Copiar al portapapeles
   - Insertar en nota activa
   - Crear nueva nota
   - Toast notifications

### 🔒 Seguridad y Validación

- Validación completa de URLs
- Sanitización de headers
- Validación de JSON
- Manejo seguro de tokens
- Timeouts configurables

### 📊 Logging y Monitoreo

- Logs de ejecución detallados
- Manejo de errores centralizado
- Notificaciones informativas
- Debugging mejorado

## 🛠️ Desarrollo

### Requisitos

- Node.js 16+
- TypeScript
- Obsidian API

### Instalación

```bash
npm install
```

### Compilación

```bash
npm run build
```

### Desarrollo

```bash
npm run dev
```

## 📝 Uso

### Configuración Básica

1. Activar el plugin en Obsidian
2. Ir a Configuración > API Bridge
3. Crear un nuevo endpoint
4. Configurar URL, método y headers
5. Guardar y probar

### Ejemplo de Endpoint

```json
{
  "id": "weather-api",
  "name": "Weather API",
  "url": "https://api.weatherapi.com/v1/current.json?key={{apiKey}}&q={{city}}",
  "method": "GET",
  "headers": {
    "Accept": "application/json"
  },
  "trigger": ["manual"],
  "insertResponseTo": "modal"
}
```

## 🤝 Contribución

1. Fork el repositorio
2. Crear una rama para tu feature
3. Implementar cambios siguiendo la arquitectura existente
4. Agregar tests si es necesario
5. Crear un Pull Request

## 📄 Licencia

MIT License - ver [LICENSE](LICENSE) para más detalles.

## 🔄 Changelog

### v1.0.0
- ✅ Restructuración completa del código
- ✅ Separación de lógica y UI
- ✅ Validación robusta de endpoints
- ✅ Arquitectura modular con servicios
- ✅ Manejo de errores mejorado
- ✅ Sistema de notificaciones centralizado
 