import { ReactNode } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

interface LayoutProps {
  children: ReactNode;
  role: 'ADMIN' | 'FRIEND';
}

export default function Layout({ children, role }: LayoutProps) {
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('role');
    navigate('/login');
  };

  const menuItems = role === 'ADMIN' ? [
    { path: '/admin/overview', label: '概览' },
    { path: '/admin/audit', label: '审计日志' },
    { path: '/admin/friend-todos', label: '朋友的待办' },
    { path: '/admin/friend-messages', label: '留言墙' },
  ] : [
    { path: '/app/countdown', label: '纪念日' },
    { path: '/app/pictures', label: '照片' },
    { path: '/app/messages', label: '留言墙' },
    { path: '/app/todos', label: '待办事项' },
  ];

  return (
    <div style={{ display: 'flex', height: '100vh', overflow: 'hidden', fontFamily: 'sans-serif' }}>
      {/* Sidebar */}
      <div style={{
        width: '260px',
        backgroundColor: 'rgba(20, 30, 48, 0.7)',
        backdropFilter: 'blur(20px)',
        color: 'white',
        padding: '30px 20px',
        display: 'flex',
        flexDirection: 'column',
        borderRight: '1px solid rgba(255, 255, 255, 0.1)',
        boxShadow: '5px 0 15px rgba(0,0,0,0.2)',
        zIndex: 10,
        flexShrink: 0
      }}>
        <div style={{ marginBottom: '40px', textAlign: 'center' }}>
          <div style={{ 
            fontSize: '40px', 
            marginBottom: '10px',
            filter: 'drop-shadow(0 0 10px rgba(255, 105, 180, 0.6))'
          }}>
            💖
          </div>
          <h2 style={{ 
            fontSize: '24px', 
            fontWeight: 'bold',
            background: 'linear-gradient(to right, #ff9a9e, #fecfef)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            letterSpacing: '1px'
          }}>
            {role === 'ADMIN' ? '管理后台' : '我们的空间'}
          </h2>
        </div>
        
        <nav style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '10px' }}>
          {menuItems.map(item => (
            <div
              key={item.path}
              onClick={() => navigate(item.path)}
              style={{
                padding: '15px 20px',
                borderRadius: '12px',
                cursor: 'pointer',
                backgroundColor: location.pathname === item.path ? 'rgba(255, 105, 180, 0.25)' : 'transparent',
                color: location.pathname === item.path ? '#fff' : 'rgba(255,255,255,0.7)',
                transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                border: location.pathname === item.path ? '1px solid rgba(255, 105, 180, 0.5)' : '1px solid transparent',
                display: 'flex',
                alignItems: 'center',
                fontSize: '16px',
                fontWeight: location.pathname === item.path ? 'bold' : 'normal',
                boxShadow: location.pathname === item.path ? '0 4px 12px rgba(255, 105, 180, 0.2)' : 'none',
              }}
              onMouseEnter={(e) => {
                if (location.pathname !== item.path) {
                  e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.08)';
                  e.currentTarget.style.color = '#fff';
                  e.currentTarget.style.transform = 'translateX(5px)';
                }
              }}
              onMouseLeave={(e) => {
                if (location.pathname !== item.path) {
                  e.currentTarget.style.backgroundColor = 'transparent';
                  e.currentTarget.style.color = 'rgba(255,255,255,0.7)';
                  e.currentTarget.style.transform = 'translateX(0)';
                }
              }}
            >
              {item.label}
            </div>
          ))}
        </nav>

        <button
          onClick={handleLogout}
          style={{
            marginTop: '20px',
            padding: '15px',
            backgroundColor: 'rgba(255, 255, 255, 0.05)',
            color: 'rgba(255, 255, 255, 0.8)',
            border: '1px solid rgba(255, 255, 255, 0.1)',
            borderRadius: '12px',
            cursor: 'pointer',
            fontSize: '14px',
            backdropFilter: 'blur(4px)',
            transition: 'all 0.3s ease',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '8px'
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.backgroundColor = 'rgba(231, 76, 60, 0.8)';
            e.currentTarget.style.color = 'white';
            e.currentTarget.style.borderColor = 'transparent';
            e.currentTarget.style.boxShadow = '0 4px 12px rgba(231, 76, 60, 0.3)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.05)';
            e.currentTarget.style.color = 'rgba(255, 255, 255, 0.8)';
            e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.1)';
            e.currentTarget.style.boxShadow = 'none';
          }}
        >
          <span>🚪</span> 退出登录
        </button>
      </div>

      {/* Main content */}
      <div style={{
        flex: 1,
        padding: '40px',
        backgroundColor: 'transparent',
        overflowY: 'auto',
        height: '100%',
        position: 'relative'
      }}>
        {children}
      </div>
    </div>
  );
}
