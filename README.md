# Obsidian API Bridge Plugin

A plugin for Obsidian that allows you to execute API endpoints directly from the app, with robust validation and a modular architecture.

---

## 🏗️ Architecture

The plugin is structured following principles of separation of concerns and modularity:

### 📁 Directory Structure

```
src/
├── constants/           # Centralized constants and configurations
├── core/               # Core business logic
│   ├── api/           # API-related logic
│   ├── endpoint/      # Endpoint-specific logic
│   ├── input-handler.ts
│   └── logger.ts
├── services/          # High-level services
│   ├── EndpointService.ts    # Endpoint management
│   ├── CommandService.ts     # Obsidian command management
│   └── EventService.ts       # Trigger and event handling
├── types/             # TypeScript definitions
├── ui/                # User interface components
├── utils/             # Helpers and utilities
└── main.ts           # Plugin entry point
```

---

### 🔧 Core Services

#### EndpointService

* **Responsibility**: Full lifecycle management of endpoints (CRUD, validation, execution)
* **Features**:

  * Strong endpoint validation
  * Safe execution of HTTP requests
  * Centralized error handling
  * Persistent storage

#### CommandService

* **Responsibility**: Managing plugin commands in Obsidian
* **Features**:

  * Dynamic registration of commands
  * Automatic cleanup of obsolete commands
  * Integration with Obsidian’s command system

#### EventService

* **Responsibility**: Automatic triggers and event handling
* **Features**:

  * Event-based execution (on note open/save/select)
  * Automatic endpoint execution
  * Context-aware behavior

---

### 🛡️ Endpoint Validation

The plugin includes a robust validation system for each endpoint:

```ts
// Example
const validator = new EndpointValidator();
const result = validator.validate(endpoint);

if (!result.isValid) {
	console.log("Errors:", result.errors);
}
```

**Validated Fields:**

* ✅ Unique ID and proper format
* ✅ Valid URL
* ✅ Supported HTTP method
* ✅ Valid headers
* ✅ JSON-valid body template
* ✅ Valid trigger types
* ✅ Valid insert actions

---

### 🎯 Logic/UI Separation

Architecture ensures clear separation between business logic and UI:

* **Business Logic**: In `services/` and `core/`
* **User Interface**: In `ui/`
* **Communication**: Via well-defined interfaces

---

## 🚀 Features

### ✨ Core Functionality

1. **Endpoint Management**

   * Create, edit, and delete endpoints
   * Auto-validation
   * Import/export configurations

2. **API Execution**

   * Supports multiple HTTP methods
   * Customizable headers
   * Dynamic body templates
   * Flexible response handling

3. **Automatic Triggers**

   * Manual (via command)
   * On note open
   * On note save
   * On text selection

4. **Response Handling**

   * Display in modal
   * Copy to clipboard
   * Insert into active note
   * Create new note
   * Toast notification

---

### 🔒 Security & Validation

* Complete URL validation
* Header sanitization
* JSON body validation
* Token safety and injection
* Configurable timeouts

---

### 📊 Logging & Monitoring

* Detailed execution logs
* Centralized error handling
* Informative notices
* Enhanced debugging support

---

## 🛠️ Development

### Requirements

* Node.js 16+
* TypeScript
* Obsidian API

### Installation

```bash
npm install
```

### Build

```bash
npm run build
```

### Development Mode

```bash
npm run dev
```

---

## 📝 Usage

### Basic Configuration

1. Enable the plugin in Obsidian
2. Go to Settings → API Bridge
3. Create a new endpoint
4. Set URL, method, headers, etc.
5. Save and test it

### Example Endpoint

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

---

## 🤝 Contributing

1. Fork the repository
2. Create a branch for your feature
3. Implement your changes following the current architecture
4. Add tests if applicable
5. Submit a Pull Request

---

## 📄 License

MIT License – see [LICENSE](LICENSE) for details.

---

## 🔄 Changelog

### v1.0.0

* ✅ Complete code restructuring
* ✅ Separation of logic and UI
* ✅ Robust endpoint validation
* ✅ Modular architecture with services
* ✅ Improved error handling
* ✅ Centralized notification system
