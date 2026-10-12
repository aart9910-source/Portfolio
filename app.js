(function(){
  'use strict';
  document.documentElement.classList.add('js-ready');

  var menuButton=document.querySelector('.menu-toggle');
  var mobileNav=document.getElementById('mobile-nav');
  function closeMenu(restoreFocus){
    if(!menuButton||!mobileNav)return;
    menuButton.setAttribute('aria-expanded','false');
    menuButton.setAttribute('aria-label','Open navigation');
    mobileNav.hidden=true;
    if(restoreFocus)menuButton.focus();
  }
  if(menuButton&&mobileNav){
    menuButton.addEventListener('click',function(){
      var opening=menuButton.getAttribute('aria-expanded')!=='true';
      menuButton.setAttribute('aria-expanded',String(opening));
      menuButton.setAttribute('aria-label',opening?'Close navigation':'Open navigation');
      mobileNav.hidden=!opening;
      if(opening){var first=mobileNav.querySelector('a');if(first)first.focus({preventScroll:true});}
    });
    mobileNav.querySelectorAll('a').forEach(function(a){a.addEventListener('click',function(){closeMenu(false);});});
    document.addEventListener('keydown',function(e){if(e.key==='Escape'&&menuButton.getAttribute('aria-expanded')==='true')closeMenu(true);});
    window.addEventListener('resize',function(){if(window.innerWidth>760)closeMenu(false);},{passive:true});
  }

  var filterButtons=Array.prototype.slice.call(document.querySelectorAll('[data-filter]'));
  var projectCards=Array.prototype.slice.call(document.querySelectorAll('.project-card[data-category]'));
  var empty=document.getElementById('filter-empty');
  filterButtons.forEach(function(button){
    button.addEventListener('click',function(){
      var filter=button.getAttribute('data-filter');
      filterButtons.forEach(function(b){var active=b===button;b.classList.toggle('active',active);b.setAttribute('aria-pressed',String(active));});
      var shown=0;
      projectCards.forEach(function(card){
        var category=(card.getAttribute('data-category')||'').split(/\s+/);
        var visible=filter==='all'||category.indexOf(filter)!==-1;
        card.hidden=!visible;
        if(visible)shown++;
      });
      if(empty)empty.hidden=shown>0;
    });
  });

  var year=document.getElementById('current-year');
  if(year)year.textContent=String(new Date().getFullYear());

  var copyButton=document.querySelector('[data-copy-email]');
  var copyFeedback=document.getElementById('copy-feedback');
  if(copyButton){
    copyButton.addEventListener('click',function(){
      var email=copyButton.getAttribute('data-copy-email');
      if(navigator.clipboard&&navigator.clipboard.writeText){
        navigator.clipboard.writeText(email).then(function(){if(copyFeedback)copyFeedback.textContent='Email copied: '+email;})
          .catch(function(){if(copyFeedback)copyFeedback.textContent='Email: '+email;});
      }else{
        if(copyFeedback)copyFeedback.textContent='Email: '+email;
      }
    });
  }

  var reduce=window.matchMedia&&window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var sectionLinks=Array.prototype.slice.call(document.querySelectorAll('.desktop-nav a'));
  var trackedSections=sectionLinks.map(function(a){return document.querySelector(a.getAttribute('href'));}).filter(Boolean);
  if('IntersectionObserver' in window&&trackedSections.length&&!reduce){
    var navObserver=new IntersectionObserver(function(entries){
      entries.forEach(function(entry){
        if(entry.isIntersecting){
          var id='#'+entry.target.id;
          sectionLinks.forEach(function(a){a.classList.toggle('nav-active',a.getAttribute('href')===id);});
        }
      });
    },{rootMargin:'-32% 0px -58% 0px',threshold:0});
    trackedSections.forEach(function(section){navObserver.observe(section);});
  }

  // Experimental signal field: generative contour lines respond to the pointer.
  var field=document.querySelector('.signal-art');
  var canvas=document.getElementById('signal-canvas');
  var ctx=canvas&&canvas.getContext?canvas.getContext('2d'):null;
  var reduced=window.matchMedia&&window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if(field&&canvas&&ctx){
    var fw=0,fh=0,dpr=1,tick=0,frame=0;
    var pointer={x:.73,y:.43,tx:.73,ty:.43,active:false};
    function sizeField(){
      var r=field.getBoundingClientRect();
      fw=Math.max(1,r.width);fh=Math.max(1,r.height);
      dpr=Math.min(window.devicePixelRatio||1,2);
      canvas.width=Math.round(fw*dpr);canvas.height=Math.round(fh*dpr);
      ctx.setTransform(dpr,0,0,dpr,0,0);
      drawField();
    }
    function fieldOffset(x,y,t){
      var dx=x-pointer.x*fw,dy=y-pointer.y*fh;
      var dist=Math.sqrt(dx*dx+dy*dy);
      var influence=pointer.active?Math.exp(-dist/150):0;
      var wave=Math.sin(x*.027+y*.016+tick*.018)*5+Math.cos(y*.028-tick*.014)*4;
      return {x:Math.sin(y*.017+tick*.012)*7+dx*influence*.1,y:wave+Math.sin(x*.018-tick*.016)*4+dy*influence*.08};
    }
    function drawField(){
      if(!ctx||!fw||!fh)return;
      ctx.clearRect(0,0,fw,fh);
      var gap=23,cols=Math.ceil(fw/gap),rows=Math.ceil(fh/gap);
      ctx.lineWidth=.65;
      for(var row=0;row<=rows;row++){
        ctx.beginPath();
        for(var col=0;col<=cols;col++){
          var x=col*gap,y=row*gap;
          var o=fieldOffset(x,y,tick);
          if(col===0)ctx.moveTo(x+o.x,y+o.y);else ctx.lineTo(x+o.x,y+o.y);
        }
        ctx.strokeStyle='rgba(213,255,67,'+(row%4===0?.17:.075)+')';
        ctx.stroke();
      }
      for(var col2=0;col2<=cols;col2++){
        ctx.beginPath();
        for(var row2=0;row2<=rows;row2++){
          var x2=col2*gap,y2=row2*gap,o2=fieldOffset(x2,y2,tick);
          if(row2===0)ctx.moveTo(x2+o2.x,y2+o2.y);else ctx.lineTo(x2+o2.x,y2+o2.y);
        }
        ctx.strokeStyle='rgba(213,255,67,'+(col2%4===0?.16:.055)+')';
        ctx.stroke();
      }
      for(var yy=1;yy<rows;yy++){
        for(var xx=1;xx<cols;xx++){
          var px=xx*gap,py=yy*gap,off=fieldOffset(px,py,tick);
          var pd=Math.hypot(px-pointer.x*fw,py-pointer.y*fh);
          var radius=pointer.active?1.05+Math.max(0,1-pd/180)*2.1:1;
          ctx.beginPath();ctx.arc(px+off.x,py+off.y,radius,0,Math.PI*2);
          ctx.fillStyle=pd<180&&pointer.active?'rgba(232,255,159,.82)':'rgba(213,255,67,.34)';ctx.fill();
        }
      }
    }
    function animateField(){
      tick++;
      pointer.x+=(pointer.tx-pointer.x)*.09;pointer.y+=(pointer.ty-pointer.y)*.09;
      drawField();
      if(!reduced)frame=requestAnimationFrame(animateField);
    }
    field.addEventListener('pointermove',function(e){
      var r=field.getBoundingClientRect();pointer.tx=(e.clientX-r.left)/r.width;pointer.ty=(e.clientY-r.top)/r.height;pointer.active=true;
    });
    field.addEventListener('pointerleave',function(){pointer.active=false;pointer.tx=.73;pointer.ty=.43;});
    if('ResizeObserver' in window)new ResizeObserver(sizeField).observe(field);else window.addEventListener('resize',sizeField,{passive:true});
    sizeField();if(!reduced)frame=requestAnimationFrame(animateField);
    document.addEventListener('visibilitychange',function(){
      if(document.hidden){cancelAnimationFrame(frame);}
      else if(!reduced)frame=requestAnimationFrame(animateField);
    });
  }

  // Minimal cursor and reading progress: motion is decorative, content is not.
  var root=document.body;
  var progress=document.createElement('div');
  progress.className='scroll-progress';progress.setAttribute('aria-hidden','true');
  progress.innerHTML='<span></span>';root.appendChild(progress);
  var progressBar=progress.firstElementChild;
  var cursor=document.createElement('div');cursor.className='cursor-aura';cursor.setAttribute('aria-hidden','true');root.appendChild(cursor);
  var cursorX=0,cursorY=0,cursorVisible=false;
  document.addEventListener('pointermove',function(e){
    cursorX=e.clientX;cursorY=e.clientY;cursorVisible=true;
    cursor.style.left=cursorX+'px';cursor.style.top=cursorY+'px';
    cursor.classList.add('is-visible');
  },{passive:true});
  document.addEventListener('pointerout',function(e){if(!e.relatedTarget){cursor.classList.remove('is-visible');cursorVisible=false;}});
  document.querySelectorAll('a,button,[role="button"]').forEach(function(el){
    el.addEventListener('pointerenter',function(){cursor.classList.add('is-hover');});
    el.addEventListener('pointerleave',function(){cursor.classList.remove('is-hover');});
  });
  var scrollPending=false;
  function updateProgress(){
    var max=document.documentElement.scrollHeight-window.innerHeight;
    var amount=max>0?Math.min(100,Math.max(0,window.scrollY/max*100)):0;
    progressBar.style.width=amount+'%';
    scrollPending=false;
  }
  window.addEventListener('scroll',function(){if(!scrollPending){scrollPending=true;requestAnimationFrame(updateProgress);}},{passive:true});
  window.addEventListener('resize',updateProgress,{passive:true});updateProgress();

  // Staggered entrances give the long page a deliberate pace.
  var revealNodes=document.querySelectorAll('.section-header,.project-card,.atimos-layout,.ecosystem-card,.capability-card,.about-grid,.experience-row,.credential-row,.contact-main,.contact-side');
  if('IntersectionObserver' in window&&!reduced){
    var revealObserver=new IntersectionObserver(function(entries){
      entries.forEach(function(entry){
        if(entry.isIntersecting){entry.target.classList.add('in-view');revealObserver.unobserve(entry.target);}
      });
    },{rootMargin:'0px 0px -7% 0px',threshold:.06});
    revealNodes.forEach(function(node,i){node.classList.add('reveal-ready');node.style.transitionDelay=(i%4)*65+'ms';revealObserver.observe(node);});
  }

  // Seamless loop: repeat the discipline list once, without changing its source content.
  var ticker=document.querySelector('.discipline-strip-inner');
  if(ticker&&!ticker.dataset.looped){
    Array.from(ticker.children).forEach(function(el){
      var copy=el.cloneNode(true);copy.setAttribute('aria-hidden','true');ticker.appendChild(copy);
    });
    ticker.dataset.looped='true';
  }

  // Small pointer response on the primary action, disabled for touch and reduced motion.
  if(!reduced&&window.matchMedia('(hover:hover) and (pointer:fine)').matches){
    document.querySelectorAll('.button-primary').forEach(function(button){
      button.addEventListener('pointermove',function(e){
        var r=button.getBoundingClientRect(),x=(e.clientX-r.left)/r.width-.5,y=(e.clientY-r.top)/r.height-.5;
        button.style.transform='translate('+(x*5)+'px,'+(y*4-2)+'px)';
      });
      button.addEventListener('pointerleave',function(){button.style.transform='';});
    });
  }

})();