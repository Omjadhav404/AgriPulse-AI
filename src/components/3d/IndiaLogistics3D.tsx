import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';

interface IndiaLogistics3DProps {
  interactive?: boolean;
  selectedCity?: string;
  onCitySelect?: (cityName: string) => void;
  height?: string;
  showOverlayControls?: boolean;
}

interface CityNode {
  name: string;
  type: 'hub' | 'port' | 'rail' | 'air';
  pos: THREE.Vector3;
  label: string;
  activeShipments: number;
}

export const IndiaLogistics3D: React.FC<IndiaLogistics3DProps> = ({
  interactive = true,
  selectedCity,
  onCitySelect,
  height = '100%',
  showOverlayControls = true
}) => {
  const mountRef = useRef<HTMLDivElement>(null);
  const [activeCameraView, setActiveCameraView] = useState<'network' | 'west' | 'north' | 'south'>('network');
  const [hoveredNode, setHoveredNode] = useState<string | null>(null);

  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;

    // --- 1. Scene, Camera, Renderer ---
    const width = container.clientWidth || window.innerWidth;
    const heightPx = container.clientHeight || 600;

    const scene = new THREE.Scene();
    scene.fog = new THREE.FogExp2(0x07090e, 0.035);

    const camera = new THREE.PerspectiveCamera(45, width / heightPx, 0.1, 1000);
    camera.position.set(0, 18, 28);
    camera.lookAt(0, 0, 0);

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true, powerPreference: 'high-performance' });
    renderer.setSize(width, heightPx);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.2;
    container.appendChild(renderer.domElement);

    // --- 2. Lighting ---
    const ambientLight = new THREE.AmbientLight(0x1a2638, 2.5);
    scene.add(ambientLight);

    const dirLight = new THREE.DirectionalLight(0xffffff, 2.0);
    dirLight.position.set(15, 30, 20);
    scene.add(dirLight);

    const orangePointLight = new THREE.PointLight(0xff6600, 3.5, 50);
    orangePointLight.position.set(-3, 6, 4);
    scene.add(orangePointLight);

    const cyanPointLight = new THREE.PointLight(0x00f0ff, 2.5, 50);
    cyanPointLight.position.set(4, 5, -2);
    scene.add(cyanPointLight);

    // --- 3. Ground Terrain & Digital Grid ---
    const gridHelper = new THREE.GridHelper(50, 40, 0x1f293d, 0x0e1422);
    gridHelper.position.y = -0.05;
    scene.add(gridHelper);

    // Decorative circular radar range rings
    const ringGeo = new THREE.RingGeometry(8, 8.08, 64);
    const ringMat = new THREE.MeshBasicMaterial({ color: 0x00f0ff, opacity: 0.12, transparent: true, side: THREE.DoubleSide });
    const ringMesh = new THREE.Mesh(ringGeo, ringMat);
    ringMesh.rotation.x = Math.PI / 2;
    ringMesh.position.y = 0.01;
    scene.add(ringMesh);

    const ringGeo2 = new THREE.RingGeometry(16, 16.1, 64);
    const ringMesh2 = new THREE.Mesh(ringGeo2, ringMat);
    ringMesh2.rotation.x = Math.PI / 2;
    ringMesh2.position.y = 0.01;
    scene.add(ringMesh2);

    // --- 4. City Hub Nodes Coordinates (Projected onto 3D Plane) ---
    // Scaled & centered around central India
    const cityNodes: CityNode[] = [
      { name: 'Mumbai', type: 'hub', pos: new THREE.Vector3(-4.5, 0.2, 3.0), label: 'Bhiwandi / Mumbai Hub', activeShipments: 412 },
      { name: 'JNPT Port', type: 'port', pos: new THREE.Vector3(-4.9, 0.2, 3.4), label: 'JNPT Maritime Port', activeShipments: 284 },
      { name: 'Delhi NCR', type: 'hub', pos: new THREE.Vector3(-0.8, 0.2, -6.8), label: 'Manesar Logistics Park', activeShipments: 520 },
      { name: 'Bengaluru', type: 'hub', pos: new THREE.Vector3(-0.6, 0.2, 9.2), label: 'Peenya Industrial Node', activeShipments: 340 },
      { name: 'Pune', type: 'hub', pos: new THREE.Vector3(-3.8, 0.2, 4.4), label: 'Chakan Auto Cluster', activeShipments: 215 },
      { name: 'Hyderabad', type: 'hub', pos: new THREE.Vector3(0.5, 0.2, 5.2), label: 'Central Aero & Pharma Hub', activeShipments: 278 },
      { name: 'Chennai', type: 'port', pos: new THREE.Vector3(1.6, 0.2, 9.5), label: 'Sriperumbudur & Port', activeShipments: 310 },
      { name: 'Ahmedabad', type: 'hub', pos: new THREE.Vector3(-5.2, 0.2, -1.8), label: 'Sanand Industrial Node', activeShipments: 198 },
      { name: 'Jaipur', type: 'rail', pos: new THREE.Vector3(-2.2, 0.2, -4.5), label: 'Sitapura Freight Terminal', activeShipments: 142 },
      { name: 'Kolkata', type: 'hub', pos: new THREE.Vector3(6.5, 0.2, -1.2), label: 'Dankuni Eastern Terminal', activeShipments: 230 },
      { name: 'Mundra Port', type: 'port', pos: new THREE.Vector3(-7.2, 0.2, -2.6), label: 'Mundra Deep Sea Port', activeShipments: 185 },
      { name: 'Nagpur', type: 'hub', pos: new THREE.Vector3(0.2, 0.2, 1.2), label: 'Zero-Mile Multimodal Hub', activeShipments: 164 }
    ];

    const nodeObjects: THREE.Group[] = [];

    cityNodes.forEach(node => {
      const nodeGroup = new THREE.Group();
      nodeGroup.position.copy(node.pos);

      // Outer pulsing beacon ring
      const beaconGeo = new THREE.CylinderGeometry(0.55, 0.55, 0.1, 16);
      const isPort = node.type === 'port';
      const beaconColor = isPort ? 0x00f0ff : node.name === 'Mumbai' || node.name === 'Delhi NCR' ? 0xff6600 : 0x00e676;
      const beaconMat = new THREE.MeshBasicMaterial({ color: beaconColor, wireframe: true, transparent: true, opacity: 0.6 });
      const beacon = new THREE.Mesh(beaconGeo, beaconMat);
      nodeGroup.add(beacon);

      // Inner glowing core
      const coreGeo = new THREE.SphereGeometry(0.22, 16, 16);
      const coreMat = new THREE.MeshStandardMaterial({
        color: beaconColor,
        emissive: beaconColor,
        emissiveIntensity: 0.8,
        metalness: 0.2,
        roughness: 0.3
      });
      const core = new THREE.Mesh(coreGeo, coreMat);
      core.position.y = 0.2;
      nodeGroup.add(core);

      // Vertical beacon ray
      const rayGeo = new THREE.CylinderGeometry(0.03, 0.03, 2.5, 8);
      const rayMat = new THREE.MeshBasicMaterial({ color: beaconColor, transparent: true, opacity: 0.45 });
      const ray = new THREE.Mesh(rayGeo, rayMat);
      ray.position.y = 1.3;
      nodeGroup.add(ray);

      nodeGroup.userData = { cityData: node };
      scene.add(nodeGroup);
      nodeObjects.push(nodeGroup);
    });

    // --- 5. Trade Corridors (CatmullRom Curves) ---
    const getCityPos = (name: string) => cityNodes.find(c => c.name === name)!.pos;

    // Corridor 1: Western Freight Corridor (Mumbai -> Ahmedabad -> Jaipur -> Delhi)
    const westCurve = new THREE.CatmullRomCurve3([
      getCityPos('Mumbai'),
      new THREE.Vector3(-5.0, 0.3, 0.5),
      getCityPos('Ahmedabad'),
      getCityPos('Jaipur'),
      getCityPos('Delhi NCR')
    ]);

    // Corridor 2: Mumbai - Pune Expressway
    const mumPunCurve = new THREE.CatmullRomCurve3([
      getCityPos('Mumbai'),
      new THREE.Vector3(-4.1, 0.4, 3.6),
      getCityPos('Pune')
    ]);

    // Corridor 3: South Golden Quadrilateral (Pune -> Bengaluru -> Chennai)
    const southCurve = new THREE.CatmullRomCurve3([
      getCityPos('Pune'),
      new THREE.Vector3(-2.2, 0.3, 6.8),
      getCityPos('Bengaluru'),
      new THREE.Vector3(0.5, 0.25, 9.4),
      getCityPos('Chennai')
    ]);

    // Corridor 4: Central North-South Spine (Delhi -> Jaipur -> Nagpur -> Hyderabad -> Bengaluru)
    const centralCurve = new THREE.CatmullRomCurve3([
      getCityPos('Delhi NCR'),
      new THREE.Vector3(-0.4, 0.3, -2.8),
      getCityPos('Nagpur'),
      getCityPos('Hyderabad'),
      getCityPos('Bengaluru')
    ]);

    // Corridor 5: East-West Corridor (Mumbai -> Nagpur -> Kolkata)
    const eastWestCurve = new THREE.CatmullRomCurve3([
      getCityPos('Mumbai'),
      new THREE.Vector3(-2.0, 0.3, 2.0),
      getCityPos('Nagpur'),
      new THREE.Vector3(3.4, 0.3, 0.2),
      getCityPos('Kolkata')
    ]);

    // Coastal Sea Lane (JNPT -> Mundra)
    const seaCurve = new THREE.CatmullRomCurve3([
      getCityPos('JNPT Port'),
      new THREE.Vector3(-7.5, 0.05, 0.8),
      getCityPos('Mundra Port')
    ]);

    const allCorridorCurves = [westCurve, mumPunCurve, southCurve, centralCurve, eastWestCurve, seaCurve];

    // Render road/corridor tubes with glowing material
    allCorridorCurves.forEach((curve, idx) => {
      const isSea = idx === 5;
      const tubeGeo = new THREE.TubeGeometry(curve, 64, isSea ? 0.05 : 0.08, 8, false);
      const tubeMat = new THREE.MeshStandardMaterial({
        color: isSea ? 0x00f0ff : 0x22324d,
        emissive: isSea ? 0x005577 : 0x111c2e,
        roughness: 0.6,
        metalness: 0.3
      });
      const tubeMesh = new THREE.Mesh(tubeGeo, tubeMat);
      scene.add(tubeMesh);

      // Secondary glowing trace line
      const points = curve.getPoints(100);
      const lineGeo = new THREE.BufferGeometry().setFromPoints(points);
      const lineMat = new THREE.LineBasicMaterial({
        color: isSea ? 0x00ffff : idx === 1 ? 0xff6600 : 0x4466aa,
        transparent: true,
        opacity: isSea ? 0.6 : 0.75
      });
      const lineMesh = new THREE.Line(lineGeo, lineMat);
      scene.add(lineMesh);
    });

    // --- 6. Animated Logistics Particles (Flowing freight packets) ---
    const particleCount = 200;
    const particleGeo = new THREE.BufferGeometry();
    const particlePositions = new Float32Array(particleCount * 3);
    const particleProgress: number[] = [];
    const particleCurves: THREE.CatmullRomCurve3[] = [];

    for (let i = 0; i < particleCount; i++) {
      const assignedCurve = allCorridorCurves[i % allCorridorCurves.length];
      particleCurves.push(assignedCurve);
      particleProgress.push(Math.random());
      const p = assignedCurve.getPointAt(particleProgress[i]);
      particlePositions[i * 3] = p.x;
      particlePositions[i * 3 + 1] = p.y + 0.1;
      particlePositions[i * 3 + 2] = p.z;
    }

    particleGeo.setAttribute('position', new THREE.BufferAttribute(particlePositions, 3));
    const particleMat = new THREE.PointsMaterial({
      color: 0xffaa00,
      size: 0.24,
      transparent: true,
      opacity: 0.85,
      blending: THREE.AdditiveBlending
    });
    const particleSystem = new THREE.Points(particleGeo, particleMat);
    scene.add(particleSystem);

    // --- 7. Procedural 3D Truck Fleet Moving Along Corridors ---
    const createTruckMesh = () => {
      const truckGroup = new THREE.Group();

      // Trailer cargo box (e.g. 32 FT container)
      const cargoGeo = new THREE.BoxGeometry(0.5, 0.45, 1.2);
      const cargoMat = new THREE.MeshStandardMaterial({
        color: 0x1a2436,
        metalness: 0.5,
        roughness: 0.4
      });
      const cargoBox = new THREE.Mesh(cargoGeo, cargoMat);
      cargoBox.position.y = 0.35;
      cargoBox.position.z = -0.2;
      truckGroup.add(cargoBox);

      // Cab
      const cabGeo = new THREE.BoxGeometry(0.48, 0.42, 0.45);
      const cabMat = new THREE.MeshStandardMaterial({
        color: 0xff6600,
        metalness: 0.6,
        roughness: 0.2
      });
      const cab = new THREE.Mesh(cabGeo, cabMat);
      cab.position.y = 0.32;
      cab.position.z = 0.55;
      truckGroup.add(cab);

      // Headlight beams
      const lightGeo = new THREE.SphereGeometry(0.06, 8, 8);
      const lightMat = new THREE.MeshBasicMaterial({ color: 0xffffff });
      const leftLight = new THREE.Mesh(lightGeo, lightMat);
      leftLight.position.set(-0.16, 0.25, 0.78);
      truckGroup.add(leftLight);

      const rightLight = new THREE.Mesh(lightGeo, lightMat);
      rightLight.position.set(0.16, 0.25, 0.78);
      truckGroup.add(rightLight);

      // Taillights
      const tailMat = new THREE.MeshBasicMaterial({ color: 0xff1133 });
      const leftTail = new THREE.Mesh(lightGeo, tailMat);
      leftTail.position.set(-0.2, 0.25, -0.82);
      truckGroup.add(leftTail);

      const rightTail = new THREE.Mesh(lightGeo, tailMat);
      rightTail.position.set(0.2, 0.25, -0.82);
      truckGroup.add(rightTail);

      truckGroup.scale.set(0.9, 0.9, 0.9);
      return truckGroup;
    };

    interface AnimatedVehicle {
      mesh: THREE.Group;
      curve: THREE.CatmullRomCurve3;
      progress: number;
      speed: number;
    }

    const animatedVehicles: AnimatedVehicle[] = [
      { mesh: createTruckMesh(), curve: westCurve, progress: 0.2, speed: 0.0006 },
      { mesh: createTruckMesh(), curve: westCurve, progress: 0.65, speed: 0.00055 },
      { mesh: createTruckMesh(), curve: mumPunCurve, progress: 0.45, speed: 0.0012 },
      { mesh: createTruckMesh(), curve: southCurve, progress: 0.3, speed: 0.0007 },
      { mesh: createTruckMesh(), curve: centralCurve, progress: 0.5, speed: 0.00065 },
      { mesh: createTruckMesh(), curve: eastWestCurve, progress: 0.15, speed: 0.00075 }
    ];

    animatedVehicles.forEach(v => scene.add(v.mesh));

    // --- 8. Raycasting & Interaction ---
    const raycaster = new THREE.Raycaster();
    const mouse = new THREE.Vector2();

    const onPointerMove = (e: MouseEvent) => {
      const rect = container.getBoundingClientRect();
      mouse.x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
      mouse.y = -((e.clientY - rect.top) / rect.height) * 2 + 1;

      // Subtle parallax camera tilt
      if (activeCameraView === 'network') {
        targetCameraX = mouse.x * 2.5;
        targetCameraY = 18 - mouse.y * 1.5;
      }

      // Check hover on nodes
      raycaster.setFromCamera(mouse, camera);
      const intersects = raycaster.intersectObjects(nodeObjects, true);
      if (intersects.length > 0) {
        let parent = intersects[0].object.parent;
        while (parent && !parent.userData?.cityData) {
          parent = parent.parent;
        }
        if (parent?.userData?.cityData) {
          container.style.cursor = 'pointer';
          setHoveredNode(parent.userData.cityData.name);
          return;
        }
      }
      container.style.cursor = 'default';
      setHoveredNode(null);
    };

    const onClick = () => {
      raycaster.setFromCamera(mouse, camera);
      const intersects = raycaster.intersectObjects(nodeObjects, true);
      if (intersects.length > 0) {
        let parent = intersects[0].object.parent;
        while (parent && !parent.userData?.cityData) {
          parent = parent.parent;
        }
        if (parent?.userData?.cityData) {
          const clickedCity = parent.userData.cityData.name;
          if (onCitySelect) onCitySelect(clickedCity);
        }
      }
    };

    if (interactive) {
      container.addEventListener('mousemove', onPointerMove);
      container.addEventListener('click', onClick);
    }

    // --- 9. Camera Target Interpolation ---
    let targetCameraX = 0;
    let targetCameraY = 18;
    let targetCameraZ = 28;
    let targetLookAt = new THREE.Vector3(0, 0, 0);

    const updateCameraTargets = () => {
      if (activeCameraView === 'network') {
        targetCameraX = 0;
        targetCameraY = 18;
        targetCameraZ = 28;
        targetLookAt.set(0, 0, 0);
      } else if (activeCameraView === 'west') {
        targetCameraX = -5;
        targetCameraY = 10;
        targetCameraZ = 12;
        targetLookAt.set(-4, 0, 2);
      } else if (activeCameraView === 'north') {
        targetCameraX = -1;
        targetCameraY = 10;
        targetCameraZ = -1;
        targetLookAt.set(-1, 0, -6);
      } else if (activeCameraView === 'south') {
        targetCameraX = 0;
        targetCameraY = 12;
        targetCameraZ = 18;
        targetLookAt.set(0, 0, 8);
      }
    };

    // --- 10. Animation Loop ---
    let animFrameId: number;
    let clock = new THREE.Clock();

    const animate = () => {
      animFrameId = requestAnimationFrame(animate);
      const delta = clock.getDelta();
      const elapsedTime = clock.getElapsedTime();

      // Smooth camera motion
      camera.position.x += (targetCameraX - camera.position.x) * 0.05;
      camera.position.y += (targetCameraY - camera.position.y) * 0.05;
      camera.position.z += (targetCameraZ - camera.position.z) * 0.05;
      camera.lookAt(targetLookAt);

      // Rotate beacon rings
      nodeObjects.forEach((nodeGroup, idx) => {
        const beacon = nodeGroup.children[0];
        if (beacon) beacon.rotation.y = elapsedTime * 0.8 + idx;
      });

      // Animate flowing route particles
      const positions = particleGeo.attributes.position.array as Float32Array;
      for (let i = 0; i < particleCount; i++) {
        particleProgress[i] = (particleProgress[i] + 0.0018) % 1;
        const curve = particleCurves[i];
        const pt = curve.getPointAt(particleProgress[i]);
        positions[i * 3] = pt.x;
        positions[i * 3 + 1] = pt.y + 0.12;
        positions[i * 3 + 2] = pt.z;
      }
      particleGeo.attributes.position.needsUpdate = true;

      // Animate 3D trucks with CatmullRom path following & tangent rotation
      animatedVehicles.forEach(veh => {
        veh.progress = (veh.progress + veh.speed) % 1;
        const pos = veh.curve.getPointAt(veh.progress);
        const tangent = veh.curve.getTangentAt(veh.progress);

        veh.mesh.position.copy(pos);
        // Align rotation to road direction
        const lookTarget = pos.clone().add(tangent);
        veh.mesh.lookAt(lookTarget);
      });

      renderer.render(scene, camera);
    };

    animate();

    // Resize handler
    const onResize = () => {
      if (!container) return;
      const newW = container.clientWidth;
      const newH = container.clientHeight || 600;
      camera.aspect = newW / newH;
      camera.updateProjectionMatrix();
      renderer.setSize(newW, newH);
    };
    window.addEventListener('resize', onResize);

    return () => {
      cancelAnimationFrame(animFrameId);
      window.removeEventListener('resize', onResize);
      if (interactive) {
        container.removeEventListener('mousemove', onPointerMove);
        container.removeEventListener('click', onClick);
      }
      renderer.dispose();
      if (container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }
    };
  }, [activeCameraView, interactive, onCitySelect]);

  return (
    <div style={{ position: 'relative', width: '100%', height, overflow: 'hidden' }}>
      <div ref={mountRef} style={{ width: '100%', height: '100%' }} />

      {/* Floating HUD Badges & Camera Mode Switcher */}
      {showOverlayControls && (
        <div style={{
          position: 'absolute',
          top: '20px',
          right: '20px',
          display: 'flex',
          flexDirection: 'column',
          gap: '8px',
          zIndex: 10
        }}>
          <div style={{
            background: 'rgba(10, 14, 22, 0.85)',
            border: '1px solid rgba(255, 255, 255, 0.12)',
            borderRadius: '10px',
            padding: '6px 8px',
            backdropFilter: 'blur(10px)',
            display: 'flex',
            gap: '6px'
          }}>
            <button
              onClick={() => setActiveCameraView('network')}
              style={{
                background: activeCameraView === 'network' ? 'rgba(255, 102, 0, 0.25)' : 'transparent',
                color: activeCameraView === 'network' ? '#ff6600' : '#94a3b8',
                border: activeCameraView === 'network' ? '1px solid #ff6600' : '1px solid transparent',
                borderRadius: '6px',
                padding: '4px 10px',
                fontSize: '11px',
                fontWeight: 600,
                cursor: 'pointer'
              }}
            >
              National Grid
            </button>
            <button
              onClick={() => setActiveCameraView('west')}
              style={{
                background: activeCameraView === 'west' ? 'rgba(255, 102, 0, 0.25)' : 'transparent',
                color: activeCameraView === 'west' ? '#ff6600' : '#94a3b8',
                border: activeCameraView === 'west' ? '1px solid #ff6600' : '1px solid transparent',
                borderRadius: '6px',
                padding: '4px 10px',
                fontSize: '11px',
                fontWeight: 600,
                cursor: 'pointer'
              }}
            >
              West Corridor (JNPT)
            </button>
            <button
              onClick={() => setActiveCameraView('north')}
              style={{
                background: activeCameraView === 'north' ? 'rgba(255, 102, 0, 0.25)' : 'transparent',
                color: activeCameraView === 'north' ? '#ff6600' : '#94a3b8',
                border: activeCameraView === 'north' ? '1px solid #ff6600' : '1px solid transparent',
                borderRadius: '6px',
                padding: '4px 10px',
                fontSize: '11px',
                fontWeight: 600,
                cursor: 'pointer'
              }}
            >
              Delhi NCR Hub
            </button>
            <button
              onClick={() => setActiveCameraView('south')}
              style={{
                background: activeCameraView === 'south' ? 'rgba(255, 102, 0, 0.25)' : 'transparent',
                color: activeCameraView === 'south' ? '#ff6600' : '#94a3b8',
                border: activeCameraView === 'south' ? '1px solid #ff6600' : '1px solid transparent',
                borderRadius: '6px',
                padding: '4px 10px',
                fontSize: '11px',
                fontWeight: 600,
                cursor: 'pointer'
              }}
            >
              BLR-Chennai
            </button>
          </div>

          {/* Interactive node hover label */}
          {hoveredNode && (
            <div style={{
              background: 'rgba(14, 18, 28, 0.95)',
              border: '1px solid #ff6600',
              borderRadius: '8px',
              padding: '8px 12px',
              color: '#ffffff',
              fontSize: '12px',
              boxShadow: '0 4px 16px rgba(0,0,0,0.6)'
            }}>
              <div style={{ color: '#ff6600', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                {hoveredNode}
              </div>
              <div style={{ color: '#94a3b8', fontSize: '11px' }}>
                Click to inspect active freight lanes
              </div>
            </div>
          )}
        </div>
      )}

      {/* Bottom Telemetry Legend */}
      <div style={{
        position: 'absolute',
        bottom: '16px',
        left: '20px',
        background: 'rgba(9, 12, 18, 0.8)',
        border: '1px solid rgba(255, 255, 255, 0.08)',
        borderRadius: '8px',
        padding: '8px 14px',
        backdropFilter: 'blur(8px)',
        display: 'flex',
        alignItems: 'center',
        gap: '16px',
        fontSize: '11px',
        color: '#94a3b8',
        pointerEvents: 'none'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
          <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#ff6600' }} />
          <span>Major Freight Hubs</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
          <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#00f0ff' }} />
          <span>Maritime Ports (JNPT/Mundra)</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
          <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#00e676' }} />
          <span>Multimodal Rail Nodes</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
          <span style={{ width: '12px', height: '2px', background: '#ffaa00' }} />
          <span>Live 3D Telemetry (NH-48 / W-DFC)</span>
        </div>
      </div>
    </div>
  );
};
