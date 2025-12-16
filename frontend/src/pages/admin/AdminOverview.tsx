import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Layout from '../../components/Layout';
import { adminApi, Overview } from '../../api/admin';

export default function AdminOverview() {
  const navigate = useNavigate();
  const [overview, setOverview] = useState<Overview | null>(null);
  const [loading, setLoading] = useState(false);

  const loadOverview = async () => {
    setLoading(true);
    try {
      const data = await adminApi.getOverview();
      setOverview(data);
    } catch (err: any) {
      alert(err.response?.data?.detail || '加载失败');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadOverview();
  }, []);

  if (loading) return <Layout role="ADMIN"><p>加载中...</p></Layout>;
  if (!overview) return <Layout role="ADMIN"><p>暂无数据</p></Layout>;

  return (
    <Layout role="ADMIN">
      <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
        <h1 style={{ marginBottom: '30px' }}>概览</h1>

        {/* Stats Grid */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
          gap: '20px',
          marginBottom: '30px'
        }}>
          <StatCard
            title="待办总数"
            value={overview.todo_total}
            subtitle={`未完成: ${overview.todo_open}`}
            color="#3498db"
          />
          <StatCard
            title="留言总数"
            value={overview.message_total}
            color="#9b59b6"
          />
          <StatCard
            title="API 调用（今日）"
            value={overview.external_call_today}
            subtitle={`最近7天: ${overview.external_call_last_7d}`}
            color="#e67e22"
          />
          <div onClick={() => {
            console.log('[AdminOverview] Navigating to /admin/photos');
            navigate('/admin/photos');
          }} style={{ cursor: 'pointer' }}>
            <StatCard
              title="待审核照片"
              value={overview.pending_photos}
              color="#e74c3c"
            />
          </div>
        </div>

        {/* Recent Actions */}
        <div style={{
          backgroundColor: 'white',
          padding: '20px',
          borderRadius: '8px',
          boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
        }}>
          <h2 style={{ marginTop: 0, marginBottom: '20px' }}>最近操作</h2>
          
          {overview.last_actions.length === 0 ? (
            <p style={{ color: '#999' }}>暂无操作记录</p>
          ) : (
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ borderBottom: '2px solid #ecf0f1' }}>
                  <th style={{ padding: '12px', textAlign: 'left' }}>操作</th>
                  <th style={{ padding: '12px', textAlign: 'left' }}>资源类型</th>
                  <th style={{ padding: '12px', textAlign: 'left' }}>时间</th>
                </tr>
              </thead>
              <tbody>
                {overview.last_actions.map((action) => (
                  <tr key={action.id} style={{ borderBottom: '1px solid #ecf0f1' }}>
                    <td style={{ padding: '12px' }}>
                      <span style={{
                        padding: '4px 8px',
                        backgroundColor: getActionColor(action.action),
                        color: 'white',
                        borderRadius: '4px',
                        fontSize: '12px'
                      }}>
                        {action.action}
                      </span>
                    </td>
                    <td style={{ padding: '12px', color: '#666' }}>
                      {action.resource_type}
                    </td>
                    <td style={{ padding: '12px', color: '#999', fontSize: '14px' }}>
                      {new Date(action.created_at).toLocaleString('zh-CN')}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </Layout>
  );
}

function StatCard({ title, value, subtitle, color }: {
  title: string;
  value: number;
  subtitle?: string;
  color: string;
}) {
  return (
    <div style={{
      backgroundColor: 'white',
      padding: '20px',
      borderRadius: '8px',
      boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
      borderLeft: `4px solid ${color}`
    }}>
      <div style={{ fontSize: '14px', color: '#999', marginBottom: '8px' }}>
        {title}
      </div>
      <div style={{ fontSize: '32px', fontWeight: 'bold', color: '#2c3e50', marginBottom: '4px' }}>
        {value}
      </div>
      {subtitle && (
        <div style={{ fontSize: '12px', color: '#666' }}>
          {subtitle}
        </div>
      )}
    </div>
  );
}

function getActionColor(action: string): string {
  const colors: Record<string, string> = {
    LOGIN: '#3498db',
    TODO_CREATE: '#2ecc71',
    TODO_UPDATE: '#f39c12',
    TODO_DELETE: '#e74c3c',
    MESSAGE_CREATE: '#9b59b6',
    MESSAGE_DELETE: '#e74c3c',
    EXTERNAL_CALL: '#e67e22',
    PICTURE_VIEW: '#1abc9c',
  };
  return colors[action] || '#95a5a6';
}
