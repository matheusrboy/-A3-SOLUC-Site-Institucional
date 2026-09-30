(() => {
  const trigger=document.getElementById('accessibility-trigger');
  const panel=document.getElementById('accessibility-panel');
  const closeButton=document.getElementById('accessibility-close');
  const backdrop=document.getElementById('accessibility-backdrop');
  const textUp=document.getElementById('a11y-text-up');
  const textDown=document.getElementById('a11y-text-down');
  const contrast=document.getElementById('a11y-contrast');
  const links=document.getElementById('a11y-links');
  const font=document.getElementById('a11y-font');
  const motion=document.getElementById('a11y-motion');
  const reset=document.getElementById('a11y-reset');
  const speakStart=document.getElementById('speak-start');
  const speakPause=document.getElementById('speak-pause');
  const speakStop=document.getElementById('speak-stop');
  const status=document.getElementById('accessibility-status');
  if(!trigger||!panel)return;

  const defaults={textScale:1,highContrast:false,highlightLinks:false,readableFont:false,reduceMotion:false};
  let prefs={...defaults};
  try{prefs={...defaults,...JSON.parse(localStorage.getItem('a3-accessibility')||'{}')}}catch(_){}

  const scalable=['main h1','main h2','main h3','main h4','main p','main a','main button','main label','main small','.site-header .main-nav a','.site-header .brand-name strong','.site-header .brand-name small','.site-footer p','.site-footer a'].join(',');
  const capture=()=>document.querySelectorAll(scalable).forEach(el=>{if(!el.dataset.a11yBaseFontSize)el.dataset.a11yBaseFontSize=String(parseFloat(getComputedStyle(el).fontSize)||16)});
  const applyScale=()=>{const els=document.querySelectorAll(scalable);if(prefs.textScale===1){els.forEach(el=>el.style.removeProperty('font-size'));return}capture();els.forEach(el=>{const base=parseFloat(el.dataset.a11yBaseFontSize||'16');el.style.fontSize=(Math.round(base*prefs.textScale*100)/100)+'px'})};
  const press=(btn,val)=>btn?.setAttribute('aria-pressed',String(Boolean(val)));
  const save=()=>{try{localStorage.setItem('a3-accessibility',JSON.stringify(prefs))}catch(_){}};
  const apply=()=>{document.body.classList.toggle('a11y-high-contrast',prefs.highContrast);document.body.classList.toggle('a11y-link-highlight',prefs.highlightLinks);document.body.classList.toggle('a11y-readable-font',prefs.readableFont);document.documentElement.classList.toggle('a11y-reduce-motion',prefs.reduceMotion);press(contrast,prefs.highContrast);press(links,prefs.highlightLinks);press(font,prefs.readableFont);press(motion,prefs.reduceMotion);applyScale()};
  const toggle=key=>{prefs[key]=!prefs[key];apply();save()};
  textUp?.addEventListener('click',()=>{prefs.textScale=Math.min(1.3,Math.round((prefs.textScale+.1)*10)/10);applyScale();save()});
  textDown?.addEventListener('click',()=>{prefs.textScale=Math.max(.9,Math.round((prefs.textScale-.1)*10)/10);applyScale();save()});
  contrast?.addEventListener('click',()=>toggle('highContrast'));links?.addEventListener('click',()=>toggle('highlightLinks'));font?.addEventListener('click',()=>toggle('readableFont'));motion?.addEventListener('click',()=>toggle('reduceMotion'));
  reset?.addEventListener('click',()=>{prefs={...defaults};apply();save()});apply();

  let previousFocus=null,previousOverflow='',isolated=[];
  const focusableSelector=['a[href]','button:not([disabled])','input:not([disabled])','select:not([disabled])','textarea:not([disabled])','[tabindex]:not([tabindex="-1"])'].join(',');
  const focusables=()=>[...panel.querySelectorAll(focusableSelector)].filter(el=>!el.hasAttribute('hidden')&&el.getClientRects().length>0);
  const isolate=()=>{isolated=[];[...document.body.children].forEach(el=>{if(!(el instanceof HTMLElement)||el===panel||el===backdrop||el.tagName==='SCRIPT'||el.tagName==='STYLE')return;isolated.push({el,inert:el.inert,ariaHidden:el.getAttribute('aria-hidden')});el.inert=true;el.setAttribute('aria-hidden','true')})};
  const restore=()=>{isolated.forEach(({el,inert,ariaHidden})=>{el.inert=inert;if(ariaHidden===null)el.removeAttribute('aria-hidden');else el.setAttribute('aria-hidden',ariaHidden)});isolated=[]};
  const setStatus=msg=>{if(status)status.textContent=msg};
  let speechReading=false;
  const open=()=>{previousFocus=document.activeElement instanceof HTMLElement?document.activeElement:trigger;previousOverflow=document.body.style.overflow;panel.removeAttribute('hidden');backdrop?.removeAttribute('hidden');trigger.setAttribute('aria-expanded','true');document.body.style.overflow='hidden';setStatus(speechReading?'Leitura em andamento.':'Pronto para iniciar a leitura.');(closeButton||panel).focus();isolate()};
  const close=()=>{if(panel.hasAttribute('hidden'))return;restore();panel.setAttribute('hidden','');backdrop?.setAttribute('hidden','');trigger.setAttribute('aria-expanded','false');document.body.style.overflow=previousOverflow;const target=previousFocus||trigger;previousFocus=null;target?.focus()};
  trigger.addEventListener('click',()=>panel.hasAttribute('hidden')?open():close());closeButton?.addEventListener('click',close);backdrop?.addEventListener('click',close);
  document.addEventListener('keydown',event=>{if(panel.hasAttribute('hidden'))return;if(event.key==='Escape'){event.preventDefault();close();return}if(event.key!=='Tab')return;const items=focusables();if(!items.length){event.preventDefault();panel.focus();return}const first=items[0],last=items[items.length-1],active=document.activeElement;if(event.shiftKey&&(active===first||!panel.contains(active))){event.preventDefault();last.focus()}else if(!event.shiftKey&&(active===last||!panel.contains(active))){event.preventDefault();first.focus()}});

  const speechSupported='speechSynthesis'in window&&typeof window.SpeechSynthesisUtterance==='function';
  let speechChunks=[],speechIndex=0,speechPaused=false,preferredVoice=null,activeUtterance=null,speechTimer=null;
  const loadVoice=()=>{if(!speechSupported)return;const voices=window.speechSynthesis.getVoices();preferredVoice=voices.find(v=>/^pt-BR$/i.test(v.lang))||voices.find(v=>/^pt/i.test(v.lang))||voices.find(v=>/portugu/i.test(v.name))||null};
  if(speechSupported){loadVoice();window.speechSynthesis.onvoiceschanged=loadVoice}
  const updateButtons=()=>{if(!speechSupported){if(speakStart)speakStart.disabled=true;if(speakPause)speakPause.disabled=true;if(speakStop)speakStop.disabled=true;setStatus('A leitura em voz alta não está disponível neste navegador.');return}if(speakStart)speakStart.disabled=speechReading;if(speakPause){speakPause.disabled=!speechReading;speakPause.innerHTML='<span aria-hidden="true">Ⅱ</span> '+(speechPaused?'Continuar':'Pausar')}if(speakStop)speakStop.disabled=!speechReading};
  const readable=()=>{const main=document.querySelector('main');if(!main)return'';const clone=main.cloneNode(true);clone.querySelectorAll('script,style,svg,iframe,form,button,input,textarea,select,[hidden]').forEach(el=>el.remove());return(clone.textContent||'').replace(/\s+/g,' ').replace(/•/g,',').replace(/↗|→/g,'').trim()};
  const splitText=(text,max=170)=>{const chunks=[],sentences=text.match(/[^.!?;:]+[.!?;:]?|[^.!?;:]+$/g)||[text];let current='';const push=()=>{if(current.trim())chunks.push(current.trim());current=''};sentences.forEach(sentence=>{const clean=sentence.trim();if(!clean)return;if((current+' '+clean).trim().length<=max){current=(current+' '+clean).trim();return}push();if(clean.length<=max){current=clean;return}clean.split(/\s+/).forEach(word=>{if((current+' '+word).trim().length>max)push();current=(current+' '+word).trim()})});push();return chunks};
  const clearTimer=()=>{if(speechTimer){clearTimeout(speechTimer);speechTimer=null}};
  const finish=(msg='Leitura concluída.')=>{clearTimer();speechReading=false;speechPaused=false;speechChunks=[];speechIndex=0;activeUtterance=null;setStatus(msg);updateButtons()};
  const speakNext=()=>{if(!speechSupported||!speechReading)return;if(speechIndex>=speechChunks.length){finish();return}activeUtterance=new SpeechSynthesisUtterance(speechChunks[speechIndex]);activeUtterance.lang=preferredVoice?.lang||'pt-BR';if(preferredVoice)activeUtterance.voice=preferredVoice;activeUtterance.rate=.96;activeUtterance.onstart=()=>setStatus('Lendo o conteúdo da página…');activeUtterance.onend=()=>{if(!speechReading)return;activeUtterance=null;speechIndex+=1;speechTimer=setTimeout(speakNext,80)};activeUtterance.onerror=event=>{if(event.error==='canceled'||event.error==='interrupted')return;finish('Não foi possível reproduzir a leitura. Tente novamente.')};try{window.speechSynthesis.speak(activeUtterance)}catch(_){finish('Não foi possível iniciar a leitura neste navegador.')}};
  const startSpeech=()=>{if(!speechSupported){setStatus('A leitura em voz alta não está disponível neste navegador.');return}const text=readable();if(!text){setStatus('Não encontrei conteúdo para ler.');return}clearTimer();window.speechSynthesis.cancel();speechChunks=splitText(text);speechIndex=0;speechPaused=false;speechReading=true;setStatus('Preparando a leitura…');updateButtons();speechTimer=setTimeout(()=>{loadVoice();speakNext()},180)};
  speakStart?.addEventListener('click',startSpeech);
  speakPause?.addEventListener('click',()=>{if(!speechSupported||!speechReading)return;if(speechPaused){window.speechSynthesis.resume();speechPaused=false;setStatus('Leitura retomada.')}else{window.speechSynthesis.pause();speechPaused=true;setStatus('Leitura pausada.')}updateButtons()});
  speakStop?.addEventListener('click',()=>{if(!speechSupported)return;clearTimer();window.speechSynthesis.cancel();finish('Leitura interrompida.')});
  window.addEventListener('beforeunload',()=>{if(!speechSupported)return;clearTimer();window.speechSynthesis.cancel()});updateButtons()
})();