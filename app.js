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
})();