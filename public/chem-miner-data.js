(() => {
  const items = [
    { sym: 'Li', val: 'I', name: 'Lithium', kind: 'element', weight: 1, tip: 'Li thuộc nhóm IA nên thường có hóa trị I.' },
    { sym: 'Na', val: 'I', name: 'Sodium', kind: 'element', weight: 1, tip: 'Na thuộc nhóm IA nên luôn có hóa trị I.' },
    { sym: 'K', val: 'I', name: 'Potassium', kind: 'element', weight: 1, tip: 'K thuộc nhóm IA nên luôn có hóa trị I.' },
    { sym: 'Ag', val: 'I', name: 'Silver', kind: 'element', weight: 1.15, tip: 'Ag thường gặp với hóa trị I.' },
    { sym: 'Cl', val: 'I', name: 'Chlorine', kind: 'element', weight: .9, tip: 'Cl thường gặp hóa trị I trong chloride.' },
    { sym: 'OH', val: 'I', name: 'Hydroxide', kind: 'group', weight: 1.1, tip: 'Nhóm hydroxide OH có hóa trị I.' },
    { sym: 'NO₃', val: 'I', name: 'Nitrate', kind: 'group', weight: 1.2, tip: 'Nhóm nitrate NO₃ có hóa trị I.' },
    { sym: 'NH₄', val: 'I', name: 'Ammonium', kind: 'group', weight: 1.2, tip: 'Nhóm ammonium NH₄ có hóa trị I.' },
    { sym: 'Mg', val: 'II', name: 'Magnesium', kind: 'element', weight: 1.1, tip: 'Mg thuộc nhóm IIA nên luôn có hóa trị II.' },
    { sym: 'Ca', val: 'II', name: 'Calcium', kind: 'element', weight: 1.2, tip: 'Ca thuộc nhóm IIA nên thường có hóa trị II.' },
    { sym: 'Ba', val: 'II', name: 'Barium', kind: 'element', weight: 1.45, tip: 'Ba thuộc nhóm IIA nên thường có hóa trị II.' },
    { sym: 'Zn', val: 'II', name: 'Zinc', kind: 'element', weight: 1.25, tip: 'Zn thường gặp với hóa trị II.' },
    { sym: 'O', val: 'II', name: 'Oxygen', kind: 'element', weight: .85, tip: 'Oxygen thường có hóa trị II.' },
    { sym: 'Cu', val: 'II', name: 'Copper', kind: 'element', weight: 1.3, tip: 'Cu có thể mang hóa trị I hoặc II.' },
    { sym: 'Fe', val: 'II', name: 'Iron', kind: 'element', weight: 1.4, tip: 'Fe có hai hóa trị thường gặp: II và III.' },
    { sym: 'SO₄', val: 'II', name: 'Sulfate', kind: 'group', weight: 1.35, tip: 'Nhóm sulfate SO₄ có hóa trị II.' },
    { sym: 'SO₃', val: 'II', name: 'Sulfite', kind: 'group', weight: 1.3, tip: 'Nhóm sulfite SO₃ có hóa trị II.' },
    { sym: 'CO₃', val: 'II', name: 'Carbonate', kind: 'group', weight: 1.3, tip: 'Nhóm carbonate CO₃ có hóa trị II.' },
    { sym: 'Al', val: 'III', name: 'Aluminium', kind: 'element', weight: 1.2, tip: 'Al thường có hóa trị III.' },
    { sym: 'Fe', val: 'III', name: 'Iron', kind: 'element', weight: 1.4, tip: 'Fe có hai hóa trị thường gặp: II và III.' },
    { sym: 'Cr', val: 'III', name: 'Chromium', kind: 'element', weight: 1.35, tip: 'Cr thường gặp hóa trị II, III và VI.' },
    { sym: 'PO₄', val: 'III', name: 'Phosphate', kind: 'group', weight: 1.45, tip: 'Nhóm phosphate PO₄ có hóa trị III.' },
    { sym: 'C', val: 'IV', name: 'Carbon', kind: 'element', weight: .9, tip: 'Carbon thường gặp hóa trị IV trong nhiều hợp chất.' },
    { sym: 'Si', val: 'IV', name: 'Silicon', kind: 'element', weight: 1.05, tip: 'Silicon thường có hóa trị IV.' },
    { sym: 'Sn', val: 'II', name: 'Tin', kind: 'element', weight: 1.35, tip: 'Sn thường gặp hóa trị II và IV.' },
    { sym: 'Sn', val: 'IV', name: 'Tin', kind: 'element', weight: 1.35, tip: 'Sn thường gặp hóa trị II và IV.' },
    { sym: 'Pb', val: 'II', name: 'Lead', kind: 'element', weight: 1.55, tip: 'Pb thường gặp hóa trị II và IV.' },
    { sym: 'Pb', val: 'IV', name: 'Lead', kind: 'element', weight: 1.55, tip: 'Pb thường gặp hóa trị II và IV.' },
    { sym: 'S', val: 'II', name: 'Sulfur', kind: 'element', weight: 1, tip: 'S có thể có hóa trị II, IV hoặc VI.' },
    { sym: 'S', val: 'IV', name: 'Sulfur', kind: 'element', weight: 1, tip: 'S có thể có hóa trị II, IV hoặc VI.' },
    { sym: 'S', val: 'VI', name: 'Sulfur', kind: 'element', weight: 1, tip: 'S có thể có hóa trị II, IV hoặc VI.' },
    { sym: 'N', val: 'III', name: 'Nitrogen', kind: 'element', weight: .9, tip: 'N thường gặp hóa trị III và V.' },
    { sym: 'N', val: 'V', name: 'Nitrogen', kind: 'element', weight: .9, tip: 'N thường gặp hóa trị III và V.' },
    { sym: 'P', val: 'III', name: 'Phosphorus', kind: 'element', weight: 1, tip: 'P thường gặp hóa trị III và V.' },
    { sym: 'P', val: 'V', name: 'Phosphorus', kind: 'element', weight: 1, tip: 'P thường gặp hóa trị III và V.' },
  ];
  const keys = list => list.map(([sym, val]) => `${sym}:${val}`);
  const levels = {
    '1': { title: 'Hóa trị I', targets: ['I'], pool: keys([['Li','I'],['Na','I'],['K','I'],['Ag','I'],['Cl','I'],['Mg','II'],['Al','III']]) },
    '2': { title: 'Hóa trị II', targets: ['II'], pool: keys([['Mg','II'],['Ca','II'],['Ba','II'],['Zn','II'],['Cu','II'],['Fe','II'],['Na','I'],['Al','III']]) },
    '3': { title: 'Hóa trị III và IV', targets: ['III','IV'], pool: keys([['Al','III'],['Fe','III'],['Cr','III'],['C','IV'],['Si','IV'],['Sn','IV'],['Na','I'],['Mg','II']]) },
    '4': { title: 'Nhóm nguyên tử', targets: ['I','II','III'], groupsOnly: true, pool: keys([['OH','I'],['NO₃','I'],['NH₄','I'],['SO₄','II'],['SO₃','II'],['CO₃','II'],['PO₄','III']]) },
    boss: { title: 'Thử thách tổng hợp', targets: ['I','II','III','IV','V','VI'], pool: [] },
  };
  window.ChemMinerData = {
    items,
    levels,
    colors: {
      I: ['#55b9ff', '#176fc1'], II: ['#61d99a', '#18845a'], III: ['#b28cff', '#6f48c8'],
      IV: ['#ffb45e', '#d96820'], V: ['#f58ab1', '#b83873'], VI: ['#f7da62', '#c58c10'], group: ['#ffe379', '#c99a18']
    }
  };
})();
