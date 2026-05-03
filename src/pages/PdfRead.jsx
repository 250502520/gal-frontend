import React, { useState } from 'react';

export default function PdfRead() {
  // 测试用公共 PDF 链接
  const [pdfUrl, setPdfUrl] = useState('https://raw.githubusercontent.com/mozilla/pdf.js/ba2edeae/web/compressed.tracemonkey-pldi-09.pdf');
  const [inputUrl, setInputUrl] = useState('');

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100vh', fontFamily: 'sans-serif' }}>
      <div style={{ padding: '15px', background: '#f5f6fa', borderBottom: '1px solid #ddd', display: 'flex', gap: '10px' }}>
        <h2 style={{ margin: '0 20px 0 0', lineHeight: '36px' }}>📖 PDF 阅览</h2>
        <input 
          placeholder="输入 PDF 的直链地址..." 
          value={inputUrl}
          onChange={(e) => setInputUrl(e.target.value)}
          style={{ width: '400px', padding: '8px', borderRadius: '4px', border: '1px solid #ccc' }} 
        />
        <button 
          onClick={() => { if(inputUrl) setPdfUrl(inputUrl) }}
          style={{ padding: '8px 20px', background: '#3498db', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>
          打开阅读
        </button>
      </div>

      <div style={{ flex: 1, background: '#525659' }}>
        <iframe 
          src={`${pdfUrl}#view=FitH`} 
          style={{ width: '100%', height: '100%', border: 'none' }} 
          title="PDF Viewer"
        />
      </div>
    </div>
  );
}