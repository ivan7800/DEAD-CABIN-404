/* DEAD CABIN 404 · Banda sonora procedural original v1.7.
   Viento filtrado, drones, crujidos, latidos, percusión y señales espectrales.
   Siempre opt-in: sin descarga externa, sin autoplay y con reducido consumo. */
(function(root){'use strict';
let ctx=null,master=null,atmos=null,noise=null,lowpass=null,enabled=false,tension=0,timer=null;
const nodes=[];
function makeContext(){
 const AC=root.AudioContext||root.webkitAudioContext;if(!AC)return false;
 if(ctx)return true;
 ctx=new AC();master=ctx.createGain();master.gain.value=.19;master.connect(ctx.destination);
 atmos=ctx.createGain();atmos.gain.value=.36;atmos.connect(master);
 const rumble=ctx.createOscillator(),rumbleGain=ctx.createGain();rumble.type='sine';rumble.frequency.value=43;rumbleGain.gain.value=.13;rumble.connect(rumbleGain).connect(atmos);rumble.start();nodes.push(rumble);
 const overtone=ctx.createOscillator(),overGain=ctx.createGain();overtone.type='triangle';overtone.frequency.value=57.3;overGain.gain.value=.037;overtone.connect(overGain).connect(atmos);overtone.start();nodes.push(overtone);
 const buffer=ctx.createBuffer(1,Math.floor(ctx.sampleRate*2),ctx.sampleRate),arr=buffer.getChannelData(0);for(let i=0;i<arr.length;i++)arr[i]=(Math.random()*2-1)*.75;
 noise=ctx.createBufferSource();noise.buffer=buffer;noise.loop=true;
 lowpass=ctx.createBiquadFilter();lowpass.type='bandpass';lowpass.frequency.value=190;lowpass.Q.value=.32;
 const windGain=ctx.createGain();windGain.gain.value=.075;noise.connect(lowpass).connect(windGain).connect(atmos);noise.start();nodes.push(noise);
 const lfo=ctx.createOscillator(),mod=ctx.createGain();lfo.type='sine';lfo.frequency.value=.067;mod.gain.value=.025;lfo.connect(mod).connect(windGain.gain);lfo.start();nodes.push(lfo);
 return true;
}
function tone(freq,duration=.18,kind='sine',volume=.2,bend=.65,delay=0){
 if(!enabled||!ctx)return;try{
 const t=ctx.currentTime+delay,o=ctx.createOscillator(),g=ctx.createGain();o.type=kind;
 o.frequency.setValueAtTime(Math.max(22,freq),t);o.frequency.exponentialRampToValueAtTime(Math.max(22,freq*bend),t+duration);
 g.gain.setValueAtTime(.001,t);g.gain.exponentialRampToValueAtTime(Math.max(.002,volume),t+.013);
 g.gain.exponentialRampToValueAtTime(.001,t+duration);
 o.connect(g).connect(master);o.start(t);o.stop(t+duration+.02);o.onended=()=>{o.disconnect();g.disconnect()};
 }catch{}}
function noiseHit(duration=.15,volume=.17,center=600,delay=0){
 if(!enabled||!ctx)return;try{
 const t=ctx.currentTime+delay,b=ctx.createBuffer(1,Math.max(64,Math.floor(ctx.sampleRate*duration)),ctx.sampleRate),d=b.getChannelData(0);
 for(let i=0;i<d.length;i++)d[i]=(Math.random()*2-1)*Math.exp(-5*i/d.length);
 const s=ctx.createBufferSource(),f=ctx.createBiquadFilter(),g=ctx.createGain();f.type='lowpass';f.frequency.value=center;g.gain.value=volume;s.buffer=b;s.connect(f).connect(g).connect(master);s.start(t);s.onended=()=>{s.disconnect();f.disconnect();g.disconnect()};
 }catch{}}
function effect(name){if(!enabled)return;
 switch(name){
 case 'move':tone(70,.075,'triangle',.09,.7);noiseHit(.09,.055,240);break;
 case 'explore':tone(160,.38,'triangle',.14,.46);tone(348,.57,'sine',.04,.93,.09);break;
 case 'roll':for(let i=0;i<3;i++)tone(255+i*54,.055,'square',.065,.55,i*.055);break;
 case 'hit':noiseHit(.42,.27,880);tone(81,.34,'sawtooth',.23,.4);tone(42,.6,'sine',.13,.82,.03);break;
 case 'event':tone(110,.71,'sawtooth',.095,.56);tone(167,.83,'sine',.085,.63,.19);noiseHit(.35,.09,480);break;
 case 'seal':tone(240,.7,'triangle',.17,1.6);tone(371,.95,'sine',.11,1.32,.18);noiseHit(.38,.08,2000);break;
 case 'victory':for(let i=0;i<4;i++)tone([262,330,392,523][i],.7,'sine',.14,1,i*.2);break;
 case 'defeat':tone(93,1.8,'sawtooth',.13,.24);tone(52,2,'sine',.13,.6,.12);noiseHit(.85,.11,220);break;
 case 'loot':tone(560,.22,'sine',.115,1.32);tone(740,.35,'triangle',.08,1,.14);break;
 }}
function start(){try{if(!makeContext())return false;ctx.resume();enabled=true;clearInterval(timer);timer=setInterval(()=>{if(!enabled||document.hidden)return;const r=Math.random();if(r<.45){tone(45+Math.random()*36,.65+Math.random()*.4,'sawtooth',.015+Math.random()*.013,.45)}else if(r<.74){tone(660+Math.random()*160,.17,'sine',.013,.2);tone(90,.35,'triangle',.02,.48,.16)}else{noiseHit(.25,.03,200+Math.random()*250)}},14500);setTension(tension);return true}catch{return false}}
function stop(){enabled=false;clearInterval(timer);timer=null;if(ctx)ctx.suspend().catch(()=>{})}
function setTension(value){tension=Math.max(0,Math.min(1,Number(value)||0));if(ctx&&atmos){const t=ctx.currentTime;atmos.gain.setTargetAtTime(.26+tension*.34,t,.7);if(lowpass)lowpass.frequency.setTargetAtTime(190+tension*230,t,.9)}}
root.DeadCabinAudio={start,stop,effect,setTension,get enabled(){return enabled}};
})(globalThis);
