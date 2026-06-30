import{c as e,i as t}from"./preload-helper-D2yxXLVK.js";import{d as n,j as r,u as i}from"./iframe-DGKGUAqj.js";import{n as a,t as o}from"./Button-Gc6KrasH.js";import{d as s,f as c}from"./fi-CqlT4gR3.js";import{n as l,t as u}from"./Typography-DL2Fyi3U.js";import{n as d,t as f}from"./IconButton-pbtRuQKB.js";function p({open:e,onClose:t,title:n,children:r,width:i=480}){return(0,h.useEffect)(()=>(e?document.body.style.overflow=`hidden`:document.body.style.overflow=``,()=>{document.body.style.overflow=``}),[e]),(0,h.useEffect)(()=>{function n(n){n.key===`Escape`&&e&&t()}return window.addEventListener(`keydown`,n),()=>window.removeEventListener(`keydown`,n)},[e,t]),e?(0,g.createPortal)((0,m.jsxs)(`div`,{style:{position:`fixed`,inset:0,zIndex:1e3,display:`flex`},children:[(0,m.jsx)(`div`,{style:{flex:1,background:`rgba(0,0,0,0.6)`},onClick:t}),(0,m.jsxs)(`div`,{style:{width:i,maxWidth:`100vw`,background:`var(--bg-base)`,borderLeft:`1px solid var(--border-subtle)`,display:`flex`,flexDirection:`column`,animation:`slideIn 0.2s ease`},children:[(0,m.jsxs)(`div`,{style:{display:`flex`,alignItems:`center`,justifyContent:`space-between`,padding:`var(--space-4) var(--space-5)`,borderBottom:`1px solid var(--border-subtle)`},children:[(0,m.jsx)(u,{as:`h2`,children:n}),(0,m.jsx)(f,{icon:(0,m.jsx)(s,{size:20}),label:`Close`,onClick:t})]}),(0,m.jsx)(`div`,{style:{flex:1,overflow:`auto`,padding:`var(--space-5)`},children:r})]}),(0,m.jsx)(`style`,{children:`
        @keyframes slideIn {
          from { transform: translateX(100%); }
          to { transform: translateX(0); }
        }
      `})]}),document.body):null}var m,h,g,_=t((()=>{m=n(),h=e(r()),g=e(i()),d(),c(),l()})),v,y,b,x,S;t((()=>{v=n(),_(),y=e(r()),a(),l(),b={title:`Organisms/Drawer`,component:p},x={render:()=>{let[e,t]=(0,y.useState)(!1);return(0,v.jsxs)(v.Fragment,{children:[(0,v.jsx)(o,{onClick:()=>t(!0),children:`Open Drawer`}),(0,v.jsxs)(p,{open:e,onClose:()=>t(!1),title:`Contact Details`,children:[(0,v.jsx)(u,{as:`p`,children:`Email: alice@example.com`}),(0,v.jsx)(u,{as:`p`,children:`Phone: +1 234 567 890`})]})]})}},x.parameters={...x.parameters,docs:{...x.parameters?.docs,source:{originalSource:`{
  render: () => {
    const [open, setOpen] = useState(false);
    return <>\r
        <Button onClick={() => setOpen(true)}>Open Drawer</Button>\r
        <Drawer open={open} onClose={() => setOpen(false)} title="Contact Details">\r
          <Typography as="p">Email: alice@example.com</Typography>\r
          <Typography as="p">Phone: +1 234 567 890</Typography>\r
        </Drawer>\r
      </>;
  }
}`,...x.parameters?.docs?.source}}},S=[`Default`]}))();export{x as Default,S as __namedExportsOrder,b as default};