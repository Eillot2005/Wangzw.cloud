import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Layout from '../../components/Layout';
import ParticlesBackground from '../../components/ParticlesBackground';
import EasterEgg from '../../components/EasterEgg';
import { messagesApi, Message } from '../../api/messages';
import { theme } from '../../styles/theme';

export default function MessagesPage() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [newContent, setNewContent] = useState('');
  const [loading, setLoading] = useState(false);
  const [showEasterEgg, setShowEasterEgg] = useState(false);
  const currentUser = localStorage.getItem('username') || '';

  const loadMessages = async () => {
    setLoading(true);
    try {
      const data = await messagesApi.list();
      setMessages(data.reverse()); // 最新的在底部
    } catch (err: any) {
      alert(err.response?.data?.detail || '加载失败');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadMessages();
    messagesApi.markRead();
  }, []);

  const handleCreate = async () => {
    if (!newContent.trim()) return;
    if (newContent.length > 1000) {
      alert('留言最多1000字');
      return;
    }
    try {
      // 检查是否包含love关键词
      const hasLove = newContent.toLowerCase().includes('love');
      
      await messagesApi.create({ content: newContent });
      setNewContent('');
      await loadMessages();
      
      // 如果包含love，在消息加载完成后触发彩蛋
      if (hasLove) {
        console.log('[MessagesPage] Love keyword detected, triggering easter egg');
        setTimeout(() => setShowEasterEgg(true), 100);
      }
    } catch (err: any) {
      alert(err.response?.data?.detail || '发送失败');
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm('确定删除这条留言吗？')) return;
    try {
      await messagesApi.delete(id);
      loadMessages();
    } catch (err: any) {
      alert(err.response?.data?.detail || '删除失败');
    }
  };

  const isFromAdmin = (senderUsername: string) => {
    return senderUsername === 'admin';
  };

  return (
    <Layout role="FRIEND">
      <ParticlesBackground />
      <EasterEgg show={showEasterEgg} onComplete={() => setShowEasterEgg(false)} />
      <div style={{
        maxWidth: '900px',
        margin: '0 auto',
        position: 'relative',
        zIndex: 1,
      }}>
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <h1 style={{
            marginBottom: '30px',
            textAlign: 'center',
            fontSize: '32px',
            background: theme.colors.gradientPink,
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text',
          }}>
            <span className="heart-icon">❤</span> 爱的留言墙 <span className="heart-icon">❤</span>
          </h1>
        </motion.div>

        {/* Messages container */}
        <div style={{
          background: theme.colors.card,
          borderRadius: theme.borderRadius.large,
          padding: '24px',
          marginBottom: '20px',
          boxShadow: theme.colors.shadow,
          minHeight: '500px',
          maxHeight: '600px',
          overflowY: 'auto',
          border: `1px solid ${theme.colors.border}`,
        }}>
          {loading ? (
            <div style={{ textAlign: 'center', padding: '40px', color: theme.colors.textSecondary }}>
              加载中...
            </div>
          ) : messages.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '40px', color: theme.colors.textSecondary }}>
              还没有留言，快来写第一条吧~ 💕
            </div>
          ) : (
            <AnimatePresence>
              {messages.map((msg, index) => {
                const fromAdmin = isFromAdmin(msg.sender_username);
                const isCurrentUser = msg.sender_username === currentUser;
                
                return (
                  <motion.div
                    key={msg.id}
                    initial={{ opacity: 0, x: fromAdmin ? 50 : -50 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, scale: 0.8 }}
                    transition={{ delay: index * 0.05 }}
                    style={{
                      display: 'flex',
                      justifyContent: fromAdmin ? 'flex-end' : 'flex-start',
                      marginBottom: '20px',
                    }}
                  >
                    <div style={{
                      maxWidth: '70%',
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: fromAdmin ? 'flex-end' : 'flex-start',
                    }}>
                      {/* Sender name */}
                      <div style={{
                        fontSize: '12px',
                        color: theme.colors.textSecondary,
                        marginBottom: '4px',
                        paddingLeft: fromAdmin ? '0' : '12px',
                        paddingRight: fromAdmin ? '12px' : '0',
                      }}>
                        {msg.sender_username}
                      </div>

                      {/* Message bubble */}
                      <div style={{
                        background: fromAdmin 
                          ? theme.colors.gradientPink 
                          : 'rgba(255, 255, 255, 0.08)',
                        color: '#fff',
                        padding: '12px 16px',
                        borderRadius: fromAdmin 
                          ? '16px 16px 4px 16px' 
                          : '16px 16px 16px 4px',
                        boxShadow: fromAdmin 
                          ? '0 4px 15px rgba(255, 107, 157, 0.4)' 
                          : '0 4px 15px rgba(0, 0, 0, 0.2)',
                        position: 'relative',
                        wordBreak: 'break-word',
                      }}>
                        <div style={{ fontSize: '14px', lineHeight: '1.6' }}>
                          {msg.content}
                        </div>

                        {/* Delete button for current user's messages */}
                        {isCurrentUser && (
                          <button
                            onClick={() => handleDelete(msg.id)}
                            style={{
                              position: 'absolute',
                              top: '-8px',
                              right: '-8px',
                              background: 'rgba(0, 0, 0, 0.6)',
                              color: '#fff',
                              border: 'none',
                              borderRadius: '50%',
                              width: '20px',
                              height: '20px',
                              fontSize: '12px',
                              cursor: 'pointer',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                            }}
                          >
                            ×
                          </button>
                        )}
                      </div>

                      {/* Timestamp */}
                      <div style={{
                        fontSize: '11px',
                        color: theme.colors.textSecondary,
                        marginTop: '4px',
                        paddingLeft: fromAdmin ? '0' : '12px',
                        paddingRight: fromAdmin ? '12px' : '0',
                      }}>
                        {new Date(msg.created_at + 'Z').toLocaleString('zh-CN', {
                          year: 'numeric',
                          month: '2-digit',
                          day: '2-digit',
                          hour: '2-digit',
                          minute: '2-digit',
                          second: '2-digit',
                          hour12: false
                        })}
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </AnimatePresence>
          )}
        </div>

        {/* Input area */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          style={{
            background: theme.colors.card,
            padding: '20px',
            borderRadius: theme.borderRadius.large,
            boxShadow: theme.colors.shadow,
            border: `1px solid ${theme.colors.border}`,
          }}
        >
          <textarea
            value={newContent}
            onChange={(e) => setNewContent(e.target.value)}
            placeholder="写下你的心里话... 💌"
            className="romantic-input"
            rows={3}
            style={{
              marginBottom: '12px',
              resize: 'none',
            }}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && e.ctrlKey) {
                handleCreate();
              }
            }}
          />
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontSize: '12px', color: theme.colors.textSecondary }}>
              {newContent.length}/1000 字 • Ctrl+Enter 发送
            </span>
            <button
              onClick={handleCreate}
              disabled={!newContent.trim()}
              className="romantic-button"
              style={{ minWidth: '120px' }}
            >
              发送 💕
            </button>
          </div>
        </motion.div>
      </div>
    </Layout>
  );
}
