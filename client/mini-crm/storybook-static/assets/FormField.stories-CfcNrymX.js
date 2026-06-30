import{i as e}from"./preload-helper-D2yxXLVK.js";import{d as t}from"./iframe-DGKGUAqj.js";import{n,t as r}from"./Typography-DL2Fyi3U.js";import{n as i,t as a}from"./Input-B-cNZk70.js";function o({label:e,error:t,children:n}){return(0,s.jsxs)(`div`,{style:{display:`flex`,flexDirection:`column`,gap:`var(--space-1)`},children:[(0,s.jsx)(r,{as:`caption`,children:e}),n,t&&(0,s.jsx)(`span`,{style:{fontSize:`var(--text-xs)`,color:`var(--color-danger)`},children:t})]})}var s,c=e((()=>{s=t(),n(),o.__docgenInfo={description:``,methods:[],displayName:`FormField`,props:{label:{required:!0,tsType:{name:`string`},description:``},error:{required:!1,tsType:{name:`string`},description:``},children:{required:!0,tsType:{name:`ReactNode`},description:``}}}})),l,u,d,f,p;e((()=>{l=t(),c(),i(),u={title:`Molecules/FormField`,component:o},d={args:{label:`Email`,children:(0,l.jsx)(a,{placeholder:`you@example.com`})}},f={args:{label:`Password`,error:`Required`,children:(0,l.jsx)(a,{type:`password`,error:`Required`})}},d.parameters={...d.parameters,docs:{...d.parameters?.docs,source:{originalSource:`{
  args: {
    label: 'Email',
    children: <Input placeholder="you@example.com" />
  }
}`,...d.parameters?.docs?.source}}},f.parameters={...f.parameters,docs:{...f.parameters?.docs,source:{originalSource:`{
  args: {
    label: 'Password',
    error: 'Required',
    children: <Input type="password" error="Required" />
  }
}`,...f.parameters?.docs?.source}}},p=[`Default`,`WithError`]}))();export{d as Default,f as WithError,p as __namedExportsOrder,u as default};