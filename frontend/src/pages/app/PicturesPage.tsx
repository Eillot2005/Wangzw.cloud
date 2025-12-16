import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Masonry from 'react-masonry-css';
import Layout from '../../components/Layout';
import ParticlesBackground from '../../components/ParticlesBackground';
import { picturesApi, PictureInfo } from '../../api/pictures';
import { theme } from '../../styles/theme';
import './PicturesPage.css';

export default function PicturesPage() {
  const [pictures, setPictures] = useState<PictureInfo[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedImage, setSelectedImage] = useState<PictureInfo | null>(null);

  const loadPictures = async () => {
    setLoading(true);
    try {
      const data = await picturesApi.list();
      setPictures(data);
    } catch (err: any) {
      console.error('Load pictures error:', err);
      alert(err.response?.data?.detail || '加载失败');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadPictures();
  }, []);

  const getImageUrl = (filename: string) => {
    const apiBaseUrl = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000';
    const token = localStorage.getItem('token');
    return `${apiBaseUrl}/pictures/${filename}?token=${token}`;
  };

  const breakpointColumns = {
    default: 3,
    1100: 2,
    700: 1,
  };

  return (
    <Layout role="FRIEND">
      <ParticlesBackground />
      <div style={{
        maxWidth: '1200px',
        margin: '0 auto',
        position: 'relative',
        zIndex: 1,
      }}>
        <motion.div
          initial={{ opacity: 0, y: -50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, type: "spring" }}
        >
          <h1 style={{
            marginBottom: '40px',
            textAlign: 'center',
            fontSize: '48px',
            fontWeight: '900',
            background: 'linear-gradient(45deg, #ff0066, #ff6b9d, #ffcc00)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text',
            filter: 'drop-shadow(0 4px 8px rgba(255, 105, 180, 0.4))',
            letterSpacing: '2px',
          }}>
            <span className="heart-icon" style={{ display: 'inline-block', animation: 'pulse 1.5s infinite' }}>💖</span> 
            你的❤美好 
            <span className="heart-icon" style={{ display: 'inline-block', animation: 'pulse 1.5s infinite' }}>💖</span>
          </h1>
        </motion.div>

        {loading ? (
          <div style={{
            textAlign: 'center',
            padding: '60px',
            color: theme.colors.textSecondary,
          }}>
            加载中...
          </div>
        ) : pictures.length === 0 ? (
          <div style={{
            textAlign: 'center',
            padding: '60px',
            background: 'rgba(15, 25, 50, 0.6)',
            backdropFilter: 'blur(10px)',
            borderRadius: theme.borderRadius.large,
            boxShadow: theme.colors.shadow,
            border: `1px solid ${theme.colors.border}`,
          }}>
            <div style={{ fontSize: '48px', marginBottom: '16px' }}>📸</div>
            <div style={{ color: theme.colors.textSecondary }}>
              还没有照片，快来添加美好的回忆吧~
            </div>
          </div>
        ) : (
          <div style={{ 
            display: 'grid', 
            gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))', 
            gap: '20px',
            padding: '20px'
          }}>
            {pictures.map((picture, index) => (
              <motion.div
                key={picture.name}
                initial={{ opacity: 0, scale: 0.8, y: 50, boxShadow: "0 0 0 0 rgba(0,0,0,0)" }}
                animate={{ opacity: 1, scale: 1, y: 0, boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1)" }}
                transition={{ 
                  delay: index * 0.1,
                  type: "spring",
                  stiffness: 100
                }}
                whileHover={{ 
                  scale: 1.05,
                  rotate: Math.random() * 4 - 2,
                  zIndex: 10,
                  boxShadow: "0 25px 50px -12px rgba(255, 105, 180, 0.6)" 
                }}
                className="picture-card romantic-card"
                onClick={() => setSelectedImage(picture)}
                style={{ 
                  cursor: 'pointer',
                  background: 'rgba(255, 255, 255, 0.1)',
                  backdropFilter: 'blur(12px)',
                  border: '1px solid rgba(255, 255, 255, 0.2)',
                  borderRadius: '20px',
                  overflow: 'hidden',
                  padding: '10px',
                  height: '350px', // Fixed height for card
                  display: 'flex',
                  flexDirection: 'column',
                }}
              >
                <div className="picture-image-container" style={{ 
                  borderRadius: '15px', 
                  overflow: 'hidden', 
                  flex: 1, 
                  position: 'relative',
                  width: '100%'
                }}>
                  <img
                    src={getImageUrl(picture.name)}
                    alt={picture.name || '照片'}
                    className="picture-image"
                    loading="lazy"
                    style={{ 
                      width: '100%', 
                      height: '100%', 
                      objectFit: 'cover', // Ensure uniform size/crop
                      display: 'block' 
                    }}
                  />
                  <div className="picture-overlay">
                    <div className="heart-icon" style={{ fontSize: '48px', filter: 'drop-shadow(0 0 10px rgba(255,255,255,0.8))' }}>❤️</div>
                  </div>
                </div>
                <div className="picture-date" style={{ 
                  color: 'rgba(255,255,255,0.8)', 
                  marginTop: '10px', 
                  textAlign: 'right', 
                  fontSize: '0.9em',
                  height: '20px'
                }}>
                  {picture.created_at ? new Date(picture.created_at * 1000).toLocaleDateString('zh-CN') : ''}
                </div>
              </motion.div>
            ))}
          </div>
        )}

        {/* Full screen modal */}
        <AnimatePresence>
          {selectedImage && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedImage(null)}
              style={{
                position: 'fixed',
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                background: 'rgba(0, 0, 0, 0.9)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                zIndex: 9999,
                padding: '20px',
                backdropFilter: 'blur(10px)',
              }}
            >
              <motion.div
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.8, opacity: 0 }}
                onClick={(e) => e.stopPropagation()}
                style={{
                  maxWidth: '90vw',
                  maxHeight: '90vh',
                  position: 'relative',
                }}
              >
                <img
                  src={getImageUrl(selectedImage.name)}
                  alt={selectedImage.name || '照片'}
                  style={{
                    maxWidth: '100%',
                    maxHeight: '90vh',
                    borderRadius: theme.borderRadius.large,
                    boxShadow: '0 20px 60px rgba(255, 107, 157, 0.5)',
                  }}
                />
                <button
                  onClick={() => setSelectedImage(null)}
                  style={{
                    position: 'absolute',
                    top: '-40px',
                    right: '0',
                    background: theme.colors.gradientPink,
                    color: '#fff',
                    border: 'none',
                    borderRadius: '50%',
                    width: '40px',
                    height: '40px',
                    fontSize: '24px',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    boxShadow: '0 4px 15px rgba(255, 107, 157, 0.5)',
                  }}
                >
                  ×
                </button>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </Layout>
  );
}
