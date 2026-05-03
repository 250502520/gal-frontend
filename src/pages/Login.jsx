import React, { useState } from 'react';

const WORKER_URL = "https://gal-backend.zhangjiaqi20090126.workers.dev";

export default function Login() {
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
        body: JSON.stringify({ account: acc, password: pwd })
      });
      const data = await res.json();
      if (res.ok) {
        localStorage.setItem('gal_token', data.token);
        window.location.href = '/'; 
      } else {
        alert("登录失败：" + (data.error || "请检查账号密码"));
      }
    } catch (err) {
      alert("网络连接失败，请检查 Worker 状态");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ display: 'flex', justifyContent: 'center', marginTop: '100px' }}>
      <form onSubmit={handleLogin} style={{ border: '1px solid #ccc', padding: '20px', borderRadius: '8px' }}>
        <h3>管理员登录</h3>
        <input 
          type="text" 
          value={acc} 
          onChange={(e) => setAcc(e.target.value)} 
          placeholder="账号" 
          style={{ display: 'block', marginBottom: '10px', padding: '8px' }}
        />
        <input 
          type="password" 
          value={pwd} 
          onChange={(e) => setPwd(e.target.value)} 
          placeholder="密码" 
          style={{ display: 'block', marginBottom: '10px', padding: '8px' }}
        />
        <button type="submit" disabled={loading} style={{ width: '100%', padding: '10px' }}>
          {loading ? "验证中..." : "登录"}
        </button>
      </form>
    </div>
  );
}