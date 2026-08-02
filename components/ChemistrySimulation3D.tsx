"use client";

import { useEffect, useRef, useState } from "react";
import type { Object3D } from "three";

interface ChemistrySimulation3DProps {
  width?: number;
  height?: number;
}

export default function ChemistrySimulation3D({
  width = 800,
  height = 600,
}: ChemistrySimulation3DProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!canvasRef.current) return;

    import("three").then((THREE) => {
      initScene(THREE);
      setIsLoading(false);
    });
  }, []);

  const initScene = (THREE: any) => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    // Scene setup
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0xf5f7fa);
    const camera = new THREE.PerspectiveCamera(75, width / height, 0.1, 1000);
    camera.position.set(0, 2, 5);
    camera.lookAt(0, 0, 0);

    const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: false });
    renderer.setSize(width, height);
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.shadowMap.enabled = true;

    // Lighting - soft, professional studio setup
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.55);
    scene.add(ambientLight);

    const mainLight = new THREE.DirectionalLight(0xffffff, 0.7);
    mainLight.position.set(4, 6, 3);
    mainLight.castShadow = true;
    mainLight.shadow.mapSize.width = 2048;
    mainLight.shadow.mapSize.height = 2048;
    mainLight.shadow.camera.left = -8;
    mainLight.shadow.camera.right = 8;
    mainLight.shadow.camera.top = 8;
    mainLight.shadow.camera.bottom = -8;
    scene.add(mainLight);

    // Soft fill light
    const fillLight = new THREE.DirectionalLight(0xe8f0ff, 0.35);
    fillLight.position.set(-4, 4, -2);
    scene.add(fillLight);

    // Create stage/display base
    const stageGeometry = new THREE.CylinderGeometry(3, 3, 0.3, 64);
    const stageMaterial = new THREE.MeshStandardMaterial({
      color: 0xf0f1f3,
      metalness: 0.15,
      roughness: 0.6,
    });
    const stage = new THREE.Mesh(stageGeometry, stageMaterial);
    stage.position.y = -1.65;
    stage.castShadow = true;
    stage.receiveShadow = true;
    scene.add(stage);

    // Create beaker - refined glass material
    const beakerGroup = new THREE.Group();
    beakerGroup.position.set(0, 0, 0);

    // Beaker body
    const beakerGeometry = new THREE.CylinderGeometry(1.2, 1.4, 2.4, 64);
    const beakerMaterial = new THREE.MeshPhysicalMaterial({
      color: 0xd4e8f0,
      transmission: 0.6,
      opacity: 0.85,
      transparent: true,
      metalness: 0.05,
      roughness: 0.3,
      ior: 1.5,
    });
    const beaker = new THREE.Mesh(beakerGeometry, beakerMaterial);
    beaker.castShadow = true;
    beaker.receiveShadow = true;
    beakerGroup.add(beaker);

    // Beaker rim
    const rimGeometry = new THREE.TorusGeometry(1.2, 0.08, 16, 100);
    const rimMaterial = new THREE.MeshStandardMaterial({
      color: 0xb8c9d1,
      metalness: 0.3,
      roughness: 0.5,
    });
    const rim = new THREE.Mesh(rimGeometry, rimMaterial);
    rim.position.y = 1.25;
    rim.rotation.x = 0;
    rim.castShadow = true;
    rim.receiveShadow = true;
    beakerGroup.add(rim);

    // Solution - soft gradient
    const solutionGeometry = new THREE.CylinderGeometry(1.15, 1.35, 1.8, 64);
    const solutionMaterial = new THREE.MeshStandardMaterial({
      color: 0xb3dce8,
      metalness: 0.0,
      roughness: 0.3,
      opacity: 0.75,
      transparent: true,
    });
    const solution = new THREE.Mesh(solutionGeometry, solutionMaterial);
    solution.position.y = -0.2;
    solution.castShadow = true;
    solution.receiveShadow = true;
    beakerGroup.add(solution);

    // Solution surface effect
    const surfaceGeometry = new THREE.CircleGeometry(1.15, 64);
    const surfaceMaterial = new THREE.MeshStandardMaterial({
      color: 0xa8d5e8,
      metalness: 0.05,
      roughness: 0.4,
      side: THREE.DoubleSide,
    });
    const surface = new THREE.Mesh(surfaceGeometry, surfaceMaterial);
    surface.position.y = 0.8;
    surface.rotation.x = 0;
    surface.castShadow = false;
    surface.receiveShadow = true;
    beakerGroup.add(surface);

    scene.add(beakerGroup);

    // Metal electrode (electrode)
    const electrodeGroupRight = new THREE.Group();
    electrodeGroupRight.position.set(0.7, -0.4, 0);

    // Electrode body - refined metal material
    const electrodBodyGeometry = new THREE.CylinderGeometry(0.12, 0.12, 2.2, 16);
    const electrodeMaterial = new THREE.MeshStandardMaterial({
      color: 0x8b7d6b,
      metalness: 0.75,
      roughness: 0.25,
    });
    const electrodeBody = new THREE.Mesh(electrodBodyGeometry, electrodeMaterial);
    electrodeBody.castShadow = true;
    electrodeBody.receiveShadow = true;
    electrodeGroupRight.add(electrodeBody);

    scene.add(electrodeGroupRight);

    // Ions particles in solution
    const ionsGroup = new THREE.Group();
    const ionPositions: Array<{ pos: [number, number, number]; vel: [number, number, number] }> = [];

    for (let i = 0; i < 15; i++) {
      const ionGeometry = new THREE.SphereGeometry(0.06, 16, 16);
      const ionMaterial = new THREE.MeshStandardMaterial({
        color: 0x6bb6d4,
        emissive: 0x4a9cc4,
        emissiveIntensity: 0.15,
        metalness: 0.3,
        roughness: 0.4,
      });
      const ion = new THREE.Mesh(ionGeometry, ionMaterial);

      const x = (Math.random() - 0.5) * 2.2;
      const y = Math.random() * 1.6 - 1.2;
      const z = (Math.random() - 0.5) * 2;

      ion.position.set(x, y, z);
      ion.castShadow = true;
      ion.receiveShadow = true;
      ionsGroup.add(ion);

      ionPositions.push({
        pos: [x, y, z],
        vel: [(Math.random() - 0.5) * 0.02, (Math.random() - 0.5) * 0.01, (Math.random() - 0.5) * 0.02],
      });
    }
    scene.add(ionsGroup);

    // Deposited metal layer visualization - subtle
    const depositGeometry = new THREE.CylinderGeometry(0.115, 0.115, 0.15, 16);
    const depositMaterial = new THREE.MeshStandardMaterial({
      color: 0x9a8a7a,
      metalness: 0.6,
      roughness: 0.35,
    });
    const deposit = new THREE.Mesh(depositGeometry, depositMaterial);
    deposit.position.set(0.7, -1.3, 0);
    deposit.castShadow = true;
    deposit.receiveShadow = true;
    scene.add(deposit);

    // Animation loop
    let animationId: number;
    let time = 0;

    const animate = () => {
      time += 0.01;

      // Animate ions
      ionsGroup.children.forEach((ion: Object3D, i: number) => {
        const pos = ionPositions[i];
        if (pos) {
          ion.position.x += pos.vel[0];
          ion.position.y += pos.vel[1];
          ion.position.z += pos.vel[2];

          // Bounce at boundaries
          if (Math.abs(ion.position.x) > 1.2) pos.vel[0] *= -1;
          if (ion.position.y > 0.8 || ion.position.y < -1.3) pos.vel[1] *= -1;
          if (Math.abs(ion.position.z) > 1.1) pos.vel[2] *= -1;

          // Gentle floating motion
          ion.position.y += Math.sin(time * 0.5 + i) * 0.002;
        }
      });

      // Solution gentle wave effect (via material)
      if (solution.material instanceof THREE.Material) {
        solution.material.opacity = 0.75 + Math.sin(time * 0.3) * 0.05;
      }

      // Electrode subtle glow
      if (electrodeBody.material instanceof THREE.Material) {
        electrodeBody.material.emissiveIntensity = 0.1 + Math.sin(time * 0.2) * 0.05;
      }

      renderer.render(scene, camera);
      animationId = requestAnimationFrame(animate);
    };

    animate();

    // Handle window resize
    const handleResize = () => {
      const newWidth = containerRef.current?.clientWidth || width;
      const newHeight = containerRef.current?.clientHeight || height;
      camera.aspect = newWidth / newHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(newWidth, newHeight);
    };

    window.addEventListener("resize", handleResize);

    return () => {
      cancelAnimationFrame(animationId);
      window.removeEventListener("resize", handleResize);
      renderer.dispose();
    };
  };

  return (
    <div
      ref={containerRef}
      style={{
        position: "relative",
        width: "100%",
        maxWidth: `${width}px`,
        margin: "0 auto",
        borderRadius: "20px",
        overflow: "hidden",
        boxShadow: "0 12px 40px rgba(0,20,40,0.12)",
        backgroundColor: "#f5f7fa",
      }}
    >
      <canvas
        ref={canvasRef}
        style={{
          display: "block",
          width: "100%",
          height: "auto",
          minHeight: `${height}px`,
        }}
      />

      {isLoading && (
        <div
          style={{
            position: "absolute",
            inset: 0,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            background: "linear-gradient(135deg, rgba(245,247,250,0.95), rgba(227,239,247,0.95))",
            backdropFilter: "blur(4px)",
          }}
        >
          <div style={{ textAlign: "center" }}>
            <div
              style={{
                fontSize: "14px",
                fontWeight: "700",
                color: "#5ba3d0",
                marginBottom: "8px",
                letterSpacing: "0.05em",
              }}
            >
              ⏳ ĐANG TẢI MÔ PHỎNG...
            </div>
            <div
              style={{
                width: "32px",
                height: "32px",
                border: "3px solid rgba(91,163,208,0.2)",
                borderTop: "3px solid #5ba3d0",
                borderRadius: "50%",
                animation: "spin 1s linear infinite",
                margin: "0 auto",
              }}
            />
          </div>
        </div>
      )}

      {/* UI Overlay */}
      <div
        style={{
          position: "absolute",
          top: "16px",
          left: "16px",
          right: "16px",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          zIndex: 10,
        }}
      >
        <div
          style={{
            background: "rgba(255,255,255,0.85)",
            backdropFilter: "blur(8px)",
            border: "1px solid rgba(91,163,208,0.2)",
            borderRadius: "12px",
            padding: "8px 16px",
            fontSize: "12px",
            fontWeight: "700",
            color: "#2a4a5f",
            letterSpacing: "0.05em",
            textTransform: "uppercase",
          }}
        >
          Mô Phỏng Three.js 3D
        </div>

        {/* Legend */}
        <div
          style={{
            display: "flex",
            gap: "16px",
            background: "rgba(255,255,255,0.85)",
            backdropFilter: "blur(8px)",
            border: "1px solid rgba(91,163,208,0.2)",
            borderRadius: "12px",
            padding: "10px 16px",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
            <div
              style={{
                width: "12px",
                height: "12px",
                borderRadius: "50%",
                background: "#b3dce8",
                border: "1px solid #7eb8d4",
              }}
            />
            <span style={{ fontSize: "11px", fontWeight: "600", color: "#2a4a5f" }}>
              Dung dịch
            </span>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
            <div
              style={{
                width: "12px",
                height: "12px",
                borderRadius: "50%",
                background: "#6bb6d4",
              }}
            />
            <span style={{ fontSize: "11px", fontWeight: "600", color: "#2a4a5f" }}>
              Ion
            </span>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
            <div
              style={{
                width: "12px",
                height: "12px",
                borderRadius: "2px",
                background: "#8b7d6b",
              }}
            />
            <span style={{ fontSize: "11px", fontWeight: "600", color: "#2a4a5f" }}>
              Kim loại bám
            </span>
          </div>
        </div>
      </div>

      {/* Instruction */}
      <div
        style={{
          position: "absolute",
          bottom: "16px",
          left: "50%",
          transform: "translateX(-50%)",
          zIndex: 10,
        }}
      >
        <div
          style={{
            background: "rgba(255,255,255,0.90)",
            backdropFilter: "blur(10px)",
            border: "1px solid rgba(91,163,208,0.3)",
            borderRadius: "10px",
            padding: "10px 16px",
            fontSize: "12px",
            fontWeight: "600",
            color: "#2a4a5f",
            textAlign: "center",
            display: "flex",
            alignItems: "center",
            gap: "8px",
          }}
        >
          <span>👆</span>
          <span>Kéo để xoay và quan sát mô hình</span>
        </div>
      </div>

      <style>{`
        @keyframes spin {
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
}
