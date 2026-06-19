"use client";

import React, { useEffect, useRef } from "react";
import * as THREE from "three";

export default function CsiVitc3D() {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    // --- Scene Setup ---
    const scene = new THREE.Scene();
    scene.fog = new THREE.FogExp2(0x050508, 0.012);

    // --- Camera Setup ---
    const camera = new THREE.PerspectiveCamera(
      45,
      window.innerWidth / window.innerHeight,
      1,
      1000
    );
    camera.position.set(0, 35, 85);
    camera.lookAt(0, 5, 0);

    // --- Renderer Setup ---
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    container.appendChild(renderer.domElement);

    // --- Lights ---
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.8);
    scene.add(ambientLight);

    const pointLight = new THREE.PointLight(0x38bdf8, 2, 100);
    pointLight.position.set(0, 20, 10);
    scene.add(pointLight);

    const purpleLight = new THREE.PointLight(0xa855f7, 2, 100);
    purpleLight.position.set(-20, 10, -20);
    scene.add(purpleLight);

    // --- Materials (Hologram Look) ---
    const cyanWireframeMat = new THREE.MeshBasicMaterial({
      color: 0x00f2fe,
      wireframe: true,
      transparent: true,
      opacity: 0.4,
    });

    const purpleWireframeMat = new THREE.MeshBasicMaterial({
      color: 0xa855f7,
      wireframe: true,
      transparent: true,
      opacity: 0.3,
    });

    const glowPointsMat = new THREE.PointsMaterial({
      color: 0x38bdf8,
      size: 1.2,
      transparent: true,
      opacity: 0.8,
    });

    const greenWireframeMat = new THREE.MeshBasicMaterial({
      color: 0x10b981,
      wireframe: true,
      transparent: true,
      opacity: 0.4,
    });

    // --- High-tech polar grid floor ---
    const polarGrid = new THREE.PolarGridHelper(60, 16, 8, 64, 0x00f2fe, 0x1e293b);
    polarGrid.position.y = -10;
    (polarGrid.material as THREE.Material).transparent = true;
    (polarGrid.material as THREE.Material).opacity = 0.25;
    scene.add(polarGrid);

    // --- Hologram Group ---
    const hologramGroup = new THREE.Group();
    hologramGroup.position.y = -5;
    scene.add(hologramGroup);

    // Dynamic horizontal sweeping wireframe scan plane (sci-fi scanning rings)
    const scanPlaneGeo = new THREE.RingGeometry(0, 32, 64);
    const scanPlaneMat = new THREE.MeshBasicMaterial({
      color: 0x00f2fe,
      transparent: true,
      opacity: 0.08,
      side: THREE.DoubleSide,
      wireframe: true
    });
    const scanPlane = new THREE.Mesh(scanPlaneGeo, scanPlaneMat);
    scanPlane.rotation.x = -Math.PI / 2;
    hologramGroup.add(scanPlane);

    // 1. Netaji Auditorium Dome (VIT Chennai Oval Auditorium)
    const domeGroup = new THREE.Group();
    domeGroup.position.set(-22, -10, -2);
    
    // Inner structure (glass block)
    const domeGlassGeo = new THREE.CylinderGeometry(5.5, 6, 7, 16, 4, true);
    const domeGlass = new THREE.Mesh(domeGlassGeo, purpleWireframeMat);
    domeGlass.position.y = 3.5;
    domeGroup.add(domeGlass);
    
    // Outer futuristic vertical ribs wrapping the auditorium (Torus semicircles)
    const ribGeo = new THREE.TorusGeometry(7, 0.25, 8, 24, Math.PI);
    for (let i = 0; i < 4; i++) {
      const rib = new THREE.Mesh(ribGeo, cyanWireframeMat);
      rib.rotation.y = (i / 4) * Math.PI;
      // The torus semicircle arches from y=0 upwards and meets at the peak
      domeGroup.add(rib);
    }
    
    // Bottom rings
    const domeRing1 = new THREE.Mesh(new THREE.RingGeometry(6.5, 7.5, 24), purpleWireframeMat);
    domeRing1.rotation.x = -Math.PI / 2;
    domeRing1.position.y = 0.1;
    domeGroup.add(domeRing1);

    const domeRing2 = new THREE.Mesh(new THREE.RingGeometry(6.5, 7.5, 24), purpleWireframeMat);
    domeRing2.rotation.x = -Math.PI / 2;
    domeRing2.position.y = 3.5;
    domeGroup.add(domeRing2);
    
    hologramGroup.add(domeGroup);

    // 2. MG Academic Block Complex (VIT Chennai Main Academic Block)
    const mgGroup = new THREE.Group();
    mgGroup.position.set(22, -10, -5);
    
    // Central main administrative block with subdivisions for a window grid
    const mgCenterGeo = new THREE.BoxGeometry(11, 12, 10, 6, 8, 5);
    const mgCenter = new THREE.Mesh(mgCenterGeo, cyanWireframeMat);
    mgCenter.position.set(0, 6, 0);
    mgGroup.add(mgCenter);
    
    // Left Wing with window subdivisions
    const mgLeftGeo = new THREE.BoxGeometry(6, 9, 8, 3, 6, 4);
    const mgLeft = new THREE.Mesh(mgLeftGeo, purpleWireframeMat);
    mgLeft.position.set(-8.5, 4.5, -1);
    mgGroup.add(mgLeft);
    
    // Right Wing with window subdivisions
    const mgRightGeo = new THREE.BoxGeometry(6, 9, 8, 3, 6, 4);
    const mgRight = new THREE.Mesh(mgRightGeo, purpleWireframeMat);
    mgRight.position.set(8.5, 4.5, -1);
    mgGroup.add(mgRight);
    
    // Portico (entrance arch at the front of MG Block)
    const mgPorticoGeo = new THREE.BoxGeometry(5, 5, 3, 2, 3, 2);
    const mgPortico = new THREE.Mesh(mgPorticoGeo, cyanWireframeMat);
    mgPortico.position.set(0, 2.5, 6);
    mgGroup.add(mgPortico);
    
    // Roof Dome Ornament (central cupola)
    const mgDomeGeo = new THREE.SphereGeometry(2.2, 12, 12, 0, Math.PI * 2, 0, Math.PI / 2);
    const mgDome = new THREE.Mesh(mgDomeGeo, cyanWireframeMat);
    mgDome.position.set(0, 12, 0);
    mgGroup.add(mgDome);
    
    hologramGroup.add(mgGroup);

    // MG Lake (pond in front of MG Block)
    const lakeGeo = new THREE.CircleGeometry(7, 32);
    const lakeMat = new THREE.MeshBasicMaterial({
      color: 0x0ea5e9,
      transparent: true,
      opacity: 0.15,
      side: THREE.DoubleSide
    });
    const lake = new THREE.Mesh(lakeGeo, lakeMat);
    lake.rotation.x = -Math.PI / 2;
    lake.scale.set(1.4, 0.8, 1); // stretch into an ellipse
    lake.position.set(22, -9.9, 8);
    hologramGroup.add(lake);

    // Lake border ring (wireframe)
    const lakeBorderGeo = new THREE.RingGeometry(6.9, 7.1, 32);
    const lakeBorder = new THREE.Mesh(lakeBorderGeo, cyanWireframeMat);
    lakeBorder.rotation.x = -Math.PI / 2;
    lakeBorder.scale.set(1.4, 0.8, 1);
    lakeBorder.position.set(22, -9.85, 8);
    hologramGroup.add(lakeBorder);

    // Fountain inside MG Lake
    const fountainGroup = new THREE.Group();
    fountainGroup.position.set(22, -9.8, 8);
    hologramGroup.add(fountainGroup);

    const fountainCount = 8;
    for (let i = 0; i < fountainCount; i++) {
      const angle = (i / fountainCount) * Math.PI * 2;
      const pts = [
        new THREE.Vector3(0, 0, 0),
        new THREE.Vector3(Math.cos(angle) * 1.2, 2.5, Math.sin(angle) * 1.2),
        new THREE.Vector3(Math.cos(angle) * 2.4, 0, Math.sin(angle) * 2.4)
      ];
      const curve = new THREE.CatmullRomCurve3(pts);
      const points = curve.getPoints(8);
      const fountainLineGeo = new THREE.BufferGeometry().setFromPoints(points);
      const fountainLine = new THREE.Line(fountainLineGeo, new THREE.LineBasicMaterial({
        color: 0x00f2fe,
        transparent: true,
        opacity: 0.65
      }));
      fountainGroup.add(fountainLine);
    }

    // 3. Entrance Gate & Roundabout (Center Front)
    // Roundabout road ring
    const roadRingGeo = new THREE.RingGeometry(4.5, 6.5, 32);
    const roadRing = new THREE.Mesh(roadRingGeo, purpleWireframeMat);
    roadRing.rotation.x = -Math.PI / 2;
    roadRing.position.set(0, -9.9, 12);
    hologramGroup.add(roadRing);

    // Roundabout central monument (obelisk)
    const monumentGeo = new THREE.ConeGeometry(0.8, 8, 4);
    const monument = new THREE.Mesh(monumentGeo, cyanWireframeMat);
    monument.position.set(0, -6, 12); // Base at y=-10, height=8, center at y=-6
    hologramGroup.add(monument);

    // Pulsing Node at the peak of roundabout monument
    const emitterGeo = new THREE.SphereGeometry(1.2, 8, 8);
    const emitterMat = new THREE.MeshBasicMaterial({ color: 0x00f2fe });
    const emitter = new THREE.Mesh(emitterGeo, emitterMat);
    emitter.position.set(0, -2, 12);
    hologramGroup.add(emitter);

    // Main entrance gate structure (arch canopy)
    const archGroup = new THREE.Group();
    archGroup.position.set(0, -10, 25);
    
    // Left Support Column
    const colGeo = new THREE.BoxGeometry(1.5, 6, 1.5);
    const leftCol = new THREE.Mesh(colGeo, cyanWireframeMat);
    leftCol.position.set(-6, 3, 0);
    archGroup.add(leftCol);
    
    // Right Support Column
    const rightCol = new THREE.Mesh(colGeo, cyanWireframeMat);
    rightCol.position.set(6, 3, 0);
    archGroup.add(rightCol);
    
    // Green Arch Canopy Roof
    const roofGeo = new THREE.BoxGeometry(16, 1.2, 3);
    const roof = new THREE.Mesh(roofGeo, greenWireframeMat);
    roof.position.set(0, 6, 0);
    archGroup.add(roof);
    hologramGroup.add(archGroup);

    // 4. Background Hostel Towers Skyline (Left & Right)
    const hostelGroup = new THREE.Group();
    hostelGroup.position.y = -10;

    // Left Hostel Block A with grid subdivisions for windows & floors
    const hostelA = new THREE.Mesh(new THREE.BoxGeometry(8, 20, 8, 4, 12, 4), purpleWireframeMat);
    hostelA.position.set(-28, 10, -26);
    hostelGroup.add(hostelA);

    // Left Hostel Block B
    const hostelB = new THREE.Mesh(new THREE.BoxGeometry(6, 15, 6, 3, 10, 3), cyanWireframeMat);
    hostelB.position.set(-20, 7.5, -22);
    hostelGroup.add(hostelB);

    // Right Hostel Block C with grid subdivisions for windows & floors
    const hostelC = new THREE.Mesh(new THREE.BoxGeometry(9, 22, 9, 4, 14, 4), purpleWireframeMat);
    hostelC.position.set(28, 11, -28);
    hostelGroup.add(hostelC);

    // Right Hostel Block D
    const hostelD = new THREE.Mesh(new THREE.BoxGeometry(7, 17, 7, 3, 11, 3), cyanWireframeMat);
    hostelD.position.set(36, 8.5, -24);
    hostelGroup.add(hostelD);
    hologramGroup.add(hostelGroup);

    // 5. Connecting roadway dashed paths
    const roadMaterial = new THREE.LineDashedMaterial({
      color: 0x38bdf8,
      dashSize: 1,
      gapSize: 0.5,
      transparent: true,
      opacity: 0.35
    });

    const createRoadPath = (pts: THREE.Vector3[]) => {
      const curve = new THREE.CatmullRomCurve3(pts);
      const points = curve.getPoints(40);
      const roadGeo = new THREE.BufferGeometry().setFromPoints(points);
      const road = new THREE.Line(roadGeo, roadMaterial);
      road.computeLineDistances(); // required for dashed rendering
      return road;
    };

    const entranceRoad = createRoadPath([
      new THREE.Vector3(0, -9.9, 25),
      new THREE.Vector3(0, -9.9, 18)
    ]);
    hologramGroup.add(entranceRoad);

    const leftRoad = createRoadPath([
      new THREE.Vector3(0, -9.9, 12),
      new THREE.Vector3(-8, -9.9, 8),
      new THREE.Vector3(-18, -9.9, 2),
      new THREE.Vector3(-22, -9.9, -2)
    ]);
    hologramGroup.add(leftRoad);

    const rightRoad = createRoadPath([
      new THREE.Vector3(0, -9.9, 12),
      new THREE.Vector3(8, -9.9, 8),
      new THREE.Vector3(16, -9.9, 2),
      new THREE.Vector3(22, -9.9, -5)
    ]);
    hologramGroup.add(rightRoad);

    // 6. Constellation Nodes (CSI Communication Network)
    const nodePoints: THREE.Vector3[] = [
      new THREE.Vector3(-22, -3, -2),   // Netaji dome peak
      new THREE.Vector3(22, 2, -5),     // MG admin block peak (cupola dome)
      new THREE.Vector3(0, -2, 12),     // Obelisk peak
      new THREE.Vector3(-28, 10, -26),  // Hostel A peak
      new THREE.Vector3(28, 12, -28),   // Hostel C peak
      new THREE.Vector3(0, 8, -5),      // Central floating hub
    ];

    const nodesGroup = new THREE.Group();
    hologramGroup.add(nodesGroup);

    const nodeSphereGeo = new THREE.SphereGeometry(1, 8, 8);
    const nodeMeshMat = new THREE.MeshBasicMaterial({ color: 0xffffff });

    nodePoints.forEach((pt) => {
      const mesh = new THREE.Mesh(nodeSphereGeo, nodeMeshMat);
      mesh.position.copy(pt);
      nodesGroup.add(mesh);
    });

    // Connecting laser lines between nodes
    const lineIndices = [
      [0, 5], [1, 5], [2, 5], [3, 5], [4, 5], // all linked to central floating hub
      [0, 3], // Netaji to Hostel A
      [1, 4], // MG Block to Hostel C
      [0, 2], // Netaji to Obelisk
      [1, 2], // MG Block to Obelisk
    ];

    const linesGroup = new THREE.Group();
    hologramGroup.add(linesGroup);

    const lineMaterial = new THREE.LineBasicMaterial({
      color: 0x00f2fe,
      transparent: true,
      opacity: 0.6,
    });

    lineIndices.forEach(([startIdx, endIdx]) => {
      const points = [nodePoints[startIdx], nodePoints[endIdx]];
      const lineGeo = new THREE.BufferGeometry().setFromPoints(points);
      const line = new THREE.Line(lineGeo, lineMaterial);
      linesGroup.add(line);
    });

    // 5. Starfield background particles
    const starsGeo = new THREE.BufferGeometry();
    const starsCount = 500;
    const starPositions = new Float32Array(starsCount * 3);

    for (let i = 0; i < starsCount * 3; i += 3) {
      starPositions[i] = (Math.random() - 0.5) * 400;
      starPositions[i + 1] = Math.random() * 200 - 50;
      starPositions[i + 2] = (Math.random() - 0.5) * 400;
    }

    starsGeo.setAttribute("position", new THREE.BufferAttribute(starPositions, 3));
    const starfield = new THREE.Points(starsGeo, glowPointsMat);
    scene.add(starfield);

    // --- Interactive Mouse Parallax ---
    let mouseX = 0;
    let mouseY = 0;
    let targetX = 0;
    let targetY = 0;

    const handleMouseMove = (e: MouseEvent) => {
      mouseX = (e.clientX - window.innerWidth / 2) / 100;
      mouseY = (e.clientY - window.innerHeight / 2) / 100;
    };

    window.addEventListener("mousemove", handleMouseMove);

    // --- Animation Loop ---
    const clock = new THREE.Clock();

    const animate = () => {
      requestAnimationFrame(animate);

      const elapsedTime = clock.getElapsedTime();

      // Spin hologram slowly
      hologramGroup.rotation.y = elapsedTime * 0.05;

      // Rotate ground grid floor
      polarGrid.rotation.z = elapsedTime * 0.02;

      // Animate sweeping vertical hologram laser scanner (bounds y=-10 to y=12)
      scanPlane.position.y = -10 + ((Math.sin(elapsedTime * 1.5) + 1) * 11);

      // Mouse Parallax easing
      targetX += (mouseX - targetX) * 0.05;
      targetY += (mouseY - targetY) * 0.05;

      hologramGroup.rotation.x = targetY * 0.15;
      hologramGroup.rotation.y += targetX * 0.25;

      // Pulse emitter size
      const scale = 1 + Math.sin(elapsedTime * 5) * 0.15;
      emitter.scale.set(scale, scale, scale);

      // Pulse fountain height & rotate spray
      const fountainScale = 0.8 + Math.sin(elapsedTime * 4) * 0.25;
      fountainGroup.scale.set(1, fountainScale, 1);
      fountainGroup.rotation.y = elapsedTime * 0.5;

      // Pulse CSI network node spheres
      const nodeScale = 1 + Math.sin(elapsedTime * 4) * 0.12;
      nodesGroup.scale.set(nodeScale, nodeScale, nodeScale);

      // Pulse lines opacity
      lineMaterial.opacity = 0.4 + Math.sin(elapsedTime * 3) * 0.2;

      // Slow drift stars
      starfield.rotation.y = elapsedTime * 0.01;

      renderer.render(scene, camera);
    };

    animate();

    // --- Resize Handler ---
    const handleResize = () => {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
    };

    window.addEventListener("resize", handleResize);

    // --- Cleanup ---
    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("resize", handleResize);
      container.removeChild(renderer.domElement);
      renderer.dispose();
    };
  }, []);

  return (
    <div
      ref={containerRef}
      style={{
        position: "absolute",
        inset: 0,
        width: "100%",
        height: "100%",
        backgroundColor: "#050508",
        zIndex: 0,
        overflow: "hidden",
        filter: "drop-shadow(0 0 20px rgba(0, 242, 254, 0.22))"
      }}
    />
  );
}
