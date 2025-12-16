import { useState, useEffect } from 'react';
import Layout from '../../components/Layout';
import { adminApi } from '../../api/admin';
import { Todo } from '../../api/todos';

export default function FriendTodosPage() {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [loading, setLoading] = useState(false);

  const loadTodos = async () => {
    setLoading(true);
    try {
      const data = await adminApi.getFriendTodos();
      setTodos(data);
    } catch (err: any) {
      alert(err.response?.data?.detail || '加载失败');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadTodos();
  }, []);

  const handleDelete = async (id: number) => {
    if (!confirm('确定删除朋友的这条待办吗？')) return;
    try {
      await adminApi.deleteFriendTodo(id);
      loadTodos();
    } catch (err: any) {
      alert(err.response?.data?.detail || '删除失败');
    }
  };

  return (
    <Layout role="ADMIN">
      <div style={{ maxWidth: '1000px', margin: '0 auto' }}>
        <h1 style={{ marginBottom: '30px' }}>朋友的待办事项</h1>

        {loading && <p>加载中...</p>}

        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
          {todos.map((todo) => (
            <div
              key={todo.id}
              style={{
                backgroundColor: 'white',
                padding: '16px',
                borderRadius: '8px',
                boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
                display: 'flex',
                alignItems: 'center',
                gap: '12px'
              }}
            >
              <input
                type="checkbox"
                checked={todo.done}
                disabled
                style={{ width: '18px', height: '18px' }}
              />

              <div style={{ flex: 1 }}>
                <div
                  style={{
                    fontSize: '16px',
                    textDecoration: todo.done ? 'line-through' : 'none',
                    color: todo.done ? '#999' : '#333',
                    marginBottom: '4px'
                  }}
                >
                  {todo.title}
                </div>
                <div style={{ fontSize: '12px', color: '#999' }}>
                  创建于: {new Date(todo.created_at).toLocaleString('zh-CN')}
                  {todo.updated_at !== todo.created_at && (
                    <span> | 更新于: {new Date(todo.updated_at).toLocaleString('zh-CN')}</span>
                  )}
                </div>
              </div>

              <button
                onClick={() => handleDelete(todo.id)}
                style={{
                  padding: '8px 16px',
                  backgroundColor: '#e74c3c',
                  color: 'white',
                  border: 'none',
                  borderRadius: '4px',
                  cursor: 'pointer',
                  fontSize: '14px'
                }}
              >
                删除
              </button>
            </div>
          ))}
        </div>

        {!loading && todos.length === 0 && (
          <div style={{
            backgroundColor: 'white',
            padding: '40px',
            borderRadius: '8px',
            textAlign: 'center',
            color: '#999'
          }}>
            朋友还没有待办事项
          </div>
        )}
      </div>
    </Layout>
  );
}
