(function(){
  'use strict';
  var s=document.currentScript||document.getElementsByTagName('script')[document.getElementsByTagName('script').length-1];
  var KEY=s.getAttribute('data-site');
  var HOST=s.src.replace(/\/p\.js.*/,'');
  var URL_COLLECT=HOST+'/api/collect';
  if(!KEY) return;
  if(/bot|headless|phantom|prerender/i.test(navigator.userAgent)) return;
  if(navigator.doNotTrack==='1') return;
  function utmParam(k){return new URLSearchParams(location.search).get(k)||null}
  function send(type,extra){
    var body=JSON.stringify(Object.assign({
      type:type,siteKey:KEY,url:location.href,
      referrer:document.referrer||null,
      utmSource:utmParam('utm_source'),
      utmMedium:utmParam('utm_medium'),
      utmCampaign:utmParam('utm_campaign')
    },extra||{}));
    if(navigator.sendBeacon){
      navigator.sendBeacon(URL_COLLECT,new Blob([body],{type:'application/json'}));
    } else {
      fetch(URL_COLLECT,{method:'POST',body:body,headers:{'Content-Type':'application/json'},keepalive:true}).catch(function(){});
    }
  }
  function trackPageview(){send('pageview')}
  function trackEvent(name,props){send('event',{eventName:name,props:props||null})}
  // Auto-track data-pp elements
  document.addEventListener('click',function(e){
    var t=e.target;
    while(t&&t!==document.body){
      var n=t.getAttribute&&t.getAttribute('data-pp');
      if(n){trackEvent(n,{text:t.innerText?t.innerText.slice(0,64):null,href:t.href||null});return;}
      t=t.parentElement;
    }
  },{passive:true});
  // SPA support
  var last=location.href;
  function onNav(){if(location.href!==last){last=location.href;trackPageview();}}
  var op=history.pushState,or=history.replaceState;
  history.pushState=function(){op.apply(this,arguments);onNav();};
  history.replaceState=function(){or.apply(this,arguments);onNav();};
  window.addEventListener('popstate',onNav);
  // Global API
  window.pp=function(action,name,props){if(action==='event')trackEvent(name,props);};
  // Fire initial pageview
  if(document.readyState==='loading'){document.addEventListener('DOMContentLoaded',trackPageview);}
  else{setTimeout(trackPageview,0);}
})();
