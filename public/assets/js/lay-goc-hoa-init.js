
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
