# Gestión de Tareas

Aplicación web para gestionar tareas personales o de equipo, construida con **Angular 21** y **Angular Material**. Permite crear, editar, eliminar y organizar tareas por estado y prioridad desde dos vistas distintas: tabla y tablero Kanban.

## Tecnologías

- [Angular 21](https://angular.dev/) — framework principal
- [Angular Material](https://material.angular.io/) — componentes UI
- [Angular CDK Drag & Drop](https://material.angular.io/cdk/drag-drop/overview) — arrastrar tarjetas en el Kanban
- [JSON Server](https://github.com/typicode/json-server) — API REST simulada con `db.json`
- [Vitest](https://vitest.dev/) — runner de pruebas unitarias

## Estructura del proyecto

```
src/app/
├── models/
│   └── task.ts           # Interfaz Task
├── services/
│   └── task.ts           # TaskService — CRUD contra la API
└── pages/
    ├── inicio/           # Página de bienvenida
    ├── tareas/           # Vista de tabla con formulario de alta
    ├── kanban/           # Tablero Kanban con drag & drop
    └── acerca/           # Información sobre la aplicación
```

## Modelo de datos

```typescript
interface Task {
  id: string;
  titulo: string;
  estado: 'Pendiente' | 'En Progreso' | 'Completada';
  prioridad: 'Alta' | 'Media' | 'Baja';
  fechaCreacion: string;   // YYYY-MM-DD
  descripcion: string;
}
```

## Instalación

```bash
npm install
```

## Levantar el proyecto

El comando `dev` inicia la API y el servidor de Angular al mismo tiempo:

```bash
npm run dev
```

| Servicio | URL |
|----------|-----|
| Aplicación Angular | http://localhost:4200 |
| API REST (json-server) | http://localhost:3000/tareas |

### Comandos individuales

```bash
npm run start   # Solo Angular (ng serve)
npm run api     # Solo JSON Server en el puerto 3000
```

## Rutas de la aplicación

| Ruta | Componente | Descripción |
|------|-----------|-------------|
| `/` | Inicio | Página principal |
| `/tareas` | Tareas | Tabla con CRUD completo |
| `/kanban` | Kanban | Tablero con drag & drop y auto-refresco cada 5 s |
| `/acerca` | Acerca | Información del proyecto |

## Funcionalidades principales

### Vista Tareas (`/tareas`)
- Formulario para crear nuevas tareas (título, estado, prioridad, fecha, descripción)
- Tabla con todas las tareas usando `MatTable`
- Cambio de estado cíclico: Pendiente → En Progreso → Completada → Pendiente
- Eliminación con confirmación
- Contadores de tareas por prioridad

### Vista Kanban (`/kanban`)
- Tres columnas: **Pendiente**, **En Progreso**, **Completada**
- Arrastrar y soltar tarjetas entre columnas (CDK Drag & Drop)
- Botones de avance/retroceso de estado por tarjeta
- Auto-refresco de datos cada 5 segundos via `timer` + `switchMap`
- Limpieza de suscripciones en `ngOnDestroy` para evitar memory leaks

## Pruebas

```bash
npm test
```

## Build de producción

```bash
npm run build
```

Los artefactos quedan en `dist/`.
