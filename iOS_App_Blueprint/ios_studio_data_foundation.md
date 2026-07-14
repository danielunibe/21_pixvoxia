# DATA FOUNDATION: iOS Game Dev Studio

## [DATA SHEET 1] Apple Silicon & Metal Reference (A17 Pro / A18)
- **Unified Memory Architecture:** Max throughput ~150 GB/s. RAM limits: 8GB (standard). Recommended peak usage for app: 3.5GB to avoid OS termination.
- **Metal 3 Capabilities:**
    - **Mesh Shaders:** Permite procesar geometrías complejas (voxels) de forma más eficiente que los vertex shaders tradicionales.
    - **Hardware-Accelerated Ray Tracing:** Útil para pre-visualización de sombras realistas en modelos voxel.
- **GPU Cores:** 6-core GPU (A17 Pro). Soporte para texturizado de alta resolución en tiempo real.

## [DATA SHEET 2] Ergonomics Matrix: Dual Thumb Touch Zones
- **Device: iPhone 15 Pro Max (6.7")**
    - **Safe Zone (X-axis):** 0 to 80px from left/right edges for thumb rest.
    - **Thumb Arc Radius:** ~120px to 150px from the lower corners of the screen.
    - **Dead Zones:** Center-top (Dynamic Island interference) and Center-bottom (iOS Home indicator).
- **Interaction Targets:** UI nodes should have a minimum hit area of 44x44 points.

## [DATA SHEET 3] Export & Pipeline Standards
- **Format: FBX (Version 2020+)**
    - Mesh: Polygonal (quads preferred for voxels).
    - Textures: Baked Vertex Colors or Atlas 2048x2048.
- **Format: USDZ (Apple AR Standard)**
    - Optimizado para visualización instantánea en iOS.
- **Format: PNG Spritesheet**
    - Bit depth: 32-bit (RGBA).
    - Grid size: 16x16, 32x32, 64x64.

## [DATA SHEET 4] Voxel-to-Poly Meshing Algorithms
- **Greedy Meshing:** Combina caras adyacentes del mismo color para reducir el número de polígonos. Ideal para rendimiento en móviles.
- **Marching Cubes:** Genera mallas suavizadas. Menos recomendado para estética Pixel/Voxel pura.
- **Dual Contouring:** Mantiene bordes afilados y detalles geométricos con menos polígonos que el meshing estándar.

## [DATA SHEET 5] Infinite Canvas Data Structure (Chunks)
- **Chunk Size:** 16x16x16 voxels por nodo de memoria.
- **Spatial Indexing:** Uso de "Octrees" para determinar qué chunks están visibles en cámara y deben procesarse.
- **Level of Detail (LOD):** Reducción de la resolución de los voxels en la distancia para optimizar el dibujado (Draw Calls).
