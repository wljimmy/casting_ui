(function(){const t=document.createElement("link").relList;if(t&&t.supports&&t.supports("modulepreload"))return;for(const s of document.querySelectorAll('link[rel="modulepreload"]'))r(s);new MutationObserver(s=>{for(const n of s)if(n.type==="childList")for(const a of n.addedNodes)a.tagName==="LINK"&&a.rel==="modulepreload"&&r(a)}).observe(document,{childList:!0,subtree:!0});function o(s){const n={};return s.integrity&&(n.integrity=s.integrity),s.referrerPolicy&&(n.referrerPolicy=s.referrerPolicy),s.crossOrigin==="use-credentials"?n.credentials="include":s.crossOrigin==="anonymous"?n.credentials="omit":n.credentials="same-origin",n}function r(s){if(s.ep)return;s.ep=!0;const n=o(s);fetch(s.href,n)}})();const core=Object.freeze(Object.defineProperty({__proto__:null},Symbol.toStringTag,{value:"Module"}));let ThemeManager$1=class extends PopupBase{constructor(){super(),this.themes=[],this.currentTheme=null,this.isAddingTheme=!1,this.isEditingTheme=!1,this.editingThemeIndex=-1}async init(){try{const o=await(await fetch("/themes.json")).json();this.themes=o.themes.map(s=>({...s,isDefault:!0})),this.loadCustomThemes();const r=localStorage.getItem("currentTheme");if(r){const s=this.themes.find(n=>n.name===r);s?this.currentTheme=s:this.currentTheme=this.themes[0]}else this.currentTheme=this.themes[0];this.applyTheme(this.currentTheme)}catch(t){debug("加载主题配置失败",null,{error:t.message})}}loadCustomThemes(){try{const t=localStorage.getItem("customThemes");if(t){const o=JSON.parse(t),r=this.themes.map(n=>n.name),s=o.filter(n=>!r.includes(n.name));this.themes=[...this.themes,...s]}}catch(t){debug("加载自定义主题失败",null,{error:t.message})}}saveCustomThemes(){try{const t=this.themes.filter(o=>!o.isDefault);localStorage.setItem("customThemes",JSON.stringify(t))}catch(t){debug("保存自定义主题失败",null,{error:t.message})}}addTheme(t){if(this.themes.some(o=>o.name===t.name))throw new Error("主题名称已存在");return t.isDefault=!1,this.themes.push(t),this.saveCustomThemes(),t}editTheme(t,o){if(t>=0&&t<this.themes.length&&!this.themes[t].isDefault){if(this.themes.some((r,s)=>s!==t&&r.name===o.name))throw new Error("主题名称已存在");return this.themes[t]={...o,isDefault:!1},this.saveCustomThemes(),!0}return!1}deleteTheme(t){var o;if(t>=0&&t<this.themes.length&&!this.themes[t].isDefault){const r=this.themes[t].name===((o=this.currentTheme)==null?void 0:o.name);if(this.themes.splice(t,1),this.saveCustomThemes(),r){const s=this.themes.find(n=>n.isDefault)||this.themes[0];this.applyTheme(s)}return!0}return!1}applyTheme(t){if(!t||!t.colors)return;this.currentTheme=t;const o=document.documentElement;for(const[r,s]of Object.entries(t.colors))o.style.setProperty(`--${r}`,s);localStorage.setItem("currentTheme",t.name)}openThemeSelector(t={}){return this.open(t)}getOverlayId(){return"theme-selector-overlay"}getInlineSelector(){return".theme-selector-inline"}getInlineClassName(){return"theme-selector-inline"}getHeaderSelector(){return".theme-selector-header"}getCloseReason(){return"Theme selector closed"}getToggleReason(){return"Theme selector toggled"}createContainer(t={}){const{resolve:o,reject:r,overlay:s}=t,n=document.createElement("div");n.className="theme-selector-container",n.style.cssText=`
            width: 90vw;
            max-width: 800px;
            max-height: 80vh;
            background: var(--bg-color);
            border-radius: var(--radius-lg);
            box-shadow: var(--shadow-lg);
            overflow: hidden;
            display: flex;
            flex-direction: column;
        `;const a=document.createElement("div");a.className="theme-selector-header",a.style.cssText=`
            padding: var(--size-lg);
            border-bottom: 1px solid var(--border-color);
            display: flex;
            justify-content: space-between;
            align-items: center;
            position: sticky;
            top: 0;
            left: 0;
            right: 0;
            background: var(--bg-color);
            z-index: 10;
        `;const i=document.createElement("h3");i.textContent="主题管理",i.style.cssText=`
            margin: 0;
            color: var(--text-primary);
        `;const c=document.createElement("button");c.className="theme-selector-close",c.textContent="×",c.style.cssText=`
            background: none;
            border: none;
            font-size: 24px;
            cursor: pointer;
            color: var(--text-light);
            padding: 0;
            width: 32px;
            height: 32px;
            display: flex;
            align-items: center;
            justify-content: center;
            border-radius: var(--radius-sm);
            transition: all var(--transition-normal);
        `,c.addEventListener("mouseenter",()=>{c.style.backgroundColor="var(--gray-100)",c.style.color="var(--text-primary)"}),c.addEventListener("mouseleave",()=>{c.style.backgroundColor="transparent",c.style.color="var(--text-light)"}),c.addEventListener("click",()=>{if(s)s.classList.remove("show"),setTimeout(()=>{hideOverlay("theme-selector-overlay"),r&&r("Theme selector closed")},300);else{const m=c.closest(".theme-selector-inline");m&&(m.style.display="none",r&&r("Theme selector closed"))}}),a.appendChild(i),a.appendChild(c),n.appendChild(a);const v=document.createElement("div");if(v.className="theme-selector-content",v.style.cssText=`
            padding: var(--size-lg);
            overflow-y: auto;
            flex: 1;
        `,this.isAddingTheme||this.isEditingTheme){let ce=function(){const z=document.documentElement;S.forEach(T=>{const N=_.querySelectorAll('input[type="text"]');if(N&&N[S.indexOf(T)]){const b=N[S.indexOf(T)];z.style.setProperty(`--${T.key}`,b.value)}})};var P=ce;const m=document.createElement("div");m.className="theme-edit-section";const p=document.createElement("h4");p.textContent=this.isAddingTheme?"添加主题":"编辑主题",p.style.cssText=`
                margin: 0 0 var(--size-md) 0;
                color: var(--text-primary);
            `;const h=this.themes.find(z=>z.isDefault)||this.themes[0],x=this.isEditingTheme?this.themes[this.editingThemeIndex]:h,g=document.createElement("form");g.style.cssText=`
                display: flex;
                flex-direction: column;
                gap: var(--size-md);
            `;const y=document.createElement("div");y.style.cssText=`
                display: flex;
                flex-direction: column;
                gap: var(--size-sm);
            `;const U=document.createElement("label");U.textContent="主题名称",U.style.cssText=`
                font-weight: 600;
                color: var(--text-primary);
            `;const k=document.createElement("input");k.type="text",k.value=this.isEditingTheme?x.name:"",k.placeholder="请输入主题名称",k.style.cssText=`
                padding: var(--size-sm);
                border: 1px solid var(--border-color);
                border-radius: var(--radius-sm);
                font-size: 14px;
            `,y.appendChild(U),y.appendChild(k);const R=document.createElement("div");R.style.cssText=`
                display: flex;
                flex-direction: column;
                gap: var(--size-sm);
            `;const le=document.createElement("label");le.textContent="主题描述",le.style.cssText=`
                font-weight: 600;
                color: var(--text-primary);
            `;const L=document.createElement("textarea");L.value=this.isEditingTheme&&x.description||"",L.placeholder="请输入主题描述",L.rows=3,L.style.cssText=`
                padding: var(--size-sm);
                border: 1px solid var(--border-color);
                border-radius: var(--radius-sm);
                font-size: 14px;
                resize: vertical;
            `,R.appendChild(le),R.appendChild(L);const V=document.createElement("div");V.style.cssText=`
                display: flex;
                flex-direction: column;
                gap: var(--size-md);
            `;const X=document.createElement("h5");X.textContent="颜色配置",X.style.cssText=`
                margin: 0;
                color: var(--text-primary);
            `,V.appendChild(X);const _=document.createElement("div");_.style.cssText=`
                display: grid;
                grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
                gap: var(--size-md);
            `;const S=[{key:"primary-color",label:"主色调"},{key:"bg-color",label:"背景色"},{key:"text-primary",label:"主要文本色"},{key:"text-secondary",label:"次要文本色"},{key:"text-light",label:"辅助文本色"},{key:"text-disabled",label:"禁用文本色"},{key:"border-color",label:"边框色"},{key:"gray-100",label:"浅灰色"},{key:"gray-200",label:"中灰色"},{key:"gray-300",label:"深灰色"},{key:"success-color",label:"成功色"},{key:"warning-color",label:"警告色"},{key:"error-color",label:"错误色"},{key:"info-color",label:"信息色"}];S.forEach(z=>{const T=document.createElement("div");T.style.cssText=`
                    display: flex;
                    align-items: center;
                    gap: var(--size-sm);
                `;const N=document.createElement("label");N.textContent=z.label,N.style.cssText=`
                    width: 100px;
                    font-size: 14px;
                    color: var(--text-secondary);
                `;const b=document.createElement("div");b.className="color-picker-trigger",b.style.cssText=`
                    width: 50px;
                    height: 32px;
                    border: 1px solid var(--border-color);
                    border-radius: var(--radius-sm);
                    background-color: ${x.colors[z.key]||"#000000"};
                    cursor: pointer;
                    transition: all var(--transition-normal);
                `;const f=document.createElement("input");f.type="text",f.value=x.colors[z.key]||"#000000",f.style.cssText=`
                    flex: 1;
                    padding: var(--size-xs) var(--size-sm);
                    border: 1px solid var(--border-color);
                    border-radius: var(--radius-sm);
                    font-size: 14px;
                `,b.addEventListener("click",async()=>{try{const K=await openColorPicker({presetColors:["#165DFF","#67C23A","#E6A23C","#F56C6C","#909399","#000000","#FFFFFF","#FF0000","#00FF00","#0000FF"],format:"hex",initialColor:f.value});K&&(f.value=K,b.style.backgroundColor=K,ce())}catch{}}),f.addEventListener("input",()=>{/^#[0-9A-Fa-f]{6}$/.test(f.value)&&(b.style.backgroundColor=f.value,ce())}),T.appendChild(N),T.appendChild(b),T.appendChild(f),_.appendChild(T)}),V.appendChild(_);const F=document.createElement("div");F.style.cssText=`
                margin-top: var(--size-md);
                padding: var(--size-md);
                border: 1px solid var(--border-color);
                border-radius: var(--radius-md);
                background: var(--bg-color);
            `;const M=document.createElement("h5");M.textContent="主题预览",M.style.cssText=`
                margin: 0 0 var(--size-md) 0;
                color: var(--text-primary);
            `;const j=document.createElement("div");j.id="theme-preview",j.style.cssText=`
                display: flex;
                flex-direction: column;
                gap: var(--size-lg);
            `;const D=document.createElement("div");D.className="component-demo",D.style.cssText=`
                display: grid;
                grid-template-columns: 2fr 1fr;
                gap: var(--size-lg);
            `;const H=document.createElement("div");H.className="main-content",H.innerHTML=`
                <h1 class="magazine-title">Modern Magazine Layout</h1>
                <h2 class="magazine-subtitle">现代杂志风设计 · 配色方案预览</h2>
                <p class="magazine-paragraph">
                    这是一套为现代杂志设计的配色方案，兼顾视觉高级感与阅读舒适度。主色调采用低饱和的高级色系，中性灰层次分明，功能色克制且醒目，完美适配图文混排的杂志排版需求。
                </p>
                <p class="magazine-paragraph">
                    Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.
                </p>
            `;const E=document.createElement("div");E.className="sidebar",E.style.cssText=`
                display: flex;
                flex-direction: column;
                gap: var(--size-md);
            `;const w=document.createElement("div");w.className="btn-group",w.style.cssText=`
                padding: var(--size-md);
                border: 1px solid var(--border-color);
                border-radius: var(--radius-md);
                background: var(--bg-color);
            `;const G=document.createElement("div");G.className="btn-title",G.textContent="按钮组件",G.style.cssText=`
                font-weight: 600;
                margin-bottom: var(--size-sm);
                color: var(--text-primary);
            `;const $=document.createElement("button");$.className="btn btn-primary",$.textContent="主色调按钮",$.style.cssText=`
                display: block;
                width: 100%;
                padding: var(--size-sm);
                margin-bottom: var(--size-xs);
                border: none;
                border-radius: var(--radius-sm);
                background: var(--primary-color);
                color: white;
                cursor: pointer;
                transition: all var(--transition-normal);
            `;const B=document.createElement("button");B.className="btn btn-default",B.textContent="默认按钮",B.style.cssText=`
                display: block;
                width: 100%;
                padding: var(--size-sm);
                border: 1px solid var(--border-color);
                border-radius: var(--radius-sm);
                background: var(--bg-color);
                color: var(--text-primary);
                cursor: pointer;
                transition: all var(--transition-normal);
            `,w.appendChild(G),w.appendChild($),w.appendChild(B);const d=document.createElement("div");d.className="tag-group",d.style.cssText=`
                padding: var(--size-md);
                border: 1px solid var(--border-color);
                border-radius: var(--radius-md);
                background: var(--bg-color);
            `;const u=document.createElement("div");u.className="btn-title",u.textContent="功能色标签",u.style.cssText=`
                font-weight: 600;
                margin-bottom: var(--size-sm);
                color: var(--text-primary);
            `;const I=document.createElement("span");I.className="tag tag-success",I.textContent="成功",I.style.cssText=`
                display: inline-block;
                padding: 4px 12px;
                border-radius: 16px;
                font-size: 12px;
                margin-right: var(--size-xs);
                margin-bottom: var(--size-xs);
                background: var(--success-color);
                color: white;
            `;const W=document.createElement("span");W.className="tag tag-warning",W.textContent="警告",W.style.cssText=`
                display: inline-block;
                padding: 4px 12px;
                border-radius: 16px;
                font-size: 12px;
                margin-right: var(--size-xs);
                margin-bottom: var(--size-xs);
                background: var(--warning-color);
                color: white;
            `;const O=document.createElement("span");O.className="tag tag-error",O.textContent="错误",O.style.cssText=`
                display: inline-block;
                padding: 4px 12px;
                border-radius: 16px;
                font-size: 12px;
                margin-right: var(--size-xs);
                margin-bottom: var(--size-xs);
                background: var(--error-color);
                color: white;
            `;const A=document.createElement("span");A.className="tag tag-info",A.textContent="信息",A.style.cssText=`
                display: inline-block;
                padding: 4px 12px;
                border-radius: 16px;
                font-size: 12px;
                margin-right: var(--size-xs);
                margin-bottom: var(--size-xs);
                background: var(--info-color);
                color: white;
            `,d.appendChild(u),d.appendChild(I),d.appendChild(W),d.appendChild(O),d.appendChild(A);const C=document.createElement("div");C.className="text-group",C.style.cssText=`
                padding: var(--size-md);
                border: 1px solid var(--border-color);
                border-radius: var(--radius-md);
                background: var(--bg-color);
            `;const Q=document.createElement("div");Q.className="btn-title",Q.textContent="文本色层次",Q.style.cssText=`
                font-weight: 600;
                margin-bottom: var(--size-sm);
                color: var(--text-primary);
            `;const ee=document.createElement("div");ee.className="text-item text-primary",ee.textContent="主要文本色",ee.style.cssText=`
                margin-bottom: var(--size-xs);
                color: var(--text-primary);
            `;const te=document.createElement("div");te.className="text-item text-secondary",te.textContent="次要文本色",te.style.cssText=`
                margin-bottom: var(--size-xs);
                color: var(--text-secondary);
            `;const re=document.createElement("div");re.className="text-item text-light",re.textContent="辅助文本色",re.style.cssText=`
                margin-bottom: var(--size-xs);
                color: var(--text-light);
            `;const Y=document.createElement("div");Y.className="text-item text-disabled",Y.textContent="禁用文本色",Y.style.cssText=`
                margin-bottom: var(--size-xs);
                color: var(--text-disabled);
            `,C.appendChild(Q),C.appendChild(ee),C.appendChild(te),C.appendChild(re),C.appendChild(Y);const q=document.createElement("div");q.className="bg-group",q.style.cssText=`
                padding: var(--size-md);
                border: 1px solid var(--border-color);
                border-radius: var(--radius-md);
                background: var(--bg-color);
            `;const oe=document.createElement("div");oe.className="btn-title",oe.textContent="背景色示例",oe.style.cssText=`
                font-weight: 600;
                margin-bottom: var(--size-sm);
                color: var(--text-primary);
            `;const ae=document.createElement("div");ae.className="bg-item bg-primary",ae.textContent="主色背景",ae.style.cssText=`
                padding: var(--size-sm);
                border-radius: var(--radius-sm);
                margin-bottom: var(--size-xs);
                color: white;
                text-align: center;
                background: var(--primary-color);
            `;const se=document.createElement("div");se.className="bg-item bg-gray",se.textContent="灰色背景",se.style.cssText=`
                padding: var(--size-sm);
                border-radius: var(--radius-sm);
                margin-bottom: var(--size-xs);
                color: var(--text-primary);
                text-align: center;
                background: var(--gray-100);
            `;const ne=document.createElement("div");ne.className="bg-item bg-white",ne.textContent="白色背景",ne.style.cssText=`
                padding: var(--size-sm);
                border-radius: var(--radius-sm);
                margin-bottom: var(--size-xs);
                color: var(--text-primary);
                text-align: center;
                background: var(--bg-color);
                border: 1px solid var(--border-color);
            `,q.appendChild(oe),q.appendChild(ae),q.appendChild(se),q.appendChild(ne),E.appendChild(w),E.appendChild(d),E.appendChild(C),E.appendChild(q),D.appendChild(H),D.appendChild(E),j.appendChild(D);const de=document.createElement("style");de.textContent=`
                .main-content h1 {
                    color: var(--primary-color);
                    margin-bottom: var(--size-md);
                }

                .main-content h2 {
                    color: var(--text-primary);
                    margin-bottom: var(--size-md);
                }

                .main-content p {
                    color: var(--text-secondary);
                    margin-bottom: var(--size-md);
                    line-height: 1.6;
                }

                @media (max-width: 768px) {
                    .component-demo {
                        grid-template-columns: 1fr;
                    }
                }
            `,F.appendChild(M),F.appendChild(j),F.appendChild(de);const ie=document.createElement("div");ie.style.cssText=`
                display: flex;
                gap: var(--size-md);
                margin-top: var(--size-md);
            `;const Z=document.createElement("button");Z.type="button",Z.className="btn btn-primary",Z.textContent="保存",Z.style.cssText=`
                padding: var(--size-sm) var(--size-md);
                border: none;
                border-radius: var(--radius-sm);
                background: var(--primary-color);
                color: white;
                cursor: pointer;
                transition: all var(--transition-normal);
            `,Z.addEventListener("click",()=>{const z=k.value.trim();if(!z){alert("请输入主题名称");return}if(!this.isEditingTheme&&this.themes.some(b=>b.name===z)){alert("主题名称已存在");return}const T={};S.forEach(b=>{const f=_.querySelectorAll('input[type="text"]');if(f&&f[S.indexOf(b)]){const K=f[S.indexOf(b)];T[b.key]=K.value}});const N={name:z,description:L.value.trim(),colors:T};this.isAddingTheme?this.addTheme(N):this.isEditingTheme&&this.editTheme(this.editingThemeIndex,N),this.isAddingTheme=!1,this.isEditingTheme=!1,this.editingThemeIndex=-1,this.refreshContainer(n,t)});const J=document.createElement("button");J.type="button",J.className="btn btn-default",J.textContent="取消",J.style.cssText=`
                padding: var(--size-sm) var(--size-md);
                border: 1px solid var(--border-color);
                border-radius: var(--radius-sm);
                background: var(--bg-color);
                color: var(--text-primary);
                cursor: pointer;
                transition: all var(--transition-normal);
            `,J.addEventListener("click",()=>{this.isAddingTheme=!1,this.isEditingTheme=!1,this.editingThemeIndex=-1,this.refreshContainer(n,t)}),ie.appendChild(Z),ie.appendChild(J),g.appendChild(y),g.appendChild(R),g.appendChild(V),g.appendChild(F),g.appendChild(ie),m.appendChild(p),m.appendChild(g),v.appendChild(m)}else{const m=this.createThemeManagement(n,t);v.appendChild(m);const p=this.createThemeList(n,t);v.appendChild(p);const h=document.createElement("div");h.className="example-section";const x=document.createElement("h4");x.textContent="示例组件",x.style.cssText=`
                margin: 0 0 var(--size-md) 0;
                color: var(--text-primary);
            `;const g=document.createElement("div");g.className="example-component",g.style.cssText=`
                padding: var(--size-lg);
                border: 1px solid var(--border-color);
                border-radius: var(--radius-md);
                background: var(--bg-color);
            `,g.innerHTML=`
                <div class="component-demo">
                    <div class="main-content">
                        <h1 class="magazine-title">Modern Magazine Layout</h1>
                        <h2 class="magazine-subtitle">现代杂志风设计 · 配色方案预览</h2>
                        <p class="magazine-paragraph">
                            这是一套为现代杂志设计的配色方案，兼顾视觉高级感与阅读舒适度。主色调采用低饱和的高级色系，中性灰层次分明，功能色克制且醒目，完美适配图文混排的杂志排版需求。
                        </p>
                        <img src="https://picsum.photos/800/400?1" class="magazine-img">
                        <p class="magazine-paragraph">
                            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.
                        </p>
                        <p class="magazine-paragraph">
                            Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum. 杂志排版的核心是色彩层次与阅读节奏，这套配色方案通过主色、中性色的精准搭配，营造出既时尚又不失温度的视觉体验。
                        </p>
                    </div>

                    <div class="sidebar">
                        <div class="btn-group">
                            <div class="btn-title">按钮组件</div>
                            <button class="btn btn-primary">主色调按钮</button>
                            <button class="btn btn-default">默认按钮</button>
                        </div>
                        <div class="tag-group">
                            <div class="btn-title">功能色标签</div>
                            <span class="tag tag-success">成功</span>
                            <span class="tag tag-warning">警告</span>
                            <span class="tag tag-error">错误</span>
                            <span class="tag tag-info">信息</span>
                        </div>
                        <div class="text-group">
                            <div class="btn-title">文本色层次</div>
                            <div class="text-item text-primary">主要文本色</div>
                            <div class="text-item text-secondary">次要文本色</div>
                            <div class="text-item text-light">辅助文本色</div>
                            <div class="text-item text-disabled">禁用文本色</div>
                        </div>
                        <div class="bg-group">
                            <div class="btn-title">背景色示例</div>
                            <div class="bg-item bg-primary">主色背景</div>
                            <div class="bg-item bg-gray">灰色背景</div>
                            <div class="bg-item bg-white">白色背景</div>
                        </div>
                    </div>
                </div>
            `;const y=document.createElement("style");y.textContent=`
                .component-demo {
                    display: grid;
                    grid-template-columns: 2fr 1fr;
                    gap: var(--size-lg);
                }

                .main-content h1 {
                    color: var(--primary-color);
                    margin-bottom: var(--size-md);
                }

                .main-content h2 {
                    color: var(--text-primary);
                    margin-bottom: var(--size-md);
                }

                .main-content p {
                    color: var(--text-secondary);
                    margin-bottom: var(--size-md);
                    line-height: 1.6;
                }

                .magazine-img {
                    width: 100%;
                    border-radius: var(--radius-md);
                    margin: var(--size-md) 0;
                }

                .sidebar {
                    display: flex;
                    flex-direction: column;
                    gap: var(--size-md);
                }

                .btn-group, .tag-group, .text-group, .bg-group {
                    padding: var(--size-md);
                    border: 1px solid var(--border-color);
                    border-radius: var(--radius-md);
                    background: var(--bg-color);
                }

                .btn-title {
                    font-weight: 600;
                    margin-bottom: var(--size-sm);
                    color: var(--text-primary);
                }

                .btn {
                    display: block;
                    width: 100%;
                    padding: var(--size-sm);
                    margin-bottom: var(--size-xs);
                    border: none;
                    border-radius: var(--radius-sm);
                    cursor: pointer;
                    transition: all var(--transition-normal);
                }

                .btn-primary {
                    background: var(--primary-color);
                    color: white;
                }

                .btn-default {
                    background: var(--bg-color);
                    color: var(--text-primary);
                    border: 1px solid var(--border-color);
                }

                .tag {
                    display: inline-block;
                    padding: 4px 12px;
                    border-radius: 16px;
                    font-size: 12px;
                    margin-right: var(--size-xs);
                    margin-bottom: var(--size-xs);
                }

                .tag-success {
                    background: var(--success-color);
                    color: white;
                }

                .tag-warning {
                    background: var(--warning-color);
                    color: white;
                }

                .tag-error {
                    background: var(--error-color);
                    color: white;
                }

                .tag-info {
                    background: var(--info-color);
                    color: white;
                }

                .text-item {
                    margin-bottom: var(--size-xs);
                }

                .text-primary {
                    color: var(--text-primary);
                }

                .text-secondary {
                    color: var(--text-secondary);
                }

                .text-light {
                    color: var(--text-light);
                }

                .text-disabled {
                    color: var(--text-disabled);
                }

                .bg-item {
                    padding: var(--size-sm);
                    border-radius: var(--radius-sm);
                    margin-bottom: var(--size-xs);
                    color: white;
                    text-align: center;
                }

                .bg-primary {
                    background: var(--primary-color);
                }

                .bg-gray {
                    background: var(--gray-100);
                    color: var(--text-primary);
                }

                .bg-white {
                    background: var(--bg-color);
                    color: var(--text-primary);
                    border: 1px solid var(--border-color);
                }

                @media (max-width: 768px) {
                    .component-demo {
                        grid-template-columns: 1fr;
                    }
                }
            `,h.appendChild(x),h.appendChild(g),h.appendChild(y),v.appendChild(h)}return n.appendChild(v),n}getCurrentTheme(){return this.currentTheme}getThemes(){return this.themes}createThemeManagement(t,o){const r=document.createElement("div");r.className="theme-management",r.style.cssText=`
            margin-bottom: var(--size-xl);
        `;const s=document.createElement("h4");s.textContent="主题管理",s.style.cssText=`
            margin: 0 0 var(--size-md) 0;
            color: var(--text-primary);
        `;const n=document.createElement("div");n.className="management-buttons",n.style.cssText=`
            display: flex;
            gap: var(--size-md);
            margin-bottom: var(--size-md);
        `;const a=document.createElement("button");return a.className="btn btn-primary",a.textContent="添加主题",a.style.cssText=`
            padding: var(--size-sm) var(--size-md);
            border: none;
            border-radius: var(--radius-sm);
            background: var(--primary-color);
            color: white;
            cursor: pointer;
            transition: all var(--transition-normal);
        `,a.addEventListener("click",()=>{this.isAddingTheme=!0,this.isEditingTheme=!1,this.editingThemeIndex=-1,this.refreshContainer(t,o)}),n.appendChild(a),r.appendChild(s),r.appendChild(n),r}createThemeList(t,o){const r=document.createElement("div");r.className="theme-list-section",r.style.cssText=`
            margin-bottom: var(--size-xl);
        `;const s=document.createElement("h4");s.textContent="主题列表",s.style.cssText=`
            margin: 0 0 var(--size-md) 0;
            color: var(--text-primary);
        `;const n=document.createElement("div");if(n.className="theme-list",n.style.cssText=`
            display: grid;
            grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
            gap: var(--size-md);
        `,this.themes&&this.themes.length>0)this.themes.forEach(a=>{var m;const i=document.createElement("div");i.className="theme-card",i.style.cssText=`
                    padding: var(--size-md);
                    border: 2px solid ${a.name===((m=this.currentTheme)==null?void 0:m.name)?"var(--primary-color)":"var(--border-color)"};
                    border-radius: var(--radius-md);
                    background: var(--bg-color);
                    cursor: pointer;
                    transition: all var(--transition-normal);
                    position: relative;
                `,i.addEventListener("mouseenter",()=>{i.style.boxShadow="var(--shadow-md)"}),i.addEventListener("mouseleave",()=>{i.style.boxShadow="none"}),i.addEventListener("click",()=>{this.applyTheme(a),document.querySelectorAll(".theme-card").forEach(p=>{const h=p.querySelector(".theme-card-name").textContent;p.style.borderColor=h===a.name?"var(--primary-color)":"var(--border-color)"})});const c=document.createElement("div");if(c.className="theme-card-name",c.textContent=a.name,c.style.cssText=`
                    font-weight: 600;
                    margin-bottom: var(--size-sm);
                    color: var(--text-primary);
                `,a.description){const p=document.createElement("div");p.className="theme-card-description",p.textContent=a.description,p.style.cssText=`
                        font-size: 12px;
                        color: var(--text-secondary);
                        margin-bottom: var(--size-sm);
                        line-height: 1.4;
                    `,i.appendChild(p)}if(a.isDefault){const p=document.createElement("div");p.textContent="预设",p.style.cssText=`
                        position: absolute;
                        bottom: var(--size-xs);
                        right: var(--size-xs);
                        padding: 2px 8px;
                        background: var(--primary-color);
                        color: white;
                        font-size: 10px;
                        border-radius: var(--radius-sm);
                    `,i.appendChild(p)}const v=document.createElement("div");if(v.className="color-preview",v.style.cssText=`
                    display: grid;
                    grid-template-columns: repeat(4, 1fr);
                    gap: var(--size-xs);
                    margin-bottom: var(--size-sm);
                `,[a.colors["primary-color"],a.colors["bg-color"],a.colors["gray-100"],a.colors["text-primary"]].forEach(p=>{const h=document.createElement("div");h.className="color-box",h.style.cssText=`
                        width: 100%;
                        aspect-ratio: 1;
                        border-radius: var(--radius-sm);
                        background-color: ${p};
                        border: 1px solid var(--border-color);
                    `,v.appendChild(h)}),!a.isDefault){const p=document.createElement("div");p.className="theme-card-actions",p.style.cssText=`
                        display: flex;
                        gap: var(--size-xs);
                        margin-top: var(--size-sm);
                    `;const h=document.createElement("button");h.className="btn btn-sm btn-default",h.textContent="编辑",h.style.cssText=`
                        padding: 4px 8px;
                        border: 1px solid var(--border-color);
                        border-radius: var(--radius-sm);
                        background: var(--bg-color);
                        color: var(--text-primary);
                        cursor: pointer;
                        font-size: 12px;
                        flex: 1;
                    `,h.addEventListener("click",g=>{g.stopPropagation(),this.isEditingTheme=!0,this.isAddingTheme=!1,this.editingThemeIndex=this.themes.indexOf(a),this.refreshContainer(t,o)});const x=document.createElement("button");x.className="btn btn-sm btn-error",x.textContent="删除",x.style.cssText=`
                        padding: 4px 8px;
                        border: 1px solid var(--error-color);
                        border-radius: var(--radius-sm);
                        background: var(--bg-color);
                        color: var(--error-color);
                        cursor: pointer;
                        font-size: 12px;
                        flex: 1;
                    `,x.addEventListener("click",g=>{if(g.stopPropagation(),confirm("确定要删除这个主题吗？")){const y=this.themes.indexOf(a);this.deleteTheme(y),this.refreshContainer(t,o)}}),p.appendChild(h),p.appendChild(x),i.appendChild(p)}i.appendChild(c),i.appendChild(v),n.appendChild(i)});else{const a=document.createElement("div");a.textContent="主题加载中...",a.style.cssText=`
                text-align: center;
                padding: var(--size-lg);
                color: var(--text-secondary);
            `,n.appendChild(a)}return r.appendChild(s),r.appendChild(n),r}refreshContainer(t,o){t.innerHTML="";const{resolve:r,reject:s,overlay:n}=o,a=document.createElement("div");a.className="theme-selector-header",a.style.cssText=`
            padding: var(--size-lg);
            border-bottom: 1px solid var(--border-color);
            display: flex;
            justify-content: space-between;
            align-items: center;
            position: sticky;
            top: 0;
            left: 0;
            right: 0;
            background: var(--bg-color);
            z-index: 10;
        `;const i=document.createElement("h3");i.textContent="主题管理",i.style.cssText=`
            margin: 0;
            color: var(--text-primary);
        `;const c=document.createElement("button");c.className="theme-selector-close",c.textContent="×",c.style.cssText=`
            background: none;
            border: none;
            font-size: 24px;
            cursor: pointer;
            color: var(--text-light);
            padding: 0;
            width: 32px;
            height: 32px;
            display: flex;
            align-items: center;
            justify-content: center;
            border-radius: var(--radius-sm);
            transition: all var(--transition-normal);
        `,c.addEventListener("mouseenter",()=>{c.style.backgroundColor="var(--gray-100)",c.style.color="var(--text-primary)"}),c.addEventListener("mouseleave",()=>{c.style.backgroundColor="transparent",c.style.color="var(--text-light)"}),c.addEventListener("click",()=>{if(n)n.classList.remove("show"),setTimeout(()=>{hideOverlay("theme-selector-overlay"),s&&s("Theme selector closed")},300);else{const m=c.closest(".theme-selector-inline");m&&(m.style.display="none",s&&s("Theme selector closed"))}}),a.appendChild(i),a.appendChild(c),t.appendChild(a);const v=document.createElement("div");if(v.className="theme-selector-content",v.style.cssText=`
            padding: var(--size-lg);
            overflow-y: auto;
            flex: 1;
        `,this.isAddingTheme||this.isEditingTheme){let ce=function(){const z=document.documentElement;S.forEach(T=>{const N=_.querySelectorAll('input[type="text"]');if(N&&N[S.indexOf(T)]){const b=N[S.indexOf(T)];z.style.setProperty(`--${T.key}`,b.value)}})};var P=ce;const m=document.createElement("div");m.className="theme-edit-section";const p=document.createElement("h4");p.textContent=this.isAddingTheme?"添加主题":"编辑主题",p.style.cssText=`
                margin: 0 0 var(--size-md) 0;
                color: var(--text-primary);
            `;const h=this.themes.find(z=>z.isDefault)||this.themes[0],x=this.isEditingTheme?this.themes[this.editingThemeIndex]:h,g=document.createElement("form");g.style.cssText=`
                display: flex;
                flex-direction: column;
                gap: var(--size-md);
            `;const y=document.createElement("div");y.style.cssText=`
                display: flex;
                flex-direction: column;
                gap: var(--size-sm);
            `;const U=document.createElement("label");U.textContent="主题名称",U.style.cssText=`
                font-weight: 600;
                color: var(--text-primary);
            `;const k=document.createElement("input");k.type="text",k.value=this.isEditingTheme?x.name:"",k.placeholder="请输入主题名称",k.style.cssText=`
                padding: var(--size-sm);
                border: 1px solid var(--border-color);
                border-radius: var(--radius-sm);
                font-size: 14px;
            `,y.appendChild(U),y.appendChild(k);const R=document.createElement("div");R.style.cssText=`
                display: flex;
                flex-direction: column;
                gap: var(--size-sm);
            `;const le=document.createElement("label");le.textContent="主题描述",le.style.cssText=`
                font-weight: 600;
                color: var(--text-primary);
            `;const L=document.createElement("textarea");L.value=this.isEditingTheme&&x.description||"",L.placeholder="请输入主题描述",L.rows=3,L.style.cssText=`
                padding: var(--size-sm);
                border: 1px solid var(--border-color);
                border-radius: var(--radius-sm);
                font-size: 14px;
                resize: vertical;
            `,R.appendChild(le),R.appendChild(L);const V=document.createElement("div");V.style.cssText=`
                display: flex;
                flex-direction: column;
                gap: var(--size-md);
            `;const X=document.createElement("h5");X.textContent="颜色配置",X.style.cssText=`
                margin: 0;
                color: var(--text-primary);
            `,V.appendChild(X);const _=document.createElement("div");_.style.cssText=`
                display: grid;
                grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
                gap: var(--size-md);
            `;const S=[{key:"primary-color",label:"主色调"},{key:"bg-color",label:"背景色"},{key:"text-primary",label:"主要文本色"},{key:"text-secondary",label:"次要文本色"},{key:"text-light",label:"辅助文本色"},{key:"text-disabled",label:"禁用文本色"},{key:"border-color",label:"边框色"},{key:"gray-100",label:"浅灰色"},{key:"gray-200",label:"中灰色"},{key:"gray-300",label:"深灰色"},{key:"success-color",label:"成功色"},{key:"warning-color",label:"警告色"},{key:"error-color",label:"错误色"},{key:"info-color",label:"信息色"}];S.forEach(z=>{const T=document.createElement("div");T.style.cssText=`
                    display: flex;
                    align-items: center;
                    gap: var(--size-sm);
                `;const N=document.createElement("label");N.textContent=z.label,N.style.cssText=`
                    width: 100px;
                    font-size: 14px;
                    color: var(--text-secondary);
                `;const b=document.createElement("div");b.className="color-picker-trigger",b.style.cssText=`
                    width: 50px;
                    height: 32px;
                    border: 1px solid var(--border-color);
                    border-radius: var(--radius-sm);
                    background-color: ${x.colors[z.key]||"#000000"};
                    cursor: pointer;
                    transition: all var(--transition-normal);
                `;const f=document.createElement("input");f.type="text",f.value=x.colors[z.key]||"#000000",f.style.cssText=`
                    flex: 1;
                    padding: var(--size-xs) var(--size-sm);
                    border: 1px solid var(--border-color);
                    border-radius: var(--radius-sm);
                    font-size: 14px;
                `,b.addEventListener("click",async()=>{try{const K=await openColorPicker({presetColors:["#165DFF","#67C23A","#E6A23C","#F56C6C","#909399","#000000","#FFFFFF","#FF0000","#00FF00","#0000FF"],format:"hex",initialColor:f.value});K&&(f.value=K,b.style.backgroundColor=K,ce())}catch{}}),f.addEventListener("input",()=>{/^#[0-9A-Fa-f]{6}$/.test(f.value)&&(b.style.backgroundColor=f.value,ce())}),T.appendChild(N),T.appendChild(b),T.appendChild(f),_.appendChild(T)}),V.appendChild(_);const F=document.createElement("div");F.style.cssText=`
                margin-top: var(--size-md);
                padding: var(--size-md);
                border: 1px solid var(--border-color);
                border-radius: var(--radius-md);
                background: var(--bg-color);
            `;const M=document.createElement("h5");M.textContent="主题预览",M.style.cssText=`
                margin: 0 0 var(--size-md) 0;
                color: var(--text-primary);
            `;const j=document.createElement("div");j.id="theme-preview",j.style.cssText=`
                display: flex;
                flex-direction: column;
                gap: var(--size-lg);
            `;const D=document.createElement("div");D.className="component-demo",D.style.cssText=`
                display: grid;
                grid-template-columns: 2fr 1fr;
                gap: var(--size-lg);
            `;const H=document.createElement("div");H.className="main-content",H.innerHTML=`
                <h1 class="magazine-title">Modern Magazine Layout</h1>
                <h2 class="magazine-subtitle">现代杂志风设计 · 配色方案预览</h2>
                <p class="magazine-paragraph">
                    这是一套为现代杂志设计的配色方案，兼顾视觉高级感与阅读舒适度。主色调采用低饱和的高级色系，中性灰层次分明，功能色克制且醒目，完美适配图文混排的杂志排版需求。
                </p>
                <p class="magazine-paragraph">
                    Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.
                </p>
            `;const E=document.createElement("div");E.className="sidebar",E.style.cssText=`
                display: flex;
                flex-direction: column;
                gap: var(--size-md);
            `;const w=document.createElement("div");w.className="btn-group",w.style.cssText=`
                padding: var(--size-md);
                border: 1px solid var(--border-color);
                border-radius: var(--radius-md);
                background: var(--bg-color);
            `;const G=document.createElement("div");G.className="btn-title",G.textContent="按钮组件",G.style.cssText=`
                font-weight: 600;
                margin-bottom: var(--size-sm);
                color: var(--text-primary);
            `;const $=document.createElement("button");$.className="btn btn-primary",$.textContent="主色调按钮",$.style.cssText=`
                display: block;
                width: 100%;
                padding: var(--size-sm);
                margin-bottom: var(--size-xs);
                border: none;
                border-radius: var(--radius-sm);
                background: var(--primary-color);
                color: white;
                cursor: pointer;
                transition: all var(--transition-normal);
            `;const B=document.createElement("button");B.className="btn btn-default",B.textContent="默认按钮",B.style.cssText=`
                display: block;
                width: 100%;
                padding: var(--size-sm);
                border: 1px solid var(--border-color);
                border-radius: var(--radius-sm);
                background: var(--bg-color);
                color: var(--text-primary);
                cursor: pointer;
                transition: all var(--transition-normal);
            `,w.appendChild(G),w.appendChild($),w.appendChild(B);const d=document.createElement("div");d.className="tag-group",d.style.cssText=`
                padding: var(--size-md);
                border: 1px solid var(--border-color);
                border-radius: var(--radius-md);
                background: var(--bg-color);
            `;const u=document.createElement("div");u.className="btn-title",u.textContent="功能色标签",u.style.cssText=`
                font-weight: 600;
                margin-bottom: var(--size-sm);
                color: var(--text-primary);
            `;const I=document.createElement("span");I.className="tag tag-success",I.textContent="成功",I.style.cssText=`
                display: inline-block;
                padding: 4px 12px;
                border-radius: 16px;
                font-size: 12px;
                margin-right: var(--size-xs);
                margin-bottom: var(--size-xs);
                background: var(--success-color);
                color: white;
            `;const W=document.createElement("span");W.className="tag tag-warning",W.textContent="警告",W.style.cssText=`
                display: inline-block;
                padding: 4px 12px;
                border-radius: 16px;
                font-size: 12px;
                margin-right: var(--size-xs);
                margin-bottom: var(--size-xs);
                background: var(--warning-color);
                color: white;
            `;const O=document.createElement("span");O.className="tag tag-error",O.textContent="错误",O.style.cssText=`
                display: inline-block;
                padding: 4px 12px;
                border-radius: 16px;
                font-size: 12px;
                margin-right: var(--size-xs);
                margin-bottom: var(--size-xs);
                background: var(--error-color);
                color: white;
            `;const A=document.createElement("span");A.className="tag tag-info",A.textContent="信息",A.style.cssText=`
                display: inline-block;
                padding: 4px 12px;
                border-radius: 16px;
                font-size: 12px;
                margin-right: var(--size-xs);
                margin-bottom: var(--size-xs);
                background: var(--info-color);
                color: white;
            `,d.appendChild(u),d.appendChild(I),d.appendChild(W),d.appendChild(O),d.appendChild(A);const C=document.createElement("div");C.className="text-group",C.style.cssText=`
                padding: var(--size-md);
                border: 1px solid var(--border-color);
                border-radius: var(--radius-md);
                background: var(--bg-color);
            `;const Q=document.createElement("div");Q.className="btn-title",Q.textContent="文本色层次",Q.style.cssText=`
                font-weight: 600;
                margin-bottom: var(--size-sm);
                color: var(--text-primary);
            `;const ee=document.createElement("div");ee.className="text-item text-primary",ee.textContent="主要文本色",ee.style.cssText=`
                margin-bottom: var(--size-xs);
                color: var(--text-primary);
            `;const te=document.createElement("div");te.className="text-item text-secondary",te.textContent="次要文本色",te.style.cssText=`
                margin-bottom: var(--size-xs);
                color: var(--text-secondary);
            `;const re=document.createElement("div");re.className="text-item text-light",re.textContent="辅助文本色",re.style.cssText=`
                margin-bottom: var(--size-xs);
                color: var(--text-light);
            `;const Y=document.createElement("div");Y.className="text-item text-disabled",Y.textContent="禁用文本色",Y.style.cssText=`
                margin-bottom: var(--size-xs);
                color: var(--text-disabled);
            `,C.appendChild(Q),C.appendChild(ee),C.appendChild(te),C.appendChild(re),C.appendChild(Y);const q=document.createElement("div");q.className="bg-group",q.style.cssText=`
                padding: var(--size-md);
                border: 1px solid var(--border-color);
                border-radius: var(--radius-md);
                background: var(--bg-color);
            `;const oe=document.createElement("div");oe.className="btn-title",oe.textContent="背景色示例",oe.style.cssText=`
                font-weight: 600;
                margin-bottom: var(--size-sm);
                color: var(--text-primary);
            `;const ae=document.createElement("div");ae.className="bg-item bg-primary",ae.textContent="主色背景",ae.style.cssText=`
                padding: var(--size-sm);
                border-radius: var(--radius-sm);
                margin-bottom: var(--size-xs);
                color: white;
                text-align: center;
                background: var(--primary-color);
            `;const se=document.createElement("div");se.className="bg-item bg-gray",se.textContent="灰色背景",se.style.cssText=`
                padding: var(--size-sm);
                border-radius: var(--radius-sm);
                margin-bottom: var(--size-xs);
                color: var(--text-primary);
                text-align: center;
                background: var(--gray-100);
            `;const ne=document.createElement("div");ne.className="bg-item bg-white",ne.textContent="白色背景",ne.style.cssText=`
                padding: var(--size-sm);
                border-radius: var(--radius-sm);
                margin-bottom: var(--size-xs);
                color: var(--text-primary);
                text-align: center;
                background: var(--bg-color);
                border: 1px solid var(--border-color);
            `,q.appendChild(oe),q.appendChild(ae),q.appendChild(se),q.appendChild(ne),E.appendChild(w),E.appendChild(d),E.appendChild(C),E.appendChild(q),D.appendChild(H),D.appendChild(E),j.appendChild(D);const de=document.createElement("style");de.textContent=`
                .main-content h1 {
                    color: var(--primary-color);
                    margin-bottom: var(--size-md);
                }

                .main-content h2 {
                    color: var(--text-primary);
                    margin-bottom: var(--size-md);
                }

                .main-content p {
                    color: var(--text-secondary);
                    margin-bottom: var(--size-md);
                    line-height: 1.6;
                }

                @media (max-width: 768px) {
                    .component-demo {
                        grid-template-columns: 1fr;
                    }
                }
            `,F.appendChild(M),F.appendChild(j),F.appendChild(de);const ie=document.createElement("div");ie.style.cssText=`
                display: flex;
                gap: var(--size-md);
                margin-top: var(--size-md);
            `;const Z=document.createElement("button");Z.type="button",Z.className="btn btn-primary",Z.textContent="保存",Z.style.cssText=`
                padding: var(--size-sm) var(--size-md);
                border: none;
                border-radius: var(--radius-sm);
                background: var(--primary-color);
                color: white;
                cursor: pointer;
                transition: all var(--transition-normal);
            `,Z.addEventListener("click",()=>{const z=k.value.trim();if(!z){alert("请输入主题名称");return}if(!this.isEditingTheme&&this.themes.some(b=>b.name===z)){alert("主题名称已存在");return}const T={};S.forEach(b=>{const f=_.querySelectorAll('input[type="text"]');if(f&&f[S.indexOf(b)]){const K=f[S.indexOf(b)];T[b.key]=K.value}});const N={name:z,description:L.value.trim(),colors:T};this.isAddingTheme?this.addTheme(N):this.isEditingTheme&&this.editTheme(this.editingThemeIndex,N),this.isAddingTheme=!1,this.isEditingTheme=!1,this.editingThemeIndex=-1,this.refreshContainer(t,o)});const J=document.createElement("button");J.type="button",J.className="btn btn-default",J.textContent="取消",J.style.cssText=`
                padding: var(--size-sm) var(--size-md);
                border: 1px solid var(--border-color);
                border-radius: var(--radius-sm);
                background: var(--bg-color);
                color: var(--text-primary);
                cursor: pointer;
                transition: all var(--transition-normal);
            `,J.addEventListener("click",()=>{this.isAddingTheme=!1,this.isEditingTheme=!1,this.editingThemeIndex=-1,this.refreshContainer(t,o)}),ie.appendChild(Z),ie.appendChild(J),g.appendChild(y),g.appendChild(R),g.appendChild(V),g.appendChild(F),g.appendChild(ie),m.appendChild(p),m.appendChild(g),v.appendChild(m)}else{const m=this.createThemeManagement(t,o);v.appendChild(m);const p=this.createThemeList(t,o);v.appendChild(p);const h=document.createElement("div");h.className="example-section";const x=document.createElement("h4");x.textContent="示例组件",x.style.cssText=`
                margin: 0 0 var(--size-md) 0;
                color: var(--text-primary);
            `;const g=document.createElement("div");g.className="example-component",g.style.cssText=`
                padding: var(--size-lg);
                border: 1px solid var(--border-color);
                border-radius: var(--radius-md);
                background: var(--bg-color);
            `,g.innerHTML=`
                <div class="component-demo">
                    <div class="main-content">
                        <h1 class="magazine-title">Modern Magazine Layout</h1>
                        <h2 class="magazine-subtitle">现代杂志风设计 · 配色方案预览</h2>
                        <p class="magazine-paragraph">
                            这是一套为现代杂志设计的配色方案，兼顾视觉高级感与阅读舒适度。主色调采用低饱和的高级色系，中性灰层次分明，功能色克制且醒目，完美适配图文混排的杂志排版需求。
                        </p>
                        <img src="https://picsum.photos/800/400?1" class="magazine-img">
                        <p class="magazine-paragraph">
                            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.
                        </p>
                        <p class="magazine-paragraph">
                            Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum. 杂志排版的核心是色彩层次与阅读节奏，这套配色方案通过主色、中性色的精准搭配，营造出既时尚又不失温度的视觉体验。
                        </p>
                    </div>

                    <div class="sidebar">
                        <div class="btn-group">
                            <div class="btn-title">按钮组件</div>
                            <button class="btn btn-primary">主色调按钮</button>
                            <button class="btn btn-default">默认按钮</button>
                        </div>
                        <div class="tag-group">
                            <div class="btn-title">功能色标签</div>
                            <span class="tag tag-success">成功</span>
                            <span class="tag tag-warning">警告</span>
                            <span class="tag tag-error">错误</span>
                            <span class="tag tag-info">信息</span>
                        </div>
                        <div class="text-group">
                            <div class="btn-title">文本色层次</div>
                            <div class="text-item text-primary">主要文本色</div>
                            <div class="text-item text-secondary">次要文本色</div>
                            <div class="text-item text-light">辅助文本色</div>
                            <div class="text-item text-disabled">禁用文本色</div>
                        </div>
                        <div class="bg-group">
                            <div class="btn-title">背景色示例</div>
                            <div class="bg-item bg-primary">主色背景</div>
                            <div class="bg-item bg-gray">灰色背景</div>
                            <div class="bg-item bg-white">白色背景</div>
                        </div>
                    </div>
                </div>
            `;const y=document.createElement("style");y.textContent=`
                .component-demo {
                    display: grid;
                    grid-template-columns: 2fr 1fr;
                    gap: var(--size-lg);
                }

                .main-content h1 {
                    color: var(--primary-color);
                    margin-bottom: var(--size-md);
                }

                .main-content h2 {
                    color: var(--text-primary);
                    margin-bottom: var(--size-md);
                }

                .main-content p {
                    color: var(--text-secondary);
                    margin-bottom: var(--size-md);
                    line-height: 1.6;
                }

                .magazine-img {
                    width: 100%;
                    border-radius: var(--radius-md);
                    margin: var(--size-md) 0;
                }

                .sidebar {
                    display: flex;
                    flex-direction: column;
                    gap: var(--size-md);
                }

                .btn-group, .tag-group, .text-group, .bg-group {
                    padding: var(--size-md);
                    border: 1px solid var(--border-color);
                    border-radius: var(--radius-md);
                    background: var(--bg-color);
                }

                .btn-title {
                    font-weight: 600;
                    margin-bottom: var(--size-sm);
                    color: var(--text-primary);
                }

                .btn {
                    display: block;
                    width: 100%;
                    padding: var(--size-sm);
                    margin-bottom: var(--size-xs);
                    border: none;
                    border-radius: var(--radius-sm);
                    cursor: pointer;
                    transition: all var(--transition-normal);
                }

                .btn-primary {
                    background: var(--primary-color);
                    color: white;
                }

                .btn-default {
                    background: var(--bg-color);
                    color: var(--text-primary);
                    border: 1px solid var(--border-color);
                }

                .tag {
                    display: inline-block;
                    padding: 4px 12px;
                    border-radius: 16px;
                    font-size: 12px;
                    margin-right: var(--size-xs);
                    margin-bottom: var(--size-xs);
                }

                .tag-success {
                    background: var(--success-color);
                    color: white;
                }

                .tag-warning {
                    background: var(--warning-color);
                    color: white;
                }

                .tag-error {
                    background: var(--error-color);
                    color: white;
                }

                .tag-info {
                    background: var(--info-color);
                    color: white;
                }

                .text-item {
                    margin-bottom: var(--size-xs);
                }

                .text-primary {
                    color: var(--text-primary);
                }

                .text-secondary {
                    color: var(--text-secondary);
                }

                .text-light {
                    color: var(--text-light);
                }

                .text-disabled {
                    color: var(--text-disabled);
                }

                .bg-item {
                    padding: var(--size-sm);
                    border-radius: var(--radius-sm);
                    margin-bottom: var(--size-xs);
                    color: white;
                    text-align: center;
                }

                .bg-primary {
                    background: var(--primary-color);
                }

                .bg-gray {
                    background: var(--gray-100);
                    color: var(--text-primary);
                }

                .bg-white {
                    background: var(--bg-color);
                    color: var(--text-primary);
                    border: 1px solid var(--border-color);
                }

                @media (max-width: 768px) {
                    .component-demo {
                        grid-template-columns: 1fr;
                    }
                }
            `,h.appendChild(x),h.appendChild(g),h.appendChild(y),v.appendChild(h)}t.appendChild(v)}};const themeManager=Object.freeze(Object.defineProperty({__proto__:null},Symbol.toStringTag,{value:"Module"})),modal=Object.freeze(Object.defineProperty({__proto__:null},Symbol.toStringTag,{value:"Module"})),message=Object.freeze(Object.defineProperty({__proto__:null},Symbol.toStringTag,{value:"Module"})),imageZoom=Object.freeze(Object.defineProperty({__proto__:null},Symbol.toStringTag,{value:"Module"}));let ColorPicker$1=class extends PopupBase{constructor(){super()}init(){}open(t={}){const o=t.presetColors||["#165DFF","#67C23A","#E6A23C","#F56C6C","#909399","#000000","#FFFFFF","#FF0000","#00FF00","#0000FF","#FFFF00","#FF00FF","#00FFFF","#808080","#800000"],r=t.format||"hex";return super.open({...t,presetColors:o,format:r})}getOverlayId(){return"color-picker-overlay"}getInlineSelector(){return".color-picker-inline"}getInlineClassName(){return"color-picker-inline"}getHeaderSelector(){return".color-picker-header"}getCloseReason(){return"Color picker closed"}getToggleReason(){return"Color picker toggled"}createContainer(t={}){const{presetColors:o,format:r,resolve:s,reject:n,overlay:a}=t,i=document.createElement("div");i.className="color-picker-container",i.style.cssText=`
            width: 90vw;
            max-width: 500px;
            max-height: 70vh;
            background: var(--bg-color);
            border-radius: var(--radius-lg);
            box-shadow: var(--shadow-lg);
            overflow: hidden;
            display: flex;
            flex-direction: column;
        `;const c=document.createElement("div");c.className="color-picker-header",c.style.cssText=`
            padding: var(--size-lg);
            border-bottom: 1px solid var(--border-color);
            display: flex;
            justify-content: space-between;
            align-items: center;
            position: sticky;
            top: 0;
            left: 0;
            right: 0;
            background: var(--bg-color);
            z-index: 10;
        `;const v=document.createElement("h3");v.textContent="颜色选择器",v.style.cssText=`
            margin: 0;
            color: var(--text-primary);
        `;const P=document.createElement("button");P.className="color-picker-close",P.textContent="×",P.style.cssText=`
            background: none;
            border: none;
            font-size: 24px;
            cursor: pointer;
            color: var(--text-light);
            padding: 0;
            width: 32px;
            height: 32px;
            display: flex;
            align-items: center;
            justify-content: center;
            border-radius: var(--radius-sm);
            transition: all var(--transition-normal);
        `,P.addEventListener("mouseenter",()=>{P.style.backgroundColor="var(--gray-100)",P.style.color="var(--text-primary)"}),P.addEventListener("mouseleave",()=>{P.style.backgroundColor="transparent",P.style.color="var(--text-light)"}),P.addEventListener("click",()=>{if(a)a.classList.remove("show"),setTimeout(()=>{hideOverlay("color-picker-overlay"),n("Color picker closed")},300);else{const d=P.closest(".color-picker-inline");d&&(d.style.display="none",n("Color picker closed"))}}),c.appendChild(v),c.appendChild(P),i.appendChild(c);const m=document.createElement("div");m.className="color-picker-content",m.style.cssText=`
            padding: var(--size-lg);
            overflow-y: auto;
            flex: 1;
        `;const p=document.createElement("div");p.className="color-preview-section",p.style.cssText=`
            margin-bottom: var(--size-lg);
        `;const h=document.createElement("h4");h.textContent="颜色预览",h.style.cssText=`
            margin: 0 0 var(--size-sm) 0;
            color: var(--text-primary);
            font-size: 14px;
        `;const x=document.createElement("div");x.className="preview-container",x.style.cssText=`
            display: flex;
            align-items: center;
            gap: var(--size-sm);
        `;const g=t.initialColor||"#165DFF",y=document.createElement("div");y.className="color-display",y.style.cssText=`
            width: 60px;
            height: 60px;
            border-radius: var(--radius-md);
            border: 1px solid var(--border-color);
            background-color: ${g};
        `;const U=document.createElement("div");U.className="color-info",U.style.cssText=`
            flex: 1;
        `;const k=document.createElement("div");k.className="color-value",k.style.cssText=`
            font-family: monospace;
            padding: var(--size-xs);
            background: var(--gray-100);
            border-radius: var(--radius-sm);
            margin-bottom: var(--size-xs);
            font-size: 12px;
        `,k.textContent=g;const R=document.createElement("div");R.className="format-selector",R.style.cssText=`
            display: flex;
            gap: var(--size-xs);
        `,["hex","rgb","rgba"].forEach(d=>{const u=document.createElement("button");u.className=`format-option ${d===r?"active":""}`,u.textContent=d.toUpperCase(),u.style.cssText=`
                padding: 2px 8px;
                border: 1px solid var(--border-color);
                border-radius: var(--radius-sm);
                background: ${d===r?"var(--primary-color)":"var(--bg-color)"};
                color: ${d===r?"white":"var(--text-primary)"};
                cursor: pointer;
                font-size: 10px;
            `,u.addEventListener("click",()=>{document.querySelectorAll(".format-option").forEach(A=>{A.style.background="var(--bg-color)",A.style.color="var(--text-primary)"}),u.style.background="var(--primary-color)",u.style.color="white";const I=y.style.backgroundColor,W=d,O=this.formatColor(I,W);k.textContent=O}),R.appendChild(u)}),U.appendChild(k),U.appendChild(R),x.appendChild(y),x.appendChild(U),p.appendChild(h),p.appendChild(x);const L=document.createElement("div");L.className="preset-colors-section",L.style.cssText=`
            margin-bottom: var(--size-lg);
        `;const V=document.createElement("h4");V.textContent="预设颜色",V.style.cssText=`
            margin: 0 0 var(--size-sm) 0;
            color: var(--text-primary);
            font-size: 14px;
        `;const X=document.createElement("div");X.className="preset-grid",X.style.cssText=`
            display: grid;
            grid-template-columns: repeat(auto-fill, minmax(30px, 1fr));
            gap: var(--size-xs);
        `,o.forEach(d=>{const u=document.createElement("div");u.className="color-box",u.style.cssText=`
                width: 100%;
                aspect-ratio: 1;
                border-radius: var(--radius-sm);
                background-color: ${d};
                border: 1px solid transparent;
                cursor: pointer;
                transition: all var(--transition-normal);
            `,u.addEventListener("mouseenter",()=>{u.style.transform="scale(1.1)",u.style.boxShadow="var(--shadow-md)"}),u.addEventListener("mouseleave",()=>{u.style.transform="scale(1)",u.style.boxShadow="none"}),u.addEventListener("click",()=>{y.style.backgroundColor=d;const I=this.formatColor(d,r);k.textContent=I}),X.appendChild(u)}),L.appendChild(V),L.appendChild(X);const _=document.createElement("div");_.className="color-wheel-section",_.style.cssText=`
            margin-bottom: var(--size-xl);
        `;const S=document.createElement("h4");S.textContent="标准色盘",S.style.cssText=`
            margin: 0 0 var(--size-md) 0;
            color: var(--text-primary);
        `;const F=document.createElement("div");F.className="color-wheel",F.style.cssText=`
            width: 100%;
            height: 200px;
            border-radius: var(--radius-md);
            background: linear-gradient(to right, red, yellow, lime, aqua, blue, magenta, red);
            position: relative;
            cursor: crosshair;
            margin-bottom: var(--size-md);
        `;const M=document.createElement("input");M.type="range",M.min="0",M.max="100",M.value="100",M.className="brightness-slider",M.style.cssText=`
            width: 100%;
            height: 6px;
            border-radius: var(--radius-full);
            background: linear-gradient(to right, black, white);
            outline: none;
            -webkit-appearance: none;
        `,M.addEventListener("input",()=>{const d=M.value;F.style.filter=`brightness(${d}%)`}),F.addEventListener("click",d=>{const u=F.getBoundingClientRect(),I=d.clientX-u.left,W=d.clientY-u.top,O=document.createElement("canvas");O.width=u.width,O.height=u.height;const A=O.getContext("2d"),C=A.createLinearGradient(0,0,O.width,0);C.addColorStop(0,"red"),C.addColorStop(1/6,"yellow"),C.addColorStop(2/6,"lime"),C.addColorStop(3/6,"aqua"),C.addColorStop(4/6,"blue"),C.addColorStop(5/6,"magenta"),C.addColorStop(1,"red"),A.fillStyle=C,A.fillRect(0,0,O.width,O.height);const Q=A.getImageData(I,W,1,1),[ee,te,re]=Q.data,Y=`rgb(${ee}, ${te}, ${re})`;y.style.backgroundColor=Y;const q=this.formatColor(Y,r);k.textContent=q}),_.appendChild(S),_.appendChild(F),_.appendChild(M);const j=document.createElement("div");j.className="color-input-section",j.style.cssText=`
            margin-bottom: var(--size-xl);
        `;const D=document.createElement("h4");D.textContent="手动输入",D.style.cssText=`
            margin: 0 0 var(--size-md) 0;
            color: var(--text-primary);
        `;const H=document.createElement("div");H.className="input-container",H.style.cssText=`
            display: flex;
            gap: var(--size-sm);
        `;const E=document.createElement("input");E.type="color",E.className="color-input",E.style.cssText=`
            width: 50px;
            height: 32px;
            border: 1px solid var(--border-color);
            border-radius: var(--radius-sm);
            cursor: pointer;
        `,E.value=g,E.addEventListener("change",()=>{const d=E.value;y.style.backgroundColor=d;const u=this.formatColor(d,r);k.textContent=u});const w=document.createElement("input");w.type="text",w.className="text-input",w.style.cssText=`
            flex: 1;
            padding: var(--size-xs) var(--size-sm);
            border: 1px solid var(--border-color);
            border-radius: var(--radius-sm);
            font-family: monospace;
            font-size: 12px;
        `,w.value=g,w.addEventListener("input",()=>{const d=w.value;try{y.style.backgroundColor=d}catch{}}),H.appendChild(E),H.appendChild(w),j.appendChild(D),j.appendChild(H);const G=document.createElement("div");G.className="button-section",G.style.cssText=`
            display: flex;
            justify-content: flex-end;
            gap: var(--size-sm);
            padding-top: var(--size-sm);
            border-top: 1px solid var(--border-color);
        `;const $=document.createElement("button");$.className="btn btn-default",$.textContent="取消",$.style.cssText=`
            padding: var(--size-xs) var(--size-sm);
            border: 1px solid var(--border-color);
            border-radius: var(--radius-sm);
            background: var(--bg-color);
            color: var(--text-primary);
            cursor: pointer;
            transition: all var(--transition-normal);
            font-size: 12px;
        `,$.addEventListener("click",()=>{if(a)a.classList.remove("show"),setTimeout(()=>{hideOverlay("color-picker-overlay"),n("Color picker cancelled")},300);else{const d=$.closest(".color-picker-inline");d&&(d.style.display="none",n("Color picker cancelled"))}});const B=document.createElement("button");return B.className="btn btn-primary",B.textContent="确认",B.style.cssText=`
            padding: var(--size-xs) var(--size-sm);
            border: none;
            border-radius: var(--radius-sm);
            background: var(--primary-color);
            color: white;
            cursor: pointer;
            transition: all var(--transition-normal);
            font-size: 12px;
        `,B.addEventListener("click",()=>{const d=y.style.backgroundColor,u=this.formatColor(d,r);if(a)a.classList.remove("show"),setTimeout(()=>{hideOverlay("color-picker-overlay"),s(u)},300);else{const I=B.closest(".color-picker-inline");I&&(I.style.display="none",s(u))}}),G.appendChild($),G.appendChild(B),m.appendChild(p),m.appendChild(_),m.appendChild(L),m.appendChild(j),m.appendChild(G),i.appendChild(m),i}formatColor(t,o){try{if(o==="hex"){if(t.startsWith("rgb")){const r=t.match(/rgb\((\d+),\s*(\d+),\s*(\d+)\s*(,\s*([\d.]+))?\)/);if(r){const s=parseInt(r[1]),n=parseInt(r[2]),a=parseInt(r[3]),i=r[5]?parseFloat(r[5]):1;return i===1?"#"+((1<<24)+(s<<16)+(n<<8)+a).toString(16).slice(1).toUpperCase():`rgba(${s}, ${n}, ${a}, ${i})`}}return t.toUpperCase()}else if(o==="rgb"){if(t.startsWith("#")){const r=t.replace("#",""),s=parseInt(r.length===3?r[0]+r[0]:r.substring(0,2),16),n=parseInt(r.length===3?r[1]+r[1]:r.substring(2,4),16),a=parseInt(r.length===3?r[2]+r[2]:r.substring(4,6),16);return`rgb(${s}, ${n}, ${a})`}else if(t.startsWith("rgba"))return t.replace("rgba","rgb").replace(/,\s*[\d.]+\)$/,")");return t}else if(o==="rgba"){if(t.startsWith("#")){const r=t.replace("#",""),s=parseInt(r.length===3?r[0]+r[0]:r.substring(0,2),16),n=parseInt(r.length===3?r[1]+r[1]:r.substring(2,4),16),a=parseInt(r.length===3?r[2]+r[2]:r.substring(4,6),16);return`rgba(${s}, ${n}, ${a}, 1)`}else if(t.startsWith("rgb"))return t.replace("rgb","rgba").replace(")",", 1)");return t}return t}catch{return t}}};const colorPicker=Object.freeze(Object.defineProperty({__proto__:null},Symbol.toStringTag,{value:"Module"}));class UI{constructor(){this.themeManager=new ThemeManager,this.init()}init(){this.initModals(),this.initToasts(),this.initImageZoom(),this.initFormValidation(),this.initCollapsePanels(),this.initMenus()}initCollapsePanels(){document.querySelectorAll(".collapse-header").forEach(t=>{t.addEventListener("click",()=>{debug("折叠面板点击",t,{panelId:t.parentElement.id});const o=t.parentElement;o.classList.toggle("active"),o.querySelector(".collapse-content");const r=t.querySelector("span");o.classList.contains("active")?r.textContent="▲":r.textContent="▼"})})}initModals(){this.modal={show:l=>{},hide:()=>{}}}initToasts(){this.toast={success:(l,t={})=>{this.showToast("success",l,t)},error:(l,t={})=>{this.showToast("error",l,t)},warning:(l,t={})=>{this.showToast("warning",l,t)},info:(l,t={})=>{this.showToast("info",l,t)},showToast:(l,t,o)=>{}}}initImageZoom(){this.imageZoom={init:()=>{},show:l=>{},hide:()=>{}}}initFormValidation(){this.formValidation={validate:l=>{},addRule:(l,t,o)=>{}}}getThemeManager(){return this.themeManager}getColorPicker(){return this.colorPicker||(this.colorPicker=new ColorPicker),this.colorPicker}initMenus(){this.menus=new Map,this.menu={init:()=>{this.initMenuEvents(),this.startMenuObserver()},toggle:l=>{const t=document.getElementById(l);t&&(t.classList.contains("menu-hidden")?(t.classList.remove("menu-hidden"),t.classList.add("menu-visible")):(t.classList.remove("menu-visible"),t.classList.add("menu-hidden")))},setActive:l=>{l.closest("menu").querySelectorAll("li").forEach(o=>{o.classList.remove("active")}),l.classList.add("active")},addItem:(l,t,o)=>{const r=document.getElementById(l);if(!r)return null;let s=r;if(t){if(s=document.querySelector(`#${l} li[data-id="${t}"]`),!s)return null;let i=s.querySelector("ul");i||(i=document.createElement("ul"),s.appendChild(i)),s=i}else{let i=r.querySelector("ul");i||(i=document.createElement("ul"),r.appendChild(i)),s=i}const n=document.createElement("li");n.setAttribute("data-id",o.id||`menu-item-${Date.now()}`);const a=document.createElement("a");if(a.href=o.href||"#",a.textContent=o.text,o.icon){const i=document.createElement("span");i.className="menu-icon",i.textContent=o.icon,a.insertBefore(i,a.firstChild)}if(o.badge){const i=document.createElement("span");i.className=`menu-badge badge badge-${o.badge.type||"primary"}`,i.textContent=o.badge.text,a.appendChild(i)}if(o.data)for(const[i,c]of Object.entries(o.data))a.setAttribute(`data-${i}`,c);return n.appendChild(a),s.appendChild(n),this.initMenuEvents(),n}},this.initMenuEvents(),this.startMenuObserver()}startMenuObserver(){this.menuObserver=new MutationObserver(l=>{l.forEach(t=>{t.addedNodes.forEach(o=>{o.nodeType===Node.ELEMENT_NODE&&(o.tagName==="MENU"&&this.initMenu(o),o.querySelectorAll("menu").forEach(s=>{this.initMenu(s)}))}),t.removedNodes.forEach(o=>{o.nodeType===Node.ELEMENT_NODE&&(o.tagName==="MENU"&&this.destroyMenu(o),o.querySelectorAll("menu").forEach(s=>{this.destroyMenu(s)}))})})}),this.menuObserver.observe(document.body,{childList:!0,subtree:!0})}initMenu(menu){const menuId=menu.id||`menu-${Date.now()}`;menu.id||(menu.id=menuId),menu.querySelectorAll("ul ul").forEach(l=>{l.classList.add("collapsed")});const menuObj={element:menu,id:menuId,handleClick:e=>{const item=e.target.closest("menu li");if(item&&item.closest("menu")===menu){e.stopPropagation(),this.menu.setActive(item);const allExpandedItems=menu.querySelectorAll("li.expanded");allExpandedItems.forEach(l=>{const t=l.querySelector(":scope > ul");t&&(t.classList.add("collapsed"),l.classList.remove("expanded"))});const submenu=item.querySelector(":scope > ul");submenu&&(submenu.classList.remove("collapsed"),item.classList.add("expanded"));const link=item.querySelector("a");if(link)if(link.hasAttribute("onclick")){e.preventDefault();const onclick=link.getAttribute("onclick");link.removeAttribute("onclick"),setTimeout(()=>{try{eval(onclick)}catch(l){console.error("Menu onclick error:",l)}link.setAttribute("onclick",onclick)},0)}else{const dataHref=link.getAttribute("data-href"),dataAction=link.getAttribute("data-action");if(dataHref&&(e.preventDefault(),window.location.href=dataHref),dataAction){e.preventDefault();try{const action=eval(dataAction);typeof action=="function"&&action()}catch(l){console.error("Menu action error:",l)}}}else{const dataHref=item.getAttribute("data-href"),dataAction=item.getAttribute("data-action");if(dataHref&&(window.location.href=dataHref),dataAction)try{const action=eval(dataAction);typeof action=="function"&&action()}catch(l){console.error("Menu action error:",l)}}}}};menu.addEventListener("click",menuObj.handleClick),this.menus.set(menuId,menuObj)}destroyMenu(l){const t=l.id;if(this.menus.has(t)){const o=this.menus.get(t);l.removeEventListener("click",o.handleClick),this.menus.delete(t)}}initMenuEvents(){document.querySelectorAll("menu").forEach(t=>{const o=t.id||`menu-${Date.now()}`;this.menus.has(o)||this.initMenu(t)})}}document.addEventListener("DOMContentLoaded",function(){debug("DOM加载完成，初始化UI"),window.ui=new UI});const ui=Object.freeze(Object.defineProperty({__proto__:null},Symbol.toStringTag,{value:"Module"})),scriptRel="modulepreload",assetsURL=function(l){return"/"+l},seen={},__vitePreload=function l(t,o,r){let s=Promise.resolve();if(o&&o.length>0){document.getElementsByTagName("link");const a=document.querySelector("meta[property=csp-nonce]"),i=(a==null?void 0:a.nonce)||(a==null?void 0:a.getAttribute("nonce"));s=Promise.allSettled(o.map(c=>{if(c=assetsURL(c),c in seen)return;seen[c]=!0;const v=c.endsWith(".css"),P=v?'[rel="stylesheet"]':"";if(document.querySelector(`link[href="${c}"]${P}`))return;const m=document.createElement("link");if(m.rel=v?"stylesheet":scriptRel,v||(m.as="script"),m.crossOrigin="",m.href=c,i&&m.setAttribute("nonce",i),document.head.appendChild(m),v)return new Promise((p,h)=>{m.addEventListener("load",p),m.addEventListener("error",()=>h(new Error(`Unable to preload CSS for ${c}`)))})}))}function n(a){const i=new Event("vite:preloadError",{cancelable:!0});if(i.payload=a,window.dispatchEvent(i),!i.defaultPrevented)throw a}return s.then(a=>{for(const i of a||[])i.status==="rejected"&&n(i.reason);return t().catch(n)})};__vitePreload(()=>Promise.resolve().then(()=>core),void 0).then(l=>Promise.all([__vitePreload(()=>Promise.resolve().then(()=>modal),void 0),__vitePreload(()=>Promise.resolve().then(()=>message),void 0),__vitePreload(()=>Promise.resolve().then(()=>imageZoom),void 0),__vitePreload(()=>Promise.resolve().then(()=>colorPicker),void 0),__vitePreload(()=>Promise.resolve().then(()=>themeManager),void 0),__vitePreload(()=>Promise.resolve().then(()=>ui),void 0)])).then(()=>{console.log("所有模块加载完成")}).catch(l=>{console.error("模块加载失败:",l)});
