import React, { useState, useRef } from 'react';

export default function Music() {
  // 这里是你未来的歌单数据库，把你上传好的音乐直链填进 url 里
  const initialPlaylist = [
    { id: 1, title: '测试曲目 1', artist: '未知歌手', url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3', category: '流行' },
    { id: 2, title: '测试曲目 2', artist: '群星', url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3', category: '古典' }
  ];

  const [playlist] = useState(initialPlaylist);
  const [currentIndex, setCurrentIndex] = useState(0);
  const audioRef = useRef(null);

  const playSong = (index) => {
    setCurrentIndex(index);
    setTimeout(() => audioRef.current.play(), 100); // 延迟一点点等文件加载
  };

  const currentSong = playlist[currentIndex];

  return (
    <div style={{ padding: '20px', maxWidth: '900px', margin: '0 auto', fontFamily: 'sans-serif' }}>
      <h1>🎵 专属云端音乐</h1>
      
      <div style={{ display: 'flex', gap: '20px', marginTop: '20px' }}>
        {/* 左侧：播放器 */}
        <div style={{ flex: 1, padding: '30px', background: '#2c3e50', color: 'white', borderRadius: '12px', textAlign: 'center' }}>
          <div style={{ width: '150px', height: '150px', background: '#34495e', margin: '0 auto 20px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '50px' }}>💿</div>
          <h2>{currentSong.title}</h2>
          <p style={{ color: '#bdc3c7', marginBottom: '30px' }}>{currentSong.artist}</p>
          <audio ref={audioRef} src={currentSong.url} controls style={{ width: '100%' }} onEnded={() => playSong((currentIndex + 1) % playlist.length)} />
        </div>

        {/* 右侧：歌单 */}
        <div style={{ width: '350px', border: '1px solid #ddd', borderRadius: '12px', padding: '10px', height: '400px', overflowY: 'auto' }}>
          <h3 style={{ margin: '10px 10px 20px 10px' }}>播放列表</h3>
          {playlist.map((song, idx) => (
            <div key={song.id} 
                 onClick={() => playSong(idx)}
                 style={{ padding: '15px', cursor: 'pointer', borderBottom: '1px solid #eee', background: idx === currentIndex ? '#e8f4fd' : 'white', borderRadius: '8px' }}>
              <div style={{ fontWeight: 'bold', color: '#333' }}>{song.title}</div>
              <div style={{ fontSize: '12px', color: '#888' }}>{song.artist} | {song.category}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}