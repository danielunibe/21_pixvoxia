# PRD: iOS Spatial Creative Engine (Voxel/Pixel Art) - V3 Industrial Grade (Pivoxia)

## 1. Visión del Producto
Un **Estudio de Desarrollo de Videojuegos Portátil (PDS)** diseñado para iPhone (Pivoxia). El objetivo es proporcionar un ecosistema creativo completo que permita la generación de assets (Pixel/Voxel), su animación y exportación profesional a motores comerciales (Unity, Unreal, Godot), optimizado para el uso ergonómico con dos pulgares y eficiencia energética extrema.

## 2. Arquitectura Técnica de Alto Rendimiento
- **Motor de Renderizado:** Basado en **Vulkan** mediante la capa de abstracción **MoltenVK** para explotar Metal sin sacrificar versatilidad.
- **Eficiencia Térmica:** Optimización de buffers y minimización de draw calls para evitar el *thermal throttling*.
- **Persistencia de Datos:** **Guardado Atómico (Atomic File Saving)** integrado con el proveedor de documentos de iOS para persistencia en tiempo real.

## 3. Experiencia de Usuario (UX) e Interface (UI)
### 3.1 Ergonomía de Doble Pulgar (Sistema de 6 Nodos)
- **Mano Izquierda (Selección de Materia):** 
    - **Quick-Swap Triple Slot:** Tres herramientas activas. El nodo central (Nodo 2) activa el anillo radial para cambios profundos. Nodos 1 y 3 para cambios rápidos de estado.
- **Mano Derecha (Refinamiento Técnico):**
    - **Configuración Contextual:** Nodos 4, 5 y 6 controlan Tamaño, Opacidad y Parámetros Especiales de la herramienta activa.
- **Modo Inmersivo:** Ocultación total de la interfaz de iOS para dedicar el 100% de la pantalla al canvas.

### 3.2 Dynamic Island (Pantone & Environment Engine)
- **Pantone Hub:** Expansión neumórfica mediante click sostenido para revelar el muestrario industrial (Estilo Courier/Monospace).
- **Control de Luz:** Deslizamiento horizontal sobre la isla para rotar la fuente de luz en el espacio 3D (HDRI Sync).

- **Dimensional Switcher (Botón Maestro):** Botón central superior que permite transicionar suavemente entre los modos 2D (Pixel), 3D (Voxel) y 4D (Animación). Debe implementar la **Lógica de Transformación Vectorial**: de isométrico a plano, simulando un cambio de cámara ortográfica.

## 5. Especificaciones de Componentes Validados (Canvas Phase)

### 5.1 Dynamic Island: Pantone Industrial Hub
- **Interacción:** Click sostenido (500ms) para expansión.
- **Visualización:** Lista vertical de tarjetas Pantone con estética monoespaciada (Industrial-Grade).
- **Feedback:** Desenfoque de fondo de 25px y borde de cristal líquido reactivo.

### 5.2 Sistema de Doble Pulgar (Dual-Wielding)
- **Mano Izquierda (Tools):** Tres slots físicos fijos para herramientas primarias (Selección, Pincel, Borrador).
- **Mano Derecha (Config):** Ajustes paramétricos inmediatos vinculados a la herramienta activa del pulgar izquierdo.
- **Infografía Integrada:** La interfaz incluye etiquetas descriptivas de baja opacidad para guiar al usuario experto.

## 5. Pipeline de Exportación y Ecosistema
- **Game Ready Exports:** Optimización de mallas mediante algoritmos de **Greedy Meshing**.
- **Asset Marketplace:** Notificaciones MQTT para sincronización con mercados externos.

## 6. Roadmap Tecnológico
- **Fase 1:** Motor Vulkan y UI de 6 Nodos.
- **Fase 2:** Motor Pantone y Sincronización 2D/3D (Digital Twin).
- **Fase 3:** Motor de Animación 4D y Exportación Pro.

---

### 📱 Visualización de Interacción y UX
![Infografía de Interacción de la App](file:///C:/Users/danie/.gemini/antigravity/brain/ff442705-3486-444f-b20f-cd7e2edd7a7e/ios_app_interaction_infographic_1777266749396.png)
