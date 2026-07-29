(() => {
  const grid=document.getElementById("ptableGrid");
  if(!grid) return;
  const masses=[1.008,4.003,6.94,9.012,10.81,12.011,14.007,15.999,18.998,20.18,22.99,24.305,26.982,28.085,30.974,32.06,35.45,39.948,39.098,40.078,44.956,47.867,50.942,51.996,54.938,55.845,58.933,58.693,63.546,65.38,69.723,72.63,74.922,78.971,79.904,83.798,85.468,87.62,88.906,91.224,92.906,95.95,98,101.07,102.906,106.42,107.868,112.414,114.818,118.71,121.76,127.6,126.904,131.293,132.905,137.327,138.905,140.116,140.908,144.242,145,150.36,151.964,157.25,158.925,162.5,164.93,167.259,168.934,173.045,174.967,178.49,180.948,183.84,186.207,190.23,192.217,195.084,196.967,200.592,204.38,207.2,208.98,209,210,222,223,226,227,232.038,231.036,238.029,237,244,243,247,247,251,252,257,258,259,266,267,268,269,270,269,270,270,278,281,282,285,286,289,290,293,294,294];
  const labels={alkali:"Kim loại kiềm",alkaline:"Kim loại kiềm thổ",transition:"Kim loại chuyển tiếp",post:"Kim loại sau chuyển tiếp",metalloid:"Á kim",nonmetal:"Phi kim",halogen:"Halogen",noble:"Khí hiếm",lanthanide:"Lanthanide",actinide:"Actinide"};
  const filterItems=[
    ["all","Tất cả","#fff"],["alkali","Kim loại kiềm","#ffd9d9"],["transition","Kim loại chuyển tiếp","#d9ecff"],
    ["metalloid","Á kim","#fff3b8"],["nonmetal","Phi kim","#e4f3ff"],["halogen","Halogen","#fff7a8"],
    ["noble","Khí hiếm","#fffbd0"],["fblock","Lanthanide / Actinide","#dff7df"]
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
  const showModal=(z,sym,name,cat)=>{
    const shells=shellCounts(z);
    document.getElementById("elModalBox").innerHTML=`<div class="el-modal-head"><span class="em-z">Số hiệu ${z}</span><button class="em-close" onclick="closeElModal()" aria-label="Đóng">✕</button><div class="em-sym">${sym}</div><div class="em-name">${name}</div><span class="periodic-modal-category">${labels[cat]||cat}</span></div><div class="el-modal-body"><div class="em-row"><span>Khối lượng mol</span><b>${masses[z-1]??"—"} g/mol</b></div><div class="em-row"><span>Hóa trị / trạng thái thường gặp</span><b>${valenceFor(cat,z)}</b></div><div class="periodic-shell-diagram">${shellSvg(shells)}</div><p class="periodic-shell-note">Phân bố electron theo lớp: ${shells.join(" – ")}. Mô hình minh họa đơn giản hóa; cấu hình phân lớp chi tiết được học ở THPT.</p><p class="periodic-app-note"><b>Ứng dụng và đặc điểm:</b> ${applicationFor(cat,z)}</p></div>`;
    document.getElementById("elModalOverlay").classList.add("open");
    if(typeof soundClick==="function") soundClick();
  };
  const cells=[...grid.querySelectorAll(".pel")].filter(cell=>cell.querySelector(".z"));
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
  const shell=grid.closest(".periodic-shell");
  const bar=document.createElement("div");bar.className="periodic-filter-bar";bar.setAttribute("role","group");bar.setAttribute("aria-label","Lọc bảng tuần hoàn theo nhóm nguyên tố");
  const count=document.createElement("p");count.className="periodic-count";count.setAttribute("aria-live","polite");count.textContent="Đang hiển thị toàn bộ 118 nguyên tố";
  filterItems.forEach(([key,text,color],index)=>{const btn=document.createElement("button");btn.type="button";btn.className=`periodic-filter${index===0?" active":""}`;btn.dataset.filter=key;btn.style.setProperty("--filter-color",color);btn.textContent=text;btn.onclick=()=>{bar.querySelectorAll(".periodic-filter").forEach(b=>b.classList.toggle("active",b===btn));const all=key==="all";grid.classList.toggle("has-filter",!all);let matched=118;grid.querySelectorAll("button.pel").forEach(cell=>{const cat=categoryOf(cell),match=all||(key==="fblock"?(cat==="lanthanide"||cat==="actinide"):cat===key);cell.classList.toggle("filter-match",match)});if(!all)matched=grid.querySelectorAll("button.pel.filter-match").length;count.textContent=all?"Đang hiển thị toàn bộ 118 nguyên tố":`${text}: ${matched} nguyên tố được làm nổi bật`};bar.appendChild(btn)});
  shell.parentElement.insertBefore(count,shell);
  shell.parentElement.insertBefore(bar,count);
  document.querySelector(".periodic-legend")?.remove();
})();
