"use client";

import { useEffect, useRef, useState } from "react";

interface AtomicModelProps {
  element: {
    symbol: string;
    number: number;
    name: string;
  };
  isVisible: boolean;
}

export default function AtomicModel3D({ element, isVisible }: AtomicModelProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const sceneRef = useRef<any>(null);
  const animationIdRef = useRef<number | null>(null);

  useEffect(() => {
    if (!isVisible || !canvasRef.current) return;

    // Lazy load Three.js only when needed
    import("three").then(({ Scene, PerspectiveCamera, WebGLRenderer, SphereGeometry, MeshPhongMaterial, Mesh, AmbientLight, PointLight, BufferGeometry, BufferAttribute, Points, PointsMaterial }) => {
      const canvas = canvasRef.current!;
      const container = containerRef.current!;

      // Get container dimensions
      const width = container.clientWidth;
      const height = container.clientHeight;

      // Scene setup
      const scene = new Scene();
      sceneRef.current = scene;

      const camera = new PerspectiveCamera(75, width / height, 0.1, 1000);
      camera.position.z = 3;

      const renderer = new WebGLRenderer({ canvas, antialias: true, alpha: true });
      renderer.setSize(width, height);
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
      renderer.setClearColor(0x000000, 0);

      // Nucleus
      const nucleusGeometry = new SphereGeometry(0.4, 32, 32);
      const nucleusMaterial = new MeshPhongMaterial({ color: 0xff6b6b });
      const nucleus = new Mesh(nucleusGeometry, nucleusMaterial);
      scene.add(nucleus);

      // Electron shells (simplified visualization)
      const electronData = [
        { radius: 1.2, count: Math.min(element.number, 2), color: 0x4ecdc4 },
        { radius: 2.0, count: Math.min(Math.max(element.number - 2, 0), 8), color: 0x44af69 },
        { radius: 2.8, count: Math.min(Math.max(element.number - 10, 0), 8), color: 0xf7b801 },
      ];

      electronData.forEach((shellData) => {
        const positions = new Float32Array(shellData.count * 3);
        for (let i = 0; i < shellData.count; i++) {
          const angle = (i / shellData.count) * Math.PI * 2;
          positions[i * 3] = Math.cos(angle) * shellData.radius;
          positions[i * 3 + 1] = Math.sin(angle) * shellData.radius;
          positions[i * 3 + 2] = (Math.random() - 0.5) * 0.5;
        }

        const geometry = new BufferGeometry();
        geometry.setAttribute("position", new BufferAttribute(positions, 3));
        const material = new PointsMaterial({ color: shellData.color, size: 0.15 });
        const points = new Points(geometry, material);
        scene.add(points);
      });

      // Lighting
      const ambientLight = new AmbientLight(0xffffff, 0.6);
      scene.add(ambientLight);

      const pointLight = new PointLight(0xffffff, 0.8);
      pointLight.position.set(5, 5, 5);
      scene.add(pointLight);

      // Animation loop
      let rotationX = 0;
      let rotationY = 0;
      let targetRotationX = 0;
      let targetRotationY = 0;

      const animate = () => {
        animationIdRef.current = requestAnimationFrame(animate);

        // Smooth rotation
        rotationX += (targetRotationX - rotationX) * 0.05;
        rotationY += (targetRotationY - rotationY) * 0.05;

        nucleus.rotation.x = rotationX;
        nucleus.rotation.y = rotationY;

        scene.children.forEach((child) => {
          if (child !== nucleus) {
            child.rotation.x = rotationX;
            child.rotation.y = rotationY;
          }
        });

        renderer.render(scene, camera);
      };

      animate();

      // Mouse interaction
      const onMouseMove = (e: MouseEvent) => {
        const rect = canvas.getBoundingClientRect();
        const x = (e.clientX - rect.left) / rect.width;
        const y = (e.clientY - rect.top) / rect.height;

        targetRotationX = (y - 0.5) * Math.PI * 0.5;
        targetRotationY = (x - 0.5) * Math.PI * 0.5;
      };

      canvas.addEventListener("mousemove", onMouseMove);

      // Handle resize
      const handleResize = () => {
        const newWidth = container.clientWidth;
        const newHeight = container.clientHeight;

        if (newWidth > 0 && newHeight > 0) {
          camera.aspect = newWidth / newHeight;
          camera.updateProjectionMatrix();
          renderer.setSize(newWidth, newHeight);
        }
      };

      window.addEventListener("resize", handleResize);

      return () => {
        window.removeEventListener("resize", handleResize);
        canvas.removeEventListener("mousemove", onMouseMove);
        if (animationIdRef.current) cancelAnimationFrame(animationIdRef.current);
      };
    });

    return () => {
      if (animationIdRef.current) {
        cancelAnimationFrame(animationIdRef.current);
      }
    };
  }, [isVisible, element.number]);

  return (
    <div
      ref={containerRef}
      style={{
        width: "100%",
        height: "100%",
        position: "relative",
        overflow: "hidden",
        borderRadius: "12px",
        background: "linear-gradient(135deg, rgba(20,20,40,0.6), rgba(30,30,60,0.4))",
      }}
    >
      <canvas
        ref={canvasRef}
        style={{
          display: "block",
          width: "100%",
          height: "100%",
        }}
      />
      <div
        style={{
          position: "absolute",
          bottom: "12px",
          left: "12px",
          fontSize: "12px",
          color: "#99bbdd",
          pointerEvents: "none",
          fontWeight: "700",
        }}
      >
        🖱️ Drag to rotate
      </div>
    </div>
  );
}
