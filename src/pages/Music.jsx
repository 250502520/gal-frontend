import React, { useState, useEffect, useRef, useMemo } from 'react';

const WORKER_URL = "https://api.gal.us.kg";

export default function Music() {
  const [allSongs, setAllSongs] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [currentSinger, setCurrentSinger] = useState("全部");
  
  // 歌单数据结构: { "歌单名": ["歌曲ID1", "歌曲ID2"] }
  const [playlists, setPlaylists] = useState(() => {
    const saved = localStorage.getItem('gal_playlists');
    return saved ? JSON.parse(saved) : { "默认收藏": [] };
  });
  
  const [activeTab, setActiveTab] = useState('全部歌曲'); // 当前选中的歌单名
  const [showAddMenu, setShowAddMenu] = useState(null); // 控制添加歌单的悬浮窗
  const audioRef = useRef(null);

  useEffect(() => { fetchMusic(); }, []);
  useEffect(() => {
    localStorage.setItem('gal_playlists', JSON.stringify(playlists));
  }, [playlists]);

  const fetchMusic = async () => {
    try {
      const res = await fetch(`${WORKER_URL}/api/list?type=music`);
      const data = await res.json();
      setAllSongs(data.filter(item => item.type === "audio"));
    } catch (err) { console.error("同步失败", err); }
    finally { setLoading(false); }
  };

  // 核心：计算当前显示的列表
  const displayList = useMemo(() => {
    let list = allSongs;
    if (activeTab !== '全部歌曲') {
      const songIds = playlists[activeTab] || [];
      list = allSongs.filter(s => songIds.includes(s.id));
    }
    return list.filter(s => {
      const matchSearch = s.filename.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          s.singer.toLowerCase().includes(searchQuery.toLowerCase());
      const matchSinger = currentSinger === "全部" || s.singer === currentSinger;
      return matchSearch && matchSinger;
    });
  }, [allSongs, searchQuery, currentSinger, activeTab, playlists]);

  const singers = useMemo(() => ["全部", ...new Set(allSongs.map(s => s.singer))], [allSongs]);

  // 歌单操作逻辑
  const createPlaylist = () => {
    const name = prompt("请输入新歌单名称:");
    if (name && !playlists[name]) {
      setPlaylists({ ...playlists, [name]: [] });
    }
  };

  const deletePlaylist = (name) => {
    if (name === "默认收藏") return alert("默认歌单不能删除");
    if (window.confirm(`确定要删除歌单 [${name}] 吗？`)) {
      const newP = { ...playlists };
      delete newP[name];
      setPlaylists(newP);
      setActiveTab('全部歌曲');
    }
  };

  const addToPlaylist = (songId, playlistName) => {
    const target = playlists[playlistName];
    if (!target.includes(songId)) {
      setPlaylists({ ...playlists, [playlistName]: [...target, songId] });
    }
    setShowAddMenu(null);
  };

  const removeFromPlaylist = (songId) => {
    if (activeTab === '全部歌曲') return;
    const newP = { ...playlists, [activeTab]: playlists[activeTab].filter(id => id !== songId) };
    setPlaylists(newP);
  };

  if (loading) return <div style={{padding:'20px'}}>正在加载库...</div>;

  return (
    <div style={{ maxWidth: '900px', margin: '0 auto', padding: '20px', display: 'flex', gap: '20px' }}>
      
      {/* 左侧：歌单导航栏 */}
      <div style={{ width: '200px', borderRight: '1px solid #eee', paddingRight: '15px' }}>
        <h4 style={{ color: '#999', fontSize: '12px' }}>我的音乐</h4>
        <div onClick={() => setActiveTab('全部歌曲')} style={{ cursor:'pointer', padding:'8px', background: activeTab==='全部歌曲'?'#007bff':'none', color: activeTab==='全部歌曲'?'#fff':'#333', borderRadius:'5px' }}>🌐 全部歌曲</div>
        
        <h4 style={{ color: '#999', fontSize: '12px', marginTop: '20px', display:'flex', justifyContent:'space-between' }}>
          歌单 <span onClick={createPlaylist} style={{cursor:'pointer', color:'#007bff'}}>+</span>
        </h4>
        {Object.keys(playlists).map(name => (
          <div key={name} style={{ display:'flex', justifyContent:'space-between', alignItems:'center', padding:'8px', cursor:'pointer', background: activeTab===name?'#f0f7ff':'none', borderRadius:'5px' }}>
            <span onClick={() => setActiveTab(name)} style={{ flex:1 }}>📁 {name}</span>
            {name !== "默认收藏" && <span onClick={() => deletePlaylist(name)} style={{ fontSize:'12px', color:'#ccc' }}>×</span>}
          </div>
        ))}
      </div>

      {/* 右侧：播放列表区域 */}
      <div style={{ flex: 1 }}>
        <div style={{ background: '#1a1a1a', color: '#fff', padding: '20px', borderRadius: '12px', marginBottom: '20px' }}>
          <h3 style={{ margin: 0 }}>{displayList[currentIndex]?.filename.split('.')[0] || "未播放"}</h3>
          <p style={{ color: '#888' }}>{displayList[currentIndex]?.singer || "-"}</p>
          <audio ref={audioRef} src={displayList[currentIndex]?.url} controls style={{ width: '100%' }} onEnded={() => setCurrentIndex((currentIndex + 1) % displayList.length)} />
        </div>

        <div style={{ display: 'flex', gap: '10px', marginBottom: '15px' }}>
          <input placeholder="搜索歌手或歌名..." value={searchQuery} onChange={e => setSearchQuery(e.target.value)} style={{ flex:1, padding:'8px', borderRadius:'6px', border:'1px solid #ddd' }} />
          <select value={currentSinger} onChange={e => setCurrentSinger(e.target.value)} style={{ padding:'8px', borderRadius:'6px' }}>
            {singers.map(s => <option key={s} value={s}>{s}</option>)}
          </select>
        </div>

        <div style={{ border: '1px solid #eee', borderRadius: '10px', overflow: 'hidden' }}>
          {displayList.map((song, idx) => (
            <div key={song.id} style={{ display:'flex', padding:'12px', borderBottom:'1px solid #f9f9f9', alignItems:'center', background: idx===currentIndex?'#f0f7ff':'none' }}>
              <div onClick={() => setCurrentIndex(idx)} style={{ flex:1, cursor:'pointer' }}>
                <div style={{ fontWeight: idx===currentIndex?'bold':'normal' }}>{song.filename.split('.')[0]}</div>
                <div style={{ fontSize:'12px', color:'#007bff' }}>{song.singer}</div>
              </div>
              
              <div style={{ position: 'relative' }}>
                <button onClick={() => setShowAddMenu(showAddMenu === song.id ? null : song.id)} style={{ background:'none', border:'none', cursor:'pointer' }}>➕</button>
                {activeTab !== '全部歌曲' && <button onClick={() => removeFromPlaylist(song.id)} style={{ background:'none', border:'none', cursor:'pointer', marginLeft:'10px' }}>🗑️</button>}
                
                {showAddMenu === song.id && (
                  <div style={{ position: 'absolute', right: 0, top: '20px', background: '#fff', border: '1px solid #ddd', zIndex: 10, width: '120px', boxShadow: '0 2px 10px rgba(0,0,0,0.1)', borderRadius: '5px' }}>
                    {Object.keys(playlists).map(pName => (
                      <div key={pName} onClick={() => addToPlaylist(song.id, pName)} style={{ padding: '8px', fontSize: '12px', cursor: 'pointer', borderBottom: '1px solid #eee' }}>+ {pName}</div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}