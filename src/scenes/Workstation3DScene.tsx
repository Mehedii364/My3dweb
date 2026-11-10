/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useEffect, useRef, useState, useCallback } from 'react';
import * as THREE from 'three';
import { CameraPreset, SceneQuality } from '../types/portfolio';

interface Workstation3DProps {
  quality: SceneQuality;
  cameraPreset: CameraPreset;
  heroImageUrl: string;
  onObjectClick?: (objectId: string) => void;
  onPresetChange?: (preset: CameraPreset) => void;
}

export const Workstation3DScene: React.FC<Workstation3DProps> = ({
  quality,
  cameraPreset,
  heroImageUrl,
  onObjectClick,
  onPresetChange,
}) => {
  const mountRef = useRef<HTMLDivElement>(null);
  const [hoveredObject, setHoveredObject] = useState<string | null>(null);
  const [isReady, setIsReady] = useState(false);

  // References for animation loop & interactions
  const sceneRef = useRef<THREE.Scene | null>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const frameIdRef = useRef<number>(0);

  // Dynamic targets for camera damping
  const targetCamPosRef = useRef<THREE.Vector3>(new THREE.Vector3(0, 3.2, 6.2));
  const targetLookAtRef = useRef<THREE.Vector3>(new THREE.Vector3(0, 1.4, 0));
  const currentLookAtRef = useRef<THREE.Vector3>(new THREE.Vector3(0, 1.4, 0));

  // Mouse cursor vector for interactive particle flow and subtle camera parallax
  const mouseNormRef = useRef<{ x: number; y: number; targetX: number; targetY: number }>({
    x: 0,
    y: 0,
    targetX: 0,
    targetY: 0,
  });

  // Interactive raycasting objects collection
  const interactiveObjectsRef = useRef<{ id: string; mesh: THREE.Object3D; title: string }[]>([]);

  // Update camera target position based on preset
  useEffect(() => {
    switch (cameraPreset) {
      case 'code':
        targetCamPosRef.current.set(0.1, 1.9, 1.6);
        targetLookAtRef.current.set(0, 1.7, 0.4);
        break;
      case 'globe':
        targetCamPosRef.current.set(2.2, 2.2, 2.4);
        targetLookAtRef.current.set(1.4, 1.7, 0.2);
        break;
      case 'portrait':
        targetCamPosRef.current.set(-1.1, 1.75, 1.7);
        targetLookAtRef.current.set(-1.0, 1.65, 0.5);
        break;
      case 'overview':
        targetCamPosRef.current.set(0, 4.8, 8.5);
        targetLookAtRef.current.set(0, 1.2, 0);
        break;
      case 'workstation':
      default:
        targetCamPosRef.current.set(0, 3.2, 5.8);
        targetLookAtRef.current.set(0, 1.4, 0);
        break;
    }
  }, [cameraPreset]);

  // Handle pointer movement for cursor-reactive particle system
  const handlePointerMove = useCallback((e: React.PointerEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
    const y = -(((e.clientY - rect.top) / rect.height) * 2 - 1);
    mouseNormRef.current.targetX = x;
    mouseNormRef.current.targetY = y;

    // Raycast on pointer move
    if (!cameraRef.current || !sceneRef.current) return;
    const raycaster = new THREE.Raycaster();
    raycaster.setFromCamera(new THREE.Vector2(x, y), cameraRef.current);

    const testMeshes = interactiveObjectsRef.current.map((item) => item.mesh);
    const intersects = raycaster.intersectObjects(testMeshes, true);

    if (intersects.length > 0) {
      // Find parent interactive item
      let currentObj: THREE.Object3D | null = intersects[0].object;
      let matchedId: string | null = null;
      while (currentObj && !matchedId) {
        const found = interactiveObjectsRef.current.find((item) => item.mesh === currentObj);
        if (found) {
          matchedId = found.title;
          break;
        }
        currentObj = currentObj.parent;
      }
      setHoveredObject(matchedId);
    } else {
      setHoveredObject(null);
    }
  }, []);

  // Handle click on 3D elements
  const handleClick = useCallback(
    (e: React.MouseEvent<HTMLDivElement>) => {
      if (!cameraRef.current) return;
      const rect = e.currentTarget.getBoundingClientRect();
      const x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
      const y = -(((e.clientY - rect.top) / rect.height) * 2 - 1);

      const raycaster = new THREE.Raycaster();
      raycaster.setFromCamera(new THREE.Vector2(x, y), cameraRef.current);
      const testMeshes = interactiveObjectsRef.current.map((item) => item.mesh);
      const intersects = raycaster.intersectObjects(testMeshes, true);

      if (intersects.length > 0) {
        let currentObj: THREE.Object3D | null = intersects[0].object;
        while (currentObj) {
          const found = interactiveObjectsRef.current.find((item) => item.mesh === currentObj);
          if (found) {
            if (onObjectClick) onObjectClick(found.id);
            if (found.id === 'monitor' && onPresetChange) onPresetChange('code');
            if (found.id === 'globe' && onPresetChange) onPresetChange('globe');
            if (found.id === 'portrait' && onPresetChange) onPresetChange('portrait');
            return;
          }
          currentObj = currentObj.parent;
        }
      }
    },
    [onObjectClick, onPresetChange]
  );

  useEffect(() => {
    const container = mountRef.current;
    if (!container || quality === '2d') return;

    // Detect software WebGL as per skill requirements
    const isSoftwareGl = (() => {
      const gl = document.createElement('canvas').getContext('webgl2');
      if (!gl) return true;
      const ext = gl.getExtension('WEBGL_debug_renderer_info');
      const param = ext ? ext.UNMASKED_RENDERER_WEBGL : gl.RENDERER;
      const gpu = String(gl.getParameter(param));
      gl.getExtension('WEBGL_lose_context')?.loseContext();
      return /SwiftShader|llvmpipe|softpipe|Software|Basic Render/i.test(gpu);
    })();

    // Initialize Scene
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x070b18);
    scene.fog = new THREE.FogExp2(0x070b18, 0.08);
    sceneRef.current = scene;

    // Camera
    const camera = new THREE.PerspectiveCamera(
      45,
      container.clientWidth / container.clientHeight,
      0.1,
      100
    );
    camera.position.set(0, 3.2, 5.8);
    camera.lookAt(0, 1.4, 0);
    cameraRef.current = camera;

    // Renderer
    const renderer = new THREE.WebGLRenderer({
      antialias: !isSoftwareGl && quality === 'high',
      powerPreference: 'high-performance',
      alpha: false,
    });
    renderer.setSize(container.clientWidth, container.clientHeight);
    renderer.setPixelRatio(isSoftwareGl ? 1 : Math.min(window.devicePixelRatio, 2));
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.15;
    renderer.shadowMap.enabled = !isSoftwareGl && quality !== 'low';
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;

    container.appendChild(renderer.domElement);
    rendererRef.current = renderer;

    // Setup Lighting Rig
    // 1. Cool Hemisphere Fill
    const hemiLight = new THREE.HemisphereLight(0x16bfff, 0x070b18, 0.7);
    scene.add(hemiLight);

    // 2. Warm Key Light with soft shadows
    const keyLight = new THREE.DirectionalLight(0xf4f7ff, 1.8);
    keyLight.position.set(4, 7, 5);
    keyLight.castShadow = !isSoftwareGl && quality !== 'low';
    keyLight.shadow.mapSize.width = 1024;
    keyLight.shadow.mapSize.height = 1024;
    keyLight.shadow.bias = -0.0005;
    keyLight.shadow.normalBias = 0.02;
    scene.add(keyLight);

    // 3. Neon Purple Rim / Accent Light
    const purpleRim = new THREE.PointLight(0x8b45ff, 2.5, 10);
    purpleRim.position.set(-3.5, 2.5, -2);
    scene.add(purpleRim);

    // 4. Electric Blue Desk Spot
    const deskGlow = new THREE.PointLight(0x00e5ff, 2.0, 6);
    deskGlow.position.set(0, 2.2, 0.4);
    scene.add(deskGlow);

    // ==========================================
    // PROCEDURAL 3D MODELS (Three.js Skill Multi-Part Groups)
    // ==========================================

    interactiveObjectsRef.current = [];

    // --- 1. Floor Reflection Grid & Soft Contact Shadows ---
    const floorGeo = new THREE.PlaneGeometry(30, 30);
    const floorMat = new THREE.MeshStandardMaterial({
      color: 0x090e20,
      roughness: 0.25,
      metalness: 0.85,
    });
    const floor = new THREE.Mesh(floorGeo, floorMat);
    floor.rotation.x = -Math.PI / 2;
    floor.position.y = 0;
    floor.receiveShadow = !isSoftwareGl;
    scene.add(floor);

    // Grid lines on floor
    const gridHelper = new THREE.GridHelper(30, 60, 0x16bfff, 0x101b3d);
    gridHelper.position.y = 0.005;
    scene.add(gridHelper);

    // Contact shadow beneath workstation
    const contactCanvas = document.createElement('canvas');
    contactCanvas.width = 256;
    contactCanvas.height = 256;
    const ctx = contactCanvas.getContext('2d');
    if (ctx) {
      const grad = ctx.createRadialGradient(128, 128, 20, 128, 128, 120);
      grad.addColorStop(0, 'rgba(0, 0, 0, 0.7)');
      grad.addColorStop(0.5, 'rgba(0, 0, 0, 0.3)');
      grad.addColorStop(1, 'rgba(0, 0, 0, 0)');
      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, 256, 256);
    }
    const contactTex = new THREE.CanvasTexture(contactCanvas);
    const contactShadow = new THREE.Mesh(
      new THREE.PlaneGeometry(4.5, 3.2),
      new THREE.MeshBasicMaterial({
        map: contactTex,
        transparent: true,
        depthWrite: false,
        opacity: 0.6,
      })
    );
    contactShadow.rotation.x = -Math.PI / 2;
    contactShadow.position.set(0, 0.01, 0.3);
    scene.add(contactShadow);

    // --- 2. Developer Desk (Composite Multi-Part Group) ---
    const deskGroup = new THREE.Group();
    const deskTopMat = new THREE.MeshStandardMaterial({
      color: 0x11192e,
      roughness: 0.3,
      metalness: 0.4,
    });
    const deskLegMat = new THREE.MeshStandardMaterial({
      color: 0x0a101f,
      roughness: 0.2,
      metalness: 0.9,
    });

    // Desktop Slab (2.4m x 1.0m x 0.06m)
    const deskTop = new THREE.Mesh(new THREE.BoxGeometry(2.6, 0.06, 1.1), deskTopMat);
    deskTop.position.set(0, 1.2, 0.3);
    deskTop.castShadow = true;
    deskTop.receiveShadow = true;
    deskGroup.add(deskTop);

    // Desk Legs (4 sturdy pillars)
    const legGeo = new THREE.CylinderGeometry(0.04, 0.04, 1.2, 16);
    const legPositions = [
      [-1.2, 0.6, -0.15],
      [1.2, 0.6, -0.15],
      [-1.2, 0.6, 0.75],
      [1.2, 0.6, 0.75],
    ];
    legPositions.forEach(([x, y, z]) => {
      const leg = new THREE.Mesh(legGeo, deskLegMat);
      leg.position.set(x, y, z);
      leg.castShadow = true;
      deskGroup.add(leg);
    });

    // Cross-brace support bar
    const brace = new THREE.Mesh(new THREE.BoxGeometry(2.36, 0.04, 0.04), deskLegMat);
    brace.position.set(0, 0.5, -0.15);
    deskGroup.add(brace);

    // LED Neon light strip under desk rim
    const underGlowGeo = new THREE.BoxGeometry(2.5, 0.015, 0.015);
    const underGlowMat = new THREE.MeshBasicMaterial({ color: 0x16bfff });
    const underGlow = new THREE.Mesh(underGlowGeo, underGlowMat);
    underGlow.position.set(0, 1.16, 0.84);
    deskGroup.add(underGlow);

    scene.add(deskGroup);

    // --- 3. Ultra-wide Developer Monitor with Live Code Screen ---
    const monitorGroup = new THREE.Group();
    monitorGroup.position.set(0, 1.23, 0.05);

    // Stand & Mount
    const standBase = new THREE.Mesh(new THREE.BoxGeometry(0.5, 0.02, 0.25), deskLegMat);
    standBase.position.set(0, 0.01, 0);
    monitorGroup.add(standBase);

    const standStem = new THREE.Mesh(new THREE.CylinderGeometry(0.03, 0.03, 0.5, 16), deskLegMat);
    standStem.position.set(0, 0.25, -0.05);
    monitorGroup.add(standStem);

    // Bezel
    const bezel = new THREE.Mesh(
      new THREE.BoxGeometry(1.5, 0.65, 0.04),
      new THREE.MeshStandardMaterial({ color: 0x05070e, roughness: 0.2, metalness: 0.8 })
    );
    bezel.position.set(0, 0.55, 0);
    bezel.castShadow = true;
    monitorGroup.add(bezel);

    // Code Screen Canvas Texture
    const codeCanvas = document.createElement('canvas');
    codeCanvas.width = 1024;
    codeCanvas.height = 512;
    const cCtx = codeCanvas.getContext('2d');
    if (cCtx) {
      cCtx.fillStyle = '#0a0f24';
      cCtx.fillRect(0, 0, 1024, 512);

      // Terminal top bar
      cCtx.fillStyle = '#0f1738';
      cCtx.fillRect(0, 0, 1024, 48);
      cCtx.fillStyle = '#ff5f56';
      cCtx.beginPath();
      cCtx.arc(30, 24, 8, 0, Math.PI * 2);
      cCtx.fill();
      cCtx.fillStyle = '#ffbd2e';
      cCtx.beginPath();
      cCtx.arc(55, 24, 8, 0, Math.PI * 2);
      cCtx.fill();
      cCtx.fillStyle = '#27c93f';
      cCtx.beginPath();
      cCtx.arc(80, 24, 8, 0, Math.PI * 2);
      cCtx.fill();

      cCtx.fillStyle = '#8b45ff';
      cCtx.font = 'bold 20px "JetBrains Mono", monospace';
      cCtx.fillText('mehedi@wafa-zone: ~/mehedi-3d-ecosystem', 120, 32);

      // Code lines
      cCtx.font = '19px "JetBrains Mono", monospace';
      const lines = [
        { text: 'import { WafaZone, Mehedi364 } from "@mehedi/core";', color: '#16bfff' },
        { text: '', color: '#fff' },
        { text: '// Developer Identity & Core Loop', color: '#687799' },
        { text: 'const architect = new Developer({', color: '#f4f7ff' },
        { text: '  name: "Md. Mehedi Hasan",', color: '#00e5ff' },
        { text: '  handle: "Mehedii364",', color: '#00e5ff' },
        { text: '  ecosystem: "Wafa Zone", // DREAM • DEVELOP • DELIVER', color: '#8b45ff' },
        { text: '  philosophy: "THINK → LEARN → DESIGN → BUILD → TEST → IMPROVE → TRANSFORM",', color: '#27c93f' },
        { text: '  stack: ["React", "TypeScript", "Three.js", "PHP 8.2", "MySQL 5.7"],', color: '#ffbd2e' },
        { text: '  status: "ONLINE & DEPLOYED TO PROFREEHOST"', color: '#16bfff' },
        { text: '});', color: '#f4f7ff' },
        { text: '', color: '#fff' },
        { text: 'await architect.deployEcosystem(["Wafa-Deen", "Wafa-Camera-Pro", "Wafa-AI"]);', color: '#00e5ff' },
        { text: 'console.log("Ready. Enter My Digital World.");', color: '#27c93f' },
      ];

      lines.forEach((l, i) => {
        cCtx.fillStyle = l.color;
        cCtx.fillText(l.text, 36, 90 + i * 28);
      });
    }

    const screenTexture = new THREE.CanvasTexture(codeCanvas);
    screenTexture.colorSpace = THREE.SRGBColorSpace;
    const screenMat = new THREE.MeshBasicMaterial({ map: screenTexture });
    const screenMesh = new THREE.Mesh(new THREE.PlaneGeometry(1.44, 0.6), screenMat);
    screenMesh.position.set(0, 0.55, 0.022);
    monitorGroup.add(screenMesh);

    scene.add(monitorGroup);
    interactiveObjectsRef.current.push({
      id: 'monitor',
      mesh: monitorGroup,
      title: 'Ultra-wide Developer Terminal',
    });

    // --- 4. Modern Open Developer Laptop ---
    const laptopGroup = new THREE.Group();
    laptopGroup.position.set(-0.65, 1.23, 0.45);
    laptopGroup.rotation.y = 0.28;

    // Laptop base
    const laptopBase = new THREE.Mesh(
      new THREE.BoxGeometry(0.42, 0.015, 0.3),
      new THREE.MeshStandardMaterial({ color: 0x1e2738, metalness: 0.8, roughness: 0.2 })
    );
    laptopGroup.add(laptopBase);

    // Keyboard glow
    const kbMesh = new THREE.Mesh(
      new THREE.PlaneGeometry(0.36, 0.16),
      new THREE.MeshBasicMaterial({ color: 0x16bfff })
    );
    kbMesh.rotation.x = -Math.PI / 2;
    kbMesh.position.set(0, 0.009, 0.03);
    laptopGroup.add(kbMesh);

    // Trackpad
    const trackpad = new THREE.Mesh(
      new THREE.PlaneGeometry(0.12, 0.08),
      new THREE.MeshBasicMaterial({ color: 0x090f20 })
    );
    trackpad.rotation.x = -Math.PI / 2;
    trackpad.position.set(0, 0.009, 0.11);
    laptopGroup.add(trackpad);

    // Laptop Screen Lid (angled 115 deg)
    const laptopScreenGroup = new THREE.Group();
    laptopScreenGroup.position.set(0, 0.008, -0.14);
    laptopScreenGroup.rotation.x = -0.38;

    const lid = new THREE.Mesh(
      new THREE.BoxGeometry(0.42, 0.28, 0.01),
      new THREE.MeshStandardMaterial({ color: 0x161e2e, metalness: 0.9, roughness: 0.2 })
    );
    lid.position.set(0, 0.14, 0);
    laptopScreenGroup.add(lid);

    const laptopDisplay = new THREE.Mesh(
      new THREE.PlaneGeometry(0.4, 0.26),
      new THREE.MeshBasicMaterial({ color: 0x0d1633 })
    );
    laptopDisplay.position.set(0, 0.14, 0.006);
    laptopScreenGroup.add(laptopDisplay);

    laptopGroup.add(laptopScreenGroup);
    scene.add(laptopGroup);

    // --- 5. Ergonomic Keyboard & Mouse on Desk ---
    const keyboard = new THREE.Mesh(
      new THREE.BoxGeometry(0.55, 0.018, 0.18),
      new THREE.MeshStandardMaterial({ color: 0x0c1224, roughness: 0.4 })
    );
    keyboard.position.set(0, 1.24, 0.52);
    scene.add(keyboard);

    const mouse = new THREE.Mesh(
      new THREE.BoxGeometry(0.08, 0.024, 0.12),
      new THREE.MeshStandardMaterial({ color: 0x16bfff, roughness: 0.3 })
    );
    mouse.position.set(0.45, 1.242, 0.52);
    scene.add(mouse);

    // --- 6. 3D Digital Rotating Globe (Interactive: links to GitHub Command Center) ---
    const globeGroup = new THREE.Group();
    globeGroup.position.set(1.4, 1.85, 0.25);

    // Stand base
    const globeStand = new THREE.Mesh(
      new THREE.CylinderGeometry(0.12, 0.14, 0.04, 24),
      deskLegMat
    );
    globeStand.position.set(0, -0.58, 0);
    globeGroup.add(globeStand);

    const globeAxis = new THREE.Mesh(
      new THREE.TorusGeometry(0.38, 0.015, 12, 48, Math.PI),
      new THREE.MeshStandardMaterial({ color: 0x16bfff, metalness: 0.9, roughness: 0.2 })
    );
    globeAxis.rotation.z = Math.PI / 6;
    globeGroup.add(globeAxis);

    // Globe Sphere Wireframe & Points
    const sphereGeo = new THREE.SphereGeometry(0.32, 24, 24);
    const globeWireMat = new THREE.MeshBasicMaterial({
      color: 0x16bfff,
      wireframe: true,
      transparent: true,
      opacity: 0.35,
    });
    const globeMesh = new THREE.Mesh(sphereGeo, globeWireMat);
    globeGroup.add(globeMesh);

    // Glowing Core
    const globeCore = new THREE.Mesh(
      new THREE.SphereGeometry(0.25, 16, 16),
      new THREE.MeshBasicMaterial({
        color: 0x00e5ff,
        transparent: true,
        opacity: 0.2,
      })
    );
    globeGroup.add(globeCore);

    // Floating orbital rings
    const ring1 = new THREE.Mesh(
      new THREE.RingGeometry(0.42, 0.43, 32),
      new THREE.MeshBasicMaterial({ color: 0x8b45ff, side: THREE.DoubleSide })
    );
    ring1.rotation.x = Math.PI / 3;
    globeGroup.add(ring1);

    scene.add(globeGroup);
    interactiveObjectsRef.current.push({
      id: 'globe',
      mesh: globeGroup,
      title: 'Digital Globe (GitHub Network)',
    });

    // --- 7. Official Personal Portrait Frame on Desk ---
    const portraitGroup = new THREE.Group();
    portraitGroup.position.set(-1.05, 1.45, 0.35);
    portraitGroup.rotation.y = 0.35;

    // Outer Frame (Sleek brushed obsidian with neon edge)
    const frameMesh = new THREE.Mesh(
      new THREE.BoxGeometry(0.38, 0.48, 0.03),
      new THREE.MeshStandardMaterial({ color: 0x070b18, metalness: 0.85, roughness: 0.2 })
    );
    portraitGroup.add(frameMesh);

    // Frame stand back leg
    const frameStand = new THREE.Mesh(
      new THREE.BoxGeometry(0.04, 0.3, 0.02),
      deskLegMat
    );
    frameStand.position.set(0, -0.06, -0.1);
    frameStand.rotation.x = -0.3;
    portraitGroup.add(frameStand);

    // Photo Canvas inside frame
    const texLoader = new THREE.TextureLoader();
    texLoader.load(
      heroImageUrl,
      (tex) => {
        tex.colorSpace = THREE.SRGBColorSpace;
        const photoMat = new THREE.MeshBasicMaterial({ map: tex });
        const photoMesh = new THREE.Mesh(new THREE.PlaneGeometry(0.33, 0.43), photoMat);
        photoMesh.position.set(0, 0, 0.016);
        portraitGroup.add(photoMesh);
      },
      undefined,
      () => {
        // Fallback procedural canvas if image load has issue
        const fallbackCanvas = document.createElement('canvas');
        fallbackCanvas.width = 256;
        fallbackCanvas.height = 320;
        const fCtx = fallbackCanvas.getContext('2d');
        if (fCtx) {
          fCtx.fillStyle = '#0f1738';
          fCtx.fillRect(0, 0, 256, 320);
          fCtx.fillStyle = '#16bfff';
          fCtx.font = 'bold 20px "Plus Jakarta Sans"';
          fCtx.fillText('MD. MEHEDI HASAN', 20, 160);
          fCtx.font = '14px "JetBrains Mono"';
          fCtx.fillText('Wafa Zone Creator', 20, 190);
        }
        const fallbackTex = new THREE.CanvasTexture(fallbackCanvas);
        fallbackTex.colorSpace = THREE.SRGBColorSpace;
        const fallbackMat = new THREE.MeshBasicMaterial({ map: fallbackTex });
        const fallbackMesh = new THREE.Mesh(new THREE.PlaneGeometry(0.33, 0.43), fallbackMat);
        fallbackMesh.position.set(0, 0, 0.016);
        portraitGroup.add(fallbackMesh);
      }
    );

    scene.add(portraitGroup);
    interactiveObjectsRef.current.push({
      id: 'portrait',
      mesh: portraitGroup,
      title: 'Md. Mehedi Hasan Portrait',
    });

    // --- 8. Floating Holographic Info & Project Panels ---
    const holoGroup = new THREE.Group();
    holoGroup.position.set(1.15, 2.3, -0.2);

    const holoCanvas = document.createElement('canvas');
    holoCanvas.width = 512;
    holoCanvas.height = 256;
    const hCtx = holoCanvas.getContext('2d');
    if (hCtx) {
      hCtx.fillStyle = 'rgba(7, 11, 24, 0.75)';
      hCtx.fillRect(0, 0, 512, 256);
      hCtx.strokeStyle = '#16bfff';
      hCtx.lineWidth = 4;
      hCtx.strokeRect(4, 4, 504, 248);

      hCtx.fillStyle = '#16bfff';
      hCtx.font = 'bold 24px "Plus Jakarta Sans"';
      hCtx.fillText('WAFA ZONE ECOSYSTEM', 28, 48);

      hCtx.fillStyle = '#8b45ff';
      hCtx.font = 'bold 16px "JetBrains Mono"';
      hCtx.fillText('DREAM • DEVELOP • DELIVER', 28, 80);

      hCtx.fillStyle = '#f4f7ff';
      hCtx.font = '17px "JetBrains Mono"';
      hCtx.fillText('• Wafa Deen (Android)', 28, 125);
      hCtx.fillText('• Wafa Camera Pro (Camera2)', 28, 155);
      hCtx.fillText('• Wafa AI Assistant (LLM)', 28, 185);

      hCtx.fillStyle = '#00e5ff';
      hCtx.fillText('[CLICK TO EXPLORE PROJECTS]', 28, 225);
    }
    const holoTex = new THREE.CanvasTexture(holoCanvas);
    holoTex.colorSpace = THREE.SRGBColorSpace;
    const holoMesh = new THREE.Mesh(
      new THREE.PlaneGeometry(1.2, 0.6),
      new THREE.MeshBasicMaterial({
        map: holoTex,
        transparent: true,
        opacity: 0.88,
        side: THREE.DoubleSide,
      })
    );
    holoMesh.rotation.y = -0.22;
    holoGroup.add(holoMesh);
    scene.add(holoGroup);

    interactiveObjectsRef.current.push({
      id: 'projects-holo',
      mesh: holoGroup,
      title: 'Wafa Zone Project Universe',
    });

    // --- 9. Cursor-Reactive Interactive Particle System ---
    // BufferGeometry with 1200 glowing space particles that respond to user mouse velocity & position
    const particleCount = quality === 'high' ? 1200 : 600;
    const particlePositions = new Float32Array(particleCount * 3);
    const particleOriginals = new Float32Array(particleCount * 3);
    const particleColors = new Float32Array(particleCount * 3);

    const pColorChoices = [
      new THREE.Color(0x16bfff), // Electric Blue
      new THREE.Color(0x8b45ff), // Neon Purple
      new THREE.Color(0x00e5ff), // Cyan
      new THREE.Color(0xf4f7ff), // White
    ];

    for (let i = 0; i < particleCount; i++) {
      const x = (Math.random() - 0.5) * 14;
      const y = Math.random() * 8 + 0.2;
      const z = (Math.random() - 0.5) * 12;

      particlePositions[i * 3] = x;
      particlePositions[i * 3 + 1] = y;
      particlePositions[i * 3 + 2] = z;

      particleOriginals[i * 3] = x;
      particleOriginals[i * 3 + 1] = y;
      particleOriginals[i * 3 + 2] = z;

      const chosen = pColorChoices[Math.floor(Math.random() * pColorChoices.length)];
      particleColors[i * 3] = chosen.r;
      particleColors[i * 3 + 1] = chosen.g;
      particleColors[i * 3 + 2] = chosen.b;
    }

    const particleGeo = new THREE.BufferGeometry();
    particleGeo.setAttribute('position', new THREE.BufferAttribute(particlePositions, 3));
    particleGeo.setAttribute('color', new THREE.BufferAttribute(particleColors, 3));

    // Particle texture
    const pCanvas = document.createElement('canvas');
    pCanvas.width = 32;
    pCanvas.height = 32;
    const pCtx = pCanvas.getContext('2d');
    if (pCtx) {
      const grad = pCtx.createRadialGradient(16, 16, 0, 16, 16, 16);
      grad.addColorStop(0, 'rgba(255, 255, 255, 1)');
      grad.addColorStop(0.3, 'rgba(22, 191, 255, 0.8)');
      grad.addColorStop(1, 'rgba(7, 11, 24, 0)');
      pCtx.fillStyle = grad;
      pCtx.fillRect(0, 0, 32, 32);
    }
    const pTexture = new THREE.CanvasTexture(pCanvas);

    const particleMat = new THREE.PointsMaterial({
      size: 0.08,
      vertexColors: true,
      map: pTexture,
      transparent: true,
      opacity: 0.85,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
    });

    const particles = new THREE.Points(particleGeo, particleMat);
    scene.add(particles);

    // --- 10. Animation Loop with Exponential Damping & Cursor Reactivity ---
    let clock = new THREE.Clock();

    const tick = () => {
      frameIdRef.current = requestAnimationFrame(tick);
      const delta = clock.getDelta();
      const elapsed = clock.getElapsedTime();

      // Smooth cursor interpolation
      mouseNormRef.current.x = THREE.MathUtils.damp(
        mouseNormRef.current.x,
        mouseNormRef.current.targetX,
        4,
        delta
      );
      mouseNormRef.current.y = THREE.MathUtils.damp(
        mouseNormRef.current.y,
        mouseNormRef.current.targetY,
        4,
        delta
      );

      // Camera Position Damping + subtle cursor parallax
      const parallaxX = mouseNormRef.current.x * 0.35;
      const parallaxY = mouseNormRef.current.y * 0.25;

      camera.position.x = THREE.MathUtils.damp(
        camera.position.x,
        targetCamPosRef.current.x + parallaxX,
        3.2,
        delta
      );
      camera.position.y = THREE.MathUtils.damp(
        camera.position.y,
        targetCamPosRef.current.y + parallaxY,
        3.2,
        delta
      );
      camera.position.z = THREE.MathUtils.damp(
        camera.position.z,
        targetCamPosRef.current.z,
        3.2,
        delta
      );

      currentLookAtRef.current.x = THREE.MathUtils.damp(
        currentLookAtRef.current.x,
        targetLookAtRef.current.x + parallaxX * 0.2,
        3.2,
        delta
      );
      currentLookAtRef.current.y = THREE.MathUtils.damp(
        currentLookAtRef.current.y,
        targetLookAtRef.current.y,
        3.2,
        delta
      );
      currentLookAtRef.current.z = THREE.MathUtils.damp(
        currentLookAtRef.current.z,
        targetLookAtRef.current.z,
        3.2,
        delta
      );
      camera.lookAt(currentLookAtRef.current);

      // Rotate 3D Digital Globe
      globeGroup.rotation.y = elapsed * 0.3;
      ring1.rotation.z = elapsed * 0.4;

      // Bob floating holographic panel
      holoGroup.position.y = 2.3 + Math.sin(elapsed * 1.5) * 0.05;

      // Cursor-reactive particle flow
      const posAttr = particleGeo.attributes.position as THREE.BufferAttribute;
      const cursorX = mouseNormRef.current.x * 4;
      const cursorY = mouseNormRef.current.y * 3 + 2;

      for (let i = 0; i < particleCount; i++) {
        const ox = particleOriginals[i * 3];
        const oy = particleOriginals[i * 3 + 1];
        const oz = particleOriginals[i * 3 + 2];

        // Wave effect
        const wave = Math.sin(elapsed + ox * 0.5 + oz * 0.5) * 0.1;

        // Interaction with mouse cursor
        const dx = ox - cursorX;
        const dy = oy - cursorY;
        const dist = Math.sqrt(dx * dx + dy * dy);

        let repelX = 0;
        let repelY = 0;
        if (dist < 2.5) {
          const force = (2.5 - dist) * 0.25;
          repelX = (dx / dist) * force;
          repelY = (dy / dist) * force;
        }

        posAttr.setXYZ(i, ox + repelX, oy + wave + repelY, oz);
      }
      posAttr.needsUpdate = true;

      renderer.render(scene, camera);
    };

    tick();
    setIsReady(true);

    // Resize handler
    const handleResize = () => {
      if (!container || !renderer || !camera) return;
      camera.aspect = container.clientWidth / container.clientHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(container.clientWidth, container.clientHeight);
    };
    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(frameIdRef.current);
      if (renderer.domElement && container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }
      renderer.dispose();
      particleGeo.dispose();
      particleMat.dispose();
      scene.clear();
    };
  }, [quality, heroImageUrl]);

  if (quality === '2d') {
    return null;
  }

  return (
    <div
      ref={mountRef}
      onPointerMove={handlePointerMove}
      onClick={handleClick}
      className="relative w-full h-full cursor-grab active:cursor-grabbing select-none"
    >
      {/* Loading state indicator */}
      {!isReady && (
        <div className="absolute inset-0 flex items-center justify-center bg-[#070B18]">
          <div className="text-center space-y-3">
            <div className="w-10 h-10 border-2 border-[#16BFFF] border-t-transparent rounded-full animate-spin mx-auto" />
            <p className="text-xs uppercase tracking-widest text-[#AAB7D4]">
              Initializing 3D Digital World...
            </p>
          </div>
        </div>
      )}

      {/* Hover tooltip for interactive 3D elements */}
      {hoveredObject && (
        <div className="absolute top-6 left-1/2 -translate-x-1/2 z-20 pointer-events-none transition-all duration-200">
          <div className="bg-[#0B1430]/90 backdrop-blur-md border border-[#16BFFF]/50 text-white text-xs px-4 py-2 rounded-lg shadow-xl shadow-[#16BFFF]/10 flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-[#00E5FF]" />
            <span className="font-medium">{hoveredObject}</span>
            <span className="text-[#AAB7D4] text-[11px]">— Click to Inspect</span>
          </div>
        </div>
      )}
    </div>
  );
};
