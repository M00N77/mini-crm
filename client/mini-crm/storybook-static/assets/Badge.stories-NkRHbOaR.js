import{i as e}from"./preload-helper-D2yxXLVK.js";import{d as t}from"./iframe-DGKGUAqj.js";import{n,t as r}from"./Badge-DGSNmSm0.js";var i,a,o,s,c,l,u,d,f,p,m;e((()=>{i=t(),n(),a={title:`Atoms/Badge`,component:r,argTypes:{variant:{control:`select`,options:[`success`,`warning`,`error`,`info`]}}},o={args:{variant:`success`,children:`Completed`}},s={args:{variant:`warning`,children:`In Progress`}},c={args:{variant:`error`,children:`Overdue`}},l={args:{variant:`info`,children:`Pending`}},u={args:{variant:`success`,dot:!0,children:`Online`}},d={args:{variant:`success`,children:`+12%`}},f={render:()=>(0,i.jsxs)(`div`,{style:{display:`flex`,gap:8,alignItems:`center`},children:[(0,i.jsx)(r,{variant:`success`,children:`Completed`}),(0,i.jsx)(r,{variant:`warning`,children:`In Progress`}),(0,i.jsx)(r,{variant:`error`,children:`Overdue`}),(0,i.jsx)(r,{variant:`info`,children:`Pending`})]})},p={render:()=>(0,i.jsxs)(`div`,{style:{display:`flex`,gap:8,alignItems:`center`},children:[(0,i.jsx)(r,{variant:`success`,dot:!0,children:`Online`}),(0,i.jsx)(r,{variant:`warning`,dot:!0,children:`Away`}),(0,i.jsx)(r,{variant:`error`,dot:!0,children:`Offline`}),(0,i.jsx)(r,{variant:`info`,dot:!0,children:`Away`})]})},o.parameters={...o.parameters,docs:{...o.parameters?.docs,source:{originalSource:`{
  args: {
    variant: 'success',
    children: 'Completed'
  }
}`,...o.parameters?.docs?.source}}},s.parameters={...s.parameters,docs:{...s.parameters?.docs,source:{originalSource:`{
  args: {
    variant: 'warning',
    children: 'In Progress'
  }
}`,...s.parameters?.docs?.source}}},c.parameters={...c.parameters,docs:{...c.parameters?.docs,source:{originalSource:`{
  args: {
    variant: 'error',
    children: 'Overdue'
  }
}`,...c.parameters?.docs?.source}}},l.parameters={...l.parameters,docs:{...l.parameters?.docs,source:{originalSource:`{
  args: {
    variant: 'info',
    children: 'Pending'
  }
}`,...l.parameters?.docs?.source}}},u.parameters={...u.parameters,docs:{...u.parameters?.docs,source:{originalSource:`{
  args: {
    variant: 'success',
    dot: true,
    children: 'Online'
  }
}`,...u.parameters?.docs?.source}}},d.parameters={...d.parameters,docs:{...d.parameters?.docs,source:{originalSource:`{
  args: {
    variant: 'success',
    children: '+12%'
  }
}`,...d.parameters?.docs?.source}}},f.parameters={...f.parameters,docs:{...f.parameters?.docs,source:{originalSource:`{
  render: () => <div style={{
    display: 'flex',
    gap: 8,
    alignItems: 'center'
  }}>\r
      <Badge variant="success">Completed</Badge>\r
      <Badge variant="warning">In Progress</Badge>\r
      <Badge variant="error">Overdue</Badge>\r
      <Badge variant="info">Pending</Badge>\r
    </div>
}`,...f.parameters?.docs?.source}}},p.parameters={...p.parameters,docs:{...p.parameters?.docs,source:{originalSource:`{
  render: () => <div style={{
    display: 'flex',
    gap: 8,
    alignItems: 'center'
  }}>\r
      <Badge variant="success" dot>Online</Badge>\r
      <Badge variant="warning" dot>Away</Badge>\r
      <Badge variant="error" dot>Offline</Badge>\r
      <Badge variant="info" dot>Away</Badge>\r
    </div>
}`,...p.parameters?.docs?.source}}},m=[`Success`,`Warning`,`Error`,`Info`,`WithDot`,`TrendUp`,`AllVariants`,`WithDotVariants`]}))();export{f as AllVariants,c as Error,l as Info,o as Success,d as TrendUp,s as Warning,u as WithDot,p as WithDotVariants,m as __namedExportsOrder,a as default};