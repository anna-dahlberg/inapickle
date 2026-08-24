# AI Coding Agent Instructions for InAPickle

## Project Overview

**InAPickle** is a decision-making app that helps users randomly pick from lists of options. Built from a Figma design, it's a React + TypeScript + Vite application with Tailwind CSS styling and Radix UI components.

### Core Purpose
Users create "jars" of options (decision lists), save them to a "pantry" for reuse, and randomly select items using a slot machine animation. Think of it as a digital decision randomizer with persistent storage.

## Architecture & Key Components

### Screen-Based Navigation Model
The app uses a **single-screen state machine** (not routing). All screens are components conditionally rendered by `App.tsx` based on a `screen` state variable.

**Screen flow:**
- `splash` → `home` → (`oracle` | `picker` | `pantry` | `slot-machine`)
- Each screen receives callbacks (`onBack`, `onPickAPickle`, `onSaveToPantry`) for navigation

**Key screens** in src/app/components/:
- `SplashScreen`: Initial splash animation
- `HomeScreen`: Main menu with quick action buttons
- `PickerScreen`: Create/edit option lists with animated list management
- `PantryScreen`: View saved "jars" with pin/edit/delete actions
- `SlotMachineScreen`: Animated random picker with spinning animation
- `PickleOracle`: Advice/hint screen

### State Management

**App-level state** (src/app/App.tsx lines 28-52):
- `jars`: Persisted in `localStorage` as `pickle-jars` (JSON array of `Jar` objects)
- `pickerState` & `slotState`: Temp state for screen communication
- All state updates use `useCallback` to prevent unnecessary re-renders

**Jar data structure:**
```typescript
interface Jar {
  id: string;           // crypto.randomUUID()
  name: string;
  options: string[];
  pinned: boolean;
}
```

### Data Persistence
- Uses browser `localStorage` with key `pickle-jars`
- Automatically syncs jars array to storage via `useEffect` (src/app/App.tsx lines 36-38)
- Always parse stored data safely (try/catch fallback to empty array)

## Styling & Theme

### CSS Architecture
- **Tailwind CSS** via Vite plugin (required in vite.config even if not actively used)
- **shadcn/ui** components: All 50+ Radix UI primitives are installed but may not all be used
- **Theme variables** in src/styles/theme.css: OKLCH color system (modern, perceptually uniform)
- **Custom fonts** in src/styles/fonts.css

**Color reference** (theme.css):
- `--primary`: Deep purple (`#030213`)
- `--destructive`: Red (`#d4183d`)
- `--accent`: Soft gray (`#e9ebef`)
- Custom switches/inputs have their own vars (`--switch-background`, `--input-background`)

### Styling Patterns
- Use Tailwind utilities + theme CSS variables
- Radix UI components styled with custom CSS (not styled-components)
- No CSS Modules; global styles or component-scoped `<style>` tags

## Animation & Motion

**Key dependency:** `motion` (Framer Motion v12) for all animations.

**Common patterns:**
- `AnimatePresence` for exit animations on list items
- `motion` wrapper for entrance/smooth transitions
- Slot machine uses canvas-based spinning animation

Example from src/app/components/PickerScreen.tsx:
```tsx
import { motion, AnimatePresence } from "motion/react";
// Wrap JSX in motion.div with layout/animate props
<AnimatePresence>
  {options.map((option, i) => (
    <motion.div key={i} layout exit={{ opacity: 0 }} >
```

## Webapp Deployment Considerations

### Current Setup
- **Viewport:** Properly configured for mobile (index.html has `viewport` meta tag)
- **Responsive layout:** Max-width container at 440px width, full screen height (`min-h-screen` in App.tsx)
- **Mobile-first styling:** Tailwind utilities with touch-friendly interactions (`active:opacity-70` for buttons)
- **No PWA setup:** No service worker, manifest, or offline support currently

### Missing for Production Webapp
1. **PWA Manifest:** Add `manifest.webmanifest` with app icons, theme colors, display mode
2. **Service Worker:** Needed for offline functionality and caching strategy (especially localStorage sync)
3. **Apple Web App Meta Tags:** iOS homescreen support (`apple-mobile-web-app-*` tags)
4. **Touch Icons:** App icons for iOS/Android homescreen
5. **Data Backup/Export:** Currently no export mechanism for saved jars (localStorage only)
6. **Network Error Handling:** No fallbacks if app initialization fails
7. **Performance:** Check Lighthouse scores, consider code splitting for screens

### Recommended Additions
- Add `public/manifest.webmanifest` with app metadata
- Create basic service worker for cache-first strategy on static assets
- Add cloud sync option (Firebase, Supabase) for data persistence across devices
- Implement data export (JSON download) for user jars
- Add error boundaries for graceful crashes

## Development Workflow

### Build & Run
- **Dev server:** `npm run dev` (Vite hot reload)
- **Build:** `npm run build` (production bundle)
- No test framework configured; no CI/CD pipeline visible

### Custom Vite Plugin: Figma Asset Resolver
vite.config.ts (lines 6-15) includes `figmaAssetResolver()` to resolve imports like:
```typescript
import asset from 'figma:asset/filename.png';
// Resolves to src/assets/filename.png
```

This is specific to Figma design-to-code exports. Don't modify without understanding the asset pipeline.

## Code Patterns & Conventions

### Component Patterns
- **Functional components only** (no class components)
- **Props-based configuration:** Screens receive navigation callbacks + data
- **useRef for side effects:** Auto-scroll in lists after state changes (src/app/components/PickerScreen.tsx lines 26-30)
- **Custom SVG icons:** Built inline (see `PinIcon`, `EditIcon` in src/app/components/PantryScreen.tsx lines 22-39)

### Event Handling
- Button clicks use `useCallback` to preserve reference identity
- Keyboard events (Enter to submit) handled at input level
- No event delegation or custom event systems

### Conditional Rendering
- Use ternary operators, not `&&` chains (better type safety)
- Screen visibility controlled by `screen === 'target-screen'` check in App.tsx

## Webapp-Specific Patterns

### Touch & Mobile UX
- Buttons use `active:opacity-70` for visual feedback instead of hover states
- Avoid pointer-only interactions; ensure keyboard support for all actions (Enter key already handled in PickerScreen)
- Container is constrained to 440px max-width for optimal mobile UX (App.tsx line 193)
- Full viewport height prevents unintended scrolling (`min-h-screen`)

### Data Persistence Gotchas
- **Single-source truth:** localStorage is the only data store - no cloud sync or backup
- **No migration strategy:** Existing localStorage data won't auto-update if `Jar` interface changes
- **No export/import:** Users cannot backup or transfer data between devices
- **Storage limits:** Browser localStorage typically limited to 5-10MB; test with large jar collections

### Performance & Bundle Size
- Vite code splitting not configured - all screens bundled together
- Large dependencies like `canvas-confetti`, `embla-carousel-react` should be tree-shaken if unused
- Slot machine animation uses canvas confetti (GPU-accelerated) - monitor CPU on low-end devices

## Key Developer Concerns

### Adding New Features
1. **New screen?** Add to `Screen` type union, create component, conditionally render in App.tsx
2. **Modify jar data?** Update `Jar` interface, migration logic needed for old localStorage entries
3. **New animation?** Use `motion/react` (existing setup), avoid CSS animations for complex choreography

### Common Pitfalls
- **localStorage parsing:** Always wrap in try/catch (see src/app/App.tsx lines 29-34)
- **Re-renders:** Use `useCallback` for all navigation handlers to prevent child re-renders
- **Type safety:** Component props are well-typed via interfaces; maintain this discipline

### Asset & Configuration Gotchas
- Tailwind + React plugins required in vite.config (see comment at lines 20-21)
- `@` alias points to `src/` directory (available for imports)
- Figma asset plugin won't resolve undefined assets; ensure `src/assets/` exists

## File Organization

```
src/
  app/
    App.tsx              ← Central state & screen router
    components/          ← Screen components (each ~200-300 LOC)
  styles/
    theme.css            ← OKLCH color variables
    globals.css
    fonts.css
    tailwind.css
    index.css            ← Imports above
  imports/
    DesignDarkMode/      ← Auto-generated from Figma (don't modify)
  main.tsx               ← React DOM render
```

## External Dependencies Worth Knowing

- **canvas-confetti:** Celebration effects (imported but check if actively used)
- **date-fns:** Date utilities (likely for future calendar features)
- **cmdk:** Command palette UI component (included, may not be active)
- **embla-carousel-react:** Carousel component (installed, check usage)
- **@emotion/react & @mui/material:** Styling libraries (legacy, prefer Tailwind going forward)

---

**Last Updated:** August 2026 | Based on Figma design integration
