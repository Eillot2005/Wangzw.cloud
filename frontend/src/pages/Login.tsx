import { useState, FormEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { authApi } from '../api/auth';
import ParticlesBackground from '../components/ParticlesBackground';
import { theme } from '../styles/theme';

export default function Login() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    setError('');
    setLoading(true);

    try {
      const response = await authApi.login({ username, password });
      
      localStorage.setItem('token', response.access_token);
      localStorage.setItem('role', response.role);
      localStorage.setItem('username', username);
      
      // Redirect based on role (backend returns uppercase: "ADMIN" or "FRIEND")
      if (response.role === 'ADMIN') {
        navigate('/admin');
      } else if (response.role === 'FRIEND') {
        navigate('/app');
      }
    } catch (err: any) {
      setError(err.response?.data?.detail || '登录失败，请检查用户名和密码');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      background: theme.colors.background,
      position: 'relative',
      overflow: 'hidden',
    }}>
      <ParticlesBackground />
      
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        style={{
          background: theme.colors.card,
          padding: '48px',
          borderRadius: theme.borderRadius.large,
          boxShadow: theme.colors.shadow,
          width: '100%',
          maxWidth: '420px',
          margin: '20px',
          border: `1px solid ${theme.colors.border}`,
          position: 'relative',
          zIndex: 1,
        }}
      >
        <motion.div
          initial={{ y: -20 }}
          animate={{ y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <h1 style={{
            marginBottom: '12px',
            textAlign: 'center',
            fontSize: '32px',
            background: theme.colors.gradientPink,
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text',
            fontWeight: 700,
          }}>
            <span className="heart-icon">💕</span> 欢迎回来 <span className="heart-icon">💕</span>
          </h1>
          <p style={{
            textAlign: 'center',
            color: theme.colors.textSecondary,
            marginBottom: '32px',
            fontSize: '14px',
          }}>
            Gifted with ❤️ to you
          </p>
        </motion.div>

        <form onSubmit={handleSubmit}>
          <motion.div
            initial={{ x: -20, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: 0.3 }}
            style={{ marginBottom: '20px' }}
          >
            <label style={{
              display: 'block',
              marginBottom: '8px',
              color: theme.colors.text,
              fontSize: '14px',
              fontWeight: 500,
            }}>
              用户名
            </label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
              className="romantic-input"
              placeholder="请输入用户名"
            />
          </motion.div>

          <motion.div
            initial={{ x: -20, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: 0.4 }}
            style={{ marginBottom: '24px' }}
          >
            <label style={{
              display: 'block',
              marginBottom: '8px',
              color: theme.colors.text,
              fontSize: '14px',
              fontWeight: 500,
            }}>
              密码
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="romantic-input"
              placeholder="请输入密码"
            />
          </motion.div>

          {error && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              style={{
                padding: '12px 16px',
                backgroundColor: 'rgba(255, 107, 157, 0.1)',
                color: theme.colors.primary,
                borderRadius: theme.borderRadius.medium,
                marginBottom: '20px',
                fontSize: '14px',
                border: `1px solid ${theme.colors.primary}`,
              }}
            >
              {error}
            </motion.div>
          )}

          <motion.button
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.5 }}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            type="submit"
            disabled={loading}
            className="romantic-button"
            style={{
              width: '100%',
              padding: '14px',
              fontSize: '16px',
            }}
          >
            {loading ? '登录中...' : '登录 💖'}
          </motion.button>
        </form>
      </motion.div>
    </div>
  );
}
