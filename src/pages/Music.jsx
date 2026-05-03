import React, { useState, useEffect, useRef } from 'react';

const WORKER_URL = "https://gal-backend.zhangjiaqi20090126.workers.dev/"; 

export default function Music() {
  const [playlist, setPlaylist] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  const audioRef = useRef(null);

  useEffect(() => {
    const fetchMusic = async () => {
      try {
        const res = await fetch(`${WORKER_URL}/api/list?type=music`, {
          headers: { 'Authorization': 'Bearer gal_valid_token_888' }
        });
        const data = await res.json();
        setPlaylist(data);
      } catch (err) {
        console.error("音乐列表获取失败:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchMusic();
  }, []);

  const playSong = (index) => {
    setCurrentIndex(index);
    setTimeout(() => audioRef.current.play(), 100);
  };

  if (loading) return <div style={{ padding: '50px', textAlign: 'center' }}>正在同步歌库...</div>;
  if (playlist.length === 0) return <div style={{ padding: '50px', textAlign: 'center' }}>歌库空空如也，快去 GitHub 传歌吧！</div>;

  const currentSong = playlist[currentIndex];

  return (
    <div style={{ padding: '20px', maxWidth: '900px', margin: '0 auto', fontFamily: 'sans-serif' }}>
      <h1>🎵 自动同步电台</h1>
      <div style={{ display: 'flex', gap: '20px', marginTop: '20px' }}>
        <div style={{ flex: 1, padding: '30px', background: '#2c3e50', color: 'white', borderRadius: '12px', textAlign: 'center' }}>
          <div style={{ width: '120px', height: '120px', background: '#34495e', margin: '0 auto 20px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '40px' }}>📻</div>
          <h3>{currentSong.filename}</h3>
          <audio ref={audioRef} src={currentSong.url} controls style={{ width: '100%', marginTop: '20px' }} onEnded={() => playSong((currentIndex + 1) % playlist.length)} />
        </div>
        <div style={{ width: '350px', border: '1px solid #ddd', borderRadius: '12px', height: '400px', overflowY: 'auto' }}>
          {playlist.map((song, idx) => (
            <div key={song.id} onClick={() => playSong(idx)} style={{ padding: '15px', cursor: 'pointer', borderBottom: '1px solid #eee', background: idx === currentIndex ? '#e8f4fd' : 'white' }}>
              <div style={{ fontWeight: 'bold', fontSize: '14px' }}>{song.filename}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}