/* Team game, streaks and hints for the practice area of every lesson page.
   Listens for "tlm:answer" / "tlm:round" from feedback.js. Hints need the lesson to mark the
   correct answer button with data-right; games without it (build/order games) show no Hint button. */
(function(){
  "use strict";
  var box=document.getElementById("pbody");if(!box)return;

  /* controls above the game: Hint, Team game, and the scoreboard */
  var bar=document.createElement("div");bar.className="playbar";
  bar.innerHTML='<button type="button" class="btn alt" id="hintBtn" hidden><span aria-hidden="true">💡</span> Hint</button>'+
    '<button type="button" class="btn alt" id="teamBtn" aria-pressed="false"><span aria-hidden="true">👥</span> Team game</button>'+
    '<div class="teams" id="teams" hidden>'+
      '<div class="team" data-t="0"><b>Team A</b><span>0</span></div>'+
      '<p class="turn" id="turn" aria-live="polite"></p>'+
      '<div class="team" data-t="1"><b>Team B</b><span>0</span></div>'+
      '<button type="button" class="btn alt" id="newMatch">New match</button>'+
    '</div>';
  box.parentNode.insertBefore(bar,box);
  var toastEl=document.createElement("p");toastEl.className="toast";toastEl.setAttribute("aria-live","polite");document.body.appendChild(toastEl);
  var toastT=0;
  function toast(msg){toastEl.textContent=msg;toastEl.classList.add("show");clearTimeout(toastT);toastT=setTimeout(function(){toastEl.classList.remove("show")},1800)}

  /* ---------- team game ---------- */
  var team=false,turn=0,score=[0,0],NAMES=["Team A","Team B"];
  function drawTeams(){
    document.getElementById("teamBtn").setAttribute("aria-pressed",team);
    document.getElementById("teams").hidden=!team;
    bar.querySelectorAll(".team").forEach(function(el,i){el.lastChild.textContent=score[i];el.classList.toggle("on",i===turn)});
    document.getElementById("turn").textContent=NAMES[turn]+"’s turn";
  }
  document.getElementById("teamBtn").addEventListener("click",function(){team=!team;turn=0;score=[0,0];drawTeams()});
  document.getElementById("newMatch").addEventListener("click",function(){turn=0;score=[0,0];drawTeams();toast("New match! "+NAMES[0]+" goes first.")});

  /* ---------- streaks ---------- */
  var streak=0,CHEERS={3:"🔥 3 in a row!",5:"🌟 5 in a row! Super!",8:"🚀 8 in a row! Amazing!",12:"🏆 12 in a row! Champion!"};
  document.addEventListener("tlm:answer",function(e){
    var ok=e.detail.ok;
    if(team){
      if(ok){score[turn]++;toast("🎉 "+NAMES[turn]+" scores!")}else toast("Oh no! Over to "+NAMES[1-turn]+".");
      turn=1-turn;drawTeams();return;
    }
    streak=ok?streak+1:0;
    if(CHEERS[streak])toast(CHEERS[streak]);
  });
  document.addEventListener("tlm:round",function(){
    streak=0;
    if(!team)return;
    var a=score[0],b=score[1];
    toast(a===b?"🤝 It’s a tie, "+a+" – "+b+"!":"🏆 "+NAMES[a>b?0:1]+" is winning "+Math.max(a,b)+" – "+Math.min(a,b)+"!");
  });

  /* ---------- hint: grey out one wrong option, once per question ---------- */
  var hintBtn=document.getElementById("hintBtn");
  /* same text as the right one also counts as right (a word can appear twice in tap-the-word games) */
  function wrongOptions(right){
    return [].filter.call(right.parentNode.querySelectorAll("button"),function(b){return b!==right&&!b.disabled&&b.textContent!==right.textContent});
  }
  function updateHint(){
    var right=box.querySelector("[data-right]");
    /* keep at least one wrong option, so a hint never gives the answer away */
    hintBtn.hidden=!right||right.disabled||right.hinted||wrongOptions(right).length<2;
  }
  hintBtn.addEventListener("click",function(){
    var right=box.querySelector("[data-right]");if(!right)return;
    var w=wrongOptions(right);if(w.length<2)return;
    var x=w[Math.floor(Math.random()*w.length)];
    x.disabled=true;x.classList.add("hinted");x.setAttribute("aria-label",x.textContent+" (not this one)");
    right.hinted=true;updateHint();
  });
  /* the lesson redraws on clicks (in the practice box, mode or class switch); the observer catches anything else */
  document.addEventListener("click",updateHint);
  new MutationObserver(updateHint).observe(box,{childList:true,subtree:true,attributes:true,attributeFilter:["disabled"]});
  updateHint();drawTeams();
})();
