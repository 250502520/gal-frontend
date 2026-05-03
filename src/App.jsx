import React, { useState, useEffect } from 'react';
import Login from './pages/Login';

function App() {
  const [isLogged, setIsLogged] = useState(false);
  const [domain, setDomain] = useState('');

  useEffect(() => {
    if (localStorage.getItem('gal_token')) setIsLogged(true);
    setDomain(window.location.hostname);
  }, []);

  if (!isLogged) return <Login onLogin={() => setIsLogged(true)} />;

  // 根据你的要求，识别不同子域名
  if (domain.startsWith('yy.')) return <div style={{padding:'20px'}}>这里是音乐播放器子站代码放置区</div>;
  if (domain.startsWith('zh.')) return <div style={{padding:'20px'}}>这里是PDF转换器子站代码放置区</div>;
  if (domain.startsWith('pdf.')) return <div style={{padding:'20px'}}>这里是PDF阅读器子站代码放置区</div>;
  if (domain.startsWith('tc.')) return <div style={{padding:'20px'}}>这里是图床子站代码放置区</div>;
  
  // 默认 zy 主域名
  return (
    <div style={{padding:'20px'}}>
      <h1>主控台 (zy.gal.us.kg)</h1>
      <p>欢迎回来。系统正在运行中。</p>
      <button onClick={() => { localStorage.removeItem('gal_token'); window.location.reload(); }}>退出登录</button>
    </div>
  );
}
export default App;