/* RC4 · Director audiovisual: cues discretos, sin interacción ni cambios de estado. */
(function(root){'use strict';
const LEVELS=['calm','unease','danger','critical'];let prior='calm',priorChapter=0,priorEncounter=false,hold=0;
function assess(game){const max=Number(game.doomLimit)||26;const doom=(Number(game.doom)||0)/max;
 const foes=(game.enemies||[]).some(e=>e.hp>0&&e.pos===game.pos);
 const boss=!!game.boss&&!game.boss.defeated;
 if(game.hp<=2||game.sanity<=1||doom>=.82||boss)return 'critical';
 if(foes||game.hp<=4||game.sanity<=3||doom>=.63)return 'danger';
 if(doom>=.33||(game.enemies||[]).length>2)return 'unease';return 'calm';}
function update(game){if(!game)return;const level=assess(game),enc=!!game.pendingChoice;
 const stage=root.document?.getElementById('horrorAtmosphere');if(stage){stage.dataset.level=level;stage.dataset.chapter=String(game.chapter||1);stage.classList.toggle('is-encounter',enc)}
 if(root.DeadCabinAudio){const audio=root.DeadCabinAudio;audio.setTension(Math.min(1,(Number(game.doom)||0)/(Number(game.doomLimit)||26)));audio.setScene(game.chapter,level);
 if(enc&&!priorEncounter&&audio.enabled)audio.cue('silence')}
 priorEncounter=enc;prior=level;priorChapter=game.chapter;}
root.DeadCabinHorrorDirector={assess,update,LEVELS};
})(globalThis);
