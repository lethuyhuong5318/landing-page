(() => {
  let activeLab = null;

  function disposeObject(root) {
    root?.traverse?.(object => {
      object.geometry?.dispose?.();
      if (Array.isArray(object.material)) object.material.forEach(material => material.dispose?.());
      else object.material?.dispose?.();
    });
  }

  window.destroyAtomicLab = () => {
    if (!activeLab) return;
    cancelAnimationFrame(activeLab.frame);
    activeLab.observer?.disconnect();
    activeLab.abort.abort();
    disposeObject(activeLab.scene);
    activeLab.renderer?.dispose?.();
    activeLab.renderer?.forceContextLoss?.();
    activeLab = null;
  };

  function fibonacciPosition(index, total, radius) {
    if (total === 1) return new THREE.Vector3(0, 0, 0);
    const y = 1 - (index / (total - 1)) * 2;
    const ring = Math.sqrt(Math.max(0, 1 - y * y));
    const angle = index * Math.PI * (3 - Math.sqrt(5));
    const layer = .72 + ((index * 37) % 23) / 82;
    return new THREE.Vector3(Math.cos(angle) * ring, y, Math.sin(angle) * ring).multiplyScalar(radius * layer);
  }

  window.createAtomicLab = ({ z, symbol, shells }) => {
    window.destroyAtomicLab();
    const host = document.getElementById('atomicLabHost');
    if (!host) return;
    if (!window.THREE) {
      host.innerHTML = '<p class="atomic-lab-fallback">Không thể khởi tạo mô hình 3D trên trình duyệt này.</p>';
      return;
    }

    host.innerHTML = `<section class="atomic-lab" aria-label="Mô hình 3D của nguyên tử ${symbol}">
      <div class="atomic-lab-head"><div><b>Mô hình nguyên tử 3D</b><small>Kéo để xoay · electron chuyển động trên từng lớp</small></div><span class="atomic-lab-shells">${shells.join(' – ')}</span></div>
      <div class="atomic-lab-stage"><canvas id="atomicLabCanvas" role="img" aria-label="Mô hình 3D nguyên tử ${symbol}, số hiệu nguyên tử ${z}"></canvas><span class="atomic-lab-tip">Kéo để xoay mô hình</span></div>
      <div class="atomic-lab-toolbar"><div class="atomic-lab-legend"><span><i class="proton"></i>Proton</span><span><i class="neutron"></i>Neutron</span><span><i class="electron"></i>Electron</span></div><div class="atomic-lab-controls"><button type="button" data-atom="toggle">Tạm dừng</button><button type="button" data-atom="reset">Đặt lại</button></div></div>
    </section>`;

    const canvas = host.querySelector('#atomicLabCanvas');
    const toggle = host.querySelector('[data-atom="toggle"]');
    const reset = host.querySelector('[data-atom="reset"]');
    const abort = new AbortController();
    const reduced = matchMedia('(prefers-reduced-motion: reduce)').matches;
    let renderer;
    try {
      renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true, powerPreference: 'high-performance' });
    } catch (error) {
      host.innerHTML = <p class="atomic-lab-fallback">Thiết bị chưa hỗ trợ WebGL để hiển thị mô hình 3D.<br><button onclick="location.reload()" style="margin-top:8px; padding:8px 12px; background:#267fc1; color:#fff; border:none; border-radius:6px; cursor:pointer;">Thử lại</button></p>;
      return;
    }

    renderer.setPixelRatio(Math.min(devicePixelRatio || 1, 1.7));
    renderer.setClearColor(0x000000, 0);
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(38, 1, .1, 100);
    const atom = new THREE.Group();
    scene.add(atom);
    scene.add(new THREE.HemisphereLight(0xffffff, 0x8da3b5, 1.35));
    const keyLight = new THREE.DirectionalLight(0xffffff, 1.55); keyLight.position.set(5, 7, 9); scene.add(keyLight);
    const rimLight = new THREE.DirectionalLight(0x65baff, .85); rimLight.position.set(-7, -2, 5); scene.add(rimLight);

    const protonMaterial = new THREE.MeshPhongMaterial({ color: 0xf23838, shininess: 105, specular: 0xffffff });
    const neutronMaterial = new THREE.MeshPhongMaterial({ color: 0x65aee9, shininess: 90, specular: 0xdff4ff });
    const electronMaterial = new THREE.MeshPhongMaterial({ color: 0x123fd0, emissive: 0x06165e, shininess: 120, specular: 0xffffff });
    const orbitMaterial = new THREE.MeshBasicMaterial({ color: 0xf4ad19, transparent: true, opacity: .93 });
    const particleGeometry = new THREE.SphereGeometry(.34, 24, 18);
    const electronGeometry = new THREE.SphereGeometry(.22, 22, 16);

    const approximateNeutrons = z === 1 ? 0 : Math.max(z, Math.round(z * .34));
    const actualNucleons = z + approximateNeutrons;
    const shownNucleons = Math.min(actualNucleons, 82);
    const nucleusRadius = shownNucleons === 1 ? 0 : Math.max(.45, Math.cbrt(shownNucleons) * .31);
    const nucleus = new THREE.Group();
    for (let i = 0; i < shownNucleons; i++) {
      const protonLimit = Math.round(shownNucleons * z / actualNucleons);
      const mesh = new THREE.Mesh(particleGeometry, i < protonLimit ? protonMaterial : neutronMaterial);
      mesh.position.copy(fibonacciPosition(i, shownNucleons, nucleusRadius));
      nucleus.add(mesh);
    }
    atom.add(nucleus);
    const coreLight = new THREE.PointLight(0xff6969, .8, 7); atom.add(coreLight);

    const electrons = [];
    const maxOrbit = 2.15 + Math.max(0, shells.length - 1) * 1.05;
    shells.forEach((count, shellIndex) => {
      const radius = 2.15 + shellIndex * 1.05;
      const plane = new THREE.Group();
      plane.rotation.x = .73 + shellIndex * .08;
      plane.rotation.z = shellIndex * .34;
      atom.add(plane);
      const ring = new THREE.Mesh(new THREE.TorusGeometry(radius, .025, 8, 112), orbitMaterial.clone());
      plane.add(ring);
      for (let index = 0; index < count; index++) {
        const electron = new THREE.Mesh(electronGeometry, electronMaterial);
        const angle = index / count * Math.PI * 2;
        electron.position.set(Math.cos(angle) * radius, Math.sin(angle) * radius, 0);
        plane.add(electron);
        electrons.push({ mesh: electron, radius, angle, speed: .012 - shellIndex * .0008, plane });
      }
    });

    camera.position.set(0, .25, Math.max(8.2, maxOrbit * 2.18));
    camera.lookAt(0, 0, 0);
    atom.rotation.set(.08, -.2, 0);

    const state = { scene, renderer, camera, atom, electrons, canvas, abort, observer: null, frame: 0, paused: reduced, drag: false, x: 0, y: 0, vx: 0, vy: 0 };
    activeLab = state;
    if (reduced) toggle.textContent = 'Tiếp tục';

    const resize = () => {
      const rect = canvas.getBoundingClientRect();
      const width = Math.max(260, Math.round(rect.width));
      const height = Math.max(190, Math.round(rect.height));
      renderer.setSize(width, height, false);
      camera.aspect = width / height;
      camera.updateProjectionMatrix();
    };

    const animate = () => {
      if (activeLab !== state) return;
      if (!state.paused) {
        electrons.forEach(item => {
          item.angle += item.speed;
          item.mesh.position.set(Math.cos(item.angle) * item.radius, Math.sin(item.angle) * item.radius, 0);
        });
        if (!state.drag) {
          atom.rotation.y += .0022;
          if (Math.abs(state.vx) > 0.0001) {
            atom.rotation.y += state.vx;
            state.vx *= 0.92;
          }
          if (Math.abs(state.vy) > 0.0001) {
            atom.rotation.x = Math.max(-1.1, Math.min(1.1, atom.rotation.x + state.vy));
            state.vy *= 0.92;
          }
        }
        nucleus.rotation.y -= .0014;
      }
      renderer.render(scene, camera);
      state.frame = requestAnimationFrame(animate);
    };

    const signal = { signal: abort.signal };
    canvas.addEventListener('webglcontextlost', (event) => {
      event.preventDefault();
      console.warn('WebGL context lost - attempting to restore');
    }, { signal: abort.signal });
    
    canvas.addEventListener('webglcontextrestored', () => {
      console.log('WebGL context restored');
    }, { signal: abort.signal });
    canvas.addEventListener('pointerdown', event => {
      state.drag = true; state.x = event.clientX; state.y = event.clientY;
      canvas.classList.add('is-dragging'); canvas.setPointerCapture?.(event.pointerId);
    }, signal);
    canvas.addEventListener('pointermove', event => {
      if (!state.drag) return;
      const dx = event.clientX - state.x;
      const dy = event.clientY - state.y;
      state.vx = dx * .012;
      state.vy = dy * .009;
      atom.rotation.y += state.vx;
      atom.rotation.x = Math.max(-1.1, Math.min(1.1, atom.rotation.x + state.vy));
      state.x = event.clientX; state.y = event.clientY;
    }, signal);
    const endDrag = () => { state.drag = false; canvas.classList.remove('is-dragging'); };
    canvas.addEventListener('pointerup', endDrag, signal);
    canvas.addEventListener('pointercancel', endDrag, signal);
    toggle.addEventListener('click', () => { state.paused = !state.paused; toggle.textContent = state.paused ? 'Tiếp tục' : 'Tạm dừng'; }, signal);
    reset.addEventListener('click', () => { atom.rotation.set(.08, -.2, 0); camera.position.set(0, .25, Math.max(8.2, maxOrbit * 2.18)); camera.lookAt(0, 0, 0); }, signal);
    state.observer = new ResizeObserver(resize); state.observer.observe(canvas); resize();
    setTimeout(() => {
      const loader = host.querySelector('.atomic-lab-loading');
      if (loader) {
        loader.style.transition = 'opacity 0.3s';
        loader.style.opacity = '0';
        setTimeout(() => loader.remove(), 300);
      }
    }, 100);
    animate();
  };

  document.addEventListener('keydown', event => { if (event.key === 'Escape') window.destroyAtomicLab?.(); });
  document.addEventListener('click', event => { if (event.target.closest?.('.em-close') || event.target.id === 'elModalOverlay') window.destroyAtomicLab?.(); });
})();



