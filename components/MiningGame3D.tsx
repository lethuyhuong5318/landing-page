"use client";

import { useEffect, useRef, useState } from "react";

interface Crystal {
  id: number;
  symbol: string;
  name: string;
  color: string;
  x: number;
  y: number;
  z: number;
  collected: boolean;
  mesh?: any;
}

interface GameState {
  score: number;
  combo: number;
  timeElapsed: number;
  collected: number;
  total: number;
  accuracy: number;
  gameStatus: "playing" | "completed" | "paused";
}

interface MiningGame3DProps {
  width?: number;
  height?: number;
  difficulty?: "easy" | "normal" | "hard";
  onGameComplete?: (stats: GameState) => void;
}

const ELEMENT_DATA = [
  { symbol: "Mg", name: "Magiê", color: "#00D9FF", valence: "2+" },
  { symbol: "Al", name: "Nhôm", color: "#9D4EDD", valence: "3+" },
  { symbol: "Ag", name: "Bạc", color: "#5BA3D0", valence: "1+" },
  { symbol: "Cl", name: "Clo", color: "#00E5FF", valence: "1-" },
  { symbol: "K", name: "Kali", color: "#0066CC", valence: "1+" },
  { symbol: "Na", name: "Natri", color: "#FFB700", valence: "1+" },
  { symbol: "Ca", name: "Canxi", color: "#A8D5FF", valence: "2+" },
  { symbol: "Fe", name: "Sắt", color: "#FF6B6B", valence: "3+" },
];

export default function MiningGame3D({
  width = 900,
  height = 600,
  difficulty = "normal",
  onGameComplete,
}: MiningGame3DProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const sceneRef = useRef<any>(null);
  const rendererRef = useRef<any>(null);
  const cameraRef = useRef<any>(null);
  const crystalsRef = useRef<Crystal[]>([]);
  const gameStateRef = useRef<GameState>({
    score: 0,
    combo: 0,
    timeElapsed: 0,
    collected: 0,
    total: 6,
    accuracy: 100,
    gameStatus: "playing",
  });
  const [gameState, setGameState] = useState<GameState>(gameStateRef.current);
  const [message, setMessage] = useState("");
  const hookPositionRef = useRef({ x: 0, y: 2, z: 0 });
  const hookStateRef = useRef({ isMoving: false, targetY: 2 });
  const animationIdRef = useRef<number>();
  const startTimeRef = useRef<number>(Date.now());

  useEffect(() => {
    if (typeof window === "undefined" || !containerRef.current) return;

    // Dynamically import Three.js
    import("three").then((THREE) => {
      initializeScene(THREE);
    });

    return () => {
      if (animationIdRef.current) {
        cancelAnimationFrame(animationIdRef.current);
      }
      if (rendererRef.current && containerRef.current) {
        containerRef.current.removeChild(rendererRef.current.domElement);
      }
    };
  }, []);

  const initializeScene = (THREE: any) => {
    // Scene setup
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x0a1f2e);
    scene.fog = new THREE.Fog(0x0a1f2e, 20, 50);
    sceneRef.current = scene;

    // Camera
    const camera = new THREE.PerspectiveCamera(75, width / height, 0.1, 1000);
    camera.position.set(0, 3, 8);
    camera.lookAt(0, 2, 0);
    cameraRef.current = camera;

    // Renderer
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: false });
    renderer.setSize(width, height);
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.shadowMap.enabled = true;
    rendererRef.current = renderer;

    if (containerRef.current) {
      containerRef.current.appendChild(renderer.domElement);
    }

    // Lighting
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
    scene.add(ambientLight);

    const mainLight = new THREE.DirectionalLight(0xffffff, 0.8);
    mainLight.position.set(5, 8, 5);
    mainLight.castShadow = true;
    mainLight.shadow.mapSize.width = 2048;
    mainLight.shadow.mapSize.height = 2048;
    scene.add(mainLight);

    const spotLight1 = new THREE.SpotLight(0x00d9ff, 0.6);
    spotLight1.position.set(-5, 5, 0);
    spotLight1.castShadow = true;
    scene.add(spotLight1);

    const spotLight2 = new THREE.SpotLight(0x9d4edd, 0.4);
    spotLight2.position.set(5, 5, -5);
    spotLight2.castShadow = true;
    scene.add(spotLight2);

    // Mining environment
    createMiningEnvironment(THREE, scene);

    // Crane/Excavator
    createCrane(THREE, scene);

    // Hook
    createHook(THREE, scene);

    // Crystals
    createCrystals(THREE, scene);

    // Mouse interaction
    const raycaster = new THREE.Raycaster();
    const mouse = new THREE.Vector2();

    const handleMouseClick = (event: MouseEvent) => {
      if (!containerRef.current || gameStateRef.current.gameStatus !== "playing")
        return;

      const rect = (renderer.domElement as HTMLCanvasElement).getBoundingClientRect();
      mouse.x = ((event.clientX - rect.left) / width) * 2 - 1;
      mouse.y = -((event.clientY - rect.top) / height) * 2 + 1;

      raycaster.setFromCamera(mouse, camera);
      const intersects = raycaster.intersectObjects(
        crystalsRef.current.map((c) => c.mesh).filter(Boolean)
      );

      if (intersects.length > 0) {
        const hitCrystal = crystalsRef.current.find(
          (c) => c.mesh === intersects[0].object
        );
        if (hitCrystal && !hitCrystal.collected) {
          collectCrystal(hitCrystal, THREE, scene);
        }
      }
    };

    const handleKeyPress = (event: KeyboardEvent) => {
      if (event.code === "Space" && gameStateRef.current.gameStatus === "playing") {
        event.preventDefault();
        if (!hookStateRef.current.isMoving) {
          hookStateRef.current.isMoving = true;
          hookStateRef.current.targetY = 0.5;
        }
      }
    };

    renderer.domElement.addEventListener("click", handleMouseClick);
    window.addEventListener("keydown", handleKeyPress);

    // Animation loop
    const animate = () => {
      animationIdRef.current = requestAnimationFrame(animate);

      // Update game state
      if (gameStateRef.current.gameStatus === "playing") {
        gameStateRef.current.timeElapsed = Math.floor(
          (Date.now() - startTimeRef.current) / 1000
        );
      }

      // Animate hook
      if (hookStateRef.current.isMoving) {
        const hookMesh = scene.getObjectByName("hook");
        if (hookMesh) {
          hookMesh.position.y += (hookStateRef.current.targetY - hookMesh.position.y) * 0.15;

          if (Math.abs(hookMesh.position.y - hookStateRef.current.targetY) < 0.1) {
            if (hookStateRef.current.targetY < 1) {
              hookStateRef.current.targetY = 2;
            } else {
              hookStateRef.current.isMoving = false;
            }
          }
        }
      }

      // Animate crystals
      crystalsRef.current.forEach((crystal) => {
        if (crystal.mesh && !crystal.collected) {
          crystal.mesh.rotation.x += 0.005;
          crystal.mesh.rotation.y += 0.008;
          crystal.mesh.position.y += Math.sin(Date.now() * 0.001 + crystal.id) * 0.002;
        }
      });

      // Update UI
      setGameState({ ...gameStateRef.current });

      renderer.render(scene, camera);
    };

    animate();

    // Cleanup
    return () => {
      renderer.domElement.removeEventListener("click", handleMouseClick);
      window.removeEventListener("keydown", handleKeyPress);
    };
  };

  const createMiningEnvironment = (THREE: any, scene: any) => {
    // Floor/ground
    const floorGeometry = new THREE.PlaneGeometry(20, 15);
    const floorMaterial = new THREE.MeshStandardMaterial({
      color: 0x2a2a2a,
      roughness: 0.8,
      metalness: 0.1,
    });
    const floor = new THREE.Mesh(floorGeometry, floorMaterial);
    floor.rotation.x = -Math.PI / 2;
    floor.position.y = 0;
    floor.receiveShadow = true;
    scene.add(floor);

    // Cave walls
    const wallGeometry = new THREE.BoxGeometry(20, 10, 0.5);
    const wallMaterial = new THREE.MeshStandardMaterial({
      color: 0x1a1a1a,
      roughness: 0.9,
    });
    const backWall = new THREE.Mesh(wallGeometry, wallMaterial);
    backWall.position.z = -8;
    backWall.position.y = 4;
    backWall.receiveShadow = true;
    scene.add(backWall);

    // Rock formations
    for (let i = 0; i < 15; i++) {
      const rockSize = Math.random() * 0.4 + 0.2;
      const rockGeometry = new THREE.IcosahedronGeometry(rockSize, 2);
      const rockMaterial = new THREE.MeshStandardMaterial({
        color: new THREE.Color().setHSL(0, 0, Math.random() * 0.3 + 0.1),
        roughness: 0.95,
      });
      const rock = new THREE.Mesh(rockGeometry, rockMaterial);
      rock.position.set(
        Math.random() * 16 - 8,
        Math.random() * 3,
        Math.random() * 5 - 2.5
      );
      rock.castShadow = true;
      rock.receiveShadow = true;
      scene.add(rock);
    }
  };

  const createCrane = (THREE: any, scene: any) => {
    const craneGroup = new THREE.Group();

    // Base
    const baseGeometry = new THREE.BoxGeometry(3, 0.3, 2);
    const baseMaterial = new THREE.MeshStandardMaterial({
      color: 0x333333,
      metalness: 0.6,
    });
    const base = new THREE.Mesh(baseGeometry, baseMaterial);
    base.position.y = 0;
    base.castShadow = true;
    base.receiveShadow = true;
    craneGroup.add(base);

    // Vertical support
    const supportGeometry = new THREE.BoxGeometry(0.2, 3, 0.2);
    const supportMaterial = new THREE.MeshStandardMaterial({
      color: 0xffc107,
      metalness: 0.7,
    });
    const support = new THREE.Mesh(supportGeometry, supportMaterial);
    support.position.y = 1.5;
    support.castShadow = true;
    support.receiveShadow = true;
    craneGroup.add(support);

    // Boom arm
    const boomGeometry = new THREE.BoxGeometry(4, 0.15, 0.15);
    const boomMaterial = new THREE.MeshStandardMaterial({
      color: 0xffc107,
      metalness: 0.8,
    });
    const boom = new THREE.Mesh(boomGeometry, boomMaterial);
    boom.position.set(0, 3, 0);
    boom.castShadow = true;
    boom.receiveShadow = true;
    craneGroup.add(boom);

    // Cable
    const cableGeometry = new THREE.BufferGeometry();
    const cablePositions = new Float32Array([0, 3, 0, 0, 0.5, 0]);
    cableGeometry.setAttribute("position", new THREE.BufferAttribute(cablePositions, 3));
    const cableMaterial = new THREE.LineBasicMaterial({
      color: 0xffffff,
      linewidth: 2,
    });
    const cable = new THREE.Line(cableGeometry, cableMaterial);
    cable.name = "cable";
    craneGroup.add(cable);

    craneGroup.position.set(0, 0, 2);
    scene.add(craneGroup);
  };

  const createHook = (THREE: any, scene: any) => {
    const hookGroup = new THREE.Group();
    hookGroup.name = "hook";
    hookGroup.position.set(0, 2, 0);

    // Hook shape
    const hookGeometry = new THREE.TorusGeometry(0.15, 0.05, 8, 16, Math.PI);
    const hookMaterial = new THREE.MeshStandardMaterial({
      color: 0xcccccc,
      metalness: 0.9,
      roughness: 0.1,
    });
    const hookMesh = new THREE.Mesh(hookGeometry, hookMaterial);
    hookMesh.rotation.z = Math.PI / 2;
    hookMesh.castShadow = true;
    hookMesh.receiveShadow = true;
    hookGroup.add(hookMesh);

    // Hook eye
    const eyeGeometry = new THREE.SphereGeometry(0.06, 8, 8);
    const eyeMesh = new THREE.Mesh(eyeGeometry, hookMaterial);
    eyeMesh.position.y = 0.15;
    eyeMesh.castShadow = true;
    eyeMesh.receiveShadow = true;
    hookGroup.add(eyeMesh);

    scene.add(hookGroup);
  };

  const createCrystals = (THREE: any, scene: any) => {
    const numCrystals = 6;
    const elements = ELEMENT_DATA.slice(0, numCrystals);

    elements.forEach((element, index) => {
      const crystal: Crystal = {
        id: index,
        symbol: element.symbol,
        name: element.name,
        color: element.color,
        x: Math.random() * 12 - 6,
        y: Math.random() * 2 + 0.5,
        z: Math.random() * 3 - 1.5,
        collected: false,
      };

      // Create faceted crystal geometry
      const geometry = new THREE.IcosahedronGeometry(0.35, 4);
      const material = new THREE.MeshStandardMaterial({
        color: new THREE.Color(element.color),
        metalness: 0.3,
        roughness: 0.4,
        emissive: new THREE.Color(element.color),
        emissiveIntensity: 0.2,
      });

      const mesh = new THREE.Mesh(geometry, material);
      mesh.position.set(crystal.x, crystal.y, crystal.z);
      mesh.castShadow = true;
      mesh.receiveShadow = true;
      scene.add(mesh);

      crystal.mesh = mesh;
      crystalsRef.current.push(crystal);
    });

    gameStateRef.current.total = numCrystals;
  };

  const collectCrystal = (crystal: Crystal, THREE: any, scene: any) => {
    if (crystal.collected) return;

    crystal.collected = true;
    gameStateRef.current.score += 10 + gameStateRef.current.combo * 2;
    gameStateRef.current.combo += 1;
    gameStateRef.current.collected += 1;
    gameStateRef.current.accuracy = Math.round(
      (gameStateRef.current.collected / gameStateRef.current.total) * 100
    );

    // Remove crystal mesh
    if (crystal.mesh) {
      scene.remove(crystal.mesh);
    }

    // Particle effect
    createCollectionEffect(THREE, scene, crystal);

    // Show feedback message
    setMessage(`+${10 + (gameStateRef.current.combo - 1) * 2} điểm! Combo x${gameStateRef.current.combo}`);
    setTimeout(() => setMessage(""), 1500);

    // Check if game complete
    if (gameStateRef.current.collected === gameStateRef.current.total) {
      gameStateRef.current.gameStatus = "completed";
      if (onGameComplete) {
        onGameComplete(gameStateRef.current);
      }
    }

    setGameState({ ...gameStateRef.current });
  };

  const createCollectionEffect = (THREE: any, scene: any, crystal: Crystal) => {
    for (let i = 0; i < 20; i++) {
      const particleGeometry = new THREE.SphereGeometry(0.05, 4, 4);
      const particleMaterial = new THREE.MeshStandardMaterial({
        color: new THREE.Color(crystal.color),
        emissive: new THREE.Color(crystal.color),
        emissiveIntensity: 0.8,
      });
      const particle = new THREE.Mesh(particleGeometry, particleMaterial);

      const angle = Math.random() * Math.PI * 2;
      const speed = Math.random() * 3 + 2;
      particle.position.copy(crystal.mesh.position);

      const velocity = {
        x: Math.cos(angle) * speed,
        y: Math.random() * 2 + 1,
        z: Math.sin(angle) * speed,
      };

      scene.add(particle);

      const startTime = Date.now();
      const lifespan = 500;

      const updateParticle = () => {
        const elapsed = Date.now() - startTime;
        const progress = elapsed / lifespan;

        if (progress > 1) {
          scene.remove(particle);
          return;
        }

        particle.position.x += velocity.x * 0.05;
        particle.position.y += velocity.y * 0.05 - progress * 0.05;
        particle.position.z += velocity.z * 0.05;
        particle.material.opacity = 1 - progress;

        requestAnimationFrame(updateParticle);
      };

      updateParticle();
    }
  };

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        width: "100%",
        maxWidth: `${width}px`,
        margin: "0 auto",
        borderRadius: "16px",
        overflow: "hidden",
        boxShadow: "0 20px 60px rgba(0,10,20,0.4)",
        backgroundColor: "#0a1f2e",
      }}
    >
      {/* HUD */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(120px, 1fr))",
          gap: "12px",
          padding: "16px",
          background: "linear-gradient(135deg, rgba(0,217,255,0.1), rgba(157,78,221,0.1))",
          borderBottom: "1px solid rgba(0,217,255,0.2)",
        }}
      >
        <div style={{ textAlign: "center" }}>
          <div
            style={{
              fontSize: "11px",
              fontWeight: "900",
              color: "#00d9ff",
              textTransform: "uppercase",
              letterSpacing: "0.1em",
              marginBottom: "4px",
            }}
          >
            Điểm
          </div>
          <div style={{ fontSize: "24px", fontWeight: "800", color: "#fff" }}>
            {gameState.score}
          </div>
        </div>

        <div style={{ textAlign: "center" }}>
          <div
            style={{
              fontSize: "11px",
              fontWeight: "900",
              color: "#9d4edd",
              textTransform: "uppercase",
              letterSpacing: "0.1em",
              marginBottom: "4px",
            }}
          >
            Combo
          </div>
          <div style={{ fontSize: "24px", fontWeight: "800", color: "#9d4edd" }}>
            {gameState.combo}x
          </div>
        </div>

        <div style={{ textAlign: "center" }}>
          <div
            style={{
              fontSize: "11px",
              fontWeight: "900",
              color: "#00e5ff",
              textTransform: "uppercase",
              letterSpacing: "0.1em",
              marginBottom: "4px",
            }}
          >
            Tiến độ
          </div>
          <div style={{ fontSize: "24px", fontWeight: "800", color: "#fff" }}>
            {gameState.collected}/{gameState.total}
          </div>
        </div>

        <div style={{ textAlign: "center" }}>
          <div
            style={{
              fontSize: "11px",
              fontWeight: "900",
              color: "#ffb700",
              textTransform: "uppercase",
              letterSpacing: "0.1em",
              marginBottom: "4px",
            }}
          >
            Thời gian
          </div>
          <div style={{ fontSize: "24px", fontWeight: "800", color: "#fff" }}>
            {gameState.timeElapsed}s
          </div>
        </div>
      </div>

      {/* Game Canvas */}
      <div ref={containerRef} style={{ position: "relative", background: "#0a1f2e" }} />

      {/* Instruction & Message */}
      <div
        style={{
          position: "absolute",
          bottom: "30px",
          left: "50%",
          transform: "translateX(-50%)",
          textAlign: "center",
          zIndex: 10,
        }}
      >
        {message ? (
          <div
            style={{
              fontSize: "16px",
              fontWeight: "800",
              color: "#00ff88",
              textShadow: "0 0 10px rgba(0,255,136,0.5)",
              marginBottom: "12px",
            }}
          >
            {message}
          </div>
        ) : null}

        <div
          style={{
            padding: "12px 20px",
            background: "rgba(10,31,46,0.85)",
            border: "1px solid rgba(0,217,255,0.3)",
            borderRadius: "12px",
            backdropFilter: "blur(10px)",
            color: "#fff",
            fontSize: "13px",
            fontWeight: "700",
          }}
        >
          {gameState.gameStatus === "completed" ? (
            <div>
              ✨ Hoàn thành! Độ chính xác: {gameState.accuracy}%
            </div>
          ) : (
            <div>
              <div style={{ marginBottom: "4px" }}>🖱️ Bấm hoặc SPACE để thả móc</div>
              <div style={{ fontSize: "11px", opacity: 0.7 }}>
                Thu thập tất cả nguyên tố để hoàn thành
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
