/* CareerFlow Pro LinkedIn content upgrade. No scraping or automatic posting. */
(()=>{
'use strict';
const $=s=>document.querySelector(s);let drafts=[];
const pick=(s,n)=>String(s||'').trim().slice(0,n);
function facts(){const idea=$('#tx').value.trim(),resume=$('#rs').value.trim();const lines=(idea+'\n'+resume).split(/\r?\n/).map(s=>s.replace(/^\s*[•*\-]\s*/,'').replace(/\s+/g,' ').trim()).filter(s=>s.length>35&&s.length<420);const hits=lines.filter(s=>/\d|delivered|improv|led |built|reduced|implement|achiev|launched|managed/i.test(s));return [...new Set(hits)].slice(0,8)}
function generateLocal(){const role=$('#rl').value.trim()||'my profession',aud=$('#au').value.trim()||'professionals in my field',idea=$('#tx').value.trim(),f=facts();if(!idea&&!$('#rs').value.trim()){alert('Add a real idea, achievement, or resume first.');return}
 const anchor=pick(f[0]||idea,300),extra=pick(f[1]||idea,220);
 drafts=[
 `A career lesson I keep coming back to:\n\n${anchor}\n\nWhat this reinforced for me is the importance of linking decisions to measurable outcomes.\n\n${extra&&extra!==anchor?extra+'\n\n':''}For others working in ${role}, what approach has delivered the most value?\n\n#CareerDevelopment #Leadership #ContinuousImprovement`,
 `One practical insight from my work:\n\n${anchor}\n\nThree questions I now ask before starting a new initiative:\n\n1. What result are we trying to achieve?\n2. How will we measure progress?\n3. Who needs to be involved from the start?\n\nWhat would you add?\n\n#ProjectManagement #ProfessionalGrowth #Leadership`,
 `Connecting with ${aud}.\n\nMy background includes ${pick(role,110)}. One result I can speak to is:\n\n${anchor}\n\nI'm interested in exchanging ideas with others solving similar challenges. What skills or approaches are making the biggest difference in your work?\n\n#Networking #CareerGrowth #ProfessionalDevelopment`
 ];showDrafts();}
function showDrafts(){const box=$('#vars');box.textContent='';drafts.forEach((t,i)=>{const d=document.createElement('div');d.className='v';const pre=document.createElement('div');pre.style.whiteSpace='pre-wrap';pre.textContent=t;const btn=document.createElement('button');btn.className='o';btn.textContent='Use version '+(i+1);btn.onclick=()=>{setPost(t);$('#post').focus()};d.append(pre,btn);box.appendChild(d)});$('#st').textContent='Choose a draft, then verify and edit every claim before publishing.'}
function install(){const root=document.createElement('section');root.className='c';root.id='linkedin-upgrade';root.innerHTML=`<h2>Post Studio — quick drafts & image campaigns</h2><p class="n">Get three editable post options without an API key. For more expressive AI writing, use the original optional Gemini button above. Posts are grounded in the facts you supply.</p><button id="local-drafts">Generate 3 posts without AI key</button><button class="o" id="copy-current">Copy selected post</button><div class="g3"><div><label for="image-layout">Visual format</label><select id="image-layout"><option value="quote">Key insight</option><option value="steps">3-point takeaway</option><option value="announcement">Professional announcement</option></select></div><div><label for="image-accent">Accent style</label><select id="image-accent"><option value="navy">Corporate blue</option><option value="teal">Modern teal</option><option value="dark">Premium dark gold</option><option value="light">Clean light</option></select></div><div><label for="image-title">Image headline</label><input id="image-title" placeholder="Your most important takeaway"></div></div><button id="make-visual">Create matching image from post</button><p class="n">Preview and download the PNG in the Image section below. This tool does not post on your behalf; LinkedIn authorisation is required for that.</p>`;
 const target=$('#post').closest('.c');target.parentNode.insertBefore(root,target);
 $('#local-drafts').onclick=generateLocal;
 $('#copy-current').onclick=()=>{const t=$('#post').value.trim();if(t)navigator.clipboard.writeText(t).catch(()=>alert('Copy manually using Ctrl+C.'));else alert('Choose or write a post first.')};
 $('#image-accent').onchange=()=>{$('#st2').value=$('#image-accent').value;img();card2()};
 $('#make-visual').onclick=()=>{const t=$('#post').value.trim();if(!t){alert('Choose a post first.');return}const lines=t.split(/\n/).map(x=>x.trim()).filter(Boolean);const style=$('#image-layout').value;let text=$('#image-title').value.trim()||lines[0];if(style==='steps'){const steps=lines.filter(x=>/^\d[.)]\s/.test(x)).slice(0,3);if(steps.length)text=steps.join('  •  ')}else if(style==='announcement'){text='CAREER UPDATE: '+text}$('#hl').value=pick(text,140);$('#sz').value='1080x1350';img();$('#cvs').scrollIntoView({behavior:'smooth'})};
 // User can still use original AI writer: graceful no-key offline fallback.
 const orig=$('#gen').onclick;$('#gen').onclick=()=>{$('#key').value.trim()?orig():generateLocal()};
 $('#gen').textContent='Create 3 post variations';
 $('#post').setAttribute('aria-label','Editable LinkedIn post');
}
document.readyState==='loading'?document.addEventListener('DOMContentLoaded',install):install();
})();
