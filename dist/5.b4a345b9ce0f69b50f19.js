(window.webpackJsonp=window.webpackJsonp||[]).push([[5],{215:function(e,t,a){"use strict";a.r(t);var o=a(0),l=a.n(o),n=a(6),c=a(2),r=a.n(c),s=a(15),m=a(10),u=a(5);t.default=function(){const[e,t]=Object(o.useState)(),[a,c]=Object(o.useState)(),[p,b]=Object(o.useState)(!1),i=Object(o.useContext)(m.a),d=Object(o.useContext)(u.a);return p?(i({type:"flashMessage",value:"Congrats, you created a new post."}),l.a.createElement(s.a,{to:`/post/${p}`})):l.a.createElement(n.a,{title:"Create New Post"},l.a.createElement("form",{onSubmit:async function(t){t.preventDefault();try{const t=await r.a.post("/create-post",{title:e,body:a,token:d.user.token});b(t.data)}catch(t){console.log(t)}}},l.a.createElement("div",{className:"form-group"},l.a.createElement("label",{htmlFor:"post-title",className:"text-muted mb-1"},l.a.createElement("small",null,"Title")),l.a.createElement("input",{onChange:e=>t(e.target.value),autoFocus:!0,name:"title",id:"post-title",className:"form-control form-control-lg form-control-title",type:"text",placeholder:"",autoComplete:"off"})),l.a.createElement("div",{className:"form-group"},l.a.createElement("label",{htmlFor:"post-body",className:"text-muted mb-1 d-block"},l.a.createElement("small",null,"Body Content")),l.a.createElement("textarea",{onChange:e=>c(e.target.value),name:"body",id:"post-body",className:"body-content tall-textarea form-control",type:"text"})),l.a.createElement("button",{className:"btn btn-primary"},"Save New Post")))}}}]);