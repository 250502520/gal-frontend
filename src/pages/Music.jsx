import React, { useState, useEffect, useRef, useMemo } from 'react';

const WORKER_URL = "https://gal-backend.zhangjiaqi20090126.workers.dev";

export default function Music() {
  const [allSongs, setAllSongs] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [playMode, setPlayMode] = useState('list-loop');
  const [currentSinger, setCurrentSinger] = useState("全部");
  
  // 收藏夹与自定义歌单数据（存放在本地浏览器）
  const [favorites, setFavorites] = useState(JSON.parse(localStorage.getItem('gal_fav') || '[]'));
  const [viewMode, setViewMode] = useState('all'); // all, fav

  const audioRef = useRef(null);

  useEffect(() => {
    fetchMusic();
  }, []);

  const fetchMusic = async () => {
    try {
      const res = await fetch(`${WORKER_URL}/api/list?type=music`);
      const data = await res.json();
      setAllSongs(data.filter(item => item.type === "audio"));
    } catch (err) {
      console.error("同步失败", err);
    } finally {
      setLoading(false);
    }
  };

  // 核心逻辑：决定当前显示的列表
  // 核心逻辑：决定当前显示的列表（增强搜索功能）
const displayList = useMemo(() => {
  let list = allSongs;
  
  // 1. 如果是在收藏夹视图，先过滤出收藏歌曲
  if (viewMode === 'fav') {
    list = allSongs.filter(s => favorites.includes(s.id));
  }

  // 2. 综合搜索：支持 歌名、歌手、甚至 路径 搜索
  const query = searchQuery.toLowerCase().trim();
  
  return list.filter(s => {
    // 检查歌手名是否包含关键词
    const matchSinger = s.singer.toLowerCase().includes(query);
    // 检查文件名是否包含关键词
    const matchFilename = s.filename.toLowerCase().includes(query);
    // 检查下拉框选中的歌手分类（精确分类）
    const matchCategory = currentSinger === "全部" || s.singer === currentSinger;

    // 逻辑：(歌名匹配 OR 歌手匹配) AND 分类匹配
    return (matchSinger || matchFilename) && matchCategory;
  });
}, [allSongs, searchQuery, currentSinger, viewMode, favorites]);

  // 歌手分类（根据文件夹自动生成）
  const singers = useMemo(() => {
    const s = new Set(allSongs.map(item => item.singer));
    return ["全部", ...Array.from(s)];
  }, [allSongs]);

  // 切换收藏状态
  const toggleFavorite = (id) => {
    const newFavs = favorites.includes(id) ? favorites.filter(f => f !== id) : [...favorites, id];
    setFavorites(newFavs);
    localStorage.setItem('gal_fav', JSON.stringify(newFavs));
  };

  const handleNext = () => {
    if (playMode === 'single-loop') {
      audioRef.current.currentTime = 0;
      audioRef.current.play();
    } else {
      const nextIndex = playMode === 'random' 
        ? Math.floor(Math.random() * displayList.length) 
        : (currentIndex + 1) % displayList.length;
      setCurrentIndex(nextIndex);
    }
  };

  if (loading) return <div style={{padding: '20px'}}>正在拉取乐库...</div>;

  return (
    <div style={{ maxWidth: '800px', margin: '0 auto', padding: '20px' }}>
      {/* 1. 当前播放卡片 */}
      <div style={{ background: '#333', color: '#fff', padding: '20px', borderRadius: '15px', marginBottom: '20px' }}>
        <h2 style={{ margin: 0 }}>{displayList[currentIndex]?.filename.split('.')[0] || "未在播放"}</h2>
        <p style={{ opacity: 0.7 }}>{displayList[currentIndex]?.singer || "-"}</p>
        <audio ref={audioRef} src={displayList[currentIndex]?.url} onEnded={handleNext} controls style={{ width: '100%', marginTop: '10px' }} />
        <div style={{ marginTop: '10px', display: 'flex', justifyContent: 'space-between' }}>
            <button onClick={() => setPlayMode(p => (p==='random'?'list-loop':'random'))} style={{background:'none', color:'#fff', border:'1px solid #555', padding:'4px 8px', borderRadius:'4px'}}>
                {playMode === 'random' ? '🔀 随机' : '🔁 循环'}
            </button>
            <button onClick={() => toggleFavorite(displayList[currentIndex]?.id)} style={{background:'none', border:'none', fontSize:'20px', cursor:'pointer'}}>
                {favorites.includes(displayList[currentIndex]?.id) ? '❤️' : '🤍'}
            </button>
        </div>
      </div>

      {/* 2. 导航栏 */}
      <div style={{ display: 'flex', gap: '10px', marginBottom: '20px' }}>
        <button onClick={() => setViewMode('all')} style={{ flex:1, padding:'10px', background: viewMode==='all'?'#007bff':'#eee', color: viewMode==='all'?'#fff':'#000', border:'none', borderRadius:'8px' }}>所有歌曲</button>
        <button onClick={() => setViewMode('fav')} style={{ flex:1, padding:'10px', background: viewMode==='fav'?'#ff4757':'#eee', color: viewMode==='fav'?'#fff':'#000', border:'none', borderRadius:'8px' }}>我的收藏 ({favorites.length})</button>
      </div>

      {/* 3. 搜索与筛选 */}
      <div style={{ display: 'flex', gap: '10px', marginBottom: '15px' }}>
        <input placeholder="搜索内容..." value={searchQuery} onChange={e => setSearchQuery(e.target.value)} style={{ flex:1, padding:'8px', borderRadius:'5px', border:'1px solid #ddd' }} />
        <select value={currentSinger} onChange={e => setCurrentSinger(e.target.value)} style={{ padding:'8px', borderRadius:'5px' }}>
          {singers.map(s => <option key={s} value={s}>{s}</option>)}
        </select>
      </div>

      {/* 4. 歌曲列表 */}
      <div style={{ background: '#fff', borderRadius: '10px', border: '1px solid #eee', overflow: 'hidden' }}>
        {displayList.map((song, idx) => (
          <div key={song.id} style={{ display:'flex', padding:'12px', borderBottom:'1px solid #f9f9f9', background: idx===currentIndex?'#f0f7ff':'none', alignItems:'center' }}>
            <div onClick={() => setCurrentIndex(idx)} style={{ flex:1, cursor:'pointer' }}>
              <div style={{ fontWeight: idx===currentIndex?'bold':'normal' }}>{song.filename.split('.')[0]}</div>
              <div style={{ fontSize:'12px', color:'#999' }}>{song.singer}</div>
            </div>
            <button onClick={() => toggleFavorite(song.id)} style={{ background:'none', border:'none', cursor:'pointer' }}>
              {favorites.includes(song.id) ? '❤️' : '🤍'}
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}