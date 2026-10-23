/* Sounds and confetti for practice answers, shared by every lesson page. Also announces answers as events.
   Lesson scripts mark an answer by adding "good" or "bad" to a .fb element inside #pbody,
   so we compare those elements before and after each click there. No lesson code needs to call this. */
(function(){
  "use strict";
  var box=document.getElementById("pbody");if(!box)return;
  var reduce=window.matchMedia&&matchMedia("(prefers-reduced-motion: reduce)").matches;
  var KEY="tlm-sound",on=true,ctx=null;
  try{on=localStorage.getItem(KEY)!=="off"}catch(e){}

  var btn=document.getElementById("soundBtn");
  function drawBtn(){if(!btn)return;btn.setAttribute("aria-pressed",on);btn.innerHTML='<span aria-hidden="true">'+(on?"🔊":"🔇")+'</span> Sound '+(on?"on":"off")}
  if(btn){btn.hidden=false;drawBtn();btn.addEventListener("click",function(){on=!on;try{localStorage.setItem(KEY,on?"on":"off")}catch(e){}drawBtn();if(on)play("good")})}

  /* notes: [frequency Hz, start s, length s] */
  var TUNES={
    good:{type:"triangle",vol:.25,notes:[[523,0,.12],[659,.1,.12],[784,.2,.25]]},
    bad:{type:"sine",vol:.3,notes:[[311,0,.18],[233,.16,.32]]},
    done:{type:"triangle",vol:.22,notes:[[523,0,.14],[659,.13,.14],[784,.26,.14],[1047,.39,.45]]}
  };
  function play(name){
    if(!on)return;
    var AC=window.AudioContext||window.webkitAudioContext;if(!AC)return;
    try{
      ctx=ctx||new AC();if(ctx.state==="suspended")ctx.resume();
      var t=TUNES[name],now=ctx.currentTime;
      t.notes.forEach(function(n){
        var o=ctx.createOscillator(),g=ctx.createGain(),s=now+n[1];
        o.type=t.type;o.frequency.value=n[0];
        g.gain.setValueAtTime(0,s);g.gain.linearRampToValueAtTime(t.vol,s+.02);g.gain.exponentialRampToValueAtTime(.001,s+n[2]);
        o.connect(g);g.connect(ctx.destination);o.start(s);o.stop(s+n[2]+.05);
      });
    }catch(e){}
  }

  var COLORS=["#E11D48","#EA580C","#EAB308","#16A34A","#0284C7","#7C3AED","#C026D3"];
  function confetti(x,y,count){
    if(reduce||!document.body.animate)return;
    for(var i=0;i<count;i++){
      var p=document.createElement("span"),a=Math.random()*Math.PI*2,d=60+Math.random()*120;
      p.className="confetti";p.style.left=x+"px";p.style.top=y+"px";p.style.background=COLORS[i%COLORS.length];
      document.body.appendChild(p);
      p.animate([
        {transform:"translate(-50%,-50%) rotate(0)",opacity:1},
        {transform:"translate("+(Math.cos(a)*d)+"px,"+(Math.sin(a)*d+80)+"px) rotate("+(Math.random()*720)+"deg)",opacity:0}
      ],{duration:900+Math.random()*500,easing:"cubic-bezier(.2,.7,.4,1)"}).onfinish=function(){this.effect.target.remove()};
    }
  }

  /* other scripts (play.js) listen for these: "tlm:answer" {ok} after each answer, "tlm:round" when a round ends */
  function emit(name,detail){try{document.dispatchEvent(new CustomEvent(name,{detail:detail||{}}))}catch(e){}}
  function marks(){return [].map.call(box.querySelectorAll(".fb.good,.fb.bad"),function(f){return {el:f,key:f.className+"|"+f.textContent}})}
  var before=[],hadResult=false,target=null;
  /* capture phase: snapshot before the lesson's own click handler on #pbody runs */
  box.addEventListener("click",function(e){before=marks().map(function(m){return m.key});hadResult=!!box.querySelector(".result");target=e.target.closest("button")},true);
  /* bubble phase: registered after the lesson's handler, so the page is already updated */
  box.addEventListener("click",function(){
    if(!hadResult&&box.querySelector(".result")){play("done");confetti(innerWidth/2,innerHeight/3,60);emit("tlm:round");return}
    var fresh=marks().filter(function(m){return before.indexOf(m.key)<0});
    if(!fresh.length)return;
    var last=fresh[fresh.length-1],ok=!last.el.classList.contains("bad");
    emit("tlm:answer",{ok:ok});
    if(!ok){play("bad");return}
    var r=target&&target.isConnected?target.getBoundingClientRect():last.el.getBoundingClientRect();
    play("good");confetti(r.left+r.width/2,r.top+r.height/2,26);
  });
})();
