import React, { useState, useEffect } from 'react';

// 修改为你自己的 Worker 地址
const WORKER_URL = "https://gal-backend.zhangjiaqi20090126.workers.dev"; 

export default function Gallery() {
  const [media, setMedia] = useState([]);
  const [loading, setLoading] = useState(true);

  // 这就是你要找的 useEffect 部分，它负责在页面打开时“抓取”数据
  useEffect(() => {
    const loadData = async () => {
      try {
        const res = await fetch(`${WORKER_URL}/api/list?type=image`, {
          headers: { 'Authorization': 'Bearer gal_valid_token_888' }
        });
        const data = await res.json();
        setMedia(data);
      } catch (err) {
        console.error("图床加载失败:", err);
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, []);

  return (
    <div style={{ padding: '40px', fontFamily: 'sans-serif' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h1>🖼️ 个人云图床 (自动同步)</h1>
        <p style={{ color: '#666' }}>{loading ? '正在扫描 GitHub 仓库...' : `共找到 ${media.length} 个文件`}</p>
      </div>
      
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '20px', marginTop: '30px' }}>
        {media.map(item => (
          <div key={item.id} style={{ border: '1px solid #eee', borderRadius: '8px', overflow: 'hidden', background: '#fff', boxShadow: '0 2px 4px rgba(0,0,0,0.1)' }}>
            <img src={item.url} style={{ width: '100%', height: '160px', objectFit: 'cover' }} alt="" />
            <div style={{ padding: '10px' }}>
              <div style={{ fontSize: '12px', color: '#333', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{item.filename}</div>
              <a href={item.url} target="_blank" rel="noreferrer" style={{ fontSize: '11px', color: '#3498db', textDecoration: 'none', marginTop: '5px', display: 'inline-block' }}>打开直链</a>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}