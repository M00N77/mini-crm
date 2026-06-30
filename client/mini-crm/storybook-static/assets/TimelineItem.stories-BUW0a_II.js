import{i as e}from"./preload-helper-D2yxXLVK.js";import{d as t}from"./iframe-DGKGUAqj.js";import{n,t as r}from"./Typography-DL2Fyi3U.js";function i({children:e,date:t,active:n=!1}){return(0,a.jsxs)(`div`,{style:{display:`flex`,gap:`var(--space-3)`},children:[(0,a.jsxs)(`div`,{style:{display:`flex`,flexDirection:`column`,alignItems:`center`,width:20},children:[(0,a.jsx)(`div`,{style:{width:10,height:10,borderRadius:`var(--radius-full)`,background:n?`var(--color-info)`:`var(--border-strong)`,flexShrink:0,marginTop:4}}),(0,a.jsx)(`div`,{style:{width:1,flex:1,background:`var(--border-subtle)`,minHeight:16}})]}),(0,a.jsxs)(`div`,{style:{paddingBottom:`var(--space-4)`,flex:1},children:[(0,a.jsx)(`div`,{style:{marginBottom:`var(--space-1)`},children:e}),(0,a.jsx)(r,{as:`caption`,children:t})]})]})}var a,o=e((()=>{a=t(),n(),i.__docgenInfo={description:``,methods:[],displayName:`TimelineItem`,props:{children:{required:!0,tsType:{name:`ReactNode`},description:``},date:{required:!0,tsType:{name:`string`},description:``},active:{required:!1,tsType:{name:`boolean`},description:``,defaultValue:{value:`false`,computed:!1}}}}})),s,c,l,u,d;e((()=>{s=t(),o(),n(),c={title:`Molecules/TimelineItem`,component:i},l={args:{date:`2 hours ago`,active:!0,children:(0,s.jsx)(r,{as:`p`,children:`Called regarding project proposal`})}},u={args:{date:`Yesterday`,active:!1,children:(0,s.jsx)(r,{as:`p`,children:`Sent follow-up email`})}},l.parameters={...l.parameters,docs:{...l.parameters?.docs,source:{originalSource:`{
  args: {
    date: '2 hours ago',
    active: true,
    children: <Typography as="p">Called regarding project proposal</Typography>
  }
}`,...l.parameters?.docs?.source}}},u.parameters={...u.parameters,docs:{...u.parameters?.docs,source:{originalSource:`{
  args: {
    date: 'Yesterday',
    active: false,
    children: <Typography as="p">Sent follow-up email</Typography>
  }
}`,...u.parameters?.docs?.source}}},d=[`Default`,`Inactive`]}))();export{l as Default,u as Inactive,d as __namedExportsOrder,c as default};