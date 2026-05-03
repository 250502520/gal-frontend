import React, { useState } from 'react';

// 确认你的后端地址
const WORKER_URL = "https://gal-backend.zhangjiaqi20090126.workers.dev";

export default function Login() {
  // 这里定义 state 名字
  const [acc, setAcc] = useState('intttttttt'); 
  const [pwd, setPwd] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      const res = await fetch(`${WORKER_URL}/api/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        // 【关键修复】：直接使用你测试成功的 acc 和 pwd
        body: JSON.stringify({ account: acc, password: pwd })
      });

      const data = await res.json();
      
      if (res.ok) {
        localStorage.setItem('gal_token', data.token);
        window.location.href = '/'; 
      } else {
        alert("登录失败：" + (data.error || "账号或密码错误"));
      }
    } catch (err) {
      alert("连接门卫失败！报错信息：" + err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ padding: '50px', display: 'flex', justifyContent: 'center' }}>
      <div style={{ border: '1px solid #ddd', padding: '30px', borderRadius: '10px', width: '300px' }}>
        <h2 style={{ textAlign: 'center' }}>管理员登录</h2>
        <form onSubmit={handleLogin}>
          <div style={{ marginBottom: '15px' }}>
            <input 
              style={{ width: '100%', padding: '8px' }}
              type="text" 
              value={acc} 
              onChange={(e) => setAcc(e.target.value)} 
              placeholder="请输入账号"
            />
          </div>
          <div style={{ marginBottom: '20px' }}>
            <input 
              style={{ width: '100%', padding: '8px' }}
              type="password" 
              value={pwd} 
              onChange={(e) => setPwd(e.target.value)} 
              placeholder="请输入密码"
            />
          </div>
          <button 
            type="submit" 
            disabled={loading}
            style={{ width: '100%', padding: '10px', cursor: 'pointer' }}
          >
            {loading ? "正在验证..." : "登录"}
          </button>
        </form>
      </div>
    </div>
  );
}