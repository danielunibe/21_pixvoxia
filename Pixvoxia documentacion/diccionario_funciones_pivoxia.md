# Diccionario de Funciones y Componentes: Pixvoxia

## 1. Mapeo de Nodos Laterales (Thumb-Driven)
Estos botones están optimizados para el uso constante con los pulgares.

| Nodo | Modo 2D (Pixel) | Modo 3D (Voxel) | Modo 4D (Animación) |
| :--- | :--- | :--- | :--- |
| **1** | Selección / Mover | Gizmo de Transformación | Seleccionar Keyframe |
| **2** | Lápiz / Pincel | Pincel de Voxel (Add) | Grabar / Play |
| **3** | Borrador | Borrador de Voxel (Sub) | Eliminar Keyframe |
| **4** | **Size (Tamaño)** | **Size (Tamaño)** | **Size (Brush)** |
| **5** | **Opacity (Opacidad)** | **Strength (Fuerza)** | **Opacity (Onion)** |
| **6** | **Tolerance / Flow** | **Hardness (Dureza)** | **Tweening Speed** |

## 2. Botones de Control Maestro (Top Zones)
Ubicados en la zona inmersiva superior. Acciones de gestión y sistema.

| Botón | Función General | Notas de UX |
| :--- | :--- | :--- |
| **A** | Deshacer (Undo) | Gesto alternativo: Tap con 2 dedos. |
| **B** | Rehacer (Redo) | Gesto alternativo: Tap con 3 dedos. |
| **C** | Reset Vista | Centra el canvas / cámara al origen. |
| **D** | Capas / Jerarquía | Abre el panel lateral de organización. |
| **E** | Exportar | Abre el pipeline de salida (FBX, PNG, etc). |
| **F** | Configuración | Ajustes de grid, iluminación y sistema. |

## 3. Casillas y Características de Control (Contextuales)
Paneles que aparecen al expandir un anillo de herramienta.

### 3.1 Sliders Neumórficos
- **Size:** Control de grosor del pincel o tamaño del brush de voxels.
- **Opacity:** Transparencia de la materia.
- **Hardness:** Definición de los bordes en el modo Voxel.

### 3.2 Casillas de Verificación (Toggles)
- **Grid Snapping:** Activar/desactivar el imán de la cuadrícula.
- **Mirror Mode:** Espejo horizontal/vertical (vital para personajes).
- **Alpha Lock:** Bloqueo de transparencia para pintar solo sobre materia existente.

## 4. Comportamiento de la Dynamic Island
- **Modo Color:** Selector radial estilo Copic (Pantone).
- **Modo Info:** Al recibir una exportación exitosa, la isla muestra un check verde.
- **Modo Feedback:** Muestra advertencias de memoria o batería baja sin interrumpir el canvas.
