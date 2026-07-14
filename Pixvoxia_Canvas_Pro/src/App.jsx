import React, { useState, useRef, useEffect, useCallback } from 'react';
import { useStore } from './store';
import { Settings, BarChart3 } from 'lucide-react';
import * as THREE from 'three';
import { Canvas, useThree } from '@react-three/fiber';
import { OrbitControls, Grid } from '@react-three/drei';

// --- CONFIGURACIÓN DE DATOS INICIALES ---
const INITIAL_LEFT_BOXES = ['select', 'brush', 'eraser'];
const INITIAL_RIGHT_BOXES = ['layers', 'palette', 'history'];

const PIXEL_ICONS = {
    pencil: "M10 22H8v-2h2v2Zm8 0h-2v-2h2v2ZM4 18h2v2H2v-4h2v2Zm12 2h-2v-2h2v2Zm4 0h-2v-2h2v2ZM8 18H6v-2h2v2Zm6 0h-2v-2h2v2Zm8 0h-2v-2h2v2ZM6 16H4v-2h2v2Zm4 0H8v-2h2v2Zm6 0h-2v-2h2v2Zm4 0h-2v-2h2v2ZM8 14H6v-2h2v2Zm4 0h-2v-2h2v2Zm6 0h-2v-2h2v2Zm-8-2H8v-2h2v2Zm4 0h-2v-2h2v2Zm8 0h-2v-2h2v2Zm-10-2h-2V8h2v2Zm8-4h-2v2h-2v2h-2V8h-2V6h2V4h2V2h4v4ZM6 8H4V6h2v2ZM4 6H2V4h2v2Zm4 0H6V4h2v2ZM6 4H4V2h2v2Z",
    eraser: "M20 19H8v-2h12v2ZM8 17H6v-2h2v2Zm14 0h-2V7h2v10ZM6 15H4v-2h2v2Zm8 0h-2v-2h2v2Zm4 0h-2v-2h2v2ZM4 13H2v-2h2v2Zm12 0h-2v-2h2v2ZM6 11H4V9h2v2Zm8 0h-2V9h2v2Zm4 0h-2V9h2v2ZM8 9H6V7h2v2Zm12-2H8V5h12v2Z",
    bucket: "M14 20h6v2H4v-2h8v-4H4v-2h2v-2h2v2h4v-4h-2V8h2V4h2v16ZM4 20H2v-4h2v4Zm18 0h-2V4h2v16Zm-4-2h-2v-2h2v2ZM6 12H4V8h2v4Zm4-4H6V6h4v2Zm10-4h-6V2h6v2Z",
    pipette: "M3 21h2v2H1v-4h2v2Zm6 0H5v-2h4v2Zm-4-2H3v-4h2v4Zm6 0H9v-2h2v2Zm2-2h-2v-2h2v2Zm-6-2H5v-2h2v2Zm8 0h-2v-2h2v2Zm4 0h-2v-2h2v2ZM9 13H7v-2h2v2Zm8 0h-2v-2h2v2Zm4 0h-2v-2h2v2Zm-10-2H9V9h2v2Zm4 0h-2V9h2v2Zm4 0h-2V9h2v2Zm-6-2h-2V7h2v2Zm8 0h-2V7h2v2ZM11 7H9V5h2v2Zm4 0h-2V5h2v2Zm8 0h-2V5h2v2ZM13 5h-2V3h2v2Zm4 0h-2V3h2v2Zm4 0h-2V3h2v2Zm-2-2h-2V1h2v2Z",
    line: "M4 11h16v2H4z",
    rect: "M20 22H4v-2h16v2ZM4 20H2V4h2v16Zm18 0h-2V4h2v16ZM20 4H4V2h16v2Z",
    circle: "M18 22H6v-2h12v2ZM6 20H4v-2h2v2Zm14 0h-2v-2h2v2ZM4 18H2V6h2v12Zm18 0h-2V6h2v12ZM6 6H4V4h2v2Zm14 0h-2V4h2v2Zm-2-2H6V2h12v2Z",
    move: "M10 19H2v-2h8v2Zm12 0h-8v-2h8v2Zm-10-2h-2v-6h2v6Zm6-10h2v2h2v2h-2v2h-2v2h-2v-4h-4V9h4V5h2v2ZM8 11H2V9h6v2Z",
    scale: "M15 19h-2v2h-2v-2H9v-2H7v-2h10v2h-2v2Zm5-6H4v-2h16v2Zm-7-8h2v2h2v2H7V7h2V5h2V3h2v2Z",
    rotate: "M10 16h10v2H10v4H8v-2H6v-2H4v-2h2v-2h2v-2h2v4Zm12 0h-2v-5h2v5ZM4 13H2V8h2v5Zm12-9h2v2h2v2h-2v2h-2v2h-2V8H4V6h10V2h2v2Z",
    crop: "M9 22H5v-2h4v2Zm-4-2H3v-4h2v4Zm6 0H9v-4H5v-2h6v6Zm10 0h-2v-2h2v2Zm-2-2h-2v-2h2v2Zm-2-2h-2v-2h2v2Zm-2-4h-2v2h-2v-4h4v2Zm-4-2H5V8h4V4h2v6Zm6 0h-2V8h2v2ZM5 8H3V4h2v4Zm14 0h-2V6h2v2Zm2-2h-2V4h2v2ZM9 4H5V2h4v2Z",
    select: "M10 22h2V8h2v2h2V8h-2V6h-2V4h-2V2H8v2h2v2h2v2H8v14h2v2Z" // Usando un puntero pixel art
};

const renderToolIcon = (id, size = 20) => {
    const path = PIXEL_ICONS[id] || PIXEL_ICONS['pencil'];
    return (
        <svg 
            width={size} 
            height={size} 
            viewBox="0 0 24 24" 
            fill="currentColor"
            style={{ display: 'block' }}
        >
            <path d={path} />
        </svg>
    );
};

// RING DE HERRAMIENTAS: 11 herramientas, paso 20 grados, -100 a +100
const INITIAL_LEFT_RING = [
    { a: -100, id: 'pencil'  },
    { a: -80,  id: 'eraser'  },
    { a: -60,  id: 'bucket'  },
    { a: -40,  id: 'pipette' },
    { a: -20,  id: 'line'    },
    { a: 0,    id: 'brush'   }, // herramienta central por defecto
    { a: 20,   id: 'rect'    },
    { a: 40,   id: 'circle'  },
    { a: 60,   id: 'move'    },
    { a: 80,   id: 'select'  },
    { a: 100,  id: 'crop'    },
];

// Paleta de colores ampliada: 20 swatches (4 columnas x 5 filas)
const COLORS = [
    '#000000', '#333333', '#ffffff', '#ef4444', '#3b82f6', // Columna 1: Base + Primarios
    '#f97316', '#eab308', '#84cc16', '#22c55e', '#10b981', // Columna 2: Secundarios + Verdes
    '#14b8a6', '#06b6d4', '#0ea5e9', '#6366f1', '#8b5cf6', // Columna 3: Cianes + Índigos
    '#a855f7', '#d946ef', '#ec4899', '#f43f5e', '#fb7185'
];

// --- COMPONENTE MOTOR ISOMÉTRICO 2D (proyección matemática real) ---
const IsometricEngine = ({ drawCanvasRef: srcRef }) => {
    const isoRef = useRef(null);
    const TILE_W = 20;
    const TILE_H = 10;
    const GRID_CELLS = 400; // 4000px canvas / 10px per cell

    useEffect(() => {
        const render = () => {
            if (!isoRef.current || !srcRef.current) return;
            const src = srcRef.current;
            const dst = isoRef.current;
            const sCtx = src.getContext('2d', { willReadFrequently: true });
            const dCtx = dst.getContext('2d');
            const dw = dst.width, dh = dst.height;
            dCtx.clearRect(0, 0, dw, dh);
            dCtx.fillStyle = '#f8f8f8';
            dCtx.fillRect(0, 0, dw, dh);

            const cx = dw / 2;
            const cy = dh * 0.25;

            // Renderizar de atrás hacia adelante (painter's algorithm ISO)
            for (let row = 0; row < GRID_CELLS; row++) {
                for (let col = 0; col < GRID_CELLS; col++) {
                    const px = col * 10 + 5;
                    const py = row * 10 + 5;
                    const pixel = sCtx.getImageData(px, py, 1, 1).data;
                    if (pixel[3] < 10) continue; // transparent

                    const r = pixel[0], g = pixel[1], b = pixel[2];
                    const hex = `rgb(${r},${g},${b})`;

                    // Isometric projection
                    const isoX = cx + (col - row) * (TILE_W / 2);
                    const isoY = cy + (col + row) * (TILE_H / 2);

                    // TOP face
                    dCtx.fillStyle = hex;
                    dCtx.beginPath();
                    dCtx.moveTo(isoX,           isoY);
                    dCtx.lineTo(isoX + TILE_W/2, isoY + TILE_H/2);
                    dCtx.lineTo(isoX,           isoY + TILE_H);
                    dCtx.lineTo(isoX - TILE_W/2, isoY + TILE_H/2);
                    dCtx.closePath();
                    dCtx.fill();

                    // LEFT face (darker)
                    dCtx.fillStyle = `rgba(0,0,0,0.2)`;
                    dCtx.beginPath();
                    dCtx.moveTo(isoX - TILE_W/2, isoY + TILE_H/2);
                    dCtx.lineTo(isoX,           isoY + TILE_H);
                    dCtx.lineTo(isoX,           isoY + TILE_H * 1.5);
                    dCtx.lineTo(isoX - TILE_W/2, isoY + TILE_H);
                    dCtx.closePath();
                    dCtx.fill();

                    // RIGHT face (even darker)
                    dCtx.fillStyle = `rgba(0,0,0,0.35)`;
                    dCtx.beginPath();
                    dCtx.moveTo(isoX,           isoY + TILE_H);
                    dCtx.lineTo(isoX + TILE_W/2, isoY + TILE_H/2);
                    dCtx.lineTo(isoX + TILE_W/2, isoY + TILE_H);
                    dCtx.lineTo(isoX,           isoY + TILE_H * 1.5);
                    dCtx.closePath();
                    dCtx.fill();
                }
            }
        };
        render();
        const interval = setInterval(render, 300); // re-render cada 300ms para capturar cambios
        return () => clearInterval(interval);
    }, [srcRef]);

    return (
        <canvas 
            ref={isoRef} 
            width={430} 
            height={932}
            style={{ position: 'absolute', inset: 0, width: '100%', height: '100%' }}
        />
    );
};




const VoxelScene = ({ voxels, activeColor, onAddVoxel, onRemoveVoxel }) => {
    const meshRef = useRef();
    const groundRef = useRef();
    const { camera, raycaster, pointer, gl } = useThree();
    const MAX_INSTANCES = 50000;
    
    useEffect(() => {
        if (!meshRef.current) return;
        const color = new THREE.Color();
        const matrix = new THREE.Matrix4();
        const hidden = new THREE.Matrix4().makeScale(0, 0, 0);
        
        voxels.forEach((v, i) => {
            if (i >= MAX_INSTANCES) return;
            matrix.makeTranslation(v.x, v.y, v.z);
            meshRef.current.setMatrixAt(i, matrix);
            color.set(v.color);
            meshRef.current.setColorAt(i, color);
        });
        for (let i = voxels.length; i < MAX_INSTANCES; i++) {
            meshRef.current.setMatrixAt(i, hidden);
        }
        meshRef.current.instanceMatrix.needsUpdate = true;
        if (meshRef.current.instanceColor) meshRef.current.instanceColor.needsUpdate = true;
    }, [voxels]);

    const handleClick = useCallback((e) => {
        e.stopPropagation();
        if (e.altKey || e.ctrlKey) {
            if (onRemoveVoxel) onRemoveVoxel(e.instanceId);
        } else {
            const normal = e.face?.normal ?? new THREE.Vector3(0, 1, 0);
            const pos = e.point.clone().add(normal.multiplyScalar(0.5)).round();
            if (onAddVoxel) onAddVoxel({ x: pos.x, y: pos.y, z: pos.z });
        }
    }, [onAddVoxel, onRemoveVoxel]);

    const handleGroundClick = useCallback((e) => {
        const pos = e.point.clone();
        pos.x = Math.round(pos.x); pos.z = Math.round(pos.z); pos.y = 0;
        if (onAddVoxel) onAddVoxel({ x: pos.x, y: pos.y, z: pos.z });
    }, [onAddVoxel]);

    return (
        <>
            <instancedMesh 
                ref={meshRef} 
                args={[null, null, MAX_INSTANCES]} 
                castShadow 
                receiveShadow
                onClick={handleClick}
            >
                <boxGeometry args={[1, 1, 1]} />
                <meshStandardMaterial vertexColors roughness={0.4} metalness={0.05} />
            </instancedMesh>

            {/* Ground plane invisible para placement */}
            <mesh ref={groundRef} rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.5, 0]} onClick={handleGroundClick}>
                <planeGeometry args={[400, 400]} />
                <meshBasicMaterial visible={false} side={THREE.DoubleSide} />
            </mesh>
        </>
    );
};

const VoxelEngine = ({ mode, activeColor, voxelData, onVoxelDataChange }) => {
    const isIso = mode === 'voxel_iso';
    const [voxels, setVoxels] = useState(voxelData || []);

    useEffect(() => { setVoxels(voxelData || []); }, [voxelData]);

    const addVoxel = useCallback(({ x, y, z }) => {
        const color = useStore.getState().activeColor;
        setVoxels(prev => {
            const exists = prev.find(v => v.x === x && v.y === y && v.z === z);
            const next = exists ? prev : [...prev, { x, y, z, color }];
            if (onVoxelDataChange) onVoxelDataChange(next);
            return next;
        });
    }, [onVoxelDataChange]);

    const removeVoxel = useCallback((idx) => {
        setVoxels(prev => {
            const next = prev.filter((_, i) => i !== idx);
            if (onVoxelDataChange) onVoxelDataChange(next);
            return next;
        });
    }, [onVoxelDataChange]);
    
    return (
        <Canvas 
            key={mode}
            camera={isIso 
                ? { position: [20, 20, 20], zoom: 30, near: -2000, far: 2000 }
                : { position: [15, 15, 15], fov: 50 }
            }
            orthographic={isIso}
            shadows
            style={{ position: 'absolute', inset: 0, zIndex: 1, cursor: 'crosshair', background: '#1a1a2e' }}
        >
            <color attach="background" args={['#1a1a2e']} />
            <ambientLight intensity={0.4} />
            <directionalLight 
                position={[20, 40, 20]} 
                intensity={1.8} 
                castShadow 
                shadow-mapSize={[2048, 2048]}
                shadow-camera-left={-50}
                shadow-camera-right={50}
                shadow-camera-top={50}
                shadow-camera-bottom={-50}
            />
            <pointLight position={[-10, 20, -10]} intensity={0.5} color="#4488ff" />
            <OrbitControls 
                enableRotate={!isIso}
                enablePan={true} 
                enableZoom={true} 
                makeDefault
                target={[0, 0, 0]}
            />
            <VoxelScene 
                voxels={voxels} 
                activeColor={activeColor}
                onAddVoxel={addVoxel}
                onRemoveVoxel={removeVoxel}
            />
            <Grid 
                args={[200, 200]} 
                cellSize={1} cellThickness={0.5} cellColor="#2a2a3e" 
                sectionSize={10} sectionThickness={1} sectionColor="#3a3a5e"
                position={[0, -0.5, 0]}
                fadeDistance={80}
                infiniteGrid
            />
        </Canvas>
    );
};

// --- COMPONENTE THUMB ZONE (IZQUIERDA - ANILLO) ---
const ThumbZoneLeft = ({ initialBoxes, initialRing }) => {
    const { setActiveTool } = useStore();
    const [boxes, setBoxes] = useState(initialBoxes);
    
    useEffect(() => {
        setActiveTool(boxes[1]);
    }, [boxes, setActiveTool]);
    const [ringItems, setRingItems] = useState(initialRing);
    const [swappingIdx, setSwappingIdx] = useState(null);
    const [held, setHeld] = useState(false);
    const [liveContent, setLiveContent] = useState('');
    const [flash, setFlash] = useState(false);
    const [isReturning, setIsReturning] = useState(false);

    const zoneRef = useRef(null);
    const boxRefs = useRef([]);
    const longPressTimer = useRef(null);
    const trackRef = useRef({ isTracking: false, startY: 0, lastSnap: 0, originalContent: '', selectedId: '' });

    const applyRingOpacities = useCallback((snapAngle) => {
        if (!zoneRef.current) return;
        const items = zoneRef.current.querySelectorAll('.ring-item');
        items.forEach(item => {
            const itemAngle = parseFloat(item.dataset.angle);
            const absDistance = Math.abs(itemAngle + snapAngle);
            let op = 0;
            // Umbrales actualizados para step=20
            if (absDistance === 0)   op = 0;    // centro (herramienta activa, oculta)
            else if (absDistance <= 20)  op = 0.95;
            else if (absDistance <= 40)  op = 0.7;
            else if (absDistance <= 60)  op = 0.45;
            else if (absDistance <= 80)  op = 0.2;
            else                         op = 0.08;
            item.style.opacity = op;
        });
    }, []);

    const handlePointerDown = (e, index) => {
        if (swappingIdx !== null) return;
        if (index === 1) {
            e.target.setPointerCapture(e.pointerId);
            setHeld(true);
            setLiveContent(renderToolIcon(boxes[1], 24));
            trackRef.current = { isTracking: true, startY: e.clientY, lastSnap: 0, originalContent: boxes[1], selectedId: '' };
            zoneRef.current.style.setProperty('--ring-rot', `0deg`);
            applyRingOpacities(0);
            setRingItems(prev => prev.map(item => item.a === 0 ? { ...item, id: boxes[1] } : item));

            longPressTimer.current = setTimeout(() => {
                if (zoneRef.current) zoneRef.current.classList.add('show-ring');
            }, 200);
        } else {
            setSwappingIdx(index);
            setTimeout(() => {
                setBoxes(prev => {
                    const next = [...prev];
                    const temp = next[1];
                    next[1] = next[index];
                    next[index] = temp;
                    return next;
                });
                setSwappingIdx(null);
            }, 200);
        }
    };

    const handlePointerMove = (e, index) => {
        if (index !== 1 || !trackRef.current.isTracking) return;
        const deltaY = e.clientY - trackRef.current.startY;
        
        if (Math.abs(deltaY) > 10) {
            zoneRef.current.classList.add('show-ring');
            let rawRot = deltaY * 0.8;
            // Snap a step=20, rango -100 a +100 (11 herramientas)
            let snapAngle = Math.round(rawRot / 20) * 20;
            snapAngle = Math.max(-100, Math.min(100, snapAngle));

                if (trackRef.current.lastSnap !== snapAngle) {
                    trackRef.current.lastSnap = snapAngle;
                    zoneRef.current.style.setProperty('--ring-rot', `${snapAngle}deg`);

                    const targetAngle = -snapAngle;
                    const targetItem = ringItems.find(r => r.a === targetAngle);
                    if (targetItem) {
                        setLiveContent(renderToolIcon(targetItem.id, 24));
                        trackRef.current.selectedId = targetItem.id;
                    }

                if (boxRefs.current[1]) {
                    boxRefs.current[1].style.setProperty('--held-scale', '1.15');
                    if(navigator.vibrate) navigator.vibrate(10);
                    setTimeout(() => {
                        if(boxRefs.current[1]) boxRefs.current[1].style.setProperty('--held-scale', '1');
                    }, 150);
                }
                applyRingOpacities(snapAngle);
            }
        }
    };

    const handlePointerUp = (e, index) => {
        if (index !== 1 || !trackRef.current.isTracking) return;
        clearTimeout(longPressTimer.current);
        const finalSnap = trackRef.current.lastSnap;
        const originalContent = trackRef.current.originalContent;
        const selectedId = trackRef.current.selectedId;

        if (finalSnap !== 0 && selectedId && selectedId !== 'center') {
            setBoxes(prev => {
                const next = [...prev];
                next[1] = selectedId;
                return next;
            });
            setRingItems(prev => prev.map(item => 
                item.id === selectedId ? { ...item, id: originalContent } : 
                item.a === 0 ? { ...item, id: 'pencil' } : item
            ));
            setFlash(true);
            setTimeout(() => setFlash(false), 100);
        } else {
            setRingItems(prev => prev.map(item => item.a === 0 ? { ...item, id: 'pencil' } : item));
        }

        setHeld(false);
        setIsReturning(true);
        setTimeout(() => setIsReturning(false), 400);

        setLiveContent('');
        if (zoneRef.current) {
            zoneRef.current.classList.remove('show-ring');
            zoneRef.current.style.setProperty('--ring-rot', `0deg`);
        }
        if (boxRefs.current[1]) boxRefs.current[1].style.setProperty('--held-scale', '1');
        
        trackRef.current.isTracking = false;
        try { e.target.releasePointerCapture(e.pointerId); } catch(err) {}
    };

    return (
        <div ref={zoneRef} className="thumb-zone thumb-left">
            {boxes.map((content, idx) => {
                const isSwapping = swappingIdx === idx;
                const isCenterSwapping = swappingIdx !== null && idx === 1;
                const dist = '60px';
                let transformClass = '';
                if (isSwapping) transformClass = idx === 0 ? `translateY(${dist})` : `translateY(-${dist})`;
                if (isCenterSwapping) transformClass = swappingIdx === 0 ? `translateY(-${dist})` : `translateY(${dist})`;
                const isHeldVisual = held && idx === 1;

                return (
                    <div
                        key={idx}
                        ref={el => boxRefs.current[idx] = el}
                        className={`thumb-box ${isHeldVisual ? 'is-held' : ''} ${isReturning && idx === 1 ? 'is-returning' : ''} ${flash && idx === 1 ? 'swap-flash' : ''}`}
                        style={{ transform: transformClass ? transformClass : undefined }}
                        onPointerDown={(e) => handlePointerDown(e, idx)}
                        onPointerMove={(e) => handlePointerMove(e, idx)}
                        onPointerUp={(e) => handlePointerUp(e, idx)}
                        onPointerCancel={(e) => handlePointerUp(e, idx)}
                    >
                        <span className="box-num">
                            {isHeldVisual && idx === 1 ? liveContent : renderToolIcon(boxes[idx], idx === 1 ? 24 : 20)}
                        </span>
                    </div>
                );
            })}
            <div className="tool-ring">
                {ringItems.map((item) => (
                    <div key={`ring-${item.a}`} className="ring-item" style={{ '--a': `${item.a}deg` }} data-angle={item.a} data-id={item.id}>
                        <div className="ring-icon-wrapper">
                            {renderToolIcon(item.id, 22)}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

// --- COMPONENTE THUMB ZONE (DERECHA - PALETA & HISTORIAL) ---
const ThumbZoneRight = ({ initialBoxes, onUndo, onRedo }) => {
    const { activeColor, setActiveColor } = useStore();
    const [heldIdx, setHeldIdx] = useState(null);
    const [expanded, setExpanded] = useState(false);
    const [actionFeedback, setActionFeedback] = useState(null); 
    const [hoveredColorIdx, setHoveredColorIdx] = useState(null);
    const [isReturning, setIsReturning] = useState(false);
    
    const expandTimeout = useRef(null);
    const trackRef = useRef({ isTracking: false, startX: 0, startY: 0, triggered: false });
    const hoverRef = useRef(null);

    const triggerHistoryAction = (type, el) => {
        trackRef.current.triggered = true;
        setActionFeedback(type === 'UNDO' ? '↺' : '↻');
        
        if (type === 'UNDO' && onUndo) onUndo();
        if (type === 'REDO' && onRedo) onRedo();
        
        if (navigator.vibrate) navigator.vibrate([15, 30, 15]); 
        el.style.setProperty('--drag-x', type === 'UNDO' ? '-20px' : '20px');
        setTimeout(() => setActionFeedback(null), 600);
    };

    const handlePointerDown = (e, index) => {
        e.target.setPointerCapture(e.pointerId);
        setHeldIdx(index);
        
        if (index === 1) {
            trackRef.current = { isTracking: true, startX: e.clientX, startY: e.clientY, triggered: false };
            expandTimeout.current = setTimeout(() => {
                setExpanded(true);
                if(navigator.vibrate) navigator.vibrate(15);
            }, 200);
        } else if (index === 2) {
            trackRef.current = { isTracking: true, startX: e.clientX, startY: e.clientY, triggered: false };
            e.target.style.setProperty('--drag-x', '0px');
        }
    };

    const handlePointerMove = (e, index) => {
        if (index === 2 && trackRef.current.isTracking && !trackRef.current.triggered) {
            const deltaX = e.clientX - trackRef.current.startX;
            e.target.style.setProperty('--drag-x', `${deltaX}px`);

            if (deltaX < -45) triggerHistoryAction('UNDO', e.target);
            else if (deltaX > 30) triggerHistoryAction('REDO', e.target);
        }
        else if (index === 1 && expanded && trackRef.current.isTracking) {
            const deltaX = e.clientX - trackRef.current.startX;
            const deltaY = e.clientY - trackRef.current.startY;
            
            let col = 3 - Math.floor(Math.abs(Math.min(0, deltaX)) / 22);
            col = Math.max(0, Math.min(3, col)); 
            let row = 2 + Math.round(deltaY / 14);
            row = Math.max(0, Math.min(4, row)); 
            
            const cIdx = (col * 5) + row;

            if (hoverRef.current !== cIdx) {
                hoverRef.current = cIdx;
                setHoveredColorIdx(cIdx);
                if(navigator.vibrate) navigator.vibrate(10);
            }
        }
    };

    const handlePointerUp = (e, index) => {
        clearTimeout(expandTimeout.current);
        
        if (index === 1 && expanded && hoverRef.current !== null) {
            setActiveColor(COLORS[hoverRef.current]);
            if(navigator.vibrate) navigator.vibrate([10, 10]);
        }

        setExpanded(false);
        setHeldIdx(null);
        setHoveredColorIdx(null);
        hoverRef.current = null;
        trackRef.current.isTracking = false;
        
        setIsReturning(true);
        setTimeout(() => setIsReturning(false), 400);
        
        if (index === 2) {
            e.target.style.removeProperty('--drag-x'); 
        }
        
        try { e.target.releasePointerCapture(e.pointerId); } catch(err) {}
    };

    return (
        <div className="thumb-zone thumb-right">
            {initialBoxes.map((content, idx) => {
                const isHeldVisual = heldIdx === idx;
                const isActionDrag = isHeldVisual && idx === 2;
                const isColorBox = idx === 1;

                return (
                    <div
                        key={idx}
                        className={`thumb-box ${isHeldVisual ? 'is-held' : ''} ${isReturning && (idx === 1 || idx === 2) ? 'is-returning' : ''} ${isHeldVisual && expanded && idx === 1 ? 'is-color-mode' : ''} ${isActionDrag ? 'is-action-drag' : ''} ${isColorBox ? 'is-color-tool' : ''}`}
                        style={{ 
                            '--active-color': isColorBox ? activeColor : undefined,
                            transform: isHeldVisual ? undefined : undefined 
                        }}
                        onPointerDown={(e) => handlePointerDown(e, idx)}
                        onPointerMove={(e) => handlePointerMove(e, idx)}
                        onPointerUp={(e) => handlePointerUp(e, idx)}
                        onPointerCancel={(e) => handlePointerUp(e, idx)}
                    >
                        {idx === 1 ? (
                            <div className={`color-panel ${expanded ? 'is-expanded' : ''}`}>
                                {!expanded && <div className="current-color-preview" style={{ background: activeColor, width: '28px', height: '28px', borderRadius: '8px', border: '2px solid rgba(255,255,255,0.3)', boxShadow: `0 4px 12px ${activeColor}55` }}></div>}
                                {expanded && COLORS.map((color, i) => (
                                    <div 
                                        key={i} 
                                        className={`color-swatch ${hoveredColorIdx === i ? 'is-hovered' : ''} ${activeColor === color ? 'is-selected' : ''}`} 
                                        style={{ '--swatch': color }} 
                                    />
                                ))}
                            </div>
                        ) : idx === 2 ? (
                            <span className="box-num" style={{ fontSize: actionFeedback ? '24px' : '14px' }}>
                                {actionFeedback || renderToolIcon('rotate', 18)}
                            </span>
                        ) : (
                            <span className="box-num">{renderToolIcon('scale', 18)}</span>
                        )}
                    </div>
                );
            })}
        </div>
    );
};

// --- COMPONENTE PRINCIPAL ---
function App() {
    const screenRef = useRef(null);
    const canvasRef = useRef(null);
    const { isIslandExpanded, toggleIsland, showDashboard, toggleDashboard, activeColor, setActiveColor } = useStore();
    
    const panState = useRef({
        zoom: 1, offsetX: 0, offsetY: 0, isDragging: false, startX: 0, startY: 0
    });

    const [showSettings, setShowSettings] = useState(false);
    const [showGrid, setShowGrid] = useState(true);
    
    const DIMENSIONAL_MODES = ['2d', '2d_iso', 'voxel', 'voxel_iso'];
    const [viewMode, setViewMode] = useState('2d'); 

    const islandPressTimer = useRef(null);

    const toggleSettings = () => setShowSettings(!showSettings);
    const toggleGrid = () => setShowGrid(!showGrid);

    const [stats, setStats] = useState({
        physicsLatency: '1.2ms',
        copicLoad: '100%',
        interactionNodes: '6/6',
        engineStatus: 'Optimal'
    });

    useEffect(() => {
        const interval = setInterval(() => {
            setStats(prev => ({
                ...prev,
                physicsLatency: (Math.random() * 0.5 + 1.0).toFixed(2) + 'ms'
            }));
        }, 1000);
        return () => clearInterval(interval);
    }, []);

    // Datos simplificados del sistema Copic (Familias y Valores)
    const COPIC_DATA = [
        { fam: 'Y', colors: ['#fffde7', '#fff9c4', '#fff59d', '#fff176', '#ffee58'] },
        { fam: 'YG', colors: ['#f1f8e9', '#dcedc8', '#c5e1a5', '#aed581', '#9ccc65'] },
        { fam: 'G', colors: ['#e8f5e9', '#c8e6c9', '#a5d6a7', '#81c784', '#66bb6a'] },
        { fam: 'BG', colors: ['#e0f2f1', '#b2dfdb', '#80cbc4', '#4db6ac', '#26a69a'] },
        { fam: 'B', colors: ['#e3f2fd', '#bbdefb', '#90caf9', '#64b5f6', '#42a5f5'] },
        { fam: 'BV', colors: ['#e8eaf6', '#c5cae9', '#9fa8da', '#7986cb', '#5c6bc0'] },
        { fam: 'V', colors: ['#f3e5f5', '#e1bee7', '#ce93d8', '#ba68c8', '#ab47bc'] },
        { fam: 'RV', colors: ['#fce4ec', '#f8bbd0', '#f48fb1', '#f06292', '#ec407a'] },
        { fam: 'R', colors: ['#ffebee', '#ffcdd2', '#ef9a9a', '#e57373', '#ef5350'] },
        { fam: 'YR', colors: ['#fff3e0', '#ffe0b2', '#ffcc80', '#ffb74d', '#ffa726'] }
    ];

    const handleIslandPointerDown = (e) => {
        islandPressTimer.current = setTimeout(() => {
            setViewMode(prev => {
                const nextMode = DIMENSIONAL_MODES[(DIMENSIONAL_MODES.indexOf(prev) + 1) % DIMENSIONAL_MODES.length];
                handleDimensionalChange(nextMode);
                return prev; // handleDimensionalChange llama setViewMode
            });
            islandPressTimer.current = 'TRIGGERED';
        }, 500); 
    };

    const handleIslandPointerUp = (e) => {
        if (islandPressTimer.current !== 'TRIGGERED') {
            clearTimeout(islandPressTimer.current);
            toggleIsland();
            if (navigator.vibrate) navigator.vibrate(20);
        }
        islandPressTimer.current = null;
    };

    const handleIslandPointerLeave = (e) => {
        if (islandPressTimer.current !== 'TRIGGERED') {
            clearTimeout(islandPressTimer.current);
        }
        islandPressTimer.current = null;
    };

    const drawState = useRef({ isDrawing: false });
    const drawCanvasRef = useRef(null);
    const historyStack = useRef([]);
    const historyIndex = useRef(-1);
    const currentStroke = useRef([]);
    const voxelData = useRef([]);  // Capa de datos compartida pixel↔voxel

    // Captura el canvas 2D y convierte cada píxel a un voxel {x,y,z,color}
    const capturePixelsAsVoxels = useCallback(() => {
        if (!drawCanvasRef.current) return [];
        const ctx = drawCanvasRef.current.getContext('2d', { willReadFrequently: true });
        const CELLS = 400; // canvas 4000px / 10px
        const result = [];
        for (let row = 0; row < CELLS; row++) {
            for (let col = 0; col < CELLS; col++) {
                const pixel = ctx.getImageData(col * 10 + 5, row * 10 + 5, 1, 1).data;
                if (pixel[3] > 10) {
                    const hex = '#' + [pixel[0], pixel[1], pixel[2]].map(v => v.toString(16).padStart(2, '0')).join('');
                    // centrar el mundo en 0,0 (200 celdas a cada lado)
                    result.push({ x: col - 200, y: 0, z: row - 200, color: hex });
                }
            }
        }
        voxelData.current = result;
        return result;
    }, []);

    // Cuando cambia de modo 2D → Voxel, captura los datos antes de montar Three.js
    const handleDimensionalChange = useCallback((nextMode) => {
        if (nextMode.includes('voxel') && !viewMode.includes('voxel')) {
            capturePixelsAsVoxels();
        }
        setViewMode(nextMode);
        if (navigator.vibrate) navigator.vibrate([20, 50, 20]);
    }, [viewMode, capturePixelsAsVoxels]);

    const redrawCanvas = useCallback(() => {
        if (!drawCanvasRef.current) return;
        const ctx = drawCanvasRef.current.getContext('2d');
        ctx.clearRect(0, 0, 4000, 4000);
        
        for (let i = 0; i <= historyIndex.current; i++) {
            const stroke = historyStack.current[i];
            for (let j = 0; j < stroke.length; j++) {
                const p = stroke[j];
                if (p.color === 'clear') {
                    ctx.clearRect(p.col * 10, p.row * 10, 10, 10);
                } else {
                    ctx.fillStyle = p.color;
                    ctx.fillRect(p.col * 10, p.row * 10, 10, 10);
                }
            }
        }
    }, []);

    const handleUndo = useCallback(() => {
        if (historyIndex.current >= 0) {
            historyIndex.current--;
            redrawCanvas();
        }
    }, [redrawCanvas]);

    const handleRedo = useCallback(() => {
        if (historyIndex.current < historyStack.current.length - 1) {
            historyIndex.current++;
            redrawCanvas();
        }
    }, [redrawCanvas]);

    const updateGrid = useCallback(() => {
        if (!canvasRef.current) return;
        const { zoom, offsetX, offsetY } = panState.current;
        canvasRef.current.style.setProperty('--zoom', zoom);
        canvasRef.current.style.setProperty('--offset-x', `${offsetX}px`);
        canvasRef.current.style.setProperty('--offset-y', `${offsetY}px`);
    }, []);

    const paintPixel = useCallback((clientX, clientY) => {
        if (!drawCanvasRef.current || !canvasRef.current) return;
        const ctx = drawCanvasRef.current.getContext('2d');

        // Fix D1: hwScale robusto usando matrix
        const deviceEl = document.getElementById('device-wrapper');
        let hwScale = 1;
        if (deviceEl) {
            const matrix = new DOMMatrix(window.getComputedStyle(deviceEl).transform);
            hwScale = matrix.a || 1;
        }

        const currentTool = useStore.getState().activeTool;
        const currentColor = useStore.getState().activeColor;
        const rect = canvasRef.current.getBoundingClientRect();
        const x = (clientX - rect.left) / hwScale;
        const y = (clientY - rect.top) / hwScale;
        const { zoom } = panState.current;
        const gridSize = 10 * zoom;
        const col = Math.floor(x / gridSize);
        const row = Math.floor(y / gridSize);

        const lastPainted = currentStroke.current[currentStroke.current.length - 1];
        if (lastPainted && lastPainted.col === col && lastPainted.row === row) return;

        const actionColor = (currentTool === 'eraser') ? 'clear' : currentColor;
        currentStroke.current.push({ col, row, color: actionColor });

        if (actionColor !== 'clear') {
            ctx.fillStyle = actionColor;
            ctx.fillRect(col * 10, row * 10, 10, 10);
        } else {
            ctx.clearRect(col * 10, row * 10, 10, 10);
        }
    }, []);

    // --- HERRAMIENTAS ADICIONALES ---
    const toolState = useRef({ startCol: -1, startRow: -1, previewStroke: [] });
    const previewCanvasRef = useRef(null);

    const getGridPos = useCallback((clientX, clientY) => {
        if (!canvasRef.current) return { col: 0, row: 0 };
        const deviceEl = document.getElementById('device-wrapper');
        let hwScale = 1;
        if (deviceEl) {
            const matrix = new DOMMatrix(window.getComputedStyle(deviceEl).transform);
            hwScale = matrix.a || 1;
        }
        const rect = canvasRef.current.getBoundingClientRect();
        const x = (clientX - rect.left) / hwScale;
        const y = (clientY - rect.top) / hwScale;
        const { zoom } = panState.current;
        const gridSize = 10 * zoom;
        return { col: Math.floor(x / gridSize), row: Math.floor(y / gridSize) };
    }, []);

    // Bresenham line
    const getLinePixels = (x0, y0, x1, y1) => {
        const pixels = [];
        let dx = Math.abs(x1 - x0), dy = Math.abs(y1 - y0);
        let sx = x0 < x1 ? 1 : -1, sy = y0 < y1 ? 1 : -1;
        let err = dx - dy;
        while (true) {
            pixels.push({ col: x0, row: y0 });
            if (x0 === x1 && y0 === y1) break;
            let e2 = 2 * err;
            if (e2 > -dy) { err -= dy; x0 += sx; }
            if (e2 < dx)  { err += dx; y0 += sy; }
        }
        return pixels;
    };

    // Midpoint circle
    const getCirclePixels = (cx, cy, rx, ry) => {
        const pixels = new Set();
        const r = Math.round(Math.sqrt(rx*rx + ry*ry));
        let x = 0, y = r, d = 1 - r;
        const add = (px, py) => pixels.add(`${cx+px},${cy+py}`) && pixels.add(`${cx-px},${cy+py}`) &&
                               pixels.add(`${cx+px},${cy-py}`) && pixels.add(`${cx-px},${cy-py}`) &&
                               pixels.add(`${cx+py},${cy+px}`) && pixels.add(`${cx-py},${cy+px}`) &&
                               pixels.add(`${cx+py},${cy-px}`) && pixels.add(`${cx-py},${cy-px}`);
        add(x, y);
        while (x < y) {
            x++;
            if (d < 0) d += 2*x + 1;
            else { y--; d += 2*(x-y) + 1; }
            add(x, y);
        }
        return [...pixels].map(s => { const [c,r] = s.split(','); return {col:+c, row:+r}; });
    };

    // Flood Fill BFS
    const floodFill = useCallback((startCol, startRow, fillColor) => {
        if (!drawCanvasRef.current) return;
        const ctx = drawCanvasRef.current.getContext('2d');
        const imageData = ctx.getImageData(0, 0, 4000, 4000);
        const data = imageData.data;
        const getIdx = (c, r) => (r * 4000 + c) * 4;
        const startIdx = getIdx(startCol * 10 + 5, startRow * 10 + 5);
        const sr = data[startIdx], sg = data[startIdx+1], sb = data[startIdx+2], sa = data[startIdx+3];
        
        const fc = parseInt(fillColor.slice(1), 16);
        const fr = (fc >> 16) & 255, fg = (fc >> 8) & 255, fb = fc & 255;
        if (sr === fr && sg === fg && sb === fb) return;

        const stroke = [];
        const visited = new Set();
        const queue = [[startCol, startRow]];
        
        while (queue.length > 0) {
            const [c, r] = queue.shift();
            const key = `${c},${r}`;
            if (visited.has(key) || c < 0 || r < 0 || c >= 400 || r >= 400) continue;
            visited.add(key);
            const idx = getIdx(c * 10 + 5, r * 10 + 5);
            if (Math.abs(data[idx]-sr) > 30 || Math.abs(data[idx+1]-sg) > 30 || Math.abs(data[idx+2]-sb) > 30 || Math.abs(data[idx+3]-sa) > 30) continue;
            ctx.fillStyle = fillColor;
            ctx.fillRect(c * 10, r * 10, 10, 10);
            stroke.push({ col: c, row: r, color: fillColor });
            queue.push([c+1,r],[c-1,r],[c,r+1],[c,r-1]);
        }
        if (stroke.length > 0) {
            historyStack.current = historyStack.current.slice(0, historyIndex.current + 1);
            historyStack.current.push(stroke);
            historyIndex.current++;
        }
    }, []);

    // Eyedropper
    const pickColor = useCallback((col, row) => {
        if (!drawCanvasRef.current) return;
        const ctx = drawCanvasRef.current.getContext('2d');
        const pixel = ctx.getImageData(col * 10 + 5, row * 10 + 5, 1, 1).data;
        if (pixel[3] > 0) {
            const hex = '#' + [pixel[0],pixel[1],pixel[2]].map(v => v.toString(16).padStart(2,'0')).join('');
            useStore.getState().setActiveColor(hex);
        }
    }, []);

    // Preview canvas draw
    const drawPreview = useCallback((pixels, color) => {
        if (!previewCanvasRef.current) return;
        const ctx = previewCanvasRef.current.getContext('2d');
        ctx.clearRect(0, 0, 4000, 4000);
        ctx.fillStyle = color;
        pixels.forEach(p => ctx.fillRect(p.col * 10, p.row * 10, 10, 10));
    }, []);

    const commitPreview = useCallback((pixels, color) => {
        if (!drawCanvasRef.current || !previewCanvasRef.current) return;
        const ctx = drawCanvasRef.current.getContext('2d');
        const pCtx = previewCanvasRef.current.getContext('2d');
        pCtx.clearRect(0, 0, 4000, 4000);
        const stroke = [];
        ctx.fillStyle = color;
        pixels.forEach(p => {
            ctx.fillRect(p.col * 10, p.row * 10, 10, 10);
            stroke.push({ col: p.col, row: p.row, color });
        });
        if (stroke.length > 0) {
            historyStack.current = historyStack.current.slice(0, historyIndex.current + 1);
            historyStack.current.push(stroke);
            historyIndex.current++;
        }
    }, []);


    useEffect(() => {
        const screenEl = screenRef.current;
        if (!screenEl) return;

        const isUIElement = (e) => e.target.closest('.dynamic-island') || e.target.closest('.thumb-zone') || e.target.closest('.top-zone') || e.target.closest('.bottom-dock');

        const handlePointerDown = (e) => {
            if (isUIElement(e)) return;
            const tool = useStore.getState().activeTool;
            const color = useStore.getState().activeColor;
            const pos = getGridPos(e.clientX, e.clientY);
            
            if (tool === 'move') {
                panState.current.isDragging = true;
                panState.current.startX = e.clientX;
                panState.current.startY = e.clientY;
            } else if (tool === 'bucket') {
                floodFill(pos.col, pos.row, color);
            } else if (tool === 'pipette') {
                pickColor(pos.col, pos.row);
            } else if (tool === 'line' || tool === 'rect' || tool === 'circle') {
                toolState.current.startCol = pos.col;
                toolState.current.startRow = pos.row;
                drawState.current.isDrawing = true;
            } else {
                drawState.current.isDrawing = true;
                currentStroke.current = [];
                paintPixel(e.clientX, e.clientY);
            }
        };

        const handlePointerMove = (e) => {
            const tool = useStore.getState().activeTool;
            const color = useStore.getState().activeColor;

            if (panState.current.isDragging) {
                const deviceEl = document.getElementById('device-wrapper');
                let hwScale = 1;
                if (deviceEl) { const m = new DOMMatrix(window.getComputedStyle(deviceEl).transform); hwScale = m.a || 1; }
                panState.current.offsetX += (e.clientX - panState.current.startX) / hwScale;
                panState.current.offsetY += (e.clientY - panState.current.startY) / hwScale;
                panState.current.startX = e.clientX;
                panState.current.startY = e.clientY;
                updateGrid();
            } else if (drawState.current.isDrawing) {
                const pos = getGridPos(e.clientX, e.clientY);
                if (tool === 'line') {
                    const pixels = getLinePixels(toolState.current.startCol, toolState.current.startRow, pos.col, pos.row);
                    drawPreview(pixels, color);
                } else if (tool === 'rect') {
                    const pixels = [];
                    const x0 = Math.min(toolState.current.startCol, pos.col), x1 = Math.max(toolState.current.startCol, pos.col);
                    const y0 = Math.min(toolState.current.startRow, pos.row), y1 = Math.max(toolState.current.startRow, pos.row);
                    for (let c = x0; c <= x1; c++) { pixels.push({col:c,row:y0}); pixels.push({col:c,row:y1}); }
                    for (let r = y0+1; r < y1; r++) { pixels.push({col:x0,row:r}); pixels.push({col:x1,row:r}); }
                    drawPreview(pixels, color);
                } else if (tool === 'circle') {
                    const pixels = getCirclePixels(toolState.current.startCol, toolState.current.startRow, pos.col - toolState.current.startCol, pos.row - toolState.current.startRow);
                    drawPreview(pixels, color);
                } else {
                    paintPixel(e.clientX, e.clientY);
                }
            }
        };

        const handlePointerUp = (e) => {
            const tool = useStore.getState().activeTool;
            const color = useStore.getState().activeColor;

            if (tool === 'line' || tool === 'rect' || tool === 'circle') {
                const pos = getGridPos(e.clientX, e.clientY);
                if (tool === 'line') {
                    commitPreview(getLinePixels(toolState.current.startCol, toolState.current.startRow, pos.col, pos.row), color);
                } else if (tool === 'rect') {
                    const pixels = [];
                    const x0 = Math.min(toolState.current.startCol, pos.col), x1 = Math.max(toolState.current.startCol, pos.col);
                    const y0 = Math.min(toolState.current.startRow, pos.row), y1 = Math.max(toolState.current.startRow, pos.row);
                    for (let c = x0; c <= x1; c++) { pixels.push({col:c,row:y0}); pixels.push({col:c,row:y1}); }
                    for (let r = y0+1; r < y1; r++) { pixels.push({col:x0,row:r}); pixels.push({col:x1,row:r}); }
                    commitPreview(pixels, color);
                } else if (tool === 'circle') {
                    commitPreview(getCirclePixels(toolState.current.startCol, toolState.current.startRow, pos.col - toolState.current.startCol, pos.row - toolState.current.startRow), color);
                }
                toolState.current = { startCol: -1, startRow: -1 };
            } else if (drawState.current.isDrawing && currentStroke.current.length > 0) {
                historyStack.current = historyStack.current.slice(0, historyIndex.current + 1);
                historyStack.current.push([...currentStroke.current]);
                historyIndex.current++;
            }
            panState.current.isDragging = false;
            drawState.current.isDrawing = false;
        };

        const handleWheel = (e) => {
            if (isUIElement(e)) return;
            e.preventDefault();
            const deviceEl = document.getElementById('device-wrapper');
            const hwScale = deviceEl ? parseFloat(deviceEl.style.transform.replace(/[^\d.]/g, '') || 1) : 1;
            const zoomSensitivity = 0.002;
            const zoomDelta = -e.deltaY * zoomSensitivity;
            const prevZoom = panState.current.zoom;
            let newZoom = Math.min(Math.max(0.2, prevZoom + zoomDelta), 15);
            
            const rect = screenEl.getBoundingClientRect();
            const mouseX = (e.clientX - rect.left) / hwScale;
            const mouseY = (e.clientY - rect.top) / hwScale;

            panState.current.offsetX = mouseX - (mouseX - panState.current.offsetX) * (newZoom / prevZoom);
            panState.current.offsetY = mouseY - (mouseY - panState.current.offsetY) * (newZoom / prevZoom);
            panState.current.zoom = newZoom;
            updateGrid();
        };

        screenEl.addEventListener('pointerdown', handlePointerDown);
        window.addEventListener('pointermove', handlePointerMove);
        window.addEventListener('pointerup', handlePointerUp);
        screenEl.addEventListener('wheel', handleWheel, { passive: false });

        const preventTouch = (e) => { if (!e.target.closest('.thumb-box') && !e.target.closest('.settings-panel')) e.preventDefault(); };
        document.addEventListener('touchmove', preventTouch, { passive: false });

        return () => {
            screenEl.removeEventListener('pointerdown', handlePointerDown);
            window.removeEventListener('pointermove', handlePointerMove);
            window.removeEventListener('pointerup', handlePointerUp);
            screenEl.removeEventListener('wheel', handleWheel);
            document.removeEventListener('touchmove', preventTouch);
        };
    }, [updateGrid]);

    useEffect(() => {
        const handleScaling = () => {
            const wrapper = document.getElementById('device-wrapper');
            if(!wrapper) return;
            
            const winW = window.innerWidth;
            const winH = window.innerHeight;
            
            const deviceW = 454; 
            const deviceH = 956; 
            
            const paddingX = 40; 
            const paddingY = 60;
            
            const scaleW = (winW - paddingX) / deviceW;
            const scaleH = (winH - paddingY) / deviceH;
            
            const targetScale = Math.min(scaleW, scaleH, 1);
            wrapper.style.transform = `scale(${targetScale})`;
        };
        handleScaling();
        window.addEventListener('resize', handleScaling);
        return () => window.removeEventListener('resize', handleScaling);
    }, []);

    return (
        <div className="canvas-root">
            <style>{`
                :root {
                    --iphone-w: 430px; --iphone-h: 932px; --bezel: 12px; --radius: 55px;
                    --island-w: 125px; --island-h: 37px; --island-top: 11px;
                    --grid-size: 10px; --grid-color: rgba(0, 0, 0, 0.08);
                    --frame-color: #1c1c1e; --button-color: #2c2c2e;
                }
                .canvas-root {
                    background-color: #0a0a0a; display: flex; flex-direction: column; justify-content: center;
                    align-items: center; height: 100dvh; width: 100vw; margin: 0;
                    font-family: ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
                    color: white; overflow: hidden; touch-action: none;
                    -webkit-user-select: none; user-select: none;
                }
                .device-wrapper {
                    position: relative; transform-origin: center; display: flex; justify-content: center;
                    align-items: center; padding: 40px; transition: transform 0.2s cubic-bezier(0.2, 0, 0.2, 1);
                }
                .physical-button { position: absolute; background: var(--button-color); border-radius: 2px; z-index: -1; }
                .power-btn { right: 32px; top: 220px; width: 4px; height: 90px; border-radius: 0 4px 4px 0; }
                .mute-btn { left: 32px; top: 130px; width: 4px; height: 35px; border-radius: 4px 0 0 4px; }
                .vol-up { left: 32px; top: 190px; width: 4px; height: 60px; border-radius: 4px 0 0 4px; }
                .vol-down { left: 32px; top: 265px; width: 4px; height: 60px; border-radius: 4px 0 0 4px; }
                .device-frame {
                    width: calc(var(--iphone-w) + (var(--bezel) * 2)); height: calc(var(--iphone-h) + (var(--bezel) * 2));
                    background: var(--frame-color); border-radius: var(--radius); padding: var(--bezel);
                    position: relative; box-shadow: 0 0 0 1px #333, inset 0 0 2px rgba(255,255,255,0.2), 0 50px 100px rgba(0,0,0,0.9);
                }
                .screen {
                    width: var(--iphone-w); height: var(--iphone-h); background: #ffffff;
                    border-radius: calc(var(--radius) - var(--bezel)); position: relative; overflow: hidden;
                    display: flex; flex-direction: column; box-shadow: inset 0 0 4px rgba(0,0,0,0.1);
                }
                .viewport {
                    position: absolute; inset: 0; overflow: hidden;
                    cursor: crosshair;
                }
                .workspace-layer {
                    position: absolute; top: -1000px; left: -1000px; width: 4000px; height: 4000px;
                    transform-origin: 1000px 1000px;
                    transform: translate(var(--offset-x, 0px), var(--offset-y, 0px)) scale(var(--zoom, 1));
                    background-image: linear-gradient(to right, var(--grid-color) 1px, transparent 1px), linear-gradient(to bottom, var(--grid-color) 1px, transparent 1px);
                    background-size: var(--grid-size) var(--grid-size);
                    display: ${showGrid ? 'block' : 'none'};
                    transition: ${panState.current.isDragging ? 'none' : 'transform 0.8s cubic-bezier(0.34, 1.56, 0.64, 1)'};
                }
                .pixel-grid-bg {
                    /* Wrapper de perspectiva 3D */
                    position: absolute; inset: 0;
                    transform-origin: center center;
                    transition: transform 0.8s cubic-bezier(0.34, 1.56, 0.64, 1);
                    ${viewMode === '2d_iso' ? 'transform: rotateX(60deg) rotateZ(45deg) scale(1.5);' : 
                      viewMode === 'voxel' ? 'transform: perspective(1000px) rotateX(25deg) scale(1.1);' : 
                      viewMode === 'voxel_iso' ? 'transform: perspective(1000px) rotateX(60deg) rotateZ(45deg) scale(1.5);' : 
                      'transform: none;'}
                }
                .drawing-canvas {
                    position: absolute; top: 0; left: 0; width: 100%; height: 100%; pointer-events: none;
                }
                
                .settings-panel {
                    position: absolute; top: 80px; right: 16px; width: 220px;
                    background: rgba(28, 28, 30, 0.85); backdrop-filter: blur(20px);
                    border: 1px solid rgba(255, 255, 255, 0.1); border-radius: 20px;
                    padding: 18px; z-index: 2000; box-shadow: 0 20px 40px rgba(0,0,0,0.5);
                    animation: slideIn 0.3s cubic-bezier(0.23, 1, 0.32, 1);
                }
                @keyframes slideIn { from { opacity: 0; transform: translateY(-10px); } to { opacity: 1; transform: translateY(0); } }
                .settings-row { display: flex; justify-content: space-between; align-items: center; margin-bottom: 12px; }
                .settings-label { color: #8e8e93; font-size: 13px; font-weight: 500; }
                .toggle-btn { 
                    background: #3b82f6; border: none; border-radius: 12px; padding: 4px 12px; 
                    color: white; font-size: 10px; cursor: pointer; font-weight: 600;
                }
                .toggle-btn.off { background: #3a3a3c; color: #8e8e93; }
                .iso-mode-btn { width: 100%; margin-top: 5px; background: #5856d6; }

                .dynamic-island {
                    position: absolute; top: var(--island-top); left: 50%; transform: translateX(-50%);
                    width: var(--island-w); height: var(--island-h); background: #000; border-radius: 20px;
                    z-index: 1000; box-shadow: 0 0 0 5px #3b82f6, 0 0 15px rgba(59, 130, 246, 0.5), 0 25px 50px -12px rgba(0, 0, 0, 0.55);
                    transition: all 0.5s cubic-bezier(0.175, 0.885, 0.32, 1.275);
                    cursor: pointer; overflow: visible;
                }
                .dynamic-island.is-expanded {
                    width: 400px; height: 420px; border-radius: 44px; top: var(--island-top);
                }
                
                /* DASHBOARD DE HABILIDADES */
                .skills-dashboard {
                    position: absolute; top: 80px; left: 50%; transform: translateX(-50%);
                    width: 280px; background: rgba(0, 0, 0, 0.85); border: 1px solid rgba(59, 130, 246, 0.4);
                    border-radius: 12px; padding: 15px; z-index: 2000; backdrop-filter: blur(10px);
                    font-family: 'Courier New', Courier, monospace; color: #3b82f6; font-size: 10px;
                    box-shadow: 0 10px 30px rgba(0,0,0,0.8);
                    animation: dash-slide 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);
                }
                .dash-header { border-bottom: 1px solid rgba(59, 130, 246, 0.2); margin-bottom: 10px; padding-bottom: 5px; font-weight: bold; display: flex; justify-content: space-between; }
                .dash-row { display: flex; justify-content: space-between; margin-bottom: 6px; }
                .dash-label { color: rgba(255, 255, 255, 0.6); }
                .dash-bar-bg { width: 100px; height: 4px; background: rgba(255,255,255,0.1); border-radius: 2px; overflow: hidden; margin-top: 4px; }
                .dash-bar-fill { height: 100%; background: #3b82f6; box-shadow: 0 0 5px #3b82f6; transition: width 0.3s ease; }
                
                @keyframes dash-slide {
                    from { transform: translateX(-50%) translateY(-20px); opacity: 0; }
                    to { transform: translateX(-50%) translateY(0); opacity: 1; }
                }

                .copic-wheel {
                    position: absolute; top: 210px; left: 50%; transform: translateX(-50%);
                    width: 0; height: 0; pointer-events: none;
                }
                .copic-swatch {
                    position: absolute; width: 22px; height: 22px; background: var(--color);
                    border-radius: 4px; display: flex; justify-content: center; align-items: center;
                    transform: rotate(var(--angle)) translateX(var(--radius)) rotate(calc(-1 * var(--angle)));
                    box-shadow: 0 2px 5px rgba(0,0,0,0.2);
                    animation: swatch-pop 0.5s cubic-bezier(0.175, 0.885, 0.32, 1.275) forwards;
                    opacity: 0; pointer-events: auto;
                }
                .copic-swatch:hover { transform: rotate(var(--angle)) translateX(var(--radius)) rotate(calc(-1 * var(--angle))) scale(1.3); z-index: 10; }
                .copic-swatch.is-active { outline: 2px solid white; outline-offset: 2px; z-index: 5; scale: 1.1; }
                .copic-label { font-size: 6px; font-weight: bold; color: rgba(0,0,0,0.5); pointer-events: none; }

                @keyframes swatch-pop {
                    from { opacity: 0; scale: 0; }
                    to { opacity: 1; scale: 1; }
                }
                .thumb-zone {
                    position: absolute; top: 60%; transform: translateY(-50%); display: flex; flex-direction: column; gap: 12px; z-index: 50; 
                }
                .thumb-left { left: 10px; }
                .thumb-right { right: 10px; }
                .thumb-box {
                    width: 48px; height: 48px; background: rgba(0, 0, 0, 0.05); border: 2px solid rgba(0, 0, 0, 0.15);
                    border-radius: 12px; backdrop-filter: blur(4px); -webkit-backdrop-filter: blur(4px);
                    transition: transform 0.4s cubic-bezier(0.34, 1.56, 0.64, 1), background 0.2s, box-shadow 0.2s;
                    cursor: pointer; display: flex; justify-content: center; align-items: center; position: relative; z-index: 2; 
                    box-shadow: 0 10px 25px -5px rgba(0, 0, 0, 0.3);
                }
                .top-zone { position: absolute; top: 13px; display: flex; gap: 8px; z-index: 50; }
                .top-zone-left { left: 16px; }
                .top-zone-right { right: 16px; }
                .top-box {
                    width: 32px; height: 32px; background: rgba(0, 0, 0, 0.05); border: 1px solid rgba(0, 0, 0, 0.15);
                    border-radius: 50%; backdrop-filter: blur(4px); cursor: pointer; display: flex; justify-content: center;
                    align-items: center; transition: all 0.15s ease; box-shadow: 0 4px 12px -2px rgba(0, 0, 0, 0.2);
                }
                .top-box:active { transform: scale(0.9); background: rgba(0, 0, 0, 0.15); }
                .top-box .box-num { font-size: 12px; }
                
                /* MODO PWA NATIVO (iPhone Real) */
                @media (max-width: 480px) {
                    .canvas-root { background-color: #1c1c1e; }
                    .device-wrapper { padding: 0 !important; width: 100vw; height: 100dvh; transform: none !important; border-radius: 0; box-shadow: none; }
                    .device-frame { width: 100vw; height: 100dvh; padding: 0; border-radius: 0; border: none; box-shadow: none; }
                    .screen { width: 100vw; height: 100dvh; border-radius: 0; }
                    .physical-button { display: none; }
                }
                .current-color-preview { width: 24px; height: 24px; border-radius: 6px; border: 1px solid rgba(255,255,255,0.2); box-shadow: 0 2px 5px rgba(0,0,0,0.3); }
                .bottom-dock {
                    position: absolute; bottom: 10px; left: 10px; right: 10px; height: 80px; background: rgba(0, 0, 0, 0.05);
                    backdrop-filter: blur(4px); -webkit-backdrop-filter: blur(4px); border: 2px solid rgba(0, 0, 0, 0.15);
                    border-radius: 40px; z-index: 60; display: flex; justify-content: center; align-items: center; box-shadow: 0 10px 25px -5px rgba(0, 0, 0, 0.3);
                }
                .box-num { font-family: ui-monospace, SFMono-Regular, monospace; font-size: 18px; font-weight: 700; color: rgba(0, 0, 0, 0.6); pointer-events: none; transition: font-size 0.2s ease; display: flex; align-items: center; justify-content: center; }
                .box-num svg { stroke: rgba(0, 0, 0, 0.6); }
                .thumb-box.is-held .box-num svg { stroke: white; }
                .status-info { font-family: monospace; font-size: 9px; color: rgba(0, 0, 0, 0.4); letter-spacing: 1px; pointer-events: none; }
                
                .tool-ring {
                    position: absolute; width: 308px; height: 308px; border-radius: 50%; opacity: 0; pointer-events: none; z-index: 1; 
                    transition: transform 0.5s cubic-bezier(0.175, 0.885, 0.32, 1.275), opacity 0.3s ease, scale 0.5s cubic-bezier(0.175, 0.885, 0.32, 1.275);
                    transform: translate(-50%, -50%) rotate(var(--ring-rot, 0deg)) scale(0.6);
                }
                .thumb-left .tool-ring { left: -10px; top: 84px; }
                .thumb-zone.show-ring .tool-ring { opacity: 1; transform: translate(-50%, -50%) rotate(var(--ring-rot, 0deg)) scale(1); }
                .thumb-left .thumb-box.is-held {
                    background: #2c2c2e; border-color: rgba(255, 255, 255, 0.2); 
                    transform: translateX(96px) scale(var(--held-scale, 1)) !important; 
                    box-shadow: 0 20px 40px -10px rgba(0, 0, 0, 0.6);
                    transition: transform 0.4s cubic-bezier(0.34, 1.56, 0.64, 1);
                }
                .thumb-box.is-returning {
                    transition: transform 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275) !important;
                }
                .thumb-box.swap-flash { background: #3b82f6 !important; border-color: #60a5fa !important; box-shadow: 0 0 20px rgba(59, 130, 246, 0.8) !important; transition: none !important; }
                .ring-item {
                    position: absolute; width: 48px; height: 48px; left: 50%; top: 50%; margin-left: -24px; margin-top: -24px;
                    background: #1c1c1e; border: 2px solid rgba(255, 255, 255, 0.2); border-radius: 12px; display: flex; justify-content: center; align-items: center;
                    box-shadow: 0 10px 25px -5px rgba(0,0,0,0.5); transition: transform 0.15s cubic-bezier(0.4, 0, 0.2, 1), opacity 0.15s ease-out;
                    color: white !important; z-index: 1001;
                }
                .ring-item svg { stroke: white !important; filter: drop-shadow(0 2px 4px rgba(0,0,0,0.5)); }
                .ring-icon-wrapper { display: flex; justify-content: center; align-items: center; z-index: 1002; pointer-events: none; }

                .thumb-left .ring-item { transform: rotate(var(--a)) translateX(130px) rotate(calc(var(--a) * -1 - var(--ring-rot, 0deg))); }


    /* ZONA DERECHA: PALETA Y ACCIONES */
    
    /* CAJA 5 ACTIVA: TINTED GLOW Y SOMBRAS BASADAS EN SU COLOR ACTIVO */
    .thumb-box.is-color-tool {
        background: var(--active-color) !important;
        border-radius: 12px !important;
        border: 2px solid rgba(255, 255, 255, 0.4) !important; 
        box-shadow: 0 15px 35px -5px color-mix(in srgb, var(--active-color) 70%, transparent), 
                    inset 0 2px 4px rgba(255,255,255,0.4) !important;
        transition: transform 0.2s cubic-bezier(0.34, 1.56, 0.64, 1), background 0.3s ease, box-shadow 0.2s ease !important;
    }
    .thumb-box.is-color-tool .box-num { display: none; }
    
    .thumb-right .thumb-box.is-held {
        transform: translateX(-160px) scale(1.05) !important; 
        box-shadow: 0 35px 65px -10px color-mix(in srgb, var(--button-color) 95%, transparent), 
                    0 15px 25px -5px color-mix(in srgb, var(--button-color) 70%, transparent) !important;
        z-index: 100;
    }
    
    .thumb-right .thumb-box.is-color-tool.is-color-mode {
        background: transparent !important; border-color: transparent !important; box-shadow: none !important;
    }
    
    .thumb-right .thumb-box.is-action-drag {
        transform: translateX(calc(-96px + var(--drag-x, 0px))) scale(1.05) !important;
        transition: transform 0.1s linear, background 0.2s, box-shadow 0.2s;
        box-shadow: 0 35px 65px -10px color-mix(in srgb, var(--button-color) 95%, transparent), 
                    0 15px 25px -5px color-mix(in srgb, var(--button-color) 70%, transparent) !important;
    }

    .color-panel {
                    position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%);
                    width: 48px; height: 48px; border-radius: 12px;
                    background: transparent; transition: all 0.4s cubic-bezier(0.34, 1.56, 0.64, 1);
                    display: flex; justify-content: center; align-items: center; z-index: 10;
                    pointer-events: none; 
                }
                .thumb-right .thumb-box.is-held .color-panel {
                    background: #2c2c2e; border: 2px solid rgba(255, 255, 255, 0.2);
                    box-shadow: 0 20px 40px -10px rgba(0, 0, 0, 0.6);
                }
                
                /* ACTUALIZACIÓN HIPERREALISTA: Bandeja Skeuomórfica */
                .color-panel.is-expanded {
                    width: 190px; height: 230px; border-radius: 18px; 
                    background: #1c1c1e; padding: 15px;
                    display: grid; grid-template-columns: repeat(4, 1fr); grid-template-rows: repeat(5, 1fr); 
                    grid-auto-flow: column; gap: 10px;
                    box-shadow: 
                        10px 10px 20px rgba(0,0,0,0.6), 
                        -5px -5px 15px rgba(255,255,255,0.02),
                        inset 1px 1px 2px rgba(255,255,255,0.1);
                    border: 1px solid rgba(0,0,0,0.3);
                }
                
                .color-swatch {
                    border-radius: 8px; background: var(--swatch); opacity: 0; transform: scale(0.5);
                    transition: transform 0.2s cubic-bezier(0.4, 0, 0.2, 1), box-shadow 0.2s, opacity 0.2s ease; 
                    /* Efecto Sumido Sutil (Reducido al 30%) */
                    box-shadow: 
                        inset 1px 1px 3px rgba(0,0,0,0.2), 
                        inset -1px -1px 2px rgba(255,255,255,0.03);
                    width: 100%; height: 100%; box-sizing: border-box;
                    position: relative; overflow: hidden;
                }
                
                /* Brillo de Pintura Fresca Sutil */
                .color-swatch::before {
                    content: ''; position: absolute; top: 0; left: 0; right: 0; bottom: 0;
                    background: linear-gradient(135deg, rgba(255,255,255,0.05) 0%, transparent 40%);
                    pointer-events: none;
                }
                
                .color-swatch::after {
                    content: ''; position: absolute; top: 15%; left: 15%; width: 30%; height: 30%;
                    background: rgba(255,255,255,0.03); filter: blur(1px); border-radius: 50%;
                    pointer-events: none;
                }

                .color-panel.is-expanded .color-swatch { opacity: 1; transform: scale(1); pointer-events: auto; }
                
                .color-swatch.is-hovered {
                    transform: scale(1.1) translateY(2px);
                    box-shadow: 
                        inset 2px 2px 5px rgba(0,0,0,0.4), 
                        inset -1px -1px 3px rgba(255,255,255,0.02);
                    z-index: 20;
                }
                
                /* Caja 5 — Preview de Color Activo (mantiene visible el swatch) */
                .color-swatch.is-selected {
                    outline: 2px solid rgba(255,255,255,0.8);
                    outline-offset: 1px;
                    z-index: 25;
                    transform: scale(1.05);
                }
            `}</style>

            <div className="device-wrapper" id="device-wrapper">
                <div className="physical-button mute-btn"></div>
                <div className="physical-button vol-up"></div>
                <div className="physical-button vol-down"></div>
                <div className="physical-button power-btn"></div>

                <div className="device-frame">
                    <div className="screen" ref={screenRef}>
                        {viewMode.includes('voxel') ? (
                            <VoxelEngine 
                                mode={viewMode} 
                                activeColor={activeColor} 
                                voxelData={voxelData.current}
                                onVoxelDataChange={(data) => { voxelData.current = data; }}
                            />
                        ) : viewMode === '2d_iso' ? (
                            // Modo Isométrico: Canvas 2D oculto + Renderer ISO encima
                            <>
                                <div style={{ position: 'absolute', inset: 0, opacity: 0, pointerEvents: 'none' }}>
                                    <div className="viewport">
                                        <div className="workspace-layer" ref={canvasRef}>
                                            <canvas ref={drawCanvasRef} className="drawing-canvas" width={4000} height={4000} />
                                            <canvas ref={previewCanvasRef} className="drawing-canvas" width={4000} height={4000}
                                                style={{ opacity: 0.7, pointerEvents: 'none' }} />
                                        </div>
                                    </div>
                                </div>
                                <IsometricEngine drawCanvasRef={drawCanvasRef} />
                            </>
                        ) : (
                            <div 
                                className="pixel-grid-bg"
                                style={{
                                    transform: viewMode === '2d_iso'
                                        ? 'rotateX(60deg) rotateZ(45deg) scale(1.4)'
                                        : 'none',
                                    transformOrigin: 'center center',
                                    transition: 'transform 0.8s cubic-bezier(0.34, 1.56, 0.64, 1)',
                                    perspective: '1200px',
                                }}
                            >
                                <div className="viewport">
                                    <div className="workspace-layer" ref={canvasRef}>
                                        <canvas ref={drawCanvasRef} className="drawing-canvas" width={4000} height={4000} />
                                        <canvas ref={previewCanvasRef} className="drawing-canvas" width={4000} height={4000}
                                            style={{ opacity: 0.7, pointerEvents: 'none' }} />
                                    </div>
                                </div>
                            </div>
                        )}
                        
                        <div className="top-zone top-zone-left">
                            <div className="top-box"><span className="box-num">A</span></div>
                            <div className="top-box"><span className="box-num">B</span></div>
                            <div className="top-box"><span className="box-num">C</span></div>
                        </div>

                        <div className="top-zone top-zone-right">
                            <div className="top-box" onClick={toggleSettings} title="Settings">
                                <span className="box-num" style={{ color: showSettings ? '#3b82f6' : 'inherit' }}>
                                    <Settings size={14} />
                                </span>
                            </div>
                            <div className="top-box" onClick={toggleDashboard} title="Skills Monitor">
                                <span className="box-num" style={{ color: showDashboard ? '#3b82f6' : 'inherit' }}>
                                    <BarChart3 size={14} />
                                </span>
                            </div>
                            <div className="top-box"><span className="box-num">F</span></div>
                        </div>

                        <ThumbZoneLeft initialBoxes={INITIAL_LEFT_BOXES} initialRing={INITIAL_LEFT_RING} />
                        <ThumbZoneRight initialBoxes={INITIAL_RIGHT_BOXES} onUndo={handleUndo} onRedo={handleRedo} />

                        {showSettings && (
                            <div className="settings-panel">
                                <h3 style={{ color: 'white', fontSize: '14px', marginBottom: '12px', fontWeight: '700' }}>Ajustes de Studio</h3>
                                <div className="settings-row">
                                    <span className="settings-label">Grid de Precisión</span>
                                    <button className={`toggle-btn ${!showGrid ? 'off' : ''}`} onClick={toggleGrid}>
                                        {showGrid ? 'ON' : 'OFF'}
                                    </button>
                                </div>
                                <div className="settings-row" style={{ flexDirection: 'column', alignItems: 'flex-start' }}>
                                    <span className="settings-label" style={{ marginBottom: '8px' }}>Motor Dimensional</span>
                                    <button 
                                        className="toggle-btn iso-mode-btn"
                                        onClick={() => setViewMode(prev => DIMENSIONAL_MODES[(DIMENSIONAL_MODES.indexOf(prev) + 1) % DIMENSIONAL_MODES.length])}
                                    >
                                        MODO ACTUAL: {viewMode.replace('_', ' ').toUpperCase()}
                                    </button>
                                </div>
                                <div style={{ borderTop: '1px solid rgba(255,255,255,0.1)', paddingTop: '8px', marginTop: '8px', textAlign: 'center' }}>
                                    <span style={{ color: '#48484a', fontSize: '9px', fontWeight: 'bold' }}>PIXVOXIA CANVAS V3.2 PRO</span>
                                </div>
                            </div>
                        )}


                        <div 
                            className={`dynamic-island ${isIslandExpanded ? 'is-expanded' : ''}`}
                            onPointerDown={handleIslandPointerDown}
                            onPointerUp={handleIslandPointerUp}
                            onPointerLeave={handleIslandPointerLeave}
                            onPointerCancel={handleIslandPointerLeave}
                            style={{ userSelect: 'none', WebkitUserSelect: 'none' }}
                        >
                            {isIslandExpanded && (
                                <div className="copic-wheel">
                                    {COPIC_DATA.map((group, gIdx) => (
                                        group.colors.map((color, cIdx) => {
                                            const angle = (gIdx * (360 / COPIC_DATA.length)) - 90;
                                            const radius = 60 + (cIdx * 25);
                                            return (
                                                <div 
                                                    key={`${gIdx}-${cIdx}`}
                                                    className={`copic-swatch ${activeColor === color ? 'is-active' : ''}`}
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        setActiveColor(color);
                                                        if(navigator.vibrate) navigator.vibrate(10);
                                                    }}
                                                    style={{ 
                                                        '--color': color,
                                                        '--angle': `${angle}deg`,
                                                        '--radius': `${radius}px`,
                                                        transitionDelay: `${(gIdx * 0.02) + (cIdx * 0.01)}s`
                                                    }}
                                                >
                                                    <span className="copic-label">{group.fam}{cIdx}</span>
                                                </div>
                                            );
                                        })
                                    ))}
                                </div>
                            )}
                        </div>
                        
                        <div className="bottom-dock">
                            <div className="status-info">IPHONE 14 PRO MAX PRECISION CANVAS (REACT)</div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default App;
