const $ = (id) => document.getElementById(id);

const bassNames = ['Dave','Steve','Colin','Gary','Trevor','Nigel','Kev','Martin','Other Dave','Pete','Alan','Chris'];
const venues = [
  ['The Dog & Duck',45],['The Sticky Floor',70],['The Wheezing Ferret',95],
  ['The Electric Ballroom',180],['The Municipal Hall',260],['The Majestic',500]
];

let state;

const events = [
  {
    icon:'🥁', label:'DRUMMER NEWS', title:'THE DRUMMER IS LATE.',
    copy:'Soundcheck was at five. It is now 5:47. Mick says he is “literally around the corner.”',
    choices:[
      ['SOUNDCHECK WITHOUT HIM', {rep:2,chaos:3}, 'You soundchecked without a drummer. Oddly, nobody noticed.'],
      ['WAIT FOR MICK', {rep:-1,chaos:5,fans:3}, 'Mick arrived at 6:32 carrying chips. He did not apologize.']
    ]
  },
  {
    icon:'🎸', label:'BAND MEETING', title:'LOU NEEDS A NEW AMP.',
    copy:'The old amp works perfectly. This is apparently not relevant.',
    choices:[
      ['BUY THE STUPID AMP · £45', {cash:-45,rep:4,fans:8}, 'It is louder. Lou is radiant. Your bank account is not.'],
      ['ABSOLUTELY NOT', {chaos:7}, 'Lou spends rehearsal explaining why you do not understand tone.']
    ]
  },
  {
    icon:'💔', label:'THIS SEEMS BAD', title:'THE GIRLFRIEND HAS AN OPINION.',
    copy:'Lou’s new girlfriend has attended three rehearsals. She now thinks the band needs “a different direction.”',
    choices:[
      ['SMILE AND NOD', {chaos:4}, 'She has begun taking notes. This has not helped.'],
      ['BAND MEMBERS ONLY', {rep:2,chaos:8}, 'Lou says you are threatened by her creativity. Nobody rehearses.']
    ]
  },
  {
    icon:'🎤', label:'CREATIVE DIFFERENCES', title:'JANE WANTS HER NAME BIGGER.',
    copy:'On the poster. Not much bigger, she says. Just enough that people know who the important one is.',
    choices:[
      ['MAKE IT BIGGER', {fans:5,chaos:5}, 'Jane loves it. Everyone else has noticed.'],
      ['SAME SIZE. EVERYONE.', {rep:3,chaos:4}, 'Democracy survives another week. Barely.']
    ]
  },
  {
    icon:'🚐', label:'ON THE ROAD', title:'THE VAN HAS STOPPED.',
    copy:'You are 63 miles from the gig. Gary says he can fix it. Gary also said he could play bass.',
    choices:[
      ['LET GARY TRY', {cash:-8,chaos:5,rep:2}, 'Amazingly, Gary fixes it with a shoelace. This is why Gary is in the band.'],
      ['CALL A GARAGE · £35', {cash:-35,chaos:-3}, 'You arrive on time. Nobody knows how to process this.']
    ]
  },
  {
    icon:'🍺', label:'AFTER THE GIG', title:'THE HOTEL HAS CALLED.',
    copy:'They will not be welcoming the band back. The lamp is mentioned several times.',
    choices:[
      ['PAY FOR THE LAMP · £28', {cash:-28,rep:2}, 'The lamp was ugly anyway.'],
      ['DENY EVERYTHING', {chaos:8,rep:5,fans:10}, 'Local legend status: improved. Hotel options: reduced.']
    ]
  },
  {
    icon:'🥁', label:'RARE EVENT', title:'MICK IS ON TIME.',
    copy:'Everyone is uncomfortable. You check the clock twice.',
    choices:[
      ['SAY NOTHING', {chaos:-6,rep:3}, 'Rehearsal begins on time. It feels deeply unnatural.'],
      ['ASK IF HE IS OKAY', {chaos:2}, 'He had the day wrong. Order has been restored.']
    ]
  },
  {
    icon:'✍️', label:'EMERGENCY MEETING', title:'THE DRUMMER HAS WRITTEN A SONG.',
    copy:'Mick would like everyone to hear it. The band is looking at you.',
    choices:[
      ['HEAR HIM OUT', {fans:12,rep:4,chaos:6}, 'It is annoyingly good. Nobody mentions this to Mick.'],
      ['ABSOLUTELY NOT', {chaos:3}, 'Mick says fine. Mick does not mean fine.']
    ]
  },
  {
    icon:'📰', label:'PRESS', title:'YOU HAVE BEEN CALLED “PROMISING.”',
    copy:'The band has spent two hours debating whether this is an insult.',
    choices:[
      ['FRAME THE REVIEW', {rep:5,fans:10}, 'Your first press clipping! Even Lou stops complaining for eleven minutes.'],
      ['CALL THEM COWARDS', {rep:3,chaos:7,fans:5}, 'The follow-up article calls you “difficult.” Much better.']
    ]
  },
  {
    icon:'🎵', label:'BAD NEWS / GOOD NEWS', title:'THE STUPID SONG IS A HIT.',
    copy:'The song everyone hated is the only one audiences remember. They shout for it twice.',
    choices:[
      ['PLAY IT AGAIN', {fans:28,rep:6,chaos:3}, 'You hate yourselves. The crowd adores you.'],
      ['WE HAVE OTHER SONGS', {fans:-3,rep:3,chaos:8}, 'The crowd chants the stupid song through the encore.']
    ]
  },
  {
    icon:'🎸', label:'PERSONNEL', title:'THE BASS PLAYER HAS QUIT.',
    copy:'He is joining a jazz-fusion group. Nobody is entirely sure which bass player this was.',
    bassist:true,
    choices:[
      ['FIND ANOTHER ONE', {chaos:2}, 'Done. That was surprisingly easy.'],
      ['BEG HIM TO STAY', {chaos:5}, 'He changes his mind. Then quits again on Thursday. You find another one.']
    ]
  }
];

function newState(name){
  return {name:name.toUpperCase() || 'SUPERMODEL',week:1,cash:120,fans:18,rep:2,chaos:12,bass:bassNames[0],eventIndex:-1,history:[],phase:'event'};
}

function save(){ localStorage.setItem('bandManagerSave',JSON.stringify(state)); }
function clamp(){ state.cash=Math.max(0,state.cash); state.fans=Math.max(0,state.fans); state.rep=Math.max(0,state.rep); state.chaos=Math.max(0,state.chaos); }
function random(arr){ return arr[Math.floor(Math.random()*arr.length)]; }

function renderStats(){
  $('band-title').textContent=state.name; $('week').textContent=state.week; $('cash').textContent=state.cash;
  $('fans').textContent=state.fans; $('rep').textContent=state.rep; $('chaos').textContent=state.chaos;
  $('roster').innerHTML=`
    <div class="member"><strong>🎤 Jane</strong><small>VOCALS · DRAMA</small></div>
    <div class="member"><strong>🎸 Lou</strong><small>GUITAR · OPINIONS</small></div>
    <div class="member"><strong>🥁 Mick</strong><small>DRUMS · WHEREABOUTS UNKNOWN</small></div>
    <div class="member bassist"><strong>🎸 ${state.bass}</strong><small>BASS · FOR NOW</small></div>`;
}

function nextEvent(){
  if(state.fans>=1000){ showWin(); return; }
  state.week++;
  if(Math.random()<0.22 && state.week>2){ state.bass=random(bassNames.filter(n=>n!==state.bass)); }
  let idx;
  do { idx=Math.floor(Math.random()*events.length); } while(idx===state.eventIndex && events.length>1);
  state.eventIndex=idx; state.phase='event'; save(); render();
}

function showEvent(){
  const e=events[state.eventIndex<0?0:state.eventIndex];
  $('event-card').className='paper event-card';
  $('event-card').innerHTML=`<div class="event-icon">${e.icon}</div><div class="event-label">${e.label}</div><div class="event-title">${e.title}</div><p class="event-copy">${e.copy}</p><div class="choices">${e.choices.map((c,i)=>`<button class="choice" data-choice="${i}">${c[0]}</button>`).join('')}</div>`;
  document.querySelectorAll('[data-choice]').forEach(b=>b.onclick=()=>resolveChoice(Number(b.dataset.choice)));
}

function resolveChoice(i){
  const e=events[state.eventIndex<0?0:state.eventIndex], c=e.choices[i], effects=c[1];
  Object.entries(effects).forEach(([k,v])=>state[k]+=v);
  if(e.bassist) state.bass=random(bassNames.filter(n=>n!==state.bass));
  clamp();
  const changes=Object.entries(effects).map(([k,v])=>`${v>0?'+':''}${v} ${k==='cash'?'£ cash':k}`).join(' · ');
  state.phase='result'; save(); renderStats();
  $('event-card').innerHTML=`<div class="event-icon">${e.icon}</div><div class="event-label">AND THEN...</div><div class="event-title">${c[2]}</div><div class="result"><strong>${changes.toUpperCase()}</strong></div><button id="gig-btn" class="big-button continue">BOOK THE NEXT GIG →</button>`;
  $('gig-btn').onclick=playGig;
}

function playGig(){
  const venue=venues[Math.min(venues.length-1,Math.floor(state.rep/8))];
  const capacity=venue[1];
  const turnout=Math.max(8,Math.min(capacity,Math.round(state.fans*(0.22+Math.random()*.32)+state.rep*3)));
  const money=Math.max(12,Math.round(turnout*(.45+Math.random()*.35)));
  const newFans=Math.max(4,Math.round(turnout*(.12+Math.random()*.18)));
  state.cash+=money; state.fans+=newFans; state.rep+=turnout===capacity?4:2; clamp(); state.phase='gig'; save(); renderStats();
  const sold=turnout===capacity;
  $('event-card').innerHTML=`<div class="event-icon">🎟️</div><div class="event-label">TONIGHT</div><div class="event-title">${venue[0]}</div><p class="event-copy">${sold?'SOLD OUT. Somehow.':`${turnout} PEOPLE SHOWED UP.`}<br><br><strong>+£${money} · +${newFans} FANS</strong></p><button id="continue-btn" class="big-button continue">SURVIVE ANOTHER WEEK →</button>`;
  $('continue-btn').onclick=nextEvent;
}

function showWin(){
  $('event-card').className='paper event-card win';
  $('event-card').innerHTML=`<div class="event-icon">★</div><div class="event-label">GOOD LORD</div><div class="event-title">YOU'RE ACTUALLY A BAND NOW.</div><p class="event-copy">${state.name} has passed 1,000 fans without permanently breaking up.<br><br>This is frankly astonishing.</p><button id="again-btn" class="big-button">DO IT ALL AGAIN</button>`;
  $('again-btn').onclick=reset;
}

function render(){
  $('setup').classList.add('hidden'); $('game').classList.remove('hidden'); renderStats();
  if(state.fans>=1000){showWin();return;}
  if(state.eventIndex<0) state.eventIndex=0;
  showEvent();
}

function start(){ state=newState($('band-name').value.trim()); save(); render(); }
function reset(){ localStorage.removeItem('bandManagerSave'); location.reload(); }

$('start-btn').onclick=start; $('reset-btn').onclick=reset;
$('band-name').addEventListener('keydown',e=>{if(e.key==='Enter')start();});

const saved=localStorage.getItem('bandManagerSave');
if(saved){ try{state=JSON.parse(saved);render();}catch(e){localStorage.removeItem('bandManagerSave');} }
