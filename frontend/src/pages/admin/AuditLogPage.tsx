import { useState, useEffect } from 'react';
import Layout from '../../components/Layout';
import { adminApi, AuditLog } from '../../api/admin';

export default function AuditLogPage() {
  const [logs, setLogs] = useState<AuditLog[]>([]);
  const [loading, setLoading] = useState(false);
  const [actionFilter, setActionFilter] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');

  const loadLogs = async () => {
    setLoading(true);
    try {
      const params: any = {};
      if (actionFilter) params.action = actionFilter;
      if (startDate) params.start_date = startDate;
      if (endDate) params.end_date = endDate;
      
      const data = await adminApi.getAuditLogs(params);
      setLogs(data);
    } catch (err: any) {
      alert(err.response?.data?.detail || '加载失败');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadLogs();
  }, []);

  const actions = [
    'LOGIN',
    'TODO_CREATE',
    'TODO_UPDATE',
    'TODO_DELETE',
    'MESSAGE_CREATE',
    'MESSAGE_DELETE',
    'EXTERNAL_CALL',
    'PICTURE_VIEW'
  ];

  return (
    <Layout role="ADMIN">
      <div style={{ maxWidth: '1400px', margin: '0 auto' }}>
        <h1 style={{ marginBottom: '30px' }}>审计日志</h1>

        {/* Filters */}
        <div style={{
          backgroundColor: 'white',
          padding: '20px',
          borderRadius: '8px',
          marginBottom: '20px',
          boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
        }}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '15px' }}>
            <div>
              <label style={{ display: 'block', marginBottom: '8px', fontSize: '14px', color: '#666' }}>
                操作类型
              </label>
              <select
                value={actionFilter}
                onChange={(e) => setActionFilter(e.target.value)}
                style={{
                  width: '100%',
                  padding: '10px',
                  border: '1px solid #ddd',
                  borderRadius: '4px',
                  fontSize: '14px'
                }}
              >
                <option value="">全部</option>
                {actions.map(action => (
                  <option key={action} value={action}>{action}</option>
                ))}
              </select>
            </div>

            <div>
              <label style={{ display: 'block', marginBottom: '8px', fontSize: '14px', color: '#666' }}>
                开始日期
              </label>
              <input
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                style={{
                  width: '100%',
                  padding: '10px',
                  border: '1px solid #ddd',
                  borderRadius: '4px',
                  fontSize: '14px'
                }}
              />
            </div>

            <div>
              <label style={{ display: 'block', marginBottom: '8px', fontSize: '14px', color: '#666' }}>
                结束日期
              </label>
              <input
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                style={{
                  width: '100%',
                  padding: '10px',
                  border: '1px solid #ddd',
                  borderRadius: '4px',
                  fontSize: '14px'
                }}
              />
            </div>

            <div style={{ display: 'flex', alignItems: 'flex-end' }}>
              <button
                onClick={loadLogs}
                style={{
                  width: '100%',
                  padding: '10px',
                  backgroundColor: '#3498db',
                  color: 'white',
                  border: 'none',
                  borderRadius: '4px',
                  cursor: 'pointer',
                  fontSize: '14px'
                }}
              >
                筛选
              </button>
            </div>
          </div>
        </div>

        {/* Logs Table */}
        {loading && <p>加载中...</p>}
        
        <div style={{
          backgroundColor: 'white',
          borderRadius: '8px',
          boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
          overflowX: 'auto'
        }}>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ backgroundColor: '#f8f9fa', borderBottom: '2px solid #ecf0f1' }}>
                <th style={{ padding: '12px', textAlign: 'left' }}>ID</th>
                <th style={{ padding: '12px', textAlign: 'left' }}>用户</th>
                <th style={{ padding: '12px', textAlign: 'left' }}>操作</th>
                <th style={{ padding: '12px', textAlign: 'left' }}>资源类型</th>
                <th style={{ padding: '12px', textAlign: 'left' }}>资源ID</th>
                <th style={{ padding: '12px', textAlign: 'left' }}>元数据</th>
                <th style={{ padding: '12px', textAlign: 'left' }}>时间</th>
              </tr>
            </thead>
            <tbody>
              {logs.map((log) => (
                <tr key={log.id} style={{ borderBottom: '1px solid #ecf0f1' }}>
                  <td style={{ padding: '12px' }}>{log.id}</td>
                  <td style={{ padding: '12px' }}>
                    <span style={{
                      padding: '4px 8px',
                      backgroundColor: log.username === 'admin' ? '#3498db' : '#2ecc71',
                      color: 'white',
                      borderRadius: '4px',
                      fontSize: '12px'
                    }}>
                      {log.username}
                    </span>
                  </td>
                  <td style={{ padding: '12px' }}>
                    <span style={{
                      padding: '4px 8px',
                      backgroundColor: getActionColor(log.action),
                      color: 'white',
                      borderRadius: '4px',
                      fontSize: '12px'
                    }}>
                      {log.action}
                    </span>
                  </td>
                  <td style={{ padding: '12px', color: '#666' }}>{log.resource_type}</td>
                  <td style={{ padding: '12px', color: '#666', fontSize: '12px' }}>
                    {log.resource_id || '-'}
                  </td>
                  <td style={{ padding: '12px', fontSize: '12px', color: '#999', maxWidth: '200px' }}>
                    {log.meta_json ? JSON.stringify(log.meta_json).substring(0, 100) : '-'}
                  </td>
                  <td style={{ padding: '12px', fontSize: '12px', color: '#999', whiteSpace: 'nowrap' }}>
                    {new Date(log.created_at).toLocaleString('zh-CN')}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {!loading && logs.length === 0 && (
            <div style={{ padding: '40px', textAlign: 'center', color: '#999' }}>
              暂无日志
            </div>
          )}
        </div>
      </div>
    </Layout>
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
