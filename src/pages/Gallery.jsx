import React, { useState, useEffect } from 'react';

// 修改为你自己的 Worker 地址
const WORKER_URL = "https://gal-backend.zhangjiaqi20090126.workers.dev"; 

export default function Gallery() {
  const [media, setMedia] = useState([]);
  const [loading, setLoading] = useState(false);

  // 这里的 URL 换成你的私有仓库 raw 地址
  const GITHUB_RAW_JSON = "https://raw.githubusercontent.com/250502520/gal-storage/main/gallery_index.json";

  const loadData = () => {
    fetch(`${GITHUB_RAW_JSON}?t=${Date.now()}`) // 加个时间戳防止浏览器缓存
      .then(res => res.json())
      .then(data => setMedia(data))
      .catch(() => setMedia([]));
  };

  useEffect(() => { loadData(); }, []);

  const handleUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setLoading(true);

    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = async () => {
      const base64 = reader.result.split(',')[1];
      const res = await fetch(`${WORKER_URL}/api/upload`, {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': 'Bearer gal_valid_token_888'
        },
        body: JSON.stringify({
          filename: file.name,
          content: base64,
          type: 'image',
          category: '我的上传'
        })
      });
      if (res.ok) {
        alert("上传并索引成功！由于 GitHub CDN 延迟，请一分钟后刷新查看。");
        loadData();
      } else {
        alert("上传失败");
      }
      setLoading(false);
    };
  };

  return (
    <div style={{ padding: '40px', fontFamily: 'sans-serif' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '30px' }}>
        <h1>🖼️ 个人云图床</h1>
        <label style={{ padding: '10px 20px', background: '#3498db', color: 'white', borderRadius: '5px', cursor: 'pointer' }}>
          {loading ? '正在同步至 GitHub...' : '上传新文件'}
          <input type="file" onChange={handleUpload} style={{ display: 'none' }} disabled={loading} />
        </label>
      </div>
      
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '20px' }}>
        {media.map(item => (
          <div key={item.id} style={{ border: '1px solid #eee', borderRadius: '8px', overflow: 'hidden', background: '#fff' }}>
            {item.type === 'video' ? 
              <video src={item.url} style={{ width: '100%', height: '150px', objectFit: 'cover' }} /> :
              <img src={item.url} style={{ width: '100%', height: '150px', objectFit: 'cover' }} alt="" />
            }
            <div style={{ padding: '10px', fontSize: '12px', color: '#666' }}>{item.filename}</div>
          </div>
        ))}
      </div>
    </div>
  );
}