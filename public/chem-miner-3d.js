(() => {
  const data = window.ChemMinerData;
  const canvas = document.getElementById('chemMinerCanvas');
  if (!data || !canvas || !window.THREE) return;

  const $ = id => document.getElementById(id);
  const ui = {
    score: $('minerScore'), time: $('minerTime'), lives: $('minerLives'), streak: $('minerCombo'),
    target: $('minerTarget'), progress: $('minerProgress'), toast: $('minerToast'), stage: $('minerStage'),
    intro: $('minerIntro'), result: $('minerResult'), resultBody: $('minerResultBody'), best: $('minerBest'),
    level: $('minerLevel'), mode: $('minerMode'), pause: $('minerPause'), sound: $('minerSound'),
    comboBadge: $('minerComboBadge')
  };
  const lowPower = (navigator.hardwareConcurrency || 4) <= 4;
  const reduced = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const itemByKey = key => data.items.find(item => `${item.sym}:${item.val}` === key);
  const shuffle = list => list.slice().sort(() => Math.random() - .5);
  const state = {
    running: false, paused: false, hidden: false, sound: true, mode: 'practice', level: '1',
    target: 'I', score: 0, lives: 3, streak: 0, maxStreak: 0, attempts: 0, correct: 0,
    time: 60, last: 0, wrong: new Map(), used: new Map(), minerals: [], particles: [],
    hook: { angle: 0, direction: 1, length: .85, status: 'swing', caught: null },
    bounds: { halfWidth: 8, halfHeight: 4.5 }, aim: 0
  };

  let renderer;
  try {
    renderer = new THREE.WebGLRenderer({ canvas, antialias: !lowPower, alpha: false, powerPreference: 'high-performance' });
  } catch {
    ui.stage.innerHTML = '<p class="note">Thiáº¿t bá»‹ chÆ°a há»— trá»£ WebGL Ä‘á»ƒ cháº¡y game 3D.</p>';
    return;
  }
  renderer.setPixelRatio(Math.min(devicePixelRatio || 1, lowPower ? 1.35 : 1.7));
  renderer.setClearColor(0x102a3a, 1);
  const scene = new THREE.Scene();
  scene.fog = new THREE.Fog(0x122f3e, 9, 24);
  const camera = new THREE.OrthographicCamera(-8, 8, 4.5, -4.5, .1, 50);
  camera.position.set(0, 0, 12);
  camera.lookAt(0, 0, 0);

  scene.add(new THREE.HemisphereLight(0xfff2c2, 0x173144, 1.55));
  const topLight = new THREE.DirectionalLight(0xffe2a0, 1.5);
  topLight.position.set(-3, 9, 8);
  scene.add(topLight);
  const blueRim = new THREE.DirectionalLight(0x72caff, .72);
  blueRim.position.set(6, -2, 6);
  scene.add(blueRim);

  const world = new THREE.Group();
  scene.add(world);
  const caveLayers = new THREE.Group();
  world.add(caveLayers);
  [
    { y: 2.6, z: -5, color: 0x70513c, height: 3.2 },
    { y: .4, z: -4.7, color: 0x3b4b4b, height: 2.2 },
    { y: -2.5, z: -4.4, color: 0x233c43, height: 4.1 },
  ].forEach(layer => {
    const mesh = new THREE.Mesh(new THREE.PlaneGeometry(30, layer.height), new THREE.MeshLambertMaterial({ color: layer.color }));
    mesh.position.set(0, layer.y, layer.z);
    caveLayers.add(mesh);
  });
  const beamMaterial = new THREE.MeshBasicMaterial({ color: 0xffe6a1, transparent: true, opacity: .08, side: THREE.DoubleSide, depthWrite: false });
  [-4.5, 0, 4.5].forEach((x, index) => {
    const beam = new THREE.Mesh(new THREE.ConeGeometry(1.55, 10, 4, 1, true), beamMaterial.clone());
    beam.position.set(x, .8, -2.5);
    beam.rotation.z = index === 0 ? -.18 : index === 2 ? .18 : 0;
    world.add(beam);
  });

  const rockMaterial = new THREE.MeshStandardMaterial({ color: 0x4c5b58, roughness: .95 });
  for (let i = 0; i < 30; i++) {
    const rock = new THREE.Mesh(new THREE.DodecahedronGeometry(.18 + (i % 5) * .055, 0), rockMaterial.clone());
    rock.material.color.offsetHSL((i % 4) * .012, 0, (i % 3) * .025);
    rock.position.set(-8.5 + (i * 2.73) % 17, -4 + (i * 1.37) % 7.1, -2.7 + (i % 3) * .25);
    rock.rotation.set(i, i * .47, i * .19);
    rock.scale.set(1.4, .8 + (i % 3) * .2, 1);
    world.add(rock);
  }

  const dustCount = lowPower || reduced ? 20 : 50;
  const dustPositions = new Float32Array(dustCount * 3);
  for (let i = 0; i < dustCount; i++) {
    dustPositions[i * 3] = -8 + Math.random() * 16;
    dustPositions[i * 3 + 1] = -4 + Math.random() * 8;
    dustPositions[i * 3 + 2] = -1 + Math.random() * 4;
  }
  const dustGeometry = new THREE.BufferGeometry();
  dustGeometry.setAttribute('position', new THREE.BufferAttribute(dustPositions, 3));
  const dust = new THREE.Points(dustGeometry, new THREE.PointsMaterial({ color: 0xffe9ae, size: .035, transparent: true, opacity: .48 }));
  scene.add(dust);

  function makeTruck() {
    const truck = new THREE.Group();
    const yellow = new THREE.MeshStandardMaterial({ color: 0xf4ad24, roughness: .42, metalness: .2 });
    const navy = new THREE.MeshStandardMaterial({ color: 0x153e5a, roughness: .5, metalness: .3 });
    const body = new THREE.Mesh(new THREE.BoxGeometry(2.25, .48, .7), yellow); body.position.y = .12; truck.add(body);
    const cab = new THREE.Mesh(new THREE.BoxGeometry(.8, .72, .65), yellow); cab.position.set(-.57, .67, 0); truck.add(cab);
    const windowMesh = new THREE.Mesh(new THREE.BoxGeometry(.44, .32, .68), new THREE.MeshPhongMaterial({ color: 0xaee4f7, shininess: 90 }));
    windowMesh.position.set(-.6, .75, .01); truck.add(windowMesh);
    [-.68, .7].forEach(x => {
      const wheel = new THREE.Mesh(new THREE.CylinderGeometry(.3, .3, .24, 22), navy);
      wheel.rotation.x = Math.PI / 2; wheel.position.set(x, -.22, .35); truck.add(wheel);
    });
    truck.position.set(0, 3.8, 1.4);
    return truck;
  }
  const truck = makeTruck();
  scene.add(truck);

  const pivot = new THREE.Vector3(0, 3.45, 1.2);
  const ropeGeometry = new THREE.BufferGeometry();
  ropeGeometry.setAttribute('position', new THREE.BufferAttribute(new Float32Array(18), 3));
  const rope = new THREE.Line(ropeGeometry, new THREE.LineBasicMaterial({ color: 0xf4d79d }));
  scene.add(rope);
  const hookGroup = new THREE.Group();
  const hookMetal = new THREE.MeshStandardMaterial({ color: 0xdce9ee, metalness: .8, roughness: .2 });
  const hookCore = new THREE.Mesh(new THREE.SphereGeometry(.12, 18, 12), hookMetal);
  hookGroup.add(hookCore);
  [-1, 1].forEach(side => {
    const tooth = new THREE.Mesh(new THREE.BoxGeometry(.08, .38, .1), hookMetal);
    tooth.position.set(side * .13, -.16, 0); tooth.rotation.z = side * .55; hookGroup.add(tooth);
  });
  scene.add(hookGroup);

  function labelTexture(item) {
    const c = document.createElement('canvas');
    c.width = 320; c.height = 180;
    const x = c.getContext('2d');
    x.clearRect(0, 0, c.width, c.height);
    x.fillStyle = '#ffffff'; x.textAlign = 'center'; x.textBaseline = 'middle';
    x.font = `900 ${item.sym.length > 2 ? 58 : 72}px "Be Vietnam Pro",sans-serif`;
    x.fillText(item.sym, 160, 67);
    x.font = '900 30px "Be Vietnam Pro",sans-serif';
    x.fillStyle = '#fff7bc'; x.fillText(`HÃ³a trá»‹ ${item.val}`, 160, 123);
    x.font = '700 20px "Be Vietnam Pro",sans-serif';
    x.fillStyle = '#e6f3ff'; x.fillText(item.name, 160, 157);
    const texture = new THREE.CanvasTexture(c);
    texture.minFilter = THREE.LinearFilter;
    return texture;
  }

  function mineralColor(item) {
    const pair = item.kind === 'group' ? data.colors.group : data.colors[item.val] || data.colors.I;
    return { light: pair[0], dark: pair[1] };
  }

  function createMineral(item, index, count) {
    const group = new THREE.Group();
    const tone = mineralColor(item);
    const geometry = item.kind === 'group'
      ? new THREE.BoxGeometry(1.15, .9, .72, 2, 2, 1)
      : new THREE.DodecahedronGeometry(.62, 0);
    const mesh = new THREE.Mesh(geometry, new THREE.MeshStandardMaterial({
      color: tone.dark, emissive: new THREE.Color(tone.dark).multiplyScalar(.07),
      roughness: .3, metalness: .22
    }));
    mesh.scale.set(1, item.kind === 'group' ? 1 : 1.12, .88);
    group.add(mesh);
    const edge = new THREE.LineSegments(new THREE.EdgesGeometry(geometry), new THREE.LineBasicMaterial({ color: tone.light, transparent: true, opacity: .72 }));
    edge.scale.copy(mesh.scale); group.add(edge);
    const sprite = new THREE.Sprite(new THREE.SpriteMaterial({ map: labelTexture(item), transparent: true, depthTest: false }));
    sprite.position.set(0, .03, .48); sprite.scale.set(1.55, .88, 1); group.add(sprite);
    const columns = count <= 8 ? 4 : 5;
    const row = Math.floor(index / columns), col = index % columns;
    const xSpan = Math.min(13.4, state.bounds.halfWidth * 1.72);
    const cell = xSpan / columns;
    group.position.set(-xSpan / 2 + cell * (col + .5) + (row % 2 ? .2 : 0), 1.25 - row * 1.9, .1 + (index % 3) * .18);
    group.rotation.set((index % 3 - 1) * .08, index * .37, (index % 2 ? 1 : -1) * .05);
    group.userData = { item, radius: .64, hit: false, weight: item.weight || 1, baseY: group.position.y, phase: index * .8, mesh };
    scene.add(group);
    return group;
  }

  function clearMinerals() {
    state.minerals.forEach(group => {
      group.traverse(object => {
        object.geometry?.dispose?.();
        if (object.material?.map) object.material.map.dispose();
        object.material?.dispose?.();
      });
      scene.remove(group);
    });
    state.minerals = [];
  }

  function activePool(level) {
    const pool = level.pool.length ? level.pool.map(itemByKey).filter(Boolean) : data.items;
    return level.groupsOnly ? pool.filter(item => item.kind === 'group') : pool;
  }

  function chooseTarget(level) {
    const values = level.targets.filter(value => activePool(level).some(item => item.val === value));
    return values[Math.floor(Math.random() * values.length)] || 'I';
  }

  function spawn() {
    clearMinerals();
    const level = data.levels[state.level];
    const pool = activePool(level);
    const correct = shuffle(pool.filter(item => item.val === state.target)).slice(0, 3);
    const distractors = shuffle(pool.filter(item => item.val !== state.target)).slice(0, 6);
    let picks = shuffle([...correct, ...distractors]);
    while (picks.length < Math.min(9, pool.length + 2)) picks.push(pool[Math.floor(Math.random() * pool.length)]);
    const visiblePicks = picks.slice(0, state.bounds.halfWidth < 5 ? 8 : 9);
    state.minerals = visiblePicks.map((item, index) => createMineral(item, index, visiblePicks.length));
  }

  function updateQuestion() {
    const level = data.levels[state.level];
    ui.target.textContent = `HÃ³a trá»‹ ${state.target}`;
    const subject = level.groupsOnly ? 'nhÃ³m nguyÃªn tá»­' : 'nguyÃªn tá»‘ hoáº·c nhÃ³m';
    $('minerQuestionText').textContent = `ÄÃ o ${subject} cÃ³ hÃ³a trá»‹ ${state.target}`;
    ui.progress.textContent = `ÄÃ£ tÃ¬m ${state.correct}/10 Ä‘Ã¡p Ã¡n Ä‘Ãºng`;
  }

  function updateHud() {
    ui.score.textContent = state.score;
    ui.time.textContent = state.mode === 'practice' ? 'âˆž' : `${Math.max(0, Math.ceil(state.time))}s`;
    ui.lives.textContent = 'â— '.repeat(state.lives).trim() || 'â€”';
    ui.streak.textContent = `x${state.streak}`;
    updateQuestion();
  }

  function toast(text, type = '') {
    ui.toast.textContent = text;
    ui.toast.className = `miner-toast ${type}`.trim();
  }

  function playFeedback(kind) {
    if (!state.sound) return;
    if (kind === 'good') window.soundCorrect?.();
    else if (kind === 'bad') window.soundWrong?.();
    else window.soundClick?.();
  }

  function reset() {
    state.running = true; state.paused = false; state.mode = ui.mode.value; state.level = ui.level.value;
    state.target = chooseTarget(data.levels[state.level]); state.score = 0; state.lives = 3;
    state.streak = 0; state.maxStreak = 0; state.attempts = 0; state.correct = 0; state.time = 60;
    state.wrong = new Map(); state.used = new Map(); state.hook = { angle: 0, direction: 1, length: .85, status: 'swing', caught: null };
    state.last = performance.now(); state.particles = [];
    ui.intro.hidden = true; ui.result.hidden = true; ui.pause.setAttribute('aria-pressed', 'false');
    ui.pause.setAttribute('aria-label', 'Táº¡m dá»«ng'); spawn(); updateHud();
    document.querySelectorAll('.miner-power').forEach(button => button.disabled = false);
    toast(`MÃ n ${data.levels[state.level].title}: hÃ£y tÃ¬m hÃ³a trá»‹ ${state.target}.`);
    playFeedback('click');
  }

  function launch() {
    if (state.running && !state.paused && state.hook.status === 'swing') {
      state.hook.status = 'extend';
      playFeedback('click');
    }
  }

  function catchMineral(group) {
    state.hook.caught = group;
    group.userData.hit = true;
    state.hook.status = 'retract';
    group.userData.mesh.material.emissive.setHex(0xffd95a);
    group.userData.mesh.material.emissiveIntensity = .6;
  }

  function floatingScore(gain) {
    const el = document.createElement('span');
    el.className = 'miner-floating-score'; el.textContent = `+${gain}`;
    el.style.left = '50%'; el.style.top = '34%'; ui.stage.appendChild(el);
    setTimeout(() => el.remove(), 850);
  }

  function comboBadge() {
    ui.comboBadge.textContent = `COMBO x${state.streak}`;
    ui.comboBadge.classList.remove('show'); void ui.comboBadge.offsetWidth; ui.comboBadge.classList.add('show');
  }

  function burst(position, color) {
    const count = lowPower || reduced ? 8 : 16;
    for (let i = 0; i < count; i++) {
      const mesh = new THREE.Mesh(new THREE.IcosahedronGeometry(.055, 0), new THREE.MeshBasicMaterial({ color }));
      mesh.position.copy(position); scene.add(mesh);
      state.particles.push({ mesh, velocity: new THREE.Vector3((Math.random() - .5) * 3, Math.random() * 2.6, (Math.random() - .5) * 1.4), life: 1 });
    }
  }

  function resolve(group) {
    const item = group.userData.item;
    const correct = item.val === state.target;
    state.attempts++; state.used.set(`${item.sym}:${item.val}`, item);
    if (correct) {
      state.correct++; state.streak++; state.maxStreak = Math.max(state.maxStreak, state.streak);
      let gain = 20; if (state.streak > 0 && state.streak % 3 === 0) gain += 50;
      state.score += gain; floatingScore(gain); burst(group.position, mineralColor(item).light);
      toast(`ChÃ­nh xÃ¡c! ${item.sym} cÃ³ hÃ³a trá»‹ ${item.val}. +${gain} Ä‘iá»ƒm`, state.streak >= 3 ? 'combo' : 'good');
      if (state.streak >= 3) comboBadge();
      playFeedback('good'); window.awardXP?.(state.streak >= 3 ? 6 : 3);
      if (state.streak % 5 === 0) window.confettiBurst?.();
    } else {
      state.score = Math.max(0, state.score - 10); state.lives--; state.streak = 0;
      state.wrong.set(`${item.sym}:${item.val}`, item);
      toast(`ChÆ°a Ä‘Ãºng, ${item.sym} cÃ³ hÃ³a trá»‹ ${item.val}. ${item.tip}`, 'bad');
      playFeedback('bad'); ui.stage.classList.remove('shake'); void ui.stage.offsetWidth; ui.stage.classList.add('shake');
    }
    state.target = chooseTarget(data.levels[state.level]); updateHud();
    if (state.lives <= 0) finish('Em Ä‘Ã£ dÃ¹ng háº¿t 3 lÆ°á»£t thá»­.');
    else if (state.correct >= 10) finish('Em Ä‘Ã£ hoÃ n thÃ nh má»¥c tiÃªu 10 tinh thá»ƒ.');
    else spawn();
  }

  function finish(reason) {
    state.running = false;
    const accuracy = state.attempts ? Math.round(state.correct / state.attempts * 100) : 0;
    const stars = accuracy >= 90 ? 3 : accuracy >= 70 ? 2 : 1;
    const best = Math.max(Number(localStorage.getItem('chemMinerBest') || 0), state.score);
    localStorage.setItem('chemMinerBest', String(best));
    const progress = JSON.parse(localStorage.getItem('chemMinerProgress') || '{}');
    progress[state.level] = Math.max(progress[state.level] || 0, stars);
    localStorage.setItem('chemMinerProgress', JSON.stringify(progress));
    localStorage.setItem('chemMinerWeak', JSON.stringify([...state.wrong.keys()]));
    ui.best.textContent = `Ká»· lá»¥c: ${best} Ä‘iá»ƒm`;
    const review = [...state.wrong.values()].slice(0, 4);
    const goodMessage = data.levels[state.level].groupsOnly ? 'Em Ä‘Ã£ nhá»› tá»‘t cÃ¡c nhÃ³m nguyÃªn tá»­ trong mÃ n nÃ y.' : `Em Ä‘Ã£ nhá»› tá»‘t cÃ¡c cháº¥t cÃ³ hÃ³a trá»‹ ${state.target}.`;
    const reviewText = review.length ? `HÃ£y Ã´n thÃªm ${review.map(item => `${item.sym} (${item.val})`).join(', ')}.` : goodMessage;
    ui.resultBody.innerHTML = `<h3>${accuracy >= 90 ? 'Xuáº¥t sáº¯c!' : accuracy < 60 ? 'MÃ¬nh luyá»‡n thÃªm nhÃ©!' : 'HoÃ n thÃ nh mÃ n chÆ¡i!'}</h3><p>${reason}</p><div class="miner-stars">${'â˜…'.repeat(stars)}${'â˜†'.repeat(3 - stars)}</div><div class="miner-results"><div><b>${state.score}</b><span>Äiá»ƒm</span></div><div><b>${state.correct}</b><span>ÄÃºng</span></div><div><b>${state.attempts - state.correct}</b><span>Sai</span></div><div><b>${accuracy}%</b><span>ChÃ­nh xÃ¡c</span></div><div><b>${state.maxStreak}</b><span>Chuá»—i tá»‘t nháº¥t</span></div></div><div class="miner-review"><b>Nháº­n xÃ©t:</b> ${reviewText}</div><div class="miner-result-buttons"><button class="miner-primary" type="button" data-result="replay">ChÆ¡i láº¡i</button><button class="miner-secondary" type="button" data-result="next">MÃ n tiáº¿p theo</button><button class="miner-secondary" type="button" data-result="review">Ã”n báº£ng hÃ³a trá»‹</button></div>`;
    ui.result.hidden = false;
    ui.resultBody.querySelector('[data-result="replay"]').onclick = reset;
    ui.resultBody.querySelector('[data-result="next"]').onclick = () => {
      const options = [...ui.level.options]; const index = Math.min(options.length - 1, ui.level.selectedIndex + 1);
      ui.level.selectedIndex = index; reset();
    };
    ui.resultBody.querySelector('[data-result="review"]').onclick = () => {
      ui.result.hidden = true; document.querySelector('#p-valence .tt')?.scrollIntoView({ behavior: reduced ? 'auto' : 'smooth', block: 'center' });
    };
    if (accuracy >= 90) window.confettiBurst?.();
  }

  function togglePause() {
    if (!state.running) return;
    state.paused = !state.paused;
    ui.pause.setAttribute('aria-pressed', String(state.paused));
    ui.pause.setAttribute('aria-label', state.paused ? 'Tiáº¿p tá»¥c' : 'Táº¡m dá»«ng');
    toast(state.paused ? 'ÄÃ£ táº¡m dá»«ng.' : 'Tiáº¿p tá»¥c Ä‘Ã o hÃ³a trá»‹.', state.paused ? '' : 'good');
  }

  function toggleSound() {
    state.sound = !state.sound;
    ui.sound.setAttribute('aria-pressed', String(!state.sound));
    ui.sound.setAttribute('aria-label', state.sound ? 'Táº¯t Ã¢m thanh' : 'Báº­t Ã¢m thanh');
    $('minerSoundText').textContent = state.sound ? 'Ã‚m thanh báº­t' : 'Ã‚m thanh táº¯t';
    if (state.sound) playFeedback('click');
  }

  function usePower(type, button) {
    if (!state.running || state.paused || button.disabled) return;
    button.disabled = true;
    if (type === 'time') { state.time += 8; toast('Cá»™ng thÃªm 8 giÃ¢y.', 'good'); }
    if (type === 'scope') {
      state.minerals.filter(group => group.userData.item.val === state.target).forEach(group => {
        group.userData.mesh.material.emissive.setHex(0xffe56d); group.userData.mesh.material.emissiveIntensity = .65;
        setTimeout(() => { if (group.userData?.mesh) group.userData.mesh.material.emissiveIntensity = .08; }, 4300);
      });
      toast('CÃ¡c tinh thá»ƒ Ä‘Ãºng Ä‘ang phÃ¡t sÃ¡ng.', 'good');
    }
    if (type === 'bomb') {
      state.minerals.filter(group => group.userData.item.val !== state.target).forEach(group => { group.visible = false; group.userData.hit = true; });
      toast('ÄÃ£ lá»c bá»›t tinh thá»ƒ gÃ¢y nhiá»…u.', 'good');
    }
    if (type === 'magnet') {
      const group = state.minerals.find(candidate => candidate.userData.item.val === state.target && !candidate.userData.hit);
      if (group) catchMineral(group);
      toast('Nam chÃ¢m Ä‘ang hÃºt má»™t Ä‘Ã¡p Ã¡n Ä‘Ãºng.', 'good');
    }
    playFeedback('click');
  }

  function endpoint() {
    const hook = state.hook;
    return new THREE.Vector3(
      pivot.x + Math.sin(hook.angle) * hook.length,
      pivot.y - Math.cos(hook.angle) * hook.length,
      1.2
    );
  }

  function updateRope(end) {
    const attr = rope.geometry.attributes.position;
    const sag = state.hook.status === 'retract' && state.hook.caught ? .09 * state.hook.caught.userData.weight : 0;
    for (let i = 0; i < 6; i++) {
      const t = i / 5;
      attr.setXYZ(i, pivot.x + (end.x - pivot.x) * t, pivot.y + (end.y - pivot.y) * t - Math.sin(Math.PI * t) * sag, 1.2);
    }
    attr.needsUpdate = true;
    hookGroup.position.copy(end);
    hookGroup.rotation.z = -state.hook.angle;
  }

  function resize() {
    const rect = canvas.getBoundingClientRect();
    const width = Math.max(280, Math.round(rect.width));
    const height = Math.max(280, Math.round(rect.height));
    renderer.setSize(width, height, false);
    const halfHeight = width < 500 ? 5.2 : 4.5;
    const halfWidth = halfHeight * width / height;
    state.bounds = { halfWidth, halfHeight };
    camera.left = -halfWidth; camera.right = halfWidth; camera.top = halfHeight; camera.bottom = -halfHeight;
    camera.updateProjectionMatrix();
  }

  function tick(time) {
    const dt = Math.min(.035, (time - (state.last || time)) / 1000);
    state.last = time;
    if (!state.hidden && !state.paused) {
      if (state.running) {
        const hook = state.hook;
        if (hook.status === 'swing') {
          hook.angle += hook.direction * dt * (1.25 + state.aim * .7);
          if (Math.abs(hook.angle) > 1.02) { hook.angle = Math.sign(hook.angle) * 1.02; hook.direction *= -1; }
        } else if (hook.status === 'extend') {
          hook.length += dt * 6.1;
          const end = endpoint();
          const hit = state.minerals.find(group => !group.userData.hit && group.visible && Math.hypot(group.position.x - end.x, group.position.y - end.y) < group.userData.radius + .2);
          if (hit) catchMineral(hit);
          else if (hook.length > state.bounds.halfHeight * 1.82) hook.status = 'retract';
        } else if (hook.status === 'retract') {
          const weight = hook.caught?.userData.weight || 1;
          hook.length -= dt * (7.4 / Math.max(1, weight * .72));
          if (hook.caught) hook.caught.position.copy(endpoint()).add(new THREE.Vector3(0, -.25, -.05));
          if (hook.length <= .85) {
            hook.length = .85;
            const caught = hook.caught; hook.caught = null; hook.status = 'swing';
            if (caught) resolve(caught);
          }
        }
        if (state.mode === 'challenge') {
          state.time -= dt;
          if (state.time <= 0) finish('Háº¿t 60 giÃ¢y.');
          updateHud();
        }
      }
      state.minerals.forEach(group => {
        if (!group.userData.hit && !reduced) {
          group.position.y = group.userData.baseY + Math.sin(time * .0012 + group.userData.phase) * .06;
          group.rotation.y += dt * .16;
        }
      });
      state.particles.forEach(particle => {
        particle.velocity.y -= dt * 2.2; particle.mesh.position.addScaledVector(particle.velocity, dt);
        particle.life -= dt * 1.7; particle.mesh.scale.setScalar(Math.max(.01, particle.life));
      });
      state.particles = state.particles.filter(particle => {
        if (particle.life > 0) return true;
        particle.mesh.geometry.dispose(); particle.mesh.material.dispose(); scene.remove(particle.mesh); return false;
      });
      if (!reduced) dust.rotation.z += dt * .008;
      updateRope(endpoint());
      renderer.render(scene, camera);
    }
    state.frameId = state.frameId = requestAnimationFrame(tick);
  }

  $('minerStart').addEventListener('click', reset);
  $('minerIntroStart').addEventListener('click', reset);
  canvas.addEventListener('pointerdown', launch);
  document.querySelectorAll('.miner-power').forEach(button => button.addEventListener('click', () => usePower(button.dataset.power, button)));
  ui.pause.addEventListener('click', togglePause);
  ui.sound.addEventListener('click', toggleSound);
  $('minerHowButton').addEventListener('click', () => toast('Canh hÆ°á»›ng mÃ³c, rá»“i cháº¡m vÃ¹ng chÆ¡i hoáº·c nÃºt THáº¢ MÃ“C. ÄÃ o Ä‘Ãºng hÃ³a trá»‹ Ä‘Æ°á»£c yÃªu cáº§u.', 'good'));
  $('minerTableButton').addEventListener('click', () => {
    ui.intro.hidden = true; document.querySelector('#p-valence .tt')?.scrollIntoView({ behavior: reduced ? 'auto' : 'smooth', block: 'center' });
  });
  $('minerIntroSound').addEventListener('click', toggleSound);
  document.querySelectorAll('.miner-control').forEach(button => {
    const direction = Number(button.dataset.aim || 0);
    if (button.dataset.action === 'drop') button.addEventListener('click', launch);
    else {
      const set = value => { state.aim = value; state.hook.direction = value || state.hook.direction; };
      button.addEventListener('pointerdown', () => set(direction));
      button.addEventListener('pointerup', () => set(0));
      button.addEventListener('pointercancel', () => set(0));
    }
  });
  document.addEventListener('keydown', event => {
    if (!document.getElementById('p-valence')?.classList.contains('active') || /INPUT|SELECT|TEXTAREA/.test(document.activeElement.tagName)) return;
    if (event.code === 'Space') { event.preventDefault(); launch(); }
    if (event.code === 'ArrowLeft') state.hook.direction = -1;
    if (event.code === 'ArrowRight') state.hook.direction = 1;
    if (event.code === 'KeyP') togglePause();
  });
  document.addEventListener('visibilitychange', () => { state.hidden = document.hidden; state.last = performance.now(); });
  window.destroyChemMiner = () => {
    if (state.frameId) cancelAnimationFrame(state.frameId);
    state.resizeObserver?.disconnect();
    state.minerals.forEach(group => {
      group.traverse(object => {
        object.geometry?.dispose?.();
        if (object.material?.map) object.material.map.dispose();
        object.material?.dispose?.();
      });
      scene.remove(group);
    });
    state.particles.forEach(particle => {
      particle.mesh.geometry.dispose();
      particle.mesh.material.dispose();
      scene.remove(particle.mesh);
    });
    renderer?.dispose?.();
    renderer?.forceContextLoss?.();
  };
  window.chemMinerPause = () => {
    if (state.running && !state.paused) togglePause();
  };
  state.resizeObserver = new ResizeObserver(() => { resize(); if (!state.running) spawn(); }); state.resizeObserver.observe(canvas);
  ui.best.textContent = `Ká»· lá»¥c: ${Number(localStorage.getItem('chemMinerBest') || 0)} Ä‘iá»ƒm`;
  resize(); state.target = 'I'; spawn(); updateHud(); updateRope(endpoint()); state.frameId = state.frameId = requestAnimationFrame(tick);
})();


