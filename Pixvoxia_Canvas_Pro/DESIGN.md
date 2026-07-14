# Pixvoxia Canvas Pro - Design Systems & Skills

## 🚀 Arquitectura Técnica
- **Core**: React 18 + Vite (Entorno de alto rendimiento).
- **Styling**: Vanilla CSS de ultra-fidelidad + Tailwind CSS para utilidades.
- **Physics Engine**: Cálculos matemáticos personalizados para cinemática elástica (`cubic-bezier`).
- **Interaction Model**: Basado en `Pointer Events` para soporte universal (Touch/Mouse) de baja latencia.

---

## 🛠️ Sistemas de Interacción (Skills Implementadas)

### 1. ThumbZone Left: Motor de Herramientas Radial
- **Snap-to-Grid**: Bloqueo magnético a 25 grados.
- **Elastic Return**: Física de rebote sincronizada al soltar la herramienta.
- **Haptic Feedback**: Simulación de vibración en cada cambio de estado.

### 2. ThumbZone Right: Matriz 4x5 & Gestos
- **Color Matrix O(1)**: Selección instantánea de 20 colores mediante mapeo de coordenadas.
- **History Gestures**: Implementación de gestos de deslizamiento (Swipe) para Undo/Redo con feedback visual dinámico.

### 3. Dynamic Island: Copic Color Wheel
- **Transformación de Forma**: Transición morfológica de la píldora de la isla a un contenedor circular.
- **Motor Copic**: Generación programática de 50 swatches organizados por familia (Hue) y valor (Saturation).
- **Radial Pop-Animation**: Animación escalonada (staggered) para la emergencia de colores.

---

## 💎 Estética & Visuales (Ultra-Fidelity)
- **Dark Obsidian Theme**: Paleta profunda para reducir la fatiga visual.
- **Glassmorphism**: Uso extensivo de `backdrop-filter` para profundidad.
- **Micro-interacciones**: Escalamiento dinámico de botones y anillos de luz (glow) reactivos.

---

## 📋 Roadmap de Desarrollo
- [x] Migración a React/Vite.
- [x] Sincronización elástica de ThumbZones.
- [x] Implementación de Copic Color Island.
- [ ] Conexión del estado de color al pincel del Canvas.
- [ ] Motor de renderizado de voxeles 4D.
