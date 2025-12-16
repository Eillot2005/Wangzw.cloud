import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import Layout from '../../components/Layout';
import { photosApi, Photo } from '../../api/photos';
import { theme } from '../../styles/theme';

export default function PhotoReviewPage() {
  console.log('[PhotoReviewPage] Component mounted');
  const [photos, setPhotos] = useState<Photo[]>([]);
  const [loading, setLoading] = useState(false);

  const loadPhotos = async () => {
    console.log('[PhotoReviewPage] Loading photos...');
    setLoading(true);
    try {
      const data = await photosApi.listPending();
      console.log('[PhotoReviewPage] Photos loaded:', data.length);
      setPhotos(data);
    } catch (err: any) {
      console.error('[PhotoReviewPage] Load pending photos error:', err);
      alert(err.response?.data?.detail || '加载失败');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadPhotos();
  }, []);

  const handleApprove = async (id: number) => {
    if (!confirm('确认通过此照片？')) return;
    try {
      await photosApi.approve(id);
      setPhotos(photos.filter(p => p.id !== id));
    } catch (err: any) {
      alert(err.response?.data?.detail || '操作失败');
    }
  };

  const handleReject = async (id: number) => {
    if (!confirm('确认拒绝此照片？')) return;
    try {
      await photosApi.reject(id);
      setPhotos(photos.filter(p => p.id !== id));
    } catch (err: any) {
      alert(err.response?.data?.detail || '操作失败');
    }
  };

  const getImageUrl = (filename: string) => {
    const apiBaseUrl = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000';
    const token = localStorage.getItem('token');
    return `${apiBaseUrl}/photos/${filename}?token=${token}`;
  };

  return (
    <Layout role="ADMIN">
      <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '20px' }}>
        <h1 style={{ marginBottom: '20px', color: theme.colors.textPrimary }}>照片审核</h1>
        
        {loading ? (
          <div>加载中...</div>
        ) : photos.length === 0 ? (
          <div style={{ color: theme.colors.textSecondary }}>暂无待审核照片</div>
        ) : (
          <div style={{ 
            display: 'grid', 
            gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', 
            gap: '20px' 
          }}>
            {photos.map(photo => (
              <motion.div
                key={photo.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                style={{
                  background: theme.colors.surface,
                  borderRadius: theme.borderRadius.medium,
                  padding: '15px',
                  boxShadow: theme.colors.shadow,
                  border: `1px solid ${theme.colors.border}`,
                }}
              >
                <div style={{ 
                  height: '200px', 
                  marginBottom: '15px', 
                  borderRadius: theme.borderRadius.small,
                  overflow: 'hidden',
                  background: '#000'
                }}>
                  <img 
                    src={getImageUrl(photo.filename)} 
                    alt={photo.filename}
                    style={{ 
                      width: '100%', 
                      height: '100%', 
                      objectFit: 'contain' 
                    }} 
                  />
                </div>
                <div style={{ marginBottom: '10px', fontSize: '0.9em', color: theme.colors.textSecondary }}>
                  <div>ID: {photo.id}</div>
                  <div>上传者ID: {photo.uploader_id}</div>
                  <div>时间: {new Date(photo.created_at).toLocaleString()}</div>
                </div>
                <div style={{ display: 'flex', gap: '10px' }}>
                  <button
                    onClick={() => handleApprove(photo.id)}
                    style={{
                      flex: 1,
                      padding: '8px',
                      background: theme.colors.success,
                      color: 'white',
                      border: 'none',
                      borderRadius: theme.borderRadius.small,
                      cursor: 'pointer'
                    }}
                  >
                    通过
                  </button>
                  <button
                    onClick={() => handleReject(photo.id)}
                    style={{
                      flex: 1,
                      padding: '8px',
                      background: theme.colors.error,
                      color: 'white',
                      border: 'none',
                      borderRadius: theme.borderRadius.small,
                      cursor: 'pointer'
                    }}
                  >
                    拒绝
                  </button>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </Layout>
  );
}
