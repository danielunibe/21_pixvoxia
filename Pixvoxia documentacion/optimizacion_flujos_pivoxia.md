# Estrategias de Optimización y Flujos Expertos: Pixvoxia

## 1. El Concepto de "Doble Empuñadura" (Dual-Wielding)
Aprovechando los 6 nodos laterales, la app debe fomentar un flujo donde las manos tienen roles especializados.

### Mano Izquierda (Gestión de Herramientas - Sistema Triple Slot)
- **Slot Maestro (Nodo 2):** Ubicado en el centro del pulgar. Es el único que activa el **Anillo Radial** al mantener presionado. Aquí es donde "equipas" nuevas herramientas desde el inventario.
- **Slots de Acceso Rápido (Nodos 1 y 3):** Funcionan como una "recámara" para tus dos herramientas secundarias más frecuentes. 
- **Mecánica de Swap (Intercambio):** Al tocar el Nodo 1 o 3, estos intercambian posición con el Nodo 2. Esto permite cambiar de "Pincel" a "Borrador" en milisegundos y que el pulgar derecho tome el control de sus ajustes.

### Mano Derecha (Configuración - El "Cómo")
- **Nodo 5 (Centro - Prioridad Máxima): TAMAÑO.** El ajuste de diámetro/grosor es el más frecuente. Se ubica en el centro porque es donde el pulgar descansa naturalmente, permitiendo deslizamientos rápidos y precisos.
- **Nodo 4 (Superior): OPACIDAD / FUERZA.** Segundo ajuste en frecuencia. Se coloca arriba para separarlo del control de tamaño y evitar errores táctiles.
- **Nodo 6 (Inferior): PARÁMETRO ESPECIAL.** Espacio dinámico para ajustes específicos de la herramienta (Dureza, Suavizado, Tolerancia).
- **Flujo de Trabajo:** Esta disposición permite que, mientras la mano izquierda mantiene el "Qué" (herramienta), la derecha refine el "Cómo" sin menús flotantes.

## 2. Dynamic Island: El Centro de Control Ambiental
Para no saturar los anillos laterales con opciones técnicas, la isla dinámica asume el rol de "Consola de Entorno":
- **Iluminación Dinámica:** Deslizar sobre la isla para rotar la fuente de luz en el espacio 3D.
- **Post-Procesado:** Un toque rápido para alternar entre modo "Wireframe", "Flat" y "Render Final".
- **Monitor de Sistema:** Indicador visual sutil de uso de memoria de voxels (para no exceder los límites del chip A17/A18).

## 3. El Dimensional Switcher como "Slider de Realidad"
Propuesta de interacción para el botón superior central:
- **Tap:** Cambio instantáneo entre 2D y 3D.
- **Drag (Deslizar):** Transición suave (Melt) donde el relieve neumórfico del 2D crece físicamente hasta convertirse en un modelo Voxel completo. Esta transición es puramente estética pero genera un alto valor percibido ("Juice").

## 4. Sistema de "Marcadores de Canvas"
Dado que el canvas es pseudo-infinito:
- **Nodos de Memoria Espacial:** El usuario puede guardar "Vistas" favoritas. Al dejar presionado el botón de Reset Vista (C), se despliega un mini-mapa neumórfico para saltar entre diferentes zonas del proyecto.

## 5. Referencias Flotantes (Ghost Mode)
- Aprovechando el **Modo Inmersivo**, el usuario puede importar una imagen de referencia que flota con opacidad ajustable. 
- **Leverage:** Al tocar la Dynamic Island con dos dedos, se activa/desactiva la visibilidad de la referencia sin entrar a menús.
