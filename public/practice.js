/* Shared practice helpers for lesson pages, loaded in <head> before the lesson script. */
window.TLM=(function(){
  "use strict";
  function shuffle(a){a=a.slice();for(var i=a.length-1;i>0;i--){var j=Math.floor(Math.random()*(i+1));var t=a[i];a[i]=a[j];a[j]=t}return a}
  function pickOne(a){return a[Math.floor(Math.random()*a.length)]}
  function hash(x){var s=JSON.stringify(x),h=5381;for(var i=0;i<s.length;i++)h=(h*33^s.charCodeAt(i))>>>0;return h.toString(36)}

  /* n random items from list. Items this device has not seen yet come first; once every item
     has been seen, the cycle starts again. key names the question bank, e.g. "voices-spot-6". */
  function deal(key,list,n){
    var k="tlm-seen-"+key,seen=[];
    try{seen=JSON.parse(localStorage.getItem(k))||[]}catch(e){}
    var fresh=[],old=[];
    shuffle(list).forEach(function(x){(seen.indexOf(hash(x))<0?fresh:old).push(x)});
    var out=fresh.concat(old).slice(0,n);
    seen=(fresh.length<n?[]:seen).concat(out.map(hash));
    try{localStorage.setItem(k,JSON.stringify(seen))}catch(e){}
    return out;
  }

  /* Stars for a round: 1 for finishing, 2 for 60% or more, 3 for 90% or more.
     The best per lesson is kept on this device ("tlm-stars") and shown on the start page cards. */
  var STARS="tlm-stars",inRetry=false;
  function lesson(){return decodeURIComponent(location.pathname.split("/").pop()).replace(/\.html$/,"")}
  function bestStars(){try{return JSON.parse(localStorage.getItem(STARS))||{}}catch(e){return {}}}
  function starsHTML(k,label){var s="";for(var i=1;i<=3;i++)s+=i<=k?"⭐":'<span class="off">⭐</span>';return '<span class="stars" role="img" aria-label="'+label+'">'+s+'</span>'}

  /* End-of-round screen. Offers a retry round when there were mistakes (button data-act="retry").
     A retry round's score earns no stars: replaying only your mistakes would make 3 stars too easy. */
  function result(score,n,msg,misses){
    var stars="";
    if(!inRetry&&n){
      var k=score>=n*.9?3:score>=n*.6?2:1,all=bestStars(),was=all[lesson()]||0;
      if(k>was){all[lesson()]=k;try{localStorage.setItem(STARS,JSON.stringify(all))}catch(e){}}
      stars='<p class="starline">'+starsHTML(k,k+" out of 3 stars")+(k>was&&was?' <b>New best!</b>':'')+'</p>';
    }
    inRetry=false;
    return '<div class="result"><p class="count">Round complete</p>'+stars+'<p class="big">'+score+' out of '+n+'</p><p>'+msg+'</p><div class="row">'+
      (misses?'<button type="button" class="btn" data-act="retry">Try my mistakes again ('+misses+')</button>':'')+
      '<button type="button" class="btn'+(misses?' alt':'')+'" data-act="again">'+(misses?'New round':'Play again')+'</button></div></div>';
  }

  /* Fresh game state for a retry round: the missed questions, and their options, in a new order. */
  function retry(missed){
    inRetry=true;
    var q=shuffle(missed).map(function(x){if(!x||!x.o)return x;var c={},k;for(k in x)c[k]=x[k];c.o=shuffle(x.o);return c});
    return {i:0,score:0,ans:null,picked:[],checked:false,ok:false,miss:[],q:q};
  }

  return {shuffle:shuffle,pickOne:pickOne,deal:deal,result:result,retry:retry,bestStars:bestStars,starsHTML:starsHTML};
})();

/* Remember the student's class across lessons (also set on the start page). After the lesson script has run,
   tap the saved class button so the lesson's own class switch redraws the page. */
document.addEventListener("DOMContentLoaded",function(){
  var seg=document.getElementById("classSeg"),KEY="tlm-class",c=null;if(!seg)return;
  try{c=localStorage.getItem(KEY)}catch(e){}
  var b=c&&seg.querySelector('button[data-c="'+c+'"]');
  if(b&&b.getAttribute("aria-pressed")!=="true")b.click();
  seg.addEventListener("click",function(e){var x=e.target.closest("button[data-c]");if(x)try{localStorage.setItem(KEY,x.dataset.c)}catch(err){}});
});
