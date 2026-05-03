import React, { useState, useEffect } from 'react';

const WORKER_URL = "https://gal-backend.zhangjiaqi20090126.workers.dev";

export default function Gallery() {
  const [media, setMedia] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      try {
        const res = await fetch(`${WORKER_URL}/api/list?type=image`);
        const data = await res.json();
        setMedia(data);
      } catch (err) {
        console.error("加载失败", err);
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, []);

  return (
    <div style={{ padding: '30px' }}>
      <h1>🖼️ 自动同步图床</h1>
      {loading ? <p>正在从 GitHub 仓库获取最新图片...</p> : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))', gap: '15px' }}>
          {media.map(item => (
            <div key={item.id} style={{ borderRadius: '8px', overflow: 'hidden', border: '1px solid #ddd' }}>
              <img src={item.url} style={{ width: '100%', height: '150px', objectFit: 'cover' }} alt="" />
              <div style={{ padding: '8px', fontSize: '12px', background: '#fff' }}>{item.filename}</div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}