import React from 'react';

export default function Home() {
  const cardStyle = {
    display: 'block', padding: '20px', margin: '10px', 
    border: '1px solid #ddd', borderRadius: '8px', 
    textDecoration: 'none', color: '#333', background: 'white'
  };

  return (
    <div style={{ padding: '40px', maxWidth: '800px', margin: '0 auto', fontFamily: 'sans-serif' }}>
      <h1 style={{ textAlign: 'center', color: '#2c3e50' }}>Gal System 控制中心</h1>
      <p style={{ textAlign: 'center', color: '#7f8c8d', marginBottom: '40px' }}>欢迎回来，超级管理员。</p>
      
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
        <a href="https://yy.gal.us.kg" style={cardStyle}>
          <h2 style={{ margin: '0 0 10px 0', color: '#3498db' }}>🎵 音乐电台</h2>
          <p style={{ margin: 0, color: '#666' }}>管理你的专属歌单与歌手库</p>
        </a>
        <a href="https://tc.gal.us.kg" style={cardStyle}>
          <h2 style={{ margin: '0 0 10px 0', color: '#e67e22' }}>🖼️ 个人图床</h2>
          <p style={{ margin: 0, color: '#666' }}>图片与视频存放与分类展示</p>
        </a>
        <a href="https://pdf.gal.us.kg" style={cardStyle}>
          <h2 style={{ margin: '0 0 10px 0', color: '#2ecc71' }}>📖 PDF 阅读</h2>
          <p style={{ margin: 0, color: '#666' }}>沉浸式文档与漫画阅读体验</p>
        </a>
        <a href="https://zh.gal.us.kg" style={cardStyle}>
          <h2 style={{ margin: '0 0 10px 0', color: '#9b59b6' }}>🗜️ PDF 转换</h2>
          <p style={{ margin: 0, color: '#666' }}>纯前端无损将图片打包为 PDF</p>
        </a>
      </div>

      <div style={{ textAlign: 'center', marginTop: '50px' }}>
        <button onClick={() => { localStorage.removeItem('gal_token'); window.location.reload(); }} 
                style={{ padding: '10px 20px', background: '#e74c3c', color: 'white', border: 'none', borderRadius: '5px', cursor: 'pointer' }}>
          退出登录并锁屏
        </button>
      </div>
    </div>
  );
}