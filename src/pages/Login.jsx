import React, { useState } from 'react';

// 【极其重要】把下面这个引号里的网址，换成你在【第二步的第11小步】存到记事本里的 Worker 地址！
const WORKER_URL = "https://gal-backend.你的用户名.workers.dev"; 

export default function Login({ onLogin }) {
  const [acc, setAcc] = useState('');
  const [pwd, setPwd] = useState('');

  const submit = async () => {
    const res = await fetch(`${WORKER_URL}/api/login`, {
      method: 'POST',
      body: JSON.stringify({ account: acc, password: pwd })
    });
    if (res.ok) {
      localStorage.setItem('gal_token', 'ok');
      onLogin();
    } else {
      alert("密码错误");
    }
  };

  return (
    <div style={{display:'flex', justifyContent:'center', marginTop:'100px'}}>
      <div style={{border:'1px solid #ccc', padding:'30px', borderRadius:'8px', width:'300px'}}>
        <h2>系统登录</h2>
        <input placeholder="账号" value={acc} onChange={e=>setAcc(e.target.value)} style={{display:'block', marginBottom:'10px', width:'100%', padding:'8px'}} />
        <input type="password" placeholder="密码" value={pwd} onChange={e=>setPwd(e.target.value)} style={{display:'block', marginBottom:'20px', width:'100%', padding:'8px'}} />
        <button onClick={submit} style={{width:'100%', padding:'10px', background:'blue', color:'white', border:'none', borderRadius:'4px'}}>登录</button>
      </div>
    </div>
  );
}