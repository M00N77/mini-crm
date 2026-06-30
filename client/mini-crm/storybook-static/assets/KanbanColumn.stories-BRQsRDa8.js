import{i as e}from"./preload-helper-D2yxXLVK.js";import{d as t}from"./iframe-DGKGUAqj.js";import{n,t as r}from"./Badge-DGSNmSm0.js";import{n as i,t as a}from"./Typography-DL2Fyi3U.js";import{n as o,t as s}from"./Card-Dujo4abI.js";function c({title:e,count:t,variant:n=`info`,children:i}){return(0,u.jsxs)(`div`,{style:{display:`flex`,flexDirection:`column`,gap:`var(--space-3)`,minWidth:280,flex:1},children:[(0,u.jsxs)(`div`,{style:{display:`flex`,alignItems:`center`,gap:`var(--space-2)`,padding:`0 var(--space-1)`},children:[(0,u.jsx)(a,{as:`h3`,children:e}),(0,u.jsx)(r,{variant:n,children:t})]}),(0,u.jsx)(`div`,{style:{display:`flex`,flexDirection:`column`,gap:`var(--space-2)`},children:i})]})}function l({title:e,children:t}){return(0,u.jsx)(s.Root,{children:(0,u.jsxs)(s.Content,{children:[(0,u.jsx)(a,{as:`p`,children:e}),t]})})}var u,d=e((()=>{u=t(),i(),n(),o(),c.__docgenInfo={description:``,methods:[],displayName:`KanbanColumn`,props:{title:{required:!0,tsType:{name:`string`},description:``},count:{required:!0,tsType:{name:`number`},description:``},variant:{required:!1,tsType:{name:`union`,raw:`'success' | 'warning' | 'error' | 'info'`,elements:[{name:`literal`,value:`'success'`},{name:`literal`,value:`'warning'`},{name:`literal`,value:`'error'`},{name:`literal`,value:`'info'`}]},description:``,defaultValue:{value:`'info'`,computed:!1}},children:{required:!0,tsType:{name:`ReactNode`},description:``}}},l.__docgenInfo={description:``,methods:[],displayName:`KanbanTask`,props:{title:{required:!0,tsType:{name:`string`},description:``},children:{required:!1,tsType:{name:`ReactNode`},description:``}}}})),f,p,m,h;e((()=>{f=t(),d(),p={title:`Organisms/KanbanColumn`,component:c},m={render:()=>(0,f.jsxs)(`div`,{style:{display:`flex`,gap:24},children:[(0,f.jsxs)(c,{title:`To Do`,count:3,variant:`info`,children:[(0,f.jsx)(l,{title:`Design login page`}),(0,f.jsx)(l,{title:`Setup database`}),(0,f.jsx)(l,{title:`Write API docs`})]}),(0,f.jsxs)(c,{title:`In Progress`,count:2,variant:`warning`,children:[(0,f.jsx)(l,{title:`Implement auth`}),(0,f.jsx)(l,{title:`Create contact form`})]}),(0,f.jsxs)(c,{title:`Done`,count:4,variant:`success`,children:[(0,f.jsx)(l,{title:`Project setup`}),(0,f.jsx)(l,{title:`Design system`})]})]})},m.parameters={...m.parameters,docs:{...m.parameters?.docs,source:{originalSource:`{
  render: () => <div style={{
    display: 'flex',
    gap: 24
  }}>\r
      <KanbanColumn title="To Do" count={3} variant="info">\r
        <KanbanTask title="Design login page" />\r
        <KanbanTask title="Setup database" />\r
        <KanbanTask title="Write API docs" />\r
      </KanbanColumn>\r
      <KanbanColumn title="In Progress" count={2} variant="warning">\r
        <KanbanTask title="Implement auth" />\r
        <KanbanTask title="Create contact form" />\r
      </KanbanColumn>\r
      <KanbanColumn title="Done" count={4} variant="success">\r
        <KanbanTask title="Project setup" />\r
        <KanbanTask title="Design system" />\r
      </KanbanColumn>\r
    </div>
}`,...m.parameters?.docs?.source}}},h=[`Default`]}))();export{m as Default,h as __namedExportsOrder,p as default};