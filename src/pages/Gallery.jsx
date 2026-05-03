import React from 'react';

export default function Gallery() {
  // 模拟图床数据，未来你要维护自己的图床 JSON
  const mockImages = [
    { id: 1, url: 'https://images.unsplash.com/photo-1472214103451-9374bd1c798e', category: '风景' },
    { id: 2, url: 'https://images.unsplash.com/photo-1542204165-65bf26472b9b', category: '摄影' },
    { id: 3, url: 'https://images.unsplash.com/photo-1517849845537-4d257902454a', category: '宠物' }
  ];

  return (
    <div style={{ padding: '40px', fontFamily: 'sans-serif' }}>
      <h1>🖼️ 个人图床</h1>
      <p style={{ color: '#666' }}>注意：此页面目前展示的是示例库。未来需配置 Worker 的上传接口才能在网页端直传 GitHub。</p>
      
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))', gap: '20px', marginTop: '30px' }}>
        {mockImages.map(img => (
          <div key={img.id} style={{ border: '1px solid #eee', padding: '10px', borderRadius: '8px', background: 'white', boxShadow: '0 2px 5px rgba(0,0,0,0.05)' }}>
            <img src={img.url} style={{ width: '100%', height: '200px', objectFit: 'cover', borderRadius: '4px' }} alt="" />
            <div style={{ marginTop: '10px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ fontSize: '12px', background: '#eee', padding: '3px 8px', borderRadius: '12px' }}>{img.category}</span>
              <a href={img.url} target="_blank" rel="noreferrer" style={{ fontSize: '14px', color: '#3498db', textDecoration: 'none' }}>复制直链</a>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}