(() => {
  const canvas = document.getElementById('disp3dCanvas');
  const metalSelect = document.getElementById('dispMetal');
  const saltSelect = document.getElementById('dispSalt');
  if (!canvas || !metalSelect || !saltSelect || !window.THREE) return;

  const reduced = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const saltCations = { CuSO4: 'Cu', AgNO3: 'Ag', FeSO4: 'Fe', ZnSO4: 'Zn', MgSO4: 'Mg' };
  const series3d = ['K', 'Na', 'Ba', 'Ca', 'Mg', 'Al', 'Zn', 'Fe', 'Ni', 'Sn', 'Pb', 'H', 'Cu', 'Hg', 'Ag', 'Pt', 'Au'];
  const metalColors = { Mg: 0xbfc8ce, Al: 0xdce4e8, Zn: 0xaeb9c0, Fe: 0x7a858c, Cu: 0xb96b35, Ag: 0xdde4ea };
  const solutionColors = { Cu: 0x36a7e2, Ag: 0xd8edfa, Fe: 0x9ac879, Zn: 0xd8edf8, Mg: 0xdceefa, Al: 0xdceefa };

  let renderer;
  try {
    renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true, powerPreference: 'high-performance' });
  } catch {
    canvas.parentElement.innerHTML = '<p class="note">Thiết bị chưa hỗ trợ WebGL để hiển thị mô phỏng 3D.</p>';
    return;
  }
  renderer.setPixelRatio(Math.min(devicePixelRatio || 1, 1.65));
  renderer.setClearColor(0x000000, 0);

  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(34, 1, .1, 100);
  camera.position.set(5.8, 3.7, 8.2);
  camera.lookAt(0, .15, 0);

  scene.add(new THREE.HemisphereLight(0xffffff, 0x7696ab, 1.45));
  const key = new THREE.DirectionalLight(0xffffff, 1.55);
  key.position.set(5, 8, 7);
  scene.add(key);
  const rim = new THREE.DirectionalLight(0x78c9ff, .8);
  rim.position.set(-6, 2, 4);
  scene.add(rim);

  const lab = new THREE.Group();
  lab.rotation.y = -.32;
  scene.add(lab);

  const bench = new THREE.Mesh(
    new THREE.CylinderGeometry(3.6, 3.6, .22, 64),
    new THREE.MeshPhongMaterial({ color: 0xe8eef2, shininess: 35 })
  );
  bench.position.y = -1.75;
  lab.add(bench);

  const glassProfile = [
    new THREE.Vector2(.95, -1.48), new THREE.Vector2(1.42, -1.32),
    new THREE.Vector2(1.53, -.98), new THREE.Vector2(.62, .95),
    new THREE.Vector2(.55, 1.35), new THREE.Vector2(.55, 1.82)
  ];
  const glass = new THREE.Mesh(
    new THREE.LatheGeometry(glassProfile, 64),
    new THREE.MeshPhongMaterial({
      color: 0xd8f1ff, transparent: true, opacity: .22, shininess: 120,
      specular: 0xffffff, side: THREE.DoubleSide, depthWrite: false
    })
  );
  lab.add(glass);

  const neckRing = new THREE.Mesh(
    new THREE.TorusGeometry(.56, .035, 10, 64),
    new THREE.MeshPhongMaterial({ color: 0x91b8cc, transparent: true, opacity: .75, shininess: 100 })
  );
  neckRing.rotation.x = Math.PI / 2;
  neckRing.position.y = 1.82;
  lab.add(neckRing);

  const liquidMaterial = new THREE.MeshPhongMaterial({
    color: solutionColors.Cu, transparent: true, opacity: .68, shininess: 95, specular: 0xcaf2ff
  });
  const liquid = new THREE.Mesh(new THREE.CylinderGeometry(1.27, 1.42, 1.42, 64), liquidMaterial);
  liquid.position.y = -1.0;
  lab.add(liquid);
  const surface = new THREE.Mesh(
    new THREE.CircleGeometry(1.27, 64),
    new THREE.MeshPhongMaterial({ color: solutionColors.Cu, transparent: true, opacity: .78, side: THREE.DoubleSide, shininess: 100 })
  );
  surface.rotation.x = -Math.PI / 2;
  surface.position.y = -.285;
  lab.add(surface);

  const stripMaterial = new THREE.MeshStandardMaterial({ color: metalColors.Fe, metalness: .82, roughness: .24 });
  const strip = new THREE.Mesh(new THREE.BoxGeometry(.34, 3.05, .13), stripMaterial);
  strip.position.set(0, 2.45, 0);
  lab.add(strip);
  const holder = new THREE.Mesh(
    new THREE.BoxGeometry(1.05, .16, .45),
    new THREE.MeshPhongMaterial({ color: 0x163f5a, shininess: 65 })
  );
  holder.position.set(0, 2.96, 0);
  lab.add(holder);

  const ions = [];
  const ionGeometry = new THREE.SphereGeometry(.055, 12, 9);
  for (let i = 0; i < 34; i++) {
    const material = new THREE.MeshPhongMaterial({
      color: i % 2 ? 0x62c2f2 : 0xb8e8ff, transparent: true, opacity: .7, shininess: 70
    });
    const ion = new THREE.Mesh(ionGeometry, material);
    const angle = i * 2.399963;
    const radius = .22 + ((i * 31) % 92) / 100;
    ion.position.set(Math.cos(angle) * radius, -1.5 + ((i * 47) % 112) / 100, Math.sin(angle) * radius);
    ion.userData = { baseY: ion.position.y, phase: i * .63, speed: .4 + (i % 5) * .09 };
    ions.push(ion);
    lab.add(ion);
  }

  const deposits = new THREE.Group();
  lab.add(deposits);
  const depositGeometry = new THREE.IcosahedronGeometry(.085, 1);
  for (let i = 0; i < 46; i++) {
    const particle = new THREE.Mesh(
      depositGeometry,
      new THREE.MeshStandardMaterial({ color: metalColors.Cu, metalness: .72, roughness: .42 })
    );
    const side = i % 2 ? 1 : -1;
    particle.position.set(side * (.2 + (i % 3) * .014), -1.22 + (i * .057) % 1.72, ((i * 37) % 18 - 9) / 100);
    particle.scale.setScalar(.001);
    particle.userData.delay = i / 46;
    deposits.add(particle);
  }

  const state = { progress: 0, target: 0, reacting: false, yaw: -.32, pitch: 0, drag: false, x: 0, y: 0 };

  function selection() {
    const metal = metalSelect.value;
    const cation = saltCations[saltSelect.value];
    const metalIndex = series3d.indexOf(metal);
    const cationIndex = series3d.indexOf(cation);
    return { metal, cation, reacts: metal !== cation && metalIndex >= 0 && cationIndex >= 0 && metalIndex < cationIndex };
  }

  function setSelection(resetStrip = true) {
    const current = selection();
    stripMaterial.color.setHex(metalColors[current.metal] || 0x9aa4b2);
    liquidMaterial.color.setHex(solutionColors[current.cation] || 0xdceefa);
    surface.material.color.setHex(solutionColors[current.cation] || 0xdceefa);
    deposits.children.forEach(particle => {
      particle.material.color.setHex(metalColors[current.cation] || 0xb96b35);
      particle.scale.setScalar(.001);
    });
    state.reacting = false;
    state.progress = 0;
    state.target = resetStrip ? 0 : state.target;
    if (resetStrip) strip.position.y = 2.45;
  }

  function play() {
    const current = selection();
    state.reacting = current.reacts;
    state.target = 1;
    if (current.reacts) {
      liquidMaterial.color.setHex(solutionColors[current.metal] || 0xdceefa);
      surface.material.color.setHex(solutionColors[current.metal] || 0xdceefa);
    }
  }

  function resize() {
    const rect = canvas.getBoundingClientRect();
    const width = Math.max(260, Math.round(rect.width));
    const height = Math.max(220, Math.round(rect.height));
    renderer.setSize(width, height, false);
    camera.aspect = width / height;
    camera.updateProjectionMatrix();
  }

  function animate(time = 0) {
    state.progress += (state.target - state.progress) * .045;
    strip.position.y = 2.45 - state.progress * 2.55;
    holder.position.y = strip.position.y + 1.6;
    if (!state.drag && !reduced) lab.rotation.y += .001;
    if (!reduced) {
      ions.forEach(ion => {
        ion.position.y = ion.userData.baseY + Math.sin(time * .001 * ion.userData.speed + ion.userData.phase) * .06;
        ion.rotation.y += .01;
      });
    }
    deposits.children.forEach(particle => {
      const reveal = state.reacting ? Math.max(0, Math.min(1, (state.progress - .5 - particle.userData.delay * .35) * 7)) : 0;
      particle.scale.setScalar(reveal);
      particle.rotation.x += .006;
      particle.rotation.y += .008;
    });
    renderer.render(scene, camera);
    requestAnimationFrame(animate);
  }

  canvas.addEventListener('pointerdown', event => {
    state.drag = true; state.x = event.clientX; state.y = event.clientY;
    canvas.classList.add('is-dragging'); canvas.setPointerCapture?.(event.pointerId);
  });
  canvas.addEventListener('pointermove', event => {
    if (!state.drag) return;
    lab.rotation.y += (event.clientX - state.x) * .011;
    lab.rotation.x = Math.max(-.38, Math.min(.38, lab.rotation.x + (event.clientY - state.y) * .007));
    state.x = event.clientX; state.y = event.clientY;
  });
  const endDrag = () => { state.drag = false; canvas.classList.remove('is-dragging'); };
  canvas.addEventListener('pointerup', endDrag);
  canvas.addEventListener('pointercancel', endDrag);

  const originalRender = window.renderDisplacement;
  const originalPlay = window.playDisplacement;
  window.renderDisplacement = function () {
    originalRender?.();
    setSelection(true);
  };
  window.playDisplacement = function () {
    originalPlay?.();
    play();
  };

  new ResizeObserver(resize).observe(canvas);
  setSelection(true);
  resize();
  animate();
})();
