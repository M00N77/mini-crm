import{i as e}from"./preload-helper-D2yxXLVK.js";import{d as t}from"./iframe-DGKGUAqj.js";import{a as n,f as r,r as i}from"./fi-CqlT4gR3.js";import{n as a,t as o}from"./Input-B-cNZk70.js";var s,c,l,u,d,f,p,m,h;e((()=>{s=t(),a(),r(),c={title:`Atoms/Input`,component:o},l={args:{placeholder:`Enter text...`}},u={args:{label:`Email`,placeholder:`you@example.com`}},d={args:{label:`Email`,placeholder:`you@example.com`,iconLeft:(0,s.jsx)(n,{})}},f={args:{label:`Password`,type:`password`,iconLeft:(0,s.jsx)(i,{}),error:`Password must be at least 8 characters`}},p={args:{label:`Disabled`,placeholder:`Can't type`,disabled:!0}},m={render:()=>(0,s.jsxs)(`div`,{style:{display:`flex`,flexDirection:`column`,gap:16,maxWidth:320},children:[(0,s.jsx)(o,{placeholder:`Default input`}),(0,s.jsx)(o,{label:`Email`,placeholder:`you@example.com`}),(0,s.jsx)(o,{label:`Email`,placeholder:`you@example.com`,iconLeft:(0,s.jsx)(n,{})}),(0,s.jsx)(o,{label:`Password`,type:`password`,iconLeft:(0,s.jsx)(i,{}),error:`Password must be at least 8 characters`}),(0,s.jsx)(o,{label:`Disabled`,placeholder:`Can't type`,disabled:!0}),(0,s.jsx)(o,{label:`With right icon`,placeholder:`Search...`,iconRight:(0,s.jsx)(n,{})}),(0,s.jsx)(o,{label:`Both icons`,placeholder:`Both sides`,iconLeft:(0,s.jsx)(n,{}),iconRight:(0,s.jsx)(i,{})})]})},l.parameters={...l.parameters,docs:{...l.parameters?.docs,source:{originalSource:`{
  args: {
    placeholder: 'Enter text...'
  }
}`,...l.parameters?.docs?.source}}},u.parameters={...u.parameters,docs:{...u.parameters?.docs,source:{originalSource:`{
  args: {
    label: 'Email',
    placeholder: 'you@example.com'
  }
}`,...u.parameters?.docs?.source}}},d.parameters={...d.parameters,docs:{...d.parameters?.docs,source:{originalSource:`{
  args: {
    label: 'Email',
    placeholder: 'you@example.com',
    iconLeft: <FiMail />
  }
}`,...d.parameters?.docs?.source}}},f.parameters={...f.parameters,docs:{...f.parameters?.docs,source:{originalSource:`{
  args: {
    label: 'Password',
    type: 'password',
    iconLeft: <FiLock />,
    error: 'Password must be at least 8 characters'
  }
}`,...f.parameters?.docs?.source}}},p.parameters={...p.parameters,docs:{...p.parameters?.docs,source:{originalSource:`{
  args: {
    label: 'Disabled',
    placeholder: "Can't type",
    disabled: true
  }
}`,...p.parameters?.docs?.source}}},m.parameters={...m.parameters,docs:{...m.parameters?.docs,source:{originalSource:`{
  render: () => <div style={{
    display: 'flex',
    flexDirection: 'column',
    gap: 16,
    maxWidth: 320
  }}>\r
      <Input placeholder="Default input" />\r
      <Input label="Email" placeholder="you@example.com" />\r
      <Input label="Email" placeholder="you@example.com" iconLeft={<FiMail />} />\r
      <Input label="Password" type="password" iconLeft={<FiLock />} error="Password must be at least 8 characters" />\r
      <Input label="Disabled" placeholder="Can't type" disabled />\r
      <Input label="With right icon" placeholder="Search..." iconRight={<FiMail />} />\r
      <Input label="Both icons" placeholder="Both sides" iconLeft={<FiMail />} iconRight={<FiLock />} />\r
    </div>
}`,...m.parameters?.docs?.source}}},h=[`Default`,`WithLabel`,`WithIcon`,`WithError`,`Disabled`,`AllVariants`]}))();export{m as AllVariants,l as Default,p as Disabled,f as WithError,d as WithIcon,u as WithLabel,h as __namedExportsOrder,c as default};