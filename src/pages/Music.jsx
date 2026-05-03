import React, { useState, useEffect, useRef } from 'react';

// 改为你真实的 Worker 地址，末尾不要加 /
const WORKER_URL = "https://gal-backend.zhangjiaqi20090126.workers.dev"; 

export default function Music() {
  const [playlist, setPlaylist] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  const audioRef = useRef(null);

  useEffect(() => {
    const fetchMusic = async () => {
      try {
        const res = await fetch(`${WORKER_URL}/api/list?type=music`);
        const data = await res.json();
        // 过滤出只有音频的文件
        const musicOnly = data.filter(item => item.type === "audio");
        setPlaylist(musicOnly);
      } catch (err) {
        console.error("音乐同步失败:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchMusic();
  }, []);

  const playSong = (index) => {
    setCurrentIndex(index);
    // 延迟播放以确保 DOM 更新
    setTimeout(() => {
      if(audioRef.current) audioRef.current.play();
    }, 150);
  };

  if (loading) return <div style={{ padding: '50px', textAlign: 'center' }}>正在同步私有歌库...</div>;
  if (playlist.length === 0) return <div style={{ padding: '50px', textAlign: 'center' }}>未发现有效音频文件</div>;

  const currentSong = playlist[currentIndex];

  return (
    <div style={{ padding: '20px', maxWidth: '800px', margin: '0 auto', fontFamily: 'sans-serif' }}>
      <h2 style={{ textAlign: 'center', marginBottom: '30px' }}>🎵 个人全自动电台</h2>
      
      <div style={{ background: '#f9f9f9', borderRadius: '15px', padding: '20px', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}>
        <div style={{ textAlign: 'center', marginBottom: '20px' }}>
          <div style={{ fontSize: '60px' }}>📻</div>
          <h3 style={{ margin: '10px 0' }}>{currentSong.filename}</h3>
        </div>

        <audio 
          ref={audioRef} 
          src={currentSong.url} 
          controls 
          style={{ width: '100%' }} 
          onEnded={() => playSong((currentIndex + 1) % playlist.length)} 
        />

        <div style={{ marginTop: '20px', borderTop: '1px solid #eee', paddingTop: '10px' }}>
          <p style={{ fontSize: '14px', color: '#666' }}>待播列表 ({playlist.length})：</p>
          <div style={{ maxHeight: '200px', overflowY: 'auto' }}>
            {playlist.map((song, idx) => (
              <div 
                key={song.id} 
                onClick={() => playSong(idx)} 
                style={{ 
                  padding: '10px', 
                  cursor: 'pointer', 
                  borderRadius: '5px',
                  background: idx === currentIndex ? '#e3f2fd' : 'transparent',
                  color: idx === currentIndex ? '#1976d2' : '#333',
                  marginBottom: '5px'
                }}
              >
                {idx + 1}. {song.filename}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}