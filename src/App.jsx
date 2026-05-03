import React, { useState, useEffect } from 'react';
import Login from './pages/Login';

// 导入刚刚创建的五个房间组件
import Home from './pages/Home';
import Music from './pages/Music';
import PdfConvert from './pages/PdfConvert';
import PdfRead from './pages/PdfRead';
import Gallery from './pages/Gallery';

function App() {
  const [isLogged, setIsLogged] = useState(false);
  const [domain, setDomain] = useState('');

  useEffect(() => {
    if (localStorage.getItem('gal_token')) setIsLogged(true);
    setDomain(window.location.hostname);
  }, []);

  if (!isLogged) return <Login onLogin={() => setIsLogged(true)} />;

  // 核心路由：通过域名的开头来判断加载哪个页面
  if (domain.startsWith('yy.')) return <Music />;
  if (domain.startsWith('zh.')) return <PdfConvert />;
  if (domain.startsWith('pdf.')) return <PdfRead />;
  if (domain.startsWith('tc.')) return <Gallery />;
  
  // 默认主控台 zy.gal.us.kg
  return <Home />;
}

export default App;