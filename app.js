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

  // Field Notes: every project has a real, keyboard-accessible detail view.
  var caseDialog=document.getElementById('case-dialog');
  var casePanel=caseDialog&&caseDialog.querySelector('.case-panel');
  var caseMedia=document.getElementById('case-media');
  var caseStory=document.getElementById('case-story');
  var caseTags=document.getElementById('case-tags');
  var caseLinks=document.getElementById('case-links');
  var caseOpener=null;
  var activeCaseIndex=0;
  var caseData=[
    {
      id:'senura',title:'Senura AI',kind:'AI / LANGUAGE MODELS',status:'In progress',role:'Independent learning project',caption:'MODEL STUDY / CONCEPT VISUAL',
      lede:'A model is more than its parameter count. This experiment starts with the data, the training loop, and the cost of learning something useful from limited compute.',
      story:[
        {label:'01 / THE QUESTION',title:'What does the data teach?',copy:'Explore the early decisions behind language-model work: dataset preparation, training workflow, and how to judge whether an experiment is telling you anything useful.'},
        {label:'02 / THE APPROACH',title:'Make the constraints part of the method.',copy:'The project has explored a roughly one-billion-parameter target and efficient-compute ideas, including 8-bit quantization. Those are experiment plans—not evidence of a finished model.'},
        {label:'03 / REALITY CHECK',title:'Still a work in progress.',copy:'Senura AI is not presented as a released model, and there are no public benchmark results being claimed here. The value right now is learning the pipeline and its trade-offs.'}
      ],
      tags:['Dataset preparation','Kaggle','T4 GPUs','Quantization research'],links:[],note:'Concept visuals are illustrations, not screenshots of a trained model.'
    },
    {
      id:'helios',title:'HELIOS',kind:'AI / PERSONAL COMPUTING',status:'Concept',role:'Product architecture & systems thinking',caption:'INTERACTION STUDY / CONCEPT VISUAL',
      lede:'What if a desktop assistant behaved less like a chat tab and more like a thoughtful, persistent layer across your computer?',
      story:[
        {label:'01 / THE IDEA',title:'Context that stays useful.',copy:'HELIOS is a vision for a local-first AI desktop companion that can remember working context, understand the task at hand, and move between research, files, browser, terminal and apps.'},
        {label:'02 / THE SYSTEM',title:'Reasoning needs tools—and boundaries.',copy:'The concept explores memory, tool routing, workflow orchestration and verification. Important or destructive actions stay behind explicit confirmation rather than happening invisibly.'},
        {label:'03 / THE STATUS',title:'A product vision, not a released OS.',copy:'The interface and capabilities shown here describe the direction of the project. They should not be mistaken for a fully implemented operating system or an already-working all-app agent.'}
      ],
      tags:['Local-first AI','Memory design','Agent workflows','Permission boundaries'],links:[],note:'HELIOS is currently presented as a concept.'
    },
    {
      id:'atimos-flow',title:'Atimos Flow',kind:'ATIMOS AI / DESIGN SYSTEM',status:'Evolving',role:'Design language & interaction patterns',caption:'DESIGN SYSTEM STUDY',
      lede:'A softer visual language for human–AI interaction—calm surfaces and useful hierarchy instead of endless neon, glass and noise.',
      story:[
        {label:'01 / THE PRINCIPLE',title:'Quiet does not mean generic.',copy:'Lavender, mint, soft blue, peach and warm neutrals give Atimos Flow a recognizable emotional register. Colour is used to signal a state or affordance, not to decorate every surface.'},
        {label:'02 / THE PARTS',title:'A vocabulary, not a moodboard.',copy:'The evolving system includes Flow Surface, Flow Capsule, system panels, notifications, active tasks, spaces and the HELIOS Orb. Components are intended to feel related across future interfaces.'},
        {label:'03 / THE STATUS',title:'Still being shaped.',copy:'The visuals demonstrate a developing design system; they are not a claim that a complete production component library has been shipped.'}
      ],
      tags:['Design systems','Human–AI UX','Pastel palette','Component language'],links:[],note:'UI in this case study is a designed exploration.'
    },
    {
      id:'prompt-tools',title:'Promptetix & agent experiments',kind:'AI / WORKFLOW DESIGN',status:'Exploration',role:'Prompt design & orchestration experiments',caption:'WORKFLOW STUDY',
      lede:'The interesting shift is from writing a clever prompt to designing a workflow that can reason, use tools, and recover when a step fails.',
      story:[
        {label:'01 / THE QUESTION',title:'How should an agent think through a task?',copy:'Promptetix (including V3 explorations), Promptmatics, AI Lang and early Syntax Bot ideas sit in the same playground: how to make instructions reusable and work more consistent.'},
        {label:'02 / THE EXPERIMENTS',title:'Structure beats prompt sprawl.',copy:'The direction explores multiple steps, subagents, reusable context and graph-shaped orchestration. The aim is to make roles, hand-offs and outputs explicit instead of hiding everything inside one enormous prompt.'},
        {label:'03 / THE STATUS',title:'A family of early ideas.',copy:'These are experiments and product directions at different stages, not a single mature platform with every capability already integrated.'}
      ],
      tags:['Prompt patterns','Subagents','Context design','Workflow graphs'],links:[],note:'Names in this family refer to separate explorations, not one shipped product.'
    },
    {
      id:'api-doctor',title:'API Key Health Doctor',kind:'AI / DEVELOPER TOOLING',status:'Prototype',role:'Developer experience experiment',caption:'TOOL INTERFACE STUDY',
      lede:'Provider setup errors waste time. This small tool explores how a developer can move from a vague failure to a more useful diagnosis.',
      story:[
        {label:'01 / THE FRICTION',title:'“It doesn’t work” is not a diagnosis.',copy:'AI provider integrations can fail for different reasons. The experiment separates checking the expected key shape from checking whether a provider connection actually responds.'},
        {label:'02 / THE FLOW',title:'Make each check legible.',copy:'The visible diagnostic sequence explores provider inspection, key-shape validation and response checking. The intent is clearer feedback for debugging—not a blanket security audit.'},
        {label:'03 / THE NEXT STEP',title:'Inspect the implementation.',copy:'The linked repository is the source of truth for the current code. This portfolio describes the direction of the tool and does not claim universal provider coverage.'}
      ],
      tags:['API diagnostics','Provider responses','Developer tooling','Debugging'],links:[{label:'View source repository',url:'https://github.com/okojiayan/Api-Key-Tester',type:'repo'}],note:'Never paste a secret API key into a public portfolio or issue.'
    },
    {
      id:'webhorizn',title:'WebHorizn',kind:'WEB / LIVE PROJECT',status:'Live',role:'Web design & development',caption:'LIVE SITE CAPTURE',
      lede:'A web-development brand needs to look credible before a potential client knows anything about the person behind it.',
      story:[
        {label:'01 / THE BRIEF',title:'Make the offer easy to understand.',copy:'WebHorizn focuses on business websites: clear positioning, responsive presentation, service/package information and an enquiry path that is easy to find.'},
        {label:'02 / THE BUILD',title:'Structure before decoration.',copy:'The project brings together page hierarchy, custom styling, responsive layouts, interaction details and a deployable front-end. The site is live, so you can inspect the actual experience rather than relying on a mockup.'},
        {label:'03 / THE STATUS',title:'A live website.',copy:'This is the portfolio’s direct, visitable web project. Follow the live link to judge the current build for yourself.'}
      ],
      tags:['HTML / CSS / JavaScript','Responsive design','Vercel','Service storytelling'],links:[{label:'Visit the live website',url:'https://webhorizn.vercel.app/',type:'live'}],note:'The artwork above is a capture of the live website.'
    },
    {
      id:'vastu',title:'Vastu landing page',kind:'WEB / LANDING PAGE',status:'Build & integration',role:'Landing-page design & deployment',caption:'LANDING PAGE STUDY',
      lede:'A focused landing page has two jobs: tell a clear story and turn genuine interest into a lead without making the user work for it.',
      story:[
        {label:'01 / THE EXPERIENCE',title:'Give the page one clear purpose.',copy:'This build explores a more visual landing-page structure, with deliberate type hierarchy and a designed path toward an enquiry.'},
        {label:'02 / THE IMPLEMENTATION',title:'Design meets the data flow.',copy:'The work includes deployment on Netlify and exploration of a Google Sheets lead workflow—so a design decision is tied to the practical handling of an enquiry.'},
        {label:'03 / THE STATUS',title:'One integration still needs proof.',copy:'The Sheets connection has not been verified end-to-end in this portfolio, so it is recorded as build and integration work rather than marked complete.'}
      ],
      tags:['Landing pages','Netlify','Lead capture','Google Sheets workflow'],links:[],note:'Lead capture is not described as fully working until the full flow is verified.'
    },
    {
      id:'doctor-robot',title:'Doctor Robot',kind:'ROBOTICS / EMBEDDED SYSTEMS',status:'Prototype',role:'School robotics build',caption:'MECHANICAL STUDY / PROTOTYPE',
      lede:'A school robotics project where the software has to survive contact with motors, power and actual wiring.',
      story:[
        {label:'01 / THE PROBLEM',title:'Make the hardware move predictably.',copy:'The prototype explores motor control and battery-powered movement. In robotics, a wiring plan and power budget matter as much as the sketch running on the board.'},
        {label:'02 / THE BUILD',title:'Keep the system understandable.',copy:'The planned hardware uses an Arduino UNO, an L298N motor driver and geared DC motors. Each part has a tangible role in control and movement.'},
        {label:'03 / THE BOUNDARY',title:'A learning prototype—not a medical device.',copy:'“Doctor Robot” is the project name. This is school robotics work and is not represented as a clinically tested or deployed assistive medical product.'}
      ],
      tags:['Arduino UNO','L298N','Geared DC motors','Power electronics'],links:[],note:'Illustration is an original concept graphic, not a photograph of a completed robot.'
    },
    {
      id:'robo-rumble',title:'Robo Rumble 2026',kind:'ROBOTICS / EVENT EXPERIENCE',status:'2026 event',role:'Organiser & host',caption:'EVENT IDENTITY STUDY',
      lede:'Engineering is not only the robot. It is also the schedule, the teams, the rules, the hand-offs and the energy in the room.',
      story:[
        {label:'01 / THE EVENT',title:'An inter-house robotics competition.',copy:'Robo Rumble brought together school teams around RoboRace, RoboWar and RoboSoccer—three formats with different demands on build quality, strategy and match flow.'},
        {label:'02 / THE ROLE',title:'Coordinate the moving parts.',copy:'The work included helping organise the event and hosting it. It put communication, timing and coordination alongside the technical side of robotics.'},
        {label:'03 / THE TAKEAWAY',title:'The system includes the people.',copy:'A competition is an operational design problem: teams need to understand what happens next, organisers need clear hand-offs, and an audience needs a story to follow.'}
      ],
      tags:['Event operations','RoboRace','RoboWar','RoboSoccer','Hosting'],links:[],note:'This is an event experience, not a software product.'
    },
    {
      id:'dance-maze',title:'Dance Maze Company',kind:'CREATIVE / AI-ASSISTED MEDIA',status:'Exploration',role:'Creative direction & video workflow',caption:'MOTION / STORYBOARD STUDY',
      lede:'A promotional video has to feel like one idea from the first frame to the final beat—not a pile of individually impressive AI clips.',
      story:[
        {label:'01 / THE BRIEF',title:'Give the dance brand a point of view.',copy:'The direction is a promotional piece for Dance Maze Company, a dance academy brand whose visual story should welcome a broader mix of dancers and feel like a real company, not a generic fitness ad.'},
        {label:'02 / THE PIPELINE',title:'Make image, voice and timing agree.',copy:'The exploration combines storyboard beats, generated video sequences and an ElevenLabs voice track. A roughly 49-second voice track has to sit naturally inside a planned 60–70-second edit.'},
        {label:'03 / THE STATUS',title:'A creative production in progress.',copy:'This is a developing promotional-video workflow, not a claim that a finished campaign has already shipped.'}
      ],
      tags:['Creative direction','Generative video','Voice generation','Editing rhythm'],links:[],note:'The artwork is a mood/visual study, not a frame from the final ad.'
    }
  ];
  var caseById={};
  caseData.forEach(function(item,i){item.index=i;caseById[item.id]=item;});
  function makeCaseElement(tag,className,textValue){
    var node=document.createElement(tag);if(className)node.className=className;
    if(textValue!==undefined)node.textContent=textValue;return node;
  }
  function fillCaseStory(item){
    caseStory.replaceChildren();
    item.story.forEach(function(part){
      var block=makeCaseElement('article','case-story-block');
      block.appendChild(makeCaseElement('span','case-story-label',part.label));
      block.appendChild(makeCaseElement('h3','case-story-heading',part.title));
      block.appendChild(makeCaseElement('p','case-story-copy',part.copy));
      caseStory.appendChild(block);
    });
  }
  function fillCaseTags(item){
    caseTags.replaceChildren();
    item.tags.forEach(function(tag){caseTags.appendChild(makeCaseElement('span','case-tag',tag));});
  }
  function fillCaseLinks(item){
    caseLinks.replaceChildren();
    if(!item.links.length){
      caseLinks.appendChild(makeCaseElement('span','case-no-link','No public demo yet — this work is shown at its current stage.'));
      return;
    }
    item.links.forEach(function(link){
      var a=makeCaseElement('a','case-link',link.label);a.href=link.url;
      a.target='_blank';a.rel='noopener noreferrer';
      a.appendChild(makeCaseElement('span','case-link-arrow','↗'));
      caseLinks.appendChild(a);
    });
  }
  function showCase(index,focusPanel){
    if(!caseDialog||!casePanel)return;
    activeCaseIndex=(index+caseData.length)%caseData.length;
    var item=caseData[activeCaseIndex];
    var source=document.querySelector('.project-card [data-case="'+item.id+'"]');
    var card=source&&source.closest('.project-card');
    if(!card)return;
    document.getElementById('case-count').textContent=String(activeCaseIndex+1).padStart(2,'0')+' / '+String(caseData.length).padStart(2,'0');
    document.getElementById('case-eyebrow').textContent='FIELD NOTE / '+String(activeCaseIndex+1).padStart(2,'0')+' — '+item.kind;
    document.getElementById('case-title').textContent=item.title;
    document.getElementById('case-lede').textContent=item.lede;
    document.getElementById('case-status').textContent=item.status;
    document.getElementById('case-role').textContent=item.role;
    document.getElementById('case-caption').textContent=item.caption;
    document.getElementById('case-prev').querySelector('strong').textContent=caseData[(activeCaseIndex+caseData.length-1)%caseData.length].title;
    document.getElementById('case-next').querySelector('strong').textContent=caseData[(activeCaseIndex+1)%caseData.length].title;
    caseMedia.replaceChildren();
    var cover=card.querySelector('.project-cover');
    if(cover){
      var clone=cover.cloneNode(true);
      clone.querySelectorAll('.cover-top,.cover-title,.cover-gradient').forEach(function(el){el.remove();});
      clone.setAttribute('aria-hidden','true');
      clone.querySelectorAll('img').forEach(function(img){img.loading='eager';img.alt='';});
      caseMedia.appendChild(clone);
    }
    caseMedia.appendChild(makeCaseElement('span','case-art-index',String(activeCaseIndex+1).padStart(2,'0')+' / FIELD ARCHIVE'));
    fillCaseStory(item);fillCaseTags(item);fillCaseLinks(item);
    document.getElementById('case-prev').disabled=caseData.length<2;
    document.getElementById('case-next').disabled=caseData.length<2;
    casePanel.scrollTop=0;
    if(focusPanel)document.querySelector('.case-close').focus({preventScroll:true});
  }
  function openCase(id,trigger){
    var item=caseById[id];if(!item||!caseDialog)return;
    caseOpener=trigger||document.activeElement;
    showCase(item.index,true);
    caseDialog.hidden=false;document.body.classList.add('case-modal-open');
    document.querySelector('.case-close').focus({preventScroll:true});
  }
  function closeCase(){
    if(!caseDialog||caseDialog.hidden)return;
    caseDialog.hidden=true;document.body.classList.remove('case-modal-open');
    if(caseOpener&&caseOpener.isConnected)caseOpener.focus({preventScroll:true});
  }
  document.querySelectorAll('.case-open').forEach(function(button){
    button.addEventListener('click',function(){openCase(button.getAttribute('data-case'),button);});
  });
  if(caseDialog){
    caseDialog.querySelectorAll('[data-case-close]').forEach(function(el){el.addEventListener('click',closeCase);});
    document.querySelector('[data-case-home]').addEventListener('click',function(e){e.preventDefault();closeCase();window.scrollTo({top:0,behavior:reduced?'auto':'smooth'});});
    document.getElementById('case-prev').addEventListener('click',function(){showCase(activeCaseIndex-1,true);});
    document.getElementById('case-next').addEventListener('click',function(){showCase(activeCaseIndex+1,true);});
    caseDialog.addEventListener('keydown',function(e){
      if(e.key==='Escape'){e.preventDefault();closeCase();return;}
      if(e.key==='ArrowLeft'){e.preventDefault();showCase(activeCaseIndex-1,true);return;}
      if(e.key==='ArrowRight'){e.preventDefault();showCase(activeCaseIndex+1,true);return;}
      if(e.key==='Tab'){
        var focusable=Array.from(casePanel.querySelectorAll('a[href],button:not(:disabled),[tabindex="0"]')).filter(function(el){return el.offsetWidth||el.offsetHeight||el===document.activeElement;});
        if(!focusable.length)return;
        var first=focusable[0],last=focusable[focusable.length-1];
        if(e.shiftKey&&document.activeElement===first){e.preventDefault();last.focus();}
        else if(!e.shiftKey&&document.activeElement===last){e.preventDefault();first.focus();}
      }
    });
  }

})();