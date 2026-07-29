(() => {
  const grid = document.getElementById("ptableGrid");
  if (!grid || !window.commonEls && typeof commonEls === "undefined") return;

  const elements = [
    [1,"H","Hydrogen",1,1],[2,"He","Helium",1,18],
    [3,"Li","Lithium",2,1],[4,"Be","Beryllium",2,2],[5,"B","Boron",2,13],[6,"C","Carbon",2,14],[7,"N","Nitrogen",2,15],[8,"O","Oxygen",2,16],[9,"F","Fluorine",2,17],[10,"Ne","Neon",2,18],
    [11,"Na","Sodium",3,1],[12,"Mg","Magnesium",3,2],[13,"Al","Aluminium",3,13],[14,"Si","Silicon",3,14],[15,"P","Phosphorus",3,15],[16,"S","Sulfur",3,16],[17,"Cl","Chlorine",3,17],[18,"Ar","Argon",3,18],
    [19,"K","Potassium",4,1],[20,"Ca","Calcium",4,2],[21,"Sc","Scandium",4,3],[22,"Ti","Titanium",4,4],[23,"V","Vanadium",4,5],[24,"Cr","Chromium",4,6],[25,"Mn","Manganese",4,7],[26,"Fe","Iron",4,8],[27,"Co","Cobalt",4,9],[28,"Ni","Nickel",4,10],[29,"Cu","Copper",4,11],[30,"Zn","Zinc",4,12],[31,"Ga","Gallium",4,13],[32,"Ge","Germanium",4,14],[33,"As","Arsenic",4,15],[34,"Se","Selenium",4,16],[35,"Br","Bromine",4,17],[36,"Kr","Krypton",4,18],
    [37,"Rb","Rubidium",5,1],[38,"Sr","Strontium",5,2],[39,"Y","Yttrium",5,3],[40,"Zr","Zirconium",5,4],[41,"Nb","Niobium",5,5],[42,"Mo","Molybdenum",5,6],[43,"Tc","Technetium",5,7],[44,"Ru","Ruthenium",5,8],[45,"Rh","Rhodium",5,9],[46,"Pd","Palladium",5,10],[47,"Ag","Silver",5,11],[48,"Cd","Cadmium",5,12],[49,"In","Indium",5,13],[50,"Sn","Tin",5,14],[51,"Sb","Antimony",5,15],[52,"Te","Tellurium",5,16],[53,"I","Iodine",5,17],[54,"Xe","Xenon",5,18],
    [55,"Cs","Caesium",6,1],[56,"Ba","Barium",6,2],[72,"Hf","Hafnium",6,4],[73,"Ta","Tantalum",6,5],[74,"W","Tungsten",6,6],[75,"Re","Rhenium",6,7],[76,"Os","Osmium",6,8],[77,"Ir","Iridium",6,9],[78,"Pt","Platinum",6,10],[79,"Au","Gold",6,11],[80,"Hg","Mercury",6,12],[81,"Tl","Thallium",6,13],[82,"Pb","Lead",6,14],[83,"Bi","Bismuth",6,15],[84,"Po","Polonium",6,16],[85,"At","Astatine",6,17],[86,"Rn","Radon",6,18],
    [87,"Fr","Francium",7,1],[88,"Ra","Radium",7,2],[104,"Rf","Rutherfordium",7,4],[105,"Db","Dubnium",7,5],[106,"Sg","Seaborgium",7,6],[107,"Bh","Bohrium",7,7],[108,"Hs","Hassium",7,8],[109,"Mt","Meitnerium",7,9],[110,"Ds","Darmstadtium",7,10],[111,"Rg","Roentgenium",7,11],[112,"Cn","Copernicium",7,12],[113,"Nh","Nihonium",7,13],[114,"Fl","Flerovium",7,14],[115,"Mc","Moscovium",7,15],[116,"Lv","Livermorium",7,16],[117,"Ts","Tennessine",7,17],[118,"Og","Oganesson",7,18],
    [57,"La","Lanthanum",8,3],[58,"Ce","Cerium",8,4],[59,"Pr","Praseodymium",8,5],[60,"Nd","Neodymium",8,6],[61,"Pm","Promethium",8,7],[62,"Sm","Samarium",8,8],[63,"Eu","Europium",8,9],[64,"Gd","Gadolinium",8,10],[65,"Tb","Terbium",8,11],[66,"Dy","Dysprosium",8,12],[67,"Ho","Holmium",8,13],[68,"Er","Erbium",8,14],[69,"Tm","Thulium",8,15],[70,"Yb","Ytterbium",8,16],[71,"Lu","Lutetium",8,17],
    [89,"Ac","Actinium",9,3],[90,"Th","Thorium",9,4],[91,"Pa","Protactinium",9,5],[92,"U","Uranium",9,6],[93,"Np","Neptunium",9,7],[94,"Pu","Plutonium",9,8],[95,"Am","Americium",9,9],[96,"Cm","Curium",9,10],[97,"Bk","Berkelium",9,11],[98,"Cf","Californium",9,12],[99,"Es","Einsteinium",9,13],[100,"Fm","Fermium",9,14],[101,"Md","Mendelevium",9,15],[102,"No","Nobelium",9,16],[103,"Lr","Lawrencium",9,17]
  ];
  const common = new Map(commonEls.map((item) => [item.z, item]));
  const alkali = new Set([3,11,19,37,55,87]);
  const alkaline = new Set([4,12,20,38,56,88]);
  const metalloids = new Set([5,14,32,33,51,52]);
  const nonmetals = new Set([1,6,7,8,15,16,34]);
  const halogens = new Set([9,17,35,53,85,117]);
  const nobles = new Set([2,10,18,36,54,86,118]);
  const post = new Set([13,31,49,50,81,82,83,84,113,114,115,116]);
  const category = (z,row,col) => row===8 ? "lanthanide" : row===9 ? "actinide" : alkali.has(z) ? "alkali" : alkaline.has(z) ? "alkaline" : halogens.has(z) ? "halogen" : nobles.has(z) ? "noble" : metalloids.has(z) ? "metalloid" : nonmetals.has(z) ? "nonmetal" : post.has(z) ? "post" : "transition";

  grid.innerHTML = "";
  grid.className = "ptable periodic-grid";
  for (let group=1; group<=18; group++) {
    const label = document.createElement("span");
    label.className = "group-label";
    label.style.gridColumn = group;
    label.style.gridRow = 1;
    label.textContent = group;
    grid.appendChild(label);
  }
  [["Lanthanide",10],["Actinide",11]].forEach(([text,row]) => {
    const label=document.createElement("span");
    label.className="series-label";
    label.style.gridColumn="1 / span 2";
    label.style.gridRow=row;
    label.textContent=text;
    grid.appendChild(label);
  });
  elements.forEach(([z,sym,name,row,col]) => {
    const detail=common.get(z);
    const cell=document.createElement(detail ? "button" : "div");
    cell.className=`pel cat-${category(z,row,col)}${detail ? " is-common" : ""}`;
    cell.style.gridColumn=col;
    cell.style.gridRow=row===8 ? 10 : row===9 ? 11 : row+1;
    cell.innerHTML=`<span class="z">${z}</span><span class="s">${sym}</span><span class="m">${name}</span>`;
    cell.title=`${z}. ${name} (${sym})${detail ? " — bấm để xem chi tiết" : ""}`;
    if(detail){
      cell.type="button";
      cell.setAttribute("aria-label",`${name}, số hiệu nguyên tử ${z}. Xem chi tiết`);
      cell.onclick=()=>openElModal(detail);
    }
    grid.appendChild(cell);
  });
  const parent=grid.parentElement;
  if(parent && !parent.classList.contains("periodic-shell")){
    const shell=document.createElement("div");
    shell.className="periodic-shell";
    const hint=document.createElement("p");
    hint.className="periodic-hint";
    hint.textContent="Vuốt ngang để xem đủ 18 nhóm nguyên tố →";
    parent.insertBefore(hint,grid);
    parent.insertBefore(shell,grid);
    shell.appendChild(grid);
  }
  const legend=document.createElement("div");
  legend.className="periodic-legend";
  legend.innerHTML='<span><i class="cat-alkali"></i>Kim loại kiềm</span><span><i class="cat-transition"></i>Kim loại chuyển tiếp</span><span><i class="cat-metalloid"></i>Á kim</span><span><i class="cat-nonmetal"></i>Phi kim</span><span><i class="cat-halogen"></i>Halogen</span><span><i class="cat-noble"></i>Khí hiếm</span><span><i class="cat-lanthanide"></i>Lanthanide / Actinide</span>';
  grid.parentElement.after(legend);
})();
