# AGENTS.md - Sys-Inventory-VEN911

## Project Overview

Electron + React desktop application for inventory management (Sistema de Inventario VEN 9-1-1). Uses MySQL database
with Sequelize ORM.

## Build & Development Commands

```bash
# Install dependencies
npm install

# Run development mode (Vite + Electron)
npm run dev

# Build for production (renderer + Electron)
npm run build

# Build Windows installer (64-bit)
npm run build:installer

# Build Windows installer (32-bit)
npm run build:installer:32

# Build Windows installer (both architectures)
npm run build:installer:all

# Lint code
npm run lint

# Preview production build
npm run preview
```

## Testing

No test framework is currently configured. When adding tests, use the pattern `*.test.jsx` or `*.spec.jsx` in the
appropriate directories.

## Code Style Guidelines

### File Structure

- **Components**: `src/components/` - reusable UI components
- **Pages**: `src/pages/` - route-level components (grouped by feature)
- **Store**: `src/store/` - Zustand state management
- **Hooks**: `src/hooks/` - custom React hooks
- **Lib**: `src/lib/` - utilities (e.g., `cn()` for class merging)
- **Electron Main**: `electron/` - main process, IPC, models, services

### Imports

- Use `@/` alias for `src/` directory imports
- Group imports: React/core libs first, then external libs, then local modules
- Use double quotes for import paths

```jsx
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
```

### Formatting

- **Files**: Use `.jsx` extension (not TypeScript)
- **Indentation**: 4 spaces (tabs not used)
- **Semicolons**: Required at end of statements
- **Quotes**: Double quotes for imports, double or single in JSX attrs
- **Line endings**: Unix-style (LF)

### Naming Conventions

- **Components**: PascalCase (e.g., `DataTable`, `SidebarNav`, `AccessoryCard`)
- **Files**:
    - UI components in `components/ui/`: lowercase (e.g., `button.jsx`, `badge.jsx`)
    - Feature components: PascalCase (e.g., `AccessoryCard.jsx`, `SearchAccessory.jsx`)
    - Pages: PascalCase with `Page` suffix (e.g., `DashboardPage.jsx`, `ComputersPage.jsx`)
    - Stores: camelCase with `use` prefix (e.g., `useAuthStore.js`, `useNavigationStore.js`)
- **Functions**: camelCase (e.g., `loadAuthFromStorage`, `initDatabase`)
- **Constants**: camelCase or UPPER_SNAKE_CASE for true constants
- **Database Models**: PascalCase (e.g., `ComputerModel`, `UserModel`)

### Component Patterns

- Use function components with arrow or function declaration
- Export named or default based on component usage
- Use `clsx` + `tailwind-merge` via `cn()` utility for conditional classes

```jsx
import { cn } from '@/lib/utils';

function Button({ className, variant, ...props }) {
    return <button className={cn(buttonVariants({ variant }), className)} {...props} />;
}
```

### State Management

- Use Zustand for global state (`src/store/`)
- Use React hooks for local state
- Persist auth state to `localStorage` with key `'auth-storage'`

### Styling

- Tailwind CSS v4 utility classes
- Use `class-variance-authority` (cva) for component variants
- Base styles in `src/global.css`
- Follow shadcn/ui patterns for UI components

### Error Handling

- Use try/catch blocks for async operations
- Log errors with `console.error` (Electron main process)
- Return boolean/error objects from services, don't throw unless necessary
- IPC handlers should wrap operations in try/catch

```jsx
try {
    await sequelize.authenticate();
    return true;
} catch (error) {
    console.error('Error al conectar a MySQL:', error);
    return false;
}
```

### Database (Electron/Sequelize)

- Models in `electron/models/` - define with `sequelize.define()`
- Services in `electron/services/` - business logic and DB operations
- IPC handlers in `electron/IPCs/` - bridge between main and renderer
- Sync order matters: sync tables without foreign keys first
- Use `alter: true` for model syncing (development)

### Internationalization

- UI text is primarily in Spanish (e.g., "Cargando...", "Guardar")
- Code comments mix Spanish and English

### ESLint

- ESLint config in `eslint.config.js`
- Extends: recommended, react-hooks, react-refresh/vite
- `react-hooks/exhaustive-deps` is disabled
- Unused vars allowed for uppercase (constants pattern)

## Notes

- No Cursor rules (`.cursorrules` or `.cursor/rules/`) configured
- No GitHub Copilot instructions (`.github/copilot-instructions.md`) configured
- Node.js 20+ and MySQL 8.0+ required
- Database name must be `sys_ven911`
