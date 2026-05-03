import React, { useState } from 'react';
import { jsPDF } from 'jspdf';

export default function PdfConvert() {
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(false);

  const handleSelect = (e) => {
    const files = Array.from(e.target.files);
    const urls = files.map(f => URL.createObjectURL(f));
    setImages(prev => [...prev, ...urls]);
  };

  const generate = async () => {
    if (images.length === 0) return;
    setLoading(true);
    try {
      const pdf = new jsPDF('p', 'mm', 'a4');
      const pdfW = pdf.internal.pageSize.getWidth();
      const pdfH = pdf.internal.pageSize.getHeight();

      for (let i = 0; i < images.length; i++) {
        if (i > 0) pdf.addPage();
        const img = new Image();
        img.src = images[i];
        await new Promise(r => img.onload = r);
        
        const ratio = Math.min(pdfW / img.width, pdfH / img.height);
        const drawW = img.width * ratio;
        const drawH = img.height * ratio;
        const x = (pdfW - drawW) / 2;
        const y = (pdfH - drawH) / 2;
        
        pdf.addImage(img, 'JPEG', x, y, drawW, drawH);
      }
      pdf.save('Gal_Converted.pdf');
    } catch (err) {
      alert("转换出错：" + err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ padding: '40px', maxWidth: '800px', margin: '0 auto', fontFamily: 'sans-serif' }}>
      <h1>🗜️ 图片转 PDF 工具</h1>
      <div style={{ display: 'flex', gap: '15px', marginBottom: '20px', marginTop: '20px' }}>
        <label style={{ padding: '10px 20px', background: '#2ecc71', color: 'white', borderRadius: '5px', cursor: 'pointer' }}>
          选择本地图片
          <input type="file" multiple accept="image/*" onChange={handleSelect} style={{ display: 'none' }} />
        </label>
        {images.length > 0 && (
          <>
            <button onClick={() => setImages([])} style={{ padding: '10px 20px', background: '#e74c3c', color: 'white', border: 'none', borderRadius: '5px', cursor: 'pointer' }}>清空</button>
            <button onClick={generate} disabled={loading} style={{ padding: '10px 20px', background: '#3498db', color: 'white', border: 'none', borderRadius: '5px', cursor: loading ? 'wait' : 'pointer' }}>
              {loading ? '正在拼命生成...' : '下载最终 PDF'}
            </button>
          </>
        )}
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '10px', background: '#f5f5f5', padding: '20px', borderRadius: '8px', minHeight: '200px' }}>
        {images.length === 0 ? <p style={{ gridColumn: 'span 4', textAlign: 'center', color: '#999' }}>暂未选择图片</p> : 
          images.map((src, idx) => (
            <img key={idx} src={src} style={{ width: '100%', height: '150px', objectFit: 'cover', borderRadius: '4px', border: '1px solid #ccc' }} alt="" />
          ))
        }
      </div>
    </div>
  );
}