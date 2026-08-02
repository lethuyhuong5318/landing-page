
/* ---------------- LATEX RENDER HELPER ---------------- */
function tex(el){
  if(window.renderMathInElement){
    renderMathInElement(el, {
      delimiters:[
        {left:'$$', right:'$$', display:true},
        {left:'$', right:'$', display:false}
      ],
      throwOnError:false
    });
  }
}
function renderSteps(el, steps, finalHtml){
  el.innerHTML = `<ol class="step-list">${steps.map((s,i)=>`<li><span class="step-num">${i+1}</span><span class="step-body">${s}</span></li>`).join('')}</ol><div class="step-final">${finalHtml}</div>`;
  tex(el);
}
/* ---------------- GAMIFICATION ENGINE ---------------- */
const appState = { xp:0, visited:new Set(), level:1 };
function levelFromXP(xp){ return Math.floor(xp/50)+1; }
function awardXP(amount){
  appState.xp += amount;
  const el = document.getElementById('xpNum');
  const badge = document.getElementById('xpBadge');
  el.textContent = appState.xp;
  badge.classList.add('bump');
  setTimeout(()=>badge.classList.remove('bump'), 300);
  const newLevel = levelFromXP(appState.xp);
  if(newLevel !== appState.level){
    appState.level = newLevel;
    document.getElementById('lvlLbl').textContent = `Cấp ${newLevel}`;
    confettiBurst();
  }
}
function updateProgress(){
  const pct = Math.round(appState.visited.size / tabs.length * 100);
  document.getElementById('progressFill').style.width = pct + '%';
  document.getElementById('progressCaption').textContent = `Đã khám phá ${appState.visited.size}/${tabs.length} phần`;
}
function markVisited(id){
  if(!appState.visited.has(id)){
    appState.visited.add(id);
    awardXP(5);
    updateProgress();
    const btn = document.querySelector(`.tab-btn[data-target="${id}"]`);
    if(btn) btn.classList.add('visited');
  }
}
function clearConfetti(){
  document.querySelectorAll('.confetti-piece').forEach(piece=>piece.remove());
}
function confettiBurst(){
  clearConfetti();
  if(window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
  const colors = ['#F2AE03','#2878C8','#29A879','#0B2F5B','#FFD866'];
  for(let i=0;i<36;i++){
    const p = document.createElement('div');
    p.className = 'confetti-piece';
    p.style.left = Math.random()*100 + 'vw';
    p.style.background = colors[i % colors.length];
    p.style.animationDuration = (2 + Math.random()*1.5) + 's';
    p.style.transform = `rotate(${Math.random()*360}deg)`;
    document.body.appendChild(p);
    setTimeout(()=>p.remove(), 3600);
  }
}

/* ---------------- SOUND ENGINE (Web Audio API) ---------------- */
let soundOn = true;
let audioCtx = null;
function getAudioCtx(){
  if(!audioCtx){
    const AC = window.AudioContext || window.webkitAudioContext;
    if(AC) audioCtx = new AC();
  }
  return audioCtx;
}
function playTone(freqs, duration, type){
  if(!soundOn) return;
  const ctx = getAudioCtx();
  if(!ctx) return;
  if(ctx.state === 'suspended') ctx.resume();
  freqs.forEach((f,idx)=>{
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = type || 'sine';
    osc.frequency.value = f;
    const start = ctx.currentTime + idx*0.09;
    gain.gain.setValueAtTime(0.0001, start);
    gain.gain.exponentialRampToValueAtTime(0.16, start+0.02);
    gain.gain.exponentialRampToValueAtTime(0.0001, start+duration);
    osc.connect(gain); gain.connect(ctx.destination);
    osc.start(start); osc.stop(start+duration+0.02);
  });
}
function soundCorrect(){ playTone([523.25, 659.25, 783.99], 0.22, 'sine'); }
function soundWrong(){ playTone([200, 140], 0.28, 'square'); }
function soundClick(){ playTone([440], 0.06, 'sine'); }
function toggleSound(){
  soundOn = !soundOn;
  document.getElementById('soundToggle').textContent = `Âm thanh: ${soundOn ? 'Bật' : 'Tắt'}`;
  if(soundOn) soundClick();
}

/* ---------------- TABS ---------------- */
const tabs = [
  {id:'p-basics', label:'Nền tảng 6–7'},
  {id:'p-formula', label:'Công thức'},
  {id:'p-valence', label:'Hóa trị'},
  {id:'p-table', label:'Bảng tuần hoàn'},
  {id:'p-reaction', label:'Phản ứng & PTHH'},
  {id:'p-rules', label:'Tan / pH / Quỳ'},
  {id:'p-series', label:'Dãy HĐ / Khí / Kết tủa'},
  {id:'p-organic', label:'Hữu cơ cơ bản'},
  {id:'p-iupac', label:'Danh pháp IUPAC'},
  {id:'p-mass', label:'Phân tử khối'},
  {id:'p-quiz', label:'Quiz'},
];
const tabsEl = document.getElementById('tabs');
tabs.forEach((t,i)=>{
  const b = document.createElement('button');
  b.className = 'tab-btn' + (i===0?' active':'');
  b.innerHTML = `<span class="tab-num">${i+1}</span>${t.label}`;
  b.onclick = ()=>selectTab(t.id);
  b.dataset.target = t.id;
  b.setAttribute('role','tab');
  b.setAttribute('aria-selected', i===0 ? 'true':'false');
  tabsEl.appendChild(b);
});
function selectTab(id){
  clearConfetti();
  if(id!=='p-valence' && typeof window.chemMinerPause==='function') window.chemMinerPause();
  document.querySelectorAll('.panel').forEach(p=>p.classList.remove('active'));
  document.getElementById(id).classList.add('active');
  document.querySelectorAll('.tab-btn').forEach(b=>{
    const isActive = b.dataset.target===id;
    b.classList.toggle('active', isActive);
    b.setAttribute('aria-selected', isActive ? 'true':'false');
  });
  markVisited(id);
  clearConfetti();
  window.scrollTo({top:0, behavior:'smooth'});
}
selectTab('p-basics');
updateProgress();

/* ---------------- MOL CALCULATOR ---------------- */
const molFormulas = {
  m:'$$n = \\dfrac{m}{M}$$',
  v:'$$n = \\dfrac{V}{24{,}79}$$',
  cv:'$$n = C_M \\cdot V$$'
};
function renderMol(){
  const method = document.getElementById('molMethod').value;
  const box = document.getElementById('molInputs');
  if(method==='m'){
    box.innerHTML = `
      <div><label>Khối lượng chất m (gam)</label><input type="number" id="m1"></div>
      <div><label>Khối lượng mol M (g/mol)</label><input type="number" id="m2"></div>`;
  } else if(method==='v'){
    box.innerHTML = `<div><label>Thể tích khí V ở đkc (lít)</label><input type="number" id="m1"></div>`;
  } else {
    box.innerHTML = `
      <div><label>Nồng độ mol C_M (mol/l)</label><input type="number" id="m1"></div>
      <div><label>Thể tích dung dịch V (lít)</label><input type="number" id="m2"></div>`;
  }
  document.getElementById('molFormula').innerHTML = molFormulas[method];
  tex(document.getElementById('molFormula'));
  document.getElementById('molResult').textContent = 'Nhập số liệu rồi bấm "Tính n"...';
}
renderMol();
function calcMol(){
  const method = document.getElementById('molMethod').value;
  const r = document.getElementById('molResult');
  const a = parseFloat(document.getElementById('m1')?.value);
  const b = parseFloat(document.getElementById('m2')?.value);
  if(method==='m'){
    if(isNaN(a)||isNaN(b)||b===0){r.textContent='Vui lòng nhập đủ m và M (M ≠ 0).'; return;}
    const val = a/b;
    renderSteps(r, [
      `Xác định công thức phù hợp: tính theo khối lượng → $n = \\dfrac{m}{M}$`,
      `Thay số: $m = ${a}$ gam, $M = ${b}$ g/mol`,
      `Tính toán: $n = \\dfrac{${a}}{${b}} = ${val.toFixed(4)}$`
    ], `n = ${val.toFixed(4)} mol`);
  } else if(method==='v'){
    if(isNaN(a)){r.textContent='Vui lòng nhập thể tích V.'; return;}
    const val = a/24.79;
    renderSteps(r, [
      `Xác định công thức: khí ở đkc (25°C, 1 bar) → $n = \\dfrac{V}{24{,}79}$`,
      `Thay số: $V = ${a}$ lít`,
      `Tính toán: $n = \\dfrac{${a}}{24{,}79} = ${val.toFixed(4)}$`
    ], `n = ${val.toFixed(4)} mol`);
  } else {
    if(isNaN(a)||isNaN(b)){r.textContent='Vui lòng nhập đủ C_M và V.'; return;}
    const val = a*b;
    renderSteps(r, [
      `Xác định công thức: theo nồng độ mol và thể tích → $n = C_M \\cdot V$`,
      `Thay số: $C_M = ${a}$ mol/l, $V = ${b}$ lít`,
      `Tính toán: $n = ${a} \\times ${b} = ${val.toFixed(4)}$`
    ], `n = ${val.toFixed(4)} mol`);
  }
}

/* ---------------- TỈ KHỐI ---------------- */
function calcD(){
  const ma = parseFloat(document.getElementById('dMA').value);
  const mb = parseFloat(document.getElementById('dMB').value);
  const r = document.getElementById('dResult');
  if(isNaN(ma)||isNaN(mb)||mb===0){r.textContent='Vui lòng nhập đủ M_A và M_B (M_B ≠ 0).'; return;}
  const d = ma/mb;
  const note = d>1 ? 'Khí A nặng hơn khí B' : (d<1 ? 'Khí A nhẹ hơn khí B' : 'Hai khí có khối lượng mol bằng nhau');
  renderSteps(r, [
    `Xác định công thức: $d_{A/B} = \\dfrac{M_A}{M_B}$`,
    `Thay số: $M_A = ${ma}$ g/mol, $M_B = ${mb}$ g/mol`,
    `Tính toán: $d_{A/B} = \\dfrac{${ma}}{${mb}} = ${d.toFixed(3)}$ → ${note}`
  ], `d = ${d.toFixed(3)}`);
}

/* ---------------- DUNG DỊCH ---------------- */
const ddFormulas = {
  cpercent:'$$C\\% = \\dfrac{m_{ct}}{m_{dd}} \\times 100\\%$$',
  cm:'$$C_M = \\dfrac{n}{V}$$',
  d:'$$D = \\dfrac{m_{dd}}{V_{dd}}$$',
  conv:'$$C_M = \\dfrac{10 \\cdot D \\cdot C\\%}{M}$$'
};
function renderDD(){
  const t = document.getElementById('ddType').value;
  const box = document.getElementById('ddInputs');
  if(t==='cpercent'){
    box.innerHTML = `<div><label>m chất tan (g)</label><input type="number" id="d1"></div>
      <div><label>m dung dịch (g)</label><input type="number" id="d2"></div>`;
  } else if(t==='cm'){
    box.innerHTML = `<div><label>Số mol n (mol)</label><input type="number" id="d1"></div>
      <div><label>Thể tích V (lít)</label><input type="number" id="d2"></div>`;
  } else if(t==='d'){
    box.innerHTML = `<div><label>m dung dịch (g)</label><input type="number" id="d1"></div>
      <div><label>V dung dịch (ml)</label><input type="number" id="d2"></div>`;
  } else {
    box.innerHTML = `<div><label>Khối lượng riêng D (g/ml)</label><input type="number" id="d1"></div>
      <div><label>Nồng độ % (C%)</label><input type="number" id="d2"></div>
      <div><label>Khối lượng mol M (g/mol)</label><input type="number" id="d3"></div>`;
  }
  document.getElementById('ddFormula').innerHTML = ddFormulas[t];
  tex(document.getElementById('ddFormula'));
  document.getElementById('ddResult').textContent = '—';
}
renderDD();
function calcDD(){
  const t = document.getElementById('ddType').value;
  const r = document.getElementById('ddResult');
  const d1 = parseFloat(document.getElementById('d1')?.value);
  const d2 = parseFloat(document.getElementById('d2')?.value);
  const d3 = parseFloat(document.getElementById('d3')?.value);
  if(t==='cpercent'){
    if(isNaN(d1)||isNaN(d2)||d2===0){r.textContent='Nhập đủ m_ct và m_dd.'; return;}
    const val = d1/d2*100;
    renderSteps(r, [
      `Xác định công thức: $C\\% = \\dfrac{m_{ct}}{m_{dd}} \\times 100\\%$`,
      `Thay số: $m_{ct} = ${d1}$ g, $m_{dd} = ${d2}$ g`,
      `Tính toán: $C\\% = \\dfrac{${d1}}{${d2}} \\times 100\\% = ${val.toFixed(2)}\\%$`
    ], `C% = ${val.toFixed(2)}%`);
  } else if(t==='cm'){
    if(isNaN(d1)||isNaN(d2)||d2===0){r.textContent='Nhập đủ n và V.'; return;}
    const val = d1/d2;
    renderSteps(r, [
      `Xác định công thức: $C_M = \\dfrac{n}{V}$`,
      `Thay số: $n = ${d1}$ mol, $V = ${d2}$ lít`,
      `Tính toán: $C_M = \\dfrac{${d1}}{${d2}} = ${val.toFixed(3)}$`
    ], `C_M = ${val.toFixed(3)} mol/l`);
  } else if(t==='d'){
    if(isNaN(d1)||isNaN(d2)||d2===0){r.textContent='Nhập đủ m_dd và V_dd.'; return;}
    const val = d1/d2;
    renderSteps(r, [
      `Xác định công thức: $D = \\dfrac{m_{dd}}{V_{dd}}$`,
      `Thay số: $m_{dd} = ${d1}$ g, $V_{dd} = ${d2}$ ml`,
      `Tính toán: $D = \\dfrac{${d1}}{${d2}} = ${val.toFixed(3)}$`
    ], `D = ${val.toFixed(3)} g/ml`);
  } else {
    if(isNaN(d1)||isNaN(d2)||isNaN(d3)||d3===0){r.textContent='Nhập đủ D, C% và M.'; return;}
    const val = 10*d1*d2/d3;
    renderSteps(r, [
      `Xác định công thức: $C_M = \\dfrac{10 \\cdot D \\cdot C\\%}{M}$`,
      `Thay số: $D = ${d1}$ g/ml, $C\\% = ${d2}$, $M = ${d3}$ g/mol`,
      `Tính toán: $C_M = \\dfrac{10 \\times ${d1} \\times ${d2}}{${d3}} = ${val.toFixed(3)}$`
    ], `C_M = ${val.toFixed(3)} mol/l`);
  }
}

/* ---------------- FLASHCARDS (HÓA TRỊ) ---------------- */
const elements = [
  {sym:'H', name:'Hydrogen', val:'I', group:'Phi kim'},
  {sym:'O', name:'Oxygen', val:'II', group:'Phi kim'},
  {sym:'F', name:'Florine', val:'I', group:'Phi kim'},
  {sym:'Cl', name:'Chlorine', val:'I', group:'Phi kim'},
  {sym:'Br', name:'Bromine', val:'I', group:'Phi kim'},
  {sym:'I', name:'Iodine', val:'I', group:'Phi kim'},
  {sym:'Na', name:'Sodium', val:'I', group:'Kim loại'},
  {sym:'K', name:'Potassium', val:'I', group:'Kim loại'},
  {sym:'Ag', name:'Silver', val:'I', group:'Kim loại'},
  {sym:'Ca', name:'Calcium', val:'II', group:'Kim loại'},
  {sym:'Ba', name:'Barium', val:'II', group:'Kim loại'},
  {sym:'Mg', name:'Magnesium', val:'II', group:'Kim loại'},
  {sym:'Zn', name:'Zinc', val:'II', group:'Kim loại'},
  {sym:'Al', name:'Aluminium', val:'III', group:'Kim loại'},
  {sym:'Au', name:'Gold', val:'III', group:'Kim loại'},
  {sym:'Fe', name:'Iron', val:'II, III', group:'Kim loại (nhiều hóa trị)'},
  {sym:'Cu', name:'Copper', val:'I, II', group:'Kim loại (nhiều hóa trị)'},
  {sym:'C', name:'Carbon', val:'II, IV', group:'Phi kim (nhiều hóa trị)'},
  {sym:'N', name:'Nitrogen', val:'I,II,III,IV,V', group:'Phi kim (nhiều hóa trị)'},
  {sym:'S', name:'Sulfur', val:'II,IV,VI', group:'Phi kim (nhiều hóa trị)'},
];
let fcIndex = 0;
let fcFlippedSet = new Set();
function showCard(){
  const el = elements[fcIndex];
  document.getElementById('fcard').classList.remove('flipped');
  document.getElementById('fcSym').textContent = el.sym;
  document.getElementById('fcName').textContent = el.name;
  document.getElementById('fcVal').textContent = `Hóa trị ${el.val}`;
  document.getElementById('fcGroup').textContent = el.group;
  document.getElementById('fcCount').textContent = `${fcIndex+1} / ${elements.length}`;
}
function flipCard(){
  const flipped = document.getElementById('fcard').classList.toggle('flipped');
  if(flipped && !fcFlippedSet.has(fcIndex)){
    fcFlippedSet.add(fcIndex);
    awardXP(2);
  }
}
function nextCard(){ fcIndex = (fcIndex+1)%elements.length; showCard(); }
function prevCard(){ fcIndex = (fcIndex-1+elements.length)%elements.length; showCard(); }
showCard();

/* Chem Miner 3D is loaded from modular files below. */
/* ---------------- PERIODIC MINI ---------------- */
const commonEls = [
  {z:1,sym:'H',name:'Hydrogen',mass:1,val:'I',apps:'Nhiên liệu tên lửa, sản xuất amoniac (phân bón).'},
  {z:6,sym:'C',name:'Carbon',mass:12,val:'II, IV',apps:'Kim cương, than chì, thành phần cốt lõi của mọi hợp chất hữu cơ.'},
  {z:7,sym:'N',name:'Nitrogen',mass:14,val:'I–V',apps:'Chiếm ~78% không khí, dùng làm phân đạm.'},
  {z:8,sym:'O',name:'Oxygen',mass:16,val:'II',apps:'Cần cho hô hấp và sự cháy.'},
  {z:9,sym:'F',name:'Florine',mass:19,val:'I',apps:'Kem đánh răng (fluor hóa), chống sâu răng.'},
  {z:11,sym:'Na',name:'Sodium',mass:23,val:'I',apps:'Muối ăn (NaCl), đèn hơi natri chiếu sáng đường phố.'},
  {z:12,sym:'Mg',name:'Magnesium',mass:24,val:'II',apps:'Hợp kim nhẹ (khung xe, máy bay), pháo hoa ánh sáng trắng.'},
  {z:13,sym:'Al',name:'Aluminium',mass:27,val:'III',apps:'Vỏ lon nước ngọt, khung cửa, giấy bạc.'},
  {z:16,sym:'S',name:'Sulfur',mass:32,val:'II,IV,VI',apps:'Sản xuất H₂SO₄, lưu hóa cao su.'},
  {z:17,sym:'Cl',name:'Chlorine',mass:35.5,val:'I',apps:'Khử trùng nước máy, sản xuất nhựa PVC.'},
  {z:19,sym:'K',name:'Potassium',mass:39,val:'I',apps:'Phân kali cho cây trồng.'},
  {z:20,sym:'Ca',name:'Calcium',mass:40,val:'II',apps:'Xương, răng, đá vôi, xi măng.'},
  {z:26,sym:'Fe',name:'Iron',mass:56,val:'II, III',apps:'Xây dựng, cầu đường, thép.'},
  {z:29,sym:'Cu',name:'Copper',mass:64,val:'I, II',apps:'Dây điện, ống nước nhờ dẫn điện/nhiệt tốt.'},
  {z:30,sym:'Zn',name:'Zinc',mass:65,val:'II',apps:'Mạ kẽm chống gỉ cho sắt thép.'},
  {z:47,sym:'Ag',name:'Silver',mass:108,val:'I',apps:'Trang sức, tiếp điểm điện tử, có tính kháng khuẩn.'},
  {z:56,sym:'Ba',name:'Barium',mass:137,val:'II',apps:'Barium sulfate dùng trong chụp X-quang tiêu hóa.'},
  {z:82,sym:'Pb',name:'Lead',mass:207,val:'II, IV',apps:'Ắc quy chì-acid (trước đây dùng trong sơn, xăng — nay hạn chế vì độc tính).'},
];

function shellConfig(z){
  const capacities = [2,8,8,2];
  let shells = [], remaining = z;
  for(const cap of capacities){
    if(remaining<=0) break;
    const take = Math.min(cap, remaining);
    shells.push(take);
    remaining -= take;
  }
  return {shells, remainder:remaining};
}
function shellDiagramSVG(shells){
  const cx=75, cy=75;
  let svg = `<svg viewBox="0 0 150 150">`;
  svg += `<circle cx="${cx}" cy="${cy}" r="7" fill="var(--navy-900)"/>`;
  shells.forEach((count,i)=>{
    const r = 20 + i*18;
    svg += `<circle cx="${cx}" cy="${cy}" r="${r}" fill="none" stroke="var(--sky-300)" stroke-width="1.5" stroke-dasharray="3,3"/>`;
    for(let e=0;e<count;e++){
      const angle = (2*Math.PI*e/count) - Math.PI/2;
      const ex = cx + r*Math.cos(angle);
      const ey = cy + r*Math.sin(angle);
      svg += `<circle cx="${ex.toFixed(1)}" cy="${ey.toFixed(1)}" r="4" fill="var(--yellow-500)" stroke="var(--navy-900)" stroke-width="1"/>`;
    }
  });
  svg += `</svg>`;
  return svg;
}
async function loadElementWikiImage(name,sym){
  const figure=document.getElementById('wikiElementMedia'),img=document.getElementById('wikiElementImage'),link=document.getElementById('wikiElementLink');
  if(!figure||!img||!link)return;
  figure.hidden=true;img.removeAttribute('src');
  const pageName=name==='Florine'?'Fluorine':name;
  try{
    const response=await fetch(`https://en.wikipedia.org/api/rest_v1/page/summary/${encodeURIComponent(pageName)}`,{headers:{Accept:'application/json'}});
    if(!response.ok)throw new Error('Wikipedia image unavailable');
    const data=await response.json();
    if(document.querySelector('.nuclear-element')?.textContent.trim()!==sym)return;
    const source=data.thumbnail?.source||data.originalimage?.source;
    if(!source)return;
    img.src=source;img.alt=`Ảnh minh họa nguyên tố ${name} (${sym}) từ Wikipedia`;
    link.href=data.content_urls?.desktop?.page||`https://en.wikipedia.org/wiki/${encodeURIComponent(pageName)}`;
    figure.hidden=false;
  }catch(error){figure.hidden=true}
}
function openElModal(el){
  const {shells, remainder}=shellConfig(el.z);
  const massNumber=el.sym==='Cl'?35:Math.round(el.mass);
  const neutronCount=Math.max(0,massNumber-el.z);
  let shellHtml;
  if(remainder===0){
    shellHtml=`<div class="shell-wrap">${shellDiagramSVG(shells)}</div><p class="em-caveat">Cấu hình lớp electron: ${shells.join(' – ')} (mô hình đơn giản hóa)</p>`;
  }else{
    shellHtml=`<p class="em-caveat" style="margin-top:10px;">Nguyên tố có cấu hình electron phức tạp hơn (có phân lớp d) — mô hình lớp đơn giản không áp dụng chính xác, sẽ học chi tiết ở cấp THPT.</p>`;
  }
  document.getElementById('elModalBox').innerHTML=`
    <div class="el-modal-head">
      <span class="em-z">Kí hiệu hạt nhân</span>
      <button class="em-close" onclick="closeElModal()" aria-label="Đóng">✕</button>
      <figure class="wiki-element-media" id="wikiElementMedia" hidden><img id="wikiElementImage" alt="" loading="lazy"><a id="wikiElementLink" class="wiki-image-link" href="#" target="_blank" rel="noopener noreferrer" aria-label="Xem nguồn ảnh"><span class="sr-only">Nguồn ảnh</span></a></figure>
      <div class="nuclear-symbol" aria-label="Số khối ${massNumber}, số hiệu nguyên tử ${el.z}, nguyên tố ${el.sym}"><span class="nuclear-numbers"><sup>${massNumber}</sup><sub>${el.z}</sub></span><span class="nuclear-element">${el.sym}</span></div>
      <div class="em-name">${el.name}</div>
    </div>
    <div class="el-modal-body">

      <div class="em-row"><span>Số khối gần đúng</span><b>A = ${massNumber}</b></div>
      <div class="em-row"><span>Khối lượng mol</span><b>${el.mass} g/mol</b></div>
      <div class="em-row"><span>Hóa trị thường gặp</span><b>${el.val}</b></div>
      ${shellHtml}
      <p class="note" style="margin-top:10px;"><b>Ứng dụng:</b> ${el.apps}</p>
    </div>`;
  document.getElementById('elModalOverlay').classList.add('open');loadElementWikiImage(el.name,el.sym);soundClick();
}function closeElModal(){
  document.getElementById('elModalOverlay').classList.remove('open');
}
const grid = document.getElementById('ptableGrid');
commonEls.forEach(el=>{
  const d = document.createElement('div');
  d.className = 'pel';
  d.innerHTML = `<span class="z">${el.z}</span><span class="s">${el.sym}</span><span class="m">${el.mass}</span>`;
  d.onclick = ()=> openElModal(el);
  grid.appendChild(d);
});

/* ---------------- IUPAC LIVE SEARCH ---------------- */
const iupacData = [
  {old:'Natri', iupac:'Sodium', sym:'Na'},
  {old:'Kali', iupac:'Potassium', sym:'K'},
  {old:'Sắt', iupac:'Iron', sym:'Fe'},
  {old:'Đồng', iupac:'Copper', sym:'Cu'},
  {old:'Bạc', iupac:'Silver', sym:'Ag'},
  {old:'Chì', iupac:'Lead', sym:'Pb'},
  {old:'Thủy ngân', iupac:'Mercury', sym:'Hg'},
  {old:'Vàng', iupac:'Gold', sym:'Au'},
  {old:'Nhôm', iupac:'Aluminium', sym:'Al'},
  {old:'Kẽm', iupac:'Zinc', sym:'Zn'},
  {old:'Canxi', iupac:'Calcium', sym:'Ca'},
  {old:'Magie', iupac:'Magnesium', sym:'Mg'},
  {old:'Bari', iupac:'Barium', sym:'Ba'},
  {old:'Thiếc', iupac:'Tin', sym:'Sn'},
  {old:'Lưu huỳnh', iupac:'Sulfur', sym:'S'},
  {old:'Nitơ', iupac:'Nitrogen', sym:'N'},
  {old:'Muối ăn (NaCl)', iupac:'Sodium chloride', sym:'NaCl'},
  {old:'Xút ăn da (NaOH)', iupac:'Sodium hydroxide', sym:'NaOH'},
  {old:'Vôi sống (CaO)', iupac:'Calcium oxide', sym:'CaO'},
  {old:'Đá vôi (CaCO₃)', iupac:'Calcium carbonate', sym:'CaCO₃'},
  {old:'Giấm ăn (CH₃COOH)', iupac:'Acetic acid', sym:'CH₃COOH'},
  {old:'Muối nở (NaHCO₃)', iupac:'Sodium bicarbonate', sym:'NaHCO₃'},
];
function renderIupacSearch(){
  const q = document.getElementById('iupacSearch').value.trim().toLowerCase();
  const box = document.getElementById('iupacResults');
  let list = iupacData;
  if(q){
    list = iupacData.filter(item =>
      item.old.toLowerCase().includes(q) || item.iupac.toLowerCase().includes(q) || item.sym.toLowerCase().includes(q)
    );
  }
  if(list.length===0){
    box.innerHTML = `<p class="note" style="text-align:center;">Không tìm thấy "${document.getElementById('iupacSearch').value}"</p>`;
    return;
  }
  box.innerHTML = `<table class="tt"><tr><th>Tên quen thuộc (cũ)</th><th>Tên IUPAC</th></tr>${
    list.map(item=>`<tr><td>${item.old}</td><td><b>${item.iupac}</b> ${item.sym.length<=2?`(${item.sym})`:''}</td></tr>`).join('')
  }</table>`;
}
renderIupacSearch();

/* ---------------- PTHH PRACTICE ---------------- */
const pthhList = [
  {label:'Khí hydrogen cháy trong oxygen', unbal:String.raw`\mathrm{H_2+O_2}\xrightarrow{\ t^\circ\ }\mathrm{H_2O}`, bal:String.raw`2\mathrm{H_2}+\mathrm{O_2}\xrightarrow{\ t^\circ\ }2\mathrm{H_2O}`, note:'Cân bằng H trước: đặt 2 trước H₂O, sau đó đặt 2 trước H₂.'},
  {label:'Magnesium tác dụng với oxygen', unbal:String.raw`\mathrm{Mg+O_2}\xrightarrow{\ t^\circ\ }\mathrm{MgO}`, bal:String.raw`2\mathrm{Mg}+\mathrm{O_2}\xrightarrow{\ t^\circ\ }2\mathrm{MgO}`, note:'Kim loại tác dụng với phi kim cần đun nóng. O₂ có 2 nguyên tử O nên đặt 2 trước MgO, rồi cân bằng Mg.'},
  {label:'Sắt tác dụng với sulfur', unbal:String.raw`\mathrm{Fe+S}\xrightarrow{\ t^\circ\ }\mathrm{FeS}`, bal:String.raw`\mathrm{Fe+S}\xrightarrow{\ t^\circ\ }\mathrm{FeS}`, note:'Phản ứng kim loại–phi kim cần nhiệt độ; phương trình đã cân bằng theo tỉ lệ 1 : 1 : 1.'},
  {label:'Kẽm tác dụng với dung dịch HCl', unbal:String.raw`\mathrm{Zn+HCl\longrightarrow ZnCl_2+H_2}`, bal:String.raw`\mathrm{Zn+2HCl\longrightarrow ZnCl_2+H_2}`, note:'ZnCl₂ có 2 Cl nên đặt hệ số 2 trước HCl; khi đó H cũng cân bằng.'},
  {label:'Sắt tác dụng với dung dịch CuSO₄', unbal:String.raw`\mathrm{Fe+CuSO_4\longrightarrow FeSO_4+Cu}`, bal:String.raw`\mathrm{Fe+CuSO_4\longrightarrow FeSO_4+Cu}`, note:'Giữ nguyên nhóm SO₄ ở hai vế. Phương trình đã cân bằng theo tỉ lệ 1 : 1 : 1 : 1.'},
  {label:'Đốt cháy methane', unbal:String.raw`\mathrm{CH_4+O_2}\xrightarrow{\ t^\circ\ }\mathrm{CO_2+H_2O}`, bal:String.raw`\mathrm{CH_4}+2\mathrm{O_2}\xrightarrow{\ t^\circ\ }\mathrm{CO_2}+2\mathrm{H_2O}`, note:'Cân bằng C, rồi H, cuối cùng O: 4H cần 2H₂O; tổng 4O ở sản phẩm cần 2O₂.'}
];
const pthhSel = document.getElementById('pthhPick');
pthhList.forEach((p,i)=>{const o=document.createElement('option');o.value=i;o.textContent=p.label;pthhSel.appendChild(o)});
function renderPTHH(){
  const p=pthhList[pthhSel.value||0];
  const box=document.getElementById('pthhResult');
  box.innerHTML=`<div class="pthh-math"><small>Sơ đồ phản ứng</small>$${p.unbal}$</div><div class="pthh-math"><small>Phương trình đã cân bằng</small>$${p.bal}$</div><p class="pthh-note">${p.note}</p>`;
  tex(box);
}
renderPTHH();

/* ---------------- SOLUBILITY RULES ---------------- */
const rules = [
  'Tất cả các muối chứa Na, K, NH₄ đều tan.',
  'Tất cả các muối chứa NO₃ đều tan.',
  'Hầu hết muối chứa Cl, Br, I đều tan trừ muối của Ag và Pb.',
  'Đa số các muối chứa SO₄ đều tan trừ muối của Ba và Pb.',
  'Hầu hết các bazơ đều kết tủa trừ LiOH, NaOH, KOH, Ba(OH)₂, Ca(OH)₂.',
  'Đa số các muối chứa SO₃, CO₃, PO₄ đều kết tủa trừ muối của Na, K, NH₄.',
];
const solBox = document.getElementById('solRules');
rules.forEach((txt,i)=>{
  const item = document.createElement('div');
  item.className = 'acc-item' + (i===0?' open':'');
  item.innerHTML = `<div class="acc-head">Quy tắc ${i+1} <span class="arrow">▾</span></div>
    <div class="acc-body"><div class="acc-body-in">${txt}</div></div>`;
  item.querySelector('.acc-head').onclick = ()=>item.classList.toggle('open');
  solBox.appendChild(item);
});

/* ---------------- pH SLIDER ---------------- */
function hexToRgb(hex){hex=hex.replace('#','');const n=parseInt(hex,16);return [(n>>16)&255,(n>>8)&255,n&255];}
function blendColor(hex1,hex2,t){
  t = Math.max(0,Math.min(1,t));
  const a=hexToRgb(hex1), b=hexToRgb(hex2);
  const c=a.map((v,i)=>Math.round(v+(b[i]-v)*t));
  return `rgb(${c[0]},${c[1]},${c[2]})`;
}
const universalStops = [
  {ph:0, hex:'#D7263D'},{ph:2, hex:'#F46A25'},{ph:4, hex:'#F8B400'},{ph:6, hex:'#F6E04D'},
  {ph:7, hex:'#9FD356'},{ph:8, hex:'#3FA34D'},{ph:10,hex:'#1C7ED6'},{ph:12,hex:'#3A3F9E'},{ph:14,hex:'#5C2D91'}
];
function universalColor(v){
  for(let i=0;i<universalStops.length-1;i++){
    const a=universalStops[i], b=universalStops[i+1];
    if(v>=a.ph && v<=b.ph) return blendColor(a.hex, b.hex, (v-a.ph)/(b.ph-a.ph));
  }
  return universalStops[universalStops.length-1].hex;
}
function litmusColor(v){
  if(v<=5) return '#D64545';
  if(v>=9) return '#3B6FC4';
  if(v<7) return blendColor('#D64545','#8E6FB0',(v-5)/2);
  return blendColor('#8E6FB0','#3B6FC4',(v-7)/2);
}
function phenolColor(v){
  if(v<8.2) return '#DCEEFF';
  if(v>=9.5) return '#E85AAE';
  return blendColor('#DCEEFF','#E85AAE',(v-8.2)/1.3);
}
function updatePH(){
  const v = parseInt(document.getElementById('phSlider').value);
  const indType = document.getElementById('indicatorType').value;
  document.getElementById('phMark').style.left = (v/14*100)+'%';
  let label, color, ex;
  if(v<7){label='Môi trường AXIT'; color='#c0392b'; ex='VD: HCl, H₂S, CH₃COOH…';}
  else if(v===7){label='Môi trường TRUNG TÍNH'; color='#333'; ex='VD: NaCl, H₂O…';}
  else {label='Môi trường BAZƠ'; color='#2255aa'; ex='VD: NH₃, NaOH, KOH…';}

  let liquidColor, indNote;
  if(indType==='litmus'){
    liquidColor = litmusColor(v);
    indNote = v<7 ? 'Quỳ tím hóa đỏ' : (v===7 ? 'Quỳ tím không đổi màu' : 'Quỳ tím hóa xanh');
  } else if(indType==='phenol'){
    liquidColor = phenolColor(v);
    indNote = v<8.2 ? 'Phenolphthalein không đổi màu (trong suốt)' : 'Phenolphthalein hóa hồng';
  } else {
    liquidColor = universalColor(v);
    indNote = 'Chỉ thị vạn năng đổi màu liên tục theo từng mức pH';
  }
  document.getElementById('beakerLiquid').style.fill = liquidColor;
  document.getElementById('phInfo').innerHTML = `pH = <b>${v}</b> — <span style="color:${color};">${label}</span><br><span style="font-weight:600;font-size:12.5px;">${indNote} · ${ex}</span>`;
}
updatePH();

/* ---------------- ACTIVITY SERIES ---------------- */
const series = ['K','Na','Ba','Ca','Mg','Al','Zn','Fe','Ni','Sn','Pb','(H)','Cu','Hg','Ag','Pt','Au'];
const sRow = document.getElementById('seriesRow');
series.forEach(s=>{
  const d = document.createElement('div');
  d.className = 'series-el' + (s==='(H)'?' h':'');
  d.textContent = s;
  sRow.appendChild(d);
});

/* ---------------- DISPLACEMENT REACTION SIMULATOR ---------------- */
function gcdNum(a,b){ return b ? gcdNum(b,a%b) : a; }
const subDigits = {0:'₀',1:'₁',2:'₂',3:'₃',4:'₄',5:'₅',6:'₆',7:'₇',8:'₈',9:'₉'};
function toSub(n){ return String(n).split('').map(c=>subDigits[c]||c).join(''); }
const dispMetalData = {
  Mg:{valence:2, colorLiquid:'#DCEEFF', colorDeposit:'#C9C9C9'},
  Al:{valence:3, colorLiquid:'#DCEEFF', colorDeposit:'#D8D8D8'},
  Zn:{valence:2, colorLiquid:'#DCEEFF', colorDeposit:'#B0B0B0'},
  Fe:{valence:2, colorLiquid:'#BFE0B4', colorDeposit:'#8A8A8A'},
  Cu:{valence:2, colorLiquid:'#8FC1E8', colorDeposit:'#B5651D'},
  Ag:{valence:1, colorLiquid:'#EAF4FF', colorDeposit:'#C7C7C7'},
};
const dispSaltData = {
  CuSO4:{cation:'Cu', valence:2, anion:'SO₄', anionValence:2, name:'CuSO₄'},
  AgNO3:{cation:'Ag', valence:1, anion:'NO₃', anionValence:1, name:'AgNO₃'},
  FeSO4:{cation:'Fe', valence:2, anion:'SO₄', anionValence:2, name:'FeSO₄'},
  ZnSO4:{cation:'Zn', valence:2, anion:'SO₄', anionValence:2, name:'ZnSO₄'},
  MgSO4:{cation:'Mg', valence:2, anion:'SO₄', anionValence:2, name:'MgSO₄'},
};
function saltFormula(cationSym, cationValence, anionSym, anionValence){
  const g = gcdNum(cationValence, anionValence);
  const x = anionValence/g; // subscript for cation
  const y = cationValence/g; // subscript for anion group
  const cationPart = x>1 ? cationSym+toSub(x) : cationSym;
  const anionPart = y>1 ? `(${anionSym})${toSub(y)}` : anionSym;
  return cationPart+anionPart;
}
function renderDisplacement(){
  const m = document.getElementById('dispMetal').value;
  const s = document.getElementById('dispSalt').value;
  document.getElementById('dispResult').textContent = 'Chọn kim loại và muối rồi bấm nút để xem phản ứng.';
  document.getElementById('dispDeposit').setAttribute('height', 0);
  document.getElementById('dispStrip').style.fill = '#9aa4b2';
  document.getElementById('dispLiquid').style.fill = dispMetalData[dispSaltData[s].cation]?.colorLiquid || '#DCEEFF';
}
function playDisplacement(){
  const mSym = document.getElementById('dispMetal').value;
  const sKey = document.getElementById('dispSalt').value;
  const salt = dispSaltData[sKey];
  const metal = dispMetalData[mSym];
  const resultBox = document.getElementById('dispResult');
  const liquid = document.getElementById('dispLiquid');
  const strip = document.getElementById('dispStrip');
  const deposit = document.getElementById('dispDeposit');

  if(mSym === salt.cation){
    resultBox.innerHTML = `<b>Không xảy ra phản ứng.</b><br><span style="font-weight:600;font-size:12.5px;">${mSym} chính là kim loại đã có trong muối ${salt.name}, nên không có phản ứng đẩy nào xảy ra.</span>`;
    soundWrong();
    return;
  }
  const idxMetal = series.indexOf(mSym);
  const idxCation = series.indexOf(salt.cation);
  if(idxMetal > idxCation){
    resultBox.innerHTML = `<b>Không xảy ra phản ứng.</b><br><span style="font-weight:600;font-size:12.5px;">${mSym} đứng sau ${salt.cation} trong dãy hoạt động hóa học nên không đẩy được ${salt.cation} ra khỏi dung dịch muối.</span>`;
    soundWrong();
    return;
  }
  // Reaction occurs. Since all salts in this dataset are matched-valence (cation valence = anion valence),
  // the balanced equation is: p*Metal + q*Salt -> 1*(Metal salt) + q*Cation
  // where p = anionValence/gcd(metalValence,anionValence), q = metalValence/gcd(metalValence,anionValence)
  const g = gcdNum(metal.valence, salt.anionValence);
  const coeffMetal = salt.anionValence / g;   // = p
  const coeffSalt = metal.valence / g;        // = q
  const metalSaltFormula = saltFormula(mSym, metal.valence, salt.anion, salt.anionValence);
  const newSaltName = metalSaltFormula; // coefficient is always 1 for the product salt
  const reactantSalt = coeffSalt>1 ? `${coeffSalt}${salt.name}` : salt.name;
  const reactantMetal = coeffMetal>1 ? `${coeffMetal}${mSym}` : mSym;
  const productCation = coeffSalt>1 ? `${coeffSalt}${salt.cation}` : salt.cation;

  liquid.style.fill = metal.colorLiquid;
  strip.style.fill = salt.cation === 'Ag' ? '#C7C7C7' : metal.colorDeposit;
  deposit.style.fill = dispMetalData[salt.cation]?.colorDeposit || '#B5651D';
  deposit.setAttribute('y', 60);
  deposit.setAttribute('height', 18);

  resultBox.innerHTML = `<b>Có phản ứng xảy ra!</b><br>
    <span style="font-weight:700;">${reactantMetal} + ${reactantSalt} → ${newSaltName} + ${productCation}</span><br>
    <span style="font-weight:600;font-size:12.5px;">${mSym} đứng trước ${salt.cation} trong dãy hoạt động nên đẩy được ${salt.cation} ra khỏi muối. Lớp kim loại ${salt.cation} bám vào thanh ${mSym}, dung dịch chuyển màu do ion ${mSym} thay thế ion ${salt.cation}.</span>`;
  soundCorrect();
  awardXP(6);
}
renderDisplacement();

/* ---------------- QUIZ ---------------- */
const quizData = [
  {q:'Công thức tính số mol theo khối lượng là?', opts:['$n = \\dfrac{m}{M}$','$n = \\dfrac{V}{24{,}79}$','$n = C_M \\cdot V$','$n = m \\cdot M$'], correct:0,
   topic:'Công thức', explain:'Số mol theo khối lượng luôn tính bằng khối lượng chia cho khối lượng mol: n = m/M.'},
  {q:'Ở điều kiện chuẩn (đkc) theo chương trình mới, 1 mol khí có thể tích bao nhiêu lít?', opts:['22,4 lít','24,79 lít','20 lít','25 lít'], correct:1,
   topic:'Công thức', explain:'Chương trình mới quy ước đkc ở 25°C, 1 bar → 1 mol khí chiếm 24,79 lít (22,4 lít là điều kiện tiêu chuẩn cũ 0°C, 1 atm).'},
  {q:'Sắt (Fe) có những hóa trị nào?', opts:['I','I, II','II, III','III, IV'], correct:2,
   topic:'Hóa trị', explain:'Fe là kim loại có nhiều hóa trị: II và III, tùy hợp chất (VD: FeO hóa trị II, Fe₂O₃ hóa trị III).'},
  {q:'Các nguyên tố trong bảng tuần hoàn được sắp xếp theo chiều tăng dần của đại lượng nào?', opts:['Khối lượng nguyên tử','Điện tích hạt nhân','Số neutron','Bán kính nguyên tử'], correct:1,
   topic:'Bảng tuần hoàn', explain:'Bảng tuần hoàn sắp xếp theo số hiệu nguyên tử (= điện tích hạt nhân = số proton) tăng dần.'},
  {q:'Muối nào sau đây luôn tan trong nước?', opts:['BaSO₄','AgCl','Na₂CO₃','CaCO₃'], correct:2,
   topic:'Tan / pH / Quỳ', explain:'Tất cả các muối chứa Na, K, NH₄ đều tan — Na₂CO₃ luôn tan, còn lại là các kết tủa quen thuộc.'},
  {q:'Quỳ tím chuyển sang màu gì trong môi trường axit?', opts:['Xanh','Đỏ','Không đổi màu','Vàng'], correct:1,
   topic:'Tan / pH / Quỳ', explain:'Acid làm quỳ tím hóa đỏ; base làm quỳ tím hóa xanh; trung tính thì quỳ tím không đổi màu.'},
  {q:'Kim loại nào sau đây KHÔNG phản ứng với HCl loãng?', opts:['Zn','Fe','Cu','Mg'], correct:2,
   topic:'Dãy hoạt động', explain:'Cu đứng sau H trong dãy hoạt động hóa học nên không phản ứng được với acid loãng như HCl.'},
  {q:'Kết tủa Cu(OH)₂ có màu gì?', opts:['Trắng','Đỏ nâu','Xanh lam','Đen'], correct:2,
   topic:'Dãy hoạt động', explain:'Cu(OH)₂ có màu xanh lam đặc trưng — một trong những kết tủa dễ nhận biết nhất.'},
  {q:'Khí nào làm đục nước vôi trong?', opts:['H₂','O₂','CO₂','N₂'], correct:2,
   topic:'Dãy hoạt động', explain:'CO₂ phản ứng với Ca(OH)₂ tạo kết tủa trắng CaCO₃ làm đục nước vôi trong — đây là cách nhận biết khí CO₂ phổ biến nhất.'},
  {q:'Cốc thủy tinh là vật thể, còn thủy tinh được gọi là gì?', opts:['Hỗn hợp','Chất','Dung dịch','Nguyên tố'], correct:1,
   topic:'Nền tảng', explain:'Vật thể là đối tượng ta nhìn thấy (cốc); chất là thành phần cấu tạo nên vật thể đó (thủy tinh).'},
  {q:'Quá trình nước lỏng chuyển thành hơi nước là loại biến đổi nào?', opts:['Biến đổi hóa học','Biến đổi vật lí','Phản ứng hóa học','Biến tính'], correct:1,
   topic:'Nền tảng', explain:'Nước vẫn là nước (H₂O), không có chất mới sinh ra → đây là biến đổi vật lí (bay hơi).'},
  {q:'Trong nguyên tử trung hòa về điện, ta có hệ thức nào đúng?', opts:['số p = số n','số p = số e','số n = số e','số p + số e = 0'], correct:1,
   topic:'Nền tảng', explain:'Nguyên tử trung hòa điện vì số proton (điện tích +) bằng số electron (điện tích −).'},
  {q:'O₂ được gọi là gì trong hóa học?', opts:['Nguyên tử oxygen','Phân tử oxygen','Nguyên tố oxygen','Hợp chất oxygen'], correct:1,
   topic:'Nền tảng', explain:'O₂ gồm 2 nguyên tử oxygen liên kết với nhau → đây là một phân tử oxygen (đơn chất).'},
  {q:'Định luật bảo toàn khối lượng phát biểu điều gì?', opts:['Số mol không đổi','Khối lượng chất phản ứng bằng khối lượng sản phẩm','Thể tích khí luôn là 22,4 lít','Nguyên tử luôn bị phá vỡ'], correct:1,
   topic:'Phản ứng & PTHH', explain:'Vì nguyên tử không tự sinh ra hay mất đi trong phản ứng, nên tổng khối lượng được bảo toàn.'},
  {q:'Khi cân bằng phương trình hóa học, ta được phép thay đổi gì?', opts:['Chỉ số trong công thức', 'Hệ số trước công thức', 'Cả chỉ số và hệ số', 'Không được thay đổi gì'], correct:1,
   topic:'Phản ứng & PTHH', explain:'Chỉ số nằm trong công thức chất, thay đổi nó sẽ tạo ra chất khác — chỉ được thêm hệ số đứng trước.'},
  {q:'Alkane có công thức tổng quát nào?', opts:['$C_nH_{2n}$', '$C_nH_{2n+2}$', '$C_nH_{2n-2}$', '$C_nH_{2n+1}$'], correct:1,
   topic:'Hữu cơ', explain:'Alkane là hydrocarbon no, mạch hở, có công thức tổng quát CₙH₂ₙ₊₂ (n≥1).'},
  {q:'Giấm ăn có chứa hợp chất hữu cơ nào?', opts:['$C_2H_5OH$','$CH_3COOH$','$C_6H_{12}O_6$','$CH_4$'], correct:1,
   topic:'Hữu cơ', explain:'Giấm ăn là dung dịch acetic acid (CH₃COOH) loãng khoảng 2–5%.'},
  {q:'Tên IUPAC của Fe₂O₃ (kèm hóa trị) là gì?', opts:['Iron oxide','Iron(II) oxide','Iron(III) oxide','Diiron trioxide'], correct:2,
   topic:'Danh pháp IUPAC', explain:'Fe có nhiều hóa trị nên cần ghi rõ số La Mã trong ngoặc: Fe₂O₃ ứng với Fe hóa trị III → Iron(III) oxide.'},
  {q:'P₂O₅ có tên IUPAC là gì?', opts:['Phosphorus oxide','Diphosphorus pentoxide','Phosphorus pentoxide','Diphosphorus oxide'], correct:1,
   topic:'Danh pháp IUPAC', explain:'Phi kim + oxide dùng tiền tố chỉ số nguyên tử: 2 P → "di", 5 O → "penta" (rút gọn thành "pentoxide").'},
];
let quizOrder = [], quizIdx = 0, score = 0, answered = 0, wrongTopics = [], quizStreak = 0;
function restartQuiz(){
  quizOrder = quizData.map((_,i)=>i);
  quizIdx = 0; score = 0; answered = 0; wrongTopics = []; quizStreak = 0;
  renderQuiz();
}
function assessLevel(pct){
  if(pct>=90) return {tier:'Xuất sắc', msg:'Con đã nắm rất chắc phần kiến thức này rồi!'};
  if(pct>=70) return {tier:'Khá tốt', msg:'Con hiểu phần lớn nội dung, chỉ cần ôn lại một vài chỗ nhỏ.'};
  if(pct>=50) return {tier:'Ổn, cần luyện thêm', msg:'Con đã nắm được kiến thức cơ bản, nên ôn thêm để chắc nền tảng hơn.'};
  return {tier:'Cần ôn lại từ đầu', msg:'Sai ở đây không sao — quan trọng là mình biết rõ cần ôn lại phần nào.'};
}
function renderQuiz(){
  const area = document.getElementById('quizArea');
  document.getElementById('quizScore').textContent = `Điểm: ${score} / ${quizData.length}`;
  if(quizIdx >= quizOrder.length){
    const pct = Math.round(score/quizData.length*100);
    const lvl = assessLevel(pct);
    const topicCount = {};
    wrongTopics.forEach(t=>{ topicCount[t] = (topicCount[t]||0)+1; });
    const weak = Object.entries(topicCount).sort((a,b)=>b[1]-a[1]);
    area.innerHTML = `
      <div class="q-box">
        <div class="q-text" style="font-size:16px;">Hoàn thành! Điểm cuối cùng: ${score} / ${quizData.length} (${pct}%)</div>
        <div class="result-box">
          <b>Mức độ hiểu bài: ${lvl.tier}</b><br>
          <span style="font-weight:600; font-size:12.8px;">${lvl.msg}</span>
        </div>
        ${weak.length ? `<div class="life-box" style="margin-top:10px;">
          <div class="life-txt">
            <div class="life-label">Nên ôn lại thêm</div>
            <div class="life-desc">${weak.map(w=>`<b>${w[0]}</b> (sai ${w[1]} câu)`).join(' · ')}</div>
          </div>
        </div>` : `<p class="note" style="margin-top:8px; text-align:center;">Không có phần nào cần ôn thêm cả — quá tuyệt vời!</p>`}
      </div>`;
    if(pct>=90){ confettiBurst(); awardXP(30); }
    return;
  }
  const item = quizData[quizOrder[quizIdx]];
  area.innerHTML = `<div class="q-box"><div class="q-text">Câu ${quizIdx+1}/${quizData.length} · <span style="color:var(--navy-700); font-weight:600;">${item.topic}</span>${quizStreak>=2 ? `<span class="streak-badge">Chuỗi ${quizStreak}</span>` : ''}<br>${item.q}</div>
    ${item.opts.map((o,i)=>`<button class="opt" data-i="${i}">${o}</button>`).join('')}
    <div id="quizExplain"></div>
    <div style="text-align:right; margin-top:8px;"><button class="btn ghost" id="quizNextBtn" style="display:none;" onclick="nextQuestion()">${quizIdx+1===quizData.length ? 'Xem kết quả' : 'Câu tiếp theo →'}</button></div>
  </div>`;
  tex(area);
  area.querySelectorAll('.opt').forEach(btn=>{
    btn.onclick = ()=>{
      const i = parseInt(btn.dataset.i);
      area.querySelectorAll('.opt').forEach(b=>b.disabled=true);
      if(i===item.correct){
        btn.classList.add('correct'); score++; quizStreak++;
        soundCorrect();
        const bonus = quizStreak>=5 ? 16 : (quizStreak>=3 ? 12 : 8);
        awardXP(bonus);
      }
      else {
        btn.classList.add('wrong');
        area.querySelector(`[data-i="${item.correct}"]`).classList.add('correct');
        wrongTopics.push(item.topic);
        quizStreak = 0;
        soundWrong();
      }
      answered++;
      document.getElementById('quizScore').textContent = `Điểm: ${score} / ${quizData.length}`;
      if(item.explain){
        document.getElementById('quizExplain').innerHTML = `<p class="note" style="margin-top:8px;">${item.explain}</p>`;
        tex(document.getElementById('quizExplain'));
      }
      document.getElementById('quizNextBtn').style.display = 'inline-block';
    };
  });
}
function nextQuestion(){ quizIdx++; renderQuiz(); }
restartQuiz();

/* ---------------- COMMAND PALETTE ---------------- */
const paletteIndex = [];
elements.forEach(e=>{
  paletteIndex.push({title:`${e.sym} — ${e.name}`, sub:`Hóa trị: ${e.val} · ${e.group}`, tag:'Hóa trị', tab:'p-valence', keywords:`${e.sym} ${e.name} ${e.val}`});
});
commonEls.forEach(e=>{
  paletteIndex.push({title:`${e.sym} — ${e.name}`, sub:`Số hiệu ${e.z} · M=${e.mass} · Hóa trị ${e.val}`, tag:'Bảng tuần hoàn', tab:'p-table', keywords:`${e.sym} ${e.name} nguyên tố ${e.z}`});
});
rules.forEach((r,i)=>{
  paletteIndex.push({title:`Quy tắc tan ${i+1}`, sub:r, tag:'Quy tắc tan', tab:'p-rules', keywords:`quy tắc tan kết tủa ${r}`});
});
const iupacIndex = [
  ['Natri','Sodium (Na)'],['Kali','Potassium (K)'],['Sắt','Iron (Fe)'],['Đồng','Copper (Cu)'],
  ['Bạc','Silver (Ag)'],['Chì','Lead (Pb)'],['Thủy ngân','Mercury (Hg)'],['Vàng','Gold (Au)'],
];
iupacIndex.forEach(([vi,en])=>{
  paletteIndex.push({title:`${vi} → ${en}`, sub:'Danh pháp IUPAC', tag:'IUPAC', tab:'p-iupac', keywords:`${vi} ${en} danh pháp iupac tên gọi`});
});
const conceptIndex = [
  {title:'Công thức tính số mol', sub:'n = m/M, n = V/24,79, n = C_M.V', tag:'Công thức', tab:'p-formula'},
  {title:'Nồng độ phần trăm C%', sub:'C% = m chất tan / m dung dịch × 100%', tag:'Công thức', tab:'p-formula'},
  {title:'Nồng độ mol C_M', sub:'C_M = n / V', tag:'Công thức', tab:'p-formula'},
  {title:'Tỉ khối chất khí', sub:'d(A/B) = M_A / M_B', tag:'Công thức', tab:'p-formula'},
  {title:'Độ tan S', sub:'Số gam chất tan trong 100g nước', tag:'Công thức', tab:'p-formula'},
  {title:'Dãy hoạt động hóa học kim loại', sub:'K Na Ba Ca Mg Al Zn Fe Ni Sn Pb (H) Cu Hg Ag Pt Au', tag:'Dãy hoạt động', tab:'p-series'},
  {title:'Thang pH', sub:'pH<7 acid · pH=7 trung tính · pH>7 base', tag:'pH', tab:'p-rules'},
  {title:'Định luật bảo toàn khối lượng', sub:'m(chất phản ứng) = m(sản phẩm)', tag:'Phản ứng', tab:'p-reaction'},
  {title:'Alkane', sub:'CₙH₂ₙ₊₂ — hydrocarbon no, mạch hở', tag:'Hữu cơ', tab:'p-organic'},
  {title:'Alkene', sub:'CₙH₂ₙ — hydrocarbon không no', tag:'Hữu cơ', tab:'p-organic'},
  {title:'Mô phỏng phản ứng đẩy kim loại', sub:'Chọn kim loại và muối để xem phản ứng', tag:'Mô phỏng', tab:'p-series'},
  {title:'Cốc thí nghiệm pH', sub:'Kéo thanh trượt xem màu quỳ/phenol/vạn năng', tag:'Mô phỏng', tab:'p-rules'},
];
conceptIndex.forEach(c=>{ c.keywords = `${c.title} ${c.sub}`; paletteIndex.push(c); });

let paletteSelIdx = -1;
function openPalette(){
  document.getElementById('paletteOverlay').classList.add('open');
  const input = document.getElementById('paletteInput');
  input.value = '';
  input.focus();
  renderPaletteResults('');
  soundClick();
}
function closePalette(){
  document.getElementById('paletteOverlay').classList.remove('open');
}
function renderPaletteResults(query){
  const box = document.getElementById('paletteResults');
  const q = query.trim().toLowerCase();
  let list = paletteIndex;
  if(q){
    list = paletteIndex.filter(item => item.keywords.toLowerCase().includes(q));
  }
  list = list.slice(0, 30);
  paletteSelIdx = -1;
  if(list.length===0){
    box.innerHTML = `<div class="palette-empty">Không tìm thấy kết quả nào cho "${query}"</div>`;
    return;
  }
  box.innerHTML = list.map((item,i)=>`
    <div class="palette-item" data-idx="${i}" data-tab="${item.tab}">
      <span class="pi-title">${item.title}</span>
      <span class="pi-sub">${item.sub}</span>
      <span class="pi-tag">${item.tag}</span>
    </div>`).join('');
  box.querySelectorAll('.palette-item').forEach(el=>{
    el.onclick = ()=>{
      selectTab(el.dataset.tab);
      closePalette();
    };
  });
}
document.getElementById('paletteInput').addEventListener('input', (e)=>renderPaletteResults(e.target.value));
document.getElementById('paletteInput').addEventListener('keydown', (e)=>{
  const items = Array.from(document.querySelectorAll('.palette-item'));
  if(e.key==='ArrowDown'){
    e.preventDefault();
    paletteSelIdx = Math.min(paletteSelIdx+1, items.length-1);
    items.forEach((it,i)=>it.classList.toggle('sel', i===paletteSelIdx));
    items[paletteSelIdx]?.scrollIntoView({block:'nearest'});
  } else if(e.key==='ArrowUp'){
    e.preventDefault();
    paletteSelIdx = Math.max(paletteSelIdx-1, 0);
    items.forEach((it,i)=>it.classList.toggle('sel', i===paletteSelIdx));
    items[paletteSelIdx]?.scrollIntoView({block:'nearest'});
  } else if(e.key==='Enter'){
    if(paletteSelIdx>=0 && items[paletteSelIdx]){
      selectTab(items[paletteSelIdx].dataset.tab);
      closePalette();
    } else if(items.length>0){
      selectTab(items[0].dataset.tab);
      closePalette();
    }
  } else if(e.key==='Escape'){
    closePalette();
  }
});
document.addEventListener('keydown', (e)=>{
  if((e.ctrlKey || e.metaKey) && e.key.toLowerCase()==='k'){
    e.preventDefault();
    openPalette();
  } else if(e.key==='Escape'){
    closePalette();
    closeElModal();
  }
});

/* ---------------- GLOBAL LATEX RENDER (static formulas) ---------------- */
tex(document.body);
