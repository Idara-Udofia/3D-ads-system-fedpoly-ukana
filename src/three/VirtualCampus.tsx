import React, { useEffect, useRef, useState, useMemo } from 'react';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { CampusLocation, Programme, Facility, VideoItem } from '../types';
import analytics from '../services/analytics';
import {
  Compass,
  Layers,
  Sun,
  Moon,
  Sunset,
  Eye,
  Info,
  ExternalLink,
  Play,
  GraduationCap,
  Building2,
  MapPin,
  Maximize2,
  Minimize2,
  RotateCcw,
  Sparkles,
  Map as MapIcon,
  HelpCircle,
  X
} from 'lucide-react';

interface VirtualCampusProps {
  locations: CampusLocation[];
  programmes?: Programme[];
  facilities?: Facility[];
  videos?: VideoItem[];
  onSelectVideo?: (videoId: string) => void;
  onSelectProgramme?: (programmeId: string) => void;
  onSelectFacility?: (facilityId: string) => void;
  initialSelectedId?: string;
  isCompact?: boolean;
}

type LightingMode = 'day' | 'sunset' | 'night';

export const VirtualCampus: React.FC<VirtualCampusProps> = ({
  locations,
  programmes = [],
  facilities = [],
  videos = [],
  onSelectVideo,
  onSelectProgramme,
  onSelectFacility,
  initialSelectedId,
  isCompact = false,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  // States
  const [selectedLocation, setSelectedLocation] = useState<CampusLocation | null>(null);
  const [hoveredLocation, setHoveredLocation] = useState<CampusLocation | null>(null);
  const [lightingMode, setLightingMode] = useState<LightingMode>('day');
  const [showLabels, setShowLabels] = useState<boolean>(true);
  const [viewMode, setViewMode] = useState<'3d' | '2d'>('3d');
  const [isFullscreen, setIsFullscreen] = useState<boolean>(false);
  const [webglError, setWebglError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [showGuide, setShowGuide] = useState<boolean>(false);

  // Three.js instances refs
  const sceneRef = useRef<THREE.Scene | null>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const controlsRef = useRef<OrbitControls | null>(null);
  const buildingMeshesRef = useRef<Map<string, THREE.Group>>(new Map());
  const lightsRef = useRef<{
    ambient: THREE.AmbientLight;
    directional: THREE.DirectionalLight;
    hemi: THREE.HemisphereLight;
    nightLights: THREE.Group;
  } | null>(null);
  const animationFrameIdRef = useRef<number | null>(null);

  // Screen projections for labels
  const [screenPositions, setScreenPositions] = useState<Record<string, { x: number; y: number; visible: boolean }>>({});
  const lastLabelUpdateRef = useRef<number>(0);

  // Initial selection
  useEffect(() => {
    if (initialSelectedId && locations.length > 0) {
      const match = locations.find((l) => l.id === initialSelectedId);
      if (match) setSelectedLocation(match);
    }
  }, [initialSelectedId, locations]);

  // Track 3D interaction when selection changes
  useEffect(() => {
    if (selectedLocation) {
      analytics.campus3DInteraction(selectedLocation.id, selectedLocation.name);
    }
  }, [selectedLocation]);

  // Initialize Three.js Scene
  useEffect(() => {
    if (viewMode !== '3d' || !containerRef.current || !canvasRef.current) return;

    let destroyed = false;
    const container = containerRef.current;
    const canvas = canvasRef.current;

    // Check WebGL availability without creating a context on the real canvas
    try {
      const testCanvas = document.createElement('canvas');
      const gl = testCanvas.getContext('webgl') || testCanvas.getContext('experimental-webgl');
      if (!gl) {
        setWebglError('WebGL is not supported on this browser or device. Switching to 2D Interactive Map.');
        setViewMode('2d');
        setIsLoading(false);
        return;
      }
    } catch {
      setWebglError('WebGL initialization failed. Switching to 2D Interactive Map.');
      setViewMode('2d');
      setIsLoading(false);
      return;
    }

    const width = container.clientWidth;
    const height = container.clientHeight || 560;

    // 1. Scene
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0xdbeafe); // Soft daytime sky
    scene.fog = new THREE.FogExp2(0xdbeafe, 0.007);
    sceneRef.current = scene;

    // 2. Camera
    const camera = new THREE.PerspectiveCamera(45, width / height, 0.5, 500);
    camera.position.set(38, 32, 54);
    cameraRef.current = camera;

    // 3. Renderer
    let renderer: THREE.WebGLRenderer;
    try {
      renderer = new THREE.WebGLRenderer({
        canvas,
        antialias: true,
        alpha: false,
        powerPreference: 'high-performance',
      });
      renderer.setSize(width, height);
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
      renderer.shadowMap.enabled = true;
      renderer.shadowMap.type = THREE.PCFShadowMap;
      renderer.toneMapping = THREE.ACESFilmicToneMapping;
      renderer.toneMappingExposure = 1.05;
      rendererRef.current = renderer;
    } catch (err: any) {
      setWebglError('Failed to initialize 3D renderer: ' + err.message);
      setViewMode('2d');
      setIsLoading(false);
      return;
    }

    // 4. Controls
    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.05;
    controls.maxPolarAngle = Math.PI / 2.08; // Keep camera above ground
    controls.minDistance = 10;
    controls.maxDistance = 140;
    controls.target.set(0, 0, 0);
    controlsRef.current = controls;

    // 5. Lighting
    const ambient = new THREE.AmbientLight(0xffffff, 0.85);
    scene.add(ambient);

    const hemi = new THREE.HemisphereLight(0xe0f2fe, 0x14532d, 0.45);
    scene.add(hemi);

    const directional = new THREE.DirectionalLight(0xfffaf0, 1.3);
    directional.position.set(45, 60, 35);
    directional.castShadow = true;
    directional.shadow.mapSize.width = 2048;
    directional.shadow.mapSize.height = 2048;
    directional.shadow.camera.near = 0.5;
    directional.shadow.camera.far = 160;
    const d = 50;
    directional.shadow.camera.left = -d;
    directional.shadow.camera.right = d;
    directional.shadow.camera.top = d;
    directional.shadow.camera.bottom = -d;
    directional.shadow.bias = -0.0005;
    scene.add(directional);

    // Group for lamppost lights in night mode
    const nightLights = new THREE.Group();
    scene.add(nightLights);

    lightsRef.current = { ambient, directional, hemi, nightLights };

    // 6. Build Campus Environment (Ground, Roads, Roundabouts, Trees)
    createCampusEnvironment(scene, nightLights);

    // 7. Raycasting for building selection & hover
    const raycaster = new THREE.Raycaster();
    const mouse = new THREE.Vector2(-999, -999);

    const getBuildingFromIntersection = (intersects: THREE.Intersection[]) => {
      for (const hit of intersects) {
        let curr: THREE.Object3D | null = hit.object;
        while (curr) {
          const locId = curr.userData?.locationId;
          if (locId) {
            return locations.find((l) => l.id === locId) || null;
          }
          curr = curr.parent;
        }
      }
      return null;
    };

    const handlePointerMove = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect();
      mouse.x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
      mouse.y = -((e.clientY - rect.top) / rect.height) * 2 + 1;

      raycaster.setFromCamera(mouse, camera);
      const intersects = raycaster.intersectObjects(scene.children, true);
      const found = getBuildingFromIntersection(intersects);
      setHoveredLocation(found);
      canvas.style.cursor = found ? 'pointer' : 'default';
    };

    const handlePointerDown = (e: MouseEvent) => {
      // Only handle left click
      if (e.button !== 0) return;
      const rect = canvas.getBoundingClientRect();
      mouse.x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
      mouse.y = -((e.clientY - rect.top) / rect.height) * 2 + 1;

      raycaster.setFromCamera(mouse, camera);
      const intersects = raycaster.intersectObjects(scene.children, true);
      const found = getBuildingFromIntersection(intersects);
      if (found) {
        setSelectedLocation(found);
        focusLocation(found);
      }
    };

    canvas.addEventListener('mousemove', handlePointerMove);
    canvas.addEventListener('click', handlePointerDown);

    // 8. Animation & Render Loop
    let clock = new THREE.Clock();

    const animate = () => {
      if (destroyed) return;
      animationFrameIdRef.current = requestAnimationFrame(animate);

      const delta = clock.getDelta();
      controls.update();

      // Update projected 2D coordinates for screen badges at a throttled cadence
      if (showLabels && camera && renderer) {
        const now = performance.now();

        if (now - lastLabelUpdateRef.current >= 50) {
          const positions: Record<string, { x: number; y: number; visible: boolean }> = {};
          const rect = canvas.getBoundingClientRect();

          locations.forEach((loc) => {
            const worldPos = new THREE.Vector3(loc.position_x, loc.position_y + 4.5, loc.position_z);
            const forward = new THREE.Vector3();
            camera.getWorldDirection(forward);
            const toObj = worldPos.clone().sub(camera.position).normalize();
            const isFront = forward.dot(toObj) > 0.2;

            worldPos.project(camera);
            const x = ((worldPos.x + 1) * rect.width) / 2;
            const y = ((-worldPos.y + 1) * rect.height) / 2;

            positions[loc.id] = {
              x,
              y,
              visible: isFront && x >= 0 && x <= rect.width && y >= 0 && y <= rect.height,
            };
          });

          setScreenPositions(positions);
          lastLabelUpdateRef.current = now;
        }
      }

      renderer.render(scene, camera);
    };

    animate();
    setIsLoading(false);

    // Resize observer
    const resizeObserver = new ResizeObserver(() => {
      if (!container || !renderer || !camera) return;
      const newWidth = container.clientWidth;
      const newHeight = container.clientHeight || 560;
      camera.aspect = newWidth / newHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(newWidth, newHeight);
    });
    resizeObserver.observe(container);

    return () => {
      destroyed = true;
      if (animationFrameIdRef.current) cancelAnimationFrame(animationFrameIdRef.current);
      canvas.removeEventListener('mousemove', handlePointerMove);
      canvas.removeEventListener('click', handlePointerDown);
      resizeObserver.disconnect();
      controls.dispose();
      renderer.dispose();
    };
  }, [viewMode]);

  // Update Buildings meshes when locations change or scene ready
  useEffect(() => {
    const scene = sceneRef.current;
    if (!scene) return;

    // Clear old building meshes
    buildingMeshesRef.current.forEach((mesh) => scene.remove(mesh));
    buildingMeshesRef.current.clear();

    // Rebuild buildings for each location
    locations.forEach((loc) => {
      const buildingGroup = createProceduralBuilding(loc);
      buildingGroup.position.set(loc.position_x, loc.position_y, loc.position_z);
      buildingGroup.rotation.set(loc.rotation_x || 0, loc.rotation_y || 0, loc.rotation_z || 0);
      const s = loc.scale || 1.0;
      buildingGroup.scale.set(s, s, s);
      buildingGroup.userData = { locationId: loc.id, locationName: loc.name };

      scene.add(buildingGroup);
      buildingMeshesRef.current.set(loc.id, buildingGroup);
    });
  }, [locations]);

  // Update Lighting according to mode
  useEffect(() => {
    if (!sceneRef.current || !lightsRef.current) return;
    const scene = sceneRef.current;
    const { ambient, directional, hemi, nightLights } = lightsRef.current;

    if (lightingMode === 'day') {
      scene.background = new THREE.Color(0xdbeafe);
      scene.fog = new THREE.FogExp2(0xdbeafe, 0.007);
      ambient.color.setHex(0xffffff);
      ambient.intensity = 0.85;
      hemi.color.setHex(0xe0f2fe);
      hemi.groundColor.setHex(0x14532d);
      hemi.intensity = 0.45;
      directional.color.setHex(0xfffaf0);
      directional.intensity = 1.3;
      directional.position.set(45, 60, 35);
      nightLights.visible = false;
    } else if (lightingMode === 'sunset') {
      scene.background = new THREE.Color(0xfdba74); // Warm golden sunset
      scene.fog = new THREE.FogExp2(0xfdba74, 0.009);
      ambient.color.setHex(0xffedd5);
      ambient.intensity = 0.65;
      hemi.color.setHex(0xfb923c);
      hemi.groundColor.setHex(0x1e3a1e);
      hemi.intensity = 0.4;
      directional.color.setHex(0xf97316);
      directional.intensity = 1.5;
      directional.position.set(55, 20, 45); // Low sun angle
      nightLights.visible = false;
    } else {
      // Night mode
      scene.background = new THREE.Color(0x020617); // Deep midnight slate
      scene.fog = new THREE.FogExp2(0x020617, 0.012);
      ambient.color.setHex(0x38bdf8);
      ambient.intensity = 0.2;
      hemi.color.setHex(0x1e293b);
      hemi.groundColor.setHex(0x020617);
      hemi.intensity = 0.15;
      directional.color.setHex(0x93c5fd);
      directional.intensity = 0.35;
      directional.position.set(-20, 50, -20);
      nightLights.visible = true;
    }
  }, [lightingMode]);

  // Smooth camera tween to focus a location
  const focusLocation = (loc: CampusLocation) => {
    if (!cameraRef.current || !controlsRef.current) return;
    const camera = cameraRef.current;
    const controls = controlsRef.current;

    const targetPos = new THREE.Vector3(loc.position_x, loc.position_y + 1, loc.position_z);
    const cameraTargetPos = new THREE.Vector3(
      loc.position_x + 16,
      loc.position_y + 12,
      loc.position_z + 18
    );

    const startCamera = camera.position.clone();
    const startTarget = controls.target.clone();
    let progress = 0;

    const tween = () => {
      progress += 0.045;
      if (progress <= 1) {
        camera.position.lerpVectors(startCamera, cameraTargetPos, easeOutQuad(progress));
        controls.target.lerpVectors(startTarget, targetPos, easeOutQuad(progress));
        requestAnimationFrame(tween);
      } else {
        camera.position.copy(cameraTargetPos);
        controls.target.copy(targetPos);
      }
    };
    tween();
  };

  const easeOutQuad = (t: number) => t * (2 - t);

  // Preset Views
  const setCameraPreset = (preset: 'overview' | 'gate' | 'admin' | 'quad' | 'hostels') => {
    if (!cameraRef.current || !controlsRef.current) return;
    const camera = cameraRef.current;
    const controls = controlsRef.current;

    let target = new THREE.Vector3(0, 0, 0);
    let pos = new THREE.Vector3(38, 32, 54);

    if (preset === 'overview') {
      target.set(0, 0, 0);
      pos.set(40, 36, 58);
    } else if (preset === 'gate') {
      target.set(0, 2, 28);
      pos.set(0, 10, 48);
    } else if (preset === 'admin') {
      target.set(-12, 2, 14);
      pos.set(-2, 12, 32);
    } else if (preset === 'quad') {
      target.set(0, 2, -4);
      pos.set(18, 14, 16);
    } else if (preset === 'hostels') {
      target.set(16, 2, -26);
      pos.set(30, 14, -10);
    }

    const startCamera = camera.position.clone();
    const startTarget = controls.target.clone();
    let progress = 0;
    const tween = () => {
      progress += 0.05;
      if (progress <= 1) {
        camera.position.lerpVectors(startCamera, pos, easeOutQuad(progress));
        controls.target.lerpVectors(startTarget, target, easeOutQuad(progress));
        requestAnimationFrame(tween);
      }
    };
    tween();
  };

  const toggleFullscreen = () => {
    if (!containerRef.current) return;
    if (!isFullscreen) {
      if (containerRef.current.requestFullscreen) {
        containerRef.current.requestFullscreen();
      }
      setIsFullscreen(true);
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen();
      }
      setIsFullscreen(false);
    }
  };

  return (
    <div
      ref={containerRef}
      className={`relative w-full overflow-hidden rounded-2xl border border-slate-200 bg-slate-900 shadow-xl select-none ${
        isCompact ? 'h-[440px]' : isFullscreen ? 'h-screen' : 'h-[640px] md:h-[720px]'
      }`}
    >
      {/* 3D Canvas */}
      {viewMode === '3d' && (
        <canvas
          ref={canvasRef}
          className="w-full h-full block touch-none"
        />
      )}

      {/* 2D Interactive Map Fallback */}
      {viewMode === '2d' && (
        <Interactive2DCampusMap
          locations={locations}
          selectedLocation={selectedLocation}
          onSelectLocation={(loc) => {
            setSelectedLocation(loc);
          }}
        />
      )}

      {/* Loading Overlay */}
      {isLoading && viewMode === '3d' && (
        <div className="absolute inset-0 flex flex-col items-center justify-center bg-slate-900/90 backdrop-blur-sm z-30 text-white">
          <div className="w-12 h-12 border-4 border-emerald-500/30 border-t-emerald-500 rounded-full animate-spin mb-4" />
          <p className="font-semibold text-lg tracking-wide">Initializing 3D Virtual Campus...</p>
          <p className="text-xs text-slate-400 mt-1">Rendering architectural geometry & campus terrain</p>
        </div>
      )}

      {/* TOP HUD: Brand Title, View Mode, Controls */}
      <div className="absolute top-4 left-4 right-4 z-20 flex flex-wrap items-center justify-between gap-3 pointer-events-none">
        {/* Left Badge: Prototype Model Notice & Campus Title */}
        <div className="pointer-events-auto flex items-center gap-2 bg-slate-950/80 backdrop-blur-md px-3.5 py-2 rounded-xl border border-white/10 text-white shadow-lg">
          <div className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
          <div className="flex flex-col">
            <span className="text-xs font-bold tracking-tight uppercase flex items-center gap-1.5">
              Federal Polytechnic, Ukana
              <span className="text-[10px] bg-amber-500/20 text-amber-300 px-1.5 py-0.2 rounded font-mono border border-amber-500/30">
                Prototype 3D Campus
              </span>
            </span>
            <span className="text-[11px] text-slate-300">
              Interactive Architectural Visualization & Spatial Navigation
            </span>
          </div>
        </div>

        {/* Right HUD Controls: Lighting, Labels, Mode Toggle, Fullscreen */}
        <div className="pointer-events-auto flex items-center gap-1.5 bg-slate-950/80 backdrop-blur-md p-1.5 rounded-xl border border-white/10 text-white shadow-lg">
          {/* 3D vs 2D Switcher */}
          <div className="flex items-center bg-white/10 rounded-lg p-0.5 mr-1">
            <button
              onClick={() => setViewMode('3d')}
              className={`px-2.5 py-1 text-xs font-semibold rounded-md transition-all ${
                viewMode === '3d' ? 'bg-emerald-600 text-white shadow' : 'text-slate-300 hover:text-white'
              }`}
              title="3D Virtual Campus View"
            >
              3D View
            </button>
            <button
              onClick={() => setViewMode('2d')}
              className={`px-2.5 py-1 text-xs font-semibold rounded-md transition-all ${
                viewMode === '2d' ? 'bg-emerald-600 text-white shadow' : 'text-slate-300 hover:text-white'
              }`}
              title="2D Interactive Campus Map"
            >
              2D Map
            </button>
          </div>

          {viewMode === '3d' && (
            <>
              {/* Lighting Mode Switcher */}
              <button
                onClick={() => setLightingMode('day')}
                className={`p-1.5 rounded-lg transition-colors ${
                  lightingMode === 'day' ? 'bg-white/20 text-amber-300' : 'text-slate-400 hover:text-white'
                }`}
                title="Daylight Mode"
              >
                <Sun className="w-4 h-4" />
              </button>
              <button
                onClick={() => setLightingMode('sunset')}
                className={`p-1.5 rounded-lg transition-colors ${
                  lightingMode === 'sunset' ? 'bg-white/20 text-orange-400' : 'text-slate-400 hover:text-white'
                }`}
                title="Sunset / Golden Hour"
              >
                <Sunset className="w-4 h-4" />
              </button>
              <button
                onClick={() => setLightingMode('night')}
                className={`p-1.5 rounded-lg transition-colors ${
                  lightingMode === 'night' ? 'bg-white/20 text-sky-300' : 'text-slate-400 hover:text-white'
                }`}
                title="Night Illumination"
              >
                <Moon className="w-4 h-4" />
              </button>

              <div className="w-[1px] h-4 bg-white/15 mx-1" />

              {/* Labels Toggle */}
              <button
                onClick={() => setShowLabels(!showLabels)}
                className={`p-1.5 rounded-lg transition-colors ${
                  showLabels ? 'bg-white/20 text-emerald-400' : 'text-slate-400 hover:text-white'
                }`}
                title={showLabels ? 'Hide Building Pins' : 'Show Building Pins'}
              >
                <Layers className="w-4 h-4" />
              </button>

              {/* Reset Camera */}
              <button
                onClick={() => setCameraPreset('overview')}
                className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-white/10 transition-colors"
                title="Reset Camera to Overview"
              >
                <RotateCcw className="w-4 h-4" />
              </button>
            </>
          )}

          {/* Help Instructions */}
          <button
            onClick={() => setShowGuide(!showGuide)}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-white/10 transition-colors"
            title="Navigation Guide"
          >
            <HelpCircle className="w-4 h-4" />
          </button>

          {/* Fullscreen Toggle */}
          <button
            onClick={toggleFullscreen}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-white/10 transition-colors"
            title={isFullscreen ? 'Exit Fullscreen' : 'Fullscreen'}
          >
            {isFullscreen ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
          </button>
        </div>
      </div>

      {/* QUICK PRESET JUMP BUTTONS (BOTTOM LEFT) */}
      {viewMode === '3d' && (
        <div className="absolute bottom-5 left-4 z-20 hidden sm:flex items-center gap-1.5 bg-slate-950/80 backdrop-blur-md px-2.5 py-1.5 rounded-xl border border-white/10 text-white shadow-lg">
          <span className="text-[11px] font-semibold text-slate-400 mr-1 flex items-center gap-1">
            <Compass className="w-3.5 h-3.5 text-emerald-400" />
            Jump To:
          </span>
          <button
            onClick={() => setCameraPreset('overview')}
            className="px-2 py-1 text-xs rounded hover:bg-white/10 text-slate-200 hover:text-white transition-colors"
          >
            Full Campus
          </button>
          <button
            onClick={() => setCameraPreset('gate')}
            className="px-2 py-1 text-xs rounded hover:bg-white/10 text-slate-200 hover:text-white transition-colors"
          >
            Main Gate
          </button>
          <button
            onClick={() => setCameraPreset('admin')}
            className="px-2 py-1 text-xs rounded hover:bg-white/10 text-slate-200 hover:text-white transition-colors"
          >
            Senate / Admin
          </button>
          <button
            onClick={() => setCameraPreset('quad')}
            className="px-2 py-1 text-xs rounded hover:bg-white/10 text-slate-200 hover:text-white transition-colors"
          >
            Lecture Pavilion
          </button>
          <button
            onClick={() => setCameraPreset('hostels')}
            className="px-2 py-1 text-xs rounded hover:bg-white/10 text-slate-200 hover:text-white transition-colors"
          >
            Student Hostels
          </button>
        </div>
      )}

      {/* 3D FLOATING BUILDING LABELS */}
      {viewMode === '3d' &&
        showLabels &&
        locations.map((loc) => {
          const pos = screenPositions[loc.id];
          if (!pos || !pos.visible) return null;
          const isSelected = selectedLocation?.id === loc.id;
          const isHovered = hoveredLocation?.id === loc.id;

          return (
            <div
              key={loc.id}
              onClick={() => {
                setSelectedLocation(loc);
                focusLocation(loc);
              }}
              style={{
                left: `${pos.x}px`,
                top: `${pos.y}px`,
                transform: 'translate(-50%, -100%)',
              }}
              className={`absolute pointer-events-auto cursor-pointer transition-all duration-200 z-10 ${
                isSelected
                  ? 'scale-110 z-20'
                  : isHovered
                  ? 'scale-105 z-15'
                  : 'hover:scale-105'
              }`}
            >
              <div
                className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold shadow-lg backdrop-blur-md border transition-all ${
                  isSelected
                    ? 'bg-emerald-600 text-white border-emerald-300 ring-4 ring-emerald-500/30'
                    : isHovered
                    ? 'bg-slate-900 text-emerald-400 border-emerald-500'
                    : 'bg-slate-900/85 text-slate-100 border-white/20 hover:border-emerald-400'
                }`}
              >
                <div
                  className="w-2 h-2 rounded-full"
                  style={{ backgroundColor: loc.color || '#10b981' }}
                />
                <span className="whitespace-nowrap">{loc.name}</span>
              </div>
              {/* Pointer triangle */}
              <div
                className="w-0 h-0 mx-auto border-x-4 border-x-transparent border-t-6"
                style={{
                  borderTopColor: isSelected
                    ? '#059669'
                    : isHovered
                    ? '#0f172a'
                    : 'rgba(15, 23, 42, 0.85)',
                }}
              />
            </div>
          );
        })}

      {/* SLIDING BUILDING DETAIL DRAWER */}
      {selectedLocation && (
        <BuildingDetailDrawer
          location={selectedLocation}
          programmes={programmes}
          facilities={facilities}
          videos={videos}
          onClose={() => setSelectedLocation(null)}
          onSelectVideo={onSelectVideo}
          onSelectProgramme={onSelectProgramme}
          onSelectFacility={onSelectFacility}
        />
      )}

      {/* NAVIGATION GUIDE MODAL */}
      {showGuide && (
        <div className="absolute inset-0 z-40 bg-slate-950/75 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-700 text-white rounded-2xl max-w-md w-full p-6 shadow-2xl relative">
            <button
              onClick={() => setShowGuide(false)}
              className="absolute top-4 right-4 text-slate-400 hover:text-white"
            >
              <X className="w-5 h-5" />
            </button>
            <h3 className="text-lg font-bold flex items-center gap-2 mb-2">
              <Compass className="w-5 h-5 text-emerald-400" />
              3D Virtual Campus Controls
            </h3>
            <p className="text-xs text-slate-300 mb-4">
              Explore Federal Polytechnic, Ukana's grounds with fluid touch, mouse, and keyboard interaction:
            </p>

            <div className="space-y-3 text-xs text-slate-300">
              <div className="flex items-start gap-3 bg-slate-800/60 p-2.5 rounded-lg border border-slate-700">
                <span className="font-semibold text-emerald-400 whitespace-nowrap">Rotate Orbit:</span>
                <span>Click & drag with left mouse button, or drag with single finger on mobile.</span>
              </div>
              <div className="flex items-start gap-3 bg-slate-800/60 p-2.5 rounded-lg border border-slate-700">
                <span className="font-semibold text-emerald-400 whitespace-nowrap">Pan Camera:</span>
                <span>Right click & drag, or two-finger drag across the screen.</span>
              </div>
              <div className="flex items-start gap-3 bg-slate-800/60 p-2.5 rounded-lg border border-slate-700">
                <span className="font-semibold text-emerald-400 whitespace-nowrap">Zoom In/Out:</span>
                <span>Mouse scroll wheel, or pinch gesture on touchscreen.</span>
              </div>
              <div className="flex items-start gap-3 bg-slate-800/60 p-2.5 rounded-lg border border-slate-700">
                <span className="font-semibold text-emerald-400 whitespace-nowrap">Inspect Building:</span>
                <span>Click on any building pin or 3D structure to view facility description, related academic programmes, and multimedia tour video.</span>
              </div>
            </div>

            <button
              onClick={() => setShowGuide(false)}
              className="w-full mt-5 py-2.5 bg-emerald-600 hover:bg-emerald-500 font-semibold text-xs rounded-xl transition-colors"
            >
              Start Exploring Campus
            </button>
          </div>
        </div>
      )}

      {/* Fallback Notice if WebGL encountered an issue */}
      {webglError && (
        <div className="absolute bottom-4 left-4 right-4 z-20 bg-amber-950/90 border border-amber-600/50 text-amber-200 p-3 rounded-xl text-xs flex items-center justify-between">
          <span>{webglError}</span>
          <button
            onClick={() => setWebglError(null)}
            className="text-amber-400 hover:text-white font-bold ml-2 underline"
          >
            Dismiss
          </button>
        </div>
      )}
    </div>
  );
};

// =========================================================================
// PROCEDURAL ARCHITECTURAL 3D GENERATOR (TAILORED TO FEDPOLY UKANA ASSETS)
// =========================================================================
function createProceduralBuilding(loc: CampusLocation): THREE.Group {
  const group = new THREE.Group();

  const primaryColor = new THREE.Color(loc.color || '#d97706');
  const wallMaterial = new THREE.MeshStandardMaterial({
    color: 0xfef08a, // Nigerian polytechnic warm yellow-ochre facade
    roughness: 0.65,
    metalness: 0.05,
  });

  const columnMaterial = new THREE.MeshStandardMaterial({
    color: 0x78350f, // Dark brown vertical architectural pilasters
    roughness: 0.7,
  });

  const roofMaterial = new THREE.MeshStandardMaterial({
    color: 0x451a03, // Hipped brown corrugated metal roof
    roughness: 0.5,
  });

  const windowMaterial = new THREE.MeshStandardMaterial({
    color: 0x0284c7, // Reflective blue glass casement
    roughness: 0.2,
    metalness: 0.8,
  });

  const concreteMaterial = new THREE.MeshStandardMaterial({
    color: 0xe2e8f0,
    roughness: 0.9,
  });

  if (loc.building_type === 'gate') {
    // -------------------------------------------------------------
    // MONUMENTAL MAIN ENTRANCE GATE (MATCHING UKANA-POLY 4 & 5)
    // -------------------------------------------------------------
    // Red-brick pillared portal with archways and security gatehouse
    const gateRed = new THREE.MeshStandardMaterial({ color: 0x991b1b, roughness: 0.6 }); // Crimson brick
    const whiteBeam = new THREE.MeshStandardMaterial({ color: 0xffffff, roughness: 0.4 });

    // Left and Right main monumental pillars
    const p1 = new THREE.Mesh(new THREE.BoxGeometry(2, 6, 2), gateRed);
    p1.position.set(-6, 3, 0);
    p1.castShadow = true;
    group.add(p1);

    const p2 = new THREE.Mesh(new THREE.BoxGeometry(2, 6, 2), gateRed);
    p2.position.set(6, 3, 0);
    p2.castShadow = true;
    group.add(p2);

    // Center gatehouse
    const centerGate = new THREE.Mesh(new THREE.BoxGeometry(4, 5, 3), gateRed);
    centerGate.position.set(0, 2.5, 0);
    centerGate.castShadow = true;
    group.add(centerGate);

    // Portal arch lintel beams
    const beam1 = new THREE.Mesh(new THREE.BoxGeometry(6, 0.8, 2.4), whiteBeam);
    beam1.position.set(-3, 5.5, 0);
    beam1.castShadow = true;
    group.add(beam1);

    const beam2 = new THREE.Mesh(new THREE.BoxGeometry(6, 0.8, 2.4), whiteBeam);
    beam2.position.set(3, 5.5, 0);
    beam2.castShadow = true;
    group.add(beam2);

    // Institutional crest pediment on center gate
    const pediment = new THREE.Mesh(new THREE.BoxGeometry(3.5, 1.2, 0.6), whiteBeam);
    pediment.position.set(0, 5.6, 0);
    group.add(pediment);

    // Green emblem disc
    const emblem = new THREE.Mesh(
      new THREE.CylinderGeometry(0.8, 0.8, 0.2, 16),
      new THREE.MeshStandardMaterial({ color: 0x0e8a44 })
    );
    emblem.rotation.x = Math.PI / 2;
    emblem.position.set(0, 5.6, 0.4);
    group.add(emblem);

    // Security Gatehouse windows
    const gateWin = new THREE.Mesh(new THREE.BoxGeometry(1.6, 1.2, 3.2), windowMaterial);
    gateWin.position.set(0, 2.8, 0);
    group.add(gateWin);
  } else if (loc.building_type === 'admin') {
    // -------------------------------------------------------------
    // ADMINISTRATIVE RECTORATE COMPLEX (UKANA ARCHITECTURE)
    // -------------------------------------------------------------
    // Two-story rectangular main block with ochre walls, dark brown columns, hipped roof, entrance porch
    const mainBlock = new THREE.Mesh(new THREE.BoxGeometry(16, 5, 8), wallMaterial);
    mainBlock.position.set(0, 2.5, 0);
    mainBlock.castShadow = true;
    mainBlock.receiveShadow = true;
    group.add(mainBlock);

    // Hipped roof
    const roof = new THREE.Mesh(new THREE.ConeGeometry(12, 3.5, 4), roofMaterial);
    roof.position.set(0, 6.7, 0);
    roof.rotation.y = Math.PI / 4;
    roof.scale.set(1.4, 1, 0.9);
    roof.castShadow = true;
    group.add(roof);

    // Front pillared portico
    const portico = new THREE.Mesh(new THREE.BoxGeometry(6, 4.5, 2.5), columnMaterial);
    portico.position.set(0, 2.25, 4.2);
    portico.castShadow = true;
    group.add(portico);

    // Columns along front facade
    for (let x = -7; x <= 7; x += 3.5) {
      const col = new THREE.Mesh(new THREE.BoxGeometry(0.6, 5, 0.8), columnMaterial);
      col.position.set(x, 2.5, 4.05);
      group.add(col);
    }

    // Two rows of windows
    for (let floor = 1.2; floor <= 3.8; floor += 2.2) {
      for (let x = -6.5; x <= 6.5; x += 2.2) {
        if (Math.abs(x) < 2) continue; // skip behind portico
        const win = new THREE.Mesh(new THREE.BoxGeometry(1.2, 1.1, 0.1), windowMaterial);
        win.position.set(x, floor, 4.06);
        group.add(win);
      }
    }
  } else if (loc.building_type === 'lecture_hall') {
    // -------------------------------------------------------------
    // TETFUND LECTURE THEATRE COMPLEX
    // -------------------------------------------------------------
    // Twin tier auditoriums with central linking lobby
    const leftAud = new THREE.Mesh(new THREE.BoxGeometry(10, 5.5, 12), wallMaterial);
    leftAud.position.set(-6, 2.75, 0);
    leftAud.castShadow = true;
    group.add(leftAud);

    const rightAud = new THREE.Mesh(new THREE.BoxGeometry(10, 5.5, 12), wallMaterial);
    rightAud.position.set(6, 2.75, 0);
    rightAud.castShadow = true;
    group.add(rightAud);

    const centerFoyer = new THREE.Mesh(new THREE.BoxGeometry(4, 4, 8), concreteMaterial);
    centerFoyer.position.set(0, 2, 1);
    centerFoyer.castShadow = true;
    group.add(centerFoyer);

    // Sloped hipped roofs
    const r1 = new THREE.Mesh(new THREE.ConeGeometry(8, 2.8, 4), roofMaterial);
    r1.position.set(-6, 6.8, 0);
    r1.rotation.y = Math.PI / 4;
    r1.scale.set(1.2, 1, 1.4);
    group.add(r1);

    const r2 = new THREE.Mesh(new THREE.ConeGeometry(8, 2.8, 4), roofMaterial);
    r2.position.set(6, 6.8, 0);
    r2.rotation.y = Math.PI / 4;
    r2.scale.set(1.2, 1, 1.4);
    group.add(r2);
  } else if (loc.building_type === 'ict') {
    // -------------------------------------------------------------
    // ICT INNOVATION CENTRE (WITH TRANSMISSION MAST ON TOP)
    // -------------------------------------------------------------
    const ictBlock = new THREE.Mesh(new THREE.BoxGeometry(14, 5, 10), concreteMaterial);
    ictBlock.position.set(0, 2.5, 0);
    ictBlock.castShadow = true;
    group.add(ictBlock);

    // Glass curtain facade in blue
    const curtainGlass = new THREE.Mesh(new THREE.BoxGeometry(12, 4, 0.2), windowMaterial);
    curtainGlass.position.set(0, 2.5, 5.05);
    group.add(curtainGlass);

    // Rooftop Antenna / Mast (matching Ukana emblem)
    const mast = new THREE.Mesh(
      new THREE.CylinderGeometry(0.1, 0.2, 7, 8),
      new THREE.MeshStandardMaterial({ color: 0xe65100, metalness: 0.8, roughness: 0.2 })
    );
    mast.position.set(4, 8.5, 2);
    group.add(mast);

    const dish = new THREE.Mesh(
      new THREE.SphereGeometry(0.8, 8, 8, 0, Math.PI),
      new THREE.MeshStandardMaterial({ color: 0xffffff })
    );
    dish.position.set(4, 11, 2);
    dish.rotation.x = Math.PI / 2;
    group.add(dish);
  } else if (loc.building_type === 'sports') {
    // -------------------------------------------------------------
    // SPORTS COMPLEX & PAVILION
    // -------------------------------------------------------------
    // Green pitch
    const pitch = new THREE.Mesh(
      new THREE.PlaneGeometry(20, 14),
      new THREE.MeshStandardMaterial({ color: 0x166534, roughness: 0.9 })
    );
    pitch.rotation.x = -Math.PI / 2;
    pitch.position.set(0, 0.05, 0);
    pitch.receiveShadow = true;
    group.add(pitch);

    // Tartan running track border (rust red)
    const track = new THREE.Mesh(
      new THREE.PlaneGeometry(24, 18),
      new THREE.MeshStandardMaterial({ color: 0xb91c1c, roughness: 0.8 })
    );
    track.rotation.x = -Math.PI / 2;
    track.position.set(0, 0.03, 0);
    group.add(track);

    // Grandstand pavilion
    const grandstand = new THREE.Mesh(new THREE.BoxGeometry(16, 3, 3), concreteMaterial);
    grandstand.position.set(0, 1.5, 9);
    group.add(grandstand);

    const canopy = new THREE.Mesh(new THREE.BoxGeometry(18, 0.3, 4.5), roofMaterial);
    canopy.position.set(0, 3.8, 8.5);
    group.add(canopy);
  } else {
    // -------------------------------------------------------------
    // STANDARD MULTI-TIER ACADEMIC & LABORATORY WORKSHOPS
    // -------------------------------------------------------------
    const body = new THREE.Mesh(new THREE.BoxGeometry(12, 4.8, 8), wallMaterial);
    body.position.set(0, 2.4, 0);
    body.castShadow = true;
    body.receiveShadow = true;
    group.add(body);

    const roof = new THREE.Mesh(new THREE.ConeGeometry(9.5, 2.8, 4), roofMaterial);
    roof.position.set(0, 6.1, 0);
    roof.rotation.y = Math.PI / 4;
    roof.scale.set(1.3, 1, 0.95);
    roof.castShadow = true;
    group.add(roof);

    // Vertical accent stripes
    for (let x = -5; x <= 5; x += 2.5) {
      const col = new THREE.Mesh(new THREE.BoxGeometry(0.5, 4.8, 0.3), columnMaterial);
      col.position.set(x, 2.4, 4.05);
      group.add(col);
    }
  }

  // Base plinth / foundation
  const plinth = new THREE.Mesh(
    new THREE.BoxGeometry(14, 0.3, 10),
    new THREE.MeshStandardMaterial({ color: 0x94a3b8, roughness: 0.9 })
  );
  plinth.position.set(0, 0.15, 0);
  plinth.receiveShadow = true;
  group.add(plinth);

  return group;
}

// =========================================================================
// CAMPUS TERRAIN & ROAD NETWORK CREATOR
// =========================================================================
function createCampusEnvironment(scene: THREE.Scene, nightLights: THREE.Group) {
  // 1. Grass Ground
  const grassMat = new THREE.MeshStandardMaterial({
    color: 0x2e7d32, // Lush green tropical lawn
    roughness: 0.85,
    metalness: 0.05,
  });
  const ground = new THREE.Mesh(new THREE.PlaneGeometry(160, 160), grassMat);
  ground.rotation.x = -Math.PI / 2;
  ground.position.y = 0;
  ground.receiveShadow = true;
  scene.add(ground);

  // 2. Asphalt Road Network
  const asphaltMat = new THREE.MeshStandardMaterial({
    color: 0x334155, // Dark asphalt
    roughness: 0.9,
  });

  // Main Boulevard (North-South, from entrance to academic core)
  const mainRoad = new THREE.Mesh(new THREE.PlaneGeometry(8, 70), asphaltMat);
  mainRoad.rotation.x = -Math.PI / 2;
  mainRoad.position.set(0, 0.02, 10);
  mainRoad.receiveShadow = true;
  scene.add(mainRoad);

  // Cross Road (East-West across academic quadrants)
  const crossRoad = new THREE.Mesh(new THREE.PlaneGeometry(70, 7), asphaltMat);
  crossRoad.rotation.x = -Math.PI / 2;
  crossRoad.position.set(0, 0.02, 0);
  crossRoad.receiveShadow = true;
  scene.add(crossRoad);

  // Secondary Loop to Hostels & Sports
  const hostelRoad = new THREE.Mesh(new THREE.PlaneGeometry(7, 45), asphaltMat);
  hostelRoad.rotation.x = -Math.PI / 2;
  hostelRoad.position.set(16, 0.02, -10);
  hostelRoad.receiveShadow = true;
  scene.add(hostelRoad);

  // 3. Central Roundabout Plaza (matching gate photos in Ukana)
  const roundaboutAsphalt = new THREE.Mesh(
    new THREE.RingGeometry(5.5, 12, 32),
    asphaltMat
  );
  roundaboutAsphalt.rotation.x = -Math.PI / 2;
  roundaboutAsphalt.position.set(0, 0.025, 20);
  roundaboutAsphalt.receiveShadow = true;
  scene.add(roundaboutAsphalt);

  // Green inner roundabout island
  const islandGrass = new THREE.Mesh(
    new THREE.CircleGeometry(5.4, 32),
    grassMat
  );
  islandGrass.rotation.x = -Math.PI / 2;
  islandGrass.position.set(0, 0.03, 20);
  islandGrass.receiveShadow = true;
  scene.add(islandGrass);

  // Central Obelisk / Flagpole on roundabout
  const flagpole = new THREE.Mesh(
    new THREE.CylinderGeometry(0.1, 0.15, 9, 12),
    new THREE.MeshStandardMaterial({ color: 0xffffff, metalness: 0.8 })
  );
  flagpole.position.set(0, 4.5, 20);
  scene.add(flagpole);

  // Nigerian Green-White-Green Flag
  const flag = new THREE.Mesh(
    new THREE.BoxGeometry(2.4, 1.4, 0.05),
    new THREE.MeshStandardMaterial({ color: 0x059669 })
  );
  flag.position.set(1.2, 8.2, 20);
  scene.add(flag);

  // 4. Curbs (Striped black and white as seen in Nigerian institutional campuses)
  const curbMat = new THREE.MeshStandardMaterial({ color: 0xf1f5f9, roughness: 0.7 });
  for (let z = -20; z <= 35; z += 5) {
    const leftCurb = new THREE.Mesh(new THREE.BoxGeometry(0.4, 0.25, 4.2), curbMat);
    leftCurb.position.set(-4.2, 0.12, z);
    scene.add(leftCurb);

    const rightCurb = new THREE.Mesh(new THREE.BoxGeometry(0.4, 0.25, 4.2), curbMat);
    rightCurb.position.set(4.2, 0.12, z);
    scene.add(rightCurb);
  }

  // 5. Trees along Boulevards & Quad (Palm trees & shade trees)
  const treePositions = [
    [-6, 12], [6, 12], [-6, 6], [6, 6], [-6, -10], [6, -10],
    [-20, 18], [-22, 0], [20, 2], [22, -18], [-12, -15], [10, -22],
    [-7, 24], [7, 24], [-18, 25], [18, 25]
  ];

  const trunkMat = new THREE.MeshStandardMaterial({ color: 0x78350f, roughness: 0.9 });
  const foliageMat1 = new THREE.MeshStandardMaterial({ color: 0x15803d, roughness: 0.8 });
  const foliageMat2 = new THREE.MeshStandardMaterial({ color: 0x166534, roughness: 0.8 });

  treePositions.forEach(([x, z], i) => {
    const tree = new THREE.Group();
    const trunk = new THREE.Mesh(new THREE.CylinderGeometry(0.2, 0.35, 2.5, 6), trunkMat);
    trunk.position.y = 1.25;
    trunk.castShadow = true;
    tree.add(trunk);

    const foliage = new THREE.Mesh(
      new THREE.SphereGeometry(1.6, 7, 7),
      i % 2 === 0 ? foliageMat1 : foliageMat2
    );
    foliage.position.y = 3.2;
    foliage.scale.set(1, 1.3, 1);
    foliage.castShadow = true;
    tree.add(foliage);

    tree.position.set(x, 0, z);
    scene.add(tree);
  });

  // 6. Streetlamps with point lights for night mode
  const lampPositions = [
    [-4.6, 26], [4.6, 26],
    [-4.6, 14], [4.6, 14],
    [-4.6, 0], [4.6, 0],
    [-4.6, -12], [4.6, -12],
    [14, 0], [28, 0],
    [-18, 0], [-30, 0]
  ];

  const lampPoleMat = new THREE.MeshStandardMaterial({ color: 0x334155, metalness: 0.8 });
  const lampGlowMat = new THREE.MeshBasicMaterial({ color: 0xfef08a });

  lampPositions.forEach(([lx, lz]) => {
    const post = new THREE.Mesh(new THREE.CylinderGeometry(0.08, 0.1, 4, 8), lampPoleMat);
    post.position.set(lx, 2, lz);
    scene.add(post);

    const bulb = new THREE.Mesh(new THREE.SphereGeometry(0.2, 8, 8), lampGlowMat);
    bulb.position.set(lx, 4.1, lz);
    scene.add(bulb);

    const pointLight = new THREE.PointLight(0xfef08a, 0.9, 14);
    pointLight.position.set(lx, 4.2, lz);
    nightLights.add(pointLight);
  });
}

// =========================================================================
// SLIDING BUILDING DETAIL DRAWER COMPONENT
// =========================================================================
interface BuildingDetailDrawerProps {
  location: CampusLocation;
  programmes: Programme[];
  facilities: Facility[];
  videos: VideoItem[];
  onClose: () => void;
  onSelectVideo?: (videoId: string) => void;
  onSelectProgramme?: (programmeId: string) => void;
  onSelectFacility?: (facilityId: string) => void;
}

const BuildingDetailDrawer: React.FC<BuildingDetailDrawerProps> = ({
  location,
  programmes,
  facilities,
  videos,
  onClose,
  onSelectVideo,
  onSelectProgramme,
  onSelectFacility,
}) => {
  // Find related records
  const facility = facilities.find((f) => f.id === location.related_facility_id);
  const programme = programmes.find((p) => p.id === location.related_programme_id);
  const video = videos.find((v) => v.id === location.related_video_id);

  return (
    <div className="absolute top-0 right-0 bottom-0 w-full sm:w-96 z-30 bg-slate-900/95 backdrop-blur-xl border-l border-slate-700/80 text-white shadow-2xl flex flex-col transition-all duration-300">
      {/* Header */}
      <div className="p-5 border-b border-slate-800 flex items-start justify-between">
        <div>
          <div className="flex items-center gap-2 mb-1.5">
            <span
              className="w-3 h-3 rounded-full"
              style={{ backgroundColor: location.color || '#10b981' }}
            />
            <span className="text-xs uppercase font-bold tracking-wider text-emerald-400">
              {location.category}
            </span>
          </div>
          <h3 className="text-lg font-bold leading-snug">{location.name}</h3>
        </div>
        <button
          onClick={onClose}
          className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      {/* Body Content */}
      <div className="p-5 flex-1 overflow-y-auto space-y-5 text-sm">
        {/* Prototype Disclaimer Badge */}
        <div className="bg-amber-950/40 border border-amber-500/30 rounded-xl p-3 text-amber-300 text-xs flex items-start gap-2.5">
          <Info className="w-4 h-4 shrink-0 text-amber-400 mt-0.5" />
          <p>
            <span className="font-semibold">Prototype Campus Model:</span> Representing the physical infrastructure of Federal Polytechnic, Ukana. Official architectural CAD models can be uploaded via the Admin Portal.
          </p>
        </div>

        {/* Location Description */}
        <div>
          <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1.5">
            About This Location
          </h4>
          <p className="text-slate-300 leading-relaxed text-xs">
            {location.description}
          </p>
        </div>

        {/* Associated Facility Info */}
        {facility && (
          <div className="bg-slate-800/60 border border-slate-700/60 rounded-xl p-3.5 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-slate-300 flex items-center gap-1.5">
                <Building2 className="w-4 h-4 text-emerald-400" />
                Facility Profile
              </span>
              <span className="text-[11px] text-emerald-400 font-mono">
                {facility.status}
              </span>
            </div>
            <p className="text-xs text-white font-medium">{facility.name}</p>
            <p className="text-[11px] text-slate-400 flex items-center gap-1">
              <MapPin className="w-3 h-3 text-slate-500" />
              {facility.location}
            </p>
            {onSelectFacility && (
              <button
                onClick={() => onSelectFacility(facility.id)}
                className="w-full mt-2 py-1.5 text-xs font-medium text-emerald-300 bg-emerald-950/50 hover:bg-emerald-900/50 border border-emerald-800/60 rounded-lg flex items-center justify-center gap-1 transition-colors"
              >
                View Facility Directory
                <ExternalLink className="w-3 h-3" />
              </button>
            )}
          </div>
        )}

        {/* Associated Academic Programme */}
        {programme && (
          <div className="bg-slate-800/60 border border-slate-700/60 rounded-xl p-3.5 space-y-2">
            <span className="text-xs font-semibold text-slate-300 flex items-center gap-1.5">
              <GraduationCap className="w-4 h-4 text-emerald-400" />
              Hosted Academic Programme
            </span>
            <p className="text-xs text-white font-medium">{programme.name}</p>
            <p className="text-[11px] text-slate-400">{programme.department}</p>
            <div className="flex items-center gap-2 text-[11px] text-slate-300 pt-1">
              <span className="bg-slate-700 px-2 py-0.5 rounded">Duration: {programme.duration}</span>
            </div>
            {onSelectProgramme && (
              <button
                onClick={() => onSelectProgramme(programme.id)}
                className="w-full mt-2 py-1.5 text-xs font-medium text-white bg-emerald-600 hover:bg-emerald-500 rounded-lg flex items-center justify-center gap-1 transition-colors"
              >
                Explore Programme & Requirements
                <ExternalLink className="w-3 h-3" />
              </button>
            )}
          </div>
        )}

        {/* Associated Promotional Video */}
        {video && (
          <div className="bg-slate-800/60 border border-slate-700/60 rounded-xl p-3.5 space-y-2">
            <span className="text-xs font-semibold text-slate-300 flex items-center gap-1.5">
              <Play className="w-4 h-4 text-emerald-400" />
              Video Tour & Advertisement
            </span>
            <div className="relative rounded-lg overflow-hidden group">
              <img
                src={video.thumbnail_url}
                alt={video.title}
                className="w-full h-28 object-cover group-hover:scale-105 transition-transform duration-300"
              />
              <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                <div className="w-10 h-10 rounded-full bg-emerald-600/90 text-white flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
                  <Play className="w-5 h-5 fill-white ml-0.5" />
                </div>
              </div>
              <span className="absolute bottom-1.5 right-1.5 bg-black/70 text-white text-[10px] px-1.5 py-0.5 rounded font-mono">
                {video.duration}
              </span>
            </div>
            <p className="text-xs text-white font-medium line-clamp-1">{video.title}</p>
            {onSelectVideo && (
              <button
                onClick={() => onSelectVideo(video.id)}
                className="w-full mt-1 py-1.5 text-xs font-medium text-white bg-emerald-600 hover:bg-emerald-500 rounded-lg flex items-center justify-center gap-1 transition-colors"
              >
                Watch Video Advertisement
              </button>
            )}
          </div>
        )}
      </div>

      {/* Footer Spatial Coordinates */}
      <div className="p-3 bg-slate-950/60 border-t border-slate-800 text-[11px] text-slate-400 flex items-center justify-between font-mono">
        <span>X: {location.position_x}m | Z: {location.position_z}m</span>
        <span>Scale: {location.scale}x</span>
      </div>
    </div>
  );
};

// =========================================================================
// 2D INTERACTIVE CAMPUS MAP (ACCESSIBILITY & MOBILE FALLBACK)
// =========================================================================
interface Interactive2DCampusMapProps {
  locations: CampusLocation[];
  selectedLocation: CampusLocation | null;
  onSelectLocation: (loc: CampusLocation) => void;
}

const Interactive2DCampusMap: React.FC<Interactive2DCampusMapProps> = ({
  locations,
  selectedLocation,
  onSelectLocation,
}) => {
  return (
    <div className="w-full h-full bg-emerald-950/30 flex flex-col p-6 overflow-y-auto">
      <div className="max-w-4xl mx-auto w-full">
        <div className="mb-6 flex flex-col md:flex-row md:items-center justify-between gap-2 border-b border-white/10 pb-4">
          <div>
            <h3 className="text-lg font-bold text-white flex items-center gap-2">
              <MapIcon className="w-5 h-5 text-emerald-400" />
              Interactive Campus Spatial Map (2D Vector Plan)
            </h3>
            <p className="text-xs text-slate-400">
              Click any quadrant or facility card to inspect location details, academic faculties, and multimedia links.
            </p>
          </div>
          <span className="text-xs font-mono text-emerald-400 bg-emerald-950/80 px-2.5 py-1 rounded border border-emerald-800/80 self-start">
            {locations.length} Mapped Locations
          </span>
        </div>

        {/* Schematic Grid of Locations */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5">
          {locations.map((loc) => {
            const isSelected = selectedLocation?.id === loc.id;
            return (
              <div
                key={loc.id}
                onClick={() => onSelectLocation(loc)}
                className={`cursor-pointer p-4 rounded-xl border transition-all text-left ${
                  isSelected
                    ? 'bg-emerald-900/60 border-emerald-400 ring-2 ring-emerald-500/40 text-white shadow-xl'
                    : 'bg-slate-900/70 border-slate-800 text-slate-200 hover:border-emerald-500/60 hover:bg-slate-800/80'
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <span
                    className="w-3 h-3 rounded-full"
                    style={{ backgroundColor: loc.color || '#10b981' }}
                  />
                  <span className="text-[10px] font-mono uppercase text-slate-400 bg-black/40 px-2 py-0.5 rounded">
                    {loc.category}
                  </span>
                </div>
                <h4 className="font-bold text-sm text-white mb-1.5">{loc.name}</h4>
                <p className="text-xs text-slate-300 line-clamp-2 leading-relaxed mb-3">
                  {loc.description}
                </p>
                <div className="flex items-center justify-between text-[11px] text-slate-400 border-t border-white/5 pt-2 font-mono">
                  <span>Pos ({loc.position_x}, {loc.position_z})</span>
                  <span className="text-emerald-400 font-sans font-semibold">Inspect &rarr;</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default VirtualCampus;
