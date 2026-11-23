/* CareerFlow Pro: transparent job-requirement coverage and evidence editor.
   This is not an employer ATS score or a prediction of hiring success. */
(()=>{
'use strict';
const $e=s=>document.querySelector(s);
const phraseBank=[
 ['programme management',/\bprogram(?:me)? management|\bprogram(?:me)? execution|\bprogram(?:me)? strategy/i,['programme management','program management','programme delivery','project management']],
 ['end-to-end delivery',/end.to.end|conceptual design through to launch|execution across/i,['end-to-end','end to end','delivery accountability','implementation programmes']],
 ['portfolio management',/portfolio|concurrent initiatives|multiple programmes/i,['portfolio','concurrent programmes','concurrent projects']],
 ['automation strategy',/automation strategy|automation design|automation initiatives/i,['automation strategy','automation','conveyor automation','process automation']],
 ['fulfilment infrastructure',/fulfill?ment infrastructure|micro.fulfill?ment|fulfill?ment network/i,['fulfilment','fulfillment','warehouse','logistics infrastructure']],
 ['building design',/building design|facility design|infrastructure design|conceptual design/i,['building design','warehouse redesign','construction','warehouse expansion']],
 ['business cases',/business cases?|investment proposals?/i,['business case','feasibility studies','investment analysis']],
 ['ROI modelling',/roi|return on investment/i,['roi','return on investment']],
 ['total cost of ownership',/total cost of ownership|\btco\b/i,['total cost of ownership','tco']],
 ['financial analysis',/financial guardrails|financial analys|capital and operational investments|investment analysis/i,['financial analysis','budget control','financial reporting','capital funding']],
 ['cost optimisation',/cost.optim|cost reduc|cost.efficien|trade.off/i,['cost optimisation','cost optimization','cost reduction','cost savings']],
 ['standardisation',/standardiz|standardis|repeatable frameworks|templates and mechanisms/i,['standardisation','standardization','sop','governance framework']],
 ['scalability',/scalab|rapid scaling|scale new ideas/i,['scalability','scaling','multi-site','10+ countries']],
 ['cross-functional leadership',/cross.functional|stakeholders across/i,['cross-functional','stakeholder management','multi-functional']],
 ['senior stakeholder communication',/senior leadership|leadership has the right information|communicating results to senior/i,['senior leadership','executive','stakeholders','management reports']],
 ['risk management',/risk management|identify risks|mitigation strategies/i,['risk management','risk mitigation']],
 ['escalation management',/escalation path|critical escalations?/i,['escalation','escalation management']],
 ['continuous improvement',/continuous improvement|process improvements?|improve consistency|drive improvements/i,['continuous improvement','process improvement','lean six sigma','efficiency improvement']],
 ['data-driven decisions',/data and metrics|data.driven|measure and scale|track progress/i,['data','metrics','kpi','power bi','data-backed']],
 ['innovation',/innovation|novel approaches|first.principles|challenge the status quo/i,['innovation','digital transformation','redesigned']],
 ['engineering partnership',/engineering teams?|partner with engineering/i,['engineering','construction','IT project']],
 ['milestone tracking',/milestones|success criteria|track progress/i,['milestone','project planning','MS Project']],
 ['stakeholder alignment',/stakeholder|align stakeholders|competing priorities/i,['stakeholder','governance','cross-functional']],
 ['budget management',/within budget|budget control|financial guardrails|operational investments/i,['budget','P&L','financial performance']],
 ['process improvement',/process improvements?|best practices|reduce cycle time/i,['process improvement','process redesign','efficiency improvement']],
 ['change management',/change management|change initiatives/i,['change management','transformation']],
 ['agile delivery',/\bagile\b|\bscrum\b/i,['agile','scrum','PRINCE2']],
 ['vendor management',/supplier|vendor|procurement/i,['vendor','procurement','sourcing']],
 ['SAP ERP',/\bSAP\b|\bERP\b/i,['SAP','ERP']],
 ['Power BI',/power bi|dashboard/i,['power bi','dashboard']],
 ['SQL',/\bSQL\b/i,['SQL']],
 ['PMP certification',/\bPMP\b/i,['PMP']],
 ['PRINCE2',/prince2/i,['PRINCE2']],
 ['customer experience',/customer experience|customer satisfaction/i,['customer experience','customer satisfaction']],
 ['operations management',/operations management|operations teams?|operational excellence/i,['operations management','operations','supply chain']]
];
const SKIP=/^(amazon|eu|uk|id|stl|same day|apply|save|click|posted|promoted|diversity|privacy|benefits|legal|equal opportunities|full.time|job id)$/i;
let reqs=[], baseline=0, lastSource='';
const norm=s=>String(s||'').toLowerCase().replace(/programme/g,'program').replace(/fulfilment/g,'fulfillment').replace(/standardisation/g,'standardization').replace(/[–—-]/g,' ').replace(/[^a-z0-9+# ]+/g,' ').replace(/\s+/g,' ').trim();
const contains=(text,phrase)=>(' '+norm(text)+' ').includes(' '+norm(phrase)+' ');
function pickEvidence(cv,aliases){const pieces=cv.split(/\n|(?<=\.)\s+(?=[A-Z])/).map(s=>s.trim()).filter(s=>s.length>32&&s.length<520);return pieces.map(s=>({s,score:aliases.reduce((n,a)=>n+(contains(s,a)?Math.min(norm(a).length,22):0),0)+(/\d/.test(s)?2:0)})).sort((a,b)=>b.score-a.score)[0]||null}
function coreJD(jd){const t=jd.replace(/\r/g,'');const start=t.search(/(?:about the job\s*\n\s*description|key job responsibilities|job responsibilities|role responsibilities)/i);const relevant=start>=0?t.slice(start):t;const end=relevant.search(/(?:amazon is an equal|equal opportunities employer|privacy notice|company\s*[-–]\s*amazon|job id\s*:)/i);return end>=0?relevant.slice(0,end):relevant}
function extract(jd,cv){const body=coreJD(jd);const out=[];phraseBank.forEach(([title,rg,aliases])=>{if(rg.test(body)){const e=pickEvidence(cv,aliases),direct=e&&e.score>=Math.min(9,norm(aliases[0]).length);out.push({title,aliases,weight:/^(ROI|total cost|business cases|automation strategy|fulfilment infrastructure)/i.test(title)?4:3,evidence:direct?e.s:'',confirmed:!!direct,manual:false})}});
 // Add individual requested technical skills without treating company names and page chrome as skills.
 (typeof SK!=='undefined'?SK:[]).filter(x=>x.length>=4&&x.length<=35&&!SKIP.test(x)&&contains(body,x)&&!out.some(q=>norm(q.title)===norm(x))).slice(0,16).forEach(title=>{const e=pickEvidence(cv,[title]);const ok=!!e&&contains(e.s,title);out.push({title,aliases:[title],weight:2,evidence:ok?e.s:'',confirmed:ok,manual:false})});
 return out.sort((a,b)=>b.weight-a.weight||a.title.localeCompare(b.title));}
function scoring(){const total=reqs.reduce((s,r)=>s+r.weight,0)||1;const have=reqs.reduce((s,r)=>s+((r.confirmed&&r.evidence.trim().length>=12)?r.weight:0),0);return Math.round(have/total*100)}
function scoreAfter(){const text=$e('#out').value;const total=reqs.reduce((s,r)=>s+r.weight,0)||1;const covered=reqs.reduce((s,r)=>s+((r.confirmed&&r.evidence.trim().length>=12&&r.aliases.some(a=>contains(text,a)))?r.weight:0),0);return Math.round(covered/total*100)}
function el(tag,cls,txt){const x=document.createElement(tag);if(cls)x.className=cls;if(txt!==undefined)x.textContent=txt;return x}
function init(){const wrapper=el('section','ats-pro c');wrapper.id='ats-pro';wrapper.innerHTML=`<h2>Job requirement & proof editor</h2><p class="n">Review all relevant requirements below. Add or correct a factual example for each skill you have. Changes update the coverage score. A keyword with no supporting proof is never automatically claimed.</p><div class="ats-summary"><strong id="ats-score">0%</strong><div><b>Evidence-backed job requirement coverage</b><div id="ats-explanation" class="n"></div><div class="ats-meter"><span id="ats-fill"></span></div></div></div><div class="ats-toolbar"><button id="ats-select" class="o">Select supported skills only</button><button id="ats-add" class="o">+ Add requirement</button><button id="ats-rebuild">Rewrite using confirmed proof</button></div><div id="ats-list"></div><p class="n">This is an explainable match heuristic, not a score produced by an employer's ATS. 90–100% is possible only when you have defensible evidence for the role's requirements.</p>`;
 $e('#r2').appendChild(wrapper);
 $e('#ats-add').onclick=()=>{const value=prompt('Add a job requirement or specific skill:');if(value&&value.trim()&&!reqs.some(r=>norm(r.title)===norm(value))){reqs.push({title:value.trim(),aliases:[value.trim()],weight:2,evidence:'',confirmed:false,manual:true});render()}};
 $e('#ats-select').onclick=()=>{reqs.forEach(r=>r.confirmed=!!r.evidence.trim());render()};
 $e('#ats-rebuild').onclick=rebuild;
 $e('#an').onclick=analyse;
 $e('#rw').onclick=rebuild;
 $e('#rw2').onclick=rebuild;
 $e('#ta').onclick=()=>{reqs.forEach(r=>{if(r.evidence.trim())r.confirmed=true});render()};
 $e('#out').addEventListener('input',updateScore);
 // The original easy editor calls draw() on every input: extend it to sync the score.
 const priorDraw=draw;draw=function(){priorDraw();updateScore()};
 $e('#ats-pro').hidden=true;
}
function render(){const panel=$e('#ats-list');panel.textContent='';reqs.forEach((r,i)=>{const item=el('div','ats-requirement');const top=el('div','ats-top');const lab=el('label','','');const chk=el('input');chk.type='checkbox';chk.checked=r.confirmed;chk.onchange=()=>{r.confirmed=chk.checked;updateScore();status(item,r)};const title=el('b','',r.title);lab.append(chk,title);top.append(lab,el('small','',r.weight===4?'High priority':'Relevant'));item.append(top);const proof=el('textarea','ats-proof');proof.rows=2;proof.value=r.evidence;proof.placeholder='Write or correct your genuine example (what you did, tools, scope and verified result)';proof.setAttribute('aria-label','Evidence for '+r.title);proof.addEventListener('input',()=>{r.evidence=proof.value;if(!r.evidence.trim())r.confirmed=false;chk.checked=r.confirmed;status(item,r);updateScore()});item.append(proof);const foot=el('div','ats-foot');const state=el('span','ats-state');foot.append(state);if(r.manual){const remove=el('button','o','Remove');remove.onclick=()=>{reqs.splice(i,1);render()};foot.append(remove)}item.append(foot);panel.append(item);status(item,r)});updateScore()}
function status(item,r){item.classList.toggle('ats-verified',r.confirmed&&r.evidence.trim().length>=12);item.querySelector('.ats-state').textContent=(r.confirmed&&r.evidence.trim().length>=12)?'Confirmed — will be used in rewrite':'Unconfirmed — not used in rewrite'}
function updateScore(){const n=scoring(),aft=$e('#out').value.trim()?scoreAfter():0;const score=$e('#ats-score');if(!score)return;score.textContent=n+'%';$e('#ats-fill').style.width=n+'%';$e('#ats-explanation').textContent=`${reqs.filter(r=>r.confirmed&&r.evidence.trim().length>=12).length}/${reqs.length} requirements supported · Resume wording coverage: ${aft}% · Target: 90%+ with verified evidence`;
 if($e('#r4')&&!$e('#r4').hidden){$e('#cov').textContent=`Evidence-backed requirements: ${n}% · Resume keyword coverage: ${aft}%. Edit the CV or the proof above, then rewrite and recheck. Neither figure is an employer ATS score.`;$e('#sc').textContent=`Evidence-backed requirement coverage: ${n}% · Resume keyword coverage: ${aft}%`}}
function analyse(){const cv=$e('#cv').value,jd=$e('#jd').value;if(cv.trim().length<50||jd.trim().length<50){alert('Paste your resume and the job description.');return}lastSource=cv;reqs=extract(jd,cv);baseline=scoring();
 if(!reqs.length){alert('Could not identify enough specific job requirements. Please check the job description.');return}
 if(!$e('#jt').value.trim())$e('#jt').value=guessTitle(cleanJd(jd));
 if(!$e('#co').value.trim())$e('#co').value=guessCompany(cleanJd(jd));
 // Keep the existing tool's keyword API usable for cover letters/interviews, but drop job-board noise.
 K=Object.fromEntries(reqs.map(r=>[norm(r.title),r.weight]));COV0=baseline;
 $e('#miss').textContent='Edit and confirm all requirements in the proof editor below. Missing skills are not added without proof.';
 $e('#have').textContent=reqs.filter(r=>r.confirmed).map(r=>r.title).join(', ')||'None yet';$e('#wds').textContent=reqs.filter(r=>!r.confirmed).map(r=>r.title).join(', ')||'None';
 $e('#r2').hidden=$e('#r3').hidden=false;$e('#ats-pro').hidden=false;render();rebuild();}
function safeSentence(s){return String(s||'').replace(/\s+/g,' ').replace(/\s*\|\s*/g,' | ').trim().replace(/^[•\-*]\s*/,'').replace(/[.!]$/,'').slice(0,470)}
function matched(r,txt){return r.aliases.some(a=>contains(txt,a))}
function normalizeCV(cv){return toMd(cv).replace(/\n{3,}/g,'\n\n').trim()}
function summaryFromSource(cv){const raw=cv.replace(/\r/g,'');const m=raw.match(/(?:^|\n)\s*Professional Summary\s*\n([\s\S]*?)(?=\n\s*(?:Professional Experience|Work Experience|Education|Skills)\s*\n)/i);return m?m[1].replace(/\s*\n\s*/g,' ').replace(/\s{2,}/g,' ').split(/(?<=[.!?])\s+(?=[A-Z])/).filter(x=>!/family|spouse|children|relocat|target roles|approximate conversions|toastmasters/i.test(x)).join(' ').trim().slice(0,570):''}
function rebuild(){if(!reqs.length){alert('Analyse a CV and job first.');return}const cv=$e('#cv').value||lastSource;let md=normalizeCV(cv);let lines=md.split('\n');const headEnd=lines.findIndex(l=>l.startsWith('## '));const head=(headEnd<0?lines:lines.slice(0,headEnd)).filter(x=>x.trim());
 const sections=[];(headEnd<0?[]:lines.slice(headEnd)).forEach(l=>{if(l.startsWith('## '))sections.push({title:l.slice(3).trim(),lines:[]});else if(sections.length)sections[sections.length-1].lines.push(l)});
 const omit=/^professional summary$|^summary$|^key skills$|^skills$|^core competencies$/i;
 const exp=sections.filter(x=>/experience|employment|career history/i.test(x.title));const rest=sections.filter(x=>!omit.test(x.title)&&!exp.includes(x));
 const enabled=reqs.filter(r=>r.confirmed&&r.evidence.trim().length>=12);
 const proof=enabled.map(r=>safeSentence(r.evidence)).filter(Boolean);
 const sourceSummary=summaryFromSource(cv);
 const bestSummary=sourceSummary?sourceSummary.slice(0,600):`Experienced professional specialising in ${enabled.slice(0,3).map(r=>r.title).join(', ')||'the advertised role'}.`;
 const jobTitle=($e('#jt').value||guessTitle($e('#jd').value)||'').trim();
 const intro=jobTitle?`Target role: ${jobTitle}. `:'';
 const chosen=enabled.map(r=>r.title);
 const skills=chosen.length?`Verified role-relevant capabilities: ${chosen.join(' • ')}`:'Add evidence and confirm your matching skills above.';
 const top=proof.filter(x=>/\d/.test(x)).slice(0,2);
 const output=[...head,'','## PROFESSIONAL SUMMARY',intro+bestSummary+(top.length?' Selected achievements: '+top.join('; ')+'.':''),'','## RELEVANT SKILLS',skills,'',...(proof.length?['## VERIFIED EXPERIENCE EVIDENCE',...proof.map(x=>'- '+x),'']:[])];
 const weight=l=>reqs.reduce((sum,r)=>sum+(matched(r,l)?r.weight:0),0);
 exp.forEach(s=>{const blocks=[];let block=null;for(const l of s.lines){if(l.startsWith('### ')){block={header:l,body:[]};blocks.push(block)}else if(block)block.body.push(l);else{block={header:'',body:[l]};blocks.push(block)}}
 output.push('## '+s.title);blocks.forEach(b=>{if(b.header)output.push(b.header);const entries=b.body.filter(Boolean);const bs=entries.filter(l=>l.startsWith('- ')).sort((a,b)=>weight(b)-weight(a));let idx=0;entries.forEach(l=>output.push(l.startsWith('- ')?bs[idx++]:l))});output.push('')});
 rest.forEach(s=>{output.push('## '+s.title,...s.lines,'')});
 const out=output.join('\n').replace(/\n{3,}/g,'\n\n').trim();
 $e('#out').value=out;$e('#r4').hidden=false;draw();edit();$e('#st').textContent=` Rewritten using ${enabled.length} supported requirements. Check every line and edit the proof as needed.`;
}
document.readyState==='loading'?document.addEventListener('DOMContentLoaded',init):init();
})();
