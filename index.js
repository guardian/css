function p(t){if(t.sheet)return t.sheet;for(var e=0;e<document.styleSheets.length;e++)if(document.styleSheets[e].ownerNode===t)return document.styleSheets[e]}function m(t){var e=document.createElement("style");return e.setAttribute("data-emotion",t.key),t.nonce!==void 0&&e.setAttribute("nonce",t.nonce),e.appendChild(document.createTextNode("")),e.setAttribute("data-s",""),e}var h=function(){function t(n){var r=this;this._insertTag=function(s){var i;r.tags.length===0?i=r.prepend?r.container.firstChild:r.before:i=r.tags[r.tags.length-1].nextSibling,r.container.insertBefore(s,i),r.tags.push(s)},this.isSpeedy=n.speedy===void 0?!0:n.speedy,this.tags=[],this.ctr=0,this.nonce=n.nonce,this.key=n.key,this.container=n.container,this.prepend=n.prepend,this.before=null}var e=t.prototype;return e.hydrate=function(r){r.forEach(this._insertTag)},e.insert=function(r){this.ctr%(this.isSpeedy?65e3:1)==0&&this._insertTag(m(this));var s=this.tags[this.tags.length-1];if(!1)var i;if(this.isSpeedy){var l=p(s);try{l.insertRule(r,l.cssRules.length)}catch(o){}}else s.appendChild(document.createTextNode(r));this.ctr++},e.flush=function(){this.tags.forEach(function(r){return r.parentNode.removeChild(r)}),this.tags=[],this.ctr=0},t}();function S(t){for(var e=0,n,r=0,s=t.length;s>=4;++r,s-=4)n=t.charCodeAt(r)&255|(t.charCodeAt(++r)&255)<<8|(t.charCodeAt(++r)&255)<<16|(t.charCodeAt(++r)&255)<<24,n=(n&65535)*1540483477+((n>>>16)*59797<<16),n^=n>>>24,e=(n&65535)*1540483477+((n>>>16)*59797<<16)^(e&65535)*1540483477+((e>>>16)*59797<<16);switch(s){case 3:e^=(t.charCodeAt(r+2)&255)<<16;case 2:e^=(t.charCodeAt(r+1)&255)<<8;case 1:e^=t.charCodeAt(r)&255,e=(e&65535)*1540483477+((e>>>16)*59797<<16)}return e^=e>>>13,e=(e&65535)*1540483477+((e>>>16)*59797<<16),((e^e>>>15)>>>0).toString(36)}var u=S;var x=!1,y=t=>{for(let e=0;e<t.length;e=e+1)switch(t[e]){case"{":return[null,t];case";":return[t.slice(0,e+1).trim(),t.slice(e+1)]}return[t,""]},b=t=>{let e=0,n=0;for(let r=0;r<t.length;r=r+1)switch(t[r]){case";":if(e===0)return[null,null,t];break;case"{":e=e+1,n||(n=r);break;case"}":if(e=e-1,e===0){let s=t.slice(0,n),i=t.slice(n+1,r),l=t.slice(r+1);return[s,i,l]}break}return[null,null,t]},C=t=>t===":"||t==="@",f=(t,e)=>{let n=[{selector:e,body:[]}],r=t,s=n[0];for(;r.length;){var[i,l,o]=b(r);if(c("nested",i,",",l,",",o),i&&l){let g=C(i[0])?`${e}${i}`:`${e} ${i}`;n=n.concat(f(l,g)),r=o;continue}var[a,o]=y(r);if(c("declaration",a,",",o),a){r=o,s.body.push(a);continue}c(r);break}return n},d=t=>`${t.selector}{${t.body.join("")}}`,c=(...t)=>{x&&console.log(...t)},I=()=>{let t=[];return{add:e=>{t.push(e)},flush:()=>{t=[]},serialise:()=>t.map(d).join("")}},T=(t,e,n)=>{let r=new h({key:e,container:t,speedy:n});return{add:s=>{r.insert(d(s))},flush:()=>{r.flush()},serialise:()=>r.container.innerHTML}},k=t=>(n,...r)=>{let s="";n.forEach((o,a)=>{s+=o.trim(),s+=r[a]||""});let i="."+u(s);return f(s,i).forEach(o=>t.add(o)),i};export{T as SheetCache,I as StaticCache,k as cssGen,x as debug,f as parse,d as serialise};
