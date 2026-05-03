import React, { useState } from 'react';

// 【极其重要！！！检查这里！】
// 1. 必须以 https:// 开头
// 2. 结尾千万不能有斜杠 /
// 3. 替换成你真实的 Worker 访问地址
const WORKER_URL = "https://gal-backend.zhangjiaqi20090126.workers.dev"; 

export default function Login({ onLogin }) {
  const [acc, setAcc] = useState('');
  const [pwd, setPwd] = useState('');
  const [loading, setLoading] = useState(false); // 增加加载状态

  const submit = async () => {
    if (!acc || !pwd) {
      alert("请输入账号和密码！");
      return;
    }
    
    setLoading(true); // 按钮变成加载中
    try {
      const res = await fetch(`${WORKER_URL}/api/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ account: acc, password: pwd })
      });
      
      const data = await res.json();
      
      if (res.ok && data.success) {
        localStorage.setItem('gal_token', 'ok');
        onLogin(); // 登录成功，通知 App.jsx 放行
      } else {
        alert("登录失败：" + (data.msg || "账号或密码错误"));
      }
    } catch (error) {
      // 如果走到这里，说明根本没连上 Worker！
      alert("连接门卫失败！请仔细检查代码里的 WORKER_URL 是否完全正确。\n具体报错：" + error.message);
    } finally {
      setLoading(false); // 恢复按钮
    }
  };

  return (
    <div style={{display:'flex', justifyContent:'center', marginTop:'100px'}}>
      <div style={{border:'1px solid #ccc', padding:'30px', borderRadius:'8px', width:'300px'}}>
        <h2>Gal System 登录入口</h2>
        <input 
          placeholder="账号" 
          value={acc} 
          onChange={e=>setAcc(e.target.value)} 
          style={{display:'block', marginBottom:'10px', width:'100%', padding:'8px'}} 
        />
        <input 
          type="password" 
          placeholder="密码" 
          value={pwd} 
          onChange={e=>setPwd(e.target.value)} 
          style={{display:'block', marginBottom:'20px', width:'100%', padding:'8px'}} 
        />
        <button 
          onClick={submit} 
          disabled={loading}
          style={{
            width:'100%', 
            padding:'10px', 
            background: loading ? 'gray' : 'blue', 
            color:'white', 
            border:'none', 
            borderRadius:'4px',
            cursor: loading ? 'wait' : 'pointer' /* 修复了鼠标变小手的问题！ */
          }}>
          {loading ? '正在验证...' : '进入系统'}
        </button>
      </div>
    </div>
  );
}
