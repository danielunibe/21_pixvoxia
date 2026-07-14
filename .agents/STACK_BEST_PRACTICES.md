# Stack Best Practices - Pixvoxia Studio

Este documento define los estándares de codificación para el stack React/Vite/Zustand de Pixvoxia, garantizando un código limpio, performante y libre de errores para cualquier agente IA.

## ⚛️ React & JSX Standards
- **Componentes Funcionales**: Usar siempre componentes funcionales y Hooks. Prohibido el uso de Clases.
- **Hooks de Rendimiento**: Utilizar `useCallback` para manejadores de eventos complejos (PointerEvents) y `useMemo` para cálculos de distribución radial (Copic Engine).
- **Props Destructuring**: Extraer siempre las props en la firma de la función para mayor claridad.
- **Strict Mode**: El código debe ser compatible con `React.StrictMode`.

## 🧠 Zustand State Management
- **Store Atomicity**: Mantener los stores pequeños y enfocados.
- **Selector Pattern**: Acceder al estado siempre mediante selectores `useStore(state => state.value)` para evitar re-renders innecesarios.
- **Immutable Updates**: Nunca mutar el estado directamente; usar siempre la función `set` con el patrón spread.

## 🎨 CSS & Styling (High-Performance)
- **CSS-in-JS (Style Tags)**: Para componentes con físicas críticas (como las ThumbZones), usar bloques de `<style>` dentro del componente o variables CSS dinámicas (`--var`) para evitar el recalculo del layout de Tailwind en cada frame.
- **Hardware Acceleration**: Asegurar el uso de `transform: translate3d()` o `will-change: transform` en elementos con animaciones elásticas.
- **HSL over Hex**: Priorizar el uso de HSL para colores dinámicos (especialmente en el Copic Engine) para facilitar cálculos de luminosidad y saturación.

## 🛠️ Vite & Development
- **Asset Imports**: Usar imports dinámicos para recursos pesados si es necesario.
- **Error Boundaries**: Implementar límites de error en componentes críticos (Canvas, Dynamic Island).
- **JSDoc Documentation**: Cada función compleja debe estar documentada con JSDoc para que la IA comprenda los tipos de entrada y salida.

## 🛡️ IA Safety Measures
- **No breaking changes**: Antes de modificar una función de cinemática, la IA debe validar el impacto en el `DESIGN.md`.
- **Validation First**: Siempre realizar una verificación cruzada de los índices de los nodos (1-6) antes de alterar el mapeo de interacción.
