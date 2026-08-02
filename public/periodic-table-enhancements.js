(() => {
  const grid=document.getElementById("ptableGrid");
  if(!grid) return;
  const masses=[1.008,4.003,6.94,9.012,10.81,12.011,14.007,15.999,18.998,20.18,22.99,24.305,26.982,28.085,30.974,32.06,35.45,39.948,39.098,40.078,44.956,47.867,50.942,51.996,54.938,55.845,58.933,58.693,63.546,65.38,69.723,72.63,74.922,78.971,79.904,83.798,85.468,87.62,88.906,91.224,92.906,95.95,98,101.07,102.906,106.42,107.868,112.414,114.818,118.71,121.76,127.6,126.904,131.293,132.905,137.327,138.905,140.116,140.908,144.242,145,150.36,151.964,157.25,158.925,162.5,164.93,167.259,168.934,173.045,174.967,178.49,180.948,183.84,186.207,190.23,192.217,195.084,196.967,200.592,204.38,207.2,208.98,209,210,222,223,226,227,232.038,231.036,238.029,237,244,243,247,247,251,252,257,258,259,266,267,268,269,270,269,270,270,278,281,282,285,286,289,290,293,294,294];
  const labels={alkali:"Kim loại kiềm",alkaline:"Kim loại kiềm thổ",transition:"Kim loại chuyển tiếp",post:"Kim loại sau chuyển tiếp",metalloid:"Á kim",nonmetal:"Phi kim",halogen:"Halogen",noble:"Khí hiếm",lanthanide:"Lanthanide",actinide:"Actinide"};
  const filterItems=[
    ["all","Tất cả","#fff"],["alkali","Kim loại kiềm","#ffc6c6"],["transition","Kim loại chuyển tiếp","#c7ddff"],
    ["metalloid","Á kim","#d9c8ff"],["nonmetal","Phi kim","#c9f1cf"],["halogen","Halogen","#fff0a6"],
    ["noble","Khí hiếm","#ffd0e8"],["fblock","Lanthanide / Actinide","#e3f5b5"]
  ];
  const commonMap=new Map((typeof commonEls!=="undefined" ? commonEls : []).map(item=>[item.z,item]));
  const categoryOf=cell=>[...cell.classList].find(c=>c.startsWith("cat-"))?.slice(4)||"transition";
  const valenceFor=(cat,z)=>{
    const common=commonMap.get(z); if(common) return common.val;
    if(cat==="alkali") return "I"; if(cat==="alkaline") return "II"; if(cat==="halogen") return "I, III, V, VII";
    if(cat==="noble") return "0 (thường trơ)"; if(cat==="lanthanide"||cat==="actinide") return "III thường gặp";
    return "Thay đổi theo hợp chất";
  };
  const applicationFor=(cat,z)=>{
    const common=commonMap.get(z); if(common) return common.apps;
    const generic={alkali:"Có tính phản ứng mạnh; thường tồn tại trong hợp chất và muối.",alkaline:"Thường gặp trong khoáng vật và nhiều hợp chất ion.",transition:"Nhiều nguyên tố được dùng trong hợp kim, xúc tác và vật liệu kỹ thuật.",post:"Có ứng dụng trong vật liệu, điện tử hoặc hợp kim tùy nguyên tố.",metalloid:"Thường liên quan đến vật liệu bán dẫn, thủy tinh hoặc công nghệ.",nonmetal:"Tham gia nhiều hợp chất quan trọng trong sự sống và đời sống.",halogen:"Thường tạo muối; một số hợp chất được dùng trong khử khuẩn và vật liệu.",noble:"Ít phản ứng; được dùng trong chiếu sáng, khí bảo vệ hoặc kỹ thuật.",lanthanide:"Được dùng trong nam châm, quang học và vật liệu công nghệ cao.",actinide:"Nhiều đồng vị phóng xạ; việc sử dụng cần điều kiện chuyên môn nghiêm ngặt."};
    return generic[cat]||"Ứng dụng phụ thuộc từng nguyên tố và hợp chất cụ thể.";
  };
  const orbitals=[[1,2],[2,2],[2,6],[3,2],[3,6],[4,2],[3,10],[4,6],[5,2],[4,10],[5,6],[6,2],[4,14],[5,10],[6,6],[7,2],[5,14],[6,10],[7,6]];
  const shellCounts=z=>{let left=z;const shells=[];for(const[n,cap]of orbitals){if(left<=0)break;const take=Math.min(left,cap);shells[n-1]=(shells[n-1]||0)+take;left-=take}return shells};
  const shellSvg=shells=>{
    const cx=82,cy=82,maxR=72,step=Math.min(13,maxR/Math.max(shells.length,1));let svg='<svg viewBox="0 0 164 164" role="img" aria-label="Mô hình các lớp electron"><circle cx="82" cy="82" r="7" fill="var(--navy-900)"/>';
    shells.forEach((count,i)=>{const r=16+i*step;svg+=`<circle cx="${cx}" cy="${cy}" r="${r}" fill="none" stroke="var(--sky-300)" stroke-width="1.2" stroke-dasharray="2.5,2.5"/>`;const shown=Math.min(count,18);for(let e=0;e<shown;e++){const angle=2*Math.PI*e/shown-Math.PI/2;svg+=`<circle cx="${(cx+r*Math.cos(angle)).toFixed(1)}" cy="${(cy+r*Math.sin(angle)).toFixed(1)}" r="2.7" fill="var(--yellow-500)" stroke="var(--navy-900)" stroke-width=".6"/>`}});return svg+"</svg>"
  };
  const ensureAtomicModal=()=>{
    let overlay=document.getElementById("atomicLabOverlay");
    if(overlay) return overlay;
    overlay=document.createElement("div");
    overlay.id="atomicLabOverlay";
    overlay.className="atomic-lab-modal";
    overlay.setAttribute("aria-hidden","true");
    overlay.innerHTML=`<div class="atomic-lab-modal-sheet" role="dialog" aria-modal="true" aria-labelledby="atomicLabModalTitle">
      <header><div><span>TRỰC QUAN TƯƠNG TÁC</span><h2 id="atomicLabModalTitle">Mô hình nguyên tử 3D</h2><p>Kéo để xoay mô hình và quan sát các lớp electron.</p></div><button class="atomic-lab-modal-close" type="button" aria-label="Đóng mô hình 3D"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="m6 6 12 12M18 6 6 18"/></svg></button></header>
      <div id="atomicLabHost"></div>
    </div>`;
    document.body.appendChild(overlay);
    const close=()=>{overlay.classList.remove("open");overlay.setAttribute("aria-hidden","true");document.body.classList.remove("atomic-modal-open");window.destroyAtomicLab?.();overlay.returnFocus?.focus?.();};
    overlay.querySelector(".atomic-lab-modal-close").addEventListener("click",close);
    overlay.addEventListener("click",event=>{if(event.target===overlay)close()});
    overlay.closeAtomicLab=close;
    return overlay;
  };
  const openAtomicModal=(z,sym,shells)=>{
    const overlay=ensureAtomicModal();
    overlay.returnFocus=document.activeElement;
    overlay.classList.add("open");
    overlay.setAttribute("aria-hidden","false");
    document.body.classList.add("atomic-modal-open");
    requestAnimationFrame(()=>window.createAtomicLab?.({z,symbol:sym,shells}));
    overlay.querySelector(".atomic-lab-modal-close").focus();
  };
  document.addEventListener("keydown",event=>{if(event.key==="Escape")document.getElementById("atomicLabOverlay")?.closeAtomicLab?.()});
  const showModal=(z,sym,name,cat)=>{
    const shells=shellCounts(z),mass=masses[z-1]??null,massNumber=mass===null?"—":Math.round(mass),neutrons=mass===null?"—":Math.max(0,massNumber-z);
    document.getElementById("elModalBox").innerHTML=`<div class="el-modal-head">
      <span class="em-eyebrow">NGUYÊN TỐ HÓA HỌC</span>
      <button class="em-close" onclick="closeElModal()" aria-label="Đóng card nguyên tố"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="m6 6 12 12M18 6 6 18"/></svg></button>
      <figure class="wiki-element-media" id="wikiElementMedia" hidden><img id="wikiElementImage" alt="" loading="lazy"><a id="wikiElementLink" class="wiki-image-link" href="#" target="_blank" rel="noopener noreferrer" aria-label="Xem hình minh họa nguyên tố"><span class="sr-only">Hình minh họa nguyên tố</span></a></figure>
      <div class="element-identity">
        <span class="element-number">Số hiệu ${z}</span>
        <div class="nuclear-symbol" aria-label="Số khối ${massNumber}, số hiệu nguyên tử ${z}, nguyên tố ${sym}"><span class="nuclear-numbers"><sup>${massNumber}</sup><sub>${z}</sub></span><span class="nuclear-element">${sym}</span></div>
        <div><div class="em-name">${name}</div><span class="periodic-modal-category">${labels[cat]||cat}</span></div>
      </div>
    </div>
    <div class="el-modal-body">
      <section class="element-facts" aria-label="Thông tin cơ bản">
        <div><span>Số khối gần đúng</span><b>${massNumber}</b></div>
        <div><span>Khối lượng mol</span><b>${mass??"—"} <small>g/mol</small></b></div>
        <div><span>Hóa trị thường gặp</span><b>${valenceFor(cat,z)}</b></div>
        <div><span>Electron theo lớp</span><b>${shells.join(" – ")}</b></div>
      </section>
      <section class="atomic-model-2d element-bohr-card" aria-label="Mô hình nguyên tử 2D">
        <div class="element-section-title"><div><span>MÔ HÌNH MẶC ĐỊNH</span><b>Mô hình nguyên tử 2D</b></div><small>Bohr</small></div>
        <div class="periodic-shell-diagram">${shellSvg(shells)}</div>
        <p>Nguyên tử trung hòa có <b>${z} proton</b>, <b>${z} electron</b> và khoảng <b>${neutrons} neutron</b>.</p>
      </section>
      <button class="open-atomic-3d" id="openAtomic3D" type="button"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="m12 3 8 4.5v9L12 21l-8-4.5v-9L12 3Zm0 0v9m8-4.5-8 4.5m-8-4.5 8 4.5m0 9v-9"/></svg><span><b>Xem mô hình 3D</b><small>Mở không gian xoay tương tác</small></span><i aria-hidden="true">→</i></button>
      <aside class="periodic-app-note"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M9 18h6m-5 3h4M8.5 14.5A6 6 0 1 1 15.5 14.5c-.9.7-1.5 1.6-1.5 2.5h-4c0-.9-.6-1.8-1.5-2.5Z"/></svg><p><b>Ứng dụng ví dụ điển hình</b><span>${applicationFor(cat,z)}</span></p></aside>
    </div>`;
    document.getElementById("elModalOverlay").classList.add("open");
    document.getElementById("openAtomic3D").addEventListener("click",()=>openAtomicModal(z,sym,shells));
    if(typeof loadElementWikiImage==="function") loadElementWikiImage(name,sym);
    if(typeof soundClick==="function") soundClick();
  };  const cells=[...grid.querySelectorAll(".pel")].filter(cell=>cell.querySelector(".z"));
  cells.forEach(cell=>{
    const z=Number(cell.querySelector(".z").textContent),sym=cell.querySelector(".s").textContent,name=cell.querySelector(".m").textContent,cat=categoryOf(cell);
    const button=document.createElement("button");
    [...cell.attributes].forEach(attr=>button.setAttribute(attr.name,attr.value));
    button.className=cell.className;
    button.type="button";
    button.innerHTML=cell.innerHTML;
    button.setAttribute("aria-label",`${name}, kí hiệu ${sym}, số hiệu nguyên tử ${z}. Xem chi tiết`);
    button.onclick=()=>showModal(z,sym,name,cat);
    cell.replaceWith(button);
  });
  const searchableCells=[...grid.querySelectorAll("button.pel")];
  const search=document.createElement("div");
  search.className="periodic-search";
  search.innerHTML='<label><span class="sr-only">Tìm nguyên tố</span><input id="periodicSearch" type="search" autocomplete="off" placeholder="Tìm theo tên, kí hiệu hoặc số hiệu…"><span class="periodic-search-key">Enter để mở</span></label><button type="button">Xóa tìm kiếm</button>';
  const searchInput=search.querySelector("input"),searchClear=search.querySelector("button");
  const applySearch=()=>{const query=searchInput.value.trim().toLocaleLowerCase("vi");let matches=[];searchableCells.forEach(cell=>{const text=`${cell.querySelector(".z").textContent} ${cell.querySelector(".s").textContent} ${cell.querySelector(".m").textContent}`.toLocaleLowerCase("vi"),match=!query||text.includes(query);cell.classList.toggle("search-dim",Boolean(query)&&!match);cell.classList.toggle("search-match",Boolean(query)&&match);if(match&&query)matches.push(cell)});count.textContent=query?`Tìm thấy ${matches.length} nguyên tố phù hợp`:`Đang hiển thị toàn bộ 118 nguyên tố`;return matches};
  searchInput.addEventListener("input",applySearch);
  searchInput.addEventListener("keydown",event=>{if(event.key==="Enter"){event.preventDefault();applySearch()[0]?.click()}if(event.key==="Escape"){searchInput.value="";applySearch()}});
  searchClear.addEventListener("click",()=>{searchInput.value="";applySearch();searchInput.focus()});
  const shell=grid.closest(".periodic-shell");
  const bar=document.createElement("div");bar.className="periodic-filter-bar";bar.setAttribute("role","group");bar.setAttribute("aria-label","Lọc bảng tuần hoàn theo nhóm nguyên tố");
  const count=document.createElement("p");count.className="periodic-count";count.setAttribute("aria-live","polite");count.textContent="Đang hiển thị toàn bộ 118 nguyên tố";
  filterItems.forEach(([key,text,color],index)=>{const btn=document.createElement("button");btn.type="button";btn.className=`periodic-filter${index===0?" active":""}`;btn.dataset.filter=key;btn.style.setProperty("--filter-color",color);btn.textContent=text;btn.onclick=()=>{bar.querySelectorAll(".periodic-filter").forEach(b=>b.classList.toggle("active",b===btn));const all=key==="all";grid.classList.toggle("has-filter",!all);let matched=118;grid.querySelectorAll("button.pel").forEach(cell=>{const cat=categoryOf(cell),match=all||(key==="fblock"?(cat==="lanthanide"||cat==="actinide"):cat===key);cell.classList.toggle("filter-match",match)});if(!all)matched=grid.querySelectorAll("button.pel.filter-match").length;count.textContent=all?"Đang hiển thị toàn bộ 118 nguyên tố":`${text}: ${matched} nguyên tố được làm nổi bật`};bar.appendChild(btn)});
  shell.parentElement.insertBefore(search,shell);
  shell.parentElement.insertBefore(count,shell);
  shell.parentElement.insertBefore(bar,count);
  document.querySelector(".periodic-legend")?.remove();
})();
