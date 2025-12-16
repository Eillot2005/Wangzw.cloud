import { useState } from 'react';
import Layout from '../../components/Layout';
import { externalApi } from '../../api/external';

export default function ExternalApiPage() {
  const [prompt, setPrompt] = useState('');
  const [response, setResponse] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async () => {
    if (!prompt.trim()) {
      alert('请输入提示词');
      return;
    }

    setLoading(true);
    setError('');
    setResponse('');

    try {
      const result = await externalApi.call({ prompt });
      setResponse(result.text);
    } catch (err: any) {
      if (err.response?.status === 429) {
        setError('请求过于频繁，请稍后再试（限制：20次/分钟）');
      } else {
        setError(err.response?.data?.detail || '调用失败');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <Layout role="FRIEND">
      <div style={{ maxWidth: '800px', margin: '0 auto' }}>
        <h1 style={{ 
          marginBottom: '30px',
          color: '#fff',
          textShadow: '0 2px 4px rgba(0,0,0,0.3)'
        }}>AI 助手</h1>

        <div style={{
          backgroundColor: 'rgba(255, 255, 255, 0.1)',
          backdropFilter: 'blur(10px)',
          padding: '20px',
          borderRadius: '16px',
          marginBottom: '20px',
          boxShadow: '0 8px 32px rgba(0,0,0,0.2)',
          border: '1px solid rgba(255, 255, 255, 0.1)'
        }}>
          <p style={{ marginBottom: '15px', color: 'rgba(255, 255, 255, 0.7)', fontSize: '14px' }}>
            向 AI 提问，获取智能回复。限制：每分钟最多 20 次请求。
          </p>

          <textarea
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            placeholder="输入你的问题或提示词..."
            rows={5}
            style={{
              width: '100%',
              padding: '12px',
              border: '1px solid rgba(255, 255, 255, 0.2)',
              borderRadius: '8px',
              fontSize: '14px',
              resize: 'vertical',
              boxSizing: 'border-box',
              marginBottom: '15px',
              background: 'rgba(0, 0, 0, 0.2)',
              color: 'white',
              outline: 'none'
            }}
          />

          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontSize: '12px', color: 'rgba(255, 255, 255, 0.5)' }}>
              {prompt.length} / 5000
            </span>
            <button
              onClick={handleSubmit}
              disabled={loading}
              style={{
                padding: '12px 32px',
                backgroundColor: loading ? 'rgba(149, 165, 166, 0.5)' : '#ff6b9d',
                color: 'white',
                border: 'none',
                borderRadius: '8px',
                cursor: loading ? 'not-allowed' : 'pointer',
                fontSize: '14px',
                transition: 'all 0.3s ease',
                boxShadow: '0 4px 15px rgba(255, 107, 157, 0.3)'
              }}
            >
              {loading ? '处理中...' : '提交'}
            </button>
          </div>
        </div>

        {error && (
          <div style={{
            backgroundColor: '#fee',
            padding: '15px',
            borderRadius: '8px',
            color: '#c33',
            marginBottom: '20px'
          }}>
            {error}
          </div>
        )}

        {response && (
          <div style={{
            backgroundColor: 'white',
            padding: '20px',
            borderRadius: '8px',
            boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
          }}>
            <h3 style={{ marginTop: 0, marginBottom: '15px', color: '#2c3e50' }}>
              AI 回复：
            </h3>
            <div style={{
              padding: '15px',
              backgroundColor: '#f8f9fa',
              borderRadius: '4px',
              whiteSpace: 'pre-wrap',
              lineHeight: '1.6',
              color: '#34495e'
            }}>
              {response}
            </div>
          </div>
        )}
      </div>
    </Layout>
  );
}
