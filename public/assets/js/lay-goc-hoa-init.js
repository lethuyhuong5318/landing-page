
(function(){
  const body=document.body,toggle=document.querySelector('.cc-menu-toggle'),backdrop=document.querySelector('.cc-mobile-backdrop'),drawer=document.querySelector('.cc-mobile-drawer'),close=document.querySelector('.cc-drawer-close');
  if(!toggle||!drawer)return;
  function setMenu(open){body.classList.toggle('cc-menu-open',open);toggle.setAttribute('aria-expanded',String(open));toggle.setAttribute('aria-label',open?'Đóng menu':'Mở menu');}
  toggle.addEventListener('click',()=>setMenu(!body.classList.contains('cc-menu-open')));
  backdrop.addEventListener('click',()=>setMenu(false));close.addEventListener('click',()=>setMenu(false));
  drawer.querySelectorAll('a').forEach(link=>link.addEventListener('click',()=>setMenu(false)));
  document.addEventListener('keydown',event=>{if(event.key==='Escape')setMenu(false)});
})();


document.addEventListener("click",function(event){
  const button=event.target.closest(".mass-answer-toggle");
  if(!button)return;
  const panel=button.nextElementSibling;
  if(!panel)return;
  panel.hidden=!panel.hidden;
  button.setAttribute("aria-expanded",String(!panel.hidden));
  const label=button.querySelector("span");
  if(label)label.innerHTML=panel.hidden?"Xem &#273;&#225;p &#225;n v&#224; c&#225;ch t&#237;nh":"&#7848;n &#273;&#225;p &#225;n v&#224; c&#225;ch t&#237;nh";
});

/* Wrap wide data tables in a horizontal scroller.
   The mobile stylesheet used to force `display:block` on <table> itself,
   which discards the table layout algorithm - columns stop aligning and
   the body renders as a detached chunk with a visible seam. Wrapping the
   table instead keeps `display:table` intact and moves the overflow onto
   a plain div. */
(function(){
  var tables=document.querySelectorAll('table.tt');
  for(var i=0;i<tables.length;i++){
    var t=tables[i];
    if(t.parentElement&&t.parentElement.classList.contains('table-scroll'))continue;
    var box=document.createElement('div');
    box.className='table-scroll';
    box.setAttribute('tabindex','0');
    box.setAttribute('role','region');
    box.setAttribute('aria-label','Bảng dữ liệu, có thể cuộn ngang');
    t.parentNode.insertBefore(box,t);
    box.appendChild(t);
  }
})();

/* Give every data cell its column label so narrow screens can render the
   table as stacked "label: value" rows instead of a horizontal scroller
   (requested: see all the information without scrolling). */
(function(){
  var tables=document.querySelectorAll('table.tt');
  for(var i=0;i<tables.length;i++){
    var t=tables[i];
    var headRow=t.querySelector('tr');
    if(!headRow)continue;
    var heads=headRow.querySelectorAll('th');
    if(!heads.length)continue;
    var labels=[];
    for(var h=0;h<heads.length;h++)labels.push((heads[h].textContent||'').trim());
    var rows=t.querySelectorAll('tr');
    for(var r=0;r<rows.length;r++){
      var cells=rows[r].querySelectorAll('td');
      for(var c=0;c<cells.length;c++){
        if(labels[c]&&!cells[c].hasAttribute('data-label'))cells[c].setAttribute('data-label',labels[c]);
      }
    }
    t.classList.add('tt--stackable');
  }
})();
